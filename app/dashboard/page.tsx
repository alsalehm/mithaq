"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

type Contract = {
  status: string;
  contract_value: number;
  amount_paid: number | null;
  remaining_amount: number | null;
  payment_status: string | null;
};

export default function DashboardPage() {
  const [totalContracts, setTotalContracts] = useState(0);
  const [draftContracts, setDraftContracts] = useState(0);
  const [sentContracts, setSentContracts] = useState(0);
  const [signedContracts, setSignedContracts] = useState(0);
  const [completedContracts, setCompletedContracts] = useState(0);

  const [totalValue, setTotalValue] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const { data, error } = await supabase
        .from("contracts")
        .select("status, contract_value, amount_paid, remaining_amount, payment_status");

      if (error || !data) return;

      const contracts = data as Contract[];

      setTotalContracts(contracts.length);

      setDraftContracts(
        contracts.filter((item) => item.status === "draft").length
      );

      setSentContracts(
        contracts.filter((item) => item.status === "sent").length
      );

      setSignedContracts(
        contracts.filter((item) => item.status === "signed").length
      );

      setCompletedContracts(
        contracts.filter((item) => item.status === "completed").length
      );

      const value = contracts.reduce(
        (sum, item) => sum + (Number(item.contract_value) || 0),
        0
      );

      const paid = contracts.reduce(
        (sum, item) => sum + (Number(item.amount_paid) || 0),
        0
      );

      const remaining = contracts.reduce(
        (sum, item) => sum + (Number(item.remaining_amount) || 0),
        0
      );

      setTotalValue(value);
      setTotalPaid(paid);
      setTotalRemaining(remaining);
    }

    loadStats();
  }, []);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]"
    >
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-center text-4xl font-bold">
          لوحة التحكم
        </h1>

        <p className="mb-10 text-center text-gray-600">
          نظرة مالية وتشغيلية سريعة على نشاط أعمالك
        </p>

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">إجمالي العقود</p>
            <p className="mt-2 text-3xl font-bold">{totalContracts}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">إجمالي قيمة العقود</p>
            <p className="mt-2 text-3xl font-bold">{totalValue} ر.س</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">إجمالي المدفوع</p>
            <p className="mt-2 text-3xl font-bold">{totalPaid} ر.س</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">إجمالي المتبقي</p>
            <p className="mt-2 text-3xl font-bold">{totalRemaining} ر.س</p>
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

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/contracts/new"
            className="rounded-3xl bg-white p-8 text-center shadow-md"
          >
            <h2 className="mb-3 text-2xl font-bold">
              إنشاء عقد جديد
            </h2>

            <p className="text-gray-600">
              إنشاء عقد جديد وحفظ بيانات العميل والدفعات
            </p>
          </Link>

          <Link
            href="/contracts"
            className="rounded-3xl bg-white p-8 text-center shadow-md"
          >
            <h2 className="mb-3 text-2xl font-bold">
              إدارة العقود
            </h2>

            <p className="text-gray-600">
              عرض العقود، متابعة التواقيع، ومراجعة المدفوعات
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}