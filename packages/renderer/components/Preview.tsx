import React, { useRef, useEffect } from 'react'
import { EcoDocMark } from '../../../modules/eco-doc-mark/eco-doc-mark'

interface Props {
  doc: string
}

export default function Preview({ doc }: Props) {
  const refPreview = useRef<HTMLDivElement>(null);
  doc = EcoDocMark.Parse(doc)
  useEffect(() => {
    if(refPreview.current) {
      console.log(doc);
      refPreview.current.innerHTML = doc;
    }
  }, [doc])
  return <div ref={refPreview} className="bg-white text-black w-1/3 p-1" />
}
