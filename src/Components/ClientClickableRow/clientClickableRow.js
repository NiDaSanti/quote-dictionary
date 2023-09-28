import React from "react"

export default function handleClientUpdateClick({children, onClick}) {
  return(
    <td onClick={onClick}>{children}</td>
  )
}