"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type LegalSettings = {
  lawyer_name: string;
  lawyer_phone: string;
};

export default function LegalConsultationsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [lawyer, setLawyer] = useState<LegalSettings | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNationalId, setClientNationalId] = useState("");
  const [city, setCity] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [description, setDescription] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState("واتساب");
  const [preferredTime, setPreferredTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPage() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserId(user.id);

      const { data: settingsData, error: settingsError } = await supabase
        .from("legal_settings")
        .select("lawyer_name, lawyer_phone")
        .eq("is_active", true)
        .limit(1)
        .single();

      if (settingsError) {
        console.error(settingsError);
      } else {
        setLawyer(settingsData);
      }

      setLoading(false);
    }

    loadPage();
  }, []);

  function normalizePhone(phone: string) {
    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("05")) {
      cleaned = "966" + cleaned.slice(1);
    }

    if (cleaned.startsWith("5")) {
      cleaned = "966" + cleaned;
    }

    return cleaned;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!userId) {
      setMessage("يجب تسجيل الدخول أولًا.");
      return;
    }

    if (!lawyer) {
      setMessage("لم يتم العثور على بيانات المحامية.");
      return;
    }

    if (
      !clientName ||
      !clientPhone ||
      !clientNationalId ||
      !consultationType ||
      !description ||
      !preferredContactMethod
    ) {
      setMessage("يرجى تعبئة جميع الحقول المطلوبة.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("legal_consultations").insert({
      user_id: userId,
      client_name: clientName,
      client_phone: clientPhone,
      client_national_id: clientNationalId,
      city,
      consultation_type: consultationType,
      description,
      preferred_contact_method: preferredContactMethod,
      preferred_time: preferredTime,
      status: "new",
    });

    setSaving(false);

    if (error) {
      console.error(error);
      setMessage("حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
      return;
    }

    const lawyerPhone = normalizePhone(lawyer.lawyer_phone);

    const whatsappMessage = `
طلب استشارة قانونية جديد من منصة ميثاق

هذا الطلب مرسل من عميل مسجل داخل منصة ميثاق.

اسم العميل:
${clientName}

رقم جوال العميل:
${clientPhone}

رقم الهوية:
${clientNationalId}

المدينة:
${city || "غير محدد"}

نوع الاستشارة:
${consultationType}

وصف المشكلة:
${description}

طريقة التواصل المفضلة:
${preferredContactMethod}

الوقت المناسب للتواصل:
${preferredTime || "غير محدد"}

ملاحظة:
يتم الاتفاق على الموعد والتكلفة والدفع مباشرة بين العميل والمحامية.
`;

    const whatsappUrl = `https://wa.me/${lawyerPhone}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank");

    setMessage("تم إرسال طلب الاستشارة بنجاح. سيتم فتح واتساب لإرسال الطلب للمحامية.");

    setClientName("");
    setClientPhone("");
    setClientNationalId("");
    setCity("");
    setConsultationType("");
    setDescription("");
    setPreferredContactMethod("واتساب");
    setPreferredTime("");
  }

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-6">
        <p className="text-[#362008]">جاري التحميل...</p>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold text-[#362008]">
            المستشار القانوني ⚖️
          </h1>

          <p className="text-[#75532F]">
            يمكنك من خلال هذه الصفحة طلب استشارة قانونية من المحامية المعتمدة لدى
            ميثاق. سيتم إرسال بيانات طلبك مباشرة للمحامية عبر واتساب، ثم يتم
            التنسيق بينكم بخصوص الموعد وطريقة التواصل والدفع.
          </p>

          {lawyer && (
            <div className="mt-4 rounded-xl border border-[#E0C9AD] bg-[#FDF8F1] p-4">
              <p className="font-semibold text-[#362008]">
                المحامية المعتمدة:
              </p>
              <p className="text-[#75532F]">{lawyer.lawyer_name}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-[#362008]">
            طلب استشارة قانونية
          </h2>

          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#362008]">
                الاسم الكامل *
              </label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-xl border border-[#E0C9AD] p-3 outline-none"
                placeholder="مثال: عبدالرحمن السالم"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#362008]">
                رقم الجوال *
              </label>
              <input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full rounded-xl border border-[#E0C9AD] p-3 outline-none"
                placeholder="مثال: 05XXXXXXXX"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#362008]">
                رقم الهوية *
              </label>
              <input
                value={clientNationalId}
                onChange={(e) => setClientNationalId(e.target.value)}
                className="w-full rounded-xl border border-[#E0C9AD] p-3 outline-none"
                placeholder="رقم الهوية الوطنية أو الإقامة"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#362008]">
                المدينة
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-[#E0C9AD] p-3 outline-none"
                placeholder="مثال: الرياض"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#362008]">
                نوع الاستشارة *
              </label>
              <select
                value={consultationType}
                onChange={(e) => setConsultationType(e.target.value)}
                className="w-full rounded-xl border border-[#E0C9AD] p-3 outline-none"
              >
                <option value="">اختر نوع الاستشارة</option>
                <option value="مراجعة عقد">مراجعة عقد</option>
                <option value="نزاع مع عميل">نزاع مع عميل</option>
                <option value="تحصيل مستحقات">تحصيل مستحقات</option>
                <option value="استفسار قانوني عام">استفسار قانوني عام</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#362008]">
                وصف مختصر للمشكلة *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-32 w-full rounded-xl border border-[#E0C9AD] p-3 outline-none"
                placeholder="اكتب تفاصيل مختصرة تساعد المحامية على فهم الحالة"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#362008]">
                طريقة التواصل المفضلة *
              </label>
              <select
                value={preferredContactMethod}
                onChange={(e) => setPreferredContactMethod(e.target.value)}
                className="w-full rounded-xl border border-[#E0C9AD] p-3 outline-none"
              >
                <option value="واتساب">واتساب</option>
                <option value="اتصال هاتفي">اتصال هاتفي</option>
                <option value="Zoom">Zoom</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#362008]">
                الوقت المناسب للتواصل
              </label>
              <input
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full rounded-xl border border-[#E0C9AD] p-3 outline-none"
                placeholder="مثال: بعد العصر / مساءً / يوم الأحد"
              />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[#E0C9AD] bg-[#FDF8F1] p-4 text-sm text-[#75532F]">
            ميثاق يسهّل وصولك إلى محامية مستقلة، ولا يقدم استشارات قانونية
            مباشرة. يتم الاتفاق على الموعد والتكلفة والدفع مباشرة بين العميل
            والمحامية.
          </div>

          {message && (
            <p className="mt-4 rounded-xl bg-[#FDF8F1] p-3 text-sm text-[#362008]">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-[#75532F] px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {saving ? "جاري الإرسال..." : "إرسال طلب الاستشارة"}
          </button>
        </form>
      </div>
    </main>
  );
}