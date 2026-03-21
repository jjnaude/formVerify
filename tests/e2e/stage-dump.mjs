/**
 * Dump every pipeline stage for every digit to individual PNGs.
 * Naming: digit<NNN>_stage<MM>_expected<D>.png
 *
 * Stages:
 * 01 - Raw search region (oversized crop around expected position)
 * 02 - Nominal crop (center portion of search region, approximate box location)
 * 03 - Grayscale of nominal crop
 * 04 - Otsu threshold (BINARY_INV: ink=white, paper=black)
 * 05 - After inset (30%/20% border removal)
 * 06 - After Gaussian blur (stroke thickening)
 * 07 - Resized to 20x20 (preserving aspect ratio)
 * 08 - Final 28x28 MNIST input (centered, percentile normalized, 10x scale)
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const TEST_IMAGE = '/workspaces/formVerify/data/test-images/20260321_172751.jpg';
const OUTPUT_DIR = '/workspaces/formVerify/data/test-output/stages';
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
  console.log(`Will dump ${groundTruth.length} digits × 8 stages = ${groundTruth.length * 8} images`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Load OpenCV
  await page.goto('about:blank');
  await page.addScriptTag({ path: '/workspaces/formVerify/public/opencv.js' });
  await page.evaluate(() => new Promise(r => {
    const cv = window.cv;
    if (cv && typeof cv.then === 'function') cv.then(c => { delete c.then; window.cv = c; r(); });
    else if (cv?.Mat) r();
  }));

  // Load and correct image
  const imgBase64 = readFileSync(TEST_IMAGE).toString('base64');
  await page.evaluate(async (b64) => {
    const cv = window.cv;
    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = 'data:image/jpeg;base64,' + b64; });
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    const src = cv.matFromImageData(c.getContext('2d').getImageData(0, 0, c.width, c.height));
    const gray = new cv.Mat(); cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    const dict = cv.getPredefinedDictionary(cv.DICT_4X4_50);
    const params = new cv.aruco_DetectorParameters();
    const refine = new cv.aruco_RefineParameters(10, 3, true);
    const det = new cv.aruco_ArucoDetector(dict, params, refine);
    const corners = new cv.MatVector(); const ids = new cv.Mat(); const rej = new cv.MatVector();
    det.detectMarkers(gray, corners, ids, rej);
    const markers = {};
    for (let i = 0; i < ids.rows; i++) {
      const id = ids.intAt(i, 0); const co = corners.get(i); const pts = [];
      for (let j = 0; j < 4; j++) pts.push({ x: co.floatAt(0, j*2), y: co.floatAt(0, j*2+1) });
      co.delete(); markers[id] = pts;
    }
    corners.delete(); ids.delete(); rej.delete(); det.delete(); refine.delete(); params.delete(); dict.delete(); gray.delete();
    const ci = [2,3,0,1];
    const tl=markers[0][ci[0]], tr=markers[1][ci[1]], br=markers[2][ci[2]], bl=markers[3][ci[3]];
    const W=2339, H=1654;
    const sp = cv.matFromArray(4,1,cv.CV_32FC2,[tl.x,tl.y,tr.x,tr.y,br.x,br.y,bl.x,bl.y]);
    const dp = cv.matFromArray(4,1,cv.CV_32FC2,[0,0,W,0,W,H,0,H]);
    const M = cv.getPerspectiveTransform(sp, dp);
    const corrected = new cv.Mat();
    cv.warpPerspective(src, corrected, M, new cv.Size(W, H));
    sp.delete(); dp.delete(); M.delete(); src.delete();
    window.__corrected = corrected;
  }, imgBase64);
  console.log('Image corrected.');

  // Process each digit — just first 20 for speed, or all 154
  const MAX_DIGITS = groundTruth.length; // process all
  for (let i = 0; i < Math.min(MAX_DIGITS, groundTruth.length); i++) {
    const gt = groundTruth[i];
    const ri = ROWS.indexOf(gt.row);
    const ci = COLUMNS.indexOf(gt.col);
    const isKG = gt.row !== 'received';

    let xOffset = gt.digitIndex * DIGIT_STRIDE;
    if (isKG && gt.digitIndex >= 3) {
      xOffset = 2 * DIGIT_STRIDE + DECIMAL_STRIDE + (gt.digitIndex - 3) * DIGIT_STRIDE;
    }
    const bx = COL_X[ci] + xOffset;
    const by = ROW_Y[ri];

    const stages = await page.evaluate(({ bx, by, bw, bh, W, H, margin }) => {
      const cv = window.cv;
      const corrected = window.__corrected;
      const results = {};

      function matToB64(mat) {
        const c = document.createElement('canvas');
        c.width = mat.cols; c.height = mat.rows;
        cv.imshow(c, mat);
        return c.toDataURL('image/png').split(',')[1];
      }

      function matToB64Scaled(mat, scale) {
        const c = document.createElement('canvas');
        c.width = mat.cols * scale; c.height = mat.rows * scale;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        const tmp = document.createElement('canvas');
        tmp.width = mat.cols; tmp.height = mat.rows;
        cv.imshow(tmp, mat);
        ctx.drawImage(tmp, 0, 0, c.width, c.height);
        return c.toDataURL('image/png').split(',')[1];
      }

      const nomX = bx*W, nomY = by*H, nomW = bw*W, nomH = bh*H;
      const mx = nomW*margin, my = nomH*margin;
      const sx = Math.max(0, Math.round(nomX-mx)), sy = Math.max(0, Math.round(nomY-my));
      const sw = Math.min(Math.round(nomW+2*mx), W-sx), sh = Math.min(Math.round(nomH+2*my), H-sy);

      // Stage 01: Raw search region
      const searchROI = corrected.roi(new cv.Rect(sx, sy, sw, sh));
      results.s01 = matToB64(searchROI);

      // Stage 02: Nominal crop (center of search region)
      const cx2 = Math.round(mx*0.5), cy2 = Math.round(my*0.5);
      const cw2 = Math.min(Math.round(nomW+mx), sw-cx2);
      const ch2 = Math.min(Math.round(nomH+my), sh-cy2);
      const crop = searchROI.roi(new cv.Rect(cx2, cy2, cw2, ch2));
      results.s02 = matToB64(crop);
      results.cropSize = crop.cols + 'x' + crop.rows;

      // Stage 03: Grayscale
      const gray = new cv.Mat();
      cv.cvtColor(crop, gray, cv.COLOR_RGBA2GRAY);
      results.s03 = matToB64(gray);

      // Stage 04: Otsu threshold BINARY_INV
      const binary = new cv.Mat();
      cv.threshold(gray, binary, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);
      results.s04 = matToB64(binary);

      // Stage 05: After inset (30%/20%)
      const inX = Math.max(4, Math.round(gray.cols * 0.30));
      const inY = Math.max(4, Math.round(gray.rows * 0.20));
      const iw = Math.max(4, gray.cols - 2*inX);
      const ih = Math.max(4, gray.rows - 2*inY);
      const insetGray = gray.roi(new cv.Rect(inX, inY, iw, ih));
      const insetBin = binary.roi(new cv.Rect(inX, inY, iw, ih));
      const insetCopy = new cv.Mat(); insetBin.copyTo(insetCopy);
      // Show inset on grayscale for visibility
      const insetGrayCopy = new cv.Mat(); insetGray.copyTo(insetGrayCopy);
      results.s05 = matToB64(insetGrayCopy);
      results.s05bin = matToB64(insetCopy);
      results.insetSize = iw + 'x' + ih;

      // Stage 06: Gaussian blur (on grayscale inset)
      const blurred = new cv.Mat();
      cv.GaussianBlur(insetGrayCopy, blurred, new cv.Size(3, 3), 0.8);
      results.s06 = matToB64(blurred);

      // Stage 07: Resized to fit 20x20
      const tgtSize = 20;
      const scale = Math.min(tgtSize / blurred.cols, tgtSize / blurred.rows);
      const nw = Math.max(1, Math.round(blurred.cols * scale));
      const nh = Math.max(1, Math.round(blurred.rows * scale));
      const resized = new cv.Mat();
      cv.resize(blurred, resized, new cv.Size(nw, nh), 0, 0, cv.INTER_AREA);
      results.s07 = matToB64Scaled(resized, 10); // 10x for visibility
      results.resizedSize = nw + 'x' + nh;

      // Stage 08: Final 28x28 MNIST input (percentile normalized)
      const vals = [];
      for (let y = 0; y < nh; y++) for (let x = 0; x < nw; x++) vals.push(resized.ucharAt(y, x));
      vals.sort((a,b) => a-b);
      const lo = vals[Math.floor(vals.length*0.05)];
      const hi = vals[Math.floor(vals.length*0.95)];
      const rng = hi - lo || 1;

      const input = new Float32Array(784);
      const ox = Math.round((28-nw)/2), oy = Math.round((28-nh)/2);
      for (let y = 0; y < nh; y++) for (let x = 0; x < nw; x++) {
        const v = resized.ucharAt(y, x);
        const idx = (oy+y)*28 + (ox+x);
        if (idx >= 0 && idx < 784) input[idx] = Math.max(0, Math.min(1, (hi-v)/rng));
      }

      // Render 28x28 at 10x scale
      const mc = document.createElement('canvas'); mc.width = 280; mc.height = 280;
      const mctx = mc.getContext('2d');
      mctx.fillStyle = 'black'; mctx.fillRect(0, 0, 280, 280);
      for (let y = 0; y < 28; y++) for (let x = 0; x < 28; x++) {
        const v = Math.round(input[y*28+x] * 255);
        if (v > 3) { mctx.fillStyle = `rgb(${v},${v},${v})`; mctx.fillRect(x*10, y*10, 10, 10); }
      }
      results.s08 = mc.toDataURL('image/png').split(',')[1];
      results.mnistMean = (input.reduce((a,b) => a+b, 0) / 784).toFixed(4);

      // Cleanup
      searchROI.delete(); crop.delete(); gray.delete(); binary.delete();
      insetGray.delete(); insetBin.delete(); insetCopy.delete(); insetGrayCopy.delete();
      blurred.delete(); resized.delete();

      return results;
    }, { bx, by, bw: BOX_W, bh: BOX_H, W: IMG_W, H: IMG_H, margin: MARGIN });

    // Save all stages
    const pad3 = String(i).padStart(3, '0');
    const exp = gt.expected;

    for (const [key, b64] of Object.entries(stages)) {
      if (typeof b64 === 'string' && b64.length > 100) { // skip non-image fields
        const stageNum = key.replace('s', '').replace('bin', 'b');
        const filename = `digit${pad3}_stage${stageNum}_expected${exp}.png`;
        writeFileSync(`${OUTPUT_DIR}/${filename}`, Buffer.from(b64, 'base64'));
      }
    }

    if (i % 20 === 0) {
      console.log(`  ${i+1}/${Math.min(MAX_DIGITS, groundTruth.length)} — ${gt.row}/${gt.col}/d${gt.digitIndex} (exp ${exp}) — crop ${stages.cropSize} → inset ${stages.insetSize} → resize ${stages.resizedSize} — mean ${stages.mnistMean}`);
    }
  }

  await page.evaluate(() => { window.__corrected.delete(); });
  await browser.close();
  console.log(`\nDone. ${Math.min(MAX_DIGITS, groundTruth.length) * 8} images saved to ${OUTPUT_DIR}/`);
}

run().catch(err => { console.error(err); process.exit(1); });
