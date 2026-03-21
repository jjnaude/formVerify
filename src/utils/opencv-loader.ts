/**
 * Async loader for OpenCV.js via script tag.
 *
 * Loads the self-hosted OpenCV.js (public/opencv.js) and waits for
 * WASM initialization. Self-hosted because:
 * - npm bundle fails (Vite externalizes Node.js APIs, breaking WASM init)
 * - docs.opencv.org CDN is behind Cloudflare challenge protection
 *
 * The file is @techstark/opencv-js 4.12.0 (SINGLE_FILE build with
 * embedded WASM), downloaded from jsdelivr into public/.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

declare global {
  interface Window {
    cv: CV;
  }
}

let cvReady: CV | null = null;
let loadPromise: Promise<CV> | null = null;

export function loadOpenCV(): Promise<CV> {
  if (cvReady) return Promise.resolve(cvReady);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<CV>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${import.meta.env.BASE_URL}opencv.js`;
    script.async = true;

    script.onload = () => {
      const cv = window.cv;

      if (cv?.Mat) {
        // Already initialized (unlikely but handle it)
        cvReady = cv;
        resolve(cv);
      } else if (cv && typeof cv.then === 'function') {
        // The @techstark build returns a thenable. The resolved value
        // is the same object with .then still on it, which causes
        // Promise resolve() to recurse infinitely. We must remove
        // the .then property before resolving.
        cv.then((readyCv: CV) => {
          delete readyCv.then;
          window.cv = readyCv;
          cvReady = readyCv;
          resolve(readyCv);
        });
      } else {
        reject(new Error('OpenCV.js loaded but cv is not available'));
      }
    };

    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load OpenCV.js'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}
