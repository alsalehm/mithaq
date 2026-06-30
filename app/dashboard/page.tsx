"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

type Contract = {
  id: string;
  client_name: string;
  event_type: string;
  event_date: string;
  status: string;
  contract_value: number;
  amount_paid: number | null;
  remaining_amount: number | null;
  payment_status: string | null;
  created_at?: string;
};

type Invoice = {
  id: string;
  amount: number;
  amount_paid: number | null;
  remaining_amount: number | null;
  payment_status: string | null;
  status: string;
};

export default function DashboardPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      const { data: contractsData } = await supabase
        .from("contracts")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("*");

      setContracts((contractsData || []) as Contract[]);
      setInvoices((invoicesData || []) as Invoice[]);
    }

    loadDashboard();
  }, []);

  const totalContracts = contracts.length;
  const totalInvoices = invoices.length;

  const totalValue = contracts.reduce(
    (sum, item) => sum + (Number(item.contract_value) || 0),
    0
  );

  const totalPaid = contracts.reduce(
    (sum, item) => sum + (Number(item.amount_paid) || 0),
    0
  );

  const totalRemaining = contracts.reduce(
    (sum, item) => sum + (Number(item.remaining_amount) || 0),
    0
  );

  const draftContracts = contracts.filter((item) => item.status === "draft").length;
  const sentContracts = contracts.filter((item) => item.status === "sent").length;
  const signedContracts = contracts.filter((item) => item.status === "signed").length;
  const completedContracts = contracts.filter((item) => item.status === "completed").length;

  const unpaidInvoices = invoices.filter(
    (item) => item.payment_status !== "paid" && item.status !== "paid"
  ).length;

  const latestContracts = contracts.slice(0, 5);

  function contractStatusArabic(status: string) {
    if (status === "draft") return "مسودة";
    if (status === "sent") return "تم الإرسال";
    if (status === "signed") return "موقع";
    if (status === "completed") return "مكتمل";
    return status;
  }

  function paymentStatusArabic(status: string | null) {
    if (status === "paid") return "مدفوع بالكامل";
    if (status === "partial") return "مدفوع جزئياً";
    return "غير مدفوع";
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-center text-4xl font-bold">لوحة التحكم</h1>

        <p className="mb-10 text-center text-gray-600">
          نظرة مالية وتشغيلية سريعة على نشاط أعمالك
        </p>

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">إجمالي العقود</p>
            <p className="mt-2 text-3xl font-bold">{totalContracts}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">إجمالي الفواتير</p>
            <p className="mt-2 text-3xl font-bold">{totalInvoices}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">الفواتير غير المسددة</p>
            <p className="mt-2 text-3xl font-bold">{unpaidInvoices}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">العقود المكتملة</p>
            <p className="mt-2 text-3xl font-bold">{completedContracts}</p>
          </div>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">إجمالي قيمة العقود</p>
            <p className="mt-2 text-3xl font-bold">{totalValue} ر.س</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">إجمالي المدفوع</p>
            <p className="mt-2 text-3xl font-bold text-green-700">
              {totalPaid} ر.س
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">إجمالي المتبقي</p>
            <p className="mt-2 text-3xl font-bold text-red-700">
              {totalRemaining} ر.س
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">مسودة</p>
            <p className="mt-2 text-3xl font-bold">{draftContracts}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">تم الإرسال</p>
            <p className="mt-2 text-3xl font-bold">{sentContracts}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">موقعة</p>
            <p className="mt-2 text-3xl font-bold">{signedContracts}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">مكتملة</p>
            <p className="mt-2 text-3xl font-bold">{completedContracts}</p>
          </div>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Link
            href="/contracts/new"
            className="rounded-3xl bg-[#75532F] p-6 text-center font-bold text-white shadow-md"
          >
            إنشاء عقد جديد
          </Link>

          <Link
            href="/contracts"
            className="rounded-3xl bg-white p-6 text-center font-bold shadow-md"
          >
            إدارة العقود
          </Link>

          <Link
            href="/invoices"
            className="rounded-3xl bg-white p-6 text-center font-bold shadow-md"
          >
            إدارة الفواتير
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-md">
          <h2 className="mb-5 text-2xl font-bold text-[#75532F]">
            آخر العقود
          </h2>

          {latestContracts.length === 0 ? (
            <p className="text-gray-500">لا توجد عقود حتى الآن</p>
          ) : (
            <div className="space-y-4">
              {latestContracts.map((contract) => (
                <Link
                  key={contract.id}
                  href={`/contracts/${contract.id}`}
                  className="block rounded-2xl bg-[#F5E9DC] p-4"
                >
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <p className="font-bold">{contract.client_name}</p>
                      <p className="text-sm text-gray-600">
                        {contract.event_type} - {contract.event_date}
                      </p>
                    </div>

                    <div className="text-left">
                      <p className="font-bold">{contract.contract_value} ر.س</p>
                      <p className="text-sm text-gray-600">
                        {contractStatusArabic(contract.status)} /{" "}
                        {paymentStatusArabic(contract.payment_status)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}