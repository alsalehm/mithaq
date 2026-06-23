"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

type Invoice = {
  id: string;
  invoice_number: string | null;
  client_name: string | null;
  amount: number | null;
  due_date: string | null;
  status: string | null;
  created_at: string;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setInvoices(data);
      }

      setLoading(false);
    }

    loadInvoices();
  }, []);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">الفواتير</h1>

          <Link
            href="/invoices/new"
            className="rounded-xl bg-[#75532F] px-5 py-3 font-bold text-white"
          >
            إنشاء فاتورة
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-md">
            جاري تحميل الفواتير...
          </div>
        ) : invoices.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-md">
            لا توجد فواتير حالياً
          </div>
        ) : (
          <div className="grid gap-4">
            {invoices.map((invoice) => (
              <Link
  href={`/invoices/${invoice.id}`}
                key={invoice.id}
                className="rounded-3xl bg-white p-6 shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      رقم الفاتورة
                    </p>
                    <h2 className="text-xl font-bold">
                      {invoice.invoice_number || "بدون رقم"}
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#F0E2D0] px-4 py-2 text-sm font-bold text-[#75532F]">
                    {invoice.status === "paid"
                      ? "مدفوعة"
                      : invoice.status === "unpaid"
                      ? "غير مدفوعة"
                      : invoice.status || "غير محدد"}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-[#F5E9DC] p-4">
                    <p className="text-sm text-gray-500">العميل</p>
                    <p className="mt-1 font-bold">
                      {invoice.client_name || "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F5E9DC] p-4">
                    <p className="text-sm text-gray-500">المبلغ</p>
                    <p className="mt-1 font-bold">
                      {invoice.amount || 0} ر.س
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F5E9DC] p-4">
                    <p className="text-sm text-gray-500">تاريخ الاستحقاق</p>
                    <p className="mt-1 font-bold">
                      {invoice.due_date || "-"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}