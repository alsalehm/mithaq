
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import {
  Building2,
  FileText,
  IdCard,
  MapPin,
  Phone,
  Save,
  Signature,
  Upload,
  UserRound,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const [signature, setSignature] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [fullName, setFullName] = useState("");
  const [proofNumber, setProofNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [defaultTerms, setDefaultTerms] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "business_name, full_name, proof_number, phone, city, signature_image, default_contract_terms"
      )
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      toast.error("حدث خطأ أثناء تحميل البيانات");
      setLoading(false);
      return;
    }

    if (data) {
      setBusinessName(data.business_name || "");
      setFullName(data.full_name || "");
      setProofNumber(data.proof_number || "");
      setPhone(data.phone || "");
      setCity(data.city || "");
      setSignature(data.signature_image || null);
      setDefaultTerms(data.default_contract_terms || "");
    }

    setLoading(false);
  }

  async function saveProfile() {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("يجب تسجيل الدخول");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      business_name: businessName,
      full_name: fullName,
      proof_number: proofNumber,
      phone,
      city,
      signature_image: signature,
      default_contract_terms: defaultTerms,
    });

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("تم حفظ البيانات بنجاح");

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  }

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setSignature(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  if (loading) {
    return (
      <AppShell>
        <div className="mithaq-card-premium rounded-[32px] p-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-2xl bg-[var(--mithaq-primary-soft)]" />

          <p className="text-sm font-black text-[var(--mithaq-primary)]">
            جاري تحميل الإعدادات...
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="rounded-[32px] border border-[var(--mithaq-border)] bg-white/75 p-6 shadow-[var(--mithaq-shadow-sm)] backdrop-blur">
          <div>
            <p className="text-sm font-black text-[var(--mithaq-primary)]">
              إعدادات المنصة
            </p>

            <h1 className="mt-2 text-3xl font-black text-[var(--mithaq-text)] sm:text-4xl">
              إعدادات الحساب
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--mithaq-muted)]">
              حدّث بيانات نشاطك، توقيعك، والشروط الافتراضية التي تظهر في العقود
              الجديدة.
            </p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="mithaq-card rounded-[32px] p-6">
              <div className="mb-6">
                <p className="text-sm font-black text-[var(--mithaq-primary)]">
                  الملف التجاري
                </p>

                <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                  بيانات الحساب
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
                  تُستخدم هذه البيانات لتجهيز معلومات مقدم الخدمة في العقود
                  والفواتير.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="اسم النشاط"
                  icon={Building2}
                  value={businessName}
                  onChange={setBusinessName}
                  placeholder="مثال: استديو ميثاق"
                />

                <Field
                  label="الاسم الكامل"
                  icon={UserRound}
                  value={fullName}
                  onChange={setFullName}
                  placeholder="مثال: عبدالرحمن السالم"
                />

                <Field
                  label="رقم الإثبات"
                  icon={IdCard}
                  value={proofNumber}
                  onChange={setProofNumber}
                  placeholder="رقم الهوية أو الإقامة أو السجل التجاري"
                />

                <Field
                  label="رقم الجوال"
                  icon={Phone}
                  value={phone}
                  onChange={setPhone}
                  placeholder="مثال: 05XXXXXXXX"
                />

                <Field
                  label="المدينة"
                  icon={MapPin}
                  value={city}
                  onChange={setCity}
                  placeholder="مثال: الرياض"
                />
              </div>
            </div>

            <div className="mithaq-card rounded-[32px] p-6">
              <div className="mb-6">
                <p className="text-sm font-black text-[var(--mithaq-primary)]">
                  العقود
                </p>

                <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                  الشروط الافتراضية للعقود
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
                  سيتم استخدام هذه الشروط تلقائيًا عند إنشاء عقد جديد.
                </p>
              </div>

              <div className="relative">
                <FileText
                  size={20}
                  className="pointer-events-none absolute right-4 top-4 text-[var(--mithaq-muted-soft)]"
                />

                <textarea
                  rows={10}
                  value={defaultTerms}
                  onChange={(event) => setDefaultTerms(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 pr-11 text-sm leading-7 text-[var(--mithaq-text)] outline-none transition placeholder:text-[var(--mithaq-muted-soft)] focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
                  placeholder="اكتب الشروط التي تريد ظهورها تلقائياً في جميع العقود الجديدة..."
                />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="mithaq-card rounded-[32px] p-6">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
                <Signature size={27} />
              </div>

              <h2 className="text-2xl font-black text-[var(--mithaq-text)]">
                توقيع مقدم الخدمة
              </h2>

              <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
                ارفع توقيعك مرة واحدة، وسيظهر تلقائيًا في العقود الجديدة.
              </p>

              <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5 text-center text-sm font-black text-[var(--mithaq-primary)] transition hover:border-[var(--mithaq-border-strong)] hover:bg-[var(--mithaq-primary-soft)]">
                <Upload size={18} />
                رفع توقيع

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>

              {signature ? (
                <div className="mt-5 rounded-2xl border border-[var(--mithaq-border)] bg-white p-4">
                  <p className="mb-3 text-sm font-black text-[var(--mithaq-primary)]">
                    التوقيع الحالي
                  </p>

                  <img
                    src={signature}
                    alt="توقيع مقدم الخدمة"
                    className="max-h-32 rounded-xl border border-[var(--mithaq-border)] bg-white p-2"
                  />
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-4 text-sm leading-7 text-[var(--mithaq-muted)]">
                  لم يتم رفع توقيع حتى الآن.
                </div>
              )}
            </div>

            <div className="mithaq-card-premium rounded-[32px] p-6">
              <h3 className="text-xl font-black text-[var(--mithaq-text)]">
                جاهز للحفظ؟
              </h3>

              <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
                بعد الحفظ سيتم الرجوع تلقائيًا إلى لوحة التحكم.
              </p>

              <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
                className="mithaq-btn-primary mt-5 flex w-full items-center justify-center gap-2 px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />

                {saving ? "جاري الحفظ..." : "حفظ البيانات"}
              </button>
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
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
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 pr-11 text-sm text-[var(--mithaq-text)] outline-none transition placeholder:text-[var(--mithaq-muted-soft)] focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}