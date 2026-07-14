"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import DashboardStats from "../components/DashboardStats";
import DashboardFinancial from "../components/DashboardFinancial";
import DashboardContracts from "../components/DashboardContracts";
import QuickActions from "../components/QuickActions";
import { supabase } from "../lib/supabase";
import { LayoutDashboard } from "lucide-react";

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

  const loadDashboard = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const totalContracts = contracts.length;
  const totalInvoices = invoices.length;
  const totalCustomers = customers.length;
  const totalConsultations = consultations.length;

  const totalValue = contracts.reduce(
    (sum, item) => sum + (Number(item.contract_value) || 0),
    0
  );

  const totalRemaining = contracts.reduce(
  (sum, item) => sum + (Number(item.remaining_amount) || 0),
  0
);

const totalPaid = Math.max(totalValue - totalRemaining, 0);

  const latestContracts = contracts.slice(0, 5);

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 sm:px-6">
          <div className="mithaq-card-premium w-full max-w-md rounded-[28px] p-6 text-center sm:rounded-[32px] sm:p-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
              <LayoutDashboard size={28} />
            </div>

            <p className="text-lg font-black text-[var(--mithaq-text)]">
              جاري تحميل لوحة التحكم
            </p>

            <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
              يتم تجهيز بيانات العقود والفواتير والعملاء.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8">
        <section className="rounded-[28px] border border-[var(--mithaq-border)] bg-white/75 p-5 shadow-[var(--mithaq-shadow-sm)] backdrop-blur sm:rounded-[32px] sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                لوحة التحكم
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--mithaq-text)] sm:text-4xl">
                نظرة عامة على أعمالك
              </h1>

              <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
                تابع العملاء، العقود، الفواتير والاستشارات من مكان واحد.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
              <LayoutDashboard size={28} />
            </div>
          </div>
        </section>

        <DashboardStats
          totalCustomers={totalCustomers}
          totalContracts={totalContracts}
          totalInvoices={totalInvoices}
          totalConsultations={totalConsultations}
        />

        <DashboardFinancial
          totalValue={totalValue}
          totalPaid={totalPaid}
          totalRemaining={totalRemaining}
        />

        <QuickActions />

        <DashboardContracts contracts={latestContracts} />
      </div>
    </AppShell>
  );
}