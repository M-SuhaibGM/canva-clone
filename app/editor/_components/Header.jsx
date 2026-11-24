"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditorStore } from "./store";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Download,
  Eye,
  Loader2,
  LogOut,
  Pencil,
  Save,
  Star,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ExportModal from "./export";
import toast from "react-hot-toast";
import Link from "next/link";
import { FREE_DESIGN_LIMIT } from "@/hooks/useCreateDesign";

function Header() {
  const {
    isEditing,
    setIsEditing,
    name,
    setName,
    canvas,
    saveStatus,
    markAsModified,
    saveToServer,
    debouncedSaveToServer,
    designLoaded,
    userDesigns,
    userSubscription,
    setShowPremiumModal,
    setShowProperties,
  } = useEditorStore();
  const { data: session } = useSession();
  const [showExportModal, setShowExportModal] = useState(false);

  const isSaving = saveStatus === "Saving...";

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  // Viewing mode: nothing on the canvas can be selected or moved.
  useEffect(() => {
    if (!canvas) return;
    canvas.selection = isEditing;
    canvas.getObjects().forEach((obj) => {
      obj.selectable = isEditing;
      obj.evented = isEditing;
    });
    if (!isEditing) {
      canvas.discardActiveObject();
      canvas.isDrawingMode = false;
      setShowProperties(false);
    }
    canvas.requestRenderAll();
  }, [canvas, isEditing, setShowProperties]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    markAsModified();
  };

  const handleManualSave = async () => {
    if (!designLoaded || isSaving) return;
    debouncedSaveToServer.cancel();
    const result = await saveToServer();
    if (result) toast.success("Design saved");
    else toast.error("Couldn't save your design. Please try again.");
  };

  const handleExport = () => {
    if (userDesigns?.length >= FREE_DESIGN_LIMIT && !userSubscription?.isPremium) {
      toast.error("Free plan limit reached. Upgrade to premium to export.");
      setShowPremiumModal(true);
      return;
    }
    setShowExportModal(true);
  };

  return (
    <header className="header-gradient header flex items-center justify-between gap-3 px-4 h-14 shrink-0">
      <div className="flex items-center space-x-2">
        <Link href="/home" aria-label="Back to dashboard">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://static.canva.com/web/images/856bac30504ecac8dbd38dbee61de1f1.svg"
            alt="canva"
            width={70}
            height={30}
          />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="header-button flex items-center text-white">
              <span>{isEditing ? "Editing" : "Viewing"}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Editing</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditing(false)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Viewing</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={handleManualSave}
          className="header-button gap-1.5"
          title={isSaving ? "Saving..." : "Save"}
          disabled={isSaving || !designLoaded}
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : saveStatus === "Error" ? (
            <AlertCircle className="h-5 w-5 text-red-300" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          <span className="hidden text-xs sm:flex items-center gap-1" aria-live="polite">
            {isSaving && "Saving..."}
            {saveStatus === "Saved" && designLoaded && (
              <>
                <Check className="h-3 w-3" /> Saved
              </>
            )}
            {saveStatus === "Error" && "Save failed"}
          </span>
        </button>
        <button
          onClick={handleExport}
          disabled={!designLoaded}
          className="header-button"
          title="Export"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 flex justify-center max-w-md">
        <input
          className="header-title-input"
          value={name}
          onChange={handleNameChange}
          maxLength={80}
          aria-label="Design name"
          placeholder="Untitled design"
        />
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setShowPremiumModal(true)}
          className="upgrade-button flex items-center bg-white/10 hover:bg-white/20 text-white rounded-md h-9 px-3 transition-colors"
        >
          <Star className="mr-1 h-4 w-4 text-yellow-400" />
          <span className="hidden sm:inline">
            {!userSubscription?.isPremium
              ? "Upgrade To Premium"
              : "Premium Member"}
          </span>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 cursor-pointer focus:outline-none" aria-label="Account menu">
              <Avatar>
                <AvatarImage src={session?.user?.image || "/user.png"} />
                <AvatarFallback>
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={handleLogout}
              className={"cursor-pointer"}
            >
              <LogOut className="mr-2 w-4 h-4" />
              <span className="font-bold">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ExportModal isOpen={showExportModal} onClose={setShowExportModal} />
    </header>
  );
}

export default Header;
