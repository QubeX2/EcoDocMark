import React from 'react'

enum EcoTokenType {
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

interface EcoToken {
  type: EcoTokenType
  value: TypeEcoTokenValue
  first: TypeEcoToken
  parent: TypeEcoToken
  children: EcoToken[]
}

export class EcoDocMark {
  private static CreateToken(type: EcoTokenType, value: TypeEcoTokenValue, first: TypeEcoToken, parent: TypeEcoToken): EcoToken {
    return { type: type, value: value, first: first, parent: parent, children: [] }
  }

  private static Closest(token: TypeEcoToken, type: EcoTokenType): TypeEcoToken {
    while(token) {
      if(token.type === type) {
        return token;
      } else if(token.type === EcoTokenType.Root) {
        return token;
      }      
      token = token.parent;
    }
    return null;
  }

  static Parse(doc: string): string  {
    const config = new Map<string, string>()
    // const errors = new Map<number, string>()
    const validSymbolChars = 'ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789'
    const validNumberChars = '0123456789.'
    const endingChars = '{#%=!'
    let current: TypeEcoToken = null;
    const root: EcoToken = {
      type: EcoTokenType.Root,
      value: null,
      first: null,
      parent: null,
      children: [],
    }

    let i = 0;
    while (i < doc.length) {
      const c = doc.charAt(i)
      switch (c) {
        // .config-{name}
        case '.':
          {
            let configFragment = '';
            while (i++ < doc.length && doc.charAt(i) !== '\n') {
              configFragment += doc.charAt(i)
            }
            const configItem = configFragment.split(':').map(t => t.trim())
            if (configItem.length === 2) {
              config.set(configItem[0], configItem[1])
            }
          }
          break

        // :SYMBOL
        case ':':
          {
            let symbol = '';
            while(i++ < doc.length && validSymbolChars.includes(doc.charAt(i))) {
              symbol += doc.charAt(i)
            }
            if(symbol.length) {
              if(current && current.type === EcoTokenType.Function) {
                current.children.push(EcoDocMark.CreateToken(EcoTokenType.Symbol, symbol, root, current))
              } else {
                current = EcoDocMark.CreateToken(EcoTokenType.Symbol, symbol, root, current === null ? root : current)
                root.children.push(current)
              }
            }
          }
          break

        // NEW-LINE
        case '\n':
          {
            if(current && current.type === EcoTokenType.ListRow) {
              current = current.parent
            }
          }
          break

        // #TEXT
        case '#':
          {
            let text = '';

            while(i++ < doc.length && !endingChars.includes(doc.charAt(i))) {
              text += doc.charAt(i)
            }
            if(current && current.type === EcoTokenType.List) {
              const token = EcoDocMark.CreateToken(EcoTokenType.ListRow, null, root, current)
              current.children.push(token)
              current = token
            } else if(text.length && current) {
              current.children.push(EcoDocMark.CreateToken(EcoTokenType.Text, text, root, current))
            }
          }
          break

        // NUMBER
        case '=':
          {
            let num = '';
            while(i++ < doc.length && validNumberChars.includes(doc.charAt(i))) {
              num += doc.charAt(i)
            }
            if(current && num.length) {
              current.children.push(EcoDocMark.CreateToken(EcoTokenType.Number, Number(num), root, current))
            }
          }
          break;

          // FUNCTION
          case '!':
            {
              let func = '';
              while(i++ < doc.length && doc.charAt(i) !== '(') {
                func += doc.charAt(i)
              } 
              if(current && func.length) {
                const token = EcoDocMark.CreateToken(EcoTokenType.Function, func, root, current);
                current.children.push(token)
              }
            }
            break

          case '(':
            {
              if(i < doc.length && current && current.type === EcoTokenType.Function) {
                i++
              }
            }
            break

          case ')':
            {
              if(current) {
                current = current.parent
              }
            }
            break;

        // LIST-START
        case '{':
          {
            if(current && current.type === EcoTokenType.Symbol) {
              current = EcoDocMark.CreateToken(EcoTokenType.List, null, root, current)
            } 
          }
          break

        // LIST-END, FUNCTION-END
        case '}':
          {
            if(current && current.type === EcoTokenType.List) {
              current = EcoDocMark.Closest(current, EcoTokenType.Root) 
            }
          }
          break

        // LIST-HEADER
        case '[':
          {
            if(current && current.type === EcoTokenType.List) {
              const token = EcoDocMark.CreateToken(EcoTokenType.ListHeader, null, root, current)
              current.children.push(token)
              current = token
            }
          }
          break

        // LIST-HEADER-END
        case ']':
          {
            if(current && current.type === EcoTokenType.ListHeader) {
              current = current.parent
            }
          }
          break
      }
      i++
    }

    console.log(root);

    return `
      <div class="font-bold bg-blue-500">parsed</div>
    `
  }
}

