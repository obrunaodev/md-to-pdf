'use client'

import {createContext, useMemo, useState} from "react";

export const GlobalContext = createContext({})

export default function GlobalProvider({ children }) {
  const [jsonData, setJsonData] = useState(null);

  const memo = useMemo(() => ({
    jsonData,
    setJsonData,
  }), [jsonData])

  return (
    <GlobalContext.Provider value={memo}>{children}</GlobalContext.Provider>
  )
}
