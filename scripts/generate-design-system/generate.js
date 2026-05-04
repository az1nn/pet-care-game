#!/usr/bin/env node

/**
 * Design System Generator
 *
 * Generates HTML, PPTX, and PDF exports of the Lilly's Box design system.
 *
 * Usage:
 *   node generate.js
 *   node generate.js --output=<dir>   (default: ../../docs/design-system/exports)
 *   node generate.js --no-pdf         (skip PDF, avoids puppeteer Chromium download)
 *
 * Output files:
 *   design-system.html   – standalone HTML reference (no external deps)
 *   design-system.pptx   – PowerPoint presentation
 *   design-system.pdf    – PDF generated from the HTML (requires puppeteer)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args       = process.argv.slice(2);
const skipPdf    = args.includes('--no-pdf');
const outputArg  = args.find(a => a.startsWith('--output='));
const OUTPUT_DIR = outputArg
  ? path.resolve(outputArg.split('=')[1])
  : path.resolve(__dirname, '../../docs/design-system/exports');

// ─── Design Tokens ────────────────────────────────────────────────────────────

const COLORS = {
  brand: [
    { name: 'brand-primary',        hex: '#9b59b6', usage: 'CTAs, headers, selection highlights' },
    { name: 'brand-primary-light',  hex: '#f5f0ff', usage: 'Screen backgrounds (Login, GameSelection)' },
    { name: 'brand-primary-surface',hex: '#f3e5f5', usage: 'Selected state background' },
    { name: 'brand-primary-border', hex: '#e0d4f0', usage: 'Unselected border accent' },
  ],
  semantic: [
    { name: 'stat-high',     hex: '#4CAF50', usage: 'Green – healthy range (value > 70)' },
    { name: 'stat-medium',   hex: '#FFA726', usage: 'Orange – needs attention (value > 40)' },
    { name: 'stat-low',      hex: '#EF5350', usage: 'Red – urgent (value > 20)' },
    { name: 'stat-critical', hex: '#C62828', usage: 'Dark red – emergency (≤ 20)' },
  ],
  feedback: [
    { name: 'success',       hex: '#27ae60', usage: 'Correct answers, multiplayer button' },
    { name: 'error',         hex: '#e74c3c', usage: 'Wrong answers, game over titles' },
    { name: 'error-surface', hex: '#ffebee', usage: 'Error container background' },
    { name: 'warning',       hex: '#F44336', usage: 'Warning text (pet stats)' },
    { name: 'info-blue',     hex: '#4285f4', usage: 'Google login, info actions' },
    { name: 'reward-gold',   hex: '#f1c40f', usage: 'Stars, new best score' },
  ],
  surface: [
    { name: 'surface-white',       hex: '#ffffff', usage: 'Cards, action containers, buttons' },
    { name: 'surface-gray-light',  hex: '#f5f5f5', usage: 'Health badge bg, cancel buttons' },
    { name: 'surface-gray-border', hex: '#e0e0e0', usage: 'Input borders, header bottom border' },
    { name: 'surface-disabled',    hex: '#cccccc', usage: 'Disabled button background' },
  ],
  text: [
    { name: 'text-primary',     hex: '#333333', usage: 'Primary text, titles' },
    { name: 'text-secondary',   hex: '#555555', usage: 'Labels' },
    { name: 'text-tertiary',    hex: '#666666', usage: 'Descriptions, subtitles' },
    { name: 'text-muted',       hex: '#888888', usage: 'Instructions, score labels' },
    { name: 'text-placeholder', hex: '#999999', usage: 'Placeholder text, dividers' },
    { name: 'text-on-dark',     hex: '#ffffff', usage: 'Text on coloured backgrounds' },
  ],
  scenes: [
    { name: 'bg-home',     hex: '#e8f5e9', usage: 'HomeScreen – soft green' },
    { name: 'bg-feed',     hex: '#fff8e1', usage: 'FeedScene – warm yellow' },
    { name: 'bg-bath',     hex: '#e3f2fd', usage: 'BathScene – light blue' },
    { name: 'bg-sleep',    hex: '#1a1a2e', usage: 'SleepScene – dark navy' },
    { name: 'bg-play',     hex: '#e1f5fe', usage: 'PlayScene – sky blue' },
    { name: 'bg-vet',      hex: '#E8F5E9', usage: 'VetScene – soft green' },
    { name: 'bg-wardrobe', hex: '#fce4ec', usage: 'WardrobeScene – light pink' },
    { name: 'bg-menu',     hex: '#fdf6ec', usage: 'MenuScreen – warm cream' },
    { name: 'bg-login',    hex: '#f5f0ff', usage: 'LoginScreen – light purple' },
    { name: 'bg-runner',   hex: '#87CEEB', usage: 'PetRunnerGame – sky blue' },
  ],
  quilt: [
    { name: 'quilt-pink',       hex: '#f4a5a5', usage: 'Quilt patch / hero card (no pet)' },
    { name: 'quilt-blue',       hex: '#a5c8e4', usage: 'Quilt patch / hero card (with pet)' },
    { name: 'quilt-green',      hex: '#a5d6a7', usage: 'Quilt patch / avatar circle' },
    { name: 'quilt-yellow',     hex: '#fff59d', usage: 'Quilt patch / language card / guest badge' },
    { name: 'quilt-purple',     hex: '#ce93d8', usage: 'Quilt patch' },
    { name: 'menu-rose',        hex: '#c0606b', usage: 'Menu title, back button, sign-out accent' },
    { name: 'menu-blue-accent', hex: '#6a9bc3', usage: 'Menu subtitle, new pet text' },
  ],
};

const TYPOGRAPHY = {
  weights: [
    { token: 'weight-normal',    value: '400', sample: 'The quick brown fox' },
    { token: 'weight-medium',    value: '500', sample: 'The quick brown fox' },
    { token: 'weight-semibold',  value: '600', sample: 'The quick brown fox' },
    { token: 'weight-bold',      value: '700', sample: 'The quick brown fox' },
    { token: 'weight-extrabold', value: '800', sample: 'The quick brown fox' },
  ],
  sizes: [
    { token: 'fs-hero',     px: 40, usage: 'Game home titles (Muito, Pet Runner)' },
    { token: 'fs-title-lg', px: 36, usage: 'Login title, Memory Match title' },
    { token: 'fs-title',    px: 32, usage: 'GameSelection title, Menu title' },
    { token: 'fs-title-md', px: 28, usage: 'CreatePet title, game-over overlay' },
    { token: 'fs-title-sm', px: 24, usage: 'Scene header titles' },
    { token: 'fs-subtitle', px: 22, usage: 'Play button text, overlay score' },
    { token: 'fs-body-lg',  px: 20, usage: 'Create button text, hero text' },
    { token: 'fs-body',     px: 18, usage: 'Subtitles, scene messages, score text' },
    { token: 'fs-body-sm',  px: 16, usage: 'Button text, back text, modal message' },
    { token: 'fs-caption',  px: 14, usage: 'Instructions, secondary info' },
    { token: 'fs-small',    px: 12, usage: 'Footer text, char count, descriptions' },
    { token: 'fs-tiny',     px: 10, usage: 'Smallest labels, sidebar text (mobile)' },
  ],
};

const SPACING = [
  { token: 'space-2',  px:  2, usage: 'Minimal gaps (marginTop between name/age)' },
  { token: 'space-4',  px:  4, usage: 'Tight spacing (compact card padding)' },
  { token: 'space-6',  px:  6, usage: 'Small gaps (between items, quilt squares)' },
  { token: 'space-8',  px:  8, usage: 'Standard small padding' },
  { token: 'space-10', px: 10, usage: 'Card padding (compact), action gap' },
  { token: 'space-12', px: 12, usage: 'Standard padding, margins' },
  { token: 'space-16', px: 16, usage: 'Page padding, button gaps' },
  { token: 'space-20', px: 20, usage: 'Section padding' },
  { token: 'space-24', px: 24, usage: 'Content padding, card inner padding' },
  { token: 'space-28', px: 28, usage: 'Large gap (before play button)' },
  { token: 'space-32', px: 32, usage: 'Section separator, before CTA' },
  { token: 'space-40', px: 40, usage: 'Page top padding' },
];

const BORDER_RADIUS = [
  { token: 'radius-sm',   px:  8, usage: 'Small elements (error container, back button)' },
  { token: 'radius-md',   px: 12, usage: 'Standard (buttons, inputs, cards)' },
  { token: 'radius-lg',   px: 16, usage: 'Large cards (profile, score, best score)' },
  { token: 'radius-xl',   px: 20, usage: 'Action containers, food/activity buttons' },
  { token: 'radius-2xl',  px: 24, usage: 'Game cards (GameSelection), overlay cards' },
  { token: 'radius-pill', px: 32, usage: 'Pill buttons (play, difficulty chips)' },
];

const SHADOWS = [
  { token: 'shadow-sm',      css: '0 1px 2px rgba(0,0,0,0.05)',   usage: 'Headers' },
  { token: 'shadow-md',      css: '0 2px 4px rgba(0,0,0,0.10)',   usage: 'Buttons, small cards' },
  { token: 'shadow-lg',      css: '0 4px 12px rgba(0,0,0,0.08)', usage: 'Game cards' },
  { token: 'shadow-xl',      css: '0 4px 8px rgba(0,0,0,0.30)',  usage: 'CTA play buttons' },
  { token: 'shadow-overlay', css: '0 8px 20px rgba(0,0,0,0.15)', usage: 'Overlays, modals' },
];

const SCREENS = [
  { name: 'LoginScreen',        bg: '#f5f0ff', emoji: '🔐', theme: 'Light purple' },
  { name: 'GameSelectionScreen',bg: '#f5f0ff', emoji: '🎮', theme: 'Light purple' },
  { name: 'MenuScreen',         bg: '#fdf6ec', emoji: '🏠', theme: 'Warm cream' },
  { name: 'CreatePetScreen',    bg: '#f5f0ff', emoji: '🐾', theme: 'Light purple' },
  { name: 'HomeScreen',         bg: '#e8f5e9', emoji: '🐱', theme: 'Soft green' },
  { name: 'FeedScene',          bg: '#fff8e1', emoji: '🍖', theme: 'Warm yellow' },
  { name: 'BathScene',          bg: '#e3f2fd', emoji: '🛁', theme: 'Light blue' },
  { name: 'SleepScene',         bg: '#1a1a2e', emoji: '💤', theme: 'Dark navy' },
  { name: 'PlayScene',          bg: '#e1f5fe', emoji: '🎯', theme: 'Sky blue' },
  { name: 'VetScene',           bg: '#E8F5E9', emoji: '🏥', theme: 'Soft green' },
  { name: 'WardrobeScene',      bg: '#fce4ec', emoji: '👗', theme: 'Light pink' },
  { name: 'MemoryMatchGame',    bg: '#f5f0ff', emoji: '🧠', theme: 'Light purple' },
  { name: 'PetRunnerGame',      bg: '#87CEEB', emoji: '🏃', theme: 'Sky blue' },
  { name: 'SimonSaysGame',      bg: '#f5f0ff', emoji: '🎵', theme: 'Purple / Red buttons' },
  { name: 'DressUpRelayGame',   bg: '#fce4ec', emoji: '👗', theme: 'Light pink' },
  { name: 'ColorMixerLabGame',  bg: '#fef3c7', emoji: '🎨', theme: 'Gradient yellow→blue' },
  { name: 'WhackAMoleGame',     bg: '#e8f5e8', emoji: '🔨', theme: 'Soft green' },
  { name: 'SlidingPuzzleGame',  bg: '#f3e5f5', emoji: '🧩', theme: 'Lavender' },
];

const COMPONENTS = [
  {
    name: 'IconButton',
    description: 'Emoji-based action button with haptic feedback and optional disabled-reason toast.',
    props: [
      ['emoji',          'string',  'Emoji character rendered at the top'],
      ['label',          'string',  'Text label below the emoji'],
      ['onPress',        '() => void', 'Press handler'],
      ['disabled',       'boolean', 'Reduces opacity to 0.5'],
      ['disabledReason', 'string',  'Shows a toast when tapped while disabled'],
      ['soundEnabled',   'boolean', 'Plays button_click sound (default: true)'],
    ],
    specs: [
      'Background: #ffffff  •  Shadow: md  •  Border-radius: 12px',
      'Size (mobile → desktop): 72 / 80 / 90 / 100 px wide',
      'Padding (mobile → desktop): 10 / 12 / 14 / 16 px',
      'Emoji font (mobile → desktop): 26 / 28 / 32 / 36 px',
      'Label font (mobile → desktop): 10 / 11 / 12 / 14 px  •  weight 600  •  #333',
      'activeOpacity: 0.7 when enabled  •  Haptic: light',
    ],
  },
  {
    name: 'ScreenHeader',
    description: 'Reusable top header bar with optional back button and centered title.',
    props: [
      ['title',           'string',               'Centered header title'],
      ['onBackPress',     '() => void',            'Shows back button when provided'],
      ['BackButtonIcon',  'React.ComponentType',   'Icon rendered left of "Back" text'],
    ],
    specs: [
      'Background: #ffffff  •  Shadow: sm  •  Border-bottom: 1px solid #e0e0e0',
      'Padding: horizontal 16px, vertical 12px',
      'Title: 18px bold #333, centered',
      'Back button: "← Back", 15px weight 500, color #007AFF, border-radius 8px',
    ],
  },
  {
    name: 'ConfirmModal',
    description: 'Full-screen overlay confirmation dialog.',
    props: [
      ['visible',       'boolean',                  'Controls visibility'],
      ['title',         'string',                   'Modal heading'],
      ['message',       'string',                   'Body text'],
      ['confirmText',   'string',                   'Confirm label (default: "Confirmar")'],
      ['cancelText',    'string',                   'Cancel label (default: "Cancelar")'],
      ['onConfirm',     '() => void',               'Called on confirm tap'],
      ['onCancel',      '() => void',               'Called on cancel or backdrop tap'],
      ['confirmStyle',  '"default" | "destructive"','Destructive → red confirm button'],
    ],
    specs: [
      'Overlay: rgba(0,0,0,0.5)  •  Padding: 20px  •  Layout: centered',
      'Card: bg #fff, border-radius 16px, padding 24px, max-width 400px, shadow-overlay',
      'Title: 20px bold #333, centered  •  Message: 16px #666, lineHeight 22px',
      'Cancel: bg #f5f5f5, border 1px #ddd, border-radius 12px, padding 14×20px, text 16px 600 #666',
      'Confirm: bg #9b59b6 (or #F44336 destructive), border-radius 12px, text 16px 600 #fff',
    ],
  },
  {
    name: 'StatusCard',
    description: 'Compact three-column widget showing pet name, age, money and colour-coded stat bars.',
    props: [
      ['pet',     'Pet',    'Full pet data object'],
      ['petName', 'string', 'Pre-formatted name with species emoji'],
      ['petAge',  'string', 'Pre-formatted age string'],
      ['compact', 'boolean','Reduces spacing for action screens (default: false)'],
    ],
    specs: [
      'Layout: 30% left (name / age / 💰) | 40% centre (spacer) | 30% right (stat bars)',
      'Pet name: bold #333, 14-15px  •  Pet age: #666, 11-12px',
      'Money badge: bg #FFD700, border-radius 5px, bold #333, 12px',
      'Stat bars: green #4CAF50 (>70) / orange #FFA726 (>40) / red #EF5350 (>20) / dark-red #C62828',
      'Stats rendered via EnhancedStatusBar in two-column layout mode',
    ],
  },
  {
    name: 'EmojiIcon',
    description: 'Consistent emoji rendering across all platforms.',
    props: [
      ['emoji', 'string',    'Emoji character'],
      ['size',  'number',    'Font size in px'],
      ['style', 'ViewStyle', 'Extra container styling'],
      ['label', 'string',    'Accessibility label'],
    ],
    specs: [
      'Wraps emoji in a Text node with platform-safe rendering',
      'Used wherever a standalone emoji needs accessibility metadata',
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a CSS-safe hex (no #) for pptxgenjs. */
const strip = hex => hex.replace('#', '');

