"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import { ArrowLeft, LockKeyhole, Mail, Rocket, UserRound } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (loading) return;

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      setLoading(false);
      toast.error("تم إنشاء الحساب، لكن لم نتمكن من تجهيز الاشتراك المجاني");
      return;
    }

    const { data: freePlan, error: planError } = await supabase
      .from("plans")
      .select("id")
      .eq("slug", "free")
      .single();

    if (planError || !freePlan) {
      setLoading(false);
      toast.error("لم يتم العثور على الباقة المجانية");
      return;
    }

    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan_id: freePlan.id,
        status: "free",
      });

    setLoading(false);

    if (subscriptionError) {
      toast.error("تم إنشاء الحساب، لكن حدث خطأ في تجهيز الاشتراك المجاني");
      return;
    }

    toast.success("تم إنشاء الحساب بنجاح");

    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center px-6 py-10"
    >
      <div className="grid w-full max-w-7xl overflow-hidden rounded-[36px] border border-[var(--mithaq-border)] bg-white shadow-[var(--mithaq-shadow-lg)] lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-[var(--mithaq-text)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[#B59676]/30 blur-3xl" />

          <div className="relative">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-[#F5E9DC] shadow-sm">
              <Rocket size={36} />
            </div>

            <h1 className="text-6xl font-black leading-tight">
              ابدأ رحلتك مع
              <br />
              ميثاق
            </h1>

            <p className="mt-6 max-w-md leading-8 text-[#F5E9DC]/85">
أنشئ حسابك وابدأ بإدارة أعمالك من مكان واحد.
            </p>
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-lg font-black">
              صُممت للمستقلين والمحترفين في العالم العربي.
            </p>

            <p className="mt-2 text-sm leading-7 text-[#F5E9DC]/85">
              سهلة • احترافية • آمنة
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center bg-white p-10 md:p-16">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[var(--mithaq-muted)] transition hover:text-[var(--mithaq-primary)]"
            >
              <ArrowLeft size={16} />
              العودة للرئيسية
            </Link>

            <div className="mb-10">
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                إنشاء حساب جديد
              </p>

              <h2 className="mt-2 text-4xl font-black text-[var(--mithaq-text)]">
                أهلاً بك
              </h2>

              <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
                أنشئ حسابك خلال أقل من دقيقة وابدأ باستخدام منصة ميثاق.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-black text-[var(--mithaq-text)]">
                  الاسم الكامل
                </label>

                <div className="relative">
                  <UserRound
                    size={20}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mithaq-muted-soft)]"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="عبدالرحمن السالم"
                    className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] px-4 py-3 pr-11 outline-none transition focus:border-[var(--mithaq-primary)] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-[var(--mithaq-text)]">
                  البريد الإلكتروني
                </label>

                <div className="relative">
                  <Mail
                    size={20}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mithaq-muted-soft)]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] px-4 py-3 pr-11 outline-none transition focus:border-[var(--mithaq-primary)] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-[var(--mithaq-text)]">
                  كلمة المرور
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={20}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mithaq-muted-soft)]"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] px-4 py-3 pr-11 outline-none transition focus:border-[var(--mithaq-primary)] focus:bg-white"
                  />
                </div>
              </div>

              <button
                onClick={handleSignup}
                disabled={loading}
                className="mithaq-btn-primary w-full px-6 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
              </button>

              <p className="text-center text-sm text-[var(--mithaq-muted)]">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/login"
                  className="font-black text-[var(--mithaq-primary)] transition hover:underline"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}