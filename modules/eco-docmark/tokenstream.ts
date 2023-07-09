import type { IStream } from "./inputstream";

enum ETokenType {
  None,
  Num,
  String,
}

type TAlphaNum = string | number | null

interface IToken {
  type: ETokenType
  value: TAlphaNum
}

export default function TokenStream(input: IStream) {
  let current = null
  let keywords: string = " SUM ADD SUB IF "
  return {

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
  function is_symbol(ch: string): boolean {
    return is_symbol_start(ch) || ch === '#'
  }
  function is_end_of_string(ch: string): boolean {
    return "|#\n".indexOf(ch) >= 0
  }

  // READ
  function read_while(predicate: (arg: string) => boolean) {
    let str = ''
    while (!input.eof() && predicate(input.peek())) {
      str += input.next()
    }
    return str
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
    return { type: ETokenType.Num, value: parseFloat(number) }
  }

  function read_string(): IToken {
    let ch = input.next()
    let str = ''
    while(!is_end_of_string(ch)) {
      str += ch
      const ch = input.next()
    }
    return { type: ETokenType.String, value: str }
  }
}
