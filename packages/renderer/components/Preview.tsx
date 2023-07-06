import React, { useState, useMemo, useCallback } from 'react'
import { EcoDocMark } from '../../../modules/eco-doc-mark/eco-doc-mark'
import Document from '../components/preview/Document'
import TabList from './preview/TabList'
import Page from './preview/Page'
import PageSection from './preview/PageSection'
import PageSectionItem from './preview/PageSectionItem'

interface Props {
  doc: string
}

export interface SymbolObj {
  id: string
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
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)

  const handleTabClick = useCallback((index: number) => {
    setSelectedTabIndex(index)
  }, [])

const { sections, tabs } =  useMemo(() => {
    const m = EcoDocMark.CreateMap(doc)
    console.log(m)
    const tabItems = m.children.filter(x => x.key === 'Tab')
    let tabIndex = 0
    const tabs = [...(m.children.length > 1 && m.children[0].key !== 'Tab' ? [''] : []), ...tabItems.map(t => t.value)]
    let currentTab = ''
    const sections: Section[] = [] // pages

    const cs = [m, ...tabItems]
    let unId = 1;
    let pageIndex = 0
    for (const c of cs) {
      const symbols = c.children.filter(x => x.key === 'Symbol')
      if (symbols.length) {
        for (const symbol of symbols) {
          if (symbol.parent && symbol.parent.key === 'Tab' && currentTab !== symbol.parent.value) {
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
            const sl: SymbolObj = {
              id: `id-symbol-${unId++}`,
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
            const s: SymbolObj = {
              id: `id-symbol-${unId++}`,
              type: 'SymbolItem',
              items: symbol.children.map(x => x.value)
            }
            pg.symbols.push(s)
          }
          pageIndex++
          sections.push(pg)
        }
      }
    }
    console.log(sections)
    return { sections, tabs }
  }, [doc])

  return (
    <Document>
      <TabList tabs={tabs} selectedIndex={selectedTabIndex} onChange={handleTabClick} />
      {Array.from({ length: tabs.length }, (_, i) => i).map(x => (
        <Page key={`id-page-${x}`} selected={x === selectedTabIndex}>
          {sections.filter(t => t.tabIndex === x).map((s) => (
            <PageSection key={s.id}>
              {s.symbols.map((sy) => (
                <PageSectionItem key={sy.id} symbol={sy} />
              ))}
            </PageSection>
          ))}
        </Page>
      ))}
    </Document>
  )
}
