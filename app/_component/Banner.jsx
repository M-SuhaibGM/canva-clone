"use client"

import { Button } from "@/components/ui/button"
import { Crown, Loader2 } from "lucide-react"
import useCreateDesign from "@/hooks/useCreateDesign"

const Banner = () => {
  const { create, loading } = useCreateDesign()

  return (
    <div className="rounded-2xl overflow-hidden text-white bg-gradient-to-r from-[#00c4cc] via-[#8b3dff] to-[#5533ff] p-6 sm:p-8 md:p-10 text-center shadow-lg">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-3 sm:mb-4">
        <Crown className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-yellow-400 shrink-0" />
        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white">
          Create Innovative Designs
        </span>
      </div>
      <h2 className="text-sm sm:text-base md:text-lg mb-5 sm:mb-6 max-w-2xl mx-auto text-white/90">
        Design eye-catching thumbnails that get more views
      </h2>
      <Button
        onClick={() => create({ name: "Untitled design - YouTube Thumbnail" })}
        disabled={loading}
        className="text-[#8b3dff] bg-white hover:bg-gray-100 rounded-lg px-5 py-2 cursor-pointer sm:px-6 sm:py-2.5 font-semibold shadow-sm"
      >
        Start Designing
        {loading && <Loader2 className="animate-spin h-4 w-4" />}
      </Button>
    </div>
  )
}

export default Banner
