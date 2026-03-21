/**
 * Accuracy test: extract all digit crops and classify with ONNX MNIST.
 * Ground truth: digits 0-9 cycling, one per box, left-to-right, top-to-bottom.
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const TEST_IMAGE = resolve('/workspaces/formVerify/data/test-images/20260321_172751.jpg');
const OUTPUT_DIR = '/workspaces/formVerify/data/test-output';
mkdirSync(OUTPUT_DIR, { recursive: true });

const COLUMNS = [
  '90L RUC', '7.6L Sharps', '20L Sharps', '25L Sharps',
  '2.5L Specibin', '5L Specibin', '10L Specibin', '20L Specibin',
  '25L Specibin', 'Pharma 5L', 'Pharma 20L', '50L Box', '142L Box', 'Other',
];
const ROWS = ['received', 'gross_kg', 'nett_kg'];
const COL_X = [0.0409,0.1109,0.181,0.2511,0.3211,0.3912,0.4613,0.5313,0.6014,0.6714,0.7415,0.8116,0.8816,0.9517];
const ROW_Y = [0.1485, 0.1822, 0.2145];
const BOX_W = 0.0143, BOX_H = 0.0308;
const DIGIT_STRIDE = 0.0159, DECIMAL_STRIDE = 0.0085;
const IMG_W = 2339, IMG_H = 1654;
const MARGIN = 0.6;

function generateGroundTruth() {
  let counter = 0;
  const next = () => (counter++) % 10;
  const truth = [];
  for (const row of ROWS) {
    const isKG = row !== 'received';
    for (const col of COLUMNS) {
      const n = isKG ? 4 : 3;
      for (let di = 0; di < n; di++) {
        truth.push({ row, col, digitIndex: di, expected: next() });
      }
    }
  }
  return truth;
}

async function run() {
  const groundTruth = generateGroundTruth();
  console.log(`Ground truth: ${groundTruth.length} digits`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('pageerror', err => console.log(`[ERROR] ${err.message}`));

  // Load OpenCV
  await page.goto('about:blank');
  await page.addScriptTag({ path: '/workspaces/formVerify/public/opencv.js' });
  await page.evaluate(() => new Promise(resolve => {
    const cv = window.cv;
    if (cv && typeof cv.then === 'function') cv.then(r => { delete r.then; window.cv = r; resolve(); });
    else if (cv?.Mat) resolve();
  }));

  // Load ONNX Runtime
  await page.addScriptTag({ path: '/workspaces/formVerify/node_modules/onnxruntime-web/dist/ort.min.js' });
  await page.evaluate(() => {
    window.ort = globalThis.ort;
  });

  // Load and correct image
  const imgBase64 = readFileSync(TEST_IMAGE).toString('base64');
  await page.evaluate(async (b64) => {
    const cv = window.cv;
    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = 'data:image/jpeg;base64,' + b64; });
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    const src = cv.matFromImageData(c.getContext('2d').getImageData(0,0,c.width,c.height));
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    const dict = cv.getPredefinedDictionary(cv.DICT_4X4_50);
    const params = new cv.aruco_DetectorParameters();
    const refine = new cv.aruco_RefineParameters(10, 3, true);
    const det = new cv.aruco_ArucoDetector(dict, params, refine);
    const corners = new cv.MatVector(); const ids = new cv.Mat(); const rej = new cv.MatVector();
    det.detectMarkers(gray, corners, ids, rej);
    const markers = {};
    for (let i = 0; i < ids.rows; i++) {
      const id = ids.intAt(i,0); const co = corners.get(i);
      const pts = []; for (let j=0;j<4;j++) pts.push({x:co.floatAt(0,j*2),y:co.floatAt(0,j*2+1)});
      co.delete(); markers[id] = pts;
    }
    corners.delete();ids.delete();rej.delete();det.delete();refine.delete();params.delete();dict.delete();gray.delete();
    const ci = [2,3,0,1];
    const tl=markers[0][ci[0]],tr=markers[1][ci[1]],br=markers[2][ci[2]],bl=markers[3][ci[3]];
    const W=2339,H=1654;
    const sp=cv.matFromArray(4,1,cv.CV_32FC2,[tl.x,tl.y,tr.x,tr.y,br.x,br.y,bl.x,bl.y]);
    const dp=cv.matFromArray(4,1,cv.CV_32FC2,[0,0,W,0,W,H,0,H]);
    const M=cv.getPerspectiveTransform(sp,dp);
    const corrected=new cv.Mat();
    cv.warpPerspective(src,corrected,M,new cv.Size(W,H));
    sp.delete();dp.delete();M.delete();src.delete();
    window.__corrected = corrected;
  }, imgBase64);
  console.log('Image corrected.');

  // Init Tesseract
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js' });
  await page.evaluate(async () => {
    const w = await Tesseract.createWorker('eng', undefined, {
      workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
      corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core-simd-lstm.wasm.js',
    });
    await w.setParameters({
      tessedit_char_whitelist: '0123456789',
      tessedit_pageseg_mode: '10', // SINGLE_CHAR
    });
    window.__tesseract = w;
  });
  console.log('Tesseract loaded.');

  // Process each digit
  const results = [];
  for (let i = 0; i < groundTruth.length; i++) {
    const gt = groundTruth[i];
    const row = ROWS.indexOf(gt.row);
    const col = COLUMNS.indexOf(gt.col);
    const isKG = gt.row !== 'received';

    let xOffset = gt.digitIndex * DIGIT_STRIDE;
    if (isKG && gt.digitIndex >= 3) {
      xOffset = 2 * DIGIT_STRIDE + DECIMAL_STRIDE + (gt.digitIndex - 3) * DIGIT_STRIDE;
    }
    const bx = COL_X[col] + xOffset;
    const by = ROW_Y[row];

    const classified = await page.evaluate(async ({ bx, by, bw, bh, W, H, margin }) => {
      const cv = window.cv;
      const corrected = window.__corrected;

      const nomX=bx*W, nomY=by*H, nomW=bw*W, nomH=bh*H;
      const mx=nomW*margin, my=nomH*margin;
      const sx=Math.max(0,Math.round(nomX-mx)), sy=Math.max(0,Math.round(nomY-my));
      const sw=Math.min(Math.round(nomW+2*mx),W-sx), sh=Math.min(Math.round(nomH+2*my),H-sy);
      const searchROI = corrected.roi(new cv.Rect(sx,sy,sw,sh));

      // Crop center (nominal area with small margin)
      const cx=Math.round(mx*0.5), cy=Math.round(my*0.5);
      const cw=Math.min(Math.round(nomW+mx),sw-cx), ch=Math.min(Math.round(nomH+my),sh-cy);
      const crop = searchROI.roi(new cv.Rect(cx,cy,cw,ch));

      // Grayscale → inset → resize → percentile normalize (no binarization)
      const gray = new cv.Mat();
      cv.cvtColor(crop, gray, cv.COLOR_RGBA2GRAY);

      const inX=Math.max(4,Math.round(gray.cols*0.30));
      const inY=Math.max(4,Math.round(gray.rows*0.20));
      // Inset grayscale crop for Tesseract
      const inROI2=gray.roi(new cv.Rect(inX,inY,Math.max(4,gray.cols-2*inX),Math.max(4,gray.rows-2*inY)));
      const tc=document.createElement('canvas');tc.width=inROI2.cols;tc.height=inROI2.rows;
      cv.imshow(tc,inROI2);inROI2.delete();gray.delete();
      crop.delete();searchROI.delete();

      const w=window.__tesseract;
      const {data}=await w.recognize(tc);
      const text=data.text.trim();
      const digit=text.length>0?parseInt(text[0],10):NaN;
      return {digit:isNaN(digit)?-1:digit,confidence:data.confidence.toFixed(1)};
    }, { bx, by, bw: BOX_W, bh: BOX_H, W: IMG_W, H: IMG_H, margin: MARGIN });

    const correct = classified.digit === gt.expected;
    results.push({ ...gt, predicted: classified.digit, confidence: classified.confidence, correct });

    if (i % 20 === 0) process.stdout.write(`\r  Processing digit ${i+1}/${groundTruth.length}...`);
  }

  await page.evaluate(() => { window.__corrected.delete(); });
  await browser.close();

  // Analyze results
  const totalCorrect = results.filter(r => r.correct).length;
  const accuracy = (totalCorrect / results.length * 100).toFixed(1);

  console.log(`\n\n=== ACCURACY: ${totalCorrect}/${results.length} (${accuracy}%) ===\n`);

  // Show errors
  const errors = results.filter(r => !r.correct);
  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):`);
    for (const e of errors) {
      console.log(`  ${e.row}/${e.col}/d${e.digitIndex}: expected ${e.expected}, got ${e.predicted} (conf ${e.confidence}%)`);
    }
  }

  // Per-digit accuracy
  console.log('\nPer-digit accuracy:');
  for (let d = 0; d < 10; d++) {
    const ofDigit = results.filter(r => r.expected === d);
    const correctOfDigit = ofDigit.filter(r => r.correct).length;
    const pct = (correctOfDigit / ofDigit.length * 100).toFixed(0);
    const misclass = ofDigit.filter(r => !r.correct).map(r => r.predicted);
    console.log(`  ${d}: ${correctOfDigit}/${ofDigit.length} (${pct}%)${misclass.length ? ' → misclassified as: ' + misclass.join(',') : ''}`);
  }

  // Per-row accuracy
  console.log('\nPer-row accuracy:');
  for (const row of ROWS) {
    const ofRow = results.filter(r => r.row === row);
    const correctOfRow = ofRow.filter(r => r.correct).length;
    console.log(`  ${row}: ${correctOfRow}/${ofRow.length} (${(correctOfRow/ofRow.length*100).toFixed(0)}%)`);
  }

  writeFileSync(`${OUTPUT_DIR}/accuracy-results.json`, JSON.stringify(results, null, 2));
  console.log(`\nFull results saved to ${OUTPUT_DIR}/accuracy-results.json`);
}

run().catch(err => { console.error(err); process.exit(1); });
