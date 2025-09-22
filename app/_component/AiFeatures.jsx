import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"


const AiFeatures = () => {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 mt-4 ">
            <h2 className="text-lg flex items-center font-semibold justify-center"><Sparkles className="h-5 w-5 text-purple-500" />
                AI Image Creation
            </h2>
            <p className="text-gray-700 mb-4 text-center">Create Stunning Images with AI and Youtube Thumbnails </p>
            <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" className="rounded-full  mb-2 px-5 py-6 bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 hover:from-blue-100 hover:to-blue-100 border border-purple-200 shadow-sm text-center">
                    Generate Thumbnail from video title
                </Button>
                 <Button variant="outline" className="rounded-full px-5 py-6 bg-gradient-to-r from-purple-50 to-pink-50 text-red-700  hover:from-red-100 hover:to-pink-100 border border-purple-200  hover:text-pink-500 shadow-sm  text-center">
                    Generate custom Thumbnail  for Youtube
                </Button>
            </div>
           
        </div>
    )
}

export default AiFeatures