# Mithaq Design System

Last Updated: July 2026

---

## Purpose

This design system defines the visual identity, layout rules, components, and interaction patterns for Mithaq.

The redesign phase must improve UI/UX only.

No business logic, database schema, authentication logic, Supabase logic, contract workflow, WhatsApp sending, PDF generation, or multi-tenant data isolation should be changed.

---

## Product Direction

Mithaq is a professional Arabic-first platform for freelancers to create, send, sign, and manage contracts.

The first launch focuses on photographers, with future expansion to freelancers, artists, and creators across the Arab world.

The interface should feel:

* Trustworthy
* Premium
* Simple
* Calm
* Business-ready
* Arabic-first
* Mobile-friendly

---

## Core Design Principles

### 1. Arabic-first

All main pages should support RTL layout clearly.

Primary language is Arabic.

Text alignment should usually be right-aligned.

---

### 2. Preserve Functionality

UI changes must not alter existing workflows.

Existing flows to preserve:

* Signup
* Login
* Logout
* Dashboard
* Create customer
* Edit customer
* Delete customer
* Customer details
* Create contract
* Contract details
* Send contract by WhatsApp
* Client signing
* Signature saving
* PDF / print
* Invoice flow
* Settings persistence
* Multi-tenant user isolation

---

### 3. Simplicity

Each page should make the next action obvious.

Avoid clutter.

Use clear page titles, short helper text, and strong primary actions.

---

### 4. Trust

Contracts and business documents require a serious and reliable visual style.

Avoid playful colors or overly casual UI.

---

## Color Palette

### Background

Main app background:

```css
#F8F1E8
```

Soft card background:

```css
#FFFDF9
```

Subtle section background:

```css
#F3E4D3
```

---

### Text

Primary text:

```css
#2A1A0C
```

Secondary text:

```css
#6B5A49
```

Muted text:

```css
#9A8A7A
```

---

### Brand

Primary brand:

```css
#75532F
```

Primary brand hover:

```css
#5F4225
```

Soft brand background:

```css
#EFE0CF
```

Border brand:

```css
#D8BFA3
```

---

### Status Colors

Success:

```css
#15803D
```

Success background:

```css
#DCFCE7
```

Warning:

```css
#B45309
```

Warning background:

```css
#FEF3C7
```

Error:

```css
#B91C1C
```

Error background:

```css
#FEE2E2
```

Info:

```css
#2563EB
```

Info background:

```css
#DBEAFE
```

---

## Typography

Use system fonts.

Recommended font stack:

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

---

## Text Sizes

Page title:

```css
text-3xl font-bold
```

Section title:

```css
text-xl font-semibold
```

Card title:

```css
text-lg font-semibold
```

Body text:

```css
text-sm
```

Small helper text:

```css
text-xs
```

---

## Layout Rules

### App Direction

All main authenticated pages should use:

```tsx
dir="rtl"
```

---

### Page Container

Use a consistent max width:

```css
max-w-6xl mx-auto px-4 sm:px-6 lg:px-8
```

---

### Page Spacing

Main page padding:

```css
py-8
```

Section spacing:

```css
space-y-6
```

Card padding:

```css
p-6
```

---

## Components

### Primary Button

Used for main actions.

Examples:

* إنشاء عقد
* حفظ
* إرسال للعميل
* إنشاء عميل

Style:

```css
rounded-xl bg-[#75532F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5F4225]
```

---

### Secondary Button

Used for less important actions.

Examples:

* رجوع
* إلغاء
* عرض التفاصيل

Style:

```css
rounded-xl border border-[#D8BFA3] bg-white px-5 py-3 text-sm font-semibold text-[#75532F] transition hover:bg-[#EFE0CF]
```

---

### Danger Button

Used for destructive actions.

Examples:

* حذف
* إلغاء العقد

Style:

```css
rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800
```

---

### Card

Used for dashboards, forms, lists, and details.

Style:

```css
rounded-2xl border border-[#E7D6C2] bg-[#FFFDF9] p-6 shadow-sm
```

---

### Input

Style:

```css
w-full rounded-xl border border-[#D8BFA3] bg-white px-4 py-3 text-sm text-[#2A1A0C] outline-none transition focus:border-[#75532F] focus:ring-2 focus:ring-[#EFE0CF]
```

---

### Label

Style:

```css
mb-2 block text-sm font-medium text-[#2A1A0C]
```

---

### Badge

Used for statuses.

Base style:

```css
inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
```

Status mapping:

* draft: مسودة
* sent: تم الإرسال
* signed: تم التوقيع
* completed: مكتمل
* cancelled: ملغي

---

## Page Redesign Order

The redesign should happen in this order:

1. Shared layout / navigation
2. Dashboard
3. Contracts list
4. New contract page
5. Contract details page
6. Client signing page
7. Customers list
8. Customer details page
9. New/edit customer pages
10. Invoices pages
11. Settings page
12. Login page
13. Signup page
14. Landing page

---

## Redesign Rules

During redesign:

* Do not rename database fields.
* Do not change Supabase queries unless needed for UI display only.
* Do not change auth logic.
* Do not change contract statuses.
* Do not change WhatsApp sending logic.
* Do not change signing logic.
* Do not change PDF/print logic.
* Do not change routing paths.
* Do not delete existing working functionality.
* Do not introduce new database tables.
* Do not break mobile responsiveness.

---

## Testing Checklist Per Page

After redesigning each page:

* Page opens without error.
* Existing buttons still work.
* Existing data still appears.
* Forms still save correctly.
* User only sees their own data.
* Mobile layout is acceptable.
* `npm run build` succeeds.

---

## Final Redesign Goal

Mithaq should look polished enough for first commercial launch while keeping the MVP stable and functional.

This phase is visual and UX improvement only.
