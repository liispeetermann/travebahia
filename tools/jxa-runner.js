/* JavaScript for Automation runner (macOS built-in, no installs needed) */
ObjC.import('Foundation');
function run(argv) {
  const out = argv[0];
  const files = build();
  const fm = $.NSFileManager.defaultManager;
  let n = 0;
  for (const rel in files) {
    const p = out + '/' + rel;
    fm.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(p.substring(0, p.lastIndexOf('/')), true, $(), $());
    $(files[rel]).writeToFileAtomicallyEncodingError(p, true, $.NSUTF8StringEncoding, $());
    n++;
  }
  return 'Generated ' + n + ' files';
}
