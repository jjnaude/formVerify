/**
 * E2E test: upload a test image and run the full pipeline.
 * Captures results at each stage for debugging.
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const TEST_IMAGE = '/workspaces/formVerify/data/test-images/20260321_172751.jpg';
const OUTPUT_DIR = '/workspaces/formVerify/data/test-output';

mkdirSync(OUTPUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Collect console output
const logs = [];
page.on('console', msg => {
  const text = `[${msg.type()}] ${msg.text()}`;
  logs.push(text);
  console.log(text);
});
page.on('pageerror', err => {
  const text = `[ERROR] ${err.message}`;
  logs.push(text);
  console.log(text);
});

// Load OpenCV
console.log('Loading OpenCV...');
await page.goto('about:blank');
await page.addScriptTag({ path: '/workspaces/formVerify/public/opencv.js' });
await page.evaluate(() => new Promise(resolve => {
  const cv = window.cv;
  if (cv && typeof cv.then === 'function') cv.then(r => { delete r.then; window.cv = r; resolve(); });
  else if (cv?.Mat) resolve();
}), { timeout: 120000 });
console.log('OpenCV loaded.');

// Load the test image
const imgBytes = readFileSync(TEST_IMAGE);
const imgBase64 = imgBytes.toString('base64');

// Run the pipeline stages
const result = await page.evaluate(async (b64) => {
  const cv = window.cv;
  const results = {};

  // Load image
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

  // Stage 1: ArUco detection
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

  // Stage 2: Perspective correction
  console.log('Correcting perspective...');
  // Build marker map
  const markerMap = {};
  for (const m of results.markers) {
    markerMap[m.id] = m;
  }

  // Inner corners: ID0→BR(idx2), ID1→BL(idx3), ID2→TL(idx0), ID3→TR(idx1)
  const cornerIdx = [2, 3, 0, 1];
  const tl = markerMap[0].corners[cornerIdx[0]];
  const tr = markerMap[1].corners[cornerIdx[1]];
  const br = markerMap[2].corners[cornerIdx[2]];
  const bl = markerMap[3].corners[cornerIdx[3]];

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
  cv.warpPerspective(src, corrected, M, new cv.Size(A4_WIDTH, A4_HEIGHT));

  results.correctedSize = { w: corrected.cols, h: corrected.rows };
  console.log(`Corrected: ${corrected.cols}x${corrected.rows}`);

  // Save corrected image as base64
  const corrCanvas = document.createElement('canvas');
  corrCanvas.width = corrected.cols;
  corrCanvas.height = corrected.rows;
  cv.imshow(corrCanvas, corrected);
  results.correctedImage = corrCanvas.toDataURL('image/jpeg', 0.85);

  srcPts.delete(); dstPts.delete(); M.delete();
  src.delete();

  // Stage 3: Sample a few digit boxes to test box detection
  console.log('Testing box detection on sample cells...');
  const sampleBoxes = [
    { id: 'received_90L_RUC_d0', x: 0.0409, y: 0.1485, w: 0.0143, h: 0.0308 },
    { id: 'received_90L_RUC_d1', x: 0.0409 + 0.0159, y: 0.1485, w: 0.0143, h: 0.0308 },
    { id: 'received_90L_RUC_d2', x: 0.0409 + 2*0.0159, y: 0.1485, w: 0.0143, h: 0.0308 },
    { id: 'received_7_6L_Sharps_d0', x: 0.1109, y: 0.1485, w: 0.0143, h: 0.0308 },
    { id: 'received_7_6L_Sharps_d1', x: 0.1109 + 0.0159, y: 0.1485, w: 0.0143, h: 0.0308 },
    { id: 'received_7_6L_Sharps_d2', x: 0.1109 + 2*0.0159, y: 0.1485, w: 0.0143, h: 0.0308 },
  ];

  results.sampleBoxes = [];
  const MARGIN = 0.6;

  for (const box of sampleBoxes) {
    const nomX = box.x * A4_WIDTH;
    const nomY = box.y * A4_HEIGHT;
    const nomW = box.w * A4_WIDTH;
    const nomH = box.h * A4_HEIGHT;
    const marginX = nomW * MARGIN;
    const marginY = nomH * MARGIN;
    const sx = Math.max(0, Math.round(nomX - marginX));
    const sy = Math.max(0, Math.round(nomY - marginY));
    const sw = Math.min(Math.round(nomW + 2 * marginX), A4_WIDTH - sx);
    const sh = Math.min(Math.round(nomH + 2 * marginY), A4_HEIGHT - sy);

    const searchRect = new cv.Rect(sx, sy, sw, sh);
    const searchROI = corrected.roi(searchRect);

    // Save search region
    const sCanvas = document.createElement('canvas');
    sCanvas.width = sw; sCanvas.height = sh;
    cv.imshow(sCanvas, searchROI);
    const searchImg = sCanvas.toDataURL('image/png');

    // Run adaptive threshold to see what contour detection sees
    const sGray = new cv.Mat();
    cv.cvtColor(searchROI, sGray, cv.COLOR_RGBA2GRAY);
    const sThresh = new cv.Mat();
    const blockSize = Math.max(3, Math.round(sGray.cols / 6) | 1);
    cv.adaptiveThreshold(sGray, sThresh, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, blockSize, 5);

    // Dilate
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(2, 2));
    cv.dilate(sThresh, sThresh, kernel);
    kernel.delete();

    const tCanvas = document.createElement('canvas');
    tCanvas.width = sThresh.cols; tCanvas.height = sThresh.rows;
    cv.imshow(tCanvas, sThresh);
    const threshImg = tCanvas.toDataURL('image/png');

    // Count contours
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(sThresh, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

    const contourInfo = [];
    const approx = new cv.Mat();
    for (let i = 0; i < contours.size(); i++) {
      const c = contours.get(i);
      const peri = cv.arcLength(c, true);
      cv.approxPolyDP(c, approx, 0.05 * peri, true);
      const br = cv.boundingRect(c);
      contourInfo.push({
        vertices: approx.rows,
        area: cv.contourArea(c),
        boundingRect: { x: br.x, y: br.y, w: br.width, h: br.height },
        isConvex: cv.isContourConvex(approx),
      });
      c.delete();
    }
    approx.delete();
    contours.delete(); hierarchy.delete();

    sGray.delete(); sThresh.delete();
    searchROI.delete();

    results.sampleBoxes.push({
      id: box.id,
      nominalPx: { x: Math.round(nomX), y: Math.round(nomY), w: Math.round(nomW), h: Math.round(nomH) },
      searchRegionPx: { x: sx, y: sy, w: sw, h: sh },
      searchImage: searchImg,
      threshImage: threshImg,
      totalContours: contourInfo.length,
      quadContours: contourInfo.filter(c => c.vertices >= 4 && c.vertices <= 6).length,
      sizedContours: contourInfo.filter(c => {
        return c.boundingRect.w >= nomW * 0.5 && c.boundingRect.w <= nomW * 1.5 &&
               c.boundingRect.h >= nomH * 0.5 && c.boundingRect.h <= nomH * 1.5;
      }).length,
      contourDetails: contourInfo
        .filter(c => c.boundingRect.w > 5 && c.boundingRect.h > 5)
        .slice(0, 10)
        .map(c => ({
          v: c.vertices,
          rect: `${c.boundingRect.w}x${c.boundingRect.h}`,
          area: Math.round(c.area),
          convex: c.isConvex,
        })),
      expectedSize: `${Math.round(nomW)}x${Math.round(nomH)}`,
    });
  }

  corrected.delete();
  return results;
}, imgBase64);

// Save results
console.log('\n=== RESULTS ===');
console.log(`Image: ${result.imageSize.w}x${result.imageSize.h}`);
console.log(`Markers: ${result.markers.length} (IDs: ${result.markers.map(m => m.id).join(', ')})`);

if (result.correctedImage) {
  const b64 = result.correctedImage.split(',')[1];
  writeFileSync(`${OUTPUT_DIR}/corrected.jpg`, Buffer.from(b64, 'base64'));
  console.log(`Corrected image saved to ${OUTPUT_DIR}/corrected.jpg`);
}

console.log('\n=== SAMPLE BOX DETECTION ===');
for (const box of result.sampleBoxes || []) {
  console.log(`\n${box.id}:`);
  console.log(`  Expected size: ${box.expectedSize}`);
  console.log(`  Search region: ${box.searchRegionPx.w}x${box.searchRegionPx.h}`);
  console.log(`  Total contours: ${box.totalContours}`);
  console.log(`  Quad contours (4-6 vertices): ${box.quadContours}`);
  console.log(`  Right-sized contours: ${box.sizedContours}`);
  console.log(`  Significant contours:`, JSON.stringify(box.contourDetails));

  // Save debug images
  const searchB64 = box.searchImage.split(',')[1];
  writeFileSync(`${OUTPUT_DIR}/${box.id}_search.png`, Buffer.from(searchB64, 'base64'));
  const threshB64 = box.threshImage.split(',')[1];
  writeFileSync(`${OUTPUT_DIR}/${box.id}_thresh.png`, Buffer.from(threshB64, 'base64'));
}

writeFileSync(`${OUTPUT_DIR}/results.json`, JSON.stringify(result, null, 2).replace(/,"(correctedImage|searchImage|threshImage)":"[^"]*"/g, ''));

await browser.close();
console.log(`\nDone. Debug images saved to ${OUTPUT_DIR}/`);
process.exit(0);
