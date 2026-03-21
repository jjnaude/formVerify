/**
 * Test the Hough-based box localization on the test image.
 * Dumps debug images showing detected lines and located boxes.
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const TEST_IMAGE = '/workspaces/formVerify/data/test-images/20260321_172751.jpg';
const OUTPUT_DIR = '/workspaces/formVerify/data/test-output/hough';
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
const W = 2339, H = 1654;

function generateBoxDefs() {
  let counter = 0;
  const next = () => (counter++) % 10;
  const defs = [];
  for (let ri = 0; ri < ROWS.length; ri++) {
    const isKG = ROWS[ri] !== 'received';
    const numDigits = isKG ? 4 : 3;
    for (let ci = 0; ci < COLUMNS.length; ci++) {
      for (let di = 0; di < numDigits; di++) {
        let xOffset = di * DIGIT_STRIDE;
        if (isKG && di >= 3) {
          xOffset = 2 * DIGIT_STRIDE + DECIMAL_STRIDE + (di - 3) * DIGIT_STRIDE;
        }
        const cx = (COL_X[ci] + xOffset + BOX_W / 2) * W;
        const cy = (ROW_Y[ri] + BOX_H / 2) * H;
        const expected = next();
        defs.push({
          id: `${ROWS[ri]}_${ci}_d${di}`,
          cx, cy,
          row: ri, col: ci, digitIndex: di,
          expected,
        });
      }
    }
  }
  return defs;
}

async function run() {
  const boxDefs = generateBoxDefs();
  console.log(`Testing ${boxDefs.length} box positions...`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('pageerror', err => console.log(`[ERROR] ${err.message}`));

  await page.goto('about:blank');
  await page.addScriptTag({ path: '/workspaces/formVerify/public/opencv.js' });
  await page.evaluate(() => new Promise(r => {
    const cv = window.cv;
    if (cv && typeof cv.then === 'function') cv.then(c => { delete c.then; window.cv = c; r(); });
    else if (cv?.Mat) r();
  }));

  const imgBase64 = readFileSync(TEST_IMAGE).toString('base64');

  // Correct image
  await page.evaluate(async (b64) => {
    const cv = window.cv;
    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = 'data:image/jpeg;base64,' + b64; });
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
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
    const sp = cv.matFromArray(4,1,cv.CV_32FC2,[tl.x,tl.y,tr.x,tr.y,br.x,br.y,bl.x,bl.y]);
    const dp = cv.matFromArray(4,1,cv.CV_32FC2,[0,0,2339,0,2339,1654,0,1654]);
    const M = cv.getPerspectiveTransform(sp, dp);
    const corrected = new cv.Mat();
    cv.warpPerspective(src, corrected, M, new cv.Size(2339, 1654));
    sp.delete(); dp.delete(); M.delete(); src.delete();
    window.__corrected = corrected;
  }, imgBase64);
  console.log('Image corrected.');

  // Run Hough localization
  const result = await page.evaluate((boxDefsJson) => {
    const cv = window.cv;
    const corrected = window.__corrected;
    const boxDefs = JSON.parse(boxDefsJson);
    const expectedBoxW = 0.0143 * 2339;
    const expectedBoxH = 0.0308 * 1654;
    const strideX = 0.0159 * 2339;

    // 1. Grayscale + Canny
    const gray = new cv.Mat();
    cv.cvtColor(corrected, gray, cv.COLOR_RGBA2GRAY);
    const edges = new cv.Mat();
    cv.Canny(gray, edges, 50, 150);

    // 2. Hough lines
    // Two-pass Hough: stricter for horizontals, relaxed for verticals
    const houghH = new cv.Mat();
    cv.HoughLinesP(edges, houghH, 1, Math.PI/180, 40, 40, 3);
    const houghV = new cv.Mat();
    cv.HoughLinesP(edges, houghV, 1, Math.PI/180, 20, 25, 3);

    const ANGLE_TOL = 3;
    const hLines = [];
    const vLines = [];
    for (let i = 0; i < houghH.rows; i++) {
      const x1=houghH.intAt(i,0),y1=houghH.intAt(i,1),x2=houghH.intAt(i,2),y2=houghH.intAt(i,3);
      const angle = Math.abs(Math.atan2(y2-y1,x2-x1)*180/Math.PI);
      if (angle < ANGLE_TOL || angle > 180-ANGLE_TOL) {
        hLines.push({ y: (y1+y2)/2, x1: Math.min(x1,x2), x2: Math.max(x1,x2) });
      }
    }
    for (let i = 0; i < houghV.rows; i++) {
      const x1=houghV.intAt(i,0),y1=houghV.intAt(i,1),x2=houghV.intAt(i,2),y2=houghV.intAt(i,3);
      const angle = Math.abs(Math.atan2(y2-y1,x2-x1)*180/Math.PI);
      if (Math.abs(angle-90) < ANGLE_TOL) {
        vLines.push({ x: (x1+x2)/2, y1: Math.min(y1,y2), y2: Math.max(y1,y2) });
      }
    }
    houghH.delete(); houghV.delete();

    // 3. Draw lines on image for debug
    const linesVis = new cv.Mat();
    cv.cvtColor(gray, linesVis, cv.COLOR_GRAY2RGBA);
    for (const h of hLines) {
      cv.line(linesVis, new cv.Point(h.x1, Math.round(h.y)),
        new cv.Point(h.x2, Math.round(h.y)), new cv.Scalar(0, 255, 0, 255), 1);
    }
    for (const v of vLines) {
      cv.line(linesVis, new cv.Point(Math.round(v.x), v.y1),
        new cv.Point(Math.round(v.x), v.y2), new cv.Scalar(255, 100, 0, 255), 1);
    }
    const lc = document.createElement('canvas'); lc.width = linesVis.cols; lc.height = linesVis.rows;
    cv.imshow(lc, linesVis);
    const linesImgB64 = lc.toDataURL('image/jpeg', 0.8).split(',')[1];
    linesVis.delete();

    // 4. Cluster horizontal lines into global row boundaries
    const allHY = hLines.map(h => h.y).sort((a,b) => a-b);
    function clusterY(ys, minGap) {
      if (ys.length === 0) return [];
      const clusters = [];
      let cluster = [ys[0]];
      for (let i = 1; i < ys.length; i++) {
        if (ys[i] - ys[i-1] < minGap) cluster.push(ys[i]);
        else { clusters.push(cluster); cluster = [ys[i]]; }
      }
      clusters.push(cluster);
      return clusters.map(c => ({ y: c.reduce((a,b)=>a+b,0)/c.length, count: c.length }));
    }
    const rowClusters = clusterY(allHY, 10);
    console.log('Row boundary clusters:', rowClusters.map(c => `y=${Math.round(c.y)} (n=${c.count})`).join(', '));

    function findBox(eCX, eCY, eW, eH) {
      const eLeft = eCX - eW/2, eRight = eCX + eW/2;
      const eTop = eCY - eH/2, eBot = eCY + eH/2;

      // Find closest row boundary cluster to expected top/bottom
      let bestTop = eTop, bestBot = eBot, hFound = false;
      const nearTop = rowClusters.filter(c => Math.abs(c.y - eTop) < 30);
      const nearBot = rowClusters.filter(c => Math.abs(c.y - eBot) < 30);
      if (nearTop.length > 0) {
        bestTop = nearTop.reduce((a,b) => Math.abs(a.y-eTop)<Math.abs(b.y-eTop)?a:b).y;
        hFound = true;
      }
      if (nearBot.length > 0) {
        bestBot = nearBot.reduce((a,b) => Math.abs(a.y-eBot)<Math.abs(b.y-eBot)?a:b).y;
        hFound = true;
      }

      // Vertical lines (sparse, use if available)
      const leftC = vLines.filter(v => Math.abs(v.x-eLeft)<30 && v.y1<eCY && v.y2>eCY).map(v=>v.x);
      const rightC = vLines.filter(v => Math.abs(v.x-eRight)<30 && v.y1<eCY && v.y2>eCY).map(v=>v.x);
      let bestLeft = eLeft, bestRight = eRight, vFound = false;
      if (leftC.length>0 && rightC.length>0) {
        let bestScore = 9e9;
        for (const l of leftC) for (const r of rightC) {
          if (r<=l) continue;
          const se = Math.abs((r-l)-eW)/eW;
          if (se>0.4) continue;
          const s = se + Math.abs((l+r)/2-eCX)/eW*0.5;
          if (s<bestScore) { bestScore=s; bestLeft=l; bestRight=r; vFound=true; }
        }
      }

      return {
        top: Math.round(bestTop), bottom: Math.round(bestBot),
        left: Math.round(bestLeft), right: Math.round(bestRight),
        cx: (bestLeft+bestRight)/2, cy: (bestTop+bestBot)/2,
        w: Math.round(bestRight-bestLeft), h: Math.round(bestBot-bestTop),
        found: hFound, hFound, vFound,
        topC: nearTop.length, botC: nearBot.length, leftC: leftC.length, rightC: rightC.length,
      };
    }

    // Group by row
    const rowGroups = {};
    for (const b of boxDefs) {
      if (!rowGroups[b.row]) rowGroups[b.row] = [];
      rowGroups[b.row].push(b);
    }

    const located = {};
    let totalFound = 0;
    for (const [rowIdx, rowBoxes] of Object.entries(rowGroups)) {
      rowBoxes.sort((a, b) => a.col !== b.col ? a.col - b.col : a.digitIndex - b.digitIndex);
      let driftX = 0, driftY = 0;

      for (const box of rowBoxes) {
        const searchCX = box.cx + driftX;
        const searchCY = box.cy + driftY;
        const loc = findBox(searchCX, searchCY, expectedBoxW, expectedBoxH);

        if (loc.found) {
          driftX = loc.cx - box.cx;
          driftY = loc.cy - box.cy;
          totalFound++;
        }

        located[box.id] = {
          ...loc,
          expected: box.expected,
          nomCX: box.cx.toFixed(0),
          nomCY: box.cy.toFixed(0),
          searchCX: searchCX.toFixed(0),
          searchCY: searchCY.toFixed(0),
          driftX: driftX.toFixed(1),
          driftY: driftY.toFixed(1),
        };
      }
    }

    edges.delete(); gray.delete();

    return {
      totalLines: { horizontal: hLines.length, vertical: vLines.length },
      totalFound,
      totalBoxes: boxDefs.length,
      linesImgB64,
      // Sample results for first row
      sampleResults: Object.entries(located).slice(0, 20).map(([id, loc]) => ({ id, ...loc })),
    };
  }, JSON.stringify(boxDefs));

  // Save debug images
  writeFileSync(`${OUTPUT_DIR}/hough_lines.jpg`, Buffer.from(result.linesImgB64, 'base64'));

  console.log(`\nHough lines found: ${result.totalLines.horizontal} horizontal, ${result.totalLines.vertical} vertical`);
  console.log(`Boxes located: ${result.totalFound}/${result.totalBoxes} (${(result.totalFound/result.totalBoxes*100).toFixed(0)}%)`);

  console.log('\nSample results (first row):');
  for (const r of result.sampleResults) {
    const status = r.found ? (r.hFound && r.vFound ? 'HV' : r.hFound ? 'H_' : '_V') : '__';
    console.log(`  ${r.id} exp=${r.expected}: [${status}] nom=(${r.nomCX},${r.nomCY}) search=(${r.searchCX},${r.searchCY}) → actual=(${r.cx.toFixed(0)},${r.cy.toFixed(0)}) drift=(${r.driftX},${r.driftY}) size=${r.w}x${r.h} cand:T${r.topC}/B${r.botC}/L${r.leftC}/R${r.rightC}`);
  }

  await page.evaluate(() => { window.__corrected.delete(); });
  await browser.close();
  console.log(`\nDebug image: ${OUTPUT_DIR}/hough_lines.jpg`);
}

run().catch(err => { console.error(err); process.exit(1); });
