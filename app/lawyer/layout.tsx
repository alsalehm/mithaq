"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { LogOut, Scale } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function LawyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

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

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    setLoggingOut(false);

    if (error) {
      toast.error("تعذر تسجيل الخروج.");
      return;
    }

    toast.success("تم تسجيل الخروج بنجاح");
    router.replace("/login");
    router.refresh();
  }

  return (
    <div
      dir="rtl"
      className="flex min-h-screen bg-[var(--mithaq-bg)]"
    >
      <aside className="flex w-64 shrink-0 flex-col border-l border-[var(--mithaq-border)] bg-white p-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
            <Scale size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[var(--mithaq-text)]">
              ميثاق
            </h1>

            <p className="mt-1 text-xs font-bold text-[var(--mithaq-muted)]">
              بوابة المحامية
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => {
            const isActive =
              item.href === "/lawyer"
                ? pathname === "/lawyer"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-2xl px-4 py-3 text-sm font-black transition ${
                  isActive
                    ? "bg-[var(--mithaq-primary)] text-white"
                    : "text-[var(--mithaq-text)] hover:bg-[var(--mithaq-primary-soft)]"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[var(--mithaq-border)] pt-6">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 text-sm font-black text-[var(--mithaq-primary)] transition hover:bg-[var(--mithaq-primary-soft)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={17} />
            {loggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}