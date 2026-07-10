import { UserSubscription } from "./subscription";

/**
 * هل يستطيع إنشاء عقد جديد؟
 */
export function canCreateContract(
  subscription: UserSubscription,
  currentContractsCount: number
): boolean {
  if (subscription.isPro) {
    return true;
  }

  const limit = subscription.plan.contracts_limit;

  if (limit === null) {
    return true;
  }

  return currentContractsCount < limit;
}

/**
 * هل يستطيع إنشاء فاتورة؟
 */
export function canCreateInvoice(
  subscription: UserSubscription
): boolean {
  return subscription.isPro;
}

/**
 * هل يستطيع إضافة عميل؟
 */
export function canCreateCustomer(
  subscription: UserSubscription
): boolean {
  return subscription.isPro;
}

/**
 * هل يستطيع استخدام الاستشارات القانونية؟
 */
export function canUseLegalConsultation(
  subscription: UserSubscription
): boolean {
  return (
    subscription.isPro &&
    subscription.plan.legal_consultations_enabled
  );
}

/**
 * هل يستطيع إدارة الاشتراك؟
 */
export function canManageSubscription(
  subscription: UserSubscription
): boolean {
  return subscription.isPro;
}

/**
 * هل يظهر زر الترقية؟
 */
export function shouldShowUpgradeButton(
  subscription: UserSubscription
): boolean {
  return subscription.isFree;
}