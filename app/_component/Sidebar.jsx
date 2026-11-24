"use client";

import { useEditorStore } from "../editor/_components/store";
import { CreditCard, FolderOpen, Home, Loader2, Plus } from "lucide-react";
import useCreateDesign from "@/hooks/useCreateDesign";

function SideBar() {
  const { setShowPremiumModal, setShowDesignsModal, showDesignsModal, showPremiumModal } =
    useEditorStore();
  const { create, loading } = useCreateDesign();

  const menuItems = [
    {
      icon: <Home className="h-6 w-6" />,
      label: "Home",
      active: !showDesignsModal && !showPremiumModal,
      onClick: () => {
        setShowDesignsModal(false);
        setShowPremiumModal(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    },
    {
      icon: <FolderOpen className="h-6 w-6" />,
      label: "Projects",
      active: showDesignsModal,
      onClick: () => setShowDesignsModal(true),
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      label: "Billing",
      active: showPremiumModal,
      onClick: () => setShowPremiumModal(true),
    },
  ];

  return (
    <aside className="w-[72px] bg-[#f8f8fc] border-r flex flex-col items-center py-4 fixed left-0 top-0 h-full z-20">
      <div className="flex flex-col items-center">
        <button
          onClick={() => create({ name: "Untitled design - YouTube Thumbnail" })}
          disabled={loading}
          aria-label="Create a design"
          className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-70 shadow-md"
        >
          {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
        <div className="text-xs font-medium text-center mt-1 text-gray-700">Create</div>
      </div>
      <nav className="mt-8 flex flex-col items-center space-y-2 w-full">
        {menuItems.map((menuItem) => (
          <button
            type="button"
            onClick={menuItem.onClick}
            key={menuItem.label}
            className="flex cursor-pointer flex-col items-center w-full"
          >
            <div
              className={`${menuItem.active ? "bg-gray-200 text-purple-600" : "text-gray-600"} w-full flex flex-col items-center py-2 hover:bg-gray-100 hover:text-purple-600 transition-colors`}
            >
              <div className="relative">{menuItem.icon}</div>
              <span className="text-xs font-medium mt-1">{menuItem.label}</span>
            </div>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default SideBar;
