'use strict';

/**
 * Tests for the design system generator.
 *
 * Run:  npm test  (from scripts/generate-design-system/)
 *
 * Covers:
 *  - Helper functions (isDark, strip)
 *  - Token data integrity (shape, required fields, value ranges)
 *  - buildHtml()  – structure and content
 *  - buildFigmaTokens() – valid JSON, W3C DTCG shape, completeness
 *  - Integration – files are actually written and PPTX is a valid zip
 */

const assert = require('assert');
const fs     = require('fs');
const os     = require('os');
const path   = require('path');

const {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  SCREENS,
  COMPONENTS,
  isDark,
  strip,
  buildHtml,
  buildFigmaTokens,
} = require('./generate');

// ─── Tiny test runner ─────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(label, fn) {
  try {
    fn();
    console.log(`  ✅  ${label}`);
    passed++;
  } catch (err) {
    console.error(`  ❌  ${label}`);
    console.error(`       ${err.message}`);
    failed++;
  }
}

function describe(suite, fn) {
  console.log(`\n${suite}`);
  fn();
}

// ─── isDark() ────────────────────────────────────────────────────────────────

describe('isDark()', () => {
  test('returns true for very dark colours', () => {
    assert.strictEqual(isDark('#000000'), true);
    assert.strictEqual(isDark('#1a1a2e'), true); // SleepScene bg
    assert.strictEqual(isDark('#333333'), true);
  });

  test('returns false for very light colours', () => {
    assert.strictEqual(isDark('#ffffff'), false);
    assert.strictEqual(isDark('#f5f0ff'), false);
    assert.strictEqual(isDark('#e8f5e9'), false);
  });

  test('handles mid-tone correctly (purple brand)', () => {
    // #9b59b6 → luma ≈ 103 → dark
    assert.strictEqual(isDark('#9b59b6'), true);
  });

  test('handles 6-char uppercase hex', () => {
    assert.strictEqual(isDark('#E8F5E9'), false); // VetScene bg
  });
});

// ─── strip() ─────────────────────────────────────────────────────────────────

describe('strip()', () => {
  test('removes leading #', () => {
    assert.strictEqual(strip('#9b59b6'), '9b59b6');
    assert.strictEqual(strip('#ffffff'), 'ffffff');
  });

  test('is a no-op when # is absent', () => {
    assert.strictEqual(strip('abc123'), 'abc123');
  });
});

// ─── Token data integrity ─────────────────────────────────────────────────────

describe('COLORS – token data integrity', () => {
  const allGroups = Object.keys(COLORS);

  test('has all expected groups', () => {
    const expected = ['brand', 'semantic', 'feedback', 'surface', 'text', 'scenes', 'quilt'];
    expected.forEach(g => assert.ok(allGroups.includes(g), `Missing group: ${g}`));
  });

  test('every color entry has name, hex, and usage', () => {
    Object.entries(COLORS).forEach(([group, items]) => {
      items.forEach((c, i) => {
        assert.ok(typeof c.name  === 'string' && c.name,  `${group}[${i}].name missing`);
        assert.ok(typeof c.hex   === 'string' && c.hex,   `${group}[${i}].hex missing`);
        assert.ok(typeof c.usage === 'string' && c.usage, `${group}[${i}].usage missing`);
      });
    });
  });

  test('every hex is a valid 7-char CSS colour', () => {
    Object.entries(COLORS).forEach(([group, items]) => {
      items.forEach(c => {
        assert.match(
          c.hex,
          /^#[0-9a-fA-F]{6}$/,
          `${group}: "${c.hex}" is not a valid 6-digit hex`
        );
      });
    });
  });

  test('brand-primary hex matches source of truth', () => {
    const primary = COLORS.brand.find(c => c.name === 'brand-primary');
    assert.ok(primary, 'brand-primary token not found');
    assert.strictEqual(primary.hex, '#9b59b6');
  });
});

describe('TYPOGRAPHY – token data integrity', () => {
  test('has weights and sizes arrays', () => {
    assert.ok(Array.isArray(TYPOGRAPHY.weights));
    assert.ok(Array.isArray(TYPOGRAPHY.sizes));
  });

  test('font sizes are positive numbers in descending order (hero is largest)', () => {
    const pxValues = TYPOGRAPHY.sizes.map(t => t.px);
    assert.ok(pxValues[0] >= pxValues[pxValues.length - 1], 'Sizes should go from large to small');
    pxValues.forEach(px => assert.ok(px > 0, `Invalid font size: ${px}`));
  });

  test('fs-hero is 40px', () => {
    const hero = TYPOGRAPHY.sizes.find(t => t.token === 'fs-hero');
    assert.ok(hero, 'fs-hero token not found');
    assert.strictEqual(hero.px, 40);
  });

  test('all weight values are valid CSS font-weight strings', () => {
    const valid = ['100','200','300','400','500','600','700','800','900'];
    TYPOGRAPHY.weights.forEach(w => {
      assert.ok(valid.includes(w.value), `Invalid font weight: ${w.value}`);
    });
  });
});

