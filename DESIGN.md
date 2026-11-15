---
name: Помощник предпринимателя
description: Calm, plain-language guidance for choosing a Russian legal form — an official registry brought into daylight.
colors:
  registry-blue: "#2f5fe0"
  registry-blue-deep: "#244bb4"
  paper-blue: "#eaf0ff"
  daylight-paper: "#f4f6fb"
  sheet-white: "#ffffff"
  ink-navy: "#182034"
  slate-comment: "#5f6b80"
  form-rule: "#dde3ef"
  tint-surface: "#f1f4fa"
  control-track: "#f2f5fb"
  hero-wash: "#edf2ff"
  notice-red: "#b42318"
  verified-green: "#147a4b"
  verified-wash: "#e7f6ee"
  status-checking: "#b3bac7"
  status-online: "#1f9d61"
  status-offline: "#d92d20"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.5rem, 2.5vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0em"
  micro:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.04em"
rounded:
  card: "1.1rem"
  button: "0.7rem"
  control: "0.65rem"
  segment: "0.5rem"
  mark: "0.45rem"
  pill: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.25rem"
  xxl: "1.75rem"
  section: "3.5rem"
  hero: "4rem"
  gutter: "2.5rem"
  gutter-small: "1.75rem"
components:
  button-primary:
    backgroundColor: "{colors.registry-blue}"
    textColor: "{colors.sheet-white}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "0.72rem 1.35rem"
  button-primary-hover:
    backgroundColor: "{colors.registry-blue-deep}"
    textColor: "{colors.sheet-white}"
    rounded: "{rounded.button}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "0.72rem 1.35rem"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.registry-blue}"
    rounded: "{rounded.button}"
  card:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.card}"
  select:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.control}"
    padding: "0.7rem 0.9rem"
  segmented-option-active:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.registry-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.segment}"
    padding: "0.5rem 0.75rem"
  nav-link-active:
    backgroundColor: "{colors.paper-blue}"
    textColor: "{colors.registry-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.9rem"
  badge:
    backgroundColor: "{colors.verified-wash}"
    textColor: "{colors.verified-green}"
    typography: "{typography.micro}"
    rounded: "{rounded.pill}"
    padding: "0.2rem 0.65rem"
---

# Design System: Помощник предпринимателя

## Overview

**Creative North Star: "The Daylight Registry"**

This system imagines a state register brought into daylight: the calm authority of an official institution without its gloom. Pages are a pale, blue-tinted paper; content sits on white sheets laid over it, each held by a single hairline rule and one soft ambient shadow. Nothing is hidden behind ornament — the recommendation, its reasons, its trade-offs and its disclaimer all appear on the same sheet, in the same plain voice. The interface behaves like a well-run information desk: it knows the answer, shows its working, and never raises its voice.

The palette is deliberately narrow. One saturated blue carries every action and every current selection; the rest of the screen is a cool neutral range from paper to ink. Green and red exist only as signals — a recommendation badge, a check, a server status dot, a validation error — and never as a second brand colour. This restraint is what makes a government-adjacent topic feel trustworthy rather than officious.

Density follows the task. The home page is airy and persuasive, with wide sections and a two-column hero; the six-question form is a compact, single-purpose sheet with disciplined 0.75–1.25rem rhythm; the result panel is the densest surface in the product, using a three-column fact grid and small uppercase labels to stay scannable. Corners are soft but not friendly-cute: paper stock, not candy. Motion is limited to 0.15s state feedback and a 1px lift on the primary button.

**Key Characteristics:**
- A single Registry Blue accent on a cool, blue-tinted neutral field.
- White cards with a 1px Form Rule border and one constant ambient shadow.
- System UI type only — no webfont — with bold, negatively tracked headings and small muted meta labels.
- 1.1rem card corners, pill-shaped tags and nav links, 0.65rem field corners.
- Results composed as a paper document: badge, title, checks, reasons, three fact columns, disclaimer.
- Motion as state feedback only; no entrance animations, parallax, or decorative transitions.

## Colors

A cool, institutional palette: one confident blue, one paper-tinted neutral family, and two semantic signals kept on a short leash.

**Implementation.** Every colour below has a custom property in `frontend/src/styles.scss` `:root` (`--accent`, `--verified`, `--status-checking`, and so on) and components reference the variables, never hex literals. Adding a colour means adding a token there first.

