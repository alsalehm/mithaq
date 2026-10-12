
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let active = true;
    let recoveryDetected = false;

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event) => {
        if (!active) return;

        if (event === "PASSWORD_RECOVERY") {
          recoveryDetected = true;
          setAuthorized(true);
          setChecking(false);
        }
      });

    async function checkRecoveryLink() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const type = url.searchParams.get("type");

        if (code) {
          const { error } =
            await supabase.auth.exchangeCodeForSession(code);

          if (error) throw error;

          if (active) {
            setAuthorized(true);
          }
        } else if (tokenHash && type === "recovery") {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });

          if (error) throw error;

          if (active) {
            setAuthorized(true);
          }
        } else if (
          window.location.hash.includes("type=recovery")
        ) {
          // Supabase processes recovery tokens in the URL hash.
          // The PASSWORD_RECOVERY event authorizes the form.
          await new Promise((resolve) =>
            setTimeout(resolve, 800)
          );

          if (!recoveryDetected && active) {
            setAuthorized(false);
          }
        }
      } catch (error) {
        console.error("Recovery link verification failed:", error);

        if (active) {
          setAuthorized(false);
          toast.error("رابط الاستعادة غير صالح أو انتهت صلاحيته.");
        }
      } finally {
        if (active) setChecking(false);
      }
    }

    void checkRecoveryLink();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleUpdatePassword(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading || !authorized) return;

    if (password.length < 8) {
      toast.error("كلمة المرور يجب ألا تقل عن 8 أحرف.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error("Password update failed:", error);
        toast.error("تعذر تحديث كلمة المرور. حاول مرة أخرى.");
        return;
      }

      setCompleted(true);
      setPassword("");
      setConfirmPassword("");
      toast.success("تم تحديث كلمة المرور بنجاح.");

      await supabase.auth.signOut();
    } catch (error) {
      console.error("Unexpected password update error:", error);
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
              كلمة مرور
              <br />
              جديدة
            </h1>

            <p className="mt-6 max-w-md leading-8 text-[#F5E9DC]/85">
              عيّن كلمة مرور جديدة لحسابك في ميثاق،
              واستمر في إدارة أعمالك بأمان.
            </p>
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-lg font-black">
              حماية حسابك جزء من تجربة ميثاق.
            </p>
            <p className="mt-2 text-sm leading-7 text-[#F5E9DC]/85">
              لن تتأثر عقودك أو فواتيرك أو بيانات عملائك
              عند تغيير كلمة المرور.
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
                أمان الحساب
              </p>

              <h2 className="mt-2 text-3xl font-black text-[var(--mithaq-text)] sm:text-4xl">
                تعيين كلمة مرور جديدة
              </h2>

              {checking ? (
                <p className="mt-5 text-sm text-[var(--mithaq-muted)]">
                  جاري التحقق من رابط الاستعادة...
                </p>
              ) : completed ? (
                <div className="mt-6 space-y-5">
                  <p className="text-sm leading-7 text-[var(--mithaq-muted)]">
                    تم تغيير كلمة المرور بنجاح. يمكنك الآن
                    تسجيل الدخول باستخدام كلمة المرور الجديدة.
                  </p>

                  <Link
                    href="/login"
                    className="mithaq-btn-primary block w-full px-6 py-3.5 text-center text-sm"
                  >
                    تسجيل الدخول
                  </Link>
                </div>
              ) : !authorized ? (
                <div className="mt-6 space-y-5">
                  <p className="text-sm leading-7 text-[var(--mithaq-muted)]">
                    رابط استعادة كلمة المرور غير صالح أو انتهت
                    صلاحيته. يمكنك طلب رابط جديد.
                  </p>

                  <Link
                    href="/forgot-password"
                    className="mithaq-btn-primary block w-full px-6 py-3.5 text-center text-sm"
                  >
                    طلب رابط استعادة جديد
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleUpdatePassword}
                  className="mt-6 space-y-5"
                >
                  <div>
                    <label
                      htmlFor="new-password"
                      className="mb-2 block text-sm font-black text-[var(--mithaq-text)]"
                    >
                      كلمة المرور الجديدة
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mithaq-muted-soft)]"
                      />
                      <input
                        id="new-password"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] px-4 py-3 pr-11 outline-none transition focus:border-[var(--mithaq-primary)] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="mb-2 block text-sm font-black text-[var(--mithaq-text)]"
                    >
                      تأكيد كلمة المرور الجديدة
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mithaq-muted-soft)]"
                      />
                      <input
                        id="confirm-password"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        placeholder="********"
                        className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] px-4 py-3 pr-11 outline-none transition focus:border-[var(--mithaq-primary)] focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mithaq-btn-primary w-full px-6 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "جاري تحديث كلمة المرور..."
                      : "حفظ كلمة المرور الجديدة"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
