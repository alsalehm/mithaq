"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function DashboardPage() {
  const [totalContracts, setTotalContracts] = useState(0);
  const [sentContracts, setSentContracts] = useState(0);
  const [completedContracts, setCompletedContracts] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const { data } = await supabase
        .from("contracts")
        .select("status, contract_value");

      if (!data) return;

      setTotalContracts(data.length);

      setSentContracts(
        data.filter((item) => item.status === "sent").length
      );

      setCompletedContracts(
        data.filter((item) => item.status === "completed").length
      );

      const value = data.reduce(
        (sum, item) => sum + (Number(item.contract_value) || 0),
        0
      );

      setTotalValue(value);
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
          نظرة سريعة على نشاط أعمالك
        </p>

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">إجمالي العقود</p>
            <p className="mt-2 text-3xl font-bold">
              {totalContracts}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              العقود المرسلة
            </p>
            <p className="mt-2 text-3xl font-bold">
              {sentContracts}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              العقود المكتملة
            </p>
            <p className="mt-2 text-3xl font-bold">
              {completedContracts}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              إجمالي الإيرادات
            </p>
            <p className="mt-2 text-3xl font-bold">
              {totalValue} ر.س
            </p>
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
              إنشاء عقد تصوير جديد للعميل
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
              عرض وتعديل جميع العقود
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}