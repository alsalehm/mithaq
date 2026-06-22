"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SettingsPage() {
  const [signature, setSignature] = useState<string | null>(null);
const [businessName, setBusinessName] = useState("");
const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [city, setCity] = useState("");
async function saveProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("يجب تسجيل الدخول");
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      business_name: businessName,
      full_name: fullName,
      phone,
      city,
      signature_image: signature,
    });

  if (error) {
    alert(error.message);
    return;
  }

  alert("تم حفظ البيانات بنجاح");
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
            <label className="mb-2 block font-bold">
              اسم النشاط
            </label>

            <input
  type="text"
  value={businessName}
  onChange={(e) => setBusinessName(e.target.value)}
  className="w-full rounded-xl border p-3"
/>
          </div>

          <div>
            <label className="mb-2 block font-bold">
              الاسم الكامل
            </label>

            <input
              type="text"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">
              رقم الجوال
            </label>

            <input
              type="text"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">
              المدينة
            </label>

            <input
              type="text"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">
              توقيع المصور
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
            />

            {signature && (
              <img
                src={signature}
                alt="signature"
                className="mt-4 max-h-32 rounded border p-2"
              />
            )}
          </div>

          <button
  type="button"
  onClick={saveProfile}
  className="rounded-xl bg-[#75532F] px-6 py-3 font-bold text-white"
>
  حفظ البيانات
</button>
        </div>
      </div>
    </main>
  );
}