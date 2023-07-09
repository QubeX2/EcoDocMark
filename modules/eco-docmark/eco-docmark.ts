import { isDate } from "moment"
import InputStream from "./inputstream";
import TokenStream from "./tokenstream";

/**
 *
 */
export function CreateMap(doc: string) {
  let is = InputStream(doc)
  let ts = TokenStream(is)

  while(!ts.eof()) {
    let ast = ts.next()
    console.log(ast)
  }
}

function isNumeric(val: any): boolean {
  return !(val instanceof Array) && (val - parseFloat(val) + 1) >= 0;
}

