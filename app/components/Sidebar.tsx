"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-l border-[#E7D6C2] bg-[#FFFDF9] px-5 py-6 lg:block">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-wide text-[#75532F]">
          ميثاق
        </h1>
        <p className="mt-2 text-xs tracking-[0.45em] text-[#8B6A43]">
          MITHAQ
        </p>
      </div>

      <nav className="space-y-2">
        <NavItem href="/dashboard" label="لوحة التحكم" icon="⌂" active={pathname === "/dashboard"} />
        <NavItem href="/customers" label="العملاء" icon="👥" active={pathname.startsWith("/customers")} />
        <NavItem href="/contracts" label="العقود" icon="📄" active={pathname.startsWith("/contracts")} />
        <NavItem href="/invoices" label="الفواتير" icon="▦" active={pathname.startsWith("/invoices")} />
        <NavItem href="/legal-consultations" label="الاستشارات القانونية" icon="⚖" active={pathname.startsWith("/legal-consultations")} />
        <NavItem href="/settings" label="الإعدادات" icon="⚙" active={pathname.startsWith("/settings")} />
      </nav>

      <div className="mt-10 border-t border-[#E7D6C2] pt-6">
        <Link
          href="/login"
          className="block rounded-xl border border-[#D8BFA3] px-4 py-3 text-center text-sm font-semibold text-[#75532F] transition hover:bg-[#EFE0CF]"
        >
          تسجيل الخروج
        </Link>
      </div>
    </aside>
  );
}

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-[#EFE0CF] text-[#75532F]"
          : "text-[#2A1A0C] hover:bg-[#F8F1E8]"
      }`}
    >
      <span>{label}</span>
      <span className="text-lg">{icon}</span>
    </Link>
  );
}