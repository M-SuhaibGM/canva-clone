"use client";

import { useParams, useRouter } from "next/navigation";
import Canvas from "./Canvas";
import Header from "./Header";
import Sidebar from "./SideBar";
import { useEffect, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { useEditorStore } from "./store";
import { getUserDesignByID, getUserDesigns } from "@/services/design-service";
import { getUserSubscription } from "@/services/subscription-service";
import { centerCanvas, customizeBoundingBox, deletedSelectedObject } from "@/lib/fabric";
import { Button } from "@/components/ui/button";
import Properties from "./properties";
import SubscriptionModal from "./premium-modal";

// Canvas events that change the design and therefore need to be saved.
const SAVE_EVENTS = [
  "object:added",
  "object:modified",
  "object:removed",
  "path:created",
  "text:changed",
];

function MainEditor() {
  const params = useParams();
  const router = useRouter();
  const { designId } = params;
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const {
    canvas,
    setDesignId,
    resetStore,
    setName,
    setShowProperties,
    showProperties,
    isEditing,
    setShowPremiumModal,
    showPremiumModal,
    designLoaded,
    setDesignLoaded,
    markAsModified,
    setUserSubscription,
    setUserDesigns,
  } = useEditorStore();

  // Reset on mount; flush any pending edit and reset again on unmount.
  useEffect(() => {
    resetStore();
    if (designId) setDesignId(designId);

    // Needed for the premium badge and the free plan limits.
    getUserSubscription()
      .then((res) => res?.success && setUserSubscription(res.data))
      .catch(() => {});
    getUserDesigns()
      .then(setUserDesigns)
      .catch(() => {});

    return () => {
      const state = useEditorStore.getState();
      state.debouncedSaveToServer.cancel();
      // saveToServer snapshots the canvas synchronously, so this still saves
      // the latest edits even though the store is reset right after.
      if (state.isModified) state.saveToServer();
      resetStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load the saved design into the canvas.
  useEffect(() => {
    if (!designId) {
      router.replace("/home");
      return;
    }
    if (!canvas) return;

    let cancelled = false;

    const loadDesign = async () => {
      setStatus("loading");
      setErrorMessage("");
      setDesignLoaded(false);

      try {
        const design = await getUserDesignByID(designId);
        if (cancelled) return;
        if (!design) throw new Error("Design not found");

        setName(design.name);
        setDesignId(designId);

        canvas.clear();
        if (design.width && design.height) {
          canvas.setDimensions({ width: design.width, height: design.height });
        }

        let canvasData = design.canvasData;
        if (typeof canvasData === "string") {
          try {
            canvasData = JSON.parse(canvasData);
          } catch {
            canvasData = null;
          }
        }

        if (canvasData?.objects?.length) {
          await canvas.loadFromJSON(canvasData);
          if (cancelled) return;
        }
        if (!canvas.backgroundColor) {
          canvas.backgroundColor = canvasData?.background || "#ffffff";
        }

        customizeBoundingBox(canvas);
        centerCanvas(canvas);
        canvas.requestRenderAll();

        setDesignLoaded(true);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        console.error("Failed to load design", e);
        setErrorMessage(
          e.status === 404 || e.message === "Design not found"
            ? "This design doesn't exist or you don't have access to it."
            : e.message || "Failed to load design"
        );
        setStatus("error");
      }
    };

    loadDesign();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, designId, reloadKey]);

  // Auto save whenever the canvas changes (after the design has loaded, so
  // loading itself doesn't count as an edit).
  useEffect(() => {
    if (!canvas || !designLoaded) return;

    const handleChange = () => markAsModified();
    SAVE_EVENTS.forEach((event) => canvas.on(event, handleChange));
    return () => SAVE_EVENTS.forEach((event) => canvas.off(event, handleChange));
  }, [canvas, designLoaded, markAsModified]);

  // Properties panel follows the selection.
  useEffect(() => {
    if (!canvas) return;

    const handleSelectionCreated = () => {
      if (canvas.getActiveObject()) setShowProperties(true);
    };
    const handleSelectionCleared = () => setShowProperties(false);

    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionCreated);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionCreated);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvas, setShowProperties]);

  // Delete key removes the selected object(s).
  useEffect(() => {
    if (!canvas) return;

    const handleKeyDown = (e) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const target = e.target;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable ||
        target?.closest?.('[role="dialog"]')
      ) {
        return;
      }
      const active = canvas.getActiveObject();
      if (!active || active.isEditing || !useEditorStore.getState().isEditing) return;
      e.preventDefault();
      deletedSelectedObject(canvas);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canvas]);

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (useEditorStore.getState().isModified) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isEditing && <Sidebar />}

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <main
            className={`relative flex-1 overflow-hidden bg-[#f0f0f0] transition-[padding] ${
              showProperties && isEditing ? "pr-[280px]" : ""
            }`}
          >
            <Canvas />
          </main>

          {status !== "ready" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              {status === "loading" ? (
                <div className="flex flex-col items-center gap-3 text-gray-600">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <p className="text-sm font-medium">Loading your design...</p>
                </div>
              ) : (
                <div className="flex max-w-sm flex-col items-center gap-3 px-4 text-center">
                  <TriangleAlert className="h-10 w-10 text-red-500" />
                  <p className="font-semibold">Couldn&apos;t open this design</p>
                  <p className="text-sm text-gray-600">{errorMessage}</p>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" onClick={() => router.replace("/home")}>
                      Back to dashboard
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => setReloadKey((k) => k + 1)}
                    >
                      Try again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showProperties && isEditing && <Properties />}
      <SubscriptionModal
        isOpen={showPremiumModal}
        onClose={setShowPremiumModal}
      />
    </div>
  );
}

export default MainEditor;
