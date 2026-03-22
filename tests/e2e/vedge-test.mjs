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
    window.__gray = new cv.Mat();
    cv.cvtColor(window.__corrected, window.__gray, cv.COLOR_RGBA2GRAY);
    resolve();
  }; img.src='data:image/jpeg;base64,'+b64; });
}, imgB64);
console.log('Image corrected.');

// Step 2: Find horizontal line clusters
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

// Find 4 data-row boundaries with equal-spacing constraint (received_top, gross_top, nett_top, nett_bot)
const tableClusters = rowBounds.filter(y => y > 150 && y < 500);
let bestMatch = null, bestScore = Infinity;
for (let a = 0; a < tableClusters.length; a++) {
  for (let b = a+1; b < tableClusters.length; b++) {
    const h0 = tableClusters[b]-tableClusters[a]; if (h0<40||h0>80) continue;
    for (let c = b+1; c < tableClusters.length; c++) {
      const h1 = tableClusters[c]-tableClusters[b]; if (h1<40||h1>80) continue;
      for (let d = c+1; d < tableClusters.length; d++) {
        const h2 = tableClusters[d]-tableClusters[c]; if (h2<40||h2>80) continue;
        const avgH = (h0+h1+h2)/3;
        const heightVar = Math.abs(h0-avgH)+Math.abs(h1-avgH)+Math.abs(h2-avgH);
        const centerY = (tableClusters[a]+tableClusters[d])/2;
        const expectedCenter = (0.1485+0.2145)/2 * H + (0.0308*H)/2;
        const score = heightVar + Math.abs(centerY-expectedCenter)*0.5;
        if (score < bestScore) { bestScore=score; bestMatch=[tableClusters[a],tableClusters[b],tableClusters[c],tableClusters[d]]; }
      }
    }
  }
}
const dataRowBounds = bestMatch;
console.log('Data row bounds:', dataRowBounds, '→ heights:',
  [dataRowBounds[1]-dataRowBounds[0], dataRowBounds[2]-dataRowBounds[1], dataRowBounds[3]-dataRowBounds[2]]);

// Find header top: look for horizontal line above the first data row, within a reasonable range
// Header should be roughly same height as data rows (40-80px above dataRowBounds[0])
const headerCandidates = rowBounds.filter(y => y < dataRowBounds[0] && y > dataRowBounds[0] - 100);
const headerTop = headerCandidates.length > 0 ? headerCandidates[0] : dataRowBounds[0] - 57;
const tableTop = headerTop;
const tableBot = dataRowBounds[3];
console.log(`Full table zone: ${tableTop} → ${tableBot} (${tableBot - tableTop}px)`);
console.log(`  Header: ${tableTop} → ${dataRowBounds[0]} (${dataRowBounds[0] - tableTop}px)`);
console.log(`  Received: ${dataRowBounds[0]} → ${dataRowBounds[1]} (${dataRowBounds[1] - dataRowBounds[0]}px)`);
console.log(`  Gross KG: ${dataRowBounds[1]} → ${dataRowBounds[2]} (${dataRowBounds[2] - dataRowBounds[1]}px)`);
console.log(`  Nett KG: ${dataRowBounds[2]} → ${dataRowBounds[3]} (${dataRowBounds[3] - dataRowBounds[2]}px)`);

// Step 3: Find column dividers using full table strip
// Strategy: column dividers are the strongest vertical features because they span the
// full table height as continuous printed lines. Find all strong peaks, then select
// the best 15 equally-spaced ones (14 inter-column dividers + right edge of last column,
// though we may also pick up the row-header right border).
const NUM_DATA_COLS = 14;
const EXPECTED_COL_SPACING = W / (NUM_DATA_COLS + 1); // ~156px rough estimate including row header

