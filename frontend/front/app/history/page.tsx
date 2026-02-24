"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Blog = {
  title: string
  content: string
}

export default function HistoryPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/gen/history/",
        { withCredentials: true }
      )
      setBlogs(res.data.history || [])
    } catch {
      console.log("Failed to load history")
    } finally {
      setLoading(false)
    }
  }

  
  const deleteBlog = async (index: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this blog?")
    if (!confirmDelete) return

    try {
      await axios.delete(
        `http://localhost:8000/gen/history/delete/${index}/`,
        { withCredentials: true }
      )

      
      setBlogs((prev) => prev.filter((_, i) => i !== index))

    } catch (err) {
      console.log("Delete failed", err)
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div>
      {blogs.length==0 ? <div className="flex justify-between pl-30 pr-30 mt-30">
      <h1 className="text-3xl font-bold mb-6">📚 No Blogs Generated</h1>
      <Button asChild className="bg-indigo-600 hover:bg-indigo-700 transition-all ml-8">
             <Link href="/blog">Generate blog</Link>
          </Button>
      </div>:<div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">📚 Genearated Blogs</h1>
      

      <div className="space-y-6">
        {blogs.map((blog, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              {blog.title || "Untitled"}
            </h2>

            <p className="text-gray-600 line-clamp-3">
              {blog.content}
            </p>

            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => router.push(`/history/${index}`)}
              >
                Read Blog →
              </Button>

              <Button
                variant="destructive"
                onClick={() => deleteBlog(index)}
              >
                Delete 🗑
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div> }
    
    </div>
  )
}
