"use client";

import Link from "next/link";

export default function NewLegalConsultationPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F5E9DC] px-6 py-10 text-[#362008]"
    >
      <div className="mx-auto max-w-3xl">

        <Link
          href="/legal-consultations"
          className="text-sm font-bold text-[#75532F] underline"
        >
          ← الرجوع للاستشارات
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-md">

          <h1 className="mb-8 text-3xl font-bold">
            طلب استشارة قانونية
          </h1>

          <div className="space-y-6">

            <div>
              <label className="mb-2 block font-bold">
                عنوان الاستشارة
              </label>

              <input
                type="text"
                placeholder="مثال: فسخ عقد تصوير"
                className="w-full rounded-xl border p-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                تفاصيل الاستشارة
              </label>

              <textarea
                rows={8}
                placeholder="اكتب تفاصيل الاستشارة هنا..."
                className="w-full rounded-xl border p-3 outline-none"
              />
            </div>

            <button
              className="rounded-xl bg-[#75532F] px-6 py-3 font-bold text-white"
            >
              إرسال الطلب
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}