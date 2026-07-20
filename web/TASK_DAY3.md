# Web MVP — Day 3: Lemon Squeezy Payment Integration

## Goal
Add Lemon Squeezy payment walls to the Web app. ATS diagnosis stays free. AI optimization and PDF/DOCX export require payment.

## Pricing (from PRD)
- **Free:** Resume upload + ATS match score (no payment needed)
- **Single Use:** $4.99 — one AI optimization + one PDF/DOCX export
- **Monthly:** $14.9/month — unlimited optimizations + exports
- **Lifetime:** $49 — unlimited forever

## Integration Approach

### Lemon Squeezy Setup (done in their dashboard, NOT code)
1. Create 3 products in Lemon Squeezy:
   - "Single Optimization" — $4.99 (one-time)
   - "Monthly Pro" — $14.9/month (recurring)
   - "Lifetime Access" — $49 (one-time)
2. Each product gets a "checkout URL" like: `https://rezzobot.lemonsqueezy.com/checkout/buy/xxx`

### Frontend Integration

#### 1. Payment Wall Component
Create `src/components/PaywallModal.tsx`:
- Modal overlay when user tries to use a paid feature
- Shows pricing cards (3 tiers)
- "Buy Now" buttons → open Lemon Squeezy checkout in new tab/window
- After payment, user returns to the app via a success URL

#### 2. What Gets Gated
- `/optimize` page: "Optimize with AI" button → if no active purchase, show paywall
- Export PDF/DOCX buttons: same gate
- ATS diagnosis on `/upload`: **FREE** — no gate

#### 3. Payment State Check
Simple MVP approach (no backend user auth needed yet):
- Store `purchase_status` in localStorage
- Items: `{ type: 'single' | 'monthly' | 'lifetime', expiresAt?: timestamp }`
- Check on each paid action

For proper verification later, we'll add Lemon Squeezy webhook → backend endpoint.

#### 4. Lemon Squeezy Checkout Flow
- "Buy $4.99 Single" → opens `LEMON_SQUEEZY_SINGLE_URL` in new tab
- "Buy $14.9/month" → opens `LEMON_SQUEEZY_MONTHLY_URL`
- "Buy $49 Lifetime" → opens `LEMON_SQUEEZY_LIFETIME_URL`

URLs are configured as environment variables (so we can change them without code deploy).

#### 5. After Purchase Return
- Lemon Squeezy checkout has a `success_url` parameter
- Redirect back to the app with `?payment=success` in URL
- App detects this and sets purchase status in localStorage
- User can now access the paid feature

### Environment Variables Needed
```
NEXT_PUBLIC_LEMON_SQUEEZY_SINGLE_URL=https://rezzobot.lemonsqueezy.com/checkout/buy/xxx
NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_URL=https://rezzobot.lemonsqueezy.com/checkout/buy/xxx
NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_URL=https://rezzobot.lemonsqueezy.com/checkout/buy/xxx
```

## Implementation Tasks

### 1. Create Paywall Modal Component

`src/components/PaywallModal.tsx`:
- Beautiful modal overlay with backdrop blur
- 3 pricing cards side by side (responsive: stack on mobile)
- Each card: title, price, key features list, CTA button
- Single card highlighted as "Best Value" or similar
- Close button (X) or click outside to dismiss
- After clicking "Buy", open Lemon Squeezy checkout in new tab

### 2. Create Purchase Helper

`src/lib/purchase.ts`:
```typescript
export type PurchaseType = 'single' | 'monthly' | 'lifetime';

export interface Purchase {
  type: PurchaseType;
  purchasedAt: number; // timestamp
  expiresAt?: number; // for monthly
  usedCount: number; // for single use (track usage)
}

export function getPurchase(): Purchase | null { ... } // from localStorage
export function setPurchase(purchase: Purchase): void { ... }
export function hasAccess(): boolean { ... }
export function consumeSingleUse(): boolean { ... } // decrement + check
export function clearPurchase(): void { ... }
```

### 3. Gate Paid Features

In `src/app/optimize/page.tsx`:
- Before "Optimize with AI" or "Export" buttons work, check `hasAccess()`
- If no access, show PaywallModal
- Track single-use consumption (after optimization, mark as used)

### 4. Handle Payment Return

In `src/app/page.tsx` or a dedicated callback page:
- Check URL for `?payment=success` or `?payment=cancelled`
- If success: show success toast/message, let user proceed
- If cancelled: close modal, show "Payment cancelled" message

### 5. Lemon Squeezy Dashboard Setup (User Does In Browser)

Steps MK needs to do:
1. Go to lemonsqueezy.com → Login/Register
2. Create store "RezzoBot"
3. Create 3 products (Single $4.99, Monthly $14.9, Lifetime $49)
4. Copy checkout URLs → I'll add to env vars
5. Configure success URL: `https://rezzobot.vercel.app/?payment=success`
6. Optional: configure webhook for server-side verification (Day 4)

## Design Guidelines
- Paywall modal should feel premium, not annoying
- Pricing cards inspired by Rezi's pricing page layout
- Show what user gets vs what they're missing (free vs pro comparison)
- "Try before you buy" — user can see the ATS score for free, pay to optimize/export

## CRITICAL RULES
- ATS diagnosis must remain FREE — no paywall on upload/analysis
- DO NOT store real payment data in localStorage (no credit card numbers etc.)
- Lemon Squeezy handles all payment processing — the app just redirects
- No API keys or secrets in frontend code
- Use environment variables for checkout URLs

## Verification
- [ ] `npm run build` passes
- [ ] Upload page works without payment (free ATS diagnosis)
- [ ] Click "Optimize with AI" → Paywall modal appears
- [ ] Modal shows 3 pricing tiers
- [ ] Click "Buy" → opens Lemon Squeezy checkout in new tab
- [ ] After payment → user can optimize and export
- [ ] Single use tracks count (one optimization per $4.99)
