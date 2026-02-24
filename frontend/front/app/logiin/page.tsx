"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { useMyContext } from "../contextprovider/provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const{ setLogin, setLogDetails}=useMyContext()
  const router=useRouter()
  const [crr,setCrr]=useState(false)
  const[loading,setLoading]=useState(false)


  const  handleLogin =async  () => {
    try{
      setLoading(true)
    const res=await axios.post( "http://localhost:8000/users/login/", {
      username,
      password,
     

    },{ withCredentials: true})
    
      setLogDetails({
        "username":username,
        "password":password
      })
      setLogin(true)
      setLoading(false)
      router.push("/home")
    }
    catch(error){
      setLogin(false)
      console.log("invalidd")
      setLoading(false)
      setCrr(true)
    }

    

    
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <Card className="w-[350px] shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl"> LogIn</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Input
          required
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
          required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />


          <Button
  onClick={handleLogin}
  disabled={loading}
  className="w-full cursor-pointer flex items-center justify-center gap-2"
>
  {loading && (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  )}

  {loading ? "Logging in..." : "LogIn"}
</Button>

          <p className="text-sm text-center">
          Dont have an account click {" "}
          <Link href="/signin" className="text-blue-600 hover:underline">here</Link>
          </p>
          <div>
          {crr && (
  <p className="text-red-500 text-sm text-center">
    Invalid username or password
  </p>
)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
