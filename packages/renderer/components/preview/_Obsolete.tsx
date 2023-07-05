import React from "react"
import PageItem from "./PageItem"

interface Props {
  pages: number[]
  selected: boolean
}

export function PageList(props: Props) {
  return (
    <>
    </>
  )
}
    /*
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
*/
