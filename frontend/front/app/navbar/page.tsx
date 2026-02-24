"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

import axios from "axios"
import { useMyContext } from "../contextprovider/provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"



export default function Navbar() {
  const{login,logDetails,setLogin, setLogDetails}=useMyContext()

useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await axios.get(
         "http://localhost:8000/users/checker/",
        { withCredentials: true }
      )

      setLogin(true)
      setLogDetails(res.data)

    } catch (error) {
      setLogin(false)
    }
  }

  checkAuth()
}, [])
  const userName=logDetails.userName
  const router=useRouter()
  async function Logout() {
 
  try{
    const res=await axios.get("http://localhost:8000/users/logout/",{withCredentials: true,})
    setLogin(false)
    setLogDetails({})
    router.push("/home")

   



  }
  catch(error){
    console.log(error)

  }
  
}
  

  return (
    <nav className="bg-blue-900 text-white flex justify-between items-center py-4 px-6 md:px-12 lg:px-24">
      
      <h1 className="font-bold text-lg">BlogGen</h1>

      <div className="flex gap-4">

        {login ? (
         
          <>
          <Button onClick={Logout} className="cursor-pointer">Logout</Button>
            
          </>
        ) : (
          
          <>
            <Button asChild>
              <Link href="/logiin">Login</Link>
            </Button>

            <Button asChild>
              <Link href="/signin">Sign Up</Link>
            </Button>
          </>
        )}

      </div>
    </nav>
  )
}
