import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen bg-white text-[#2A1A0C]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <main className="flex-1 px-5 py-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <Topbar />
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}