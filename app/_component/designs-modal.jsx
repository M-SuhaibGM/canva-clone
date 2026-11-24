"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import DesignList from "./Designlist";

function DesignModal({
  isOpen,
  onClose,
  userDesigns,
  setShowDesignsModal,
  userDesignsLoading,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={"sm:max-w-[1200px] max-h-[85vh] p-0 gap-0 overflow-auto"}
      >
        <div className="flex flex-col">
          <div className="p-6 pb-2">
            <DialogTitle
              className={"text-2xl font-bold flex items-center"}
            >
              <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
              All Designs
            </DialogTitle>
          </div>
          <DesignList
            setShowDesignsModal={setShowDesignsModal}
            isModalView={true}
            listOfDesigns={userDesigns || []}
            isLoading={userDesignsLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DesignModal;
