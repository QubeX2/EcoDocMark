import type { IStream } from "./inputstream";

export type TAlphaNum = string | number | null
export type TToken = IToken | null

export interface ITokenStream {
  next: () => TToken
  peek: () => TToken
  eof: () => boolean
  croak: () => void
}

export interface IToken {
  type: string
  value: TAlphaNum
  args?: IToken[]
  func?: IToken
}

export default function TokenStream(input: IStream) {
  let current: TToken = null
  let keywords: string = " SUM ADD SUB IF VAL "
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
    return " \t".indexOf(ch) >= 0
  }
  function is_func_start(ch: string): boolean {
    return ch === '!'
  }
  function is_symbol(ch: string): boolean {
    return /[A-Z]/.test(ch)
  }
  function is_eos(ch: string): boolean {
    return " {},:();\n".indexOf(ch) >= 0
  }
  function is_config_start(ch: string): boolean {
    return ch === '.'
  }
  function is_string(ch: string): boolean {
    return /[a-zåäöA-ZÅÄÖ]/.test(ch)
  }

  function is_config(ch: string): boolean {
    return is_config_start(ch) || /[a-z\-]+/.test(ch)
  }
  function is_eol(ch: string): boolean {
    return ch === '\n'
  }
  function is_punc(ch: string): boolean {
    return ",;:{}()".indexOf(ch) >= 0
  }
  function is_tab(ch: string): boolean {
    return ch === '@'
  }

  // READ
  function read_next() {
    read_while(is_whitespace)
    if (input.eof()) return null
    let ch = input.peek()
    if (is_eol(ch)) return { type: 'newline', value: input.next() }
    if (is_digit(ch)) return read_number()
    if (is_config_start(ch)) return read_config()
    if (is_symbol(ch) || is_string(ch)) {
      let o = read_string()
      o = input.peek() === ':' ? { type: 'symbol', value: o.value } : o
      return o
    }
    if (is_punc(ch)) {
      return { type: 'punc', value: input.next() }
    }
    if (is_func_start(ch)) {
      let s = read_string()
      let kw = s.value ? s.value as string : ''
      kw = kw.length > 0 ? kw.substring(1) : ''
      return { type: is_keyword(kw) ? 'keyword' : 'string', value: kw }
    }
    if (is_tab(ch)) {
      return { type: 'tab', value: input.next() }
    }
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
      if (!is_config(input.peek())) break
    }
    return { type: 'config', value: str }
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
      if (is_eos(input.peek())) break
    }
    return { type: 'string', value: str.trim() }
  }

  function peek(): TToken {
    return current || (current = read_next())
  }

  function next(): TToken {
    let tok = current
    current = null
    return tok || read_next()
  }

  function eof(): boolean {
    return peek() === null
  }
}
