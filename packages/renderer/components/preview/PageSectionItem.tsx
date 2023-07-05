import React from "react";
import type { SymbolObj } from "../Preview";

interface Props {
  symbol: SymbolObj
}
export default function PageSectionItem(props: Props) {
  const { symbol } = props

  console.log(symbol)
  return (
    <></>
  )
}
