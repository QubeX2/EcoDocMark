import React from "react";
import TabList from './TabList'
import Page from './Page'
import type { Section } from '../Preview'

interface Props {
  tabs: string[],
  sections: Section[],
  selectedIndex: number,
  onChange: (index: number) => (void)
}

export default function Document(props: Props) {
  const { tabs, sections, selectedIndex, onChange } = props;
  return (
    <div className="bg-white text-black w-3/6 p-1">
      <TabList tabs={tabs} selectedIndex={selectedIndex} onChange={onChange} />
      {Array.from({ length: tabs.length }, (_,i) => i).map(x => (
        <Page key={`id-page-${x}`} selected={x === selectedIndex} sections={sections.filter(s => s.tabIndex === x)} />
      ))}
    </div>
  )

}
