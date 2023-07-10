import type { ITokenStream, TToken } from "./tokenstream";


type TAstValue = string | number | boolean | null
type TAstObject = IAbstractSyntaxTree | null

interface IAbstractSyntaxTree {
  type: string
  value?: TAstValue
  func?: TAstObject
  args?: TAstObject[]
  cond?: TAstObject
  then?: TAstObject
  else?: TAstObject
  prog?: TAstObject[]
}

export default function Parse(input: ITokenStream) {

  return parse_toplevel()
  function is_punc(ch: string): boolean {
    let tok:TToken = input.peek()
    return tok !== null && tok.type === 'punc' && tok.value as string === ch
  }
  function is_newline(): boolean {
    let tok = input.peek()
    return tok !== null && tok.type === 'newline'
  }

  function parse_atom() {

  }

  function parse_toplevel() {
    let prog:TAstObject[] = []
    while(!input.eof()) {
      let tok:TToken = input.next()
      console.log(tok)
    }
    return { type: 'prog', prog: prog }
  }
}
