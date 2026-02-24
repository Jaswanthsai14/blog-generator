"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function BlogPage() {
  const [topic, setTopic] = useState("")
  const [blog, setBlog] = useState<{ title: string; content: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const generateBlog = async () => {
    if (!topic.trim()) {
      setError("Please enter a link/topic")
      return
    }

    setLoading(true)
    setError("")
    setBlog(null)

    try {
      const res = await axios.post(
        "http://localhost:8000/gen/agent/",
        { link: topic },
        { withCredentials: true }
      )

      setBlog(res.data)

    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError(" Daily limit reached. You can generate only 3 blogs per day.")
        } else if (err.response?.status === 401) {
          setError(" Please login again.")
        } else {
          setError("Failed to generate blog.")
        }
      } else {
        setError("Something went wrong.")
      }
    } finally {
      setLoading(false)
    }
  }

  const copyBlog = () => {
    if (!blog) return

    const text = `${blog.title}\n\n${blog.content}`
    navigator.clipboard.writeText(text)

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const wordCount = blog
    ? blog.content.split(/\s+/).filter(Boolean).length
    : 0

  const readingTime = Math.ceil(wordCount / 200)

  return (
    <div className="bg-white rounded-2xl shadow-md p-10 mt-6 max-w-6xl mx-auto">

      
      <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          AI Blog Generator ✨
        </h1>
        <p className="text-gray-600">
          Paste a link or topic to generate an AI-powered blog instantly.
        </p>
      </div>

      
      <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
        <label className="font-medium text-gray-700 mb-2 block">
          Link / Topic
        </label>

        <Input
          placeholder="Paste YouTube link or topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      
      <div className="flex justify-center mb-6">
        <Button 
          onClick={generateBlog}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 px-8 py-2"
        >
          {loading ? "Generating..." : "Generate Blog"}
        </Button>
      </div>

      
      {loading && (
        <p className="text-indigo-600 text-center font-medium">
          Generating blog... please wait ⏳
        </p>
      )}

      
      {error && (
        <p className="text-red-500 text-center font-medium">{error}</p>
      )}

   
      {blog && (
        <div className="bg-white rounded-2xl shadow-md p-10 mt-6 max-w-4xl mx-auto">

          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {blog.title}
          </h2>

          <div className="flex justify-between text-sm text-gray-500 mb-6 border-b pb-4">
            <p>📊 {wordCount} words</p>
            <p>⏱ {readingTime} min read</p>
          </div>

          <div className="text-gray-700 text-lg leading-8 whitespace-pre-line space-y-6">
            {blog.content}
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={copyBlog}
              className="bg-green-600 hover:bg-green-700"
            >
              {copied ? "Copied!" : "Copy Blog"}
            </Button>
          </div>

        </div>
      )}
    </div>
  )
}