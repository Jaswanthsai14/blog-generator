"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"
import axios from "axios"
import { useMyContext } from "../contextprovider/provider"
import { json } from "stream/consumers"

export default function HomePage() {
  const { login, logDetails,setLogin,setLogDetails } = useMyContext()
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




  
  if (!login) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-10 rounded-2xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Please Login First 🔐
          </h1>
          <p className="text-gray-600 mb-6">
            You must be logged in to access the dashboard.
          </p>

          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/logiin">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

 
  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-12">
      
      <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to BlogGen ✨
        </h1>
        <p className="text-gray-600">
          Generate AI-powered blogs instantly. Save time and create amazing content effortlessly.
        </p>

        <p className="mt-3 text-sm text-indigo-600">
         Logged in as: <strong>{logDetails?.username || "User"}</strong>
        </p>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
      
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold mb-3">Generate Blog</h2>
          <p className="text-gray-600 mb-4">
            Create a new AI-generated blog post in seconds.
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 transition-all">
             <Link href="/blog">Generate now</Link>
          </Button>
        </div>

        {/* Profile */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold mb-3">Profile</h2>
          <p className="text-gray-600 mb-4">
            Generated Blogs by you
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 transition-all">
             <Link href="/history">history</Link>
          </Button>
        </div>

      </div>

      {/* Daily Limit Info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
        <p className="text-indigo-800 font-medium text-lg">
          ⚡ You can generate <span className="font-bold">3 blogs per day</span>
        </p>
        <p className="text-sm text-indigo-600 mt-1">
          Premium coming soon...
        </p>
      </div>

    </div>
  )
}
