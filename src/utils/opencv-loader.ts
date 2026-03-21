/**
 * Async loader for OpenCV.js WASM runtime.
 * Returns the `cv` module once the WASM is ready.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

let cvInstance: CV | null = null;
let loadPromise: Promise<CV> | null = null;

export function loadOpenCV(): Promise<CV> {
  if (cvInstance) return Promise.resolve(cvInstance);
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const cvModule = await import('@techstark/opencv-js');
    const cv = cvModule.default || cvModule;

    // The module may need async WASM initialization
    if (cv.Mat) {
      cvInstance = cv;
      return cv;
    }

    // Wait for runtime initialization
    await new Promise<void>((resolve) => {
      if (cv.onRuntimeInitialized !== undefined) {
        const original = cv.onRuntimeInitialized;
        cv.onRuntimeInitialized = () => {
          if (typeof original === 'function') original();
          resolve();
        };
      } else {
        // Poll for readiness
        const check = () => {
          if (cv.Mat) resolve();
          else setTimeout(check, 50);
        };
        check();
      }
    });

    cvInstance = cv;
    return cv;
  })();

  return loadPromise;
}
