"use client";
import { useRef } from "react";
import { useEditorStore } from "./store";
import { initializeFabric } from "@/lib/fabric";
import { useEffect } from "react";

const Canvas = () => {

  const canvasRef = useRef(null)
  const canvasContanerRef = useRef(null)
  const fabricCanvesRef = useRef(null)

  const initAttemptedRef = useRef(false)
  const { setCanvas } = useEditorStore()

  useEffect(() => {

    const cleanUpCanvas = () => {
      if (fabricCanvesRef.current) {
        try {

          fabricCanvesRef.current.dispose()
        } catch (e) {
          console.error('Error disposing canvas', e)
        }
      }

      fabricCanvesRef.current = null;
      setCanvas(null)
    }

    cleanUpCanvas()
    initAttemptedRef.current = false;



    const initcanvas = async () => {
      if (typeof window === undefined || !canvasRef.current || initAttemptedRef.current) {
        return
      }
      initAttemptedRef.current = true
      try {

        const fabricCanvas = await initializeFabric(canvasRef.current, canvasContanerRef.current)
        if (!fabricCanvas) {
          console.error('failed to initilize Fabric.js')
          return
        }

        fabricCanvesRef.current = fabricCanvas

        setCanvas(fabricCanvas)
        console.log("canvas init is done and set in store")

      } catch (e) {
        console.error('failed to initilize canvas ', e)
      }
    }

    const timer = setTimeout(() => {
      initcanvas()
    }, 50)

    return () => {
      clearTimeout(timer)
      cleanUpCanvas()
    }
  }, [])



  return (
    <div className=" relative w-full h-[600px] overflow-auto " ref={canvasContanerRef}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Canvas