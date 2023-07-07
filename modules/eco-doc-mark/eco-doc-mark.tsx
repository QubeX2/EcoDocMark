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

type TypeEcoMap = EcoMap | null
export interface EcoMap {
  key: string
  value: string
  children: EcoMap[]
  parent: TypeEcoMap
  group?: number
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
  worker.MananageLists(map)
  worker.SolveFunctions(map)
  console.log(worker.symbols)
  console.log(worker.functions)
  return map
}

/**
 *
 */
function findMap(children: EcoMap[], key: string, value: string): TypeEcoMap {
  for (const item of children) {
    if (item.key === key && item.value === value) return item

    if (item.children) {
      const desiredNode: TypeEcoMap = findMap(item.children, key, value)
      if (desiredNode) return desiredNode
    }
  }
  return null
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
  readonly symbols: Map<string, EcoMap>
  readonly functions: Map<string, EcoMap>

  constructor(token: EcoToken) {
    this.token = token
    this.symbols = new Map<string, EcoMap>()
    this.functions = new Map<string, EcoMap>()
  }

  /**
   *
   */
  SolveFunctions(map: EcoMap) {
    const item = findMap(map.children, 'Symbol', 'I')
    //    console.log('found', item.parent)
  }
  /**
   *
   */
  MananageLists(map: EcoMap) {
    for (const tab of map.children.filter(x => x.key === 'Tab')) {
      let group = 0
      let index = 0
      while (index < tab.children.length) {
        const item = tab.children[index]
        if (item.key === 'SymbolRow' && (index + 1) < tab.children.length) {
          if (tab.children[index + 1].key !== 'Empty') {
            item.group = group
            let j = index
            while (j++ < tab.children.length) {
              if (tab.children[j].key === 'Empty') {
                break;
              } else {
                tab.children[j].group = group
              }
            }
            group++
          } else {
            item.group = group++
          }
        }
        index++
      }
    }
  }

  /**
   *
   */
  TraverseTokens(parent: EcoToken, map: EcoMap) {
    for (const child of parent.children) {

      const obj = {
        'key': EcoTokenType[child.type],
        'value': child.value ? child.value.toString() : '',
        'children': [],
        'parent': map,
      }

      if(child.type === EcoTokenType.Symbol && child.value) {
        this.symbols.set(child.value.toString(), obj)
      }

      map.children.push(obj)
      this.TraverseTokens(child, obj)
    }
  }

  /**
   *
   */
  Parse(doc: string) {
    const lines: string[] = doc.split('\n')
    let hasFoundTab = false

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
      } else if (!line.startsWith('.') && !line.startsWith('@')) {
        if (line.length > 0) {
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
          if (currentToken.type != EcoTokenType.Root) {
            currentToken?.children.push(createToken(EcoTokenType.Empty, null, currentToken))
          }
        }
      }
    }
    currentToken?.children.push(createToken(EcoTokenType.Empty, null, currentToken))
  }
}