### Primary
- **Registry Blue** (#2f5fe0): the only saturated colour in the system. Fills the primary button, tints the active nav link, colours the eyebrow text, the step numbers, the bullet markers in "Почему это подходит", and the 4px top edge of the recommendation card. It is the colour of "this is the thing you act on or are reading now".
- **Registry Blue Deep** (#244bb4): hover and pressed state of the primary button only. Never used as a fill, never as text.
- **Paper Blue** (#eaf0ff): the large soft wash behind the eyebrow pill, step-number circles, active nav links, the empty-state icon, and the full-width CTA band. This is the only colour allowed to fill a large area.

### Neutral
- **Daylight Paper** (#f4f6fb): page background. Every screen starts here.
- **Sheet White** (#ffffff): card and field surfaces, the sticky header at 92% opacity, the footer.
- **Ink Navy** (#182034): all body and heading text. Never pure black.
- **Slate Comment** (#5f6b80): secondary text — leads, hints, disclaimers, "full name" lines, inactive nav, facts labels.
- **Form Rule** (#dde3ef): every 1px border in the product; also the divider between list rows and above the fact grid, and the dashed outline of the empty result panel.
- **Tint Surface** (#f1f4fa): the short-code chips in the supported-forms list and the hover background of nav links.
- **Control Track** (#f2f5fb): the recessed track behind the segmented Да/Нет control.
- **Hero Wash** (#edf2ff): only the top stop of the home hero's vertical gradient, which fades into Daylight Paper.

### Signal
- **Verified Green** (#147a4b) with **Verified Wash** (#e7f6ee): the "Рекомендуем" badge and its background, plus the check marks in the advantages list.
- **Notice Red** (#b42318): validation errors and the "Не удалось получить рекомендацию" line. Text only, never a fill.
- **Status Checking** (#b3bac7): the dot's neutral state while the health request is still in flight. It is a neutral, not a signal — it carries no success or failure meaning.
- **Status Online** (#1f9d61) / **Status Offline** (#d92d20): the 8px server-availability dots on the home page, and nothing else.

### Named Rules
**The One Accent Rule.** Registry Blue marks action, current state, or the recommended answer — and nothing else. If a blue element is neither clickable, selected, nor the recommendation, it is decoration and must go.

**The Signal-Only Rule.** Green and red never become brand colours. Green appears only on the recommendation badge, the check marks, and the online dot; red only on errors and the offline dot. No success toasts, no decorative green highlights, no red emphasis in copy.

**The No-Black Rule.** Text is Ink Navy, at every size and weight. Pure black is off-palette and reads harsher than the paper field around it.

## Typography

**Display Font:** system UI stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`)
**Body Font:** the same stack
**Label/Mono Font:** none — labels are the body family at 600 weight

**Character:** Native, familiar, and invisible. The product explains a legal decision, so the type does not perform; it borrows the visitor's own operating system so Russian text renders correctly and instantly on any device. Personality comes from weight and tracking, not from a typeface: bold headings pull tighter as they grow, while every supporting label stays small, muted, and quiet.

### Hierarchy
- **Display** (700, `clamp(2rem, 4.2vw, 3rem)`, line-height 1.12, letter-spacing -0.02em): the home hero headline only.
- **Headline** (700, `clamp(1.75rem, 3.5vw, 2.4rem)`, line-height 1.15, letter-spacing -0.02em): the page title on the recommendation screen.
- **Title** (700, `clamp(1.5rem, 2.5vw, 2rem)`, line-height 1.2, letter-spacing -0.01em): section headings on the home page; the result title uses `clamp(1.6rem, 3vw, 2rem)`.
- **Body** (400, 1rem, line-height 1.6): all running text; the hero lead rises to 1.08rem and the disclaimer drops to 0.76rem. Long copy caps around 38rem (hero lead) or 46rem (page intro) — roughly 65–75 characters.
- **Label** (600, 0.92rem): field labels, button text, nav items, alternative-form names.
- **Micro** (600–700, 0.72–0.8rem, letter-spacing 0.02–0.04em, uppercase only for the badge and fact labels): hints, form notes, status line, fact columns, footer.

### Named Rules
**The System Native Rule.** No webfont, no display face, no imported variable font. The product ships one system stack so Cyrillic renders in the visitor's own UI language and the first paint has nothing to wait for. Adding a webfont is a redesign decision, not a refinement.

**The Tight Heading Rule.** Letter-spacing becomes negative as size grows (-0.01em at section level, -0.02em at page and hero level) and returns to 0 for body text. Headlines should look set, not spaced.

**The Quiet Label Rule.** Supporting text is never larger than 0.92rem and never darker than Slate Comment unless it is a field label or button — those two carry weight instead of colour.

## Layout

A single centred container, `min(1120px, 100% - 2.5rem)`, transitions to `100% - 1.75rem` below 640px. There is no sidebar and no complex grid; every screen is a stack of full-width sections inside that container.

The home page opens with a two-column hero (1.35fr content / 0.9fr supported-forms card, 3rem gap) that collapses to one column at 900px, followed by alternating Daylight Paper and Paper Blue bands at 3.5rem vertical padding each (2.5rem on mobile). The recommendation screen uses a 1.05fr form / 0.95fr result split with a 1.75rem gap; the form is a single white sheet, the result column is `position: sticky` at 5.5rem so it stays visible beneath the 4.25rem sticky header, and both collapse to one column at 900px. The form itself uses a vertical 1.25rem field rhythm inside 1.75rem padding.

Spacing is a loose 0.25rem family (`0.25 / 0.5 / 0.75 / 1 / 1.25 / 1.75rem`) plus two section-level values: 3.5rem for content bands and 4rem for the hero's top padding. Grids hold three columns on desktop (`steps`, `facts`) and drop to one column at 900px; the fact grid becomes two columns at 640px rather than one, keeping tax / liability / founders scannable on a phone. Primary actions go full-width on small screens in the hero.

## Elevation & Depth

The system is flat with one constant ambient shadow. Depth is a paper metaphor: cards are sheets resting on a desk, and the shadow is the gap between them — the same gap for every sheet, regardless of importance. Importance is signalled by position, the 4px Registry Blue top edge on the result card, and Paper Blue fills, never by a heavier shadow.

Three exceptions, all state-driven: the primary button carries a coloured glow in its own hue, the selected segmented option carries a 1px micro-shadow to read as raised off its track, and the sticky header uses a 10px backdrop blur over a 92% sheet instead of a shadow. Nested cards (the alternative-form tiles) explicitly remove the shadow so they sit inside the result column without doubling the gap.

### Shadow Vocabulary
- **Sheet Rest** (`0 10px 30px rgba(24, 32, 52, 0.07)`): every card at rest — hero aside, steps, form, result, empty state. One value, no variants.
- **Action Glow** (`0 8px 18px rgba(47, 95, 224, 0.22)`): the primary button only, removed on hover-lift and on disabled.
- **Track Lift** (`0 1px 4px rgba(24, 32, 52, 0.14)`): the selected segmented option.
- **Focus Ring** (`2px solid #2f5fe0`, offset 2px): every `:focus-visible` element. Solid, never translucent — a 35%-alpha ring measured about 1.7:1 against the paper field and failed AA non-text contrast. The select keeps its accent border and shares the same ring.

### Named Rules
**The One Gap Rule.** One ambient shadow for every card, at every depth. If two cards nest, the inner one loses its shadow rather than gaining a second value.

**The Flat-By-Default Rule.** Surfaces are flat at rest and do not lift on hover. The only element that moves on hover is the primary button (a 1px translateY), and only because it is the page's single action.

## Shapes

Soft rectangles throughout, with radius scaling inversely to element size: 1.1rem cards, 0.7rem buttons and the brand mark, 0.65rem selects and the segmented track, 0.5rem segmented options, 0.45rem short-code chips. Pills (999px) are reserved for the eyebrow, the recommendation badge, and nav links. Circles appear only for the three step numbers, the empty-state "?" icon, and the 8px status dot.

Borders are always 1px Form Rule; the result card's 4px blue top edge is the only coloured border, and focus is drawn with outlines rather than borders. The result card's 4px accent edge is the one deliberate asymmetry in the system and should stay unique to results. The empty result panel swaps its solid border for a dashed one and drops to 60% white, reading as a placeholder rather than a filled sheet.

## Components

### Buttons
- **Shape:** soft 0.7rem radius, 0.72rem × 1.35rem padding, inline-flex with a 0.45rem gap and a trailing arrow where the action moves the visitor forward.
- **Primary:** Registry Blue fill, white text at 0.92rem / 600, action glow, 1px lift on hover with Registry Blue Deep; disabled means "working" only — it drops the glow, dims to 55% and shows `not-allowed`. The submit button stays enabled on an incomplete form so that pressing it can reveal the field errors.
- **Ghost:** transparent fill, 1px Form Rule border, Ink Navy text; hover turns both border and text Registry Blue. Used for the secondary hero action and the reset button.
- **Block:** `width: 100%` — the form's submit and reset buttons, and hero buttons below 640px.

### Selects
- **Style:** white field, 1px Form Rule border, 0.65rem radius, 0.7rem × 0.9rem padding, 2.75rem minimum height (44px touch target), full width, pointer cursor. Native arrow retained.
- **Focus:** border shifts to Registry Blue and the shared 2px solid focus ring applies.
- **Error:** a 0.78rem Notice Red line appears 0.35rem below the field once the control is touched and invalid; the field border does not turn red.

### Segmented Control
- **Style:** a two-up grid inside a recessed Control Track trough with 1px border and 0.65rem radius; options are 0.5rem-radius pills of muted 0.88rem text.
- **State:** the selected option turns Sheet White with Track Lift, Registry Blue text and 600 weight; the input is visually hidden but focus draws a 2px blue outline around the option via `:focus-visible`.

### Cards
- **Corner Style:** 1.1rem.
- **Background:** Sheet White over Daylight Paper.
- **Shadow Strategy:** Sheet Rest only; nested alternatives drop it.
- **Border:** 1px Form Rule; the result card adds a 4px Registry Blue top edge.
- **Internal Padding:** 1.5rem (hero aside, steps), 1.6rem (result), 1.75rem (form), 1.25rem on mobile.

### Recommendation Result
- **Composition:** "Рекомендуем" badge → form name (Title) → full legal name in Slate Comment 0.85rem → description → "Преимущества" checks → "Ограничения" limits → "Почему это подходит" reasons → three-column facts → disclaimer.
- **Checks:** green `✓` pseudo-element at 1.45rem indent; limitations use a muted Slate Comment `–` at 1.1rem indent (never red — a limitation is product scope, not an error); reasons use a 0.4rem Registry Blue dot at 1.1rem indent with Slate Comment text.
- **Facts:** a top rule, uppercase 0.72rem Slate Comment labels, 0.82rem 600 values; two columns below 640px.
- **Alternatives:** up to two flattened cards, 0.85rem × 1rem padding, name plus one "suited for" line, 0.5rem apart.

### Badge & Status
- **Badge:** pill, Verified Wash fill, Verified Green uppercase 0.75rem / 700, 0.03em tracking. One per result, never decorative.
- **Status line:** 8px dot plus 0.82rem Slate Comment text under the hero actions; the dot is Status Checking while the request is in flight, Status Online when the API answers, Status Offline when it does not.

### Navigation
- **Header:** sticky, 92% white with a 10px backdrop blur and a 1px bottom rule, 4.25rem minimum height. Brand is a 2.6rem Registry Blue mark with white "ОПФ" lettering and a two-line title/subtitle; the subtitle hides below 640px.
- **Links:** pill-shaped 0.9rem / 600 Slate Comment text, 0.5rem × 0.9rem padding; hover swaps to Ink Navy on Tint Surface; the active route becomes Registry Blue on Paper Blue.
- **Footer:** one line of 0.8rem Slate Comment text on white, copyright left and the informational disclaimer right; centred on mobile.

### Empty State
- **Style:** dashed Form Rule border, 60% white fill, no shadow, 22rem minimum height (14rem on mobile), centred.
- **Content:** 3rem Paper Blue circle with a "?" glyph, 1.1rem heading, one 0.9rem Slate Comment line telling the visitor what will appear here.

## Do's and Don'ts

### Do:
- **Do** keep Registry Blue for action, current state, and the recommended answer only — roughly under 10% of any screen.
- **Do** place every card on Sheet White over Daylight Paper with a 1px Form Rule border and the single Sheet Rest shadow.
- **Do** set all text in the system UI stack with Ink Navy for primary and Slate Comment for secondary.
- **Do** use pills (999px) for tags and nav, and reserve soft rectangles for content surfaces.
- **Do** show the recommendation with its reasons, facts, alternatives, and the informational disclaimer in one continuous sheet.
- **Do** use rem for type and spacing so the layout scales with the visitor's browser settings.
- **Do** end every state transition at 0.15s and disable transitions plus smooth scrolling under `prefers-reduced-motion`.
- **Do** state limits honestly in the copy — red is for errors, not for warnings about the product's own scope.

### Don't:
- **Don't** introduce a webfont, display typeface, or icon font; the system is intentionally native.
- **Don't** add a second accent hue, gradient, or decorative illustration. The hero's blue-to-paper fade is the only gradient in the product.
- **Don't** fill large areas with Registry Blue, and never use Registry Blue Deep as a background or text colour.
- **Don't** use pure black, pure grey, or a shadow value other than Sheet Rest for cards.
- **Don't** let green or red migrate into brand roles — no green success banners, no red emphasis in running copy.
- **Don't** stack shadows on nested cards; remove the inner shadow instead.
- **Don't** use uppercase for body copy; only the badge and fact labels are uppercase.
- **Don't** centre paragraphs — only the empty state, form hint/error lines, and mobile footer align centre.
- **Don't** change the 1.1rem card radius to a pill or a hard corner; the paper metaphor depends on it.
