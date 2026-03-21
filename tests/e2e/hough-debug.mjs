import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
mkdirSync('/workspaces/formVerify/data/test-output/hough', { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('about:blank');

// Load OpenCV
await page.addScriptTag({ path: '/workspaces/formVerify/public/opencv.js' });
await page.evaluate(() => new Promise(r => {
  const cv = window.cv;
  if (cv?.then) cv.then(c => { delete c.then; window.cv = c; r(); });
  else r();
}));
console.log('OpenCV loaded');

// Load and correct image
const imgB64 = readFileSync('/workspaces/formVerify/data/test-images/20260321_172751.jpg').toString('base64');
await page.evaluate((b64) => {
  const cv = window.cv;
  const img = new Image();
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
    const W=2339,H=1654;
    const sp=cv.matFromArray(4,1,cv.CV_32FC2,[tl.x,tl.y,tr.x,tr.y,br.x,br.y,bl.x,bl.y]);
    const dp=cv.matFromArray(4,1,cv.CV_32FC2,[0,0,W,0,W,H,0,H]);
    const M=cv.getPerspectiveTransform(sp,dp);
    window.__corrected=new cv.Mat();
    cv.warpPerspective(src,window.__corrected,M,new cv.Size(W,H));
    sp.delete();dp.delete();M.delete();src.delete();
    resolve();
  }; img.src='data:image/jpeg;base64,'+b64; });
}, imgB64);
console.log('Image corrected');

// Get Canny edges and Hough analysis
const result = await page.evaluate(() => {
  const cv = window.cv;
  const corrected = window.__corrected;

  const gray = new cv.Mat();
  cv.cvtColor(corrected, gray, cv.COLOR_RGBA2GRAY);

  // Save Canny edges
  const edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);
  const ec = document.createElement('canvas'); ec.width=edges.cols; ec.height=edges.rows;
  cv.imshow(ec, edges);
  const edgesB64 = ec.toDataURL('image/jpeg', 0.9).split(',')[1];

  // Two-pass Hough: stricter for horizontals, relaxed for verticals
  // Horizontal grid lines are long (>40px); vertical box borders are shorter (~30-50px)
  const houghH = new cv.Mat();
  cv.HoughLinesP(edges, houghH, 1, Math.PI/180, 40, 40, 3);

  const houghV = new cv.Mat();
  cv.HoughLinesP(edges, houghV, 1, Math.PI/180, 20, 25, 3);

  const AT = 3;
  let hCount=0, vCount=0;
  const hLens=[], vLens=[];

  // Extract horizontal lines from the stricter pass
  const allH = [];
  for (let i=0; i<houghH.rows; i++) {
    const x1=houghH.intAt(i,0),y1=houghH.intAt(i,1),x2=houghH.intAt(i,2),y2=houghH.intAt(i,3);
    const absA = Math.abs(Math.atan2(y2-y1,x2-x1)*180/Math.PI);
    if (absA < AT || absA > 180-AT) {
      hCount++;
      const len = Math.sqrt((x2-x1)**2+(y2-y1)**2);
      hLens.push(len);
      allH.push({x1,y1,x2,y2});
    }
  }

  // Extract vertical lines from the relaxed pass (but only truly vertical)
  const allV = [];
  for (let i=0; i<houghV.rows; i++) {
    const x1=houghV.intAt(i,0),y1=houghV.intAt(i,1),x2=houghV.intAt(i,2),y2=houghV.intAt(i,3);
    const absA = Math.abs(Math.atan2(y2-y1,x2-x1)*180/Math.PI);
    if (Math.abs(absA-90) < AT) {
      vCount++;
      const len = Math.sqrt((x2-x1)**2+(y2-y1)**2);
      vLens.push(len);
      allV.push({x1,y1,x2,y2});
    }
  }
  const otherCount = 0; // not tracked

  // Draw
  const vis = new cv.Mat();
  cv.cvtColor(gray, vis, cv.COLOR_GRAY2RGBA);
  for (const h of allH) {
    cv.line(vis, new cv.Point(h.x1,h.y1), new cv.Point(h.x2,h.y2), new cv.Scalar(0,255,0,255), 1);
  }
  for (const v of allV) {
    cv.line(vis, new cv.Point(v.x1,v.y1), new cv.Point(v.x2,v.y2), new cv.Scalar(255,0,0,255), 1);
  }
  const vc = document.createElement('canvas'); vc.width=vis.cols; vc.height=vis.rows;
  cv.imshow(vc, vis);
  const linesB64 = vc.toDataURL('image/jpeg', 0.85).split(',')[1];

  const total = hCount + vCount;
  houghH.delete(); houghV.delete(); edges.delete(); gray.delete(); vis.delete();

  hLens.sort((a,b)=>a-b);
  vLens.sort((a,b)=>a-b);

  return {
    edgesB64, linesB64, total,
    hCount, vCount, otherCount,
    hLenMedian: Math.round(hLens[Math.floor(hLens.length/2)] || 0),
    hLenMin: Math.round(hLens[0] || 0),
    hLenMax: Math.round(hLens[hLens.length-1] || 0),
    vLenMedian: Math.round(vLens[Math.floor(vLens.length/2)] || 0),
    vLenMin: Math.round(vLens[0] || 0),
    vLenMax: Math.round(vLens[vLens.length-1] || 0),
  };
});

writeFileSync('/workspaces/formVerify/data/test-output/hough/canny_edges.jpg', Buffer.from(result.edgesB64, 'base64'));
writeFileSync('/workspaces/formVerify/data/test-output/hough/hough_lines_v2.jpg', Buffer.from(result.linesB64, 'base64'));

console.log(`Total Hough lines: ${result.total}`);
console.log(`Horizontal: ${result.hCount} (len ${result.hLenMin}-${result.hLenMedian}-${result.hLenMax})`);
console.log(`Vertical: ${result.vCount} (len ${result.vLenMin}-${result.vLenMedian}-${result.vLenMax})`);
console.log(`Other angles: ${result.otherCount}`);
console.log(`\nSaved: canny_edges.jpg, hough_lines_v2.jpg`);

await page.evaluate(() => { window.__corrected.delete(); });
await browser.close();
process.exit(0);
