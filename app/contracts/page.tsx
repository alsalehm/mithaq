"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

type Contract = {
  id: string;
  client_name: string;
  event_type: string;
  event_date: string;
  contract_value: number;
  status: string;
  created_at?: string;
};

function statusArabic(status: string) {
    if (status === "signed") return "موقّع";

  if (status === "draft") return "مسودة";
  if (status === "sent") return "تم الإرسال";
  if (status === "completed") return "مكتمل";
  if (status === "cancelled") return "ملغي";
  return "غير محدد";
}

function statusColor(status: string) {
  if (status === "draft") return "bg-yellow-100 text-yellow-800";
  if (status === "sent") return "bg-blue-100 text-blue-800";
  if (status === "signed") return "bg-emerald-100 text-emerald-800";
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "cancelled") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
}

function formatDate(value: string | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
  async function fetchContracts() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("contracts")
      .select("id, client_name, event_type, event_date, contract_value, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setContracts((data ?? []) as Contract[]);
    }

    setLoading(false);
  }

  fetchContracts();
}, []);

  const filteredContracts =
    filter === "all"
      ? contracts
      : contracts.filter((contract) => contract.status === filter);

  const draftCount = contracts.filter((c) => c.status === "draft").length;
  const sentCount = contracts.filter((c) => c.status === "sent").length;
  const signedCount = contracts.filter((c) => c.status === "signed").length;
  const completedCount = contracts.filter((c) => c.status === "completed").length;

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] px-6 py-10 text-[#362008]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#75532F]">العقود</h1>
            <p className="mt-2 text-sm text-[#4F381D]">
              هنا يمكنك مشاهدة جميع العقود وإدارتها حسب الحالة.
            </p>
          </div>

          <Link
            href="/contracts/new"
            className="rounded-2xl bg-[#75532F] px-6 py-3 text-center text-white"
          >
            إنشاء عقد جديد
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-5">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">إجمالي العقود</p>
            <p className="text-2xl font-bold">{contracts.length}</p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">مسودة</p>
            <p className="text-2xl font-bold">{draftCount}</p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">تم الإرسال</p>
            <p className="text-2xl font-bold">{sentCount}</p>
          </div>
<div className="rounded-2xl bg-white p-4 shadow-sm">
  <p className="text-sm text-gray-500">موقّع</p>
  <p className="text-2xl font-bold">{signedCount}</p>
</div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">مكتمل</p>
            <p className="text-2xl font-bold">{completedCount}</p>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {[
            ["all", "الكل"],
            ["draft", "مسودة"],
            ["sent", "تم الإرسال"],
            ["signed", "موقّع"],
            ["completed", "مكتمل"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-xl px-5 py-2 font-bold ${
                filter === value
                  ? "bg-[#75532F] text-white"
                  : "bg-white text-[#75532F]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-md">
            جاري تحميل العقود...
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-md">
            لا توجد عقود
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredContracts.map((contract) => (
              <article
                key={contract.id}
                className="rounded-[28px] border border-[#D9C3A6] bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#75532F]">
                    {contract.client_name}
                  </h2>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${statusColor(
                      contract.status
                    )}`}
                  >
                    {statusArabic(contract.status)}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="rounded-2xl bg-[#F9F2EA] p-4">
                    <p className="font-bold">نوع المناسبة</p>
                    <p>{contract.event_type || "-"}</p>
                  </div>

                  <div className="rounded-2xl bg-[#F9F2EA] p-4">
                    <p className="font-bold">تاريخ المناسبة</p>
                    <p>{formatDate(contract.event_date)}</p>
                  </div>

                  <div className="rounded-2xl bg-[#F9F2EA] p-4">
                    <p className="font-bold">قيمة العقد</p>
                    <p>{contract.contract_value ?? "-"} ر.س</p>
                  </div>
                </div>

                <Link
                  href={`/contracts/${contract.id}`}
                  className="mt-5 block rounded-2xl bg-[#75532F] py-3 text-center font-bold text-white"
                >
                  عرض تفاصيل العقد
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}