const columnResult = await page.evaluate(({ tableTop, tableBot, NUM_DATA_COLS }) => {
  const cv = window.cv;
  const gray = window.__gray;
  const tableH = tableBot - tableTop;

  const tableStrip = gray.roi(new cv.Rect(0, tableTop, gray.cols, tableH));

  // |dI/dx| via Sobel
  const sobelX = new cv.Mat();
  cv.Sobel(tableStrip, sobelX, cv.CV_32F, 1, 0, 3);
  const absSobel = new cv.Mat();
  cv.convertScaleAbs(sobelX, absSobel);
  sobelX.delete();

  // Sum vertically — full table height gives strong signal for printed grid lines
  const profile = new Float64Array(gray.cols);
  for (let x = 0; x < gray.cols; x++) {
    let sum = 0;
    for (let y = 0; y < tableH; y++) sum += absSobel.ucharAt(y, x);
    profile[x] = sum;
  }
  absSobel.delete();

  // Gaussian blur σ=3
  const blurred = new Float64Array(gray.cols);
  const sigma = 3, kHalf = 7;
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

  // Find ALL local maxima above a high threshold
  const maxVal = Math.max(...blurred);
  const highThreshold = maxVal * 0.35;
  const allPeaks = [];
  for (let x = 2; x < gray.cols-2; x++) {
    if (blurred[x]>highThreshold && blurred[x]>blurred[x-1] && blurred[x]>blurred[x+1] &&
        blurred[x]>blurred[x-2] && blurred[x]>blurred[x+2]) {
      allPeaks.push({ x, strength: blurred[x] });
    }
  }
  // Sort by strength (strongest first)
  allPeaks.sort((a, b) => b.strength - a.strength);

  // Greedy NMS: take the strongest peak, suppress all peaks within MIN_SPACING,
  // repeat. This naturally selects column dividers over weaker digit-box edges.
  const MIN_SPACING = 80; // half a column width — no two dividers closer than this
  const selected = [];
  const used = new Set();
  for (const p of allPeaks) {
    if (used.has(p.x)) continue;
    // Check no already-selected peak is too close
    if (selected.some(s => Math.abs(s.x - p.x) < MIN_SPACING)) continue;
    selected.push(p);
  }
  // Sort by x position
  selected.sort((a, b) => a.x - b.x);

  // Draw visualization on full table strip
  const vis = new cv.Mat();
  cv.cvtColor(tableStrip, vis, cv.COLOR_GRAY2RGBA);
  // Draw all raw peaks as thin yellow lines for reference
  for (const p of allPeaks) {
    if (!selected.includes(p)) {
      cv.line(vis, new cv.Point(p.x, 0), new cv.Point(p.x, tableH), new cv.Scalar(255, 255, 0, 128), 1);
    }
  }
  // Draw selected dividers as thick green lines
  for (const p of selected) {
    cv.line(vis, new cv.Point(p.x, 0), new cv.Point(p.x, tableH), new cv.Scalar(0, 255, 0, 255), 2);
  }

  const rc = document.createElement('canvas'); rc.width=vis.cols; rc.height=vis.rows;
  cv.imshow(rc, vis);
  const imgB64 = rc.toDataURL('image/jpeg', 0.85).split(',')[1];
  vis.delete(); tableStrip.delete();

  return {
    dividers: selected.map(p => p.x),
    strengths: selected.map(p => Math.round(p.strength)),
    rawPeakCount: allPeaks.length,
    imgB64,
  };
}, { tableTop, tableBot, NUM_DATA_COLS });

writeFileSync(`${OUTPUT_DIR}/full_table_columns.jpg`, Buffer.from(columnResult.imgB64, 'base64'));
const allDividers = columnResult.dividers;
console.log(`\nColumn detection: ${allDividers.length} dividers found (from ${columnResult.rawPeakCount} peaks above 35% threshold)`);
console.log(`  positions: ${allDividers.join(', ')}`);
console.log(`  strengths: ${columnResult.strengths.join(', ')}`);

// The dividers include the row-header right border + 14 inter-column borders + possibly right table edge.
// Identify the 14 data-column left boundaries: these should be the 14 dividers with
// roughly equal spacing (~163px). The first one is the row-header / first-data-column border.
// We expect 15 dividers total (left of col0 through right of col13).
const spacings = [];
for (let i = 1; i < allDividers.length; i++) {
  spacings.push(allDividers[i] - allDividers[i - 1]);
}
console.log(`  spacings: ${spacings.join(', ')}`);

// Find the run of 14 consecutive equal spacings (the 14 data columns need 15 dividers)
// The row-header column is narrower, so the first spacing will be different
let bestRun = null, bestRunVar = Infinity;
for (let start = 0; start <= allDividers.length - 15; start++) {
  const runDivs = allDividers.slice(start, start + 15);
  const runSpacings = [];
  for (let i = 1; i < runDivs.length; i++) runSpacings.push(runDivs[i] - runDivs[i-1]);
  const avg = runSpacings.reduce((a, b) => a + b, 0) / runSpacings.length;
  const variance = runSpacings.reduce((a, s) => a + (s - avg) ** 2, 0) / runSpacings.length;
  if (variance < bestRunVar) { bestRunVar = variance; bestRun = { start, dividers: runDivs, avg, variance }; }
}
if (bestRun) {
  console.log(`\n  Best 15-divider run starting at index ${bestRun.start}: avg spacing ${bestRun.avg.toFixed(1)}px, variance ${bestRun.variance.toFixed(1)}`);
}

