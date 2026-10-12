
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleResetRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("يرجى إدخال البريد الإلكتروني.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        console.error("Password reset request failed:", error);
        toast.error("تعذر إرسال الطلب. حاول مرة أخرى لاحقًا.");
        return;
      }

      setSent(true);
      toast.success("تم استلام طلب استعادة كلمة المرور.");
    } catch (error) {
      console.error("Unexpected password reset error:", error);
      toast.error("حدث خطأ غير متوقع. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
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
              <ShieldCheck size={32} />
            </div>

            <h1 className="text-6xl font-black leading-tight">
              استعادة
              <br />
              كلمة المرور
            </h1>

            <p className="mt-6 max-w-md leading-8 text-[#F5E9DC]/85">
              استعد الوصول إلى حسابك في ميثاق بخطوات بسيطة وآمنة،
              وواصل إدارة أعمالك من مكان واحد.
            </p>
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-lg font-black">
              حسابك وبيانات أعمالك في أمان.
            </p>
            <p className="mt-2 text-sm leading-7 text-[#F5E9DC]/85">
              تغيير كلمة المرور لا يؤثر على عقودك أو فواتيرك أو بيانات عملائك.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center bg-white p-10 md:p-16">
          <div className="w-full max-w-md">
            <Link
              href="/login"
              className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[var(--mithaq-muted)] transition hover:text-[var(--mithaq-primary)]"
            >
              <ArrowLeft size={16} />
              العودة لتسجيل الدخول
            </Link>

            <div className="mb-10">
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                استعادة الحساب
              </p>

              <h2 className="mt-2 text-3xl font-black text-[var(--mithaq-text)] sm:text-4xl">
                نسيت كلمة المرور؟
              </h2>

              <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
                {sent
                  ? "إذا كان البريد الإلكتروني مرتبطًا بحساب في ميثاق، فستصلك رسالة تحتوي على رابط إعادة تعيين كلمة المرور. تحقق من البريد الوارد والرسائل غير المرغوبة."
                  : "أدخل بريدك الإلكتروني المسجل في ميثاق، وسنرسل لك رابطًا لإنشاء كلمة مرور جديدة."}
              </p>
            </div>

            {!sent ? (
              <form onSubmit={handleResetRequest} className="space-y-5">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="mb-2 block text-sm font-black text-[var(--mithaq-text)]"
                  >
                    البريد الإلكتروني
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mithaq-muted-soft)]"
                    />

                    <input
                      id="reset-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] px-4 py-3 pr-11 outline-none transition focus:border-[var(--mithaq-primary)] focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mithaq-btn-primary w-full px-6 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "جاري إرسال الطلب..." : "إرسال رابط الاستعادة"}
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5 text-sm leading-7 text-[var(--mithaq-text)]">
                  تحقق من بريدك الإلكتروني، واتبع التعليمات الموجودة
                  في رسالة استعادة كلمة المرور.
                </div>

                <Link
                  href="/login"
                  className="mithaq-btn-primary block w-full px-6 py-3.5 text-center text-sm"
                >
                  العودة لتسجيل الدخول
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
