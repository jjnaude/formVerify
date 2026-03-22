/**
 * Connected-component classification test.
 *
 * Uses column-based extraction to get digit crops, then:
 * 1. Binarize each crop (adaptive threshold)
 * 2. Find connected components
 * 3. If the digit's main component does NOT touch any edge → "isolated"
 * 4. Extract that component, center in 28×28, classify with ONNX MNIST
 * 5. Report: % isolated, accuracy on isolated subset, accuracy on all
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const TEST_IMAGE = '/workspaces/formVerify/data/test-images/20260321_172751.jpg';
const OUTPUT_DIR = '/workspaces/formVerify/data/test-output/cc';
mkdirSync(OUTPUT_DIR, { recursive: true });

const W = 2339, H = 1654;
const COLUMNS = [
  '90L RUC', '7.6L Sharps', '20L Sharps', '25L Sharps',
  '2.5L Specibin', '5L Specibin', '10L Specibin', '20L Specibin',
  '25L Specibin', 'Pharma 5L', 'Pharma 20L', '50L Box', '142L Box', 'Other',
];
const ROWS = ['received', 'gross_kg', 'nett_kg'];

// Calibrated constants
const BOX_W = 34, BOX_H = Math.round(0.0308 * H);
const DIGIT_STRIDE = 34, DECIMAL_GAP = 11;
const DECIMAL_STRIDE = BOX_W + DECIMAL_GAP;

// Ground truth: digits 0-9 cycling across all boxes
function generateGroundTruth() {
  let counter = 0;
  const next = () => (counter++) % 10;
  const truth = [];
  for (const row of ROWS) {
    const isKG = row !== 'received';
    for (const col of COLUMNS) {
      const n = isKG ? 4 : 3;
      for (let di = 0; di < n; di++) {
        const fieldId = `${row}_${col.replace(/[\s.]/g, '_')}`;
        truth.push({ row, col, digitIndex: di, expected: next(), cellId: `${fieldId}_d${di}` });
      }
    }
  }
  return truth;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('pageerror', e => console.log('[ERROR]', e.message));
await page.goto('about:blank');
await page.addScriptTag({ path: '/workspaces/formVerify/public/opencv.js' });
await page.evaluate(() => new Promise(r => {
  const cv = window.cv;
  if (cv?.then) cv.then(c => { delete c.then; window.cv = c; r(); }); else r();
}));

// Load ONNX Runtime + model
await page.addScriptTag({ path: '/workspaces/formVerify/node_modules/onnxruntime-web/dist/ort.min.js' });
await page.evaluate(async () => {
  const ort = globalThis.ort;
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1/dist/';
  window.__ort = ort;
});
// Load model from local file
const modelB64 = readFileSync('/workspaces/formVerify/public/models/mnist-8.onnx').toString('base64');
await page.evaluate(async (b64) => {
  const ort = window.__ort;
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  window.__session = await ort.InferenceSession.create(bytes.buffer, { executionProviders: ['wasm'] });
}, modelB64);
console.log('ONNX model loaded.');

// Load and correct image
const imgB64 = readFileSync(TEST_IMAGE).toString('base64');
await page.evaluate((b64) => {
  const cv = window.cv; const img = new Image();
  return new Promise(resolve => { img.onload = () => {
    const c = document.createElement('canvas'); c.width=img.width; c.height=img.height;
    c.getContext('2d').drawImage(img,0,0);
    const src = cv.matFromImageData(c.getContext('2d').getImageData(0,0,c.width,c.height));
    const g = new cv.Mat(); cv.cvtColor(src,g,cv.COLOR_RGBA2GRAY);
    const dict=cv.getPredefinedDictionary(cv.DICT_4X4_50);const params=new cv.aruco_DetectorParameters();
    const refine=new cv.aruco_RefineParameters(10,3,true);const det=new cv.aruco_ArucoDetector(dict,params,refine);
    const co=new cv.MatVector();const ids=new cv.Mat();const rej=new cv.MatVector();
    det.detectMarkers(g,co,ids,rej);
    const markers={};for(let i=0;i<ids.rows;i++){const id=ids.intAt(i,0);const c2=co.get(i);const pts=[];
    for(let j=0;j<4;j++)pts.push({x:c2.floatAt(0,j*2),y:c2.floatAt(0,j*2+1)});c2.delete();markers[id]=pts;}
    co.delete();ids.delete();rej.delete();det.delete();refine.delete();params.delete();dict.delete();g.delete();
    const ci=[2,3,0,1];const tl=markers[0][ci[0]],tr=markers[1][ci[1]],br=markers[2][ci[2]],bl=markers[3][ci[3]];
    const sp=cv.matFromArray(4,1,cv.CV_32FC2,[tl.x,tl.y,tr.x,tr.y,br.x,br.y,bl.x,bl.y]);
    const dp=cv.matFromArray(4,1,cv.CV_32FC2,[0,0,2339,0,2339,1654,0,1654]);
    const M=cv.getPerspectiveTransform(sp,dp);window.__corrected=new cv.Mat();
    cv.warpPerspective(src,window.__corrected,M,new cv.Size(2339,1654));
    sp.delete();dp.delete();M.delete();src.delete();
    window.__gray = new cv.Mat();
    cv.cvtColor(window.__corrected, window.__gray, cv.COLOR_RGBA2GRAY);
    resolve();
  }; img.src='data:image/jpeg;base64,'+b64; });
}, imgB64);
console.log('Image corrected.');

// Step 1: Find row boundaries (reuse from vedge-test)
const rowBounds = await page.evaluate(() => {
  const cv = window.cv; const gray = window.__gray;
  const edges = new cv.Mat(); cv.Canny(gray, edges, 50, 150);
  const hough = new cv.Mat(); cv.HoughLinesP(edges, hough, 1, Math.PI/180, 40, 40, 3);
  const hYs = [];
  for (let i=0;i<hough.rows;i++){
    const x1=hough.intAt(i,0),y1=hough.intAt(i,1),x2=hough.intAt(i,2),y2=hough.intAt(i,3);
    const a=Math.abs(Math.atan2(y2-y1,x2-x1)*180/Math.PI);
    if(a<3||a>177) hYs.push((y1+y2)/2);
  }
  hough.delete(); edges.delete();
  hYs.sort((a,b)=>a-b);
  const clusters=[]; let cl=[hYs[0]];
  for(let i=1;i<hYs.length;i++){if(hYs[i]-hYs[i-1]<10)cl.push(hYs[i]);else{clusters.push(cl);cl=[hYs[i]];}}
  clusters.push(cl);
  return clusters.map(c=>Math.round(c.reduce((a,b)=>a+b,0)/c.length));
});

const tableClusters = rowBounds.filter(y => y > 150 && y < 500);
let bestMatch = null, bestScore = Infinity;
for (let a = 0; a < tableClusters.length; a++)
  for (let b = a+1; b < tableClusters.length; b++) {
    const h0 = tableClusters[b]-tableClusters[a]; if (h0<40||h0>80) continue;
    for (let c = b+1; c < tableClusters.length; c++) {
      const h1 = tableClusters[c]-tableClusters[b]; if (h1<40||h1>80) continue;
      for (let d = c+1; d < tableClusters.length; d++) {
        const h2 = tableClusters[d]-tableClusters[c]; if (h2<40||h2>80) continue;
        const avgH = (h0+h1+h2)/3;
        const v = Math.abs(h0-avgH)+Math.abs(h1-avgH)+Math.abs(h2-avgH);
        const cy = (tableClusters[a]+tableClusters[d])/2;
        const ec = (0.1485+0.2145)/2*H+(0.0308*H)/2;
        const s = v + Math.abs(cy-ec)*0.5;
        if (s < bestScore) { bestScore=s; bestMatch=[tableClusters[a],tableClusters[b],tableClusters[c],tableClusters[d]]; }
      }
    }
  }
const dataRowBounds = bestMatch;
console.log('Row bounds:', dataRowBounds);

// Step 2: Find column dividers
const headerCandidates = rowBounds.filter(y => y < dataRowBounds[0] && y > dataRowBounds[0] - 100);
const tableTop = headerCandidates.length > 0 ? headerCandidates[0] : dataRowBounds[0] - 57;
const tableBot = dataRowBounds[3];

const colDividers = await page.evaluate(({ tableTop, tableBot }) => {
  const cv = window.cv; const gray = window.__gray;
  const tableH = tableBot - tableTop;
  const strip = gray.roi(new cv.Rect(0, tableTop, gray.cols, tableH));
  const sobelX = new cv.Mat(); cv.Sobel(strip, sobelX, cv.CV_32F, 1, 0, 3);
  const absSobel = new cv.Mat(); cv.convertScaleAbs(sobelX, absSobel); sobelX.delete();
  const profile = new Float64Array(gray.cols);
  for (let x = 0; x < gray.cols; x++) {
    let sum = 0; for (let y = 0; y < tableH; y++) sum += absSobel.ucharAt(y, x);
    profile[x] = sum;
  }
  absSobel.delete();
  const blurred = new Float64Array(gray.cols);
  const sigma=3,kHalf=7,kernel=[];let kSum=0;
  for(let i=-kHalf;i<=kHalf;i++){const v=Math.exp(-i*i/(2*sigma*sigma));kernel.push(v);kSum+=v;}
  for(let i=0;i<kernel.length;i++)kernel[i]/=kSum;
  for(let x=0;x<gray.cols;x++){let val=0;for(let k=0;k<kernel.length;k++){
    val+=profile[Math.max(0,Math.min(gray.cols-1,x+k-kHalf))]*kernel[k];}blurred[x]=val;}
  const maxVal=Math.max(...blurred);
  const peaks=[];
  for(let x=2;x<gray.cols-2;x++){
    if(blurred[x]>maxVal*0.35&&blurred[x]>blurred[x-1]&&blurred[x]>blurred[x+1]&&
       blurred[x]>blurred[x-2]&&blurred[x]>blurred[x+2])peaks.push({x,s:blurred[x]});}
  peaks.sort((a,b)=>b.s-a.s);
  const sel=[];for(const p of peaks){if(!sel.some(s=>Math.abs(s.x-p.x)<80))sel.push(p);}
  sel.sort((a,b)=>a.x-b.x);
  let best=null,bestVar=Infinity;
  for(let i=0;i<=sel.length-15;i++){
    const run=sel.slice(i,i+15).map(s=>s.x);const sp=[];
    for(let j=1;j<run.length;j++)sp.push(run[j]-run[j-1]);
    const avg=sp.reduce((a,b)=>a+b,0)/sp.length;
    const v=sp.reduce((a,s)=>a+(s-avg)**2,0)/sp.length;
    if(v<bestVar){bestVar=v;best=run;}}
  strip.delete();
  return best.slice(0,14);
}, { tableTop, tableBot });

const avgColWidth = Math.round(colDividers.slice(1).reduce((s,d,i) => s+(d-colDividers[i]),0)/(colDividers.length-1));
console.log('Column dividers:', colDividers, 'avg width:', avgColWidth);

// Step 3: For each digit box, extract crop, binarize, find connected components,
// classify isolated ones with ONNX
const groundTruth = generateGroundTruth();
console.log(`\nProcessing ${groundTruth.length} digits...`);

const results = [];
let isolatedCount = 0;
let isolatedCorrect = 0;
let touchingCount = 0;
let touchingCorrect = 0;
let totalCorrect = 0;

for (let gi = 0; gi < groundTruth.length; gi++) {
  const gt = groundTruth[gi];
  const ri = ROWS.indexOf(gt.row);
  const ci = COLUMNS.indexOf(gt.col);
  const isKG = ri > 0;

  // Compute digit box position using column-based extraction
  // Always use avgColWidth for centering so the narrow last column doesn't shift boxes
  const colLeft = colDividers[ci];
  const rowTop = dataRowBounds[ri];
  const rowBot = dataRowBounds[ri + 1];
  const rowH = rowBot - rowTop;
  const nDigits = isKG ? 4 : 3;
  let groupW = isKG ? 2*DIGIT_STRIDE + DECIMAL_STRIDE + BOX_W : 2*DIGIT_STRIDE + BOX_W;
  const startX = colLeft + (avgColWidth - groupW) / 2;
  const boxY = rowTop + (rowH - BOX_H) / 2;
  let xOff = 0;
  for (let d = 0; d < gt.digitIndex; d++) {
    xOff += (isKG && d === 2) ? DECIMAL_STRIDE : DIGIT_STRIDE;
  }
  const bx = Math.max(0, Math.min(Math.round(startX + xOff), W - BOX_W));
  const by = Math.max(0, Math.min(Math.round(boxY), H - BOX_H));

  const result = await page.evaluate(async ({ bx, by, bw, bh, cellId, saveFirst20 }) => {
    const cv = window.cv;
    const ort = window.__ort;
    const session = window.__session;
    const corrected = window.__corrected;

    // --- Helper: find largest non-edge-touching component ---
    function findIsolated(bin) {
      const labels = new cv.Mat(); const stats = new cv.Mat(); const centroids = new cv.Mat();
      const n = cv.connectedComponentsWithStats(bin, labels, stats, centroids);
      const w = bin.cols, h = bin.rows, minArea = w * h * 0.05;
      let best = -1, bestArea = 0;
      for (let l = 1; l < n; l++) {
        const left = stats.intAt(l, cv.CC_STAT_LEFT), top = stats.intAt(l, cv.CC_STAT_TOP);
        const cw = stats.intAt(l, cv.CC_STAT_WIDTH), ch = stats.intAt(l, cv.CC_STAT_HEIGHT);
        const area = stats.intAt(l, cv.CC_STAT_AREA);
        if (area < minArea) continue;
        if (left <= 0 || top <= 0 || left+cw >= w || top+ch >= h) continue;
        if (area > bestArea) { best = l; bestArea = area; }
      }
      labels.delete(); stats.delete(); centroids.delete();
      return best;
    }

    // --- Helper: find largest component (any) ---
    function findLargest(bin) {
      const labels = new cv.Mat(); const stats = new cv.Mat(); const centroids = new cv.Mat();
      const n = cv.connectedComponentsWithStats(bin, labels, stats, centroids);
      let best = -1, bestArea = 0;
      for (let l = 1; l < n; l++) {
        const area = stats.intAt(l, cv.CC_STAT_AREA);
        if (area > bestArea) { best = l; bestArea = area; }
      }
      labels.delete(); stats.delete(); centroids.delete();
      return best;
    }

    // --- Helper: extract component mask → 28×28 MNIST input ---
    function extractToMNIST(bin, label) {
      const labels = new cv.Mat(); const stats = new cv.Mat(); const centroids = new cv.Mat();
      cv.connectedComponentsWithStats(bin, labels, stats, centroids);
      const cl = stats.intAt(label, cv.CC_STAT_LEFT), ct = stats.intAt(label, cv.CC_STAT_TOP);
      const cw = stats.intAt(label, cv.CC_STAT_WIDTH), ch = stats.intAt(label, cv.CC_STAT_HEIGHT);
      const mask = new cv.Mat(ch, cw, cv.CV_8UC1, new cv.Scalar(0));
      for (let y = 0; y < ch; y++)
        for (let x = 0; x < cw; x++)
          if (labels.intAt(ct+y, cl+x) === label) mask.ucharPtr(y, x)[0] = 255;
      labels.delete(); stats.delete(); centroids.delete();
      const scale = Math.min(20/cw, 20/ch);
      const nw = Math.max(1, Math.round(cw*scale)), nh = Math.max(1, Math.round(ch*scale));
      const resized = new cv.Mat();
      cv.resize(mask, resized, new cv.Size(nw, nh), 0, 0, cv.INTER_AREA);
      mask.delete();
      const input = new Float32Array(784);
      const offX = Math.round((28-nw)/2), offY = Math.round((28-nh)/2);
      for (let y = 0; y < nh; y++)
        for (let x = 0; x < nw; x++) {
          const idx = (offY+y)*28+(offX+x);
          if (idx >= 0 && idx < 784) input[idx] = resized.ucharAt(y, x) / 255.0;
        }
      resized.delete();
      return input;
    }

    // --- Helper: classify a Float32Array input ---
    async function classify(input) {
      const tensor = new ort.Tensor('float32', input, [1, 1, 28, 28]);
      const results = await session.run({ Input3: tensor });
      const logits = Array.from(results['Plus214_Output_0'].data);
      const max = Math.max(...logits);
      const exps = logits.map(l => Math.exp(l - max));
      const sum = exps.reduce((a, b) => a + b, 0);
      const probs = exps.map(e => e / sum);
      const digit = probs.indexOf(Math.max(...probs));
      return { digit, confidence: probs[digit] * 100 };
    }

    // Crop digit box
    const roi = corrected.roi(new cv.Rect(bx, by, bw, bh));
    const crop = new cv.Mat(); roi.copyTo(crop); roi.delete();

    // Grayscale → binarize
    const gray = new cv.Mat();
    cv.cvtColor(crop, gray, cv.COLOR_RGBA2GRAY);
    crop.delete();
    const binary = new cv.Mat();
    cv.adaptiveThreshold(gray, binary, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY_INV, 15, 10);
    gray.delete();

    const w = binary.cols, h = binary.rows;

    // Pass 1: try to find an isolated component
    let bestLabel = findIsolated(binary);
    let isIsolated = bestLabel >= 0;
    let method = isIsolated ? 'isolated' : '';
    let digit = -1, confidence = 0;

    if (bestLabel >= 0) {
      const input = extractToMNIST(binary, bestLabel);
      const r = await classify(input);
      digit = r.digit; confidence = r.confidence;
    } else {
      // Pass 2: force separation — clear pixels one row/col in from each edge
      const separated = new cv.Mat(); binary.copyTo(separated);
      for (let x = 0; x < w; x++) { separated.ucharPtr(1, x)[0] = 0; separated.ucharPtr(h-2, x)[0] = 0; }
      for (let y = 0; y < h; y++) { separated.ucharPtr(y, 1)[0] = 0; separated.ucharPtr(y, w-2)[0] = 0; }

      bestLabel = findIsolated(separated);
      if (bestLabel >= 0) {
        method = 'separated';
        const input = extractToMNIST(separated, bestLabel);
        const r = await classify(input);
        digit = r.digit; confidence = r.confidence;
      } else {
        // Fallback: largest component regardless
        method = 'fallback';
        bestLabel = findLargest(separated);
        if (bestLabel >= 0) {
          const input = extractToMNIST(separated, bestLabel);
          const r = await classify(input);
          digit = r.digit; confidence = r.confidence;
        }
      }
      separated.delete();
    }

    binary.delete();

    return {
      digit, confidence: Math.round(confidence),
      isIsolated, method,
    };
  }, { bx, by, bw: BOX_W, bh: BOX_H, cellId: gt.cellId, saveFirst20: gi < 20 });

  const correct = result.digit === gt.expected;
  totalCorrect += correct ? 1 : 0;

  const method = result.method || 'unknown';
  if (method === 'isolated') { isolatedCount++; if (correct) isolatedCorrect++; }
  else { touchingCount++; if (correct) touchingCorrect++; }

  results.push({
    ...gt,
    predicted: result.digit,
    confidence: result.confidence,
    correct,
    method,
  });

  if ((gi + 1) % 20 === 0) process.stdout.write(`\r  ${gi+1}/${groundTruth.length}...`);
}

await page.evaluate(() => { window.__corrected.delete(); window.__gray.delete(); });
await browser.close();

// --- Report ---
const methods = { isolated: 0, separated: 0, fallback: 0 };
const methodCorrect = { isolated: 0, separated: 0, fallback: 0 };
for (const r of results) {
  methods[r.method] = (methods[r.method] || 0) + 1;
  if (r.correct) methodCorrect[r.method] = (methodCorrect[r.method] || 0) + 1;
}

console.log(`\n\n${'='.repeat(60)}`);
console.log(`CONNECTED COMPONENT CLASSIFICATION RESULTS`);
console.log(`${'='.repeat(60)}`);
console.log(`\nTotal digits: ${results.length}`);
console.log(`\n--- Method breakdown ---`);
for (const m of ['isolated', 'separated', 'fallback']) {
  const n = methods[m] || 0;
  const c = methodCorrect[m] || 0;
  console.log(`  ${m.padEnd(10)}: ${n}/${results.length} (${(n/results.length*100).toFixed(1)}%), accuracy: ${n>0?(c/n*100).toFixed(1):'N/A'}% (${c}/${n})`);
}

console.log(`\n--- Overall accuracy ---`);
console.log(`  All: ${totalCorrect}/${results.length} (${(totalCorrect/results.length*100).toFixed(1)}%)`);

// Per-digit breakdown
console.log(`\n--- Per-digit accuracy ---`);
for (let d = 0; d < 10; d++) {
  const ofDigit = results.filter(r => r.expected === d);
  const correctOfDigit = ofDigit.filter(r => r.correct).length;
  const misclass = ofDigit.filter(r => !r.correct).map(r => `${r.predicted}(${r.method[0]})`);
  console.log(`  ${d}: ${correctOfDigit}/${ofDigit.length} (${(correctOfDigit/ofDigit.length*100).toFixed(0)}%)${misclass.length?' → errors: '+misclass.join(', '):''}`);
}

// Per-row breakdown
console.log(`\n--- Per-row breakdown ---`);
for (const row of ROWS) {
  const ofRow = results.filter(r => r.row === row);
  const allCorr = ofRow.filter(r => r.correct).length;
  const byMethod = {};
  for (const r of ofRow) { byMethod[r.method] = (byMethod[r.method]||0) + 1; }
  console.log(`  ${row}: ${allCorr}/${ofRow.length} (${(allCorr/ofRow.length*100).toFixed(0)}%) — methods: ${Object.entries(byMethod).map(([m,n])=>`${m}:${n}`).join(', ')}`);
}

// Show all errors
const errors = results.filter(r => !r.correct);
if (errors.length > 0) {
  console.log(`\n--- All errors (${errors.length}) ---`);
  for (const e of errors) {
    console.log(`  ${e.row}/${e.col}/d${e.digitIndex}: expected ${e.expected}, got ${e.predicted} (conf ${e.confidence}%, ${e.method})`);
  }
}

writeFileSync(`${OUTPUT_DIR}/cc-results.json`, JSON.stringify(results, null, 2));
console.log(`\nFull results saved to ${OUTPUT_DIR}/cc-results.json`);
process.exit(0);