// Use the first 14 dividers as column left edges; extrapolate right edge of last column
// (the right table edge is outside the rectified view, so use average column width)
const colDividers14 = bestRun ? bestRun.dividers.slice(0, 14) : allDividers.slice(0, 14);
const avgColWidth = Math.round(
  colDividers14.slice(1).reduce((sum, d, i) => sum + (d - colDividers14[i]), 0) / (colDividers14.length - 1)
);
console.log(`  Column left dividers (14): ${colDividers14.join(', ')}`);
console.log(`  Average column width: ${avgColWidth}px`);

// Step 4: Crop individual columns and locate digit boxes within each
// Column cells: left edge = divider[i], right edge = divider[i+1] (or extrapolated for last)
const colEdges = [];
for (let i = 0; i < colDividers14.length; i++) {
  const left = colDividers14[i];
  const right = i < colDividers14.length - 1 ? colDividers14[i + 1] : Math.min(W, left + avgColWidth);
  colEdges.push({ left, right, width: right - left });
}
console.log(`\nColumn widths: ${colEdges.map((c, i) => `${i}:${c.width}px`).join(', ')}`);

// Calibrated digit box layout constants (measured from binary threshold + vertical projection)
// Boxes are adjacent (no inter-box gap), so DIGIT_STRIDE ≈ BOX_W
const BOX_W_PX = 34;           // measured: boxes are ~34px wide
const BOX_H_PX = 0.0308 * H;   // ~51px (vertical unchanged)
const DIGIT_STRIDE_PX = 34;    // measured: boxes touch, stride = box width
const DECIMAL_GAP_PX = 11;     // measured: comma space between d2 right edge and d3 left edge

const COLUMNS = [
  '90L RUC', '7.6L Sharps', '20L Sharps', '25L Sharps',
  '2.5L Specibin', '5L Specibin', '10L Specibin', '20L Specibin',
  '25L Specibin', 'Pharma 5L', 'Pharma 20L', '50L Box', '142L Box', 'Other',
];
const ROWS = ['received', 'gross_kg', 'nett_kg'];

