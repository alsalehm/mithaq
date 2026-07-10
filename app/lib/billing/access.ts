import { supabase } from "../supabase";
import { getUserSubscription } from "./subscription";
import {
  canCreateContract as checkCreateContract,
  canCreateInvoice as checkCreateInvoice,
  canCreateCustomer as checkCreateCustomer,
  canUseLegalConsultation as checkLegalConsultation,
} from "./permissions";

export async function canCreateContract(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return {
      allowed: false,
      reason: "subscription_not_found",
    };
  }

  const { count } = await supabase
    .from("contracts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const allowed = checkCreateContract(
    subscription,
    count ?? 0
  );

  return {
    allowed,
    reason: allowed ? null : "contract_limit_reached",
    used: count ?? 0,
    limit: subscription.plan.contracts_limit,
    subscription,
  };
}

export async function canCreateInvoice(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return {
      allowed: false,
      reason: "subscription_not_found",
    };
  }

  return {
    allowed: checkCreateInvoice(subscription),
    subscription,
  };
}

export async function canCreateCustomer(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return {
      allowed: false,
      reason: "subscription_not_found",
    };
  }

  return {
    allowed: checkCreateCustomer(subscription),
    subscription,
  };
}

export async function canUseLegalConsultation(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return {
      allowed: false,
      reason: "subscription_not_found",
    };
  }

  return {
    allowed: checkLegalConsultation(subscription),
    subscription,
  };
}