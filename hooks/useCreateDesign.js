"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEditorStore } from "@/app/editor/_components/store";
import { createDesign } from "@/services/design-service";

export const FREE_DESIGN_LIMIT = 5;

/**
 * Creates a design and opens it in the editor. Handles the free-plan limit,
 * double clicks and error feedback in one place.
 */
export default function useCreateDesign() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const create = useCallback(
    async (
      {
        name = "Untitled design",
        width = 825,
        height = 465,
        category = "youtube_thumbnail",
      } = {},
      { panel } = {}
    ) => {
      if (loading) return;

      const { userDesigns, userSubscription, setShowPremiumModal } =
        useEditorStore.getState();

      if (userDesigns?.length >= FREE_DESIGN_LIMIT && !userSubscription?.isPremium) {
        toast.error("Free plan limit reached. Upgrade to premium to create more designs.");
        setShowPremiumModal(true);
        return;
      }

      setLoading(true);
      try {
        const design = await createDesign({
          name,
          canvasData: "null",
          width,
          height,
          category,
        });
        router.push(`/editor/${design.id}${panel ? `?panel=${panel}` : ""}`);
      } catch (e) {
        toast.error(e.message || "Failed to create design");
        setLoading(false);
      }
      // On success we keep `loading` true until the route changes, so the
      // button can't be clicked twice.
    },
    [loading, router]
  );

  return { create, loading };
}
