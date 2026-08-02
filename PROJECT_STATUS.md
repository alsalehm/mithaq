# PROJECT STATUS — Mithaq

Last Updated: August 2, 2026

---

# 1. Project Overview

## Product Name

**ميثاق — Mithaq**

الاسم العربي معتمد نهائيًا ولا يتم تغييره بسبب توفر أو عدم توفر اسم نطاق معين.

## Official Website

https://mithaqplatform.com

## Product Vision

**منصة عربية لإدارة أعمال المستقلين.**

ميثاق ليس مخصصًا للمصورين فقط، بل يستهدف المستقلين في مختلف المهن داخل السعودية والعالم العربي، مثل:

- المصورين
- المصممين
- المسوقين
- المبرمجين
- منظمي الفعاليات
- مقدمي الخدمات
- الاستشاريين
- أصحاب الأعمال الفردية

## Core Value

جمع إدارة أعمال المستقل في مكان واحد، وتشمل:

- العملاء
- العقود
- التوقيع الإلكتروني
- الفواتير
- المدفوعات
- الاستشارات القانونية
- الاشتراكات
- المتابعة المالية

## Product Philosophy

**نبيع من خلال جودة المنتج، وليس من خلال الضغط التسويقي.**

يجب أن تبقى لغة ميثاق:

- هادئة
- احترافية
- واثقة
- واضحة
- غير مبالغ فيها
- بعيدة عن الاستعجال والتخفيضات والعبارات التسويقية العدوانية

---

# 2. Owner Information

## Official Owner Account

Email:

`alsaleh.raw@gmail.com`

هذا الحساب هو الحساب الرسمي لعبدالرحمن الصالح بصفته:

- مؤسس ميثاق
- صاحب المنصة
- مدير المنصة
- مستخدم فعلي لميثاق في أعماله الخاصة

## Owner Role

داخل جدول `profiles`:

`role = owner`

## Owner Subscription

تم ربط الحساب يدويًا بالباقة الاحترافية:

- Plan: Pro
- Status: active
- Provider: غير مطلوب للحساب الإداري
- Current period start: غير محدد
- Current period end: غير محدد

عدم وجود تاريخ بداية أو تجديد لا يؤثر على الحساب؛ لأن الاشتراك أُنشئ يدويًا لصاحب المنصة، وليس عن طريق عملية دفع.

## Owner Capabilities

الحساب الرسمي يملك حاليًا:

- عقود غير محدودة
- عملاء غير محدودين
- فواتير غير محدودة
- الاستشارات القانونية
- جميع المزايا الحالية
- جميع مزايا Pro المستقبلية
- نموذج العقد الاحترافي الخاص بباقة Pro

## Previous Owner Test Account Cleanup

كان يوجد حساب تجريبي قديم:

`alsaleh0517@gmail.com`

وكان يُستخدم أثناء التطوير والاختبارات.

تم تنظيفه وحذفه نهائيًا، بالترتيب التالي:

1. تغيير حساب المالك الجديد إلى `owner`.
2. إزالة صلاحية `owner` من الحساب التجريبي القديم.
3. حذف سجل الاشتراك القديم.
4. حذف سجل `profiles`.
5. التحقق من جميع الجداول المرتبطة بـ `auth.users`.
6. العثور على بيانات تجريبية متبقية للحساب القديم:
   - 3 عملاء
   - 15 عقدًا
   - 11 فاتورة
   - 8 دفعات فواتير
   - 5 سجلات Customer Timeline
7. حذف البيانات المرتبطة من:
   - `invoice_payments`
   - `customer_timeline`
   - `invoices`
   - `contracts`
   - `customers`
8. حذف المستخدم نهائيًا من Supabase Authentication.

النتيجة النهائية:

- الحساب التجريبي القديم محذوف.
- بياناته التجريبية محذوفة.
- الحساب الرسمي الجديد هو حساب المالك الوحيد المعتمد.

---

# 3. Technical Stack

## Frontend and Backend

- Next.js
- App Router
- TypeScript
- React
- Tailwind CSS

## Database and Authentication

- Supabase Database
- Supabase Authentication
- Row Level Security
- Multi-tenant user isolation

## Hosting and Deployment

- Vercel
- GitHub
- Production environment
- HTTPS and SSL enabled

## External Services

- Moyasar for payments
- Google Workspace for official business email
- Gmail SMTP connected to Supabase
- WhatsApp links for sharing contracts and invoices

## Important Packages

- `react-signature-canvas`
- `react-hot-toast`
- `lucide-react`
- Supabase client libraries

---

# 4. Repository and Project Documentation

## Repository

The project is connected to GitHub and deployed through Vercel.

## Main Branch

`main`

## Important Documentation Files

