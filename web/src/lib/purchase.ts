import { trackEvent } from "./tracker";

export type PurchaseType = 'single' | 'monthly' | 'lifetime';

export interface Purchase {
  type: PurchaseType;
  purchasedAt: number; // timestamp
  expiresAt?: number; // for monthly
  usedCount: number; // for single use (track usage)
}

const PURCHASE_KEY = 'rezzobot_purchase';

export function getPurchase(): Purchase | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(PURCHASE_KEY);
  if (!data) return null;
  try {
    const purchase = JSON.parse(data) as Purchase;

    // Check expiration for monthly
    if (purchase.type === 'monthly' && purchase.expiresAt && Date.now() > purchase.expiresAt) {
      clearPurchase();
      return null;
    }

    return purchase;
  } catch (e) {
    console.error('Failed to parse purchase data', e);
    return null;
  }
}

export function setPurchase(purchase: Purchase): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PURCHASE_KEY, JSON.stringify(purchase));
}

export function hasAccess(): boolean {
  const purchase = getPurchase();
  if (!purchase) return false;

  if (purchase.type === 'lifetime') return true;
  if (purchase.type === 'monthly') {
    return !purchase.expiresAt || Date.now() < purchase.expiresAt;
  }
  if (purchase.type === 'single') {
    return purchase.usedCount < 1;
  }

  return false;
}

export function consumeSingleUse(): boolean {
  const purchase = getPurchase();
  if (!purchase || purchase.type !== 'single') return false;

  if (purchase.usedCount >= 1) return false;

  purchase.usedCount += 1;
  setPurchase(purchase);
  return true;
}

export function clearPurchase(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PURCHASE_KEY);
}

export function handlePaymentSuccess(type: string | null): void {
  let purchase: Purchase;
  const now = Date.now();

  // Track successful return from Stripe
  trackEvent('payment_returned', { plan: type || 'unknown', status: 'success' });

  switch (type) {
    case 'lifetime':
      purchase = { type: 'lifetime', purchasedAt: now, usedCount: 0 };
      break;
    case 'monthly':
      // 30 days from now
      const expiresAt = now + 30 * 24 * 60 * 60 * 1000;
      purchase = { type: 'monthly', purchasedAt: now, expiresAt, usedCount: 0 };
      break;
    case 'single':
    default:
      purchase = { type: 'single', purchasedAt: now, usedCount: 0 };
      break;
  }

  setPurchase(purchase);
}
