"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "../components/AppShell";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  UserPlus,
  UsersRound,
} from "lucide-react";

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

    toast.success("تم حفظ العميل بنجاح");

    setFullName("");
    setPhone("");
    setCity("");
    setEmail("");

    loadCustomers();
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="rounded-[32px] border border-[var(--mithaq-border)] bg-white/75 p-6 shadow-[var(--mithaq-shadow-sm)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                إدارة العملاء
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-black text-[var(--mithaq-text)]">
                العملاء
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
                أضف عملاءك وتابع بيانات التواصل الخاصة بهم من مكان واحد.
              </p>
            </div>

            <div className="mithaq-card flex items-center gap-4 rounded-[28px] px-6 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
                <UsersRound size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--mithaq-muted)]">
                  إجمالي العملاء
                </p>
                <p className="mt-1 text-3xl font-black text-[var(--mithaq-primary)]">
                  {customers.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mithaq-card rounded-[32px] p-5 sm:p-6">
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-sm font-black text-[var(--mithaq-primary)]">
              عميل جديد
            </p>
            <h2 className="text-2xl font-black text-[var(--mithaq-text)]">
              إضافة عميل جديد
            </h2>
            <p className="text-sm leading-7 text-[var(--mithaq-muted)]">
              احفظ بيانات العميل لاستخدامها لاحقًا في العقود والفواتير.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="اسم العميل"
              value={fullName}
              onChange={setFullName}
              placeholder="مثال: أحمد محمد"
              icon={UsersRound}
            />

            <Field
              label="رقم الجوال"
              value={phone}
              onChange={setPhone}
              placeholder="05xxxxxxxx"
              icon={Phone}
            />

            <Field
              label="المدينة"
              value={city}
              onChange={setCity}
              placeholder="مثال: الرياض"
              icon={MapPin}
            />

            <Field
              label="البريد الإلكتروني"
              value={email}
              onChange={setEmail}
              placeholder="client@email.com"
              icon={Mail}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={createCustomer}
              className="mithaq-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
            >
              <Save size={18} />
              حفظ العميل
            </button>

            <button
              type="button"
              onClick={() => {
                setFullName("");
                setPhone("");
                setCity("");
                setEmail("");
              }}
              className="mithaq-btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
            >
              <RotateCcw size={18} />
              مسح الحقول
            </button>
          </div>
        </section>

        <section className="mithaq-card rounded-[32px] p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                قائمة العملاء
              </p>
              <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                جميع العملاء
              </h2>
              <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
                جميع العملاء المرتبطين بحسابك.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-black text-[var(--mithaq-primary)] transition hover:gap-3"
            >
              الرجوع للوحة التحكم
              <ArrowLeft size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="rounded-[28px] bg-[var(--mithaq-surface-soft)] p-8 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-2xl bg-[var(--mithaq-primary-soft)]" />
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                جاري تحميل العملاء...
              </p>
            </div>
          ) : customers.length === 0 ? (
            <div className="rounded-[28px] border-2 border-dashed border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
                <UserPlus size={30} />
              </div>
              <h3 className="text-xl font-black text-[var(--mithaq-text)]">
                لا يوجد عملاء حتى الآن
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--mithaq-muted)]">
                أضف أول عميل لتبدأ بإدارة العقود والفواتير بسهولة داخل ميثاق.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {customers.map((customer) => (
                <article
                  key={customer.id}
                  className="group rounded-[28px] border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--mithaq-border-strong)] hover:bg-white hover:shadow-[var(--mithaq-shadow-md)]"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-[var(--mithaq-text)]">
                        {customer.full_name}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--mithaq-muted)]">
                        عميل مسجل في ميثاق
                      </p>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-xl font-black text-[var(--mithaq-primary)]">
                      {customer.full_name?.charAt(0) || "ع"}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-[var(--mithaq-muted)]">
                    <Info label="الجوال" value={customer.phone || "-"} icon={Phone} />
                    <Info label="المدينة" value={customer.city || "-"} icon={MapPin} />
                    <Info label="البريد" value={customer.email || "-"} icon={Mail} />
                  </div>

                  <Link
                    href={`/customers/${customer.id}`}
                    className="mithaq-btn-primary mt-6 flex items-center justify-center gap-2 px-5 py-3 text-sm"
                  >
                    عرض تفاصيل العميل
                    <ArrowLeft size={16} />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
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
          placeholder={placeholder}
          className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 pr-11 text-sm text-[var(--mithaq-text)] outline-none transition placeholder:text-[var(--mithaq-muted-soft)] focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
        />
      </div>
    </label>
  );
}

function Info({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3">
      <span className="flex items-center gap-2">
        <Icon size={16} className="text-[var(--mithaq-primary)]" />
        <span>{label}</span>
      </span>
      <span className="font-black text-[var(--mithaq-text)]">{value}</span>
    </div>
  );
}