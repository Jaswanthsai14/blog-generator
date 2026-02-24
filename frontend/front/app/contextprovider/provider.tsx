"use client"

import { createContext, useContext, useState, useEffect } from "react"


type MyContextType = {
  login: boolean
  setLogin: (value: boolean) => void
  logDetails: any
  setLogDetails: (value: any) => void
}

const MyContext = createContext<MyContextType>({} as MyContextType)






export function MyProvider({ children }: { children: React.ReactNode }) {
  const [login, setLogin] = useState(false)
  const [logDetails, setLogDetails] = useState<any>({})

  
  useEffect(() => {
    const storedLogin = localStorage.getItem("login")
    const storedUser = localStorage.getItem("user")

    if (storedLogin === "true" && storedUser) {
      setLogin(true)
      setLogDetails(JSON.parse(storedUser))
    }
  }, [])

  return (
    <MyContext.Provider value={{ login, setLogin, logDetails, setLogDetails }}>
      {children}
    </MyContext.Provider>
  )
}



export function useMyContext() {
  const context = useContext(MyContext)
 
  return context
  
}
