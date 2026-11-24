"use client";

import { Loader2 } from "lucide-react";
import { useEditorStore } from "../editor/_components/store";
import DesignCard from "./designCard";

function DesignList({
  listOfDesigns,
  isLoading,
  isModalView,
  setShowDesignsModal,
  limit,
}) {
  const { userDesigns, setUserDesigns, searchQuery } = useEditorStore();

  const query = searchQuery.trim().toLowerCase();
  const filtered = query
    ? listOfDesigns.filter((d) => d.name?.toLowerCase().includes(query))
    : listOfDesigns;
  // While searching, show every match rather than just the recent few.
  const visible = limit && !query ? filtered.slice(0, limit) : filtered;

  if (isLoading) {
    return (
      <div className="flex justify-center w-full py-10">
        <Loader2 className="animate-spin h-8 w-8 text-purple-500" />
      </div>
    );
  }

  if (!visible.length) {
    return (
      <div className="rounded-xl border border-dashed py-12 text-center text-gray-500">
        {query ? `No designs match "${searchQuery}"` : "No designs yet. Create your first one above!"}
      </div>
    );
  }

  return (
    <div
      className={`${isModalView ? "p-4" : ""} grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5`}
    >
      {visible.map((design) => (
        <DesignCard
          key={design.id}
          design={design}
          onOpen={() => setShowDesignsModal?.(false)}
          onDeleted={(id) => setUserDesigns(userDesigns.filter((d) => d.id !== id))}
        />
      ))}
    </div>
  );
}

export default DesignList;
