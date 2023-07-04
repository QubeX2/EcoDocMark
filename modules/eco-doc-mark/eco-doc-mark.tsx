export enum EcoTokenType {
  Root = 1,
  Symbol = 2,
  Number = 3,
  Text = 4,
  Date = 5,
  List = 6,
  ListHeader = 7,
  ListRow = 8,
  Tab = 9,
  Function = 10,
}

type TypeEcoToken = EcoToken | null
type TypeEcoTokenValue = string | null | number

export interface EcoToken {
  type: EcoTokenType
  value: TypeEcoTokenValue
  first: TypeEcoToken
  parent: TypeEcoToken
  children: EcoToken[]
}

export interface EcoMap {
  key: string
  value: string
  children: EcoMap[]
  parent: EcoMap | null
}

export class EcoDocMark {
  readonly token: EcoToken

  constructor(token: EcoToken) {
    this.token = token
  }

  private static CreateToken(
    type: EcoTokenType,
    value: TypeEcoTokenValue,
    first: TypeEcoToken,
    parent: TypeEcoToken,
  ): EcoToken {
    return { type: type, value: value, first: first, parent: parent, children: [] }
  }

  private static Closest(token: TypeEcoToken, type: EcoTokenType): TypeEcoToken {
    while (token) {
      if (token.type === type) {
        return token
      } else if (token.type === EcoTokenType.Root) {
        return token
      }
      token = token.parent
    }
    return null
  }

  /**
   *
   */
  private TraverseToken(token: EcoToken, map: EcoMap) {
    for (const child of token.children) {
      if (child.type === EcoTokenType.Function) return
      const nmap = {
        'key': EcoTokenType[child.type],
        'value': child.value ? child.value.toString() : '',
        'children': [],
        'parent': map,
      }
      map.children.push(nmap)
      this.TraverseToken(child, nmap)
    }
  }

  /**
   *
   */
  static CreateMap(doc: string): EcoMap {
    const root: EcoToken = {
      type: EcoTokenType.Root,
      value: null,
      first: null,
      parent: null,
      children: [],
    }

    const worker = new EcoDocMark(root)
    worker.Parse(doc)

    const map: EcoMap = {
      'key': EcoTokenType[EcoTokenType.Root],
      'value': '',
      'children': [],
      'parent': null,
    }
    worker.TraverseToken(root, map)
    return map
  }

  /**
   *
   */
  private Parse(doc: string) {
    const config = new Map<string, string>()
    // const errors = new Map<number, string>()
    const validSymbolChars = 'ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789'
    // const validNumberChars = '0123456789.'
    const endingChars = '{\'%=!\n]('
    let current: TypeEcoToken = this.token

    let i = 0
    while (i < doc.length) {
      const c = doc.charAt(i)
      // console.log('incoming char', c)
      switch (c) {
        // .config-{name}
        case '.':
          {
            if (current && current.type === EcoTokenType.Root) {
              let configFragment = ''
              while (i++ < doc.length && doc.charAt(i) !== '\n') {
                configFragment += doc.charAt(i)
              }
              const configItem = configFragment.split(':').map(t => t.trim())
              if (configItem.length === 2) {
                config.set(configItem[0], configItem[1])
              }
            }
          }
          break

        // @TAB
        case '@':
          {
            if (current && current.type === EcoTokenType.Tab) {
              current = current.parent
            }
            if (current && current.type === EcoTokenType.Root) {
              let tab = ''
              while (i++ < doc.length && !endingChars.includes(doc.charAt(i))) {
                tab += doc.charAt(i)
              }
              i--
              if (tab.length && current) {
                const token = EcoDocMark.CreateToken(EcoTokenType.Tab, tab, this.token, current)
                current.children.push(token)
                current = token
              }
            }
          }
          break

        // :SYMBOL
        case ':':
          {
            let symbol = ''
            while (i++ < doc.length && validSymbolChars.includes(doc.charAt(i))) {
              symbol += doc.charAt(i)
            }
            i--
            if (symbol.length) {
              if (current && (current.type === EcoTokenType.Root || current.type === EcoTokenType.Tab)) {
                const token = EcoDocMark.CreateToken(
                  EcoTokenType.Symbol,
                  symbol,
                  this.token,
                  current === null ? this.token : current,
                )
                current.children.push(token)
                current = token
              } else if (current) {
                current.children.push(
                  EcoDocMark.CreateToken(EcoTokenType.Symbol, symbol, this.token, current),
                )
              }
            }
          }
          break

        // #TEXT
        case '%':
        case '=':
        case '\'':
          {
            if (current) {
              let text = ''
              while (i++ < doc.length && !endingChars.includes(doc.charAt(i))) {
                text += doc.charAt(i)
              }
              i--
              if (
                text.length &&
                [
                  EcoTokenType.Symbol,
                  EcoTokenType.ListHeader,
                  EcoTokenType.List,
                  EcoTokenType.ListRow,
                ].includes(current.type)
              ) {
                if (current.type === EcoTokenType.List) {
                  const token = EcoDocMark.CreateToken(EcoTokenType.ListRow, null, this.token, current)
                  current.children.push(token)
                  current = token
                }
                let token: TypeEcoToken = null
                if (c === '%') {
                  token = EcoDocMark.CreateToken(EcoTokenType.Date, text, this.token, current)
                } else if (c === '\'') {
                  token = EcoDocMark.CreateToken(EcoTokenType.Text, text, this.token, current)
                } else {
                  token = EcoDocMark.CreateToken(EcoTokenType.Number, text, this.token, current)
                }

                if (token) {
                  current.children.push(token)
                }
              }
            }
          }
          break

        case '!':
          {
            if (current) {
              let func = ''
              while (i++ < doc.length && !endingChars.includes(doc.charAt(i))) {
                func += doc.charAt(i)
              }
              i--
              if (func.length) {
                const token = EcoDocMark.CreateToken(EcoTokenType.Function, func, this.token, current)
                current.children.push(token)
                current = token
              }
            }
          }
          break

        /*
        case '(':
          {
            if (i < doc.length && current && current.type === EcoTokenType.Function) {
            }
          }
          break; */

        case ')':
          {
            if (current && current.type === EcoTokenType.Function) {
              current = current.parent
            }
          }
          break

        // LIST-START
        case '{':
          {
            if (current && current.type === EcoTokenType.Symbol) {
              const token = EcoDocMark.CreateToken(EcoTokenType.List, null, this.token, current)
              current.children.push(token)
              current = token
            }
          }
          break

        // LIST-END, FUNCTION-END
        case '}':
          {
            if (current && current.type === EcoTokenType.List) {
              let token = EcoDocMark.Closest(current, EcoTokenType.Tab)
              if (!token) {
                token = EcoDocMark.Closest(current, EcoTokenType.Root)
              }
              current = token
            }
          }
          break

        case '\n':
          {
            if (current && [EcoTokenType.Symbol, EcoTokenType.ListRow].includes(current.type)) {
              current = current.parent
            }
          }
          break

        // LIST-HEADER
        case '[':
          {
            if (current && current.type === EcoTokenType.List) {
              const token = EcoDocMark.CreateToken(EcoTokenType.ListHeader, null, this.token, current)
              current.children.push(token)
              current = token
            }
          }
          break

        // LIST-HEADER-END
        case ']':
          {
            if (current && current.type === EcoTokenType.ListHeader) {
              current = current.parent
            }
          }
          break
      }
      // console.log('type', current ? EcoTokenType[current.type] : '')
      // console.log('exit char', doc.charAt(i))
      i++
    }
    console.log(this.token)
  }
}
