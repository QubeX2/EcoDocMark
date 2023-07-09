import { isDate } from "moment"

/**
 *
 */
export function CreateMap(doc: string) {
  console.log('doc', doc)
}

function isNumeric(val: any): boolean {
  return !(val instanceof Array) && (val - parseFloat(val) + 1) >= 0;
}

