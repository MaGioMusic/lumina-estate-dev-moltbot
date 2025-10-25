## Lumina Estate — 4-კვირიანი მიწოდების გეგმა (ერთი დეველოპერი, ინტენსიური)

### ვარაუდები
- 1 დეველოპერი (6–8სთ/დღე, 5 დღე/კვ.)
- ჰოსტინგი/ინფრა მზადაა (Vercel + Supabase)
- ტექნოლოგიური სტეკი: Next.js (App Router), Tailwind, Framer Motion, Supabase (DB/Auth/Realtime/Storage), n8n (ორკესტრაცია), MCP (Semgrep/Context7/Motiff), Sentry/PostHog

### მიზნები (ზოგადი)
- ფრონტენდის დასრულება წარმოების ხარისხამდე (UI/UX, შესრულება, a11y, i18n)
- ბექენდის საფუძველი: auth, RBAC, properties API, ჩატი realtime, ატვირთვები
- ორკესტრაცია და ხარისხის კონტროლი: n8n workflows, observability, უსაფრთხოება, CI/CD

---

### კვირა 1 — ფრონტენდის პოლიში და ინტეგრაციის მზადება
- დღე 1: AI ჩატის დასრულება UI/UX
  - typing ინდიკატორი, შეტყობინების შემოსვლის ანიმაციები, scroll-to-bottom
  - Enter=გაგზავნა, Shift+Enter=ახალი ხაზი, ARIA/focus
- დღე 2: Properties UX
  - სერჩი სლაიდბარში მუდმივად ხილული, scroll/overflow ფიქსი, პინების ფინალური ვიზუალი
- დღე 3: Header/Pages/Blog QA
  - overlay-ის დახურვა გარეთ დაკლიკვით, ჰიდრაციის ფიქსები, i18n ვიზუალური თანაბრობა
- დღე 4: Performance პასი
  - სიების ვირტუალიზაცია, Next/Image lazy, დინამიკური იმპორტები, bundle შემოწმება
- დღე 5: A11y + Smoke ტესტები
  - კონტრასტი, focus ring-ები; RTL/Playwright smoke სცენარები

### კვირა 2 — ბექენდის საფუძველი (Supabase)
- დღე 6: სქემები და RLS
  - users/roles, properties, conversations/messages, favorites, viewings, offers, documents
- დღე 7: Auth + RBAC
  - Supabase Auth ინტეგრაცია, როუტების დაცვა, როლის პოლიტიკები
- დღე 8: ჩატის Realtime
  - conversations/messages API, Realtime, typing/read receipts, ოპტიმისტური UI
- დღე 9: ფაილების ატვირთვა
  - Storage buckets, ზომა/ტიპის ვალიდაცია, ხელმოწერილი URL-ები, აგენტის დოკ/ოფერები
- დღე 10: Property Search API
  - ფილტრები/პაგინაცია, ინდექსები, ფრონტენდის მიერთება

### კვირა 3 — ორკესტრაცია, მონიტორინგი, უსაფრთხოება
- დღე 11: n8n workflows
  - saved search alerts (CRON), offer status notifications, webhooks
- დღე 12: Observability
  - Sentry/PostHog, სტრუქტურული ლოგები, ერორების მეპინგი error boundary-ებიდან
- დღე 13: უსაფრთხოების გამკაცრება
  - CSP headers, rate limiting, server-side zod/სანიტაიზაცია, Semgrep ფიქსები
- დღე 14: End‑to‑End სცენარები
  - auth → search → detail → chat → upload; სტაბილიზაცია
- დღე 15: CI/CD და დოკუმენტაცია
  - GitHub Actions, DB მიგრაციები, .env.example, README/runbooks

### კვირა 4 — ბუფერი, ოპტიმიზაცია, გაშვება
- დღე 16: UAT ფიქსები, i18n QA, Motiff დიზაინის შესაბამისობა
- დღე 17: დატვირთვის ტესტები, ინდექსების ტიუნინგი, ქეშირების სტრატეგია
- დღე 18: სრული რეგრესია, bug bash, polish
- დღე 19: Staging დეპლოი, ბიზნეს-რევიუ
- დღე 20: Production გაშვება, მონიტორინგი, როლბექ-გეგმა

---

### ტექნოლოგიების როლები
- Supabase: Auth/RBAC, Postgres, Realtime (ჩატი), Storage (ფაილები)
- n8n: ორკესტრაცია (alerts, CRON, notifications, integrations)
- MCP: Semgrep (უსაფრთხოება), Context7 (დოკ/ტიპები), Motiff (დიზაინის შესაბამისობა)
- Vercel: Preview/Prod დეპლოები

### ხარისხის კარიბჭეები (Quality Gates)
- უსაფრთხოება ≥ 90 (Semgrep); დიზაინი ≥ 85 (Motiff); დოკუმენტაცია ≥ 80 (Context7); შესრულება ≥ 90
- თუ ქულა ზღვარზე დაბალია — ბლოკირება + ავტომატური ფიქსის რეკომენდაციები

### რისკები და შერბილება
- სკოპის ზრდა → კვირის მიზნების ლოქი; ცვლილებების ლოგი/დეფერალი
- realtime-ის სირთულე → Supabase Realtime-ით სტარტი; feature flag-ები
- i18n შეუსაბამობები → QA ჩეკლისტი თითოეულ გვერდზე; ვიზუალური parity-ების შემოწმება


