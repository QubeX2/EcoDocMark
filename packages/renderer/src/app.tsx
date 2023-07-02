import React, { useState, useCallback } from 'react'
import './App.css'
import NoteBookList from '../components/NoteBookList'
import Editor from '../components/Editor'
import Preview from '../components/Preview'
import Toolbar from '../components/Toolbar'

export default function App() {
  const [doc, setDoc] = useState<string>('# hello world!')
  // run at start
  const handleEditorChange = useCallback((doc: string) => {
    setDoc(doc)
  }, [])
  return (
    <div className="w-full h-full nx-max-height">
      <div className="flex flex-col w-full h-full">
        <Toolbar />
        <div className="h-full w-full flex flex-row justify-stretch">
          <NoteBookList />
          <Editor onChange={handleEditorChange} initialDoc={doc} />
          <Preview doc={doc} />
        </div>
      </div>
    </div>
  )

}

