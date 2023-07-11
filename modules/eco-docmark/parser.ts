import type { ITokenStream, TToken } from "./tokenstream";


type TAstValue = string | number | boolean | null
type TAstObject = IAbstractSyntaxTree | null

interface IAbstractSyntaxTree {
  type: string
  value?: TAstValue
  func?: TAstObject
  args?: TAstObject[]
  cond?: TAstObject
  then?: TAstObject
  else?: TAstObject
  prog?: TAstObject[]
  list?: TAstObject
  rows?: TAstObject[]
  cells?: TAstObject[]
}

export default function Parse(input: ITokenStream) {

  return parse_toplevel()
  function is_punc(ch?: string | null): boolean {
    let tok = input.peek()
    if (ch === null) {
      return tok !== null && tok.type === 'punc'
    } else {
      return tok !== null && tok.type === 'punc' && tok.value as string === ch
    }
  }
  function is_newline(): boolean {
    let tok = input.peek()
    return tok !== null && tok.type === 'newline'
  }
  function is_config(): boolean {
    let tok = input.peek()
    return tok !== null && tok.type === 'config'
  }
  function is_value(): boolean {
    let tok = input.peek()
    return tok !== null && ['string', 'boolean', 'number'].includes(tok.type)
  }
  function is_symbol(): boolean {
    let tok = input.peek()
    return tok !== null && tok.type === 'symbol'
  }

  function parse_config(): TAstObject {
    let tok = input.next()
    if (is_punc(':')) {
      input.next() // consume ':'
      return { type: 'config', value: tok !== null ? tok.value : '', args: [parse_expression()] }
    } else {
      input.croak('Error expecting : after config name')
    }
    return null
  }

  function parse_value(): TAstObject {
    let tok = input.next()
    if (tok != null) {
      return { type: tok.type, value: tok.value }
    } else {
      input.croak('Error expecting a value for config')
    }
    return null
  }

  function parse_cells():TAstObject[] {
    const cells:TAstObject[] = []
    console.log(input.peek())
    return cells
  }

  function parse_rows(): TAstObject[] {
    const rows:TAstObject[] = []
    while(!is_punc('}')) {
      let tok = input.next()
      if(tok !== null) {
        rows.push({ type: 'row', cells: parse_cells() })
      }
    }

    return rows
  }

  function parse_list(): TAstObject {
    while(is_punc() || is_newline()) {
      input.next()
    }
    return { type: 'list', rows: parse_rows() }
  }

  function parse_symbol(): TAstObject {
    let tok = input.next()
    if (tok != null && is_punc(':')) {
      input.next()
      // list
      if (is_punc('{')) {
        input.next() // consume {
        return { type: 'symbol', value: tok.value, list: parse_list() }
      } else {

      }
    }
    return null
  }

  function parse_expression(): TAstObject {
    if (is_newline()) {
      input.next()
      return null
    }
    if (is_config()) {
      return parse_config()
    }
    if (is_value()) {
      return parse_value()
    }
    if (is_symbol()) {
      return parse_symbol()
    }

    input.next();
    return null
  }

  function parse_toplevel() {
    let prog: TAstObject[] = []
    while (!input.eof()) {
      const expr = parse_expression()
      if (expr !== null) {
        prog.push(expr)
      }
    }
    return { type: 'prog', prog: prog }
  }
}
