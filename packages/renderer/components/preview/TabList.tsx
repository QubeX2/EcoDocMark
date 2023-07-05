import React from "react";
import TabItem from "./TabItem";

interface Props {
  tabs: string[]
  selectedIndex: number
  onChange: (index: number) => void
}
export default function TabList(props: Props) {
  const { tabs, selectedIndex, onChange } = props

  const tabItems = tabs.map((t, i) => (
    <TabItem
      key={`id-tab-${i}`}
      onChange={onChange}
      name={t}
      selected={selectedIndex === i}
      index={i} />
  ))

  return (
      <ul className="cursor-pointer flex flex-row gap-x-1">
        {tabItems}
      </ul>

  )
}
