import React, { useState, useEffect, useCallback } from 'react'
import type { EcoMap } from '../../../modules/eco-doc-mark/eco-doc-mark'
import { EcoDocMark } from '../../../modules/eco-doc-mark/eco-doc-mark'

interface Props {
  doc: string
}

export default function Preview({ doc }: Props) {
  const [tabs, setTabs] = useState<string[]>([])
  const [pages, setPages] = useState<string[][]>([])
  const [listHeaders, setListHeaders] = useState<string[][][]>([])
  const [listRows, setListRows] = useState<string[][][]>([])
  const [selectedTab, setSelectedTab] = useState<number>(0)

  const handleTabClick = useCallback((tab: number) => {
    setSelectedTab(tab)
  }, [])

  useEffect(() => {
    const m = EcoDocMark.CreateMap(doc)
    console.log(m)
    const tabItems = m.children.filter(x => x.key === 'Tab')
    const tabNames = [...(m.children.length > 1 && m.children[0].key !== 'Tab' ? [''] : []), ...tabItems.map(t => t.value)]
    const ps = [] // pages
    const ls: string[][] = []  // lists
    const hs: string[][] = []  // headers

    const cs = [m, ...tabItems]
    let pageIndex = 0
    for (const c of cs) {
      ls[pageIndex] = []
      hs[pageIndex] = []
      const symbols = c.children.filter(x => x.key === 'Symbol')
      if (symbols.length) {
        const list = symbols.filter(x => x.children.filter(y => y.key === 'List').length > 0).map((z) => { return z.children.find(w => w.key === 'List') })
        for (const rows of list) {
          if (rows) {
            const hdrs = rows.children.filter(h => h.key === 'ListHeader')
            if (hdrs.length) {
              const row = []
              for (const cell of hdrs) {
                const val = cell.children.map(x => x.value)
                row.push(val)
              }
              hs[pageIndex].push(row)
            }

            const rws = rows.children.filter(r => r.key !== 'ListHeader')
            if (rws.length) {
              const row = []
              for (const cell of rws) {
                const val = cell.children.map(x => x.value)
                row.push(val)
              }
              ls[pageIndex].push(row)
            }
          }
        }
      }
      const pge = symbols.filter(x => x.children.filter(y => y.key === 'List' || y.key === 'Text').length === 2).map((z) => { return z.children[0].value })
      ps.push(pge)
      pageIndex++
    }
    setTabs(tabNames)
    setPages(ps)
    setListRows(ls)
    setListHeaders(hs)
  }, [doc])

  return (
    <div className="bg-white text-black w-3/6 p-1">
      <ul className="cursor-pointer flex flex-row gap-x-1">
        {tabs.map((tabData, tabIndex) => (
          <li className={`text-2xl rounded-t-md ${(selectedTab === tabIndex ? 'bg-blue-300' : 'bg-gray-300')} justify-center px-2`} key={`tab-${tabIndex}`} onClick={() => { handleTabClick(tabIndex) }}>
            {tabData ? tabData : 'Start'}
          </li>
        ))}
      </ul>
      {pages.map((pageData, pageIndex) => (
        <div className={`${(selectedTab !== pageIndex ? 'hidden' : '')} border border-red-500 p-1`} key={`page-${pageIndex}`}>
          {pageData.map((listData, listIndex) => (
            <div key={`ps-${pageIndex}-${listIndex}`}>
              <h1 className="text-2xl" key={`header-${pageIndex}`}>{listData}</h1>
              {listRows[pageIndex][listIndex].length > 0 ? (
                <table className="border w-full" key={`table-${pageIndex}-${listIndex}`}>
                  <thead>
                    {listHeaders[pageIndex][listIndex].map((rowData, rowIndex) => (
                      <tr key={`trh-${pageIndex}-${listIndex}-${rowIndex}`}>
                        {rowData.map((cellData, cellIndex) => (
                          <th className="text-left" key={`th-${pageIndex}-${listIndex}-${rowIndex}-${cellIndex}`}>{cellData}</th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {listRows[pageIndex][listIndex].map((rowData, rowIndex) => (
                      <tr key={`trd-${pageIndex}-${listIndex}-${rowIndex}`}>
                        {rowData.map((cellData, cellIndex) => (
                          <td key={`td-${pageIndex}-${listIndex}-${rowIndex}-${cellIndex}`}>{cellData}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (<></>)}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
