import { supabase } from "../supabase";
import { getFreePlan } from "./plans";
import { Plan, Subscription } from "./types";

export interface UserSubscription {
  subscription: Subscription;
  plan: Plan;
  isFree: boolean;
  isPro: boolean;
  isActive: boolean;
  isExpired: boolean;
}

/**
 * جلب اشتراك مستخدم معيّن مع الباقة المرتبطة به
 */
export async function getUserSubscription(
  userId: string
): Promise<UserSubscription | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      plans (*)
    `
    )
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  const subscription = data as Subscription & { plans: Plan | null };
  const plan = subscription.plans;

  if (!plan) {
    return null;
  }

  const now = new Date();

  const isExpired =
    subscription.status === "expired" ||
    (!!subscription.current_period_end &&
      new Date(subscription.current_period_end) < now);

  const isPro = plan.slug === "pro" && subscription.status === "active" && !isExpired;

  const isFree = plan.slug === "free" || !isPro;

  return {
    subscription,
    plan,
    isFree,
    isPro,
    isActive: isPro,
    isExpired,
  };
}

/**
 * إنشاء اشتراك Free للمستخدم إذا لم يكن لديه اشتراك
 */
export async function ensureFreeSubscription(
  userId: string
): Promise<UserSubscription | null> {
  const existingSubscription = await getUserSubscription(userId);

  if (existingSubscription) {
    return existingSubscription;
  }

  const freePlan = await getFreePlan();

  if (!freePlan) {
    throw new Error("Free plan was not found.");
  }

  const { error } = await supabase.from("subscriptions").insert({
    user_id: userId,
    plan_id: freePlan.id,
    status: "free",
    provider: null,
    provider_customer_id: null,
    provider_subscription_id: null,
  });

  if (error) {
    throw error;
  }

  return getUserSubscription(userId);
}

/**
 * تحويل المستخدم إلى Free
 * نستخدمها لاحقًا عند انتهاء الاشتراك أو إلغائه
 */
export async function downgradeToFree(userId: string): Promise<void> {
  const freePlan = await getFreePlan();

  if (!freePlan) {
    throw new Error("Free plan was not found.");
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({
      plan_id: freePlan.id,
      status: "free",
      current_period_start: null,
      current_period_end: null,
      cancel_at_period_end: false,
      provider: null,
      provider_subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}