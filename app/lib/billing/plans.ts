import { supabase } from "../supabase";
import { Plan, PlanSlug } from "./types";

/**
 * جلب جميع الباقات الفعالة
 */
export async function getPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Plan[];
}

/**
 * جلب باقة حسب الـ slug
 * مثال:
 * free
 * pro
 */
export async function getPlanBySlug(
  slug: PlanSlug
): Promise<Plan | null> {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return null;
  }

  return data as Plan;
}

/**
 * جلب باقة Free
 */
export async function getFreePlan() {
  return getPlanBySlug("free");
}

/**
 * جلب باقة Pro
 */
export async function getProPlan() {
  return getPlanBySlug("pro");
}