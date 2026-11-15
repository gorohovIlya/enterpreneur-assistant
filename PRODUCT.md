# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People in Russia who have not registered a business yet and must choose an organizational-legal form (ОПФ) before filing. They arrive with an approximate picture of the venture — how many founders, expected annual revenue, hiring plans, outside investors, tolerance for personal liability, and whether they prioritize simplicity or scaling — and want a confident shortlist without reading legislation.

The primary use is self-service on desktop or mobile web. Advisors, existing business owners switching form, and students researching the topic are plausible visitors but are not confirmed as primary audiences.

## Product Purpose

The product helps a first-time founder choose among five Russian legal forms — самозанятый (НПД), ИП, ООО, АО, and производственный кооператив — through a six-question self-assessment. It returns one recommended form with plain-language reasons, the form's advantages, key facts (taxation, liability, founders), and up to two alternatives. It is free and requires no signup.

Success means the visitor leaves understanding which form fits their situation, why it fits, what the trade-offs are, and what to verify before registering.

## Positioning

Explainable, deterministic guidance rather than a black-box verdict: every recommendation shows the answers behind it, the reasons, and the closest alternatives. Answers are processed locally; they are sent to the backend only when the visitor explicitly asks for an additional AI explanation. A static comparison article cannot truthfully copy the interactive scoring, per-answer rationale, and per-form catalogue together.

## Operating Context

- Used before registration, usually in a first exploratory session at home or on a phone, not during an actual filing.
- Visitors may not know Russian legal terminology; the product explains forms in plain Russian.
- The six questions cover founders count, expected annual revenue, employees, investors, limited liability, and simplicity versus scaling.
- Results are explicitly informational and are not a substitute for a lawyer or accountant.
- The app is an Angular SPA with a FastAPI backend, documented to run through Docker Compose at `http://localhost`. Recommendation rules run client-side; the backend exposes a health check and an optional AI explanation endpoint.
- The project is public open source (GitHub `gorohovIlya/enterpreneur-assistant`) and intended for self-hosting.

## Capabilities and Constraints

Confirmed capabilities:

- A catalogue of five forms — НПД, ИП, ООО, АО, ПК — each with name, full name, description, advantages, limitations, taxation, liability, founder limits, and a "suited for" line (`frontend/src/app/data/opf-catalog.ts`).
- A six-question form with mandatory answers, inline validation, loading, empty, result, alternatives, reset, and failure states.
- Deterministic scoring in `frontend/src/app/services/recommendation.ts`, exposed as an Observable so it can later move behind the API without component changes. Each result includes generated reasons and up to two alternatives.
- A home page that states the value proposition, lists supported forms, explains the three steps, and links to a dedicated "Как это работает" page.
- An optional AI explanation page: after a recommendation, the visitor can send the same six answers to the backend and read the model's separate take on them (`POST /api/ai`). The AI response does not replace or alter the rule-based recommendation.
- No accounts, profiles, analytics, or server-side persistence. Answers are processed in the browser unless the visitor explicitly requests the AI explanation.

Durable constraints:

- No accounts and no stored personal data.
- Russian-language product copy only, for the Russian market.
- Recommendation rules stay client-side for now; moving them to the API is allowed later but not planned. The AI explanation is a separate, explicitly requested addition, not the source of the recommendation.
- Legal facts (for example the 2.4 million ₽ НПД revenue limit) must stay current with Russian law, and every result carries the informational-only disclaimer.
- Open-source, non-commercial project: no pricing, testimonials, customer claims, or partner offers may be invented.

Undecided:

- Whether recommendation rules move server-side and how much the AI explanation should grow beyond the current single response.
- Whether the product adds a full five-form comparison, saved or shared results, or registration guidance.
- No accessibility standard or specific inclusion requirement has been confirmed. The current implementation includes visible focus styles, an `aria-live` result panel, and reduced-motion handling.

## Brand Commitments

- Product name in the interface: «Помощник предпринимателя», subtitle «выбор организационно-правовой формы». The repository and package name is `enterpreneur-assistant` (misspelled); no rename decision exists.
- Voice: plain, calm Russian, addressing the visitor as «вы»; no legal jargon and no sales pressure; limits are stated honestly.
- No logo assets exist beyond the browser favicon and the typographic «ОПФ» header mark.

## Evidence on Hand

- Form content, advantages, limitations, and tax/liability descriptions in `frontend/src/app/data/opf-catalog.ts`.
- The six-question flow, scoring weights, and reason strings in `frontend/src/app/services/recommendation.ts` and `frontend/src/app/pages/recommend/`.
- Home-page copy on the supported forms and the three-step process in `frontend/src/app/pages/home/`.
- Backend health endpoint returning a Russian confirmation message and the optional AI explanation endpoint (`backend/src/main.py`, `backend/src/ModelRequester.py`, `prompt.md`).

Absent: legal review evidence, user research, testimonials, usage analytics, press coverage, pricing, and partner agreements. Future work must not fabricate them.

## Product Principles

1. Explain, don't pronounce: every recommendation shows why it fits and what else is close.
2. Ask only what changes the answer: six plain-Russian questions, no account, under a minute.
3. Be honest about limits: informational guidance, current legal facts, a visible disclaimer.
4. Private by default: answers stay in the browser unless the visitor explicitly asks for the AI explanation.
5. Keep the start low-ceremony: a first-time founder can begin without preparation or documents.
