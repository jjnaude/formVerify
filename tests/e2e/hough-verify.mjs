/**
 * Verify Hough localization: draw all 154 boxes on the rectified image
 * and save individual crops.
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const TEST_IMAGE = '/workspaces/formVerify/data/test-images/20260321_172751.jpg';
const OUTPUT_DIR = '/workspaces/formVerify/data/test-output/hough-verify';
mkdirSync(OUTPUT_DIR, { recursive: true });

const COL_X = [0.0409,0.1109,0.181,0.2511,0.3211,0.3912,0.4613,0.5313,0.6014,0.6714,0.7415,0.8116,0.8816,0.9517];
const ROW_Y = [0.1485, 0.1822, 0.2145];
const BOX_W = 0.0143, BOX_H = 0.0308;
const DIGIT_STRIDE = 0.0159, DECIMAL_STRIDE = 0.0085;
const ROWS = ['received', 'gross_kg', 'nett_kg'];
const W = 2339, H = 1654;

async function run() {
  let counter = 0;
  const next = () => (counter++) % 10;
  const boxDefs = [];
  for (let ri = 0; ri < 3; ri++) {
    const isKG = ri > 0;
    for (let ci = 0; ci < 14; ci++) {
      const numDigits = isKG ? 4 : 3;
      for (let di = 0; di < numDigits; di++) {
        let xOff = di * DIGIT_STRIDE;
        if (isKG && di >= 3) xOff = 2 * DIGIT_STRIDE + DECIMAL_STRIDE;
        const cx = (COL_X[ci] + xOff + BOX_W/2) * W;
        const cy = (ROW_Y[ri] + BOX_H/2) * H;
        boxDefs.push({ id: `r${ri}_c${ci}_d${di}`, cx, cy, row: ri, col: ci, digitIndex: di, expected: next() });
      }
    }
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('about:blank');
  await page.addScriptTag({ path: '/workspaces/formVerify/public/opencv.js' });
  await page.evaluate(() => new Promise(r => {
    const cv = window.cv; if (cv?.then) cv.then(c => { delete c.then; window.cv = c; r(); }); else r();
  }));

  const imgB64 = readFileSync(TEST_IMAGE).toString('base64');

  // Step 1: correct image
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
      sp.delete();dp.delete();M.delete();src.delete();resolve();
    }; img.src='data:image/jpeg;base64,'+b64; });
  }, imgB64);

  // Step 2: Hough + locate + draw + crop
  const result = await page.evaluate((boxDefsJson) => {
    const cv = window.cv;
    const corrected = window.__corrected;
    const boxDefs = JSON.parse(boxDefsJson);
    const eW = 0.0143 * 2339, eH = 0.0308 * 1654;

    // Grayscale + Canny + Hough
    const gray = new cv.Mat(); cv.cvtColor(corrected, gray, cv.COLOR_RGBA2GRAY);
    const edges = new cv.Mat(); cv.Canny(gray, edges, 50, 150);
    const houghH = new cv.Mat(); cv.HoughLinesP(edges, houghH, 1, Math.PI/180, 40, 40, 3);
    const houghV = new cv.Mat(); cv.HoughLinesP(edges, houghV, 1, Math.PI/180, 20, 25, 3);
    const AT = 3;
    const hLines = [], vLines = [];
    for (let i=0;i<houghH.rows;i++){
      const x1=houghH.intAt(i,0),y1=houghH.intAt(i,1),x2=houghH.intAt(i,2),y2=houghH.intAt(i,3);
      const a=Math.abs(Math.atan2(y2-y1,x2-x1)*180/Math.PI);
      if(a<AT||a>180-AT) hLines.push({y:(y1+y2)/2});
    }
    for (let i=0;i<houghV.rows;i++){
      const x1=houghV.intAt(i,0),y1=houghV.intAt(i,1),x2=houghV.intAt(i,2),y2=houghV.intAt(i,3);
      const a=Math.abs(Math.atan2(y2-y1,x2-x1)*180/Math.PI);
      if(Math.abs(a-90)<AT) vLines.push({x:(x1+x2)/2,y1:Math.min(y1,y2),y2:Math.max(y1,y2)});
    }
    houghH.delete(); houghV.delete(); edges.delete();

    // Cluster row boundaries
    const allY = hLines.map(h=>h.y).sort((a,b)=>a-b);
    const clusters = [];
    if (allY.length > 0) {
      let cl = [allY[0]];
      for (let i=1;i<allY.length;i++) {
        if (allY[i]-allY[i-1]<10) cl.push(allY[i]);
        else { clusters.push(cl); cl=[allY[i]]; }
      }
      clusters.push(cl);
    }
    const rowBounds = clusters.map(c => c.reduce((a,b)=>a+b,0)/c.length);

    // Locate each box
    const located = [];
    for (const box of boxDefs) {
      const eTop = box.cy - eH/2, eBot = box.cy + eH/2;
      const eLeft = box.cx - eW/2, eRight = box.cx + eW/2;
      let top = eTop, bot = eBot;
      const nearT = rowBounds.filter(y=>Math.abs(y-eTop)<30);
      const nearB = rowBounds.filter(y=>Math.abs(y-eBot)<30);
      if (nearT.length>0) top = nearT.reduce((a,b)=>Math.abs(a-eTop)<Math.abs(b-eTop)?a:b);
      if (nearB.length>0) bot = nearB.reduce((a,b)=>Math.abs(a-eBot)<Math.abs(b-eBot)?a:b);

      // Vertical: use nominal (sparse verticals)
      let left = eLeft, right = eRight;
      const lC = vLines.filter(v=>Math.abs(v.x-eLeft)<30&&v.y1<box.cy&&v.y2>box.cy);
      const rC = vLines.filter(v=>Math.abs(v.x-eRight)<30&&v.y1<box.cy&&v.y2>box.cy);
      if (lC.length>0) left = lC.reduce((a,b)=>Math.abs(a.x-eLeft)<Math.abs(b.x-eLeft)?a:b).x;
      if (rC.length>0) right = rC.reduce((a,b)=>Math.abs(a.x-eRight)<Math.abs(b.x-eRight)?a:b).x;

      located.push({
        id: box.id, expected: box.expected,
        top: Math.round(top), bottom: Math.round(bot),
        left: Math.round(left), right: Math.round(right),
      });
    }

    // Draw all boxes on rectified image
    const vis = new cv.Mat(); corrected.copyTo(vis);
    for (const loc of located) {
      cv.rectangle(vis,
        new cv.Point(loc.left, loc.top),
        new cv.Point(loc.right, loc.bottom),
        new cv.Scalar(0, 255, 0, 255), 2);
    }
    const vc = document.createElement('canvas'); vc.width=vis.cols; vc.height=vis.rows;
    cv.imshow(vc, vis);
    const overlayB64 = vc.toDataURL('image/jpeg', 0.85).split(',')[1];
    vis.delete();

    // Crop each box (inset 2px for border)
    const crops = [];
    for (const loc of located) {
      const inset = 2;
      const cl = Math.max(0, loc.left+inset), ct = Math.max(0, loc.top+inset);
      const cr = Math.min(2339-1, loc.right-inset), cb = Math.min(1654-1, loc.bottom-inset);
      const cw = cr-cl, ch = cb-ct;
      if (cw<4||ch<4) { crops.push({id:loc.id,expected:loc.expected,b64:null}); continue; }
      const roi = corrected.roi(new cv.Rect(cl,ct,cw,ch));
      const cc = document.createElement('canvas'); cc.width=cw; cc.height=ch;
      cv.imshow(cc, roi);
      crops.push({id:loc.id, expected:loc.expected, b64: cc.toDataURL('image/png').split(',')[1]});
      roi.delete();
    }

    gray.delete(); corrected.delete();
    return { overlayB64, crops };
  }, JSON.stringify(boxDefs));

  // Save overlay
  writeFileSync(`${OUTPUT_DIR}/rectified_with_boxes.jpg`, Buffer.from(result.overlayB64, 'base64'));
  console.log(`Overlay saved: ${OUTPUT_DIR}/rectified_with_boxes.jpg`);

  // Save crops
  let saved = 0;
  for (let i = 0; i < result.crops.length; i++) {
    const c = result.crops[i];
    if (c.b64) {
      writeFileSync(`${OUTPUT_DIR}/crop_${String(i).padStart(3,'0')}_exp${c.expected}.png`, Buffer.from(c.b64, 'base64'));
      saved++;
    }
  }
  console.log(`Crops saved: ${saved}/${result.crops.length}`);

  await browser.close();
}

run().catch(err => { console.error(err); process.exit(1); });
