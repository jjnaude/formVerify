/**
 * Connected-component classification with minimal resampling.
 *
 * Instead of resizing to fit 20×20, tries to place the component mask
 * directly into a 26×26 frame (centered by center of mass within 28×28).
 * If it doesn't fit, downscales by exactly 2× (2×2 pixel binning) and
 * tries again.
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const TEST_IMAGE = '/workspaces/formVerify/data/test-images/20260321_172751.jpg';
const OUTPUT_DIR = '/workspaces/formVerify/data/test-output/cc-noscale';
mkdirSync(OUTPUT_DIR, { recursive: true });

const W = 2339, H = 1654;
const COLUMNS = [
  '90L RUC','7.6L Sharps','20L Sharps','25L Sharps',
  '2.5L Specibin','5L Specibin','10L Specibin','20L Specibin',
  '25L Specibin','Pharma 5L','Pharma 20L','50L Box','142L Box','Other',
];
const ROWS = ['received','gross_kg','nett_kg'];
const BOX_W = 34, BOX_H = Math.round(0.0308 * H);
const DIGIT_STRIDE = 34, DECIMAL_STRIDE = BOX_W + 11;

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
  const cv = window.cv; if (cv?.then) cv.then(c => { delete c.then; window.cv = c; r(); }); else r();
}));

// Load ONNX
await page.addScriptTag({ path: '/workspaces/formVerify/node_modules/onnxruntime-web/dist/ort.min.js' });
await page.evaluate(async () => {
  const ort = globalThis.ort;
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1/dist/';
  window.__ort = ort;
});
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
    window.__gray=new cv.Mat(); cv.cvtColor(window.__corrected,window.__gray,cv.COLOR_RGBA2GRAY);
    resolve();
  }; img.src='data:image/jpeg;base64,'+b64; });
}, imgB64);
console.log('Image corrected.');

// Get layout
const layout = await page.evaluate(() => {
  const cv=window.cv, gray=window.__gray;
  const edges=new cv.Mat();cv.Canny(gray,edges,50,150);
  const hough=new cv.Mat();cv.HoughLinesP(edges,hough,1,Math.PI/180,40,40,3);
  const hYs=[];
  for(let i=0;i<hough.rows;i++){const y1=hough.intAt(i,1),y2=hough.intAt(i,3),x1=hough.intAt(i,0),x2=hough.intAt(i,2);
    const a=Math.abs(Math.atan2(y2-y1,x2-x1)*180/Math.PI);if(a<3||a>177)hYs.push((y1+y2)/2);}
  hough.delete();edges.delete();hYs.sort((a,b)=>a-b);
  const cls=[];let c=[hYs[0]];for(let i=1;i<hYs.length;i++){if(hYs[i]-hYs[i-1]<10)c.push(hYs[i]);else{cls.push(c);c=[hYs[i]];}}cls.push(c);
  const ctrs=cls.map(c=>Math.round(c.reduce((a,b)=>a+b,0)/c.length));
  const tc=ctrs.filter(y=>y>150&&y<500);let best=null,bs=Infinity;
  for(let a=0;a<tc.length;a++)for(let b=a+1;b<tc.length;b++){const h0=tc[b]-tc[a];if(h0<40||h0>80)continue;
    for(let c2=b+1;c2<tc.length;c2++){const h1=tc[c2]-tc[b];if(h1<40||h1>80)continue;
      for(let d=c2+1;d<tc.length;d++){const h2=tc[d]-tc[c2];if(h2<40||h2>80)continue;
        const avg=(h0+h1+h2)/3;const v=Math.abs(h0-avg)+Math.abs(h1-avg)+Math.abs(h2-avg);
        const cy=(tc[a]+tc[d])/2;const ec=(0.1485+0.2145)/2*1654+(0.0308*1654)/2;
        const s=v+Math.abs(cy-ec)*0.5;if(s<bs){bs=s;best=[tc[a],tc[b],tc[c2],tc[d]];}}}}
  const hdrCands=ctrs.filter(y=>y<best[0]&&y>best[0]-100);
  const tableTop=hdrCands.length>0?hdrCands[0]:best[0]-57;
  const tableH=best[3]-tableTop;
  const strip=gray.roi(new cv.Rect(0,tableTop,gray.cols,tableH));
  const sx=new cv.Mat();cv.Sobel(strip,sx,cv.CV_32F,1,0,3);const ab=new cv.Mat();cv.convertScaleAbs(sx,ab);sx.delete();
  const p=new Float64Array(gray.cols);for(let x=0;x<gray.cols;x++){let s=0;for(let y=0;y<tableH;y++)s+=ab.ucharAt(y,x);p[x]=s;}ab.delete();
  const bl=new Float64Array(gray.cols);const sig=3,kH=7,kern=[];let kS=0;
  for(let i=-kH;i<=kH;i++){const v=Math.exp(-i*i/(2*sig*sig));kern.push(v);kS+=v;}for(let i=0;i<kern.length;i++)kern[i]/=kS;
  for(let x=0;x<gray.cols;x++){let v=0;for(let k=0;k<kern.length;k++)v+=p[Math.max(0,Math.min(gray.cols-1,x+k-kH))]*kern[k];bl[x]=v;}
  const mx=Math.max(...bl);const pks=[];
  for(let x=2;x<gray.cols-2;x++)if(bl[x]>mx*0.35&&bl[x]>bl[x-1]&&bl[x]>bl[x+1]&&bl[x]>bl[x-2]&&bl[x]>bl[x+2])pks.push({x,s:bl[x]});
  pks.sort((a,b)=>b.s-a.s);const sel=[];for(const pk of pks)if(!sel.some(s=>Math.abs(s.x-pk.x)<80))sel.push(pk);
  sel.sort((a,b)=>a.x-b.x);let best2=null,bv=Infinity;
  for(let i=0;i<=sel.length-15;i++){const run=sel.slice(i,i+15).map(s=>s.x);const sp=[];
    for(let j=1;j<run.length;j++)sp.push(run[j]-run[j-1]);const avg=sp.reduce((a,b)=>a+b,0)/sp.length;
    const v=sp.reduce((a,s)=>a+(s-avg)**2,0)/sp.length;if(v<bv){bv=v;best2=run;}}
  strip.delete();
  return { rowBounds: best, colDividers: best2.slice(0,14) };
});

const { rowBounds: dataRowBounds, colDividers } = layout;
const avgColWidth = Math.round(colDividers.slice(1).reduce((s,d,i)=>s+(d-colDividers[i]),0)/(colDividers.length-1));
console.log('Rows:', dataRowBounds, 'avgColW:', avgColWidth);

const groundTruth = generateGroundTruth();
console.log(`\nProcessing ${groundTruth.length} digits...`);

const results = [];

for (let gi = 0; gi < groundTruth.length; gi++) {
  const gt = groundTruth[gi];
  const ri = ROWS.indexOf(gt.row);
  const ci = COLUMNS.indexOf(gt.col);
  const isKG = ri > 0;
  const colLeft = colDividers[ci];
  const rowTop = dataRowBounds[ri], rowBot = dataRowBounds[ri+1], rowH = rowBot-rowTop;
  const nDigits = isKG ? 4 : 3;
  const groupW = isKG ? 2*DIGIT_STRIDE+DECIMAL_STRIDE+BOX_W : 2*DIGIT_STRIDE+BOX_W;
  const startX = colLeft + (avgColWidth-groupW)/2;
  const boxY = rowTop + (rowH-BOX_H)/2;
  let xOff = 0;
  for (let d = 0; d < gt.digitIndex; d++) xOff += (isKG && d===2) ? DECIMAL_STRIDE : DIGIT_STRIDE;
  const bx = Math.max(0, Math.min(Math.round(startX+xOff), W-BOX_W));
  const by = Math.max(0, Math.min(Math.round(boxY), H-BOX_H));

  const result = await page.evaluate(async ({ bx, by, bw, bh, cellId }) => {
    const cv = window.cv, ort = window.__ort, session = window.__session;
    const corrected = window.__corrected;

    // --- Helpers ---
    function findIsolated(bin) {
      const labels=new cv.Mat(),stats=new cv.Mat(),centroids=new cv.Mat();
      const n=cv.connectedComponentsWithStats(bin,labels,stats,centroids);
      const w=bin.cols,h=bin.rows,minArea=w*h*0.05;
      let best=-1,bestA=0;
      for(let l=1;l<n;l++){const left=stats.intAt(l,cv.CC_STAT_LEFT),top=stats.intAt(l,cv.CC_STAT_TOP),
        cw=stats.intAt(l,cv.CC_STAT_WIDTH),ch=stats.intAt(l,cv.CC_STAT_HEIGHT),area=stats.intAt(l,cv.CC_STAT_AREA);
        if(area<minArea)continue;if(left<=0||top<=0||left+cw>=w||top+ch>=h)continue;
        if(area>bestA){best=l;bestA=area;}}
      labels.delete();stats.delete();centroids.delete();return best;
    }
    function findLargest(bin) {
      const labels=new cv.Mat(),stats=new cv.Mat(),centroids=new cv.Mat();
      const n=cv.connectedComponentsWithStats(bin,labels,stats,centroids);
      let best=-1,bestA=0;
      for(let l=1;l<n;l++){const area=stats.intAt(l,cv.CC_STAT_AREA);if(area>bestA){best=l;bestA=area;}}
      labels.delete();stats.delete();centroids.delete();return best;
    }
    function extractMask(bin, label) {
      const labels=new cv.Mat(),stats=new cv.Mat(),centroids=new cv.Mat();
      cv.connectedComponentsWithStats(bin,labels,stats,centroids);
      const cl=stats.intAt(label,cv.CC_STAT_LEFT),ct=stats.intAt(label,cv.CC_STAT_TOP),
        cw=stats.intAt(label,cv.CC_STAT_WIDTH),ch=stats.intAt(label,cv.CC_STAT_HEIGHT);
      const mask=new cv.Mat(ch,cw,cv.CV_8UC1,new cv.Scalar(0));
      for(let y=0;y<ch;y++)for(let x=0;x<cw;x++)
        if(labels.intAt(ct+y,cl+x)===label)mask.ucharPtr(y,x)[0]=255;
      labels.delete();stats.delete();centroids.delete();
      return mask;
    }

    // Downscale by exactly 2× using 2×2 pixel binning
    function bin2x(mat) {
      const h = mat.rows, w = mat.cols;
      const nh = Math.floor(h/2), nw = Math.floor(w/2);
      const out = new cv.Mat(nh, nw, cv.CV_8UC1, new cv.Scalar(0));
      for (let y = 0; y < nh; y++) {
        for (let x = 0; x < nw; x++) {
          const sum = mat.ucharAt(y*2, x*2) + mat.ucharAt(y*2+1, x*2)
                    + mat.ucharAt(y*2, x*2+1) + mat.ucharAt(y*2+1, x*2+1);
          out.ucharPtr(y, x)[0] = Math.min(255, Math.round(sum / 4));
        }
      }
      return out;
    }

    // Try to place mask into 28×28 with CoM at center.
    // Returns { fits, input (Float32Array), offX, offY } or { fits: false }
    function tryPlace(mask) {
      const mh = mask.rows, mw = mask.cols;
      // Compute center of mass
      let massX=0, massY=0, totalMass=0;
      for (let y=0; y<mh; y++) for (let x=0; x<mw; x++) {
        const v = mask.ucharAt(y, x);
        if (v > 0) { massX += x*v; massY += y*v; totalMass += v; }
      }
      if (totalMass === 0) return { fits: false };
      const comX = massX / totalMass;
      const comY = massY / totalMass;

      // Offset to place CoM at (14, 14) — center of 28×28
      const offX = Math.round(14 - comX);
      const offY = Math.round(14 - comY);

      // Check if all mask pixels fit within 1..26 (leaving 1px border)
      const minX = offX;
      const minY = offY;
      const maxX = offX + mw - 1;
      const maxY = offY + mh - 1;
      if (minX < 1 || minY < 1 || maxX > 26 || maxY > 26) {
        return { fits: false, offX, offY, minX, minY, maxX, maxY };
      }

      // Place it
      const input = new Float32Array(784);
      for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) {
        const dx = offX + x, dy = offY + y;
        if (dx >= 0 && dx < 28 && dy >= 0 && dy < 28)
          input[dy * 28 + dx] = mask.ucharAt(y, x) / 255.0;
      }
      return { fits: true, input, offX, offY };
    }

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

    // --- Main pipeline ---
    const roi = corrected.roi(new cv.Rect(bx, by, bw, bh));
    const crop = new cv.Mat(); roi.copyTo(crop); roi.delete();
    const gray = new cv.Mat(); cv.cvtColor(crop, gray, cv.COLOR_RGBA2GRAY); crop.delete();
    const binary = new cv.Mat();
    cv.adaptiveThreshold(gray, binary, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 15, 10);
    gray.delete();

    const w = binary.cols, h = binary.rows;

    // Find component (isolated → separated → fallback)
    let bestLabel = findIsolated(binary);
    let ccMethod = 'isolated';
    let source = binary;
    let separated = null;

    if (bestLabel < 0) {
      separated = new cv.Mat(); binary.copyTo(separated);
      for (let x=0;x<w;x++){separated.ucharPtr(1,x)[0]=0;separated.ucharPtr(h-2,x)[0]=0;}
      for (let y=0;y<h;y++){separated.ucharPtr(y,1)[0]=0;separated.ucharPtr(y,w-2)[0]=0;}
      source = separated;
      bestLabel = findIsolated(separated);
      ccMethod = bestLabel >= 0 ? 'separated' : 'fallback';
      if (bestLabel < 0) bestLabel = findLargest(separated);
    }

    if (bestLabel < 0) {
      if (separated) separated.delete();
      binary.delete();
      return { digit: -1, confidence: 0, method: 'empty', scaleMethod: 'none', compW: 0, compH: 0 };
    }

    const mask = extractMask(source, bestLabel);
    if (separated) separated.delete();
    binary.delete();

    const compW = mask.cols, compH = mask.rows;

    // Try placing at native resolution
    let placement = tryPlace(mask);
    let scaleMethod = '1x';
    let usedMask = mask;

    if (!placement.fits) {
      // Downscale by exactly 2×
      const halfMask = bin2x(mask);
      placement = tryPlace(halfMask);
      scaleMethod = '2x';
      if (placement.fits) {
        usedMask = halfMask;
      } else {
        // Still doesn't fit — force place anyway (clip to 28×28)
        scaleMethod = '2x-clipped';
        const mh = halfMask.rows, mw = halfMask.cols;
        let massX=0,massY=0,totalMass=0;
        for(let y=0;y<mh;y++)for(let x=0;x<mw;x++){
          const v=halfMask.ucharAt(y,x);if(v>0){massX+=x*v;massY+=y*v;totalMass+=v;}}
        const input = new Float32Array(784);
        const offX = Math.round(14 - massX/totalMass);
        const offY = Math.round(14 - massY/totalMass);
        for(let y=0;y<mh;y++)for(let x=0;x<mw;x++){
          const dx=offX+x,dy=offY+y;
          if(dx>=0&&dx<28&&dy>=0&&dy<28) input[dy*28+dx]=halfMask.ucharAt(y,x)/255.0;
        }
        placement = { fits: true, input, offX, offY };
        usedMask = halfMask;
      }
      if (usedMask !== halfMask) halfMask.delete();
    }

    // Build debug image: the 28×28 patch as rendered for MNIST
    const patchPixels = [];
    for (let i = 0; i < 784; i++) {
      const v = Math.round((1 - placement.input[i]) * 255);
      patchPixels.push(v, v, v, 255);
    }

    const { digit, confidence } = await classify(placement.input);

    if (usedMask !== mask) usedMask.delete();
    mask.delete();

    return {
      digit, confidence: Math.round(confidence),
      method: ccMethod, scaleMethod,
      compW, compH,
      patchPixels,
    };
  }, { bx, by, bw: BOX_W, bh: BOX_H, cellId: gt.cellId });

  const correct = result.digit === gt.expected;

  // Save debug images for first 40 + all errors
  if (gi < 40 || !correct) {
    if (result.patchPixels) {
      // Write the 28×28 MNIST patch
      const patchCanvas = await page.evaluate((pixels) => {
        const c = document.createElement('canvas'); c.width=28; c.height=28;
        const ctx = c.getContext('2d');
        const imgData = ctx.createImageData(28, 28);
        for (let i = 0; i < pixels.length; i++) imgData.data[i] = pixels[i];
        ctx.putImageData(imgData, 0, 0);
        return c.toDataURL('image/png').split(',')[1];
      }, result.patchPixels);
      const tag = correct ? 'OK' : 'ERR';
      writeFileSync(`${OUTPUT_DIR}/${gt.cellId}_${result.scaleMethod}_exp${gt.expected}_got${result.digit}_${tag}.png`,
        Buffer.from(patchCanvas, 'base64'));
    }
  }

  results.push({
    ...gt, predicted: result.digit, confidence: result.confidence, correct,
    method: result.method, scaleMethod: result.scaleMethod,
    compW: result.compW, compH: result.compH,
  });

  if ((gi+1) % 20 === 0) process.stdout.write(`\r  ${gi+1}/${groundTruth.length}...`);
}

await page.evaluate(() => { window.__corrected.delete(); window.__gray.delete(); });
await browser.close();

// --- Report ---
const totalCorrect = results.filter(r => r.correct).length;

const scaleMethods = {};
const scaleCorrect = {};
for (const r of results) {
  scaleMethods[r.scaleMethod] = (scaleMethods[r.scaleMethod]||0) + 1;
  if (r.correct) scaleCorrect[r.scaleMethod] = (scaleCorrect[r.scaleMethod]||0) + 1;
}

const ccMethods = {};
const ccCorrect = {};
for (const r of results) {
  ccMethods[r.method] = (ccMethods[r.method]||0) + 1;
  if (r.correct) ccCorrect[r.method] = (ccCorrect[r.method]||0) + 1;
}

console.log(`\n\n${'='.repeat(60)}`);
console.log(`NO-SCALE / 2×-BIN CLASSIFICATION RESULTS`);
console.log(`${'='.repeat(60)}`);
console.log(`\nOverall: ${totalCorrect}/${results.length} (${(totalCorrect/results.length*100).toFixed(1)}%)`);

console.log(`\n--- Scale method breakdown ---`);
for (const m of ['1x', '2x', '2x-clipped']) {
  const n = scaleMethods[m]||0, c = scaleCorrect[m]||0;
  if (n > 0) console.log(`  ${m.padEnd(12)}: ${n} digits (${(n/results.length*100).toFixed(1)}%), accuracy: ${(c/n*100).toFixed(1)}% (${c}/${n})`);
}

console.log(`\n--- CC method breakdown ---`);
for (const m of ['isolated', 'separated', 'fallback']) {
  const n = ccMethods[m]||0, c = ccCorrect[m]||0;
  if (n > 0) console.log(`  ${m.padEnd(12)}: ${n} digits, accuracy: ${(c/n*100).toFixed(1)}% (${c}/${n})`);
}

console.log(`\n--- Per-digit accuracy ---`);
for (let d = 0; d < 10; d++) {
  const ofDigit = results.filter(r => r.expected === d);
  const correctOfDigit = ofDigit.filter(r => r.correct).length;
  const errs = ofDigit.filter(r => !r.correct).map(r => `${r.predicted}(${r.scaleMethod})`);
  console.log(`  ${d}: ${correctOfDigit}/${ofDigit.length} (${(correctOfDigit/ofDigit.length*100).toFixed(0)}%)${errs.length?' → '+errs.join(', '):''}`);
}

console.log(`\n--- Per-row breakdown ---`);
for (const row of ROWS) {
  const ofRow = results.filter(r => r.row === row);
  const allCorr = ofRow.filter(r => r.correct).length;
  console.log(`  ${row}: ${allCorr}/${ofRow.length} (${(allCorr/ofRow.length*100).toFixed(0)}%)`);
}

const errors = results.filter(r => !r.correct);
if (errors.length > 0) {
  console.log(`\n--- All errors (${errors.length}) ---`);
  for (const e of errors) {
    console.log(`  ${e.row}/${e.col}/d${e.digitIndex}: exp ${e.expected} got ${e.predicted} (${e.confidence}%, ${e.method}/${e.scaleMethod}, ${e.compW}×${e.compH})`);
  }
}

writeFileSync(`${OUTPUT_DIR}/results.json`, JSON.stringify(results, null, 2));
console.log(`\nDebug images + results saved to ${OUTPUT_DIR}/`);
process.exit(0);
