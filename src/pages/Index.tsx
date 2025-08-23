import React, { useEffect } from "react";
const Index = () => {
  // Get guest name from localStorage (set during mobile access control)
  const guestName = localStorage.getItem('mobile-guest-name') || 'Guest';

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <div className="min-h-screen bg-transparent text-white relative">
      <div className="pt-24 py-0">
        {/* Welcome Message */}
        <div className="px-6 md:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-medium text-white">
              Welcome {guestName}, what would you like to do?
            </h1>
          </div>
        </div>

        {/* Content area - reserved for future elements */}
        <div className="px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* This area is intentionally left blank for future content */}
          </div>
        </div>
      </div>
    </div>;
};
export default Index;