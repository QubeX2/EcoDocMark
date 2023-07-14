import InputStream from './inputstream';
import TokenStream from './tokenstream';
import Parse from './parser';

/**
 *
 */
export function CreateMap(doc: string) {
  const is = InputStream(doc);
  const ts = TokenStream(is);
  const prog = Parse(ts);
  console.log(prog);
  console.log('==========================================');
}

function isNumeric(val: any): boolean {
  return !(val instanceof Array) && val - parseFloat(val) + 1 >= 0;
}
