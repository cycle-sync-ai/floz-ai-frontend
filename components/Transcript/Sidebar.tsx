"use client";

import React from "react";

export function Sidebar() {
  return (
    <aside
      id="default-sidebar"
      className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="relative h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-800">
        <div className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
          <span>Meeting Transcription</span>
        </div>

        <div className="absolute bottom-0 text-white">
          <p>Create Your Bid</p>
          <p>Item 3</p>
          <p>Item 4</p>
        </div>
      </div>
    </aside>
  );
}
