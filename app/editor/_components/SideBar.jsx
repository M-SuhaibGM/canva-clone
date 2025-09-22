"use client"

import { ArrowLeft, ChevronLeft, Grid, Pencil, Settings, Sparkles, Type, Upload } from "lucide-react"
import ElementsPanels from "../panels/Elements"
import { useState } from "react"
import TextPanels from "../panels/text"
import DrawPanels from "../panels/draw"
import UploadPanels from "../panels/upload"
import SettingPanel from "../panels/settings"
import AiPanels from "../panels/ai"
const SideBar = () => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [activeSidebar, setActiveSidebar] = useState(null)

  const sidebarItems = [
    {
      id: "elements",
      icon: Grid,
      label: "Elements",
      panel: () => <ElementsPanels />
    }, {
      id: "text",
      icon: Type,
      label: "Text",
      panel: () => <TextPanels />
    }, {
      id: "draw",
      icon: Pencil,
      label: "Draw",
      panel: () => <DrawPanels />
    }, {
      id: "upload",
      icon: Upload,
      label: "Uploads",
      panel: () => <UploadPanels />
    }, {
      id: "settings",
      icon: Settings,
      label: "Settings",
      panel: () => <SettingPanel />
    }, {
      id: "ai",
      icon: Sparkles,
      label: "Ai",
      panel: () => <AiPanels />
    },
  ]

  const handleItemClick = (id) => {
    if (id === activeSidebar && !isPanelCollapsed) return;

    setActiveSidebar(id);
    setIsPanelCollapsed(false);
  };

  const closeSecondaryPanel = () => {
    setActiveSidebar(null);
  };

  const togglePanelCollapse = (e) => {
    e.stopPropagation();
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  const activeItem = sidebarItems.find((item) => item.id === activeSidebar);

  return (
    <div className="flex h-full">
      <aside className="sidebar">
        {sidebarItems.map((item) => (
          <div
            onClick={() => handleItemClick(item.id)}
            key={item.id}
            className={`sidebar-item ${activeSidebar === item.id ? "active" : ""
              }`}
          >
            <item.icon className="sidebar-item-icon h-5 w-5" />
            <span className="sidebar-item-label">{item.label}</span>
          </div>
        ))}
      </aside>
      {activeSidebar && (
        <div
          className={`secondary-panel ${isPanelCollapsed ? "collapsed" : ""}`}
          style={{
            width: isPanelCollapsed ? "0" : "320px",
            opacity: isPanelCollapsed ? 0 : 1,
            overflow: isPanelCollapsed ? "hidden" : "visible",
          }}
        >
          <div className="panel-header">
            <button className="back-button" onClick={closeSecondaryPanel}>
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="panel-title">{activeItem.label}</span>
          </div>
          <div className="panel-content">{activeItem?.panel()}</div>
          <button className="collapse-button" onClick={togglePanelCollapse}>
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
export default SideBar