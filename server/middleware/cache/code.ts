var codeCache = global.codeCache;

if(!codeCache) {
  codeCache = { codes: [] };
};

export default function ModifierCodeCache(code=null) {
  if(code) {
    codeCache.codes.push(code);
  }

  return codeCache;
}
