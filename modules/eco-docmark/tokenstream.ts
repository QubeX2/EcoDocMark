import type { IStream } from "./inputstream";

type TAlphaNum = string | number | null
type TToken = IToken | null
interface IToken {
  type: string
  value: TAlphaNum
  args?: IToken[]
}

export default function TokenStream(input: IStream) {
  let current: TToken = null
  let keywords: string = " SUM ADD SUB IF "
  return {
    next: next,
    peek: peek,
    eof: eof,
    croak: input.croak
  }

  // IS
  function is_keyword(x: string): boolean {
    return keywords.indexOf(` ${x} `) >= 0
  }
  function is_digit(ch: string): boolean {
    return /[0-9]/i.test(ch)
  }
  function is_whitespace(ch: string): boolean {
    return " \t\n".indexOf(ch) >= 0
  }
  function is_separator(ch: string): boolean {
    return "|;".indexOf(ch) >= 0
  }
  function is_func_start(ch: string): boolean {
    return ch === '!'
  }
  function is_symbol_start(ch: string): boolean {
    return /[A-Z]/.test(ch)
  }
  function is_id(ch: string): boolean {
    return is_symbol_start(ch) || ch === '#'
  }
  function is_eos(ch: string): boolean {
    return "{|#\n".indexOf(ch) >= 0
  }
  function is_config_start(ch: string): boolean {
    return ch === '.'
  }
  function is_config(ch: string): boolean {
    return is_config_start(ch) || /[a-z\-:]+/.test(ch)
  }
  function is_eol(ch: string): boolean {
    return ch === '\n'
  }
  function is_punc(ch: string): boolean {
    return ",;{}".indexOf(ch) >= 0
  }

  // READ
  function read_next() {
    read_while(is_whitespace)
    if (input.eof()) return null
    let ch = input.peek()
    if (is_digit(ch)) return read_number()
    if (is_config_start(ch)) return read_config()
    if (is_id(ch)) {
      let o = read_string()
      return input.peek() === '#' ? { type: 'symbol', value: o.value + input.next() } : o
    }
    if (is_punc(ch)) { return { type: 'punc', value: input.next() } }
    input.croak(`Can't handle character: ${ch}`)
    return null
  }

  function read_while(predicate: (arg: string) => boolean) {
    let str = ''
    while (!input.eof() && predicate(input.peek())) {
      str += input.next()
    }
    return str
  }

  function read_config(): IToken {
    let str = ''
    while (!input.eof()) {
      let ch = input.next()
      str += ch
      if(!is_config(input.peek())) break
    }
    return { type: 'config', value: str, args: [read_string()] }
  }

  function read_number(): IToken {
    let has_dot = false
    let number = read_while((ch) => {
      if (ch === '.') {
        if (has_dot) {
          return false
        } else {
          has_dot = true
          return true
        }
      }
      return is_digit(ch)
    })
    return { type: 'number', value: parseFloat(number) }
  }

  function read_string(): IToken {
    let str = ''
    while (!input.eof()) {
      let ch = input.next()
      str += ch
      if(is_eos(input.peek())) break
    }
    return { type: 'string', value: str.trim() }
  }

  function peek() {
    return current || (current = read_next())
  }

  function next() {
    let tok = current
    current = null
    return tok || read_next()
  }

  function eof() {
    return peek() === null
  }
}
