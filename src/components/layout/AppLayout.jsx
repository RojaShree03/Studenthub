
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobileMenu = () => {
    setMobileOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <div className="app-layout">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={closeMobileMenu}
      />

      <div className="app-main">
        <Topbar onMenuClick={openMobileMenu} />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
