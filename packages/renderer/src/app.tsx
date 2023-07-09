import React, {useState, useCallback} from 'react'
import './App.css'
import FinancialList from '../components/FinancialList'
import Editor from '../components/Editor'
import Preview from '../components/Preview'
import Toolbar from '../components/Toolbar'

export default function App() {
  const example = `
.currency-suffix: kr

I# Income {
  Type    | Amount
  Income  | 2500
  Pension | 3650
  Sum     | IS#!SUM(I#,2)
}

E# Expenses {
  Type     | Amount
  PT       | 1600
  Rent     | 4500
  Car Loan | 1900
  Montly   | !VAL(MS#)
  Sum      | ES#!SUM(E#,2)
}

S# Saldo | !SUB(!VAL(IS#); !VAL(ES#))

T# Test | !ADD( !SUB( !VAL(IS#); !VAL(ES#) ) ; !VAL(IS#) )

@Monthly Expenses
M# Monthly {
  Type         | Amount
  Netflix      | 99
  Google       | 170
  Amazon Prime | 65
  Sum          | MS#!SUM(M#,2)
}`

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
