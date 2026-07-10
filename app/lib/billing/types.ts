export type PlanSlug = "free" | "pro";

export type SubscriptionStatus =
  | "free"
  | "active"
  | "cancelled"
  | "expired";

export interface Plan {
  id: string;
  slug: PlanSlug;
  name: string;
  description: string | null;

  price_monthly: number;
  currency: string;

  contracts_limit: number | null;

  legal_consultations_enabled: boolean;

  is_active: boolean;

  sort_order: number;

  created_at: string;
}

export interface Subscription {
  id: string;

  user_id: string;

  plan_id: string | null;

  status: SubscriptionStatus;

  current_period_start: string | null;

  current_period_end: string | null;

  cancel_at_period_end: boolean;

  provider: string | null;

  provider_customer_id: string | null;

  provider_subscription_id: string | null;

  created_at: string;

  updated_at: string;
}

export interface Payment {
  id: string;

  user_id: string;

  subscription_id: string | null;

  provider: string;

  provider_payment_id: string | null;

  amount: number;

  currency: string;

  status: string;

  description: string | null;

  metadata: Record<string, unknown> | null;

  paid_at: string | null;

  created_at: string;
}