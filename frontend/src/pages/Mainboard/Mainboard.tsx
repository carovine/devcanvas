import Sidebar from "../../components/Sidebar/Sidebar";
import Toolbar from "../../components/Toolbar/Toolbar";
import Canvas from "../../components/Canvas/Canvas";
import { useState } from "react";
import "./Mainboard.css";

export default function Mainboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="main-layout">
      <button
        className="menu-btn"
        style={{ color: "black" }}
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      {isSidebarOpen && <Sidebar setIsSidebarOpen={setIsSidebarOpen} />}

      <div className="workspace">
        <Toolbar />
        <Canvas />
      </div>
    </div>
  );
}