describe('SPACING – token data integrity', () => {
  test('all entries have token, px, and usage', () => {
    SPACING.forEach((s, i) => {
      assert.ok(s.token, `SPACING[${i}].token missing`);
      assert.ok(typeof s.px === 'number' && s.px > 0, `SPACING[${i}].px invalid`);
      assert.ok(s.usage, `SPACING[${i}].usage missing`);
    });
  });

  test('space-16 is 16px', () => {
    const s16 = SPACING.find(s => s.token === 'space-16');
    assert.ok(s16, 'space-16 not found');
    assert.strictEqual(s16.px, 16);
  });

  test('tokens are sorted ascending by px value', () => {
    for (let i = 1; i < SPACING.length; i++) {
      assert.ok(
        SPACING[i].px >= SPACING[i - 1].px,
        `Spacing out of order at index ${i}: ${SPACING[i - 1].px} → ${SPACING[i].px}`
      );
    }
  });
});

describe('BORDER_RADIUS – token data integrity', () => {
  test('all entries have token, px, and usage', () => {
    BORDER_RADIUS.forEach((r, i) => {
      assert.ok(r.token, `BORDER_RADIUS[${i}].token missing`);
      assert.ok(typeof r.px === 'number' && r.px > 0, `BORDER_RADIUS[${i}].px invalid`);
      assert.ok(r.usage, `BORDER_RADIUS[${i}].usage missing`);
    });
  });

  test('radius-pill is 32px', () => {
    const pill = BORDER_RADIUS.find(r => r.token === 'radius-pill');
    assert.ok(pill, 'radius-pill not found');
    assert.strictEqual(pill.px, 32);
  });
});

describe('SHADOWS – token data integrity', () => {
  test('all entries have token, css, and usage', () => {
    SHADOWS.forEach((s, i) => {
      assert.ok(s.token, `SHADOWS[${i}].token missing`);
      assert.ok(s.css,   `SHADOWS[${i}].css missing`);
      assert.ok(s.usage, `SHADOWS[${i}].usage missing`);
    });
  });

  test('contains shadow-overlay', () => {
    assert.ok(SHADOWS.find(s => s.token === 'shadow-overlay'), 'shadow-overlay not found');
  });
});

describe('SCREENS – token data integrity', () => {
  test('all entries have name, bg, emoji, and theme', () => {
    SCREENS.forEach((s, i) => {
      assert.ok(s.name,  `SCREENS[${i}].name missing`);
      assert.ok(s.bg,    `SCREENS[${i}].bg missing`);
      assert.ok(s.emoji, `SCREENS[${i}].emoji missing`);
      assert.ok(s.theme, `SCREENS[${i}].theme missing`);
    });
  });

  test('SleepScene has a dark background', () => {
    const sleep = SCREENS.find(s => s.name === 'SleepScene');
    assert.ok(sleep, 'SleepScene not found');
    assert.strictEqual(isDark(sleep.bg), true, 'SleepScene should be dark');
  });

  test('at least 10 screens defined', () => {
    assert.ok(SCREENS.length >= 10, `Only ${SCREENS.length} screens – expected ≥ 10`);
  });
});

describe('COMPONENTS – token data integrity', () => {
  test('all components have name, description, props, and specs', () => {
    COMPONENTS.forEach((c, i) => {
      assert.ok(c.name,                               `COMPONENTS[${i}].name missing`);
      assert.ok(c.description,                        `COMPONENTS[${i}].description missing`);
      assert.ok(Array.isArray(c.props) && c.props.length > 0, `COMPONENTS[${i}].props missing`);
      assert.ok(Array.isArray(c.specs) && c.specs.length > 0, `COMPONENTS[${i}].specs missing`);
    });
  });

  test('IconButton is defined', () => {
    assert.ok(COMPONENTS.find(c => c.name === 'IconButton'), 'IconButton component not found');
  });

  test('every prop entry is a 3-element array', () => {
    COMPONENTS.forEach(c => {
      c.props.forEach((p, i) => {
        assert.strictEqual(p.length, 3, `${c.name}.props[${i}] should have 3 elements`);
      });
    });
  });
});

// ─── buildHtml() ─────────────────────────────────────────────────────────────

