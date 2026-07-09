import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const tajawal = Tajawal({
  variable: "--font-heading",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
});

const cairo = Cairo({
  variable: "--font-body",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ميثاق | إدارة العقود والفواتير",
  description: "منصة ميثاق لإدارة العقود والفواتير وتوقيع العملاء",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--mithaq-bg)] text-[var(--mithaq-text)]">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}