// Extract and save column images with digit box overlays
for (let ci = 0; ci < colEdges.length; ci++) {
  const col = colEdges[ci];

  const colImgResult = await page.evaluate(({ colLeft, colRight, dataRowBounds, tableTop,
      BOX_W_PX, BOX_H_PX, DIGIT_STRIDE_PX, DECIMAL_GAP_PX, ROWS }) => {
    const cv = window.cv;
    const corrected = window.__corrected;

    const colW = colRight - colLeft;
    const colTop = tableTop;
    const colBot = dataRowBounds[3];
    const colH = colBot - colTop;

    // Crop column from corrected image
    const colROI = corrected.roi(new cv.Rect(Math.round(colLeft), colTop, Math.round(colW), colH));
    const vis = new cv.Mat();
    colROI.copyTo(vis);
    colROI.delete();

    // Draw row boundaries as cyan horizontal lines
    for (const ry of dataRowBounds) {
      const localY = ry - colTop;
      cv.line(vis, new cv.Point(0, localY), new cv.Point(colW, localY), new cv.Scalar(0, 255, 255, 255), 1);
    }

    // Overlay digit box positions within this column
    // Digit boxes are centered horizontally within the cell (divider-to-divider)
    const digitInfo = [];
    for (let ri = 0; ri < ROWS.length; ri++) {
      const rowTop = dataRowBounds[ri] - colTop;
      const rowBot = dataRowBounds[ri + 1] - colTop;
      const rowH = rowBot - rowTop;
      const isKG = ri > 0;
      const nDigits = isKG ? 4 : 3;

      // Digit boxes are centered vertically within the row
      const boxY = rowTop + (rowH - BOX_H_PX) / 2;

      // Compute digit group width and center horizontally in the cell
      // d2→d3 stride = BOX_W + DECIMAL_GAP (box width + comma space)
      const DECIMAL_STRIDE_PX = BOX_W_PX + DECIMAL_GAP_PX;
      let groupW;
      if (isKG) {
        // 2 normal strides + 1 decimal stride + last box width
        groupW = 2 * DIGIT_STRIDE_PX + DECIMAL_STRIDE_PX + BOX_W_PX;
      } else {
        groupW = 2 * DIGIT_STRIDE_PX + BOX_W_PX;
      }
      const startX = (colW - groupW) / 2;

      let xOff = 0;
      for (let di = 0; di < nDigits; di++) {
        const bx = startX + xOff;
        const by = boxY;

        // Draw digit box rectangle
        const color = isKG && di >= 3
          ? new cv.Scalar(255, 165, 0, 255)  // orange for decimal digit
          : new cv.Scalar(0, 255, 0, 255);   // green for whole digits
        cv.rectangle(vis,
          new cv.Point(Math.round(bx), Math.round(by)),
          new cv.Point(Math.round(bx + BOX_W_PX), Math.round(by + BOX_H_PX)),
          color, 1);

        digitInfo.push({
          row: ROWS[ri], digitIndex: di, isDecimal: isKG && di >= 3,
          x: Math.round(bx + colLeft), y: Math.round(by + colTop),
          localX: Math.round(bx), localY: Math.round(by),
          w: Math.round(BOX_W_PX), h: Math.round(BOX_H_PX),
        });

        // Advance x: normal stride, or BOX_W + decimal gap when crossing the comma
        if (isKG && di === 2) {
          xOff += DECIMAL_STRIDE_PX;
        } else {
          xOff += DIGIT_STRIDE_PX;
        }
      }
    }

    const rc = document.createElement('canvas'); rc.width=vis.cols; rc.height=vis.rows;
    cv.imshow(rc, vis);
    const imgB64 = rc.toDataURL('image/png').split(',')[1];
    vis.delete();

    return { imgB64, digitInfo, colW: Math.round(colW), colH };
  }, {
    colLeft: col.left, colRight: col.right,
    dataRowBounds, tableTop,
    BOX_W_PX, BOX_H_PX, DIGIT_STRIDE_PX, DECIMAL_GAP_PX, ROWS,
  });

  writeFileSync(`${OUTPUT_DIR}/col_${String(ci).padStart(2,'0')}_${COLUMNS[ci].replace(/[\s.]/g,'_')}.png`,
    Buffer.from(colImgResult.imgB64, 'base64'));
  console.log(`  col ${ci} (${COLUMNS[ci]}): ${colImgResult.colW}×${colImgResult.colH}px, ${colImgResult.digitInfo.length} digit boxes`);
}

// Step 5: Calibration — output 4x zoomed raw column images (no overlays) for precise measurement
const ZOOM = 4;
for (const ci of [0, 5, 9]) {
  const col = colEdges[ci];
  const zoomedB64 = await page.evaluate(({ colLeft, colRight, dataRowBounds, tableTop, ZOOM }) => {
    const cv = window.cv;
    const corrected = window.__corrected;
    const colW = colRight - colLeft;
    const colTop = tableTop;
    const colBot = dataRowBounds[3];
    const colH = colBot - colTop;

    const colROI = corrected.roi(new cv.Rect(Math.round(colLeft), colTop, Math.round(colW), colH));
    const zoomed = new cv.Mat();
    cv.resize(colROI, zoomed, new cv.Size(colW * ZOOM, colH * ZOOM), 0, 0, cv.INTER_NEAREST);
    colROI.delete();

    const rc = document.createElement('canvas'); rc.width = zoomed.cols; rc.height = zoomed.rows;
    cv.imshow(rc, zoomed);
    const b64 = rc.toDataURL('image/png').split(',')[1];
    zoomed.delete();
    return b64;
  }, { colLeft: col.left, colRight: col.right, dataRowBounds, tableTop, ZOOM });

  writeFileSync(`${OUTPUT_DIR}/cal_col${String(ci).padStart(2,'0')}_${ZOOM}x.png`, Buffer.from(zoomedB64, 'base64'));
  console.log(`  Calibration image: col ${ci} at ${ZOOM}x zoom → cal_col${String(ci).padStart(2,'0')}_${ZOOM}x.png`);
}

await page.evaluate(() => { window.__corrected.delete(); window.__gray.delete(); });
await browser.close();
process.exit(0);
