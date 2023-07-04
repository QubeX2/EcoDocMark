import React from "react";

interface Props {
  text: string
  headers: string[]
}
export default function Tab(props: Props) {
  const { text, headers } = props

  return (
    <div className="text-2xl border border-red-500">
      <h1>{text}</h1>
    </div>
  )
}

