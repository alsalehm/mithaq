"use client";

import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { supabase } from "../lib/supabase";
import { canUseLegalConsultation } from "../lib/billing/access";
import {
  Clock3,
  FileText,
  IdCard,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  Send,
  UserRound,
} from "lucide-react";

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

const access = await canUseLegalConsultation(user.id);

if (!access.allowed) {
  window.location.href = "/dashboard/subscription";
  return;
}

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

    setMessage(
      "تم إرسال طلب الاستشارة بنجاح. سيتم فتح واتساب لإرسال الطلب للمحامية."
    );

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
      <AppShell>
        <div className="mithaq-card-premium rounded-[32px] p-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-2xl bg-[var(--mithaq-primary-soft)]" />
          <p className="text-sm font-black text-[var(--mithaq-primary)]">
            جاري تحميل صفحة الاستشارات...
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="rounded-[32px] border border-[var(--mithaq-border)] bg-white/75 p-6 shadow-[var(--mithaq-shadow-sm)] backdrop-blur">
          <p className="text-sm font-black text-[var(--mithaq-primary)]">
            الخدمات القانونية
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-[var(--mithaq-text)]">
            المستشار القانوني
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--mithaq-muted)]">
            يمكنك من خلال هذه الصفحة طلب استشارة قانونية من المحامية المعتمدة لدى
            ميثاق. سيتم إرسال بيانات طلبك مباشرة عبر واتساب، ثم يتم التنسيق بينكم
            بخصوص الموعد وطريقة التواصل والدفع.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="mithaq-card rounded-[32px] p-5 sm:p-6 lg:col-span-2">
            <p className="text-sm font-black text-[var(--mithaq-primary)]">
              طلب جديد
            </p>
            <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
              طلب استشارة قانونية
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
              عبّئ البيانات التالية بدقة حتى يتم إرسال الطلب للمحامية عبر واتساب.
            </p>
          </div>

          <div className="mithaq-card rounded-[32px] p-6">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
              <Scale size={28} />
            </div>

            <p className="text-sm font-black text-[var(--mithaq-primary)]">
              المحامية المعتمدة
            </p>

            <h3 className="mt-2 text-xl font-black text-[var(--mithaq-text)]">
              {lawyer?.lawyer_name || "غير محدد"}
            </h3>

            <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
              يتم الاتفاق على الموعد والتكلفة والدفع مباشرة بين العميل والمحامية.
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mithaq-card rounded-[32px] p-6">
          <div className="mb-6">
            <p className="text-sm font-black text-[var(--mithaq-primary)]">
              بيانات الطلب
            </p>
            <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
              معلومات الاستشارة
            </h2>
            <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
              الحقول التي تحتوي على علامة * مطلوبة.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="الاسم الكامل *"
              value={clientName}
              onChange={setClientName}
              placeholder="مثال: عبدالرحمن السالم"
              icon={UserRound}
            />

            <Field
              label="رقم الجوال *"
              value={clientPhone}
              onChange={setClientPhone}
              placeholder="مثال: 05XXXXXXXX"
              icon={Phone}
            />

            <Field
              label="رقم الهوية *"
              value={clientNationalId}
              onChange={setClientNationalId}
              placeholder="رقم الهوية الوطنية أو الإقامة"
              icon={IdCard}
            />

            <Field
              label="المدينة"
              value={city}
              onChange={setCity}
              placeholder="مثال: الرياض"
              icon={MapPin}
            />

            <SelectField
              label="نوع الاستشارة *"
              value={consultationType}
              onChange={setConsultationType}
              icon={FileText}
            >
              <option value="">اختر نوع الاستشارة</option>
              <option value="مراجعة عقد">مراجعة عقد</option>
              <option value="نزاع مع عميل">نزاع مع عميل</option>
              <option value="تحصيل مستحقات">تحصيل مستحقات</option>
              <option value="استفسار قانوني عام">استفسار قانوني عام</option>
              <option value="أخرى">أخرى</option>
            </SelectField>

            <SelectField
              label="طريقة التواصل المفضلة *"
              value={preferredContactMethod}
              onChange={setPreferredContactMethod}
              icon={MessageCircle}
            >
              <option value="واتساب">واتساب</option>
              <option value="اتصال هاتفي">اتصال هاتفي</option>
              <option value="Zoom">Zoom</option>
            </SelectField>

            <Field
              label="الوقت المناسب للتواصل"
              value={preferredTime}
              onChange={setPreferredTime}
              placeholder="مثال: بعد العصر / مساءً / يوم الأحد"
              icon={Clock3}
            />

            <div className="md:col-span-2">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-[var(--mithaq-text)]">
                  وصف مختصر للمشكلة *
                </span>

                <div className="relative">
                  <FileText
                    size={19}
                    className="pointer-events-none absolute right-4 top-4 text-[var(--mithaq-muted-soft)]"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-36 w-full rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 pr-11 text-sm leading-7 text-[var(--mithaq-text)] outline-none transition placeholder:text-[var(--mithaq-muted-soft)] focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
                    placeholder="اكتب تفاصيل مختصرة تساعد المحامية على فهم الحالة"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5 text-sm leading-7 text-[var(--mithaq-primary)]">
            ميثاق يسهّل وصولك إلى محامية مستقلة، ولا يقدم استشارات قانونية
            مباشرة. يتم الاتفاق على الموعد والتكلفة والدفع مباشرة بين العميل
            والمحامية.
          </div>

          {message && (
            <p className="mt-4 rounded-2xl border border-[var(--mithaq-border)] bg-white p-4 text-sm font-black leading-7 text-[var(--mithaq-text)]">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mithaq-btn-primary mt-6 flex w-full items-center justify-center gap-2 px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />
            {saving ? "جاري الإرسال..." : "إرسال طلب الاستشارة"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ElementType;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[var(--mithaq-text)]">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={19}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mithaq-muted-soft)]"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 pr-11 text-sm text-[var(--mithaq-text)] outline-none transition placeholder:text-[var(--mithaq-muted-soft)] focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  icon: Icon,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[var(--mithaq-text)]">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={19}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mithaq-muted-soft)]"
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 pr-11 text-sm text-[var(--mithaq-text)] outline-none transition focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
        >
          {children}
        </select>
      </div>
    </label>
  );
}