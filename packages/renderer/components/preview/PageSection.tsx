import React from "react";

interface Props {
  children: React.ReactNode
}

export default function PageSection(props: Props) {
  const { children } = props
  return (
    <>
    {children}
    </>
  )
}
