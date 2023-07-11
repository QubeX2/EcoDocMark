/**
 *
 */
export interface IStream {
  next: () => string
  peek: () => string
  current: () => string
  eof: () => boolean
  croak: (msg: string) => void
}

export default function InputStream(input: string) {
  let pos = 0, line = 0, col = 0;

  return {
    next: next,
    peek: peek,
    current: current,
    eof: eof,
    croak: croak
  } as IStream

  function next():string {
    const ch = input.charAt(pos++)
    if(ch === '\n') {
      line++
      col = 0
    } else {
      col++
    }
    return ch
  }

  function current(): string {
    return (pos - 1) >= 0 ? input.charAt(pos - 1) : ''
  }
  function peek(): string {
    return input.charAt(pos)
  }

  function eof(): boolean {
    //return peek() === ''
    return !(pos < input.length)
  }

  function croak(msg: string) {
    throw new Error(`${msg} (${line}:${col})`)
  }
}
