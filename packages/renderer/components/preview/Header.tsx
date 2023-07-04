import React from "react";

interface Props {
  text: string
}
export default function Header(props: Props) {
  const { text } = props

  return (<h1 className="text-2xl">{text}</h1>)
}
