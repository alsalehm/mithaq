"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const [signature, setSignature] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [fullName, setFullName] = useState("");
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
  "business_name, full_name, phone, city, signature_image, default_contract_terms"
)
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      alert("حدث خطأ أثناء تحميل بيانات الحساب: " + error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setBusinessName(data.business_name || "");
      setFullName(data.full_name || "");
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
      alert("يجب تسجيل الدخول");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      business_name: businessName,
      full_name: fullName,
      phone,
      city,
      signature_image: signature,
default_contract_terms: defaultTerms,
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("تم حفظ البيانات بنجاح");
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
      <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
        جاري تحميل الإعدادات...
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F5E9DC] px-6 py-10 text-[#362008]"
    >
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-3xl font-bold text-[#75532F]">
          إعدادات الحساب
        </h1>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block font-bold">اسم النشاط</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">الاسم الكامل</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">رقم الجوال</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">المدينة</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">توقيع المصور</label>

            <input type="file" accept="image/*" onChange={handleUpload} />

            {signature && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-bold text-[#75532F]">
                  التوقيع الحالي:
                </p>
                <img
                  src={signature}
                  alt="توقيع المصور"
                  className="max-h-32 rounded border bg-white p-2"
                />
              </div>
            )}
          </div>
<div>
  <label className="mb-2 block font-bold">
    الشروط الافتراضية للعقود
  </label>

  <textarea
    rows={10}
    value={defaultTerms}
    onChange={(e) => setDefaultTerms(e.target.value)}
    className="w-full rounded-xl border p-4 outline-none"
    placeholder="اكتب الشروط التي تريد ظهورها تلقائياً في جميع العقود الجديدة..."
  />
</div>
          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
            className="rounded-xl bg-[#75532F] px-6 py-3 font-bold text-white disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : "حفظ البيانات"}
          </button>
        </div>
      </div>
    </main>
  );
}