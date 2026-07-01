"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type ConsultationStatus =
  | "new"
  | "contacted"
  | "completed"
  | "cancelled";

type Consultation = {
  id: string;
  client_name: string;
  client_phone: string;
  client_national_id: string;
  city: string;
  consultation_type: string;
  description: string;
  preferred_contact_method: string;
  preferred_time: string;
  status: ConsultationStatus;
  lawyer_notes: string | null;
  created_at: string;
};

export default function ConsultationDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [consultation, setConsultation] =
    useState<Consultation | null>(null);

  const [loading, setLoading] = useState(true);
const [notes, setNotes] = useState("");
const [savingNotes, setSavingNotes] = useState(false);
  async function loadConsultation() {
    const { data, error } = await supabase
      .from("legal_consultations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
    } else {
      setConsultation(data);
setNotes(data.lawyer_notes ?? "");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadConsultation();
  }, []);

  async function updateStatus(status: ConsultationStatus) {
    if (!consultation) return;

    const { error } = await supabase
      .from("legal_consultations")
      .update({
        status,
      })
      .eq("id", consultation.id);

    if (error) {
      alert("حدث خطأ");
      return;
    }

    setConsultation({
      ...consultation,
      status,
    });
  }

  function statusArabic(status: ConsultationStatus) {
    switch (status) {
      case "new":
        return "جديد";

      case "contacted":
        return "تم التواصل";

      case "completed":
        return "مكتمل";

      case "cancelled":
        return "ملغي";

      default:
        return status;
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("ar-SA");
  }
async function saveNotes() {
  if (!consultation) return;

  setSavingNotes(true);

  const { error } = await supabase
    .from("legal_consultations")
    .update({
      lawyer_notes: notes,
    })
    .eq("id", consultation.id);

  setSavingNotes(false);

  if (error) {
    alert("حدث خطأ أثناء حفظ الملاحظات.");
    return;
  }

  setConsultation({
    ...consultation,
    lawyer_notes: notes,
  });

  alert("تم حفظ الملاحظات بنجاح.");
}
  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#F5E9DC] p-8"
      >
        جاري التحميل...
      </main>
    );
  }

  if (!consultation) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#F5E9DC] p-8"
      >
        لم يتم العثور على الطلب.
      </main>
    );
  }
    return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#362008]">
            تفاصيل طلب الاستشارة ⚖️
          </h1>

          <p className="mt-2 text-[#75532F]">
            مراجعة بيانات العميل وتحديث حالة الطلب.
          </p>
        </div>

        <Link
          href="/lawyer/legal-consultations"
          className="rounded-xl border border-[#75532F] px-5 py-3 text-center text-sm font-semibold text-[#75532F]"
        >
          رجوع للطلبات
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-[#362008]">
              بيانات العميل
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-[#FDF8F1] p-4">
                <p className="text-sm text-[#75532F]">الاسم</p>
                <p className="mt-1 font-semibold text-[#362008]">
                  {consultation.client_name}
                </p>
              </div>

              <div className="rounded-xl bg-[#FDF8F1] p-4">
                <p className="text-sm text-[#75532F]">رقم الجوال</p>
                <p className="mt-1 font-semibold text-[#362008]">
                  {consultation.client_phone}
                </p>
              </div>

              <div className="rounded-xl bg-[#FDF8F1] p-4">
                <p className="text-sm text-[#75532F]">رقم الهوية</p>
                <p className="mt-1 font-semibold text-[#362008]">
                  {consultation.client_national_id}
                </p>
              </div>

              <div className="rounded-xl bg-[#FDF8F1] p-4">
                <p className="text-sm text-[#75532F]">المدينة</p>
                <p className="mt-1 font-semibold text-[#362008]">
                  {consultation.city || "غير محددة"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-[#362008]">
              تفاصيل الاستشارة
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-[#FDF8F1] p-4">
                <p className="text-sm text-[#75532F]">نوع الاستشارة</p>
                <p className="mt-1 font-semibold text-[#362008]">
                  {consultation.consultation_type}
                </p>
              </div>

              <div className="rounded-xl bg-[#FDF8F1] p-4">
                <p className="text-sm text-[#75532F]">طريقة التواصل المفضلة</p>
                <p className="mt-1 font-semibold text-[#362008]">
                  {consultation.preferred_contact_method}
                </p>
              </div>

              <div className="rounded-xl bg-[#FDF8F1] p-4">
                <p className="text-sm text-[#75532F]">الوقت المناسب</p>
                <p className="mt-1 font-semibold text-[#362008]">
                  {consultation.preferred_time || "غير محدد"}
                </p>
              </div>

              <div className="rounded-xl bg-[#FDF8F1] p-4">
                <p className="text-sm text-[#75532F]">تاريخ الطلب</p>
                <p className="mt-1 font-semibold text-[#362008]">
                  {formatDate(consultation.created_at)}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#FDF8F1] p-4">
              <p className="text-sm text-[#75532F]">وصف المشكلة</p>
              <p className="mt-2 leading-8 text-[#362008]">
                {consultation.description}
              </p>
            </div>
          </div>
        </div>
                <div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-[#362008]">
              حالة الطلب
            </h2>

            <div className="rounded-xl bg-[#FDF8F1] p-4">
              <p className="text-sm text-[#75532F]">الحالة الحالية</p>
              <p className="mt-1 font-semibold text-[#362008]">
                {statusArabic(consultation.status)}
              </p>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-[#362008]">
                تحديث الحالة
              </label>

              <select
                value={consultation.status}
                onChange={(e) =>
                  updateStatus(e.target.value as ConsultationStatus)
                }
                className="w-full rounded-xl border border-[#E0C9AD] p-3 outline-none"
              >
                <option value="new">جديد</option>
                <option value="contacted">تم التواصل</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-[#362008]">
              التواصل مع العميل
            </h2>

            <a
              href={`https://wa.me/${consultation.client_phone.replace(/\D/g, "")}`}
              target="_blank"
              className="block rounded-xl bg-[#75532F] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              فتح واتساب
            </a>

            <p className="mt-3 text-sm leading-7 text-[#75532F]">
              يتم الاتفاق على الموعد والتكلفة والدفع مباشرة بين العميل والمحامية.
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
  <h2 className="mb-3 text-xl font-bold text-[#362008]">
    ملاحظات المحامية
  </h2>

  <textarea
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    className="min-h-40 w-full rounded-xl border border-[#E0C9AD] p-3 leading-7 outline-none"
    placeholder="اكتبي هنا ملاحظات خاصة عن الطلب. هذه الملاحظات لا تظهر للعميل."
  />

  <button
    onClick={saveNotes}
    disabled={savingNotes}
    className="mt-4 w-full rounded-xl bg-[#75532F] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
  >
    {savingNotes ? "جاري الحفظ..." : "حفظ الملاحظات"}
  </button>
</div>
        </div>
      </div>
    </div>
  );
}