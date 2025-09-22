"use client";



import { Loader } from "lucide-react";
import { getUserDesigns } from "@/services/design-service";
import { useEditorStore } from "../editor/_components/store";
import DesignCrad from "./designCard";

function DesignList({
  listOfDesigns,
  isLoading,
  isModalView,
  setShowDesignsModal,
}) {

  const { setUserDesigns } = useEditorStore();

  async function fetchUserDesigns() {
    const result = await getUserDesigns();
    setUserDesigns(result);
  }



  if (isLoading) return (
    <div className="flex justify-center w-full pb-15">
      <Loader className="animate-spin h-10 w-10" />
    </div>
  )

  return (
    <div
      className={`${isModalView ? "p-4" : ""
        } grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4`}
    >
      {!listOfDesigns.length && <h1>No Design Found!</h1>}
      {listOfDesigns.map((design) => (
        <DesignCrad key={design.id} fetchUserDesigns={fetchUserDesigns} setShowDesignsModal={setShowDesignsModal} design={design} />
      ))}
    </div>
  );
}

export default DesignList;
