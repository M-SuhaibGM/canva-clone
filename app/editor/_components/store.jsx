"use client";

import { centerCanvas } from "@/lib/fabric";
import { saveCanvasState } from "@/services/design-service";
import { debounce } from "lodash";
import { create } from "zustand";

export const useEditorStore = create((set, get) => ({
  canvas: null,
  setCanvas: (canvas) => {
    set({ canvas });
    if (canvas) {
      centerCanvas(canvas);
    }
  },

  designId: null,
  setDesignId: (id) => set({ designId: id }),

  isEditing: true,
  setIsEditing: (flag) => set({ isEditing: flag }),

  name: "Untitled Design",
  setName: (value) => set({ name: value }),

  showProperties: false,
  setShowProperties: (flag) => set({ showProperties: flag }),

  // true once the saved design has been loaded into the canvas. Nothing may be
  // auto-saved before that, otherwise the empty canvas would overwrite it.
  designLoaded: false,
  setDesignLoaded: (flag) => set({ designLoaded: flag }),

  saveStatus: "Saved",
  setSaveStatus: (status) => set({ saveStatus: status }),
  lastModified: Date.now(),
  isModified: false,

  markAsModified: () => {
    const { designId, designLoaded } = get();

    if (!designId || !designLoaded) return;

    set({
      lastModified: Date.now(),
      saveStatus: "Saving...",
      isModified: true,
    });

    get().debouncedSaveToServer();
  },

  saveToServer: async () => {
    const designId = get().designId;
    const canvas = get().canvas;

    if (!canvas || !designId || !get().designLoaded) {
      return null;
    }

    set({ saveStatus: "Saving..." });

    try {
      const savedDesign = await saveCanvasState(canvas, designId, get().name);

      // Another edit may have been made while saving.
      if (get().designId === designId) {
        set({ saveStatus: "Saved", isModified: false });
      }

      return savedDesign;
    } catch (e) {
      console.error("Failed to save design", e);
      if (get().designId === designId) set({ saveStatus: "Error" });
      return null;
    }
  },

  debouncedSaveToServer: debounce(() => {
    get().saveToServer();
  }, 800),

  userSubscription: null,
  setUserSubscription: (data) => set({ userSubscription: data }),

  userDesigns: [],
  setUserDesigns: (data) => set({ userDesigns: data }),

  searchQuery: "",
  setSearchQuery: (value) => set({ searchQuery: value }),

  userDesignsLoading: false,
  setUserDesignsLoading: (flag) => set({ userDesignsLoading: flag }),

  showPremiumModal: false,
  setShowPremiumModal: (flag) => set({ showPremiumModal: flag }),

  showDesignsModal: false,
  setShowDesignsModal: (flag) => set({ showDesignsModal: flag }),

  resetStore: () => {
    set({
      canvas: null,
      designId: null,
      designLoaded: false,
      isEditing: true,
      name: "Untitled Design",
      showProperties: false,
      saveStatus: "Saved",
      isModified: false,
      lastModified: Date.now(),
    });
  },
}));
