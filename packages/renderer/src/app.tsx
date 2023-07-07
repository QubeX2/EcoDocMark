import React, {useState, useCallback} from 'react'
import './App.css'
import FinancialList from '../components/FinancialList'
import Editor from '../components/Editor'
import Preview from '../components/Preview'
import Toolbar from '../components/Toolbar'

export default function App() {
  const example = `
.currency-suffix: kr

INC_LIST: Income
  Type    | Amount
  Income  | 2500
  Pension | 3650
  Sum     | !INC_SUM:SUM(INC_LIST)

EXP_LIST: Expenses
  Type | Amount
  PT | 1600
  Rent | 4500
  Car Loan | 1900
  Montly | !VAL(MONTH_SUM)
  Sum | !EXP_SUM:SUM(EXP_LIST)

SALDO: Saldo | !SUB(!VAL(INC_SUM) | !VAL(EXP_SUM))

@Monthly Expenses
MONTH_LIST: Monthly
  Type | Amount
  Netflix | 99
  Google | 170
  Amazon Prime, 65
  Sum | !MONTH_SUM:SUM(MONTH_LIST)

`
  const [doc, setDoc] = useState<string>(example)
  // run at start
  const handleEditorChange = useCallback((doc: string) => {
    setDoc(doc)
  }, [])
  return (
    <div className="w-full h-full nx-max-height">
      <div className="flex flex-col w-full h-full">
        <Toolbar />
        <div className="h-full w-full flex flex-row justify-stretch">
          <FinancialList />
          <Editor
            onChange={handleEditorChange}
            initialDoc={doc}
          />
          <Preview doc={doc} />
        </div>
      </div>
    </div>
  )
}
