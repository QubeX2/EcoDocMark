import React from "react";

interface Props {
  children: React.ReactNode[]
}

export default function Document(props: Props) {
  const { children } = props;
  return (
    <div className="bg-white text-black w-3/6 p-1">
      {children}
    </div>
  )

}
