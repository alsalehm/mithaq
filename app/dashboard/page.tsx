"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

type Contract = {
  id: string;
  client_name: string;
  event_type: string | null;
  event_date: string | null;
  status: string | null;
  contract_value: number | null;
  amount_paid: number | null;
  remaining_amount: number | null;
  payment_status: string | null;
  created_at?: string;
};

type Invoice = {
  id: string;
  amount: number | null;
  status: string | null;
  payment_status: string | null;
};

type Customer = {
  id: string;
};

type LegalConsultation = {
  id: string;
  status: string | null;
};

export default function DashboardPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [consultations, setConsultations] = useState<LegalConsultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: contractsData } = await supabase
      .from("contracts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: invoicesData } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id);

    const { data: customersData } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id);

    const { data: consultationsData } = await supabase
      .from("legal_consultations")
      .select("id, status")
      .eq("user_id", user.id);

    setContracts((contractsData || []) as Contract[]);
    setInvoices((invoicesData || []) as Invoice[]);
    setCustomers((customersData || []) as Customer[]);
    setConsultations((consultationsData || []) as LegalConsultation[]);
    setLoading(false);
  }

  const totalContracts = contracts.length;
  const totalInvoices = invoices.length;
  const totalCustomers = customers.length;
  const totalConsultations = consultations.length;

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

  const newConsultations = consultations.filter((item) => item.status === "new").length;

  const latestContracts = contracts.slice(0, 5);

  function contractStatusArabic(status: string | null) {
    if (status === "draft") return "مسودة";
    if (status === "sent") return "تم الإرسال";
    if (status === "signed") return "موقّع";
    if (status === "completed") return "مكتمل";
    if (status === "cancelled") return "ملغي";
    return "غير محدد";
  }

  function paymentStatusArabic(status: string | null) {
    if (status === "paid") return "مدفوع بالكامل";
    if (status === "partial") return "مدفوع جزئيًا";
    return "غير مدفوع";
  }

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
        جاري تحميل لوحة التحكم...
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-center text-4xl font-bold">لوحة التحكم</h1>

        <p className="mb-10 text-center text-gray-600">
          نظرة مالية وتشغيلية سريعة على نشاط أعمالك
        </p>

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Stat title="العملاء" value={totalCustomers} />
          <Stat title="العقود" value={totalContracts} />
          <Stat title="الفواتير" value={totalInvoices} />
          <Stat title="الاستشارات القانونية" value={totalConsultations} />
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Stat title="إجمالي قيمة العقود" value={`${totalValue} ر.س`} />
          <Stat title="إجمالي المدفوع" value={`${totalPaid} ر.س`} green />
          <Stat title="إجمالي المتبقي" value={`${totalRemaining} ر.س`} red />
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-5">
          <Stat title="مسودة" value={draftContracts} />
          <Stat title="تم الإرسال" value={sentContracts} />
          <Stat title="موقعة" value={signedContracts} />
          <Stat title="مكتملة" value={completedContracts} />
          <Stat title="فواتير غير مدفوعة" value={unpaidInvoices} red />
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Link href="/customers" className="rounded-3xl bg-white p-6 text-center font-bold shadow-md">
            إدارة العملاء
          </Link>

          <Link href="/contracts/new" className="rounded-3xl bg-[#75532F] p-6 text-center font-bold text-white shadow-md">
            إنشاء عقد جديد
          </Link>

          <Link href="/invoices" className="rounded-3xl bg-white p-6 text-center font-bold shadow-md">
            إدارة الفواتير
          </Link>

          <Link href="/legal-consultations" className="rounded-3xl bg-white p-6 text-center font-bold shadow-md">
            طلب استشارة قانونية
            {newConsultations > 0 && (
              <span className="mr-2 rounded-full bg-red-100 px-2 py-1 text-sm text-red-700">
                {newConsultations} جديد
              </span>
            )}
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-md">
          <h2 className="mb-5 text-2xl font-bold text-[#75532F]">آخر العقود</h2>

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
                        {contract.event_type || "بدون نوع"} - {contract.event_date || "بدون تاريخ"}
                      </p>
                    </div>

                    <div className="text-left">
                      <p className="font-bold">{contract.contract_value || 0} ر.س</p>
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

function Stat({
  title,
  value,
  green,
  red,
}: {
  title: string;
  value: string | number;
  green?: boolean;
  red?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <p className="text-sm text-gray-500">{title}</p>
      <p
        className={`mt-2 text-3xl font-bold ${
          green ? "text-green-700" : red ? "text-red-700" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}