export enum EcoTokenType {
  Empty = 0,
  Root = 1,
  Symbol = 2,
  Number = 3,
  Text = 4,
  Date = 5,
  SymbolRow = 6,
  TextRow = 7,
  Tab = 8,
  Function = 9,
  Config = 10,
}

type TypeEcoToken = EcoToken | null
type TypeEcoTokenValue = string | null | number

export interface EcoToken {
  type: EcoTokenType
  value: TypeEcoTokenValue
  parent: TypeEcoToken
  children: EcoToken[]
}

export interface EcoMap {
  key: string
  value: string
  children: EcoMap[]
  parent: EcoMap | null
}

/**
 *
 */
export function CreateMap(doc: string): EcoMap {
  const root: EcoToken = {
    type: EcoTokenType.Root,
    value: null,
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
  worker.TraverseTokens(root, map)
  return map
}

function isNumeric(val: any): boolean {
  return !(val instanceof Array) && (val - parseFloat(val) + 1) >= 0;
}

function createToken(
  type: EcoTokenType,
  value: TypeEcoTokenValue,
  parent: TypeEcoToken,
): EcoToken {
  return { type: type, value: value, parent: parent, children: [] }
}

function getClosestToken(token: TypeEcoToken, type: EcoTokenType): TypeEcoToken {
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
function addTokenChild(parent: TypeEcoToken, value: string) {
  if (parent === null) return

  if (isNumeric(value)) {
    parent.children.push(createToken(EcoTokenType.Number, Number(value), parent))
  } else if (value.startsWith('!')) {
    parent.children.push(createToken(EcoTokenType.Function, value, parent))
  } else {
    parent.children.push(createToken(EcoTokenType.Text, value, parent))
  }
}

/**
 *
 */
function createTabToken(parent: TypeEcoToken, value: string) {
  const token = createToken(EcoTokenType.Tab, value, parent)
  parent?.children.push(token)
  return token
}
/**
 *
 */
function getLineItems(line: string): string[] {
  return line.split('|').map((t => t.trim()))
}

/**
 *
 */
class EcoDocMark {
  readonly token: EcoToken

  constructor(token: EcoToken) {
    this.token = token
  }

  /**
   *
   */
  TraverseTokens(token: EcoToken, map: EcoMap) {
    for (const child of token.children) {
      const nmap = {
        'key': EcoTokenType[child.type],
        'value': child.value ? child.value.toString() : '',
        'children': [],
        'parent': map,
      }
      map.children.push(nmap)
      this.TraverseTokens(child, nmap)
    }
  }

  /**
   *
   */
  Parse(doc: string) {
    const lines: string[] = doc.split('\n')
    let hasFoundTab = false
    let index = 0

    let currentToken: TypeEcoToken = this.token
    for (const line of lines) {
      // Config
      if (/^\.[a-z\-:]+/.test(line)) {
        currentToken?.children.push(createToken(EcoTokenType.Config, line, currentToken))
      }

      // Tab
      if (/^@.+?/.test(line)) {
        hasFoundTab = true

        const tab = line.trim().substring(1)
        // add to root
        currentToken = getClosestToken(currentToken, EcoTokenType.Root)
        currentToken = createTabToken(currentToken, tab)
      }

      // Symbol
      if (/^[A-Z_0-9]+:/.test(line)) {
        if (!hasFoundTab) {
          hasFoundTab = true
          currentToken = createTabToken(currentToken, 'Start')
        }

        const symbol = line.substring(0, line.indexOf(':'))
        // add to tab
        const lineTkn = createToken(EcoTokenType.SymbolRow, null, currentToken)
        lineTkn.children.push(createToken(EcoTokenType.Symbol, symbol, currentToken))
        currentToken?.children.push(lineTkn)
        const items = getLineItems(line.substring(line.indexOf(':') + 1))
        for (const item of items) {
          addTokenChild(lineTkn, item)
        }

        // Line
      } else if (line.length > 0 && !line.startsWith('.')) {
        if (!hasFoundTab) {
          hasFoundTab = true
          currentToken = createTabToken(currentToken, 'Start')
        }

        const lineTkn = createToken(EcoTokenType.TextRow, null, currentToken)
        currentToken?.children.push(lineTkn)
        const items = getLineItems(line)
        for (const item of items) {
          addTokenChild(lineTkn, item)
        }
      } else {
        currentToken.children.push(createToken(EcoTokenType.Empty, null, currentToken))
      }

      index++
    }
  }
}
