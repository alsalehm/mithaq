"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
type ConsultationStatus = "new" | "contacted" | "completed" | "cancelled";

type LegalConsultation = {
  id: string;
  user_id: string;
  client_name: string;
  client_phone: string;
  client_national_id: string;
  city: string | null;
  consultation_type: string;
  description: string;
  preferred_contact_method: string;
  preferred_time: string | null;
  status: ConsultationStatus;
  created_at: string;
};

function statusArabic(status: string) {
  if (status === "new") return "جديد";
  if (status === "contacted") return "تم التواصل";
  if (status === "completed") return "مكتمل";
  if (status === "cancelled") return "ملغي";
  return status;
}

function statusColor(status: string) {
  if (status === "new") return "bg-blue-100 text-blue-800";
  if (status === "contacted") return "bg-yellow-100 text-yellow-800";
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "cancelled") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export default function LawyerLegalConsultationsPage() {
  const [consultations, setConsultations] = useState<LegalConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchConsultations();
  }, []);

async function fetchConsultations() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "/login";
    return;
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profileData) {
    setMessage("لا يمكن التحقق من صلاحيات الحساب.");
    setLoading(false);
    return;
  }

  if (profileData.role !== "lawyer" && profileData.role !== "admin") {
    setMessage("ليس لديك صلاحية دخول لوحة المحامية.");
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from("legal_consultations")
    .select(
      "id, user_id, client_name, client_phone, client_national_id, city, consultation_type, description, preferred_contact_method, preferred_time, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    setMessage("حدث خطأ أثناء تحميل طلبات الاستشارة.");
    setLoading(false);
    return;
  }

  setConsultations((data || []) as LegalConsultation[]);
  setLoading(false);
}

  async function updateStatus(id: string, status: ConsultationStatus) {
    const { error } = await supabase
      .from("legal_consultations")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      setMessage("تعذر تحديث حالة الطلب.");
      return;
    }

    setConsultations((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );

    setMessage("تم تحديث حالة الطلب بنجاح.");
  }

  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        item.client_name.toLowerCase().includes(searchText) ||
        item.client_phone.toLowerCase().includes(searchText) ||
        item.client_national_id.toLowerCase().includes(searchText) ||
        item.consultation_type.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [consultations, search, statusFilter]);

  const stats = {
    new: consultations.filter((item) => item.status === "new").length,
    contacted: consultations.filter((item) => item.status === "contacted")
      .length,
    completed: consultations.filter((item) => item.status === "completed")
      .length,
    cancelled: consultations.filter((item) => item.status === "cancelled")
      .length,
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#362008]">
            طلبات الاستشارات القانونية ⚖️
          </h1>

          <p className="mt-2 text-[#75532F]">
            من هنا تستطيع المحامية متابعة طلبات العملاء وتحديث حالة كل طلب.
          </p>
        </div>

        <button
          onClick={fetchConsultations}
          disabled={loading}
          className="rounded-xl bg-[#75532F] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "جاري التحديث..." : "تحديث الطلبات"}
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">طلبات جديدة</p>
          <p className="mt-3 text-4xl font-bold text-[#362008]">{stats.new}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">تم التواصل</p>
          <p className="mt-3 text-4xl font-bold text-[#362008]">
            {stats.contacted}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">مكتملة</p>
          <p className="mt-3 text-4xl font-bold text-[#362008]">
            {stats.completed}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">ملغاة</p>
          <p className="mt-3 text-4xl font-bold text-[#362008]">
            {stats.cancelled}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم العميل أو الجوال أو رقم الهوية"
            className="rounded-xl border border-[#E0C9AD] p-3 outline-none md:col-span-2"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#E0C9AD] p-3 outline-none"
          >
            <option value="all">كل الحالات</option>
            <option value="new">جديد</option>
            <option value="contacted">تم التواصل</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-xl bg-white p-4 text-[#362008] shadow-sm">
          {message}
        </div>
      )}

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        {loading ? (
          <div className="p-6 text-center text-[#75532F]">
            جاري تحميل طلبات الاستشارات...
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E0C9AD] bg-[#FDF8F1] p-10 text-center">
            <div className="text-4xl">⚖️</div>

            <h2 className="mt-4 text-xl font-bold text-[#362008]">
              لا توجد طلبات استشارات حتى الآن
            </h2>

            <p className="mt-2 text-[#75532F]">
              عندما يرسل عميل من منصة ميثاق طلب استشارة قانونية، سيظهر هنا.
            </p>

            <button
              onClick={fetchConsultations}
              className="mt-5 rounded-xl bg-[#75532F] px-5 py-3 text-sm font-semibold text-white"
            >
              تحديث
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredConsultations.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#F1E4D6] bg-white p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        🟢 عميل ميثاق
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                          item.status
                        )}`}
                      >
                        {statusArabic(item.status)}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[#362008]">
                      {item.client_name}
                    </h2>

                    <div className="mt-3 grid gap-2 text-sm text-[#75532F] md:grid-cols-2">
                      <p>📱 الجوال: {item.client_phone}</p>
                      <p>🪪 رقم الهوية: {item.client_national_id}</p>
                      <p>🏙 المدينة: {item.city || "غير محددة"}</p>
                      <p>🎯 نوع الاستشارة: {item.consultation_type}</p>
                      <p>💬 طريقة التواصل: {item.preferred_contact_method}</p>
                      <p>🕒 الوقت المناسب: {item.preferred_time || "غير محدد"}</p>
                      <p>📅 تاريخ الطلب: {formatDate(item.created_at)}</p>
                    </div>

                    <div className="mt-4 rounded-xl bg-[#FDF8F1] p-4 text-sm text-[#362008]">
                      <p className="mb-1 font-semibold">وصف مختصر:</p>
                      <p className="leading-7">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex min-w-[220px] flex-col gap-3">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateStatus(
                          item.id,
                          e.target.value as ConsultationStatus
                        )
                      }
                      className="rounded-xl border border-[#E0C9AD] p-3 text-sm outline-none"
                    >
                      <option value="new">جديد</option>
                      <option value="contacted">تم التواصل</option>
                      <option value="completed">مكتمل</option>
                      <option value="cancelled">ملغي</option>
                    </select>

                    <Link
                      href={`/lawyer/legal-consultations/${item.id}`}
                      className="rounded-xl bg-[#75532F] px-5 py-3 text-center text-sm font-semibold text-white"
                    >
                      عرض التفاصيل
                    </Link>

                    <a
                      href={`https://wa.me/${item.client_phone.replace(/\D/g, "")}`}
                      target="_blank"
                      className="rounded-xl border border-[#75532F] px-5 py-3 text-center text-sm font-semibold text-[#75532F]"
                    >
                      تواصل واتساب
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}