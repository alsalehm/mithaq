"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
type Customer = {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  email: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setCustomers((data || []) as Customer[]);
    setLoading(false);
  }

  async function createCustomer() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (!fullName.trim()) {
      toast.error("أدخل اسم العميل");
      return;
    }

    const { error } = await supabase.from("customers").insert({
      user_id: user.id,
      full_name: fullName,
      phone,
      city,
      email,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setFullName("");
    setPhone("");
    setCity("");
    setEmail("");

    loadCustomers();
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">العملاء</h1>

          <Link
            href="/dashboard"
            className="rounded-xl bg-black px-5 py-3 text-white"
          >
            رجوع للوحة التحكم
          </Link>
        </div>

        <div className="mb-8 rounded-3xl bg-white p-6 shadow-md">
          <h2 className="mb-5 text-2xl font-bold text-[#75532F]">
            إضافة عميل جديد
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="اسم العميل"
              className="rounded-xl border p-4 outline-none"
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم الجوال"
              className="rounded-xl border p-4 outline-none"
            />

            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="المدينة"
              className="rounded-xl border p-4 outline-none"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="rounded-xl border p-4 outline-none"
            />
          </div>

          <button
            onClick={createCustomer}
            className="mt-5 rounded-xl bg-[#75532F] px-6 py-3 font-bold text-white"
          >
            حفظ العميل
          </button>
        </div>

        {loading ? (
          <p>جاري التحميل...</p>
        ) : customers.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-md">
            <h2 className="mb-4 text-2xl font-bold">لا يوجد عملاء حتى الآن</h2>
            <p className="text-gray-600">
              أضف أول عميل لتبدأ بإدارة العقود والفواتير بسهولة.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="rounded-3xl bg-white p-6 shadow-md"
              >
                <h2 className="text-2xl font-bold">{customer.full_name}</h2>

                <div className="mt-3 space-y-2 text-gray-700">
                  <p>📱 {customer.phone || "-"}</p>
                  <p>📍 {customer.city || "-"}</p>
                  <p>✉️ {customer.email || "-"}</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
  <Link
    href={`/customers/${customer.id}`}
    className="rounded-xl bg-[#75532F] px-5 py-3 font-bold text-white"
  >
    عرض تفاصيل العميل
  </Link>
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}