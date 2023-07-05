import React from "react"

interface Props {
  name: string
  selected: boolean
  index: number
  onChange: (index:  number) => void
}

export default function TabItem(props: Props) {
  const { name, selected, index, onChange } = props
  return (
      <li
        className={`text-2xl rounded-t-md ${selected ? 'bg-blue-300' : 'bg-gray-300'} justify-center px-2`}
        onClick={() => { onChange(index) }}>
        {name ? name : 'Start'}
      </li>
  )
}

