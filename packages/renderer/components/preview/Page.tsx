import React from "react";

interface Props {
  selected: boolean,
  children: React.ReactNode[]
}

export default function Page(props: Props) {
  const { children, selected } = props

  return (
    <div className={`${!selected ? 'hidden' : ''} border border-red-500 p-1`}>
      {children}
    </div>
  )
}
