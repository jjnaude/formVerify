/**
 * Full localization: Hough rows + vertical edge profile matching.
 * For each expected box edge, find the nearest vertical edge peak.
 * Draw results on rectified image + save crops.
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const TEST_IMAGE = '/workspaces/formVerify/data/test-images/20260321_172751.jpg';
const OUTPUT_DIR = '/workspaces/formVerify/data/test-output/vedge-locate';
mkdirSync(OUTPUT_DIR, { recursive: true });

const COL_X = [0.0409,0.1109,0.181,0.2511,0.3211,0.3912,0.4613,0.5313,0.6014,0.6714,0.7415,0.8116,0.8816,0.9517];
const ROW_Y = [0.1485, 0.1822, 0.2145];
const BOX_W = 0.0143, BOX_H = 0.0308;
const DIGIT_STRIDE = 0.0159, DECIMAL_STRIDE = 0.0085;
const IMG_W = 2339, IMG_H = 1654;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('pageerror', e => console.log('[ERROR]', e.message));
await page.goto('about:blank');
await page.addScriptTag({ path: '/workspaces/formVerify/public/opencv.js' });
await page.evaluate(() => new Promise(r => {
  const cv = window.cv; if (cv?.then) cv.then(c => { delete c.then; window.cv = c; r(); }); else r();
}));

// Correct image
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
    window.__gray=new cv.Mat();cv.cvtColor(window.__corrected,window.__gray,cv.COLOR_RGBA2GRAY);
    resolve();
  }; img.src='data:image/jpeg;base64,'+b64; });
}, imgB64);
console.log('Image corrected.');

// Find row boundaries
const rowBounds = await page.evaluate(() => {
  const cv = window.cv; const gray = window.__gray;
  const edges = new cv.Mat(); cv.Canny(gray, edges, 50, 150);
  const hough = new cv.Mat(); cv.HoughLinesP(edges, hough, 1, Math.PI/180, 40, 40, 3);
  const hYs = [];
  for (let i=0;i<hough.rows;i++){
    const x1=hough.intAt(i,0),y1=hough.intAt(i,1),x2=hough.intAt(i,2),y2=hough.intAt(i,3);
    if(Math.abs(Math.atan2(y2-y1,x2-x1)*180/Math.PI)<3) hYs.push((y1+y2)/2);
  }
  hough.delete(); edges.delete();
  hYs.sort((a,b)=>a-b);
  const clusters=[]; if(hYs.length){let cl=[hYs[0]];
  for(let i=1;i<hYs.length;i++){if(hYs[i]-hYs[i-1]<10)cl.push(hYs[i]);else{clusters.push(cl);cl=[hYs[i]];}}
  clusters.push(cl);}
  return clusters.map(c=>Math.round(c.reduce((a,b)=>a+b,0)/c.length));
});

// We need 4 boundaries forming 3 data rows.
// Strategy: find 4 clusters that are roughly equally spaced (~50-70px apart)
// and fall in the table region (y ~200-450).
const eH = Math.round(BOX_H * IMG_H); // ~51px
console.log('Available clusters:', rowBounds);

// Filter to table region and find groups of 4 with similar spacing
const tableClusters = rowBounds.filter(y => y > 150 && y < 500);
console.log('Table-region clusters:', tableClusters);

let bestMatch = null;
let bestScore = Infinity;
const minRowH = 40;
const maxRowH = 80;

for (let a = 0; a < tableClusters.length; a++) {
  for (let b = a+1; b < tableClusters.length; b++) {
    const h0 = tableClusters[b]-tableClusters[a];
    if (h0 < minRowH || h0 > maxRowH) continue;
    for (let c = b+1; c < tableClusters.length; c++) {
      const h1 = tableClusters[c]-tableClusters[b];
      if (h1 < minRowH || h1 > maxRowH) continue;
      for (let d = c+1; d < tableClusters.length; d++) {
        const h2 = tableClusters[d]-tableClusters[c];
        if (h2 < minRowH || h2 > maxRowH) continue;
        // Score: prefer similar row heights + prefer rows near expected center
        const avgH = (h0+h1+h2)/3;
        const heightVar = Math.abs(h0-avgH) + Math.abs(h1-avgH) + Math.abs(h2-avgH);
        const centerY = (tableClusters[a]+tableClusters[d])/2;
        const expectedCenter = (ROW_Y[0]+ROW_Y[2])/2 * IMG_H + eH/2;
        const centerDist = Math.abs(centerY - expectedCenter);
        const score = heightVar + centerDist * 0.5;
        if (score < bestScore) {
          bestScore = score;
          bestMatch = [tableClusters[a],tableClusters[b],tableClusters[c],tableClusters[d]];
        }
      }
    }
  }
}
const matchedBounds = bestMatch || [
  Math.round(ROW_Y[0]*IMG_H - eH/2),
  Math.round(ROW_Y[0]*IMG_H + eH/2),
  Math.round(ROW_Y[1]*IMG_H + eH/2),
  Math.round(ROW_Y[2]*IMG_H + eH/2),
];
console.log('Matched bounds:', matchedBounds, '→ row heights:',
  [matchedBounds[1]-matchedBounds[0], matchedBounds[2]-matchedBounds[1], matchedBounds[3]-matchedBounds[2]]);

// For each row: get vertical edge peaks, then match to expected box edges
const allBoxes = []; // {left, right, top, bottom, expected}
let digitCounter = 0;
const nextDigit = () => (digitCounter++) % 10;

for (let ri = 0; ri < 3; ri++) {
  const top = matchedBounds[ri], bot = matchedBounds[ri+1];
  const isKG = ri > 0;
  const numDigits = isKG ? 4 : 3;

  // Get peaks for this row
  const peaks = await page.evaluate(({top, bot}) => {
    const cv = window.cv; const gray = window.__gray;
    const rowH = bot-top; if(rowH<5) return [];
    const strip = gray.roi(new cv.Rect(0, top, gray.cols, rowH));
    const sobelX = new cv.Mat(); cv.Sobel(strip, sobelX, cv.CV_32F, 1, 0, 3);
    const absSobel = new cv.Mat(); cv.convertScaleAbs(sobelX, absSobel); sobelX.delete();
    const profile = new Float64Array(gray.cols);
    for(let x=0;x<gray.cols;x++){let s=0;for(let y=0;y<rowH;y++)s+=absSobel.ucharAt(y,x);profile[x]=s;}
    absSobel.delete(); strip.delete();
    // Blur
    const blurred = new Float64Array(gray.cols);
    const sigma=2,kH=4,kernel=[];let kS=0;
    for(let i=-kH;i<=kH;i++){const v=Math.exp(-i*i/(2*sigma*sigma));kernel.push(v);kS+=v;}
    for(let i=0;i<kernel.length;i++)kernel[i]/=kS;
    for(let x=0;x<gray.cols;x++){let v=0;for(let k=0;k<kernel.length;k++){
      v+=profile[Math.max(0,Math.min(gray.cols-1,x+k-kH))]*kernel[k];}blurred[x]=v;}
    // Peaks
    const maxV=Math.max(...blurred), thr=maxV*0.15;
    const peaks=[];
    for(let x=2;x<gray.cols-2;x++){
      if(blurred[x]>thr&&blurred[x]>blurred[x-1]&&blurred[x]>blurred[x+1]&&
         blurred[x]>blurred[x-2]&&blurred[x]>blurred[x+2]) peaks.push(x);
    }
    return peaks;
  }, {top, bot});

  console.log(`Row ${ri}: ${peaks.length} peaks`);

  // For each column, compute expected left/right edges of each digit box
  // and snap to nearest peak
  const SNAP_RADIUS = 15; // max pixels to snap

  for (let ci = 0; ci < 14; ci++) {
    for (let di = 0; di < numDigits; di++) {
      let xOff = di * DIGIT_STRIDE;
      if (isKG && di >= 3) xOff = 2 * DIGIT_STRIDE + DECIMAL_STRIDE;
      const nomLeft = Math.round((COL_X[ci] + xOff) * IMG_W);
      const nomRight = Math.round((COL_X[ci] + xOff + BOX_W) * IMG_W);

      // Snap left edge to nearest peak
      let bestLeft = nomLeft;
      let bestLeftDist = SNAP_RADIUS + 1;
      for (const p of peaks) {
        const d = Math.abs(p - nomLeft);
        if (d < bestLeftDist) { bestLeftDist = d; bestLeft = p; }
      }

      // Snap right edge to nearest peak
      let bestRight = nomRight;
      let bestRightDist = SNAP_RADIUS + 1;
      for (const p of peaks) {
        const d = Math.abs(p - nomRight);
        if (d < bestRightDist) { bestRightDist = d; bestRight = p; }
      }

      const expected = nextDigit();
      allBoxes.push({
        left: bestLeft, right: bestRight, top, bottom: bot,
        expected, snappedL: bestLeftDist <= SNAP_RADIUS, snappedR: bestRightDist <= SNAP_RADIUS,
      });
    }
  }
}

console.log(`Total boxes: ${allBoxes.length}, snapped left: ${allBoxes.filter(b=>b.snappedL).length}, snapped right: ${allBoxes.filter(b=>b.snappedR).length}`);

// Draw all boxes on rectified image + save crops
const overlayB64 = await page.evaluate((boxes) => {
  const cv = window.cv; const corrected = window.__corrected;
  const vis = new cv.Mat(); corrected.copyTo(vis);
  for (const b of boxes) {
    const color = (b.snappedL && b.snappedR) ? new cv.Scalar(0,255,0,255) :
                  (b.snappedL || b.snappedR) ? new cv.Scalar(255,255,0,255) :
                  new cv.Scalar(255,0,0,255);
    cv.rectangle(vis, new cv.Point(b.left,b.top), new cv.Point(b.right,b.bottom), color, 2);
  }
  const c = document.createElement('canvas'); c.width=vis.cols; c.height=vis.rows;
  cv.imshow(c, vis); vis.delete();
  return c.toDataURL('image/jpeg', 0.85).split(',')[1];
}, allBoxes);

writeFileSync(`${OUTPUT_DIR}/rectified_vedge_boxes.jpg`, Buffer.from(overlayB64, 'base64'));
console.log('Overlay saved.');

// Save crops
for (let i = 0; i < allBoxes.length; i++) {
  const b = allBoxes[i];
  const cropB64 = await page.evaluate(({left,right,top,bottom}) => {
    const cv = window.cv; const corrected = window.__corrected;
    const inset = 2;
    const cl=Math.max(0,left+inset),ct=Math.max(0,top+inset);
    const cr=Math.min(2339-1,right-inset),cb=Math.min(1654-1,bottom-inset);
    if(cr-cl<4||cb-ct<4) return null;
    const roi=corrected.roi(new cv.Rect(cl,ct,cr-cl,cb-ct));
    const c=document.createElement('canvas');c.width=roi.cols;c.height=roi.rows;
    cv.imshow(c,roi);roi.delete();
    return c.toDataURL('image/png').split(',')[1];
  }, b);
  if (cropB64) {
    writeFileSync(`${OUTPUT_DIR}/crop_${String(i).padStart(3,'0')}_exp${b.expected}.png`, Buffer.from(cropB64, 'base64'));
  }
}
console.log('Crops saved.');

await page.evaluate(() => { window.__corrected.delete(); window.__gray.delete(); });
await browser.close();
process.exit(0);
