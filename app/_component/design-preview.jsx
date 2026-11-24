"use client";

import { useEffect, useRef } from "react";

/**
 * Thumbnail of a saved design. The canvas is rendered at the design's real
 * size and scaled down with CSS so the aspect ratio is always preserved.
 */
function DesignPreview({ design }) {
  const canvasElRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let previewCanvas = null;

    const render = async () => {
      const el = canvasElRef.current;
      if (!el) return;

      try {
        const fabric = await import("fabric");
        if (cancelled) return;

        previewCanvas = new fabric.StaticCanvas(el, {
          width: design.width || 825,
          height: design.height || 465,
          backgroundColor: "#ffffff",
          renderOnAddRemove: false,
        });

        // Scale with CSS instead of stretching the canvas.
        el.style.width = "100%";
        el.style.height = "100%";
        el.style.objectFit = "contain";

        let canvasData = design.canvasData;
        if (typeof canvasData === "string") {
          try {
            canvasData = JSON.parse(canvasData);
          } catch {
            canvasData = null;
          }
        }

        if (!canvasData || !canvasData.objects?.length) {
          if (canvasData?.background) previewCanvas.backgroundColor = canvasData.background;
          previewCanvas.requestRenderAll();
          return;
        }

        await previewCanvas.loadFromJSON(canvasData);
        if (cancelled) return;
        previewCanvas.requestRenderAll();
      } catch (e) {
        console.error("Error rendering design preview", e);
      }
    };

    render();

    return () => {
      cancelled = true;
      if (previewCanvas) {
        try {
          previewCanvas.dispose();
        } catch (e) {
          console.error("Error while disposing preview canvas", e);
        }
      }
    };
  }, [design.id, design.canvasData, design.width, design.height]);

  return <canvas ref={canvasElRef} className="h-full w-full" />;
}

export default DesignPreview;
