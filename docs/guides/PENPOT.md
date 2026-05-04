# Penpot Design Prototype Guide

> Step-by-step guide for creating a high-fidelity interactive prototype of Lilly's Box in [Penpot](https://penpot.app), the open-source design tool.

---

## Table of Contents

1. [What is Penpot?](#1-what-is-penpot)
2. [Project Setup](#2-project-setup)
3. [Design Tokens (Shared Library)](#3-design-tokens-shared-library)
4. [Component Library](#4-component-library)
5. [Page & Frame Organization](#5-page--frame-organization)
6. [Screen-by-Screen Reference](#6-screen-by-screen-reference)
7. [Prototype Flows & Interactions](#7-prototype-flows--interactions)
8. [Responsive Variants](#8-responsive-variants)
9. [Naming Conventions](#9-naming-conventions)
10. [Collaboration & Export](#10-collaboration--export)

---

## 1. What is Penpot?

Penpot is a free, open-source design & prototyping tool for teams. It runs in the browser (or self-hosted) and supports:

- **Frames** → equivalent to artboards / screens
- **Components** → reusable UI elements with master/override model
- **Design tokens** → centralized color, typography, and spacing values via the Shared Library
- **Prototype mode** → clickable flows with transitions between frames
- **Inspect panel** → developer handoff with CSS values

Access it at **https://penpot.app** (free cloud account) or self-host via Docker.

---

## 2. Project Setup

### 2.1 Create the Project

1. Log in to Penpot and click **New project**.
2. Name it **`Lilly's Box`**.
3. Click **New file** inside the project → name it **`Lilly's Box – Design System`** (for tokens & components).
4. Click **New file** again → name it **`Lilly's Box – Prototype`** (for all screens and flows).

### 2.2 Canvas Settings

In the **Prototype** file:

- Open **Edit → File settings**.
- Set **canvas background** to `#f5f0ff` (brand light purple).
- Keep the default grid off; individual frames carry their own backgrounds.

### 2.3 Mobile Frame Preset

Lilly's Box targets **375 × 812 px** (iPhone 12 Pro equivalent at 1x) as the base mobile frame size. You will use this for all screen frames unless otherwise noted.

| Device preset | Width | Height |
|---------------|-------|--------|
| Mobile (base) | 375 px | 812 px |
| Mobile Large | 428 px | 926 px |
| Tablet | 768 px | 1024 px |

---

## 3. Design Tokens (Shared Library)

Work in the **Design System** file. All tokens below come from `src/config/constants.ts` and `src/config/responsive.ts`. Full reference: [`docs/design-system/00-design-tokens.md`](../design-system/00-design-tokens.md).

### 3.1 Colors

Go to **Assets panel → Colors → +** for each token.

#### Brand

| Name | Hex |
|------|-----|
| `brand/primary` | `#9b59b6` |
| `brand/primary-light` | `#f5f0ff` |
| `brand/primary-surface` | `#f3e5f5` |
| `brand/primary-border` | `#e0d4f0` |

#### Semantic / Stats

| Name | Hex |
|------|-----|
| `semantic/stat-high` | `#4CAF50` |
| `semantic/stat-medium` | `#FFA726` |
| `semantic/stat-low` | `#EF5350` |
| `semantic/stat-critical` | `#C62828` |

#### Feedback

| Name | Hex |
|------|-----|
| `feedback/success` | `#27ae60` |
| `feedback/error` | `#e74c3c` |
| `feedback/error-surface` | `#ffebee` |
| `feedback/warning` | `#F44336` |
| `feedback/info-blue` | `#4285f4` |
| `feedback/reward-gold` | `#f1c40f` |

#### Surfaces & Text

| Name | Hex |
|------|-----|
| `surface/white` | `#ffffff` |
| `surface/gray-light` | `#f5f5f5` |
| `surface/gray-border` | `#e0e0e0` |
| `surface/disabled` | `#cccccc` |
| `text/primary` | `#333333` |
| `text/secondary` | `#555555` |
| `text/tertiary` | `#666666` |
| `text/muted` | `#888888` |
| `text/placeholder` | `#999999` |
| `text/on-dark` | `#ffffff` |

#### Scene Backgrounds

| Name | Hex |
|------|-----|
| `bg/login` | `#f5f0ff` |
| `bg/home` | `#e8f5e9` |
| `bg/feed` | `#fff8e1` |
| `bg/bath` | `#e3f2fd` |
| `bg/sleep` | `#1a1a2e` |
| `bg/play` | `#e1f5fe` |
| `bg/vet` | `#E8F5E9` |
| `bg/wardrobe` | `#fce4ec` |
| `bg/menu` | `#fdf6ec` |
| `bg/runner` | `#87CEEB` |

#### Menu Quilt

| Name | Hex |
|------|-----|
| `quilt/pink` | `#f4a5a5` |
| `quilt/blue` | `#a5c8e4` |
| `quilt/green` | `#a5d6a7` |
| `quilt/yellow` | `#fff59d` |
| `quilt/purple` | `#ce93d8` |
| `menu/rose` | `#c0606b` |
| `menu/blue-accent` | `#6a9bc3` |

### 3.2 Typography

Go to **Assets panel → Typography → +**.

> Penpot doesn't have built-in system fonts for emoji; use a system sans-serif (e.g., **Inter** or **Nunito**) and note that emoji are rendered by the OS at runtime.

| Style name | Size | Weight | Usage |
|------------|------|--------|-------|
| `type/hero` | 40 | 800 | Game home titles |
| `type/title-lg` | 36 | 700 | Login title |
| `type/title` | 32 | 700 | Section headers |
| `type/title-md` | 28 | 700 | Create pet title |
| `type/title-sm` | 24 | 700 | Scene headers |
| `type/subtitle` | 22 | 600 | Play button text |
| `type/body-lg` | 20 | 600 | Create/hero text |
| `type/body` | 18 | 400 | Subtitles, messages |
| `type/body-sm` | 16 | 600 | Button labels |
| `type/caption` | 14 | 400 | Instructions |
| `type/small` | 12 | 400 | Footer, badges |
| `type/tiny` | 10 | 400 | Sidebar labels |

### 3.3 Enable as Shared Library

1. In the Design System file, click the file name in the top bar → **Add as Shared Library**.
2. Open the Prototype file → **Assets panel → Libraries → Link `Lilly's Box – Design System`**.

You can now use all colors and type styles from the shared library across all prototype frames.

---

## 4. Component Library

Build these master components in the **Design System** file under **Assets → Components**. They map 1-to-1 to React Native components in `src/components/`.

### 4.1 StatusCard

Represents `src/components/StatusCard.tsx`.

**Master component frame** — 375 × 68 px, transparent background.

Structure (left-to-right columns, each 30-40% width):

```
┌─────────────────────────────────────────────────────┐
│  [PetName 18px bold] [💰 coins]  |  (empty) |  [StatBars] │
│  [Age / breed 12px]                              │
└─────────────────────────────────────────────────────┘
```

**StatBar sub-component** (one per stat):
- Row: emoji (16px) + label text (10px) + progress bar (80px × 8px, radius 4px)
- Fill color driven by value: `semantic/stat-high` > 70, `semantic/stat-medium` > 40, `semantic/stat-low` > 20, `semantic/stat-critical` ≤ 20.
- Stats: 🍖 Hunger, 🛁 Hygiene, ⚡ Energy, ❤️ Health

**Variants** (use Penpot's component variants):
- `state=default` — all bars filled
- `state=warning` — one or more bars in orange/red range

### 4.2 IconButton

Represents `src/components/IconButton.tsx`.

**Master component** — 72 × 72 px (mobile).

Structure:
```
┌──────────────────┐
│   Emoji (28px)   │  bg: #ffffff, radius: 12px
│   Label (12px)   │  shadow: 0 2px 4px rgba(0,0,0,.1)
└──────────────────┘
```

**Variants:**
- `state=default`
- `state=urgent` — border `2px` solid `feedback/error`
- `state=disabled` — opacity 50%

### 4.3 ScreenHeader

Represents `src/components/ScreenHeader.tsx`.

**Master component** — 375 × 56 px, background `surface/white`, bottom border 1px `surface/gray-border`.

Structure:
```
[← Back (16px, w500)] ──── [Title (20px, w700)] ──── [optional right slot]
```

### 4.4 ConfirmModal

Represents `src/components/ConfirmModal.tsx`.

**Master component** — 320 × auto px, background `surface/white`, radius `16px`, shadow-overlay.

Structure:
```
┌────────────────────────────────┐
│  Title (20px, w700, center)    │
│  Message (16px, center)        │
│                                │
│  [Cancel btn]  [Confirm btn]   │
└────────────────────────────────┘
```

Behind the modal: a full-screen dim overlay frame (`rgba(0,0,0,0.5)`).

### 4.5 GameCard

Represents a card in `GameSelectionScreen`.

**Master component** — 160 × 180 px (2-per-row layout), radius `24px`, background `surface/white`, shadow-lg.

Structure:
```
┌──────────────────────────────────┐
│    Category tag (top-left chip)  │
│    Game icon emoji (48px)        │
│    Game title (16px, w700)       │
│    Short description (12px)      │
└──────────────────────────────────┘
```

**Variants:** one per game category: `pet`, `casual`, `puzzle`, `adventure`, `emulator`, `board` — each with different icon and accent color.

### 4.6 PetRenderer (Placeholder)

Since the pet is animated at runtime, represent it in Penpot as a static placeholder:

- Rectangle: 260 × 260 px (mobile), fill `brand/primary-surface`, radius `130px` (circle).
- Centered emoji label: `🐾` at 80px (or a cat/dog SVG import if available).

---

## 5. Page & Frame Organization

Work in the **Prototype** file. Use Penpot **pages** to group related screens.

### 5.1 Recommended Pages

| Page | Screens |
|------|---------|
| `00 – Auth & Hub` | LoginScreen, GameSelectionScreen |
| `01 – Pet Menu` | MenuScreen, CreatePetScreen |
| `02 – Pet Care` | HomeScreen, FeedScene, BathScene, SleepScene, PlayScene, VetScene, WardrobeScene |
| `03 – Games: Casual` | Muito, ColorTap, DressUpRelay, FeedThePet, WhackAMole, CatchTheBall |
| `04 – Games: Puzzle` | MemoryMatch, SimonSays, ColorMixer, SlidingPuzzle |
| `05 – Games: Adventure` | PetRunner |
| `06 – Overlays` | ConfirmModal, GameOver, Results |

### 5.2 Frame Naming Convention

```
[Screen name] / [Variant or state]
```

Examples:
- `LoginScreen / Default`
- `LoginScreen / Loading`
- `LoginScreen / Error`
- `HomeScreen / Default`
- `HomeScreen / Warning Stats`
- `FeedScene / Default`

Group frames that belong to the same screen using Penpot **groups** or simply align them in a row on the canvas.

---

## 6. Screen-by-Screen Reference

This section is a Penpot-focused summary of each screen. For full pixel specs, see the corresponding file in [`docs/design-system/`](../design-system/).

### 6.1 LoginScreen

**Frame:** 375 × 812, bg `bg/login`

Layers (top-to-bottom):
1. **SafeArea padding** — 40px top, 20px sides
2. **LogoSection group**
   - 🐾 emoji text (80px)
   - Title: "Lilly's Box" — `type/title-lg`, `text/primary`
   - Subtitle: "Care for your virtual pet" — `type/body-sm`, `text/tertiary`
3. **ErrorContainer** (hidden by default) — bg `feedback/error-surface`, radius 8, padding 12
4. **ButtonContainer** group
   - Google button — bg `feedback/info-blue`, radius 12, padding v16 h20
   - "or" divider — `type/caption`, `text/placeholder`
   - Guest button — bg `brand/primary-light`, border 2px `brand/primary`, radius 12
5. **Footer** — `type/small`, `text/placeholder`, centered

**Variants:** `Default`, `Loading` (ActivityIndicator on button), `Error` (ErrorContainer visible)

Reference: [`01-login-screen.md`](../design-system/01-login-screen.md)

---

### 6.2 GameSelectionScreen

**Frame:** 375 × 812, bg `bg/login`

Layers:
1. **Header** — Title "Select a Game" `type/title`, + money badge
2. **Search/filter row** (optional)
3. **GameCard grid** — 2-column, gap 12px, `GameCard` component instances

Reference: [`02-game-selection-screen.md`](../design-system/02-game-selection-screen.md)

---

### 6.3 MenuScreen

**Frame:** 375 × 812, bg `bg/menu`

Layers:
1. **QuiltBackground** — decorative patchwork squares (6×6 grid, 6 quilt colors)
2. **Header** — "Lilly's Box" `type/title`, rose color `menu/rose`
3. **HeroCard** — full-width, radius 20, bg `quilt/pink` (no pet) or `quilt/blue` (has pet)
4. **PetGrid** — 2-column cards for each pet
5. **BottomBar** — language selector + sign-out button

Reference: [`03-menu-screen.md`](../design-system/03-menu-screen.md)

---

### 6.4 CreatePetScreen

**Frame:** 375 × 812, bg `brand/primary-light`

Key areas:
1. **ScreenHeader** component
2. **Name input** — radius 12, border `surface/gray-border`
3. **Species row** — Cat 🐱 / Dog 🐶 selectable chips, selected bg `brand/primary-surface`
4. **Color picker row** — colored circles (base, black, brown, white & brown)
5. **Gender row** — Male / Female / Other chips
6. **Create button** — bg `brand/primary`, radius 12, full-width

Reference: [`04-create-pet-screen.md`](../design-system/04-create-pet-screen.md)

---

### 6.5 HomeScreen

**Frame:** 375 × 812, bg `bg/home`

Key areas:
1. **StatusCard** component — top
2. **Warning text** (conditional) — `feedback/warning`
3. **PetRenderer** placeholder — flex center
4. **ActionsContainer** — white, rounded top, 7 × IconButton instances

Reference: [`05-home-screen.md`](../design-system/05-home-screen.md)

---

### 6.6 FeedScene

**Frame:** 375 × 812, bg `bg/feed`

Key areas:
1. **StatusCard** — transparent bg
2. **PetRenderer** placeholder
3. **ActionArea** — white, rounded top
   - Food carousel (← [food button] →), amber accents

Reference: [`06-feed-scene.md`](../design-system/06-feed-scene.md)

---

### 6.7 BathScene

**Frame:** 375 × 812, bg `bg/bath`

Key areas:
1. **StatusCard**
2. **PetRenderer** placeholder (sponge emoji overlay)
3. **ActionArea** — white, rounded top
   - "Bathe" CTA button

Reference: [`07-bath-scene.md`](../design-system/07-bath-scene.md)

---

### 6.8 SleepScene

**Frame:** 375 × 812, bg `bg/sleep` (dark navy)

Key areas:
1. **StatusCard** — dark themed, white text
2. **PetRenderer** placeholder
3. **SleepProgressBar** — gold fill `sleep-gold`, radius pill
4. **FloatingZ** labels — decorative `💤` emojis at varying opacity

Reference: [`08-sleep-scene.md`](../design-system/08-sleep-scene.md)

---

### 6.9 PlayScene

**Frame:** 375 × 812, bg `bg/play`

Key areas:
1. **StatusCard**
2. **PetRenderer** placeholder
3. **ActionArea** — activity carousel (← [activity] →), sky-blue accents

Reference: [`09-play-scene.md`](../design-system/09-play-scene.md)

---

### 6.10 VetScene

**Frame:** 375 × 812, bg `bg/vet`

Key areas:
1. **StatusCard**
2. **PetRenderer** placeholder
3. **TreatmentPanel** — white card, treatment options list
4. **BenefitsSidebar** — bg `vet-sidebar-bg`, conditionally visible

Reference: [`10-vet-scene.md`](../design-system/10-vet-scene.md)

---

### 6.11 WardrobeScene

**Frame:** 375 × 812, bg `bg/wardrobe`

Key areas:
1. **StatusCard**
2. **PetRenderer** with clothing overlay
3. **SlotTabs** — row of slot type tabs (hat, shirt, pants…)
4. **ItemGrid** — 3-column grid of clothing items

Reference: [`11-wardrobe-scene.md`](../design-system/11-wardrobe-scene.md)

---

### 6.12 Mini-Game Screens (Pattern)

All mini-game **Home** screens share the same layout — create one master component (`GameHomeTemplate`) and override text/colors per game:

```
┌──────────────────────────────────┐
│  ScreenHeader (← back)           │
│                                  │
│  Game icon emoji (72px, center)  │
│  Title (type/hero, center)       │
│  Best score card (white, radius) │
│                                  │
│  PLAY button (radius/pill, full) │
│                                  │
│  Instructions text (type/caption)│
└──────────────────────────────────┘
```

**Game screens** should show the active gameplay state as a single representative frame (not animated).

For full per-game specs see:
- [`12-muito-game.md`](../design-system/12-muito-game.md)
- [`13-color-tap-game.md`](../design-system/13-color-tap-game.md)
- [`14-memory-match-game.md`](../design-system/14-memory-match-game.md)
- [`15-pet-runner-game.md`](../design-system/15-pet-runner-game.md)
- [`17-simon-says-game.md`](../design-system/17-simon-says-game.md)
- [`18-dress-up-relay-game.md`](../design-system/18-dress-up-relay-game.md)
- [`19-color-mixer-game.md`](../design-system/19-color-mixer-game.md)
- [`20-feed-the-pet-game.md`](../design-system/20-feed-the-pet-game.md)
- [`21-whack-a-mole-game.md`](../design-system/21-whack-a-mole-game.md)
- [`22-catch-the-ball-game.md`](../design-system/22-catch-the-ball-game.md)
- [`23-sliding-puzzle-game.md`](../design-system/23-sliding-puzzle-game.md)

---

## 7. Prototype Flows & Interactions

Switch to **Prototype mode** (top-right panel toggle) to draw connections between frames.

### 7.1 Main Flow

```
LoginScreen/Default
  ── [Google button click] ──► GameSelectionScreen/Default
  ── [Guest button click]  ──► GameSelectionScreen/Default

GameSelectionScreen/Default
  ── [Pet Care card click] ──► MenuScreen/Default

MenuScreen/Default
  ── [+ New Pet click]     ──► CreatePetScreen/Default
  ── [Pet card click]      ──► HomeScreen/Default

CreatePetScreen/Default
  ── [Create button click] ──► HomeScreen/Default

HomeScreen/Default
  ── [🍖 Feed]    ──► FeedScene/Default
  ── [🛁 Bath]    ──► BathScene/Default
  ── [💤 Sleep]   ──► SleepScene/Default
  ── [🎮 Play]    ──► PlayScene/Default
  ── [🏥 Vet]     ──► VetScene/Default
  ── [👕 Clothes] ──► WardrobeScene/Default
  ── [🏠 Menu]    ──► HomeScreen/MenuConfirm (ConfirmModal overlay)
    ── [Confirm]  ──► MenuScreen/Default
```

### 7.2 Mini-Game Flows (example — Memory Match)

```
GameSelectionScreen/Default
  ── [Memory Match card] ──► MemoryMatchHomeScreen/Default
    ── [PLAY button]     ──► MemoryMatchGameScreen/Playing
      ── [Game over]     ──► MemoryMatchGameScreen/GameOver
        ── [Play Again]  ──► MemoryMatchGameScreen/Playing
        ── [Back]        ──► MemoryMatchHomeScreen/Default
```

Repeat this pattern for every mini-game (replace `MemoryMatch` with the game name).

### 7.3 Overlay Interactions

To prototype modals:
1. Create a separate full-size frame for the modal state (e.g., `HomeScreen/MenuConfirm`).
2. Copy the base frame content, then add the `ConfirmModal` component and dim overlay on top.
3. Connect the 🏠 button → `HomeScreen/MenuConfirm` with **Overlay** transition (not navigate).
4. Connect **Confirm** → `MenuScreen/Default`, **Cancel** → `HomeScreen/Default`.

### 7.4 Transition Animations

| Flow type | Recommended Penpot transition |
|-----------|-------------------------------|
| Screen push (forward) | Slide → Left, 300ms ease-out |
| Screen pop (back) | Slide → Right, 300ms ease-out |
| Modal open | Dissolve, 200ms ease-in |
| Modal close | Dissolve, 150ms ease-out |
| Scene change (pet care) | Slide → Left, 250ms ease-out |

---

## 8. Responsive Variants

For each key screen, create three responsive variants as separate frames side-by-side:

| Frame suffix | Width | Height | Notes |
|--------------|-------|--------|-------|
| `/Mobile`    | 375 px | 812 px | Primary target |
| `/Tablet`    | 768 px | 1024 px | Scale fonts ~1.15× |
| `/Desktop`   | 1280 px | 900 px | Two-column layout possible |

The app uses `useResponsive()` → match the scale rules from [`docs/design-system/00-design-tokens.md`](../design-system/00-design-tokens.md#responsive-font-scale):

- Font scale range: **0.85× – 1.3×** (relative to 390px base)
- Spacing scale: `Math.min(scale, 1.15)`

You don't need responsive variants for every screen — focus on **LoginScreen**, **HomeScreen**, **GameSelectionScreen**, and **MenuScreen**.

---

## 9. Naming Conventions

Follow these rules consistently so generated specs match the codebase:

### Layers

```
[ComponentName]           → top-level groups/frames matching React component names
[ComponentName]/[Element] → child layers (e.g., StatusCard/StatBars)
```

### Components

```
[ComponentName]                  → master component
[ComponentName]/[VariantValue]   → variant (e.g., IconButton/urgent)
```

### Colors

```
[category]/[token-name]   → e.g., brand/primary, bg/feed
```

### Frames (screens)

```
[ScreenName]/[State]      → e.g., LoginScreen/Error, HomeScreen/Default
```

---

## 10. Collaboration & Export

### 10.1 Sharing the Prototype

1. In the Prototype file, click **Share** (top bar).
2. Toggle **Can view** → send the link to stakeholders.
3. Click **▶ Play** to launch the interactive prototype in the browser.

### 10.2 Developer Handoff

1. Open the Prototype file → switch to **Inspect** panel (right side bar).
2. Click any element to see its CSS-equivalent values (dimensions, colors, radii, shadows, typography).
3. Share the file URL with developers — no extra export step needed.

### 10.3 Exporting Assets

| Asset | Penpot action |
|-------|---------------|
| Screen PNG/JPG | Right-click frame → Export → PNG @1x / @2x |
| Component SVG | Right-click component → Export → SVG |
| All screens PDF | File → Export → PDF |

### 10.4 Keeping Tokens in Sync

Whenever design tokens change in `src/config/constants.ts`:

1. Update the matching color/typography in the **Design System** file.
2. The **Prototype** file inherits changes automatically via the Shared Library link.

### 10.5 Recommended Workflow

```
1. Build/update Design System tokens & components
2. Duplicate existing screen frame (or create new)
3. Compose screen using component instances + tokens
4. Add prototype connections in Prototype mode
5. Review with stakeholders via Share link
6. Developer picks values from Inspect panel
7. Update tokens in code → update Penpot tokens
```

---

## Quick-Start Checklist

- [ ] Create Penpot account at https://penpot.app
- [ ] Create project **Lilly's Box**
- [ ] Create file **Design System** — add all color tokens and typography styles
- [ ] Enable Design System as Shared Library
- [ ] Create file **Prototype** — link the Shared Library
- [ ] Build master components: StatusCard, IconButton, ScreenHeader, ConfirmModal, GameCard, PetRenderer
- [ ] Add pages: `00 – Auth & Hub`, `01 – Pet Menu`, `02 – Pet Care`, `03–05 – Games`, `06 – Overlays`
- [ ] Create all screen frames (375 × 812) following the Screen-by-Screen Reference
- [ ] Connect frames with prototype interactions (Section 7)
- [ ] Add responsive variants for key screens (Section 8)
- [ ] Share prototype link with team

---

*Design token source of truth: [`docs/design-system/00-design-tokens.md`](../design-system/00-design-tokens.md)*
*Component spec source of truth: [`docs/design-system/16-shared-components.md`](../design-system/16-shared-components.md)*
