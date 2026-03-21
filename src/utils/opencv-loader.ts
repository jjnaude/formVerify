/**
 * Async loader for OpenCV.js via script tag.
 *
 * Loads the pre-built OpenCV.js from a CDN and waits for WASM
 * initialization. This avoids Vite bundling issues with the npm
 * package (Node.js API externalization breaks WASM init).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CV = any;

declare global {
  interface Window {
    cv: CV;
    Module: { onRuntimeInitialized: () => void };
  }
}

const OPENCV_CDN_URL =
  'https://docs.opencv.org/4.10.0/opencv.js';

let loadPromise: Promise<CV> | null = null;

export function loadOpenCV(): Promise<CV> {
  if (window.cv?.Mat) return Promise.resolve(window.cv);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<CV>((resolve, reject) => {
    // Set up the callback before loading the script
    window.Module = {
      onRuntimeInitialized() {
        resolve(window.cv);
      },
    };

    const script = document.createElement('script');
    script.src = OPENCV_CDN_URL;
    script.async = true;
    script.onload = () => {
      // If cv is already ready (no WASM needed), resolve immediately
      if (window.cv?.Mat) {
        resolve(window.cv);
      }
      // Otherwise onRuntimeInitialized will fire
    };
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load OpenCV.js from CDN'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
