import InputStream from '../modules/eco-docmark/inputstream';
import TokenStream from '../modules/eco-docmark/tokenstream';
import Parse from '../modules/eco-docmark/parser';
import {test} from 'vitest';

function executeParser(doc: string) {
  console.log(`Parsing: ${doc}`);
  const is = InputStream(doc);
  const ts = TokenStream(is);
  const prog = Parse(ts);
  console.log(JSON.stringify(prog, null, 2));
}

const tests = [
  {
    title: 'Config',
    run: false,
    text: '.currency-suffix: SEK',
  },
  {
    title: 'Text',
    run: false,
    text: 'h2^Text',
  },
  {
    title: 'Symbol Item',
    run: false,
    text: 'I: !SUM(E:2)',
  },
  {
    title: 'Symbol List',
    run: true,
    text: 'E: { b^Type, b^Amount }',
  },
  {
    title: 'Function',
    run: false,
    text: '!SUM(ES:)',
  },
  {
    title: 'Tab',
    run: false,
    text: '@A Tabname',
  },
];

test.each(tests)('Test $title', ({title, run, text}) => {
  if (run) {
    console.log(text);
    executeParser(text);
  }
});

/*
const doc = `
.currency-suffix: kr

h2^Income
I: {
  b^Type, b^Amount
  Income, 2500
  Pension, 3650
  Sum, IS: !SUM(I:2)
}

h2^Expenses
E: {
  b^Type, b^Amount
  PT, 1600
  Rent, 4500
  Car Loan, 1900
  Montly, !VAL(MS:)
  Sum, ES: !SUM(E:2)
}

b^Saldo, !SUB(!VAL(IS:);!VAL(ES:))

@Monthly Expenses
h2^Monthly
M: {
  b^Type, b^Amount
  Netflix, 99
  Google, 170
  Amazon Prime, 65
  Sum, MS:!SUM(M:2)
}
`;

test('Parsing Test', () => {
  const is = InputStream(doc);
  const ts = TokenStream(is);
  const prog = Parse(ts);
  console.log(JSON.stringify(prog, null, 2));
});
*/
