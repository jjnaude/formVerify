/**
 * Full E2E test: run the complete formVerify pipeline via the app,
 * using the upload feature.
 */
import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const TEST_IMAGE = resolve('/workspaces/formVerify/data/test-images/20260321_172751.jpg');
const OUTPUT_DIR = '/workspaces/formVerify/data/test-output';
mkdirSync(OUTPUT_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.log(`[ERROR] ${err.message}`));

  // Start dev server
  const { execSync, spawn } = await import('child_process');
  // Kill any existing vite
  try { execSync('pkill -f vite', { stdio: 'ignore' }); } catch {}
  const vite = spawn('npx', ['vite', '--port', '5200'], {
    cwd: '/workspaces/formVerify',
    stdio: 'ignore',
    detached: true,
  });
  await new Promise(r => setTimeout(r, 4000));

  try {
    console.log('Loading app...');
    await page.goto('http://localhost:5200/formVerify/', { waitUntil: 'networkidle', timeout: 30000 });

    // Upload the test image via file input
    console.log('Uploading test image...');

    // Create a file chooser promise before clicking
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.evaluate(() => {
        // Find and click the Upload button
        const buttons = document.querySelectorAll('app-shell');
        const shell = buttons[0];
        const uploadBtn = shell.shadowRoot.querySelectorAll('button')[1]; // second button
        uploadBtn.click();
      }),
    ]);
    await fileChooser.setFiles(TEST_IMAGE);

    console.log('Processing...');

    // Wait for processing to complete (look for the results table or error)
    // Poll the shadow DOM for the result
    let result = null;
    for (let attempt = 0; attempt < 120; attempt++) {
      await new Promise(r => setTimeout(r, 2000));

      result = await page.evaluate(() => {
        const shell = document.querySelector('app-shell');
        if (!shell?.shadowRoot) return null;
        const processor = shell.shadowRoot.querySelector('image-processor');
        if (!processor?.shadowRoot) return null;

        // Check for error
        const errorEl = processor.shadowRoot.querySelector('.status.error');
        if (errorEl) return { status: 'error', message: errorEl.textContent };

        // Check for results table
        const table = processor.shadowRoot.querySelector('.ocr-table');
        if (!table) return { status: 'processing' };

        // Extract table values
        const rows = table.querySelectorAll('tbody tr');
        const data = {};
        rows.forEach(row => {
          const header = row.querySelector('.row-header')?.textContent?.trim();
          const cells = [];
          row.querySelectorAll('td:not(.row-header)').forEach(td => {
            cells.push(td.textContent?.trim());
          });
          if (header) data[header] = cells;
        });

        // Check for marker info
        const infoBar = processor.shadowRoot.querySelector('.info-bar');
        const infoText = infoBar?.textContent?.trim();

        return { status: 'done', data, info: infoText };
      });

      if (result && result.status !== 'processing') break;
      if (attempt % 10 === 0) console.log(`  Still processing... (${attempt * 2}s)`);
    }

    console.log('\n=== PIPELINE RESULT ===');
    console.log(JSON.stringify(result, null, 2));

    // Take screenshot
    await page.screenshot({ path: `${OUTPUT_DIR}/app-result.png`, fullPage: true });
    console.log(`Screenshot saved to ${OUTPUT_DIR}/app-result.png`);

    // Also grab individual cell previews for the first few cells
    if (result?.status === 'done') {
      console.log('\n=== OCR RESULTS ===');
      for (const [row, values] of Object.entries(result.data)) {
        console.log(`${row}: ${values.join(' | ')}`);
      }
    }

  } finally {
    await browser.close();
    vite.kill();
    try { execSync('pkill -f "vite.*5200"', { stdio: 'ignore' }); } catch {}
  }
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