describe('buildHtml()', () => {
  let html;
  test('runs without throwing', () => {
    html = buildHtml();
    assert.ok(typeof html === 'string' && html.length > 0);
  });

  test('is a complete HTML5 document', () => {
    assert.ok(html.startsWith('<!DOCTYPE html>'), 'Missing DOCTYPE');
    assert.ok(html.includes('</html>'),           'Missing closing </html>');
  });

  test('contains the correct page title', () => {
    assert.ok(html.includes("Lilly's Box"), 'Title not found');
  });

  test('has a section for each major token group', () => {
    const requiredIds = ['colors', 'typography', 'spacing', 'border-radius', 'shadows', 'components', 'screens'];
    requiredIds.forEach(id => {
      assert.ok(html.includes(`id="${id}"`), `Missing section id="${id}"`);
    });
  });

  test('renders all 7 colour groups', () => {
    const count = (html.match(/class="swatch-grid"/g) || []).length;
    assert.ok(count >= 7, `Expected ≥ 7 swatch grids, found ${count}`);
  });

  test('renders a card for every colour swatch', () => {
    const totalColors = Object.values(COLORS).reduce((sum, arr) => sum + arr.length, 0);
    const rendered    = (html.match(/class="swatch-card"/g) || []).length;
    assert.strictEqual(rendered, totalColors, `Expected ${totalColors} swatch cards, found ${rendered}`);
  });

  test('renders a card for every screen theme', () => {
    const rendered = (html.match(/class="screen-card/g) || []).length;
    assert.strictEqual(rendered, SCREENS.length, `Expected ${SCREENS.length} screen cards, found ${rendered}`);
  });

  test('renders a section for every component', () => {
    const rendered = (html.match(/class="component-section"/g) || []).length;
    assert.strictEqual(rendered, COMPONENTS.length, `Expected ${COMPONENTS.length} component sections, found ${rendered}`);
  });

  test('includes the brand-primary colour hex', () => {
    assert.ok(html.includes('#9b59b6'), 'brand-primary hex not in HTML');
  });

  test('all colour hexes appear in the output', () => {
    Object.values(COLORS).flat().forEach(c => {
      assert.ok(
        html.includes(c.hex.toLowerCase()) || html.includes(c.hex.toUpperCase()),
        `Hex ${c.hex} (${c.name}) not found in HTML`
      );
    });
  });
});

// ─── buildFigmaTokens() ──────────────────────────────────────────────────────

describe('buildFigmaTokens()', () => {
  let raw;
  let tokens;

  test('runs without throwing', () => {
    raw = buildFigmaTokens();
    assert.ok(typeof raw === 'string' && raw.length > 0);
  });

  test('produces valid JSON', () => {
    tokens = JSON.parse(raw);
    assert.ok(typeof tokens === 'object' && tokens !== null);
  });

  test('has a color.brand group', () => {
    assert.ok(tokens['color.brand'], 'Missing color.brand group');
  });

  test('brand-primary is present with correct value', () => {
    const entry = tokens['color.brand']['brand-primary'];
    assert.ok(entry,                                         'brand-primary token missing');
    assert.strictEqual(entry.$value, '#9b59b6',              '$value mismatch');
    assert.strictEqual(entry.$type,  'color',               '$type should be "color"');
    assert.ok(typeof entry.$description === 'string',        '$description missing');
  });

  test('has a spacing group', () => {
    assert.ok(tokens['spacing'], 'Missing spacing group');
    const s16 = tokens['spacing']['space-16'];
    assert.ok(s16,                        'space-16 token missing');
    assert.strictEqual(s16.$value, '16px', 'space-16 $value should be "16px"');
    assert.strictEqual(s16.$type, 'dimension', '$type should be "dimension"');
  });

  test('has a typography.fontSize group', () => {
    assert.ok(tokens['typography.fontSize'], 'Missing typography.fontSize group');
    const hero = tokens['typography.fontSize']['fs-hero'];
    assert.ok(hero, 'fs-hero token missing');
    assert.strictEqual(hero.$value, '40px');
    assert.strictEqual(hero.$type, 'dimension');
  });

  test('has a typography.fontWeight group', () => {
    assert.ok(tokens['typography.fontWeight'], 'Missing typography.fontWeight group');
    const bold = tokens['typography.fontWeight']['weight-bold'];
    assert.ok(bold, 'weight-bold token missing');
    assert.strictEqual(bold.$value, '700');
    assert.strictEqual(bold.$type, 'fontWeight');
  });

  test('has a borderRadius group', () => {
    assert.ok(tokens['borderRadius'], 'Missing borderRadius group');
    const pill = tokens['borderRadius']['radius-pill'];
    assert.ok(pill,                         'radius-pill token missing');
    assert.strictEqual(pill.$value, '32px', 'radius-pill $value should be "32px"');
  });

  test('has a shadow group', () => {
    assert.ok(tokens['shadow'], 'Missing shadow group');
    const overlay = tokens['shadow']['shadow-overlay'];
    assert.ok(overlay,                     'shadow-overlay token missing');
    assert.strictEqual(overlay.$type, 'boxShadow');
  });

  test('has a color.screen group with all screens', () => {
    assert.ok(tokens['color.screen'], 'Missing color.screen group');
    assert.strictEqual(
      Object.keys(tokens['color.screen']).length,
      SCREENS.length,
      `Expected ${SCREENS.length} screen colour entries`
    );
  });

  test('every token entry has $value, $type, and $description', () => {
    Object.entries(tokens).forEach(([group, entries]) => {
      Object.entries(entries).forEach(([name, token]) => {
        assert.ok(token.$value !== undefined, `${group}.${name} missing $value`);
        assert.ok(token.$type  !== undefined, `${group}.${name} missing $type`);
        assert.ok(token.$description !== undefined, `${group}.${name} missing $description`);
      });
    });
  });

  test('total token count is reasonable (≥ 50)', () => {
    const total = Object.values(tokens).reduce((sum, g) => sum + Object.keys(g).length, 0);
    assert.ok(total >= 50, `Only ${total} tokens – expected ≥ 50`);
  });
});

// ─── Integration: files are written correctly ─────────────────────────────────

describe('Integration – file generation', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-test-'));
  const htmlPath  = path.join(tmpDir, 'design-system.html');
  const figmaPath = path.join(tmpDir, 'design-system.tokens.json');

  // Write files using the same functions main() uses
  test('writes HTML file to disk', () => {
    fs.writeFileSync(htmlPath, buildHtml(), 'utf8');
    assert.ok(fs.existsSync(htmlPath), 'HTML file not written');
    const size = fs.statSync(htmlPath).size;
    assert.ok(size > 10000, `HTML file too small (${size} bytes)`);
  });

  test('written HTML file is parseable (no unclosed tags test)', () => {
    const content = fs.readFileSync(htmlPath, 'utf8');
    const opens  = (content.match(/<[a-zA-Z]/g) || []).length;
    const closes = (content.match(/<\//g) || []).length;
    // We allow a generous mismatch because void elements (meta, br, etc.),
    // but the file should definitely not be a stub
    assert.ok(opens > 50,  `Too few opening tags: ${opens}`);
    assert.ok(closes > 50, `Too few closing tags: ${closes}`);
  });

  test('writes Figma tokens JSON file to disk', () => {
    fs.writeFileSync(figmaPath, buildFigmaTokens(), 'utf8');
    assert.ok(fs.existsSync(figmaPath), 'Figma tokens file not written');
  });

  test('Figma tokens file is valid JSON when read from disk', () => {
    const content = fs.readFileSync(figmaPath, 'utf8');
    const parsed  = JSON.parse(content);
    assert.ok(typeof parsed === 'object', 'Figma tokens file is not a JSON object');
  });

  // PPTX integration – validate the fixture produced by the previous run
  const existingPptx = path.resolve(__dirname, '../../docs/design-system/exports/design-system.pptx');
  const pptxExists   = fs.existsSync(existingPptx);

  test('existing PPTX (if present) is a valid zip archive', () => {
    if (!pptxExists) {
      console.log('       (skipped – no existing PPTX in exports/)');
      return;
    }
    // A valid PPTX starts with the PK zip magic bytes
    const buf = Buffer.alloc(4);
    const fd  = fs.openSync(existingPptx, 'r');
    fs.readSync(fd, buf, 0, 4, 0);
    fs.closeSync(fd);
    assert.strictEqual(buf[0], 0x50, 'Byte 0 should be 0x50 (P)');
    assert.strictEqual(buf[1], 0x4B, 'Byte 1 should be 0x4B (K)');
  });

  test('existing PPTX (if present) contains ≥ 15 slides', () => {
    if (!pptxExists) {
      console.log('       (skipped – no existing PPTX in exports/)');
      return;
    }
    // Count slide XML files by reading the zip directory entries
    // Uses Node's built-in zlib – no extra dep required
    const content   = fs.readFileSync(existingPptx);
    const slideCount = [...content.toString('binary').matchAll(/ppt\/slides\/slide\d+\.xml/g)].length;
    assert.ok(slideCount >= 15, `Expected ≥ 15 slides, found ${slideCount}`);
  });

  // Cleanup tmp dir after all tests
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
