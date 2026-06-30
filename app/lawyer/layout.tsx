"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LawyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menu = [
    {
      title: "لوحة المحامية",
      href: "/lawyer",
    },
    {
      title: "طلبات الاستشارات",
      href: "/lawyer/legal-consultations",
    },
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F5E9DC] flex"
    >
      {/* القائمة الجانبية */}
      <aside className="w-64 bg-white border-l border-[#E7D8C8] p-6">
        <h1 className="text-2xl font-bold text-[#362008] mb-8">
          ⚖️ ميثاق
        </h1>

        <div className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-3 transition ${
                pathname === item.href
                  ? "bg-[#75532F] text-white"
                  : "hover:bg-[#F5E9DC] text-[#362008]"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </aside>

      {/* المحتوى */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}