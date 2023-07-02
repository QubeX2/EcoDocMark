import React from 'react'
import './App.css'
import NoteBookList from '../components/NoteBookList'
import Editor from '../components/Editor'
import Preview from '../components/Preview'
import Toolbar from '../components/Toolbar'

export default function App() {
  return (
    <div className="w-full h-full nx-max-height">
      <div className="flex flex-col w-full h-full">
        <Toolbar />
        <div className="h-full w-full flex flex-row justify-stretch">
          <NoteBookList />
          <Editor />
          <Preview />
        </div>
      </div>
    </div>
  )

}

