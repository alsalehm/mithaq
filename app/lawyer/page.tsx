"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MessageCircle,
  RefreshCw,
  Scale,
  UserRound,
  XCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type ConsultationStatus = "new" | "contacted" | "completed" | "cancelled";

type LegalConsultation = {
  id: string;
  client_name: string;
  consultation_type: string;
  preferred_contact_method: string;
  status: ConsultationStatus;
  created_at: string;
};

function statusArabic(status: ConsultationStatus) {
  if (status === "new") return "جديد";
  if (status === "contacted") return "تم التواصل";
  if (status === "completed") return "مكتمل";
  return "ملغي";
}

function statusClass(status: ConsultationStatus) {
  if (status === "new") {
    return "bg-blue-50 text-blue-700";
  }

  if (status === "contacted") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "completed") {
    return "bg-emerald-50 text-emerald-700";
  }

  return "bg-red-50 text-red-700";
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function LawyerDashboard() {
  const [consultations, setConsultations] = useState<LegalConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      profileError ||
      !profile ||
      (profile.role !== "lawyer" && profile.role !== "admin")
    ) {
      setMessage("ليس لديك صلاحية دخول لوحة المحامية.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("legal_consultations")
      .select(
        "id, client_name, consultation_type, preferred_contact_method, status, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("حدث خطأ أثناء تحميل بيانات لوحة المحامية.");
      setLoading(false);
      return;
    }

    setConsultations((data || []) as LegalConsultation[]);
    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = useMemo(
    () => ({
      new: consultations.filter((item) => item.status === "new").length,
      contacted: consultations.filter((item) => item.status === "contacted")
        .length,
      completed: consultations.filter((item) => item.status === "completed")
        .length,
      cancelled: consultations.filter((item) => item.status === "cancelled")
        .length,
    }),
    [consultations]
  );

  const latestConsultations = consultations.slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-[var(--mithaq-border)] bg-white p-6 shadow-[var(--mithaq-shadow-sm)] sm:p-8">
        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[var(--mithaq-primary-soft)] blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
              <Scale size={28} />
            </div>

            <p className="text-sm font-black text-[var(--mithaq-primary)]">
              بوابة المحامية
            </p>

            <h1 className="mt-2 text-3xl font-black text-[var(--mithaq-text)] sm:text-4xl">
              لوحة المحامية
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--mithaq-muted)]">
              متابعة طلبات الاستشارات القانونية، التواصل مع العملاء وتحديث حالة
              كل طلب من مكان واحد.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="mithaq-btn-secondary inline-flex items-center gap-2 px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              {loading ? "جاري التحديث..." : "تحديث البيانات"}
            </button>

            <Link
              href="/lawyer/legal-consultations"
              className="mithaq-btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
            >
              عرض جميع الطلبات
              <ArrowLeft size={17} />
            </Link>
          </div>
        </div>
      </section>

      {message && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          {message}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="طلبات جديدة"
          value={stats.new}
          icon={Clock3}
          loading={loading}
        />

        <StatCard
          title="تم التواصل"
          value={stats.contacted}
          icon={MessageCircle}
          loading={loading}
        />

        <StatCard
          title="مكتملة"
          value={stats.completed}
          icon={CheckCircle2}
          loading={loading}
        />

        <StatCard
          title="ملغاة"
          value={stats.cancelled}
          icon={XCircle}
          loading={loading}
        />
      </section>

      <section className="rounded-[32px] border border-[var(--mithaq-border)] bg-white p-6 shadow-[var(--mithaq-shadow-sm)] sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[var(--mithaq-primary)]">
              أحدث الطلبات
            </p>

            <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
              آخر طلبات الاستشارات
            </h2>
          </div>

          <Link
            href="/lawyer/legal-consultations"
            className="text-sm font-black text-[var(--mithaq-primary)] transition hover:underline"
          >
            عرض جميع الطلبات
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-dashed border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-10 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-2xl bg-[var(--mithaq-primary-soft)]" />

            <p className="text-sm font-black text-[var(--mithaq-primary)]">
              جاري تحميل أحدث الطلبات...
            </p>
          </div>
        ) : latestConsultations.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--mithaq-primary)]">
              <Scale size={27} />
            </div>

            <h3 className="text-lg font-black text-[var(--mithaq-text)]">
              لا توجد طلبات استشارات حتى الآن
            </h3>

            <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
              عندما يرسل أحد عملاء ميثاق طلب استشارة قانونية، سيظهر هنا.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {latestConsultations.map((item) => (
              <Link
                key={item.id}
                href={`/lawyer/legal-consultations/${item.id}`}
                className="group flex flex-col gap-4 rounded-[24px] border border-[var(--mithaq-border)] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--mithaq-primary)] hover:shadow-[var(--mithaq-shadow-sm)] md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
                    <UserRound size={23} />
                  </div>

                  <div>
                    <h3 className="font-black text-[var(--mithaq-text)]">
                      {item.client_name}
                    </h3>

                    <p className="mt-1 text-sm text-[var(--mithaq-muted)]">
                      {item.consultation_type}
                    </p>

                    <p className="mt-1 text-xs text-[var(--mithaq-muted-soft)]">
                      {formatDate(item.created_at)} •{" "}
                      {item.preferred_contact_method}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 md:justify-end">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                      item.status
                    )}`}
                  >
                    {statusArabic(item.status)}
                  </span>

                  <ArrowLeft
                    size={18}
                    className="text-[var(--mithaq-muted-soft)] transition group-hover:-translate-x-1 group-hover:text-[var(--mithaq-primary)]"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
}) {
  return (
    <div className="rounded-[28px] border border-[var(--mithaq-border)] bg-white p-5 shadow-[var(--mithaq-shadow-sm)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-[var(--mithaq-muted)]">
            {title}
          </p>

          <p className="mt-4 text-4xl font-black text-[var(--mithaq-text)]">
            {loading ? "—" : value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}