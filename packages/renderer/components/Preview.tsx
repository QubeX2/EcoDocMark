import React, { useState, useEffect, useCallback } from 'react'
import { EcoDocMark } from '../../../modules/eco-doc-mark/eco-doc-mark'
import Document from '../components/preview/Document'

interface Props {
  doc: string
}

export interface SymbolObj {
  type: string
  items?: string[]
  title?: string
  headers?: string[]
  rows?: string[]
}

export interface Section {
  symbols: SymbolObj[]
  id: string
  tabIndex: number
}

export default function Preview({ doc }: Props) {
  const [tabs, setTabs] = useState<string[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)

  const handleTabClick = useCallback((index: number) => {
    setSelectedTabIndex(index)
  }, [])

  useEffect(() => {
    const m = EcoDocMark.CreateMap(doc)
    console.log(m)
    const tabItems = m.children.filter(x => x.key === 'Tab')
    let tabIndex = 0
    const tabNames = [...(m.children.length > 1 && m.children[0].key !== 'Tab' ? [''] : []), ...tabItems.map(t => t.value)]
    let currentTab = ''
    const ps: Section[] = [] // pages

    const cs = [m, ...tabItems]
    let pageIndex = 0
    for (const c of cs) {
      const symbols = c.children.filter(x => x.key === 'Symbol')
      if (symbols.length) {
        for (const symbol of symbols) {
          if(symbol.parent && symbol.parent.key === 'Tab' && currentTab !== symbol.parent.value) {
            currentTab = symbol.parent.value
            tabIndex++
          }
          const pg: Section = {
            id: `id-page-${pageIndex}`,
            tabIndex: tabIndex,
            symbols: [],
          }
          const ls = symbol.children.find(w => w.key === 'List')
          if (ls) {
            const tv = symbol.children.find(w => w.key === 'Text')?.value
            const sl:SymbolObj = {
              type: 'SymbolList',
              title: tv ? tv : '',
              headers: [],
              rows: []
            }
            for (const row of ls.children) {
              if (row.key === 'ListHeader') {
                sl.headers.push(row.children.map(x => x.value))
              } else {
                sl.rows.push(row.children.map(x => x.value))
              }
            }
            pg.symbols.push(sl)
          } else {
            const s:SymbolObj = {
              type: 'SymbolItem',
              items: symbol.children.map(x => x.value)
            }
            pg.symbols.push(s)
          }
          pageIndex++
          ps.push(pg)
        }
      }
    }
    setTabs(tabNames)
    setSections(ps)
  }, [doc])

  return (
    <Document tabs={tabs} sections={sections} selectedIndex={selectedTabIndex} onChange={handleTabClick} />
  )
}