/** Is the hex colour "dark" (needs white text)? */
const isDark = hex => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) < 160;
};

// ─── HTML Generator ───────────────────────────────────────────────────────────

function buildHtml() {
  const colorSection = (label, items) => `
    <h3>${label}</h3>
    <div class="swatch-grid">
      ${items.map(c => `
        <div class="swatch-card">
          <div class="swatch-box ${isDark(c.hex) ? 'dark' : ''}"
               style="background:${c.hex}">
            <span class="swatch-hex">${c.hex}</span>
          </div>
          <div class="swatch-meta">
            <code>${c.name}</code>
            <p>${c.usage}</p>
          </div>
        </div>`).join('')}
    </div>`;

  const typeSizeRows = TYPOGRAPHY.sizes.map(t => `
    <tr>
      <td><code>${t.token}</code></td>
      <td class="num">${t.px}px</td>
      <td style="font-size:${t.px}px;line-height:1.2">Aa</td>
      <td>${t.usage}</td>
    </tr>`).join('');

  const typeWeightRows = TYPOGRAPHY.weights.map(w => `
    <tr>
      <td><code>${w.token}</code></td>
      <td class="num">${w.value}</td>
      <td style="font-weight:${w.value}">${w.sample}</td>
    </tr>`).join('');

  const spacingRows = SPACING.map(s => `
    <tr>
      <td><code>${s.token}</code></td>
      <td class="num">${s.px}px</td>
      <td><div class="spacing-bar" style="width:${Math.min(s.px * 6, 240)}px"></div></td>
      <td>${s.usage}</td>
    </tr>`).join('');

  const radiusCards = BORDER_RADIUS.map(r => `
    <div class="radius-card">
      <div class="radius-demo" style="border-radius:${r.px}px"></div>
      <code>${r.token}</code>
      <span>${r.px}px</span>
      <p>${r.usage}</p>
    </div>`).join('');

  const shadowCards = SHADOWS.map(s => `
    <div class="shadow-card">
      <div class="shadow-demo" style="box-shadow:${s.css}"></div>
      <code>${s.token}</code>
      <p>${s.usage}</p>
    </div>`).join('');

  const componentSections = COMPONENTS.map(c => `
    <div class="component-section">
      <h3>${c.name}</h3>
      <p class="comp-desc">${c.description}</p>
      <div class="comp-grid">
        <div>
          <h4>Props</h4>
          <table class="props-table">
            <thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
            <tbody>${c.props.map(([p, t, d]) => `
              <tr><td><code>${p}</code></td><td><em>${t}</em></td><td>${d}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div>
          <h4>Specs</h4>
          <ul>${c.specs.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`).join('');

  const screenCards = SCREENS.map(s => `
    <div class="screen-card ${isDark(s.bg) ? 'dark-bg' : ''}"
         style="background:${s.bg}">
      <div class="screen-emoji">${s.emoji}</div>
      <div class="screen-name">${s.name}</div>
      <code>${s.bg}</code>
      <div class="screen-theme">${s.theme}</div>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Lilly's Box – Design System</title>
  <style>
    /* ── Reset & base ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #333;
      background: #fff;
      line-height: 1.6;
    }
    code { font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 0.85em;
           background: #f5f5f5; padding: 2px 5px; border-radius: 4px; }
    h1 { font-size: 2.8rem; font-weight: 800; color: #9b59b6; }
    h2 { font-size: 1.8rem; font-weight: 700; color: #333; margin: 2rem 0 1rem;
         border-bottom: 2px solid #9b59b6; padding-bottom: 0.4rem; }
    h3 { font-size: 1.2rem; font-weight: 600; color: #555; margin: 1.4rem 0 0.6rem; }
    h4 { font-size: 1rem; font-weight: 600; margin: 0.8rem 0 0.4rem; }
    p  { margin: 0.4rem 0; color: #555; }
    ul { padding-left: 1.2rem; color: #555; }
    li { margin: 0.25rem 0; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin: 0.5rem 0; }
    th { background: #f5f0ff; color: #9b59b6; padding: 8px 10px; text-align: left;
         font-weight: 600; }
    td { padding: 7px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
    td.num { font-variant-numeric: tabular-nums; font-weight: 600; color: #9b59b6; }
    tr:hover td { background: #fafafa; }

    /* ── Layout ── */
    .page-wrap { max-width: 1100px; margin: 0 auto; padding: 40px 32px; }

    /* ── Cover ── */
    .cover {
      min-height: 100vh; display: flex; flex-direction: column;
      justify-content: center; align-items: flex-start;
      background: linear-gradient(135deg, #f5f0ff 0%, #fce4ec 100%);
      padding: 60px; page-break-after: always;
    }
    .cover-emoji  { font-size: 100px; margin-bottom: 24px; }
    .cover h1     { font-size: 4rem; margin-bottom: 8px; }
    .cover-sub    { font-size: 1.4rem; color: #666; margin-bottom: 32px; }
    .cover-meta   { font-size: 0.95rem; color: #888; }
    .cover-badge  {
      display: inline-block; background: #9b59b6; color: #fff;
      padding: 6px 18px; border-radius: 20px; font-size: 0.9rem;
      font-weight: 600; margin-top: 16px;
    }

    /* ── Colour swatches ── */
    .swatch-grid  { display: flex; flex-wrap: wrap; gap: 12px; margin: 12px 0; }
    .swatch-card  { width: 160px; background: #fafafa; border-radius: 10px;
                    overflow: hidden; border: 1px solid #eee; }
    .swatch-box   { height: 72px; display: flex; align-items: flex-end;
                    justify-content: flex-start; padding: 6px 8px; }
    .swatch-box.dark .swatch-hex { color: #fff; }
    .swatch-hex   { font-size: 0.72rem; font-family: monospace; color: rgba(0,0,0,0.6); }
    .swatch-meta  { padding: 8px 10px; }
    .swatch-meta code { display: block; margin-bottom: 4px; }
    .swatch-meta p    { font-size: 0.78rem; color: #777; line-height: 1.4; margin: 0; }

    /* ── Spacing bars ── */
    .spacing-bar { height: 16px; background: #9b59b6; border-radius: 4px; min-width: 4px; }

    /* ── Border radius ── */
    .radius-grid  { display: flex; flex-wrap: wrap; gap: 16px; margin: 12px 0; }
    .radius-card  { width: 160px; padding: 12px; background: #fafafa;
                    border: 1px solid #eee; border-radius: 10px; text-align: center; }
    .radius-demo  { width: 80px; height: 50px; background: #9b59b6;
                    margin: 0 auto 8px; opacity: 0.7; }
    .radius-card span { display: block; font-size: 0.85rem; font-weight: 600;
                        color: #9b59b6; margin: 2px 0; }
    .radius-card p    { font-size: 0.75rem; color: #777; margin: 4px 0 0; }

    /* ── Shadows ── */
    .shadow-grid  { display: flex; flex-wrap: wrap; gap: 20px; margin: 12px 0; }
    .shadow-card  { width: 180px; padding: 12px; background: #fff;
                    border: 1px solid #f5f5f5; border-radius: 10px; text-align: center; }
    .shadow-demo  { width: 100%; height: 60px; background: #fff; border-radius: 8px;
                    margin-bottom: 10px; }
    .shadow-card p { font-size: 0.78rem; color: #777; margin: 6px 0 0; }

    /* ── Components ── */
    .component-section { margin: 2rem 0; padding: 20px; background: #fafafa;
                         border-radius: 12px; border: 1px solid #eee; }
    .component-section h3 { margin-top: 0; color: #9b59b6; font-size: 1.4rem; }
    .comp-desc  { font-size: 0.95rem; color: #555; margin-bottom: 12px; }
    .comp-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .props-table th { font-size: 0.82rem; }
    .props-table td { font-size: 0.82rem; }
    .props-table td em { color: #9b59b6; font-style: normal; }

    /* ── Screen themes ── */
    .screen-grid  { display: flex; flex-wrap: wrap; gap: 12px; margin: 12px 0; }
    .screen-card  { width: 150px; padding: 16px 12px; border-radius: 12px;
                    text-align: center; border: 1px solid rgba(0,0,0,0.08); }
    .screen-card.dark-bg .screen-name,
    .screen-card.dark-bg .screen-theme,
    .screen-card.dark-bg code { color: #ddd; }
    .screen-emoji { font-size: 28px; margin-bottom: 6px; }
    .screen-name  { font-size: 0.75rem; font-weight: 700; color: #333; margin-bottom: 2px; }
    .screen-theme { font-size: 0.72rem; color: #666; margin-top: 4px; }
    .screen-card code { font-size: 0.68rem; display: block; }

    /* ── Section break for print/PDF ── */
    .section { page-break-before: always; padding-top: 20px; }

    /* ── Print overrides ── */
    @media print {
      .cover { min-height: 100vh; }
      body   { font-size: 11pt; }
      h2     { font-size: 16pt; }
      h3     { font-size: 12pt; }
    }
  </style>
</head>
<body>

<!-- ── COVER ─────────────────────────────────────────────────────────────── -->
<div class="cover">
  <div class="cover-emoji">🐾</div>
  <h1>Lilly&rsquo;s Box</h1>
  <p class="cover-sub">Design System Reference</p>
  <p class="cover-meta">
    React Native 0.77 &nbsp;·&nbsp; Expo SDK 55 &nbsp;·&nbsp;
    TypeScript (strict) &nbsp;·&nbsp; React Native Reanimated 4
  </p>
  <div class="cover-badge">Version 1.0</div>
</div>

<div class="page-wrap">

<!-- ── COLOURS ───────────────────────────────────────────────────────────── -->
<section class="section" id="colors">
  <h2>🎨 Color Palette</h2>
  ${colorSection('Brand Colors',    COLORS.brand)}
  ${colorSection('Semantic – Stat Levels', COLORS.semantic)}
  ${colorSection('Feedback',         COLORS.feedback)}
  ${colorSection('Surface',          COLORS.surface)}
  ${colorSection('Text',             COLORS.text)}
  ${colorSection('Scene Backgrounds',COLORS.scenes)}
  ${colorSection('Menu Quilt',       COLORS.quilt)}
</section>

<!-- ── TYPOGRAPHY ────────────────────────────────────────────────────────── -->
<section class="section" id="typography">
  <h2>📝 Typography</h2>

  <h3>Font Sizes</h3>
  <table>
    <thead><tr><th>Token</th><th>Size</th><th>Sample</th><th>Usage</th></tr></thead>
    <tbody>${typeSizeRows}</tbody>
  </table>

  <h3>Font Weights</h3>
  <table>
    <thead><tr><th>Token</th><th>Value</th><th>Sample</th></tr></thead>
    <tbody>${typeWeightRows}</tbody>
  </table>

  <h3>Responsive Scaling</h3>
  <p>All font sizes pass through <code>fs()</code> from <code>useResponsive()</code>,
     scaled relative to iPhone 12 Pro (390 px) with a range of <strong>0.85× – 1.3×</strong>.</p>
</section>

<!-- ── SPACING ───────────────────────────────────────────────────────────── -->
<section class="section" id="spacing">
  <h2>📐 Spacing</h2>
  <p>Applied via <code>spacing()</code> from <code>useResponsive()</code>.
     Formula: <code>size × min(scale, 1.15)</code></p>
  <table>
    <thead><tr><th>Token</th><th>Value</th><th>Visual</th><th>Usage</th></tr></thead>
    <tbody>${spacingRows}</tbody>
  </table>
</section>

<!-- ── BORDER RADIUS ─────────────────────────────────────────────────────── -->
<section class="section" id="border-radius">
  <h2>⬜ Border Radius</h2>
  <div class="radius-grid">${radiusCards}</div>
</section>

<!-- ── SHADOWS ───────────────────────────────────────────────────────────── -->
<section class="section" id="shadows">
  <h2>🌑 Shadows</h2>
  <div class="shadow-grid">${shadowCards}</div>
  <table style="margin-top:16px">
    <thead><tr><th>Token</th><th>CSS / RN Config</th><th>Usage</th></tr></thead>
    <tbody>${SHADOWS.map(s => `
      <tr>
        <td><code>${s.token}</code></td>
        <td><code>${s.css}</code></td>
        <td>${s.usage}</td>
      </tr>`).join('')}
    </tbody>
  </table>
</section>

<!-- ── COMPONENTS ────────────────────────────────────────────────────────── -->
<section class="section" id="components">
  <h2>🧩 Components</h2>
  ${componentSections}
</section>

<!-- ── SCREEN THEMES ─────────────────────────────────────────────────────── -->
<section class="section" id="screens">
  <h2>📱 Screen Color Themes</h2>
  <p>Each screen/scene uses a distinct background to aid context-switching.
     Background colours are combined with the shared component library.</p>
  <div class="screen-grid">${screenCards}</div>

  <h3>Three-Zone Layout Pattern (Pet Care Screens)</h3>
  <ol>
    <li><strong>Top</strong> – StatusCard (pet info + stat bars)</li>
    <li><strong>Middle</strong> – PetRenderer (animated pet, <code>flex: 1</code>)</li>
    <li><strong>Bottom</strong> – Action area (white bg, rounded top corners)</li>
  </ol>

  <h3>Mini-Game Home Pattern</h3>
  <ul>
    <li>Centred layout with large emoji icon (72 px)</li>
    <li>Hero title (36-40 px, weight 800)</li>
    <li>Best score card (white, rounded, shadowed)</li>
    <li>Pill-shaped Play button (border-radius 32 px)</li>
    <li>Instructions text at bottom</li>
  </ul>
</section>

<!-- ── BREAKPOINTS ───────────────────────────────────────────────────────── -->
<section id="breakpoints">
  <h2>📏 Breakpoints &amp; Device Types</h2>
  <table>
    <thead><tr><th>Breakpoint</th><th>Width</th><th>deviceType</th></tr></thead>
    <tbody>
      <tr><td>mobileSmall</td><td>375 px</td><td>—</td></tr>
      <tr><td>mobile</td>     <td>&lt; 428 px</td><td><code>mobile</code></td></tr>
      <tr><td>mobileLarge</td><td>428–768 px</td><td><code>mobileLarge</code></td></tr>
      <tr><td>tablet</td>     <td>768–1024 px</td><td><code>tablet</code></td></tr>
      <tr><td>desktop</td>    <td>≥ 1280 px</td><td><code>desktop</code></td></tr>
    </tbody>
  </table>
</section>

<!-- ── ANIMATION TOKENS ──────────────────────────────────────────────────── -->
<section id="animations">
  <h2>✨ Animation Tokens</h2>
  <h3>Durations</h3>
  <table>
    <thead><tr><th>Token</th><th>Value</th><th>Usage</th></tr></thead>
    <tbody>
      <tr><td><code>duration-short</code></td>     <td>1000 ms</td><td>Button feedback</td></tr>
      <tr><td><code>duration-medium</code></td>    <td>1500 ms</td><td>Feeding, playing</td></tr>
      <tr><td><code>duration-long</code></td>      <td>2000 ms</td><td>Bathing, complex transitions</td></tr>
      <tr><td><code>duration-extra-long</code></td><td>3000 ms</td><td>Extended animations</td></tr>
    </tbody>
  </table>
  <h3>Spring Configs (React Native Reanimated)</h3>
  <table>
    <thead><tr><th>Token</th><th>Damping</th><th>Stiffness</th><th>Usage</th></tr></thead>
    <tbody>
      <tr><td><code>spring-default</code></td><td>15</td><td>150</td><td>General animations</td></tr>
      <tr><td><code>spring-bouncy</code></td> <td>10</td><td>120</td><td>Playful animations</td></tr>
      <tr><td><code>spring-stiff</code></td>  <td>20</td><td>200</td><td>Quick, precise movements</td></tr>
      <tr><td><code>spring-happy</code></td>  <td>8</td> <td>100</td><td>Happy bounce (amplitude −15)</td></tr>
    </tbody>
  </table>
</section>

</div><!-- /page-wrap -->
</body>
</html>`;
}

// ─── PPTX Generator ───────────────────────────────────────────────────────────

async function buildPptx(outputPath) {
  const PptxGenJS = require('pptxgenjs');
  const pptx = new PptxGenJS();

  // Presentation-wide defaults (16:9)
  pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
  pptx.layout = 'WIDE';
  pptx.author  = "Lilly's Box";
  pptx.company = 'CPX Labs';
  pptx.subject = 'Design System';
  pptx.title   = "Lilly's Box Design System";

  const PURPLE = '9b59b6';
  const LIGHT  = 'f5f0ff';
  const WHITE  = 'ffffff';
  const DARK   = '333333';
  const GREY   = '666666';

  // Helper: add a slide with a standard header bar
  function titleSlide(title, subtitle = '') {
    const s = pptx.addSlide();
    // Purple bar
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 1.1,
      fill: { color: PURPLE }, line: { color: PURPLE } });
    s.addText(title, { x: 0.4, y: 0.12, w: 12.5, h: 0.8,
      fontSize: 28, bold: true, color: WHITE });
    if (subtitle) {
      s.addText(subtitle, { x: 0.4, y: 1.25, w: 12.5, h: 0.4,
        fontSize: 14, color: GREY });
    }
    return s;
  }

  // ── Slide 1: Cover ──────────────────────────────────────────────────────────
  {
    const s = pptx.addSlide();
    s.background = { color: LIGHT };
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 5.5, w: 13.33, h: 2,
      fill: { color: PURPLE }, line: { color: PURPLE } });
    s.addText("🐾", { x: 0.5, y: 0.5, w: 3, h: 3, fontSize: 120, align: 'center' });
    s.addText("Lilly's Box", {
      x: 3.5, y: 1.2, w: 9, h: 1.2,
      fontSize: 52, bold: true, color: PURPLE,
    });
    s.addText('Design System Reference', {
      x: 3.5, y: 2.5, w: 9, h: 0.6,
      fontSize: 22, color: GREY,
    });
    s.addText('React Native 0.77  ·  Expo SDK 55  ·  TypeScript (strict)', {
      x: 3.5, y: 3.2, w: 9, h: 0.4,
      fontSize: 13, color: '999999',
    });
    s.addText('Design System  ·  Version 1.0', {
      x: 0.4, y: 5.7, w: 12.5, h: 0.5,
      fontSize: 14, color: WHITE,
    });
  }

  // ── Slide 2: Table of Contents ──────────────────────────────────────────────
  {
    const s = titleSlide('Table of Contents');
    const toc = [
      '01  Color Palette',
      '02  Typography',
      '03  Spacing',
      '04  Border Radius & Shadows',
      '05  Components',
      '06  Screen Color Themes',
      '07  Breakpoints & Animations',
    ];
    toc.forEach((item, i) => {
      s.addText(item, {
        x: 0.6, y: 1.7 + i * 0.65, w: 12, h: 0.55,
        fontSize: 17, color: i % 2 === 0 ? DARK : GREY,
        bullet: false,
      });
    });
  }

  // ── Helper: colour swatch grid on a slide ───────────────────────────────────
  function addSwatchGrid(slide, items, startX, startY, cols = 6) {
    const W = 1.9, H = 0.8, GAP = 0.1;
    items.forEach((c, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (W + GAP);
      const y = startY + row * (H + 0.55 + GAP);
      const dark = isDark(c.hex);
      // Colour box
      slide.addShape(pptx.ShapeType.rect, {
        x, y, w: W, h: H,
        fill: { color: strip(c.hex) },
        line: { color: 'e0e0e0', width: 0.5 },
        rounding: true,
      });
      // Hex label on box
      slide.addText(c.hex, {
        x, y: y + H - 0.22, w: W, h: 0.22,
        fontSize: 7.5, align: 'center',
        color: dark ? 'eeeeee' : '555555',
      });
      // Token name below box
      slide.addText(c.name, {
        x, y: y + H + 0.04, w: W, h: 0.3,
        fontSize: 8, bold: true, align: 'center', color: DARK,
      });
      // Usage below token name
      slide.addText(c.usage, {
        x, y: y + H + 0.33, w: W, h: 0.25,
        fontSize: 6.5, align: 'center', color: GREY,
        // wrap text
      });
    });
  }

  // ── Slides 3-9: Colours ─────────────────────────────────────────────────────
  const colorGroups = [
    { label: 'Brand Colors',              items: COLORS.brand    },
    { label: 'Semantic – Stat Levels',    items: COLORS.semantic },
    { label: 'Feedback Colors',           items: COLORS.feedback },
    { label: 'Surface Colors',            items: COLORS.surface  },
    { label: 'Text Colors',               items: COLORS.text     },
    { label: 'Scene Background Colors',   items: COLORS.scenes   },
    { label: 'Menu Quilt Colors',         items: COLORS.quilt    },
  ];
  colorGroups.forEach(({ label, items }) => {
    const s = titleSlide(label, 'Color Palette');
    addSwatchGrid(s, items, 0.4, 1.5, 5);
  });

  // ── Slide: Typography – Sizes ───────────────────────────────────────────────
  {
    const s = titleSlide('Typography – Font Sizes');
    const rows = TYPOGRAPHY.sizes.map(t => [
      { text: t.token, options: { bold: true, color: PURPLE, fontSize: 10 } },
      { text: `${t.px}px`, options: { bold: true, color: DARK, fontSize: 10 } },
      { text: 'Aa', options: { fontSize: Math.min(t.px * 0.75, 22), color: DARK } },
      { text: t.usage, options: { fontSize: 9, color: GREY } },
    ]);
    s.addTable(
      [
        [
          { text: 'Token',   options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Size',    options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Sample',  options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Usage',   options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
        ],
        ...rows,
      ],
      { x: 0.4, y: 1.4, w: 12.5, colW: [2.8, 1, 1.5, 7.2],
        border: { type: 'solid', color: 'e0e0e0', pt: 0.5 },
        fontSize: 10 }
    );
  }

  // ── Slide: Typography – Weights ─────────────────────────────────────────────
  {
    const s = titleSlide('Typography – Font Weights');
    TYPOGRAPHY.weights.forEach((w, i) => {
      const y = 1.5 + i * 1.0;
      s.addText(`${w.token} (${w.value})`, {
        x: 0.4, y, w: 3.5, h: 0.5,
        fontSize: 11, color: GREY,
      });
      s.addText(w.sample, {
        x: 4.1, y, w: 8.5, h: 0.8,
        fontSize: 22, bold: w.value === '700' || w.value === '800',
        color: DARK,
      });
    });
  }

  // ── Slide: Spacing ──────────────────────────────────────────────────────────
  {
    const s = titleSlide('Spacing Scale', 'spacing() from useResponsive()');
    const rows = SPACING.map(sp => [
      { text: sp.token, options: { bold: true, color: PURPLE, fontSize: 10 } },
      { text: `${sp.px}px`, options: { bold: true, fontSize: 10 } },
      { text: sp.usage, options: { fontSize: 9, color: GREY } },
    ]);
    s.addTable(
      [
        [
          { text: 'Token', options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Value', options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Usage', options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
        ],
        ...rows,
      ],
      { x: 0.4, y: 1.4, w: 12.5, colW: [2.8, 1.2, 8.5],
        border: { type: 'solid', color: 'e0e0e0', pt: 0.5 },
        fontSize: 10 }
    );
  }

  // ── Slide: Border Radius ────────────────────────────────────────────────────
  {
    const s = titleSlide('Border Radius');
    BORDER_RADIUS.forEach((r, i) => {
      const x = 0.4 + i * 2.15;
      // Demo box
      s.addShape(pptx.ShapeType.rect, {
        x, y: 1.5, w: 1.8, h: 1.1,
        fill: { color: PURPLE }, line: { color: PURPLE },
        rounding: true,
      });
      s.addText(r.token, {
        x, y: 2.7, w: 1.8, h: 0.35,
        fontSize: 9, bold: true, align: 'center', color: DARK,
      });
      s.addText(`${r.px}px`, {
        x, y: 3.05, w: 1.8, h: 0.3,
        fontSize: 10, bold: true, align: 'center', color: PURPLE,
      });
      s.addText(r.usage, {
        x, y: 3.4, w: 1.8, h: 0.5,
        fontSize: 8, align: 'center', color: GREY,
      });
    });
  }

  // ── Slide: Shadows ──────────────────────────────────────────────────────────
  {
    const s = titleSlide('Shadows');
    const rows = SHADOWS.map(sh => [
      { text: sh.token, options: { bold: true, color: PURPLE, fontSize: 11 } },
      { text: sh.css,   options: { fontSize: 10, color: DARK  } },
      { text: sh.usage, options: { fontSize: 10, color: GREY  } },
    ]);
    s.addTable(
      [
        [
          { text: 'Token', options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'CSS Value', options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Usage', options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
        ],
        ...rows,
      ],
      { x: 0.4, y: 1.5, w: 12.5, colW: [2.5, 6.0, 4.0],
        border: { type: 'solid', color: 'e0e0e0', pt: 0.5 },
        fontSize: 11 }
    );
  }

  // ── Slides: Components ──────────────────────────────────────────────────────
  COMPONENTS.forEach(comp => {
    const s = titleSlide(comp.name, 'Shared Component');
    s.addText(comp.description, {
      x: 0.4, y: 1.4, w: 12.5, h: 0.4, fontSize: 13, color: GREY,
    });
    // Props table
    s.addText('Props', {
      x: 0.4, y: 1.9, w: 6, h: 0.3, fontSize: 12, bold: true, color: PURPLE,
    });
    const propRows = comp.props.map(([p, t, d]) => [
      { text: p, options: { bold: true, color: PURPLE, fontSize: 9 } },
      { text: t, options: { italic: true, color: DARK,  fontSize: 9 } },
      { text: d, options: { color: GREY, fontSize: 9 } },
    ]);
    s.addTable(
      [
        [
          { text: 'Prop', options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Type', options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Description', options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
        ],
        ...propRows,
      ],
      { x: 0.4, y: 2.2, w: 6.1, colW: [1.6, 1.6, 2.9],
        border: { type: 'solid', color: 'e0e0e0', pt: 0.5 },
        fontSize: 9 }
    );
    // Specs
    s.addText('Specs', {
      x: 6.8, y: 1.9, w: 6, h: 0.3, fontSize: 12, bold: true, color: PURPLE,
    });
    comp.specs.forEach((spec, i) => {
      s.addText(`• ${spec}`, {
        x: 6.8, y: 2.25 + i * 0.65, w: 6.1, h: 0.6,
        fontSize: 10, color: DARK, valign: 'top',
      });
    });
  });

  // ── Slide: Screen Color Themes ──────────────────────────────────────────────
  {
    const s = titleSlide('Screen Color Themes');
    const cols = 9;
    SCREENS.forEach((sc, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 0.35 + col * 1.4;
      const y = 1.5 + row * 2.0;
      const dark = isDark(sc.bg);
      s.addShape(pptx.ShapeType.rect, {
        x, y, w: 1.25, h: 1.25,
        fill: { color: strip(sc.bg) },
        line: { color: 'e0e0e0', width: 0.5 },
        rounding: true,
      });
      s.addText(sc.emoji, {
        x, y: y + 0.15, w: 1.25, h: 0.55, fontSize: 24, align: 'center',
      });
      s.addText(sc.name.replace('Screen', '').replace('Scene', '').replace('Game', ''), {
        x, y: y + 1.28, w: 1.25, h: 0.28,
        fontSize: 7.5, align: 'center', bold: true, color: DARK,
      });
      s.addText(sc.bg, {
        x, y: y + 1.55, w: 1.25, h: 0.2,
        fontSize: 6.5, align: 'center', color: GREY,
      });
    });
  }

  // ── Slide: Breakpoints & Animations ────────────────────────────────────────
  {
    const s = titleSlide('Breakpoints & Animations');
    // Breakpoints table
    s.addText('Device Breakpoints', {
      x: 0.4, y: 1.4, w: 5.5, h: 0.3, fontSize: 12, bold: true, color: PURPLE,
    });
    s.addTable(
      [
        [
          { text: 'Width',       options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'deviceType',  options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
        ],
        [{ text: '< 428 px' }, { text: 'mobile' }],
        [{ text: '428–768 px' },{ text: 'mobileLarge' }],
        [{ text: '768–1024 px'},{ text: 'tablet' }],
        [{ text: '≥ 1280 px' }, { text: 'desktop' }],
      ],
      { x: 0.4, y: 1.75, w: 5.5, colW: [2.8, 2.7],
        border: { type: 'solid', color: 'e0e0e0', pt: 0.5 },
        fontSize: 11 }
    );
    // Animation durations
    s.addText('Animation Durations', {
      x: 7.0, y: 1.4, w: 5.9, h: 0.3, fontSize: 12, bold: true, color: PURPLE,
    });
    const durRows = [
      ['duration-short',      '1000 ms', 'Button feedback'],
      ['duration-medium',     '1500 ms', 'Feeding, playing'],
      ['duration-long',       '2000 ms', 'Bathing, transitions'],
      ['duration-extra-long', '3000 ms', 'Extended animations'],
    ].map(r => r.map(t => ({ text: t })));
    s.addTable(
      [
        [
          { text: 'Token',  options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Value',  options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Usage',  options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
        ],
        ...durRows,
      ],
      { x: 7.0, y: 1.75, w: 5.9, colW: [2.8, 1.2, 1.9],
        border: { type: 'solid', color: 'e0e0e0', pt: 0.5 },
        fontSize: 10 }
    );
    // Spring configs
    s.addText('Spring Configurations (React Native Reanimated)', {
      x: 0.4, y: 4.4, w: 12.5, h: 0.3, fontSize: 12, bold: true, color: PURPLE,
    });
    s.addTable(
      [
        [
          { text: 'Token',     options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Damping',   options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Stiffness', options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
          { text: 'Usage',     options: { bold: true, color: WHITE, fill: { color: PURPLE } } },
        ],
        [{ text: 'spring-default' }, { text: '15' }, { text: '150' }, { text: 'General animations' }],
        [{ text: 'spring-bouncy'  }, { text: '10' }, { text: '120' }, { text: 'Playful animations' }],
        [{ text: 'spring-stiff'   }, { text: '20' }, { text: '200' }, { text: 'Quick, precise movements' }],
        [{ text: 'spring-happy'   }, { text: '8'  }, { text: '100' }, { text: 'Happy bounce (amplitude −15)' }],
      ],
      { x: 0.4, y: 4.75, w: 12.5, colW: [3.2, 1.2, 1.5, 6.6],
        border: { type: 'solid', color: 'e0e0e0', pt: 0.5 },
        fontSize: 10 }
    );
  }

  await pptx.writeFile({ fileName: outputPath });
}

// ─── PDF Generator ────────────────────────────────────────────────────────────

async function buildPdf(htmlPath, pdfPath) {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    const fileUrl = `file://${htmlPath}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
    });
  } finally {
    await browser.close();
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const htmlPath = path.join(OUTPUT_DIR, 'design-system.html');
  const pptxPath = path.join(OUTPUT_DIR, 'design-system.pptx');
  const pdfPath  = path.join(OUTPUT_DIR, 'design-system.pdf');

  // 1. HTML
  console.log('📝  Generating HTML…');
  fs.writeFileSync(htmlPath, buildHtml(), 'utf8');
  console.log(`    → ${htmlPath}`);

  // 2. PPTX
  console.log('📊  Generating PPTX…');
  await buildPptx(pptxPath);
  console.log(`    → ${pptxPath}`);

  // 3. PDF
  if (skipPdf) {
    console.log('⏭️   Skipping PDF (--no-pdf flag).');
  } else {
    console.log('📄  Generating PDF via Puppeteer…');
    try {
      await buildPdf(htmlPath, pdfPath);
      console.log(`    → ${pdfPath}`);
    } catch (err) {
      console.warn(`⚠️   PDF generation failed: ${err.message}`);
      console.warn('    Run with --no-pdf to skip, or ensure Chromium is available.');
    }
  }

  console.log('\n✅  Done!');
}

main().catch(err => {
  console.error('❌  Export failed:', err);
  process.exit(1);
});
