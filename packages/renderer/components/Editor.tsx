import React, { useCallback, useEffect } from 'react'
import useCodeMirror from '../hooks/useCodeMirror'
import { EditorState } from '@codemirror/state'

interface Props {
  initialDoc: string,
  onChange: (doc: string) => void
}

export default function Editor({ initialDoc, onChange }: Props) {
  const handleChange = useCallback(
    (state: EditorState) => onChange(state.doc.toString()), [onChange]
  )
  const [ refContainer, editorView ] = useCodeMirror<HTMLDivElement>({
    initialDoc: initialDoc,
    onChange: handleChange
  })
  useEffect(() => {
    if(editorView) {
    } else {
    }
  }, [editorView])
  return <div className="bg-gray-900 text-white border border-black w-1/3 p-1" ref={refContainer} />
}
