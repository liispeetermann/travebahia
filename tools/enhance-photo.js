/* Photo enhancer (macOS built-in Core Image, run via osascript).
   usage: osascript -l JavaScript tools/enhance-photo.js <src> <dst> <crop x,y,w,h as 0-1 fractions or "-"> <max long edge px>
   - Vibrance boosts muted colours while protecting skin tones (faces stay natural)
   - gentle contrast + saturation lift, then high-quality downscale and JPEG export */
ObjC.import('Foundation');
ObjC.import('CoreImage');
ObjC.import('AppKit');

function run(argv) {
  const [src, dst, cropArg, maxArg] = argv;
  const url = $.NSURL.fileURLWithPath(src);
  let img = $.CIImage.imageWithContentsOfURLOptions(url, $({ kCIImageApplyOrientationProperty: true }));
  if (!img || img.isNil()) throw new Error('Cannot read ' + src);
  let e = img.extent;
  let W = e.size.width, H = e.size.height;

  if (cropArg && cropArg !== '-') {
    const [cx, cy, cw, ch] = cropArg.split(',').map(Number);
    // Core Image origin is bottom-left; fractions are given from the top-left
    const rect = { origin: { x: e.origin.x + cx * W, y: e.origin.y + (1 - cy - ch) * H }, size: { width: cw * W, height: ch * H } };
    img = img.imageByCroppingToRect(rect);
    img = img.imageByApplyingTransform($.CGAffineTransformMakeTranslation(-rect.origin.x, -rect.origin.y));
    W = rect.size.width; H = rect.size.height;
  }

  const apply = (name, params) => {
    const f = $.CIFilter.filterWithName(name);
    f.setValueForKey(img, 'inputImage');
    for (const k in params) f.setValueForKey($.NSNumber.numberWithDouble(params[k]), k);
    img = f.outputImage;
  };
  apply('CIVibrance', { inputAmount: 0.38 });
  apply('CIColorControls', { inputSaturation: 1.04, inputContrast: 1.05, inputBrightness: 0.008 });

  const max = Number(maxArg) || 2400;
  const scale = Math.min(1, max / Math.max(W, H));
  if (scale < 1) apply('CILanczosScaleTransform', { inputScale: scale, inputAspectRatio: 1 });
  apply('CISharpenLuminance', { inputSharpness: 0.25 });

  const ctx = $.CIContext.context;
  const cg = ctx.createCGImageFromRect(img, img.extent);
  const rep = $.NSBitmapImageRep.alloc.initWithCGImage(cg);
  const data = rep.representationUsingTypeProperties($.NSBitmapImageFileTypeJPEG, $({ NSImageCompressionFactor: 0.8 }));
  data.writeToFileAtomically(dst, true);
  return `${dst} ${Math.round(W * scale)}x${Math.round(H * scale)}`;
}
