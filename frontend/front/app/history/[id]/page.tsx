"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "next/navigation"

type Blog = {
  title: string
  content: string
}

export default function BlogReader() {
  const { id } = useParams()
  const [blog, setBlog] = useState<Blog | null>(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/gen/history/",
          { withCredentials: true }
        )

        const blogs: Blog[] = res.data.history
        setBlog(blogs[Number(id)])
      } catch {
        console.log("Failed to load blog")
      }
    }

    fetchBlog()
  }, [id])

  if (!blog) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">
        {blog.title || "Untitled"}
      </h1>

      <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-4">
        {blog.content}
      </div>
    </div>
  )
}
