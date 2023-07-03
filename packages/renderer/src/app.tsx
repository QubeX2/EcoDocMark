import React, {useState, useCallback} from 'react'
import './App.css'
import FinancialList from '../components/FinancialList'
import Editor from '../components/Editor'
import Preview from '../components/Preview'
import Toolbar from '../components/Toolbar'

export default function App() {
  const example = `.currency-suffix: kr

:I 'Income_ {
  ['Type 'Amount]
  'Income =25500
  'Pension =3650
  !ADD(:I)
}

:E 'Expenses_ {
  ['Type 'Amount]
  'Personal Trainer =1600
  'Rent =4500
  'Car Loan =1900
  'Monthly !SUM(M)
  !ADD(:E)
}

:S 'Saldo_ !SUB(!ADD(:I),!ADD(:E))_

@Montly Expenses
:M 'Monthly_ {
  ['Type 'Amount]
  'Netflix =99
  'Google =170
  'Amazon Prime =65
  !ADD(:M)
} `
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