- `PROJECT_STATUS.md`
- `PROJECT_ROADMAP.md`
- `CHANGELOG.md`
- `DESIGN_SYSTEM.md`
- `PRO_CONTRACT_TEMPLATE.md`
- `AGENTS.md`

## Git Workflow

After completing a stable coding milestone:

1. Run `git status`.
2. Add changed files.
3. Commit with a clear English message.
4. Push to `origin/main`.
5. Verify deployment in Vercel.

## Latest Relevant Code Milestone

The secure public contract signing system was completed, committed, and pushed to GitHub.

Relevant commit message:

`Complete secure public contract signing system`

The production contract signing flow was tested successfully after deployment.

---

# 5. Official Domain and Production

## Domain

`mithaqplatform.com`

The domain was purchased and connected successfully.

## Production Status

- Vercel production deployment works.
- SSL is active.
- HTTPS works.
- Authentication works in production.
- Database connection works.
- Production environment variables work.
- Supabase production project is connected.
- The official domain opens the application correctly.
- `www` domain configuration was handled.
- The public website is accessible to real users.

## Production Environment

The production Supabase project is:

`mithaq-production`

All recent beta tests and real user registrations are happening against the production environment.

---

# 6. Main Application Routes

The project currently includes the following important routes:

## Public Routes

- `/`
- `/login`
- `/signup`
- `/pricing`
- `/privacy`
- `/terms`
- `/refund`
- `/service`
- `/contact`
- `/sign/[id]`
- `/invoices/public/[id]`

## Authenticated Application Routes

- `/dashboard`
- `/customers`
- `/customers/[id]`
- `/contracts`
- `/contracts/new`
- `/contracts/[id]`
- `/invoices`
- `/invoices/new`
- `/invoices/[id]`
- `/invoices/[id]/print`
- `/legal-consultations`
- `/settings`
- `/dashboard/subscription`
- `/dashboard/subscription/payment-result`

## API Routes

- `/api/subscription/verify-payment`
- `/api/contracts/public/[id]`

There may be additional internal routes, but these are the major active product routes.

---

# 7. Database Tables

The main database tables currently include:

- `profiles`
- `customers`
- `customer_timeline`
- `contracts`
- `invoices`
- `invoice_payments`
- `legal_consultations`
- `legal_settings`
- `plans`
- `subscriptions`
- `payments`

## Multi-Tenant Isolation

Multi-user isolation has been tested.

Each user only sees and modifies their own:

- customers
- contracts
- invoices
- settings
- timelines
- subscription-related data

This was tested using multiple accounts and confirmed working.

---

# 8. Authentication

## Completed Authentication Features

- Signup
- Login
- Logout
- Email confirmation
- Session handling
- Redirect to dashboard after login
- Password recovery support through Supabase
- Production authentication
- Multi-user isolation
- New account Free subscription initialization

## Current New User Behavior

When a normal user creates an account:

1. The user registers.
2. A confirmation email is sent.
3. The user confirms the email.
4. The account gets a Free subscription.
5. The user can log in and access the dashboard.
6. Free plan restrictions are applied.

## Authentication UI

Login and signup pages received the approved Premium UI design.

The login page includes a premium split layout with a dark side panel.

---

# 9. Professional Email and SMTP

## Problem That Was Discovered

During Commercial Beta, a friend attempted to register and received:

`Email rate limit exceeded`

The Supabase built-in email service was limited to:

`2 emails per hour`

This prevented new users from receiving confirmation emails after the hourly limit was reached.

## Permanent Solution Implemented

Google Workspace was created and connected to the official domain.

## Google Workspace Plan

Google Workspace Starter.

## Workspace Domain

`mithaqplatform.com`

## Official Administrative Email

`admin@mithaqplatform.com`

## Google Workspace Setup Completed

- Google Workspace account created.
- Payment method added.
- Domain ownership verified.
- Namecheap connection completed.
- Gmail MX records activated.
- Gmail activated successfully.
- Inbox opened successfully.
- Two-Step Verification enabled.
- Recovery phone added.
- Recovery email added.
- App Password created specifically for Supabase.

## Supabase SMTP Configuration

Custom SMTP was enabled in:

Supabase → Authentication → Emails → SMTP Settings

The configuration uses:

- Sender email: `admin@mithaqplatform.com`
- Sender name: `ميثاق`
- Host: `smtp.gmail.com`
- Port: `465`
- Username: `admin@mithaqplatform.com`
- Password: Google App Password
- Minimum interval per user: `60` seconds

The App Password is secret and must never be written inside this status file, GitHub, screenshots, chat, or source code.

## SMTP Verification Result

A completely new account was created after SMTP configuration.

Result:

- Registration succeeded.
- Confirmation email was received successfully.
- Email was sent using the official business email system.
- The previous Supabase two-emails-per-hour limitation is no longer being used.

## Current Supabase Email Limit

After custom SMTP was enabled, Supabase displayed an initial custom SMTP email limit of approximately:

`30 emails per hour`

This can be reviewed and increased later if required before or after Public Launch.

## Future Email Tasks

Not required immediately, but later we may create:

- `support@mithaqplatform.com`
- `noreply@mithaqplatform.com`
- `legal@mithaqplatform.com`
- `billing@mithaqplatform.com`

At the moment, only the following confirmed user mailbox exists:

`admin@mithaqplatform.com`

Do not claim that `support` or `noreply` exists until it is actually created.

---

# 10. Dashboard

## Completed Dashboard Features

- Customer count
- Contract count
- Invoice count
- Legal consultation count
- Total contract value
- Total paid
- Total remaining
- Recent contracts
- Quick actions
- Navigation
- Logout
- Subscription link
- Settings link

## Financial Calculation Fix

Dashboard financial totals now calculate paid amounts correctly based on:

`contract value - remaining amount`

This fixed previous inconsistencies in financial statistics.

## Greeting

Top bar greeting was implemented:

`👋 مرحبًا، {displayName}`

The display name is loaded from the authenticated Supabase user.

## Dashboard Visual State

The dashboard went through:

- Premium UI redesign
- Final visual polish
- Responsive review
- Spacing adjustments
- Financial card refinement
- Mobile review

The approved design should not be replaced with a new design direction unless a real usability problem appears during beta.

---

# 11. Customers and CRM

## Completed Customer Features

- Create customer
- Edit customer
- Delete customer
- Customer list
- Customer details
- Customer statistics
- Customer-linked contracts
- Customer-linked invoices
- Customer timeline

## Customer Timeline

The project includes `customer_timeline` to display customer-related events.

## Invoice-to-Customer Linking Fix

A major Phase 8 fix was completed:

- Invoices are correctly linked to customers.
- Creating an invoice from a contract automatically sets `customer_id`.
- Customer details display associated invoices.
- Customer statistics now include related invoice information correctly.

This was tested and approved.

---

# 12. Contracts

## Contract Features Completed

- Create contract
- Create contract directly or from a customer
- Edit contract
- Default contract terms
- Contract status flow
- Send by WhatsApp
- Public signing page
- Client electronic signature
- Photographer/provider signature
- Contract completion
- Contract print/PDF layout
- Multi-user isolation
- Customer linking
- Financial data
- Deposits and remaining amounts

## Contract Statuses

The current status flow includes:

- `draft`
- `sent`
- `signed`
- `completed`
- `cancelled`

Arabic display mapping exists in the UI.

## WhatsApp Sharing

Contract sharing through WhatsApp normalizes Saudi phone numbers using `966`.

When a contract is sent, its status can update to `sent`.

## Public Signing Page

Route:

`/sign/[id]`

The public signing page allows a client to:

1. Open the contract without logging in.
2. Review contract information.
3. Read legal terms.
4. Draw their signature.
5. Approve and sign electronically.

## Secure Public Contract API

A public server-side contract endpoint was implemented:

`/api/contracts/public/[id]`

This endpoint retrieves the public contract needed by the signing page.

## Contract Signing Bug Fixed

A previous issue affected old contracts and the public signing page.

The old contract API successfully returned the contract data, but the signing page had a client-side loading issue.

Debugging steps included:

- Testing `/api/contracts/public/[id]`.
- Confirming JSON data was returned.
- Adding a temporary `console.log("Contract ID:", id)`.
- Restarting the local development server.
- Testing the local signing page.
- Testing the production signing page.
- Completing a real signature.
- Removing the temporary `console.log`.

Final result:

- Old contracts open correctly.
- Signature area appears.
- Client can sign.
- “تم توقيع العقد بنجاح” appears.
- Signed status is reflected in the platform.
- Production signing works.
- Temporary debug logging was removed.

## Contract PDF / Print

The contract print layout was finalized as a professional two-page document:

- Page 1: client and contract details
- Page 2: terms and signatures

The layout was reviewed through screenshots and approved.

---

# 13. Contract Templates by Plan

## Approved Requirement

Different contract experiences exist for Free and Pro plans.

### Free Plan Contract

Uses the simpler original/default contract template.

Free users can also use their profile default contract terms.

### Pro Plan Contract

Uses a detailed professional template:

`عقد تقديم خدمات احترافية`

## Technical Constants

The project includes:

- `DEFAULT_CONTRACT_TERMS`
- `PRO_CONTRACT_TERMS`

## Plan-Based Contract Logic

When creating a contract:

- Free user → profile/default Free contract terms
- Pro user → professional Pro contract terms

The subscription is checked through:

`getUserSubscription(user.id)`

## Pro Contract Sections Approved

The detailed Pro contract includes the following approved sections:

1. بيانات الطرفين
2. موضوع العقد
3. تفاصيل الخدمة
4. قيمة العقد والدفعات
5. الموقع والمدة
6. التزامات الطرفين
7. حقوق الملكية الفكرية
8. سياسة الإلغاء والاسترجاع
9. السرية
10. التواصل
11. القوة القاهرة
12. حل النزاعات
13. أحكام عامة
14. التوقيع

## Provider and Client Data Mapping

The final contract logic includes:

### Client Data

- Name
- Phone
- Email
- City
- Identification or verification details where applicable

### Service Provider Data

Loaded from Settings/profile:

- Full name
- Phone
- Email
- City
- Business name
- Saved signature

## Fixed Contract Template Issues

Previous issues included:

- Provider data not appearing.
- Client data not appearing in the correct places.
- Duplicate signatures.
- Refresh-related signature behavior.

These issues were fixed and reviewed.

---

# 14. Invoices

## Completed Invoice Features

- Create invoice
- Link invoice to contract
- Link invoice to customer
- Partial payment
- Fully paid status
- Remaining amount
- Invoice payment history
- Invoice list
- Invoice details
- Invoice statistics
- WhatsApp sharing
- Public invoice page
- Print page

## Public Invoice Sharing

A previous problem existed:

The WhatsApp message shared an internal dashboard invoice URL, and external users saw:

`Invoice not found`

The issue was fixed by creating a dedicated public route:

`/invoices/public/[id]`

WhatsApp now shares the public invoice page instead of the internal dashboard URL.

This was tested successfully in production.

## Invoice Print Page

A dedicated professional invoice print route exists:

`/invoices/[id]/print`

The dedicated print page replaced reliance on printing the dashboard UI directly.

The print page was tested and approved functionally and visually.

## Invoice Visual Polish

Invoice cards and payment statuses received visual improvements during Phase 8.

---

# 15. Legal Consultations

## Completed Features

- Consultation request form
- Consultation list
- Lawyer dashboard support
- Subscription restriction
- Free account blocking
- Redirect to subscription page when required

## Free Plan Restriction

Free users cannot access legal consultations.

## Pro Plan Access

Pro users can access legal consultations.

The owner account has access because it is configured as active Pro.

---

# 16. Settings

## Completed Settings Features

- Full name
- Business name
- Email
- Phone
- City
- Currency
- Saved signature
- Default contract terms
- Persistent profile information

## Settings Persistence

The following were tested:

- Business information remains saved.
- Default contract terms remain saved.
- Provider signature remains saved.
- New contracts use the correct profile information.
- Each user has separate settings.

---

# 17. Subscriptions and Plans

## Approved Plans

Only two plans are approved.

### Free

Arabic name:

`مجاني`

Features:

- Maximum 3 contracts
- Basic platform tools
- No legal consultations
- Free/default contract template

### Pro

Arabic name:

`احترافية`

Price:

`49 SAR / month`

Technical constant:

`PRO_PRICE_IN_HALALAS = 4900`

Features:

- Unlimited contracts
- Unlimited customers
- Unlimited invoices
- Legal consultations
- Professional contract template
- Current Pro features
- Future Pro features

## Subscription Tables

- `plans`
- `subscriptions`
- `payments`

## Subscription Helper

`getUserSubscription()` returns subscription information including:

- `subscription`
- `plan`
- `isFree`
- `isPro`
- `isActive`
- `isExpired`

## Free Subscription Initialization

`ensureFreeSubscription` is used to make sure a new user gets a Free plan.

## Restrictions Completed

- Free contract limit is enforced.
- Pro can create more than 3 contracts.
- Legal consultations are blocked for Free users.
- Pro access opens Pro features.
- Subscription page displays current plan.

## Owner Pro Configuration

The owner account was manually changed from Free to Pro by updating:

- `plan_id` to the Pro plan ID
- `status` to `active`

After logout and login:

- Page displayed current plan as Pro.
- Status displayed active.
- Upgrade button disappeared.
- Pro access became active.

---

# 18. Moyasar Payment Integration

## Current Integration

Moyasar test payment integration has been implemented.

## Completed Payment Flow

- Checkout implementation
- Test payment
- 3D Secure success
- Payment result page
- Server-side payment verification
- Subscription activation
- Redirect after successful payment
- Pro plan activation

## Payment Verification API

Route:

`/api/subscription/verify-payment`

The API verifies the payment server-side and updates the subscription.

## Test Results

A test account successfully:

1. Selected Pro.
2. Completed Moyasar test payment.
3. Passed 3D Secure.
4. Returned to the payment result page.
5. Had its subscription updated to active Pro.
6. Accessed Pro features.

## Current Moyasar State

- Test keys are integrated.
- Test payment flow works.
- Live commercial activation has not yet been completed.
- Live Keys have not yet replaced Test Keys.

## Current Public Launch Blocker

Before Public Launch:

1. Submit the commercial activation/application to Moyasar.
2. Respond to any documentation requests.
3. Obtain production/Live Keys.
4. Add Live Keys securely to production environment variables.
5. Perform one real payment test.
6. Confirm:
   - payment
   - verification
   - subscription activation
   - redirect
   - dashboard access
7. Only then begin full public advertising and paid subscriptions.

## Moyasar Documentation Preparation

The user considered creating a new freelance certificate for a technology-related activity.

Options reviewed included:

- هندسة برمجيات
- نظم تقنية المعلومات
- برمجة نظم المعلومات
- other IT categories

The Freelance platform requested supporting documents for both:

- هندسة برمجيات
- نظم تقنية المعلومات

The user does not currently have an academic or accredited technical certificate.

No new technology freelance certificate was completed.

The user already has:

- A photography freelance certificate
- A sales-related freelance certificate
- A commercial bank account opened using a freelance certificate

Do not assume Moyasar requires a new technical freelance certificate until Moyasar explicitly requests it.

## Immediate Moyasar Next Step

The recommended action is:

**Submit the Moyasar commercial activation request now during Commercial Beta.**

Reason:

- Review may take time.
- They may request additional documents.
- This can be handled while beta users continue testing.
- Public Launch remains blocked until live payment is verified.

---

# 19. Pricing and Public Visitor Journey

## Pricing Page

The pricing page includes only the essential elements:

- Main headline
- Free plan card
- Pro plan card

Approved headline:

`اختر الباقة المناسبة وابدأ بإدارة أعمالك باحترافية`

Approved Pro CTA:

`ابدأ مع Pro`

## Public Journey

The intended journey is:

Landing → Pricing → Signup/Login → Subscription → Payment → Dashboard

## Previous Journey Issue

Previously:

- Free button correctly went to `/signup`.
- Pro button went to `/login`.
- After login, the user was always redirected to `/dashboard`.
- A user who selected Pro did not automatically continue to the subscription page.

This journey was identified as a Phase 8 priority and reviewed during final launch preparation.

The Pricing page and visitor journey were later considered completed before starting Commercial Beta.

If a beta user reports that Pro selection still returns directly to Dashboard instead of Subscription, this must be retested before Public Launch.

---

# 20. Landing Page and Public Website

## Brand and Header

- Final Mithaq logo added.
- Header uses the approved Mithaq identity.
- Earlier temporary header decisions were refined during Final Visual Polish.
- Global background was changed to white.
- Premium brown palette retained.
- Borders and soft visual hierarchy retained.

## Approved Hero/Process Copy

Main process title:

`إدارة أعمالك في خطوات بسيطة`

Steps:

1. `أدخل بيانات العميل مع الشروط وقيمة العقد`
2. `أرسل رابط العقد للعميل للتوقيع إلكترونيًا`
3. `تابع الفواتير والمدفوعات`

## Feature Cards

Feature cards were updated and include:

- Customers
- Contracts
- Invoices
- Electronic signature
- Legal consultations
- Business management

## CTA Policy

Avoid overusing:

`ابدأ مجانًا`

It is acceptable on the Free plan card, but should not dominate the premium hero section.

## Final Visual Polish

The following are complete:

- Final logo placement
- Main public UI polish
- Main dashboard UI polish
- Copy review
- Branding consistency
- Responsive review
- Main public journey
- Pricing visibility

Do not restart a new full redesign during Commercial Beta.

---

# 21. Legal and Informational Pages

Completed public pages:

- Service description
- Privacy Policy
- Terms of Use
- Refund Policy
- Contact page

These pages are linked from the public website.

## Refund Policy

The approved policy generally states:

- No refund after service activation.
- Exceptions may apply under Saudi regulations.
- Exceptions may apply if there is a material defect preventing use.

## Contact Email

A temporary placeholder previously existed in the site content.

Now the business has a real official mailbox:

`admin@mithaqplatform.com`

Before Public Launch, review every public page and replace any old or incorrect email address with the approved official contact address.

A future support address may be created:

`support@mithaqplatform.com`

But it does not yet exist and must not be shown until created.

## Legal Supervision Footer Idea — Deferred

The user considered adding a footer line near:

- Privacy Policy
- Terms
- Refund Policy
- Contact

The purpose is to communicate that the platform receives legal review or supervision from:

`مكتب المحامية رنا بنت فهد قبول للمحاماة`

Possible professional wording discussed:

`تمت مراجعة الجوانب القانونية في ميثاق تحت إشراف مكتب المحامية رنا بنت فهد قبول للمحاماة.`

This item is deferred.

Before publishing such wording:

- Confirm the office approves the exact wording.
- Ensure it accurately reflects the real legal relationship.
- Avoid language that sounds threatening to visitors.
- Do not claim continuous legal monitoring unless this is contractually true.

---

# 22. UI/UX Design System

## Approved Direction

Premium Arabic SaaS interface.

## Core Visual Principles

- Calm
- Clean
- Spacious
- White background
- Brown premium accents
- Soft borders
- Professional Arabic typography
- Clear page hierarchy
- Avoid visual clutter

## Earlier Palette Reference

- Main text: `#2A1A0C`
- Primary: `#75532F`
- Borders: `#E7D6C2`

Exact implementation may contain refinements, but the premium brown identity is approved.

## Logo

Final logo:

- Pen icon
- Arabic word `ميثاق`
- No permanent marketing tagline inside the main logo
- Approved bordered/frame identity
- Strong Arabic typography

## Design Rule

Final Premium UI Polish is considered complete.

Future changes should:

- Fix real issues.
- Improve usability based on beta feedback.
- Preserve the approved design language.
- Avoid restarting design exploration.

---

# 23. Testing and QA

## Final QA Completed

The following were tested:

### Authentication

- Signup
- Email confirmation
- Login
- Logout

### Dashboard

- Statistics
- Financial calculations
- Recent contracts
- Navigation

### Customers

- Create
- Edit
- Delete
- Details
- Timeline
- Linked records

### Contracts

- Create
- Edit
- Default terms
- Provider signature
- WhatsApp sharing
- Status updates
- Client signing
- Completion
- PDF/print

### Invoices

- Create
- Link to customer
- Link to contract
- Partial payment
- Full payment
- Remaining balance
- WhatsApp sharing
- Public page
- Print page

### Settings

- Profile persistence
- Contract defaults
- Signature persistence

### Subscriptions

- Free plan initialization
- Free restrictions
- Pro activation
- Pro permissions
- Payment verification

### Isolation

- Each user only sees their own data.

## Production End-to-End Verification

A new production account was used to test:

- Signup
- Login
- Logout
- Customer creation
- Contract creation
- Invoice creation
- Contract signing
- Invoice WhatsApp sharing
- Printing
- Subscription activation

Several production contracts were created during testing.

## Commercial Beta Email Test

After custom SMTP was configured:

- A completely new beta account registered.
- Confirmation email arrived successfully.
- The previous email rate-limit blocker was resolved.

---

# 24. Current Project Phases

## Phase 1 — Core Development

✅ Completed

Included:

- Authentication
- Dashboard
- Customers
- Contracts
- Signing
- Invoices
- Legal consultations
- Settings
- Multi-tenant data isolation

## Phase 2 — Final QA

✅ Completed

## Phase 3 — Premium UI/UX Redesign

✅ Completed

## Phase 4 — Launch Polish

✅ Completed

Included:

- Toast notifications
- Alert cleanup
- UI consistency
- Public page polish
- wording improvements

## Phase 5 — Responsive Review

✅ Completed

## Phase 6 — Subscription and Billing System

✅ Completed for test environment

Includes:

- Plans
- Permissions
- Free restrictions
- Pro restrictions
- Moyasar test integration
- Server verification

## Phase 7 — Production Deployment

✅ Completed

Includes:

- Vercel
- Production Supabase
- Domain
- SSL
- Production testing

## Phase 8 — Final Launch Preparation

✅ Substantially completed

Completed:

- Final logo
- Final Visual Polish
- Copy review
- Pricing page
- Public journey review
- Plan-based contract templates
- Public invoice route
- Secure public contract signing fix
- Owner account cleanup
- Official owner account setup
- Owner Pro activation
- Google Workspace setup
- Professional email
- Custom SMTP
- Email delivery verification

Remaining from the launch-readiness side:

- Moyasar commercial approval
- Moyasar Live Keys
- One real payment verification
- Final contact email consistency review
- Any critical Commercial Beta fixes

## Phase 9 — Commercial Beta

🔄 In Progress

Commercial Beta has officially started.

The site has already been shared with friends and family.

Real users are now:

- Registering
- Confirming their emails
- Exploring the dashboard
- Testing the product
- Preparing feedback

## Phase 10 — Public Launch

⏳ Pending

Public Launch begins after:

1. Commercial Beta produces no unresolved critical issues.
2. Moyasar approves the commercial account.
3. Live Keys are connected.
4. A real payment succeeds.
5. Subscription activation works with a real payment.
6. Final launch checklist passes.

---

# 25. Commercial Beta Rules

During Commercial Beta:

## Fix Immediately

Critical bugs such as:

- Registration failure
- Email delivery failure
- Login failure
- Data loss
- Cross-user data exposure
- Contract signing failure
- Invoice failure
- Payment verification failure

## Review Carefully

UX issues such as:

- Confusing buttons
- unclear wording
- difficult navigation
- mobile layout issues
- unclear plan selection

## Record but Do Not Rush

Feature requests such as:

- Annual subscription
- reports
- exporting
- notifications
- new integrations
- extra dashboard features

## Feedback Categories

Every beta note should be classified as:

1. Bug
2. UI/UX
3. Feature Request
4. Positive Feedback
5. Business/Legal
6. Payment/Subscription

## Product Rule

Do not implement every suggestion.

Prioritize:

- Repeated feedback
- Critical blockers
- Data/security issues
- Problems aligned with Mithaq’s vision

---

# 26. Deferred Features and Ideas

## Annual Pro Subscription

The user wants to consider:

- Monthly price: 49 SAR
- Annual price: 490 SAR
- Equivalent to two months free
- Normal annual total without discount: 588 SAR
- Saving: 98 SAR

This feature is deferred during Commercial Beta.

It requires:

- Monthly/yearly selector
- Pricing page changes
- Subscription page changes
- Correct Moyasar amount
- Billing interval storage
- One-year expiry date
- Payment verification updates
- Renewal/expiry testing

Do not treat it as a quick visual change because it affects payment logic.

## Legal Supervision Footer

Deferred until wording and authorization are confirmed.

## Additional Business Emails

Possible future aliases or users:

- support
- noreply
- billing
- legal

Only create them when needed and understand whether they are paid Workspace users or free aliases.

## Infrastructure Upgrades

Supabase and Vercel upgrades can be reviewed based on:

- real usage
- database size
- traffic
- email volume
- beta performance

Do not upgrade only because the platform launched; upgrade when limits or growth justify it.

---

# 27. Social Media and Video Content Policy

The user approved a long-term content strategy for Mithaq.

## Content Identity

Mithaq videos should be:

- calm
- cinematic
- premium
- Arabic-first
- trustworthy
- emotionally relatable
- focused on freelancers’ real problems

## Marketing Rule

Do not make every video a direct advertisement.

Create content that makes the viewer think:

`هذا الحساب يفهمني.`

Mithaq then appears naturally as the solution.

## Content Categories

- Launch Videos
- Freelancers’ Problems
- Legal Awareness
- Product Demonstrations
- Founder Journey
- Behind the Scenes
- Customer Stories
- Product Updates
- Educational Content
- Viral Ideas
- Seasonal Content
- Ads Library

## Approved Video Card Template

Every future video idea should be organized with:

- Video number
- Title
- Goal
- Target audience
- Duration
- Hook
- Shot list
- Voice-over or written text
- Music style
- Editing style
- Caption
- Hashtags
- Marketing objective

## Approved Content Principle

`نبني ميثاق... مع المستقلين، ولأجل المستقلين.`

The user plans to return later and request a complete, organized visual content library.

---

# 28. Current Known Risks and Items to Monitor

## Moyasar Live Payment

Not yet active.

## Contact Email Consistency

Review website content for any old placeholder email.

## SMTP Limits

Custom SMTP is working, but usage limits must be monitored as user volume grows.

## Google Workspace App Password

If the Google password changes, security configuration changes, or App Password is revoked, SMTP may stop working.

Never expose or commit the App Password.

## Beta Feedback

Feedback has not yet been fully collected or analyzed.

## Annual Plan

Not implemented.

## Legal Supervision Text

Not implemented.

## Technology Freelance Certificate

Not obtained.

Do not block Moyasar submission unless Moyasar specifically asks for it.

---

# 29. Current Stage

## Current Status

🟢 **COMMERCIAL BETA IN PROGRESS**

Real users are currently testing the platform.

## Current Primary Goal

Complete Commercial Beta successfully while submitting the Moyasar commercial activation request.

## Immediate Priority Order

1. Submit the Moyasar commercial activation/application.
2. Continue receiving Commercial Beta feedback.
3. Fix any critical bugs immediately.
4. Record non-critical feature requests without implementing them impulsively.
5. Receive Moyasar approval.
6. Connect Live Keys.
7. Perform one real payment test.
8. Complete final launch verification.
9. Begin Public Launch.

## Next Exact Step

Open the Moyasar Dashboard and begin the commercial activation/application process.

Provide one instruction at a time and wait for user confirmation after every step.

---

# 30. Strict Working Rules for Future Sessions

These rules are mandatory when continuing Mithaq:

## Rule 1 — One Step at a Time

Give only one actionable step.

Wait for the user to say:

- تم
- نجح
- فتحت
- or provide a screenshot

before moving to the next step.

## Rule 2 — Verify Before Changing

Before giving a code or database change:

- Confirm whether it was already implemented.
- Review the current file or screenshot.
- Do not repeat old work.
- Do not guess file contents.

## Rule 3 — Preserve Business Logic

Do not change business logic unless:

- There is a confirmed bug.
- The user approves the business change.
- The change is necessary for security or launch readiness.

## Rule 4 — Exact Paths and Instructions

When changing code, always provide:

- Exact file path
- Exact code section
- Whether to replace the full file or a specific block
- How to save
- How to run
- How to test

The user is new to coding and needs operational steps, not only code.

## Rule 5 — Full Files for Large Changes

For substantial modifications, provide the complete file rather than many scattered edits.

## Rule 6 — Do Not Restart Completed Design Work

Premium UI and Final Visual Polish are complete.

Only make targeted fixes based on actual beta feedback.

## Rule 7 — Update Documentation at Stable Milestones

After a meaningful completed milestone:

- Update `PROJECT_STATUS.md`
- Update `CHANGELOG.md` if relevant
- Commit and push if code or tracked documentation changed
- Do not create a GitHub commit for database-only changes unless documentation is updated

## Rule 8 — Protect Secrets

Never write or expose:

- Supabase service role key
- Google App Password
- Moyasar secret keys
- Production environment secrets
- User passwords

## Rule 9 — Commercial Beta Focus

During beta, prioritize:

- Stability
- Security
- Email delivery
- Contract signing
- Data accuracy
- Payments
- Real user friction

Do not prioritize speculative new features.

---

# 31. Future Update Method — Append-Only System

This status is the master project record.

Do not delete historical completed work when adding future updates.

For every completed milestone, perform only these changes:

## A. Update the Date

Change:

`Last Updated: August 2, 2026`

to the new date.

## B. Update the Relevant Existing Section

Example:

- If Moyasar is approved, update Section 18.
- If a bug is fixed, update its relevant product section.
- If the phase changes, update Section 24 and Section 29.

Do not rewrite unrelated completed sections.

## C. Append a New Session Update

Add a new entry at the bottom using the following template:

---

# SESSION UPDATE — YYYY-MM-DD

## Objective

What the session was intended to accomplish.

## Completed

- Exact task completed
- Exact files or services changed
- Exact test performed
- Exact result

## Database Changes

- Table:
- Column/record:
- Change:
- Result:

Write `None` if no database changes occurred.

## Code Changes

- File:
- Change:
- Test:

Write `None` if no code changes occurred.

## External Service Changes

Examples:

- Supabase
- Vercel
- Google Workspace
- Moyasar
- Namecheap

Write exact changes only.

## Production Verification

- URL or flow tested:
- Expected result:
- Actual result:

## GitHub

- Commit:
- Push:
- Branch:

Write `Not required` if only external service or database configuration changed.

## Current Result

A concise statement of the final working state.

## Next Exact Step

Only one next step.

---

# 32. Session Updates

# SESSION UPDATE — 2026-08-01 / 2026-08-02

## Objective

Resolve the production signup email rate-limit issue and prepare Mithaq’s professional email infrastructure for Commercial Beta and Public Launch.

## Completed

- Identified Supabase built-in email limit of 2 emails per hour.
- Created Google Workspace Starter.
- Connected `mithaqplatform.com`.
- Verified domain ownership through Namecheap.
- Activated Gmail MX records.
- Created `admin@mithaqplatform.com`.
- Added Workspace payment method.
- Enabled Two-Step Verification.
- Added recovery phone.
- Added recovery email.
- Created a Google App Password named `Supabase`.
- Enabled custom SMTP in Supabase.
- Configured Gmail SMTP.
- Created a new Mithaq account.
- Received the confirmation email successfully.
- Confirmed Commercial Beta registration is working.

## Database Changes

None.

## Code Changes

None.

## External Service Changes

### Google Workspace

- Workspace created.
- Domain verified.
- Gmail activated.
- Admin mailbox created.
- Security configured.

### Supabase

- Custom SMTP enabled.
- Gmail SMTP configured.
- Built-in limited email sender replaced for authentication messages.

### Namecheap

- DNS verification and Gmail MX configuration completed through the automated Google setup.

## Production Verification

Flow tested:

Production signup → confirmation email

Expected result:

New user receives confirmation email.

Actual result:

Confirmation email arrived successfully.

## GitHub

Not required because no source code changed.

A documentation commit is required only after this `PROJECT_STATUS.md` update is saved.

## Current Result

Mithaq now has a professional email system and production account confirmation emails are working during Commercial Beta.

## Next Exact Step

Begin the Moyasar commercial activation/application process.

---

# END OF MASTER STATUS