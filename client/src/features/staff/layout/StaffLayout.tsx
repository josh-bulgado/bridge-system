import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import StaffSidebar from "@/components/StaffSidebar";

function StaffLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Mock pending counts - in real app, these would come from API/context
  const [pendingCounts] = useState({
    requests: 12,
    verifications: 5,
    generations: 8,
  });

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffSidebar
        activeRoute={location.pathname}
        onNavigate={handleNavigate}
        pendingCounts={pendingCounts}
      />
      
      {/* Main Content */}
      <main className="lg:pl-60 min-h-screen">
        <div className="pt-16 lg:pt-0"> {/* Top padding for mobile menu button */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export { StaffLayout as default };