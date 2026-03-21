import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const TEST_IMAGE = '/workspaces/formVerify/data/test-images/20260321_172751.jpg';
const OUTPUT_DIR = '/workspaces/formVerify/data/test-output/vedge';
mkdirSync(OUTPUT_DIR, { recursive: true });
const W = 2339, H = 1654;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('pageerror', e => console.log('[ERROR]', e.message));
await page.goto('about:blank');
await page.addScriptTag({ path: '/workspaces/formVerify/public/opencv.js' });
await page.evaluate(() => new Promise(r => {
  const cv = window.cv; if (cv?.then) cv.then(c => { delete c.then; window.cv = c; r(); }); else r();
}));

// Step 1: Correct image
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
    // Also store grayscale
    window.__gray = new cv.Mat();
    cv.cvtColor(window.__corrected, window.__gray, cv.COLOR_RGBA2GRAY);
    resolve();
  }; img.src='data:image/jpeg;base64,'+b64; });
}, imgB64);
console.log('Image corrected.');

// Step 2: Find row boundaries
const rowBounds = await page.evaluate(() => {
  const cv = window.cv;
  const gray = window.__gray;
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
console.log('Row boundary clusters:', rowBounds);

// Match to expected positions
const eH = Math.round(0.0308 * H);
const expectedBounds = [
  Math.round(0.1485*H - eH/2), Math.round(0.1485*H + eH/2),
  Math.round(0.1822*H + eH/2), Math.round(0.2145*H + eH/2),
];
const matchedBounds = expectedBounds.map(ey => {
  const near = rowBounds.filter(y => Math.abs(y-ey)<30);
  return near.length > 0 ? near.reduce((a,b) => Math.abs(a-ey)<Math.abs(b-ey)?a:b) : ey;
});
console.log('Matched row bounds:', matchedBounds);

// Step 3: For each row, compute vertical edge profile
const rowNames = ['received', 'gross_kg', 'nett_kg'];
for (let ri = 0; ri < 3; ri++) {
  const top = matchedBounds[ri];
  const bot = matchedBounds[ri + 1];

  const rowResult = await page.evaluate(({ top, bot }) => {
    const cv = window.cv;
    const gray = window.__gray;
    const rowH = bot - top;
    if (rowH < 5) return null;

    const rowStrip = gray.roi(new cv.Rect(0, top, gray.cols, rowH));

    // |dI/dx| via Sobel
    const sobelX = new cv.Mat();
    cv.Sobel(rowStrip, sobelX, cv.CV_32F, 1, 0, 3);
    const absSobel = new cv.Mat();
    cv.convertScaleAbs(sobelX, absSobel);
    sobelX.delete();

    // Sum vertically
    const profile = new Float64Array(gray.cols);
    for (let x = 0; x < gray.cols; x++) {
      let sum = 0;
      for (let y = 0; y < rowH; y++) sum += absSobel.ucharAt(y, x);
      profile[x] = sum;
    }
    absSobel.delete();

    // Gaussian blur σ=2
    const blurred = new Float64Array(gray.cols);
    const sigma = 2, kHalf = 4;
    const kernel = [];
    let kSum = 0;
    for (let i = -kHalf; i <= kHalf; i++) { const v = Math.exp(-i*i/(2*sigma*sigma)); kernel.push(v); kSum += v; }
    for (let i = 0; i < kernel.length; i++) kernel[i] /= kSum;
    for (let x = 0; x < gray.cols; x++) {
      let val = 0;
      for (let k = 0; k < kernel.length; k++) {
        const xi = Math.max(0, Math.min(gray.cols-1, x+k-kHalf));
        val += profile[xi] * kernel[k];
      }
      blurred[x] = val;
    }

    // Local maxima
    const maxVal = Math.max(...blurred);
    const threshold = maxVal * 0.15;
    const peaks = [];
    for (let x = 2; x < gray.cols-2; x++) {
      if (blurred[x]>threshold && blurred[x]>blurred[x-1] && blurred[x]>blurred[x+1] &&
          blurred[x]>blurred[x-2] && blurred[x]>blurred[x+2]) {
        peaks.push(x);
      }
    }

    // Draw peaks on row strip
    const vis = new cv.Mat();
    cv.cvtColor(rowStrip, vis, cv.COLOR_GRAY2RGBA);
    for (const px of peaks) {
      cv.line(vis, new cv.Point(px, 0), new cv.Point(px, rowH), new cv.Scalar(0, 255, 0, 255), 1);
    }
    const rc = document.createElement('canvas'); rc.width=vis.cols; rc.height=vis.rows;
    cv.imshow(rc, vis);
    const imgB64 = rc.toDataURL('image/jpeg', 0.85).split(',')[1];
    vis.delete(); rowStrip.delete();

    return { peaks, imgB64 };
  }, { top, bot });

  if (rowResult) {
    writeFileSync(`${OUTPUT_DIR}/row_${rowNames[ri]}_edges.jpg`, Buffer.from(rowResult.imgB64, 'base64'));
    console.log(`${rowNames[ri]}: ${rowResult.peaks.length} vertical edges`);
    console.log(`  peaks: ${rowResult.peaks.slice(0,40).join(', ')}${rowResult.peaks.length>40?'...':''}`);
  }
}

await page.evaluate(() => { window.__corrected.delete(); window.__gray.delete(); });
await browser.close();
process.exit(0);
