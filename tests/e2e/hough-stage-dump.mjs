/**
 * Run Hough-based localization, crop each digit, and dump for comparison.
 * Uses located box positions to crop tightly, then runs through the MNIST pipeline.
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const TEST_IMAGE = '/workspaces/formVerify/data/test-images/20260321_172751.jpg';
const OUTPUT_DIR = '/workspaces/formVerify/data/test-output/hough-stages';
mkdirSync(OUTPUT_DIR, { recursive: true });

const COL_X = [0.0409,0.1109,0.181,0.2511,0.3211,0.3912,0.4613,0.5313,0.6014,0.6714,0.7415,0.8116,0.8816,0.9517];
const ROW_Y = [0.1485, 0.1822, 0.2145];
const BOX_W = 0.0143, BOX_H = 0.0308;
const DIGIT_STRIDE = 0.0159, DECIMAL_STRIDE = 0.0085;
const ROWS = ['received', 'gross_kg', 'nett_kg'];
const IMG_W = 2339, IMG_H = 1654;

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
        const cx = (COL_X[ci] + xOff + BOX_W/2) * IMG_W;
        const cy = (ROW_Y[ri] + BOX_H/2) * IMG_H;
        boxDefs.push({ id: `${ri}_${ci}_d${di}`, cx, cy, row: ri, col: ci, digitIndex: di, expected: next() });
      }
    }
  }
  console.log(`${boxDefs.length} boxes`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('about:blank');
  await page.addScriptTag({ path: '/workspaces/formVerify/public/opencv.js' });
  await page.evaluate(() => new Promise(r => {
    const cv = window.cv; if (cv?.then) cv.then(c => { delete c.then; window.cv = c; r(); }); else r();
  }));

  const imgB64 = readFileSync(TEST_IMAGE).toString('base64');

  // Correct + locate + crop all in one evaluate
  const results = await page.evaluate((args) => {
    const { b64, boxDefs, IMG_W, IMG_H, BOX_W_PX, BOX_H_PX } = JSON.parse(args);
    const cv = window.cv;

    // Load + correct
    const img = new Image();
    return new Promise(resolve => { img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      c.getContext('2d').drawImage(img, 0, 0);
      const src = cv.matFromImageData(c.getContext('2d').getImageData(0,0,c.width,c.height));
      const g = new cv.Mat(); cv.cvtColor(src, g, cv.COLOR_RGBA2GRAY);
      const dict=cv.getPredefinedDictionary(cv.DICT_4X4_50);const params=new cv.aruco_DetectorParameters();
      const refine=new cv.aruco_RefineParameters(10,3,true);const det=new cv.aruco_ArucoDetector(dict,params,refine);
      const corners=new cv.MatVector();const ids=new cv.Mat();const rej=new cv.MatVector();
      det.detectMarkers(g,corners,ids,rej);
      const markers={};for(let i=0;i<ids.rows;i++){const id=ids.intAt(i,0);const co=corners.get(i);const pts=[];
      for(let j=0;j<4;j++)pts.push({x:co.floatAt(0,j*2),y:co.floatAt(0,j*2+1)});co.delete();markers[id]=pts;}
      corners.delete();ids.delete();rej.delete();det.delete();refine.delete();params.delete();dict.delete();g.delete();
      const ci=[2,3,0,1];const tl=markers[0][ci[0]],tr=markers[1][ci[1]],br=markers[2][ci[2]],bl=markers[3][ci[3]];
      const sp=cv.matFromArray(4,1,cv.CV_32FC2,[tl.x,tl.y,tr.x,tr.y,br.x,br.y,bl.x,bl.y]);
      const dp=cv.matFromArray(4,1,cv.CV_32FC2,[0,0,IMG_W,0,IMG_W,IMG_H,0,IMG_H]);
      const M=cv.getPerspectiveTransform(sp,dp);const corrected=new cv.Mat();
      cv.warpPerspective(src,corrected,M,new cv.Size(IMG_W,IMG_H));
      sp.delete();dp.delete();M.delete();src.delete();

      // Hough
      const gray=new cv.Mat();cv.cvtColor(corrected,gray,cv.COLOR_RGBA2GRAY);
      const edges=new cv.Mat();cv.Canny(gray,edges,50,150);
      const lines=new cv.Mat();cv.HoughLinesP(edges,lines,1,Math.PI/180,30,15,5);
      const AT=3;const hLines=[],vLines=[];
      for(let i=0;i<lines.rows;i++){
        const x1=lines.intAt(i,0),y1=lines.intAt(i,1),x2=lines.intAt(i,2),y2=lines.intAt(i,3);
        const a=Math.abs(Math.atan2(y2-y1,x2-x1)*180/Math.PI);
        if(a<AT||a>180-AT)hLines.push({y:(y1+y2)/2,x1:Math.min(x1,x2),x2:Math.max(x1,x2)});
        else if(Math.abs(a-90)<AT)vLines.push({x:(x1+x2)/2,y1:Math.min(y1,y2),y2:Math.max(y1,y2)});
      }
      lines.delete();edges.delete();

      const SR=30,ST=0.4;
      function findBox(eCX,eCY,eW,eH){
        const hW=eW/2,hH=eH/2,eT=eCY-hH,eB=eCY+hH,eL=eCX-hW,eR=eCX+hW;
        const tC=hLines.filter(h=>Math.abs(h.y-eT)<SR&&h.x1<eCX&&h.x2>eCX).map(h=>h.y);
        const bC=hLines.filter(h=>Math.abs(h.y-eB)<SR&&h.x1<eCX&&h.x2>eCX).map(h=>h.y);
        const lC=vLines.filter(v=>Math.abs(v.x-eL)<SR&&v.y1<eCY&&v.y2>eCY).map(v=>v.x);
        const rC=vLines.filter(v=>Math.abs(v.x-eR)<SR&&v.y1<eCY&&v.y2>eCY).map(v=>v.x);
        let bT=eT,bB=eB,hF=false,bHS=9e9;
        for(const t of tC)for(const b of bC){if(b<=t)continue;const se=Math.abs((b-t)-eH)/eH;
          if(se>ST)continue;const ce=Math.abs((t+b)/2-eCY);const s=se+ce/eH*0.5;
          if(s<bHS){bHS=s;bT=t;bB=b;hF=true;}}
        let bL=eL,bR=eR,vF=false,bVS=9e9;
        for(const l of lC)for(const r of rC){if(r<=l)continue;const se=Math.abs((r-l)-eW)/eW;
          if(se>ST)continue;const ce=Math.abs((l+r)/2-eCX);const s=se+ce/eW*0.5;
          if(s<bVS){bVS=s;bL=l;bR=r;vF=true;}}
        return{top:Math.round(bT),bottom:Math.round(bB),left:Math.round(bL),right:Math.round(bR),
          cx:(bL+bR)/2,cy:(bT+bB)/2,w:Math.round(bR-bL),h:Math.round(bB-bT),found:hF||vF};
      }

      // Locate iteratively
      const rowGroups={};
      for(const b of boxDefs){if(!rowGroups[b.row])rowGroups[b.row]=[];rowGroups[b.row].push(b);}

      const output=[];
      for(const[_,rowBoxes]of Object.entries(rowGroups)){
        rowBoxes.sort((a,b)=>a.col!==b.col?a.col-b.col:a.digitIndex-b.digitIndex);
        let dX=0,dY=0;
        for(const box of rowBoxes){
          const sCX=box.cx+dX,sCY=box.cy+dY;
          const loc=findBox(sCX,sCY,BOX_W_PX,BOX_H_PX);
          if(loc.found){dX=loc.cx-box.cx;dY=loc.cy-box.cy;}

          // Crop from the LOCATED position (inset 2px for border)
          const inset=2;
          const cl=Math.max(0,loc.left+inset),ct=Math.max(0,loc.top+inset);
          const cr=Math.min(IMG_W-1,loc.right-inset),cb=Math.min(IMG_H-1,loc.bottom-inset);
          const cw=cr-cl,ch=cb-ct;
          if(cw<4||ch<4){output.push({id:box.id,expected:box.expected,found:false});continue;}

          const roi=corrected.roi(new cv.Rect(cl,ct,cw,ch));
          // Grayscale
          const gCrop=new cv.Mat();cv.cvtColor(roi,gCrop,cv.COLOR_RGBA2GRAY);
          roi.delete();

          // Save raw crop
          const rc=document.createElement('canvas');rc.width=gCrop.cols;rc.height=gCrop.rows;
          cv.imshow(rc,gCrop);
          const rawB64=rc.toDataURL('image/png').split(',')[1];

          // MNIST preprocessing: resize to 20x20 centered in 28x28, percentile normalize
          const tgt=20;const scale=Math.min(tgt/gCrop.cols,tgt/gCrop.rows);
          const nw=Math.max(1,Math.round(gCrop.cols*scale)),nh=Math.max(1,Math.round(gCrop.rows*scale));
          const resized=new cv.Mat();cv.resize(gCrop,resized,new cv.Size(nw,nh),0,0,cv.INTER_AREA);gCrop.delete();
          const vals=[];for(let y=0;y<nh;y++)for(let x=0;x<nw;x++)vals.push(resized.ucharAt(y,x));
          vals.sort((a,b)=>a-b);
          const lo=vals[Math.floor(vals.length*0.05)],hi=vals[Math.floor(vals.length*0.95)],rng=hi-lo||1;
          const input=new Float32Array(784);
          const ox=Math.round((28-nw)/2),oy=Math.round((28-nh)/2);
          for(let y=0;y<nh;y++)for(let x=0;x<nw;x++){
            const v=resized.ucharAt(y,x);const idx=(oy+y)*28+(ox+x);
            if(idx>=0&&idx<784)input[idx]=Math.max(0,Math.min(1,(hi-v)/rng));
          }
          resized.delete();

          // Render MNIST at 10x
          const mc=document.createElement('canvas');mc.width=280;mc.height=280;
          const mctx=mc.getContext('2d');mctx.fillStyle='black';mctx.fillRect(0,0,280,280);
          for(let y=0;y<28;y++)for(let x=0;x<28;x++){
            const v=Math.round(input[y*28+x]*255);
            if(v>3){mctx.fillStyle=`rgb(${v},${v},${v})`;mctx.fillRect(x*10,y*10,10,10);}
          }
          const mnistB64=mc.toDataURL('image/png').split(',')[1];

          output.push({id:box.id,expected:box.expected,found:loc.found,
            cropSize:`${cw}x${ch}`,rawB64,mnistB64,
            mnistMean:(input.reduce((a,b)=>a+b,0)/784).toFixed(4)});
        }
      }

      corrected.delete();gray.delete();
      resolve(output);
    };img.src='data:image/jpeg;base64,'+b64;});
  }, JSON.stringify({
    b64: imgB64, boxDefs, IMG_W, IMG_H,
    BOX_W_PX: BOX_W * IMG_W, BOX_H_PX: BOX_H * IMG_H,
  }));

  // Save outputs
  let found = 0;
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const pad = String(i).padStart(3, '0');
    if (r.rawB64) {
      writeFileSync(`${OUTPUT_DIR}/digit${pad}_crop_expected${r.expected}.png`, Buffer.from(r.rawB64, 'base64'));
      writeFileSync(`${OUTPUT_DIR}/digit${pad}_mnist_expected${r.expected}.png`, Buffer.from(r.mnistB64, 'base64'));
    }
    if (r.found) found++;
  }

  console.log(`Located: ${found}/${results.length}`);
  console.log(`Crops saved to ${OUTPUT_DIR}/`);

  // Show a few samples
  for (let i = 0; i < Math.min(10, results.length); i++) {
    const r = results[i];
    console.log(`  digit${String(i).padStart(3,'0')} exp=${r.expected} found=${r.found} crop=${r.cropSize} mean=${r.mnistMean}`);
  }

  await browser.close();
}

run().catch(err => { console.error(err); process.exit(1); });
