"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import useCreateDesign from "@/hooks/useCreateDesign"

const AiFeatures = () => {
  const { create, loading } = useCreateDesign()

  // Opens a fresh YouTube thumbnail with the AI panel already showing.
  const startAiThumbnail = () =>
    create({ name: "AI Thumbnail", category: "youtube_thumbnail" }, { panel: "ai" })

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 mt-6 border border-purple-100">
      <h2 className="text-lg flex items-center font-semibold justify-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        AI Image Creation
      </h2>
      <p className="text-gray-700 mb-4 text-center">
        Create stunning images with AI and YouTube thumbnails
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant="outline"
          disabled={loading}
          onClick={startAiThumbnail}
          className="rounded-full px-5 py-6 bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 hover:from-blue-100 hover:to-purple-100 border border-purple-200 shadow-sm"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Generate thumbnail from video title
        </Button>
        <Button
          variant="outline"
          disabled={loading}
          onClick={startAiThumbnail}
          className="rounded-full px-5 py-6 bg-gradient-to-r from-purple-50 to-pink-50 text-red-700 hover:from-red-100 hover:to-pink-100 border border-purple-200 hover:text-pink-500 shadow-sm"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Generate custom thumbnail for YouTube
        </Button>
      </div>
    </div>
  )
}

export default AiFeatures
