import React from "react";
import type { Section } from '../Preview'
import PageSection from './PageSection'

interface Props {
  selected: boolean
  sections: Section[]
}

export default function Page(props: Props) {
  const { selected, sections } = props

  return (
    <div className={`${!selected ? 'hidden' : ''} border border-red-500 p-1`}>
      {sections.map((s) => (
        <PageSection key={s.id} section={s} />
      ))}
    </div>
  )
}
