"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import axios from "axios"
import { useMyContext } from "../contextprovider/provider"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const[crr,setCrr]=useState(false)
  const{setLogDetails,setLogin}=useMyContext()
  const router=useRouter()
  const[loading,setLoading]=useState(false)
  const handleLogin =async () => {
    try{
      setLoading(true)
      const res=await axios.post("http://localhost:8000/users/signup/",{username,password},{ withCredentials: true})
      setLogin(true)
      setLogDetails(res.data)
      setLoading(false)
      router.push("/home")
      



    }
 catch (err) {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 409) {
      
      setCrr(true)
      setLoading(false)
    } else {
      alert(err.response?.data?.message || "Signup failed")
      setLoading(false)
    }
  } else {
    alert("Unexpected error")
    setLoading(false)
  }
}



    
    
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <Card className="w-[350px] shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">signIn</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
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

  {loading ? "signing in..." : "SignIn"}
</Button>
          <p className="text-sm text-center">
          have an account click{" "}
          <Link href={"/logiin"} className="text-blue-600 hover:underline">here</Link>
          </p>
          <div>
               {crr && (
  <p className="text-red-500 text-sm text-center">
    user already exsists
  </p>
)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
