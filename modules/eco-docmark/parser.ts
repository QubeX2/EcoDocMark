import type {ITokenStream} from './tokenstream';

type TAstValue = string | number | boolean | null;
type TAstObject = IAbstractSyntaxTree | null;

interface IAbstractSyntaxTree {
  type: string;
  value?: TAstValue;
  call?: TAstObject;
  func?: TAstObject;
  args?: TAstObject[];
  cond?: TAstObject;
  then?: TAstObject;
  else?: TAstObject;
  prog?: TAstObject[];
  list?: TAstObject;
  rows?: TAstObject[];
  cells?: TAstObject[];
  child?: TAstObject;
}

export default function Parse(input: ITokenStream) {
  return parse_toplevel();
  function is_punc(ch?: string | null): boolean {
    const tok = input.peek();
    if (ch === undefined) {
      return tok !== null && tok.type === 'punc';
    } else {
      return tok !== null && tok.type === 'punc' && (tok.value as string) === ch;
    }
  }
  function is_type(type: string): boolean {
    const tok = input.peek();
    return tok !== null && tok.type === type;
  }
  function is_value(): boolean {
    const tok = input.peek();
    return tok !== null && ['string', 'boolean', 'number'].includes(tok.type);
  }

  function parse_config(): TAstObject {
    const tok = input.next();
    if (is_punc(':')) {
      input.next(); // consume ':'
      return {type: 'config', value: tok !== null ? tok.value : '', args: [parse_expression()]};
    } else {
      input.croak('Error expecting : after config name');
    }
    return null;
  }

  function parse_value(): TAstObject {
    const tok = input.next();
    if (tok != null) {
      return {type: tok.type, value: tok.value};
    } else {
      input.croak('Error expecting a value for config');
    }
    return null;
  }

  function parse_cells(): TAstObject[] {
    const cells: TAstObject[] = [];
    while (!is_type('eol')) {
      const _a1 = input.peek();
      if (is_punc(',')) {
        input.next();
      } else {
        const cell = parse_expression();
        if (cell) {
          cells.push(cell);
        }
      }
    }
    return cells;
  }

  function parse_rows(): TAstObject[] {
    const rows: TAstObject[] = [];
    while (!is_punc('}')) {
      rows.push({type: 'row', cells: parse_cells()});
      input.next();
    }
    return rows;
  }

  function parse_list(): TAstObject {
    while (is_punc() || is_type('eol')) {
      input.next();
    }
    return {type: 'list', rows: parse_rows()};
  }

  function parse_symbol(): TAstObject {
    const tok = input.next();
    if (tok != null && is_punc(':')) {
      input.next();
      // list
      if (is_punc('{')) {
        input.next(); // consume {
        return {type: 'symbol', value: tok.value, list: parse_list()};
      } else if (is_type('keyword')) {
        return {type: 'symbol', value: tok.value, prog: [parse_expression()]};
      } else {
        if (is_punc()) {
          return null;
        }
        return {type: 'symbol', value: tok.value, child: parse_expression()};
      }
    }
    return null;
  }

  function parse_args(): TAstObject[] {
    const args: TAstObject[] = [];
    return args;
  }

  function parse_func(): TAstObject {
    const tok = input.next();
    if (tok !== null) {
      return {
        type: 'call',
        func: {
          type: 'func',
          value: tok.value,
        },
        args: parse_args(),
      };
    }
    return null;
  }

  function parse_expression(): TAstObject {
    if (is_type('eol')) {
      input.next();
      return null;
    }
    if (is_type('config')) {
      return parse_config();
    }
    if (is_value()) {
      return parse_value();
    }
    if (is_type('symbol')) {
      return parse_symbol();
    }
    if (is_type('keyword')) {
      return parse_func();
    }
    input.next();
    return null;
  }

  function parse_toplevel() {
    const prog: TAstObject[] = [];
    while (!input.eof()) {
      const expr = parse_expression();
      if (expr !== null) {
        prog.push(expr);
      }
    }
    return {type: 'prog', prog: prog};
  }
}
