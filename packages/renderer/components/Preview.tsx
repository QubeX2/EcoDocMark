import React from 'react'
import type { EcoMap } from '../../../modules/eco-doc-mark/eco-doc-mark'
import { EcoDocMark } from '../../../modules/eco-doc-mark/eco-doc-mark'
import Header from './preview/Header'
import Tab from './preview/Tab'

interface Props {
  doc: string
}

export default function Preview({ doc }: Props) {
  const map: EcoMap = EcoDocMark.CreateMap(doc)
  console.log(map)
  const tabs = [...(map.children.length > 1 && map.children[0].key !== 'Tab' ? [''] : []), ...map.children.filter(x => x.key === 'Tab').map(t => t.value)]
  const symbols = map.children.filter(x => x.key === 'Symbol')
  const headers = symbols.filter(x => x.children.filter(y => y.key === 'List' || y.key === 'Text').length === 2).map((z) => { return z.children[0].value })
  console.log(headers)

  return (
    <div className="bg-white text-black w-1/3 p-1">
      {tabs.map((t, i) => <Tab text={t} headers={[]} key={`tab-${i}`} />)}
      {headers.map((x,i) => <Header text={x} key={`header-${i}`} />)}
    </div>
  )
}
