import { isDate } from "moment"

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

/**
 * TYPES
 */
type TEcoToken = EcoToken | null
type TAlphaNumValue = string | null | number
type TEcoMap = EcoMap | null
type TEcoArgTree = EcoArgTree | null
/**
 * INTERFACES
 */
interface EcoToken {
  type: EcoTokenType
  value: TAlphaNumValue
  parent: TEcoToken
  children: EcoToken[]
}

interface EcoArgTree {
  value: TAlphaNumValue
  children: EcoArgTree[]
  symbol: TAlphaNumValue
}

export interface EcoMap {
  key: string
  value: string
  functionValue?: TAlphaNumValue
  children: EcoMap[]
  parent: TEcoMap
  list?: number
  symbol?: number
  argTree?: TEcoArgTree
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
  worker.ManageFunctions(map)
  console.log('symbols', worker.symbols)
  console.log('functions', worker.functions)
  return map
}

/**
 *
 */
function findMap(children: EcoMap[], key: string, value: string): TEcoMap {
  for (const item of children) {
    if (item.key === key && item.value === value) return item

    if (item.children) {
      const desiredNode: TEcoMap = findMap(item.children, key, value)
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
  value: TAlphaNumValue,
  parent: TEcoToken,
): EcoToken {
  return { type: type, value: value, parent: parent, children: [] }
}

function getClosestToken(token: TEcoToken, type: EcoTokenType): TEcoToken {
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
function createTabToken(parent: TEcoToken, value: string) {
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
  readonly symbols: Map<string, EcoMap | TAlphaNumValue>
  readonly functions: Map<string, EcoMap>

  constructor(token: EcoToken) {
    this.token = token
    this.symbols = new Map<string, EcoMap>()
    this.functions = new Map<string, EcoMap>()
  }

  /**
   *
   */
  AddTokenChild(parent: TEcoToken, value: string) {
    if (parent === null) return

    if (isNumeric(value)) {
      parent.children.push(createToken(EcoTokenType.Number, Number(value), parent))
    } else if (isDate(value)) {
      parent.children.push(createToken(EcoTokenType.Date, value, parent))
    } else if (value.match(/[A-Z_0-9]+:![A-Z]+\(.*?\)/) || value.startsWith('!')) {
      parent.children.push(createToken(EcoTokenType.Function, value, parent))
    } else {
      parent.children.push(createToken(EcoTokenType.Text, value, parent))
    }
  }

  /**
   *
   */
  private FuncSum(map: EcoMap, args: string[]): TAlphaNumValue {
    args = args[0].split(':').map(x => x.split(',')).flat()
    if (args.length === 1) return null

    let s = findMap(map.children, 'Symbol', args[0])
    if (s && s.parent && s.parent.list !== undefined && s.parent.list >= 0) {
      let list = s.parent?.parent?.children.filter(x => x.list === (s && s.parent ? s.parent.list : -1) && x.key === 'TextRow')
      if (Array.isArray(list)) {
        let sum: number = 0
        let idx = parseInt(args[1]) - 1
        list.forEach((v, i) => {
          if (idx < v.children.length) {
            if (v.children[idx].key === 'Number') {
              sum += parseFloat(v.children[idx].value)
            }
          }
        })
        return sum
      }
    }
    return null
  }

  /**
   *
   */
  SolveFunction(map: EcoMap, fn: string, cb: (value: TAlphaNumValue, smbl: string) => void) {
  }

  /**
   *
   */
  ExtractArgs(fnStr: string) {
    /*
    let m = fnStr.match('![A-Z]+\((.+)\)')
    console.log('match', m)
  */
    console.log('SPLIT', fnStr.split('(').map(x => x.split(';')))
  }

  /**
   *
   */
  ManageFunctions(map: EcoMap) {
    this.functions.forEach((obj: EcoMap, fnStr: string) => {
      const tree: EcoArgTree = {
        value: null,
        children: [],
        symbol: null
      }
      this.ExtractArgs(fnStr)
      console.log('tree', tree)
    })
  }

  /**
   *
   */
  MananageLists(map: EcoMap) {
    for (const tab of map.children.filter(x => x.key === 'Tab')) {
      let list = 0
      let symbol = 0
      let index = 0
      while (index < tab.children.length) {
        const item = tab.children[index]
        if (item.key === 'SymbolRow' && (index + 1) < tab.children.length) {
          if (tab.children[index + 1].key !== 'Empty') {
            item.list = list
            let j = index
            while (j++ < tab.children.length) {
              if (tab.children[j].key === 'Empty') {
                break;
              } else {
                tab.children[j].list = list
              }
            }
            list++
          } else {
            item.symbol = symbol++
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

      if (child.value) {
        if (child.type === EcoTokenType.Symbol) {
          this.symbols.set(child.value.toString(), obj)
        } else if (child.type === EcoTokenType.Function) {
          const v = child.value as string
          let func = v.substring(v.indexOf('!'))
          obj.value = func
          let symbol = v.substring(0, v.indexOf('!'))
          if (symbol.length) {
            symbol = symbol.substring(0, symbol.indexOf(':'))
            this.symbols.set(symbol, obj)
          }
          this.functions.set(func, obj)
        }
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

    let currentToken: TEcoToken = this.token
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
          this.AddTokenChild(lineTkn, item)
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
            this.AddTokenChild(lineTkn, item)
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
