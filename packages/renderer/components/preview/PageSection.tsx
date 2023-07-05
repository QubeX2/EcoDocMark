import React from "react";
import type { Section } from "../Preview";

interface Props {
  section: Section
}

export default function PageSection(props: Props) {
  const { section } = props
  console.log('section', section)
  return (
    <>

    </>
  )
}
