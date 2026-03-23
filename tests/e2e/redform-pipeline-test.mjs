/**
 * E2E pipeline test for the redesigned red form.
 *
 * Tests: ArUco detection → outer-corner perspective correction →
 *        red-mask column detection → red ink removal + digit preprocessing.
 *
 * Run: node tests/e2e/redform-pipeline-test.mjs
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const WORKTREE = '/workspaces/formVerify/.claude/worktrees/formRedesign';
const TEST_IMAGE = `${WORKTREE}/data/exampleImage/20260323_094032.jpg`;
const OPENCV_PATH = `${WORKTREE}/public/opencv.js`;
const OUTPUT_DIR = `${WORKTREE}/data/test-output-v3`;

mkdirSync(OUTPUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Collect console output
page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', err => console.log(`[ERROR] ${err.message}`));

// Load OpenCV
console.log('Loading OpenCV...');
await page.goto('about:blank');
await page.addScriptTag({ path: OPENCV_PATH });
await page.evaluate(() => new Promise(resolve => {
  const cv = window.cv;
  if (cv && typeof cv.then === 'function') cv.then(r => { delete r.then; window.cv = r; resolve(); });
  else if (cv?.Mat) resolve();
}), { timeout: 120000 });
console.log('OpenCV loaded.');

// Load the test image
const imgBytes = readFileSync(TEST_IMAGE);
const imgBase64 = imgBytes.toString('base64');

const result = await page.evaluate(async (b64) => {
  const cv = window.cv;
  const results = {};

  // --- Load image ---
  const img = new Image();
  await new Promise((resolve) => {
    img.onload = resolve;
    img.src = 'data:image/jpeg;base64,' + b64;
  });
  results.imageSize = { w: img.width, h: img.height };
  console.log(`Image loaded: ${img.width}x${img.height}`);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0);
  const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  const src = cv.matFromImageData(imageData);

  // --- Stage 1: ArUco detection ---
  console.log('Detecting markers...');
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  const dictionary = cv.getPredefinedDictionary(cv.DICT_4X4_50);
  const parameters = new cv.aruco_DetectorParameters();
  const refineParams = new cv.aruco_RefineParameters(10, 3, true);
  const detector = new cv.aruco_ArucoDetector(dictionary, parameters, refineParams);
  const corners = new cv.MatVector();
  const ids = new cv.Mat();
  const rejected = new cv.MatVector();
  detector.detectMarkers(gray, corners, ids, rejected);

  results.markers = [];
  for (let i = 0; i < ids.rows; i++) {
    const id = ids.intAt(i, 0);
    const c = corners.get(i);
    const pts = [];
    for (let j = 0; j < 4; j++) {
      pts.push({ x: c.floatAt(0, j * 2), y: c.floatAt(0, j * 2 + 1) });
    }
    c.delete();
    results.markers.push({ id, corners: pts });
  }
  console.log(`Found ${results.markers.length} markers: IDs ${results.markers.map(m => m.id).join(', ')}`);
  corners.delete(); ids.delete(); rejected.delete();
  detector.delete(); refineParams.delete(); parameters.delete(); dictionary.delete();
  gray.delete();

  if (results.markers.length < 4) {
    results.error = 'Not enough markers';
    src.delete();
    return results;
  }

  // --- Stage 2: Perspective correction (OUTER corners) ---
  console.log('Correcting perspective (outer corners)...');
  const markerMap = {};
  for (const m of results.markers) markerMap[m.id] = m;

  // Outer corners: ID N → corner index N
  const tl = markerMap[0].corners[0]; // TL marker → TL corner
  const tr = markerMap[1].corners[1]; // TR marker → TR corner
  const br = markerMap[2].corners[2]; // BR marker → BR corner
  const bl = markerMap[3].corners[3]; // BL marker → BL corner

  const A4_WIDTH = 2339;
  const A4_HEIGHT = 1654;

  const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
    tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y,
  ]);
  const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0, 0, A4_WIDTH, 0, A4_WIDTH, A4_HEIGHT, 0, A4_HEIGHT,
  ]);
  const M = cv.getPerspectiveTransform(srcPts, dstPts);
  const corrected = new cv.Mat();
  cv.warpPerspective(src, corrected, M, new cv.Size(A4_WIDTH, A4_HEIGHT),
    cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar(255, 255, 255, 255));
  srcPts.delete(); dstPts.delete(); M.delete(); src.delete();

  results.correctedSize = { w: corrected.cols, h: corrected.rows };
  console.log(`Corrected: ${corrected.cols}x${corrected.rows}`);

  // Save corrected image
  const corrCanvas = document.createElement('canvas');
  corrCanvas.width = corrected.cols;
  corrCanvas.height = corrected.rows;
  cv.imshow(corrCanvas, corrected);
  results.correctedImage = corrCanvas.toDataURL('image/jpeg', 0.85);

  // --- Stage 3: Red mask creation ---
  console.log('Creating red mask...');
  function createRedMask(src) {
    const channels = new cv.MatVector();
    cv.split(src, channels);
    const r = channels.get(0);
    const g = channels.get(1);
    const b = channels.get(2);
    const rg = new cv.Mat(); cv.subtract(r, g, rg);
    const rb = new cv.Mat(); cv.subtract(r, b, rb);
    const rMin = new cv.Mat(); cv.threshold(r, rMin, 80, 255, cv.THRESH_BINARY);
    channels.delete();
    const rgMask = new cv.Mat(); cv.threshold(rg, rgMask, 30, 255, cv.THRESH_BINARY); rg.delete();
    const rbMask = new cv.Mat(); cv.threshold(rb, rbMask, 30, 255, cv.THRESH_BINARY); rb.delete();
    const mask = new cv.Mat();
    cv.bitwise_and(rgMask, rbMask, mask);
    cv.bitwise_and(mask, rMin, mask);
    rgMask.delete(); rbMask.delete(); rMin.delete();
    return mask;
  }

  const fullRedMask = createRedMask(corrected);
  // Save red mask
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = fullRedMask.cols; maskCanvas.height = fullRedMask.rows;
  cv.imshow(maskCanvas, fullRedMask);
  results.redMaskImage = maskCanvas.toDataURL('image/png');

  // Count red pixels
  const totalPixels = fullRedMask.rows * fullRedMask.cols;
  let redCount = 0;
  for (let i = 0; i < totalPixels; i++) redCount += fullRedMask.data[i] > 0 ? 1 : 0;
  results.redPixelCount = redCount;
  results.redPixelPct = (redCount / totalPixels * 100).toFixed(2);
  console.log(`Red mask: ${redCount} red pixels (${results.redPixelPct}%)`);

  // --- Stage 4: Horizontal line detection ---
  console.log('Detecting horizontal lines...');

  // Morphological opening with wide horizontal kernel
  const hKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(200, 1));
  const hLines = new cv.Mat();
  cv.morphologyEx(fullRedMask, hLines, cv.MORPH_OPEN, hKernel);
  hKernel.delete();

  // Save horizontal lines image
  const hLinesCanvas = document.createElement('canvas');
  hLinesCanvas.width = hLines.cols; hLinesCanvas.height = hLines.rows;
  cv.imshow(hLinesCanvas, hLines);
  results.hLinesImage = hLinesCanvas.toDataURL('image/png');

  // Horizontal projection
  const hProfile = new Float64Array(corrected.rows);
  for (let y = 0; y < corrected.rows; y++) {
    let sum = 0;
    for (let x = 0; x < corrected.cols; x++) sum += hLines.ucharAt(y, x);
    hProfile[y] = sum / 255;
  }
  hLines.delete();

  // Peak detection
  const hMaxVal = Math.max(...Array.from(hProfile));
  const hThreshold = hMaxVal * 0.3;
  const hPeaks = [];
  for (let y = 1; y < corrected.rows - 1; y++) {
    if (hProfile[y] > hThreshold && hProfile[y] >= hProfile[y-1] && hProfile[y] >= hProfile[y+1]) {
      hPeaks.push({ y, strength: hProfile[y] });
    }
  }
  hPeaks.sort((a, b) => b.strength - a.strength);
  const hSelected = [];
  for (const p of hPeaks) {
    if (!hSelected.some(s => Math.abs(s - p.y) < 10)) hSelected.push(p.y);
  }
  hSelected.sort((a, b) => a - b);
  results.horizontalLines = hSelected;
  console.log(`Horizontal lines at: ${hSelected.join(', ')}`);

  // Find 4 equally-spaced row boundaries
  let bestMatch = null;
  let bestScore = Infinity;
  for (let a = 0; a < hSelected.length; a++) {
    for (let b = a + 1; b < hSelected.length; b++) {
      const h0 = hSelected[b] - hSelected[a];
      if (h0 < 30 || h0 > 120) continue;
      for (let c = b + 1; c < hSelected.length; c++) {
        const h1 = hSelected[c] - hSelected[b];
        if (h1 < 30 || h1 > 120) continue;
        for (let d = c + 1; d < hSelected.length; d++) {
          const h2 = hSelected[d] - hSelected[c];
          if (h2 < 30 || h2 > 120) continue;
          const avgH = (h0 + h1 + h2) / 3;
          const heightVar = Math.abs(h0 - avgH) + Math.abs(h1 - avgH) + Math.abs(h2 - avgH);
          if (heightVar < bestScore) {
            bestScore = heightVar;
            bestMatch = [hSelected[a], hSelected[b], hSelected[c], hSelected[d]];
          }
        }
      }
    }
  }
  results.rowBounds = bestMatch;
  if (bestMatch) {
    const heights = [bestMatch[1]-bestMatch[0], bestMatch[2]-bestMatch[1], bestMatch[3]-bestMatch[2]];
    results.rowHeights = heights;
    console.log(`Row boundaries: ${bestMatch.join(', ')} (heights: ${heights.join(', ')})`);
  } else {
    console.log('ERROR: Could not find row boundaries');
    fullRedMask.delete(); corrected.delete();
    return results;
  }

  // Header top
  const headerCandidates = hSelected.filter(y => y < bestMatch[0] && y > bestMatch[0] - 150);
  const headerTop = headerCandidates.length > 0 ? headerCandidates[headerCandidates.length - 1] : bestMatch[0] - 57;
  results.headerTop = headerTop;
  console.log(`Header top: ${headerTop}`);

  fullRedMask.delete();

  // --- Stage 5: Column detection with erosion ---
  console.log('Detecting columns (red mask + horizontal erosion)...');
  const tableTop = headerTop;
  const tableBot = bestMatch[3];
  const tableH = tableBot - tableTop;

  const tableStrip = corrected.roi(new cv.Rect(0, tableTop, corrected.cols, tableH));
  const tableRedMask = createRedMask(tableStrip);
  tableStrip.delete();

  // Save pre-erosion mask
  const preErosionCanvas = document.createElement('canvas');
  preErosionCanvas.width = tableRedMask.cols; preErosionCanvas.height = tableRedMask.rows;
  cv.imshow(preErosionCanvas, tableRedMask);
  results.preErosionImage = preErosionCanvas.toDataURL('image/png');

  // Horizontal erosion (removes thin vertical features)
  const erosionKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 1));
  const erodedMask = new cv.Mat();
  cv.erode(tableRedMask, erodedMask, erosionKernel);
  erosionKernel.delete();
  tableRedMask.delete();

  // Save post-erosion mask
  const postErosionCanvas = document.createElement('canvas');
  postErosionCanvas.width = erodedMask.cols; postErosionCanvas.height = erodedMask.rows;
  cv.imshow(postErosionCanvas, erodedMask);
  results.postErosionImage = postErosionCanvas.toDataURL('image/png');

  // Vertical projection
  const vProfile = new Float64Array(corrected.cols);
  for (let x = 0; x < corrected.cols; x++) {
    let sum = 0;
    for (let y = 0; y < tableH; y++) sum += erodedMask.ucharAt(y, x);
    vProfile[x] = sum / 255;
  }
  erodedMask.delete();

  // Gaussian blur σ=3
  const blurred = new Float64Array(corrected.cols);
  const sigma = 3, kHalf2 = 7;
  const gKernel = [];
  let gSum = 0;
  for (let i = -kHalf2; i <= kHalf2; i++) { const v = Math.exp(-i*i/(2*sigma*sigma)); gKernel.push(v); gSum += v; }
  for (let i = 0; i < gKernel.length; i++) gKernel[i] /= gSum;
  for (let x = 0; x < corrected.cols; x++) {
    let val = 0;
    for (let k = 0; k < gKernel.length; k++) {
      const xi = Math.max(0, Math.min(corrected.cols - 1, x + k - kHalf2));
      val += vProfile[xi] * gKernel[k];
    }
    blurred[x] = val;
  }

  // Peak detection
  const vMaxVal = Math.max(...Array.from(blurred));
  const vThreshold = vMaxVal * 0.35;
  const vPeaks = [];
  for (let x = 2; x < corrected.cols - 2; x++) {
    if (blurred[x] > vThreshold &&
        blurred[x] > blurred[x-1] && blurred[x] > blurred[x+1] &&
        blurred[x] > blurred[x-2] && blurred[x] > blurred[x+2]) {
      vPeaks.push({ x, strength: blurred[x] });
    }
  }
  vPeaks.sort((a, b) => b.strength - a.strength);

  const vSelected = [];
  for (const p of vPeaks) {
    if (!vSelected.some(s => Math.abs(s.x - p.x) < 80)) vSelected.push(p);
  }
  vSelected.sort((a, b) => a.x - b.x);

  // Find median spacing among adjacent peaks (filter for plausible column widths)
  const adjSpacings = [];
  for (let i = 1; i < vSelected.length; i++) adjSpacings.push(vSelected[i].x - vSelected[i-1].x);
  const goodSpacings = adjSpacings.filter(s => s >= 100 && s <= 250);
  goodSpacings.sort((a, b) => a - b);
  const medianSpacing = goodSpacings.length > 0
    ? goodSpacings[Math.floor(goodSpacings.length / 2)]
    : 157;

  // Build longest chain of peaks with consistent spacing
  // (skips table edges and row header which break the pattern)
  let bestChain = [];
  for (let start = 0; start < vSelected.length; start++) {
    const chain = [vSelected[start].x];
    for (let i = start + 1; i < vSelected.length; i++) {
      const expected = chain[chain.length - 1] + medianSpacing;
      if (Math.abs(vSelected[i].x - expected) < medianSpacing * 0.3) {
        chain.push(vSelected[i].x);
      }
    }
    if (chain.length > bestChain.length) bestChain = chain;
  }

  // Refine spacing from chain
  let refinedSpacing = medianSpacing;
  if (bestChain.length > 1) {
    const cs = [];
    for (let i = 1; i < bestChain.length; i++) cs.push(bestChain[i] - bestChain[i-1]);
    refinedSpacing = cs.reduce((a,b) => a+b, 0) / cs.length;
  }

  // Extrapolate to 15 dividers if needed
  while (bestChain.length < 15) {
    const nextX = bestChain[bestChain.length - 1] + refinedSpacing;
    if (nextX < corrected.cols - 10) {
      bestChain.push(Math.round(nextX));
    } else {
      const prevX = bestChain[0] - refinedSpacing;
      if (prevX >= 10) bestChain.unshift(Math.round(prevX));
      else break;
    }
  }

  const dividers = bestChain.slice(0, Math.min(14, bestChain.length));
  results.columnDividers = dividers;
  results.numPeaks = vSelected.length;
  if (dividers.length > 1) {
    const spacings = [];
    for (let i = 1; i < dividers.length; i++) spacings.push(dividers[i] - dividers[i-1]);
    results.avgColWidth = Math.round(spacings.reduce((a,b)=>a+b,0)/spacings.length);
  }
  console.log(`Column dividers (${dividers.length}): ${dividers.join(', ')}`);
  console.log(`Total peaks found: ${vSelected.length}, avg column width: ${results.avgColWidth}px`);

  // Save table strip with overlays
  const tableStripVis = corrected.roi(new cv.Rect(0, tableTop, corrected.cols, tableH));
  const vis = new cv.Mat();
  tableStripVis.copyTo(vis);
  tableStripVis.delete();
  for (const d of dividers) {
    cv.line(vis, new cv.Point(d, 0), new cv.Point(d, tableH), new cv.Scalar(0, 255, 0, 255), 2);
  }
  // Draw row boundaries
  for (const rb of bestMatch) {
    const localY = rb - tableTop;
    cv.line(vis, new cv.Point(0, localY), new cv.Point(corrected.cols, localY), new cv.Scalar(0, 255, 255, 255), 1);
  }
  const visCanvas = document.createElement('canvas');
  visCanvas.width = vis.cols; visCanvas.height = vis.rows;
  cv.imshow(visCanvas, vis);
  results.tableStripImage = visCanvas.toDataURL('image/png');
  vis.delete();

  // --- Stage 6: Sample digit extraction with red ink removal ---
  console.log('Extracting sample digits with red ink removal...');

  function removeRedInk(src) {
    const mask = createRedMask(src);
    const result = new cv.Mat();
    src.copyTo(result);
    result.setTo(new cv.Scalar(255, 255, 255, 255), mask);
    mask.delete();
    return result;
  }

  results.sampleDigits = [];
  const BOX_W = 34, BOX_H = 51, DIGIT_STRIDE = 34;
  const avgColW = results.avgColWidth || 150;
  const groupW = 2 * DIGIT_STRIDE + BOX_W; // 3-digit group width

  // Extract first 3 columns, first row
  for (let ci = 0; ci < Math.min(3, dividers.length); ci++) {
    const colLeft = dividers[ci];
    const rowTop = bestMatch[0];
    const rowBot = bestMatch[1];
    const rowH = rowBot - rowTop;
    const startX = colLeft + (avgColW - groupW) / 2;
    const boxY = rowTop + (rowH - BOX_H) / 2;

    for (let di = 0; di < 3; di++) {
      const bx = Math.round(startX + di * DIGIT_STRIDE);
      const by = Math.round(boxY);
      const cx = Math.max(0, Math.min(bx, A4_WIDTH - BOX_W));
      const cy = Math.max(0, Math.min(by, A4_HEIGHT - BOX_H));

      const digitROI = corrected.roi(new cv.Rect(cx, cy, BOX_W, BOX_H));

      // Raw crop
      const rawCanvas = document.createElement('canvas');
      rawCanvas.width = BOX_W; rawCanvas.height = BOX_H;
      cv.imshow(rawCanvas, digitROI);
      const rawImg = rawCanvas.toDataURL('image/png');

      // Red-removed
      const noRed = removeRedInk(digitROI);
      const noRedCanvas = document.createElement('canvas');
      noRedCanvas.width = BOX_W; noRedCanvas.height = BOX_H;
      cv.imshow(noRedCanvas, noRed);
      const noRedImg = noRedCanvas.toDataURL('image/png');

      // Preprocessed (grayscale → CLAHE → Otsu)
      const noRedGray = new cv.Mat();
      cv.cvtColor(noRed, noRedGray, cv.COLOR_RGBA2GRAY);
      const clahe = new cv.CLAHE(2.0, new cv.Size(4, 4));
      const enhanced = new cv.Mat();
      clahe.apply(noRedGray, enhanced);
      noRedGray.delete(); clahe.delete();
      const binary = new cv.Mat();
      cv.threshold(enhanced, binary, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
      enhanced.delete();
      const ppCanvas = document.createElement('canvas');
      ppCanvas.width = BOX_W; ppCanvas.height = BOX_H;
      cv.imshow(ppCanvas, binary);
      const ppImg = ppCanvas.toDataURL('image/png');
      binary.delete();

      noRed.delete();
      digitROI.delete();

      results.sampleDigits.push({
        col: ci, digit: di,
        pos: { x: cx, y: cy },
        rawImage: rawImg,
        noRedImage: noRedImg,
        preprocessedImage: ppImg,
      });
    }
  }
  console.log(`Extracted ${results.sampleDigits.length} sample digits`);

  corrected.delete();
  return results;
}, imgBase64);

// --- Save results ---
console.log('\n=== RESULTS ===');
console.log(`Image: ${result.imageSize.w}x${result.imageSize.h}`);
console.log(`Markers: ${result.markers.length} (IDs: ${result.markers.map(m => m.id).join(', ')})`);

if (result.correctedImage) {
  writeFileSync(`${OUTPUT_DIR}/corrected.jpg`, Buffer.from(result.correctedImage.split(',')[1], 'base64'));
  console.log('Saved: corrected.jpg');
}
if (result.redMaskImage) {
  writeFileSync(`${OUTPUT_DIR}/red-mask.png`, Buffer.from(result.redMaskImage.split(',')[1], 'base64'));
  console.log('Saved: red-mask.png');
}
if (result.hLinesImage) {
  writeFileSync(`${OUTPUT_DIR}/horizontal-lines.png`, Buffer.from(result.hLinesImage.split(',')[1], 'base64'));
  console.log('Saved: horizontal-lines.png');
}
if (result.preErosionImage) {
  writeFileSync(`${OUTPUT_DIR}/table-red-mask-pre-erosion.png`, Buffer.from(result.preErosionImage.split(',')[1], 'base64'));
  console.log('Saved: table-red-mask-pre-erosion.png');
}
if (result.postErosionImage) {
  writeFileSync(`${OUTPUT_DIR}/table-red-mask-post-erosion.png`, Buffer.from(result.postErosionImage.split(',')[1], 'base64'));
  console.log('Saved: table-red-mask-post-erosion.png');
}
if (result.tableStripImage) {
  writeFileSync(`${OUTPUT_DIR}/table-strip-overlay.png`, Buffer.from(result.tableStripImage.split(',')[1], 'base64'));
  console.log('Saved: table-strip-overlay.png');
}

// Save sample digit images
for (const d of result.sampleDigits || []) {
  const prefix = `digit_c${d.col}_d${d.digit}`;
  writeFileSync(`${OUTPUT_DIR}/${prefix}_raw.png`, Buffer.from(d.rawImage.split(',')[1], 'base64'));
  writeFileSync(`${OUTPUT_DIR}/${prefix}_nored.png`, Buffer.from(d.noRedImage.split(',')[1], 'base64'));
  writeFileSync(`${OUTPUT_DIR}/${prefix}_pp.png`, Buffer.from(d.preprocessedImage.split(',')[1], 'base64'));
}
if (result.sampleDigits?.length > 0) {
  console.log(`Saved: ${result.sampleDigits.length} × 3 digit debug images`);
}

// Summary
console.log('\n=== SUMMARY ===');
console.log(`Red pixels: ${result.redPixelCount} (${result.redPixelPct}%)`);
console.log(`Horizontal lines: ${result.horizontalLines?.join(', ')}`);
console.log(`Row boundaries: ${result.rowBounds?.join(', ')} (heights: ${result.rowHeights?.join(', ')})`);
console.log(`Header top: ${result.headerTop}`);
console.log(`Column dividers (${result.columnDividers?.length}): ${result.columnDividers?.join(', ')}`);
console.log(`Avg column width: ${result.avgColWidth}px`);
console.log(`Peaks found: ${result.numPeaks}`);

// Assertions
let passed = 0, failed = 0;
function assert(condition, msg) {
  if (condition) { console.log(`  ✓ ${msg}`); passed++; }
  else { console.log(`  ✗ ${msg}`); failed++; }
}

console.log('\n=== ASSERTIONS ===');
assert(result.markers.length === 4, '4 markers detected');
assert(result.correctedSize?.w === 2339 && result.correctedSize?.h === 1654, 'Corrected to A4 200dpi');
assert(result.redPixelCount > 1000, 'Red mask has significant content');
assert(result.rowBounds?.length === 4, '4 row boundaries found');
assert(result.rowHeights?.every(h => h > 30 && h < 120), 'Row heights in range 30-120px');
assert(result.rowHeights && Math.max(...result.rowHeights) - Math.min(...result.rowHeights) < 10,
  'Row heights are equal (±10px)');
assert(result.columnDividers?.length === 14, '14 column dividers found');
assert(result.avgColWidth > 100 && result.avgColWidth < 200, 'Column width in expected range');
assert(result.sampleDigits?.length === 9, '9 sample digits extracted');

console.log(`\n${passed} passed, ${failed} failed`);

// Save summary JSON (without images)
const summary = { ...result };
delete summary.correctedImage;
delete summary.redMaskImage;
delete summary.hLinesImage;
delete summary.preErosionImage;
delete summary.postErosionImage;
delete summary.tableStripImage;
if (summary.sampleDigits) {
  summary.sampleDigits = summary.sampleDigits.map(d => ({
    col: d.col, digit: d.digit, pos: d.pos,
  }));
}
writeFileSync(`${OUTPUT_DIR}/results.json`, JSON.stringify(summary, null, 2));

await browser.close();
console.log(`\nDone. Output saved to ${OUTPUT_DIR}/`);
process.exit(failed > 0 ? 1 : 0);
