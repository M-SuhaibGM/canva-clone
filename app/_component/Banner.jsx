"use client"

import { Button } from "@/components/ui/button"
import axios from "axios"
import { Crown, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Banner = () => {
  const [loading, setloading] = useState(false)
  const router = useRouter()


  const HandleClick = async () => {
    setloading(true)
    try {
      const initialDesignData = {
        name: "united design",
        canvasData: "null",
        width: 825,
        height: 465,
        category: "Youtube_thumnail"
      }
      const newDesign = await axios.post("/api/design", initialDesignData)
      router.push(`/editor/${newDesign.data.id}`)
    } catch (e) {
      console.log(e)
    } finally {
      setloading(false)
    }
  }
  return (
    <div className="rounded-xl overflow-hidden text-white bg-gradient-to-r from-[#00c4cc]  via-[#8b3dff] to-[#5533ff] p-4 sm:p-6  md:p-8 text-center ">
      <div className="flex flex-col sm:flex-row justify-center items-center mb-2 sm:mb-4">
        <Crown className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 text-yellow-400" />
        <span className="sm:ml-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-white ">Create Innovative Designs</span>
      </div>
      <h2 className="text-sm sm:text-base md:text-lg fontb mb-4 sm:mb-6 max-w-2xl mx-auto">
        Design eye-catching thumbnails that get more views
      </h2>
      <Button onClick={HandleClick} disabled={loading} className="text-[#8b3dff] bg-white hover:bg-gray-100 rounded-lg px-4 py-2 cursor-pointer sm:px-6 sm:py-2.5">Start Designing{loading && <Loader2 className="animate-spin h-3 w-3" />}</Button>

    </div>
  )
}

export default Banner