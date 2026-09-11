/**
 * Data-driven legendary display names from Nexus inv_name_part, comp→np links, DLC loc, STX.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import { pickNexusJsonDir, listNexusJsonFiles, getTableRoot, sv } from './nexus-json-format.mjs';
import { buildDisplayHintMap } from './spawn-catalog.mjs';
import { loadInvNamePartEntries } from './nexus-inv-spawns.mjs';

/** Codename fixes when inv_name_part / Uni token does not match player-facing marketing name. */
export const MANUAL_COMP_DISPLAY_OVERRIDES = {
  'bor_sg.comp_05_legendary_demo': 'Hair Trigger',
  'jak_ar.comp_05_legendary_screenwriter': 'Screenwriter',
  // np/ui sometimes surface the legendary perk title; item card uses the codename.
  'mal_sr.comp_05_legendary_manifest': 'Manifest',
  'jak_ps.comp_05_legendary_manifest': 'Manifest',
  'dad_ar.comp_05_legendary_Mercredi': 'Hard Dark',
  'dad_ar.comp_05_legendary_mercredi': 'Hard Dark',
  'dad_ar.comp_05_legendary_HardDark': 'Hard Dark',
  'dad_ar.comp_05_legendary_harddark': 'Hard Dark',
  // STX rarities stub this as "Rogue" (Partial Implementation). Game export uses
  // np_loarmaster / Cosmetics_Weapon_Shiny_Loarmaster / part_barrel_01_Loarmaster.
  'dad_sm.comp_05_legendary_loarmaster': 'Loarmaster',
  'dad_sg.comp_05_legendary_cannonbrawl': 'Swan Song',
};

const SOURCE_RANK = {
  manual: 100,
  np_link: 90,
  inv_name_part: 80,
  ui_stat: 75,
  mandolin_loc: 70,
  stx_leg_body: 68,
  stx_rarities: 60,
  display_hint: 50,
  supplement: 30,
};

const CLASSMOD_NP_ABBR = {
  classmod_dark_siren: 'ds',
  classmod_exo_soldier: 'exo',
  classmod_gravitar: 'grav',
  classmod_paladin: 'pld',
  classmod_robodealer: 'robo',
  classmod_corpohacker: 'corpo',
};

/** Cowbell DLC uniques — np rows often missing from export name tables. */
const CLASSMOD_DLC_DISPLAY = {
  'classmod_dark_siren.comp_05_legendary_cowbell': 'Configuration',
  'classmod_dark_siren.leg_body_cowbell': 'Configuration',
  'classmod_exo_soldier.comp_05_legendary_cowbell': 'Reaparición',
  'classmod_exo_soldier.leg_body_cowbell': 'Reaparición',
  'classmod_gravitar.comp_05_legendary_cowbell': 'Phlebotomist',
  'classmod_gravitar.leg_body_cowbell': 'Phlebotomist',
  'classmod_paladin.comp_05_legendary_cowbell': 'Tempest',
  'classmod_paladin.leg_body_cowbell': 'Tempest',
  'classmod_robodealer.comp_05_legendary_dlc1': 'Gamer',
  'classmod_robodealer.leg_body_dlc1': 'Gamer',
  'classmod_corpohacker.comp_05_legendary_01': 'Devourer',
  'classmod_corpohacker.leg_body_01': 'Devourer',
  'classmod_corpohacker.comp_05_legendary_02': 'Virophile',
  'classmod_corpohacker.leg_body_02': 'Virophile',
  'classmod_corpohacker.comp_05_legendary_03': 'Montage Maker',
  'classmod_corpohacker.leg_body_03': 'Montage Maker',
  'classmod_corpohacker.comp_05_legendary_04': 'Memory Hoarder',
  'classmod_corpohacker.leg_body_04': 'Memory Hoarder',
  'classmod_corpohacker.comp_05_legendary_05': 'Trackstar',
  'classmod_corpohacker.leg_body_05': 'Trackstar',
  'classmod_corpohacker.comp_05_legendary_06': 'Functional Human',
  'classmod_corpohacker.leg_body_06': 'Functional Human',
  'classmod_corpohacker.comp_05_legendary_dlc1': 'Martyr',
  'classmod_corpohacker.leg_body_dlc1': 'Martyr',
  'classmod_corpohacker.comp_05_legendary_cowbell': 'Martyr',
  'classmod_corpohacker.leg_body_cowbell': 'Martyr',
  'classmod_corpohacker.comp_05_legendary_dlc2': 'Programmer',
  'classmod_corpohacker.leg_body_dlc2': 'Programmer',
  'classmod_corpohacker.comp_05_legendary_harmonica': 'Programmer',
  'classmod_corpohacker.leg_body_harmonica': 'Programmer',
  'classmod_corpohacker.comp_05_legendary_raid1': 'Boomer',
  'classmod_corpohacker.leg_body_raid1': 'Boomer',
  'classmod_corpohacker.comp_05_legendary_raid2': 'Plague Engineer',
  'classmod_corpohacker.leg_body_raid2': 'Plague Engineer',
  'classmod_corpohacker.comp_05_legendary_tuba': 'Puppetmaster',
  'classmod_corpohacker.leg_body_tuba': 'Puppetmaster',
};

let lookupCache = null;

export function normCompKey(comp) {
  return String(comp || '')
    .toLowerCase()
    .replace(/\s+/g, '');
}

export function spawnLabelName(label) {
  return String(label || '')
    .replace(/^(?:Phosphene|Pearl(?:escent)?)\s*[-—]\s*/i, '')
    .replace(/^Pearl\s*[-—]\s*/i, '')
    .trim();
}

function humanizeSlug(s) {
  return String(s || '')
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

function isGenericName(name, slug) {
  const n = String(name || '').trim();
  if (!n) return true;
  if (/^legendary(\s|$)/i.test(n)) return true;
  if (/^pearl(\s|$)/i.test(n)) return true;
  if (/^leg\s*body(\s|$)/i.test(n)) return true;
  if (/^comp_05_legendary/i.test(n)) return true;
  if (/^comp_06_pearl/i.test(n)) return true;
  if (/^\d+$/i.test(n)) return true;
  if (/^0\d+$/i.test(n)) return true;
  if (/^(cowbell|dlc\d+|raid\d+|tuba)$/i.test(n)) return true;
  // Do NOT treat "name matches slug" as generic — many guns use the codename as the
  // item title (Convergence, Shoals, G.M.R.). ui_stat rarity tags are often the perk
  // name (Asymptotic, Habitual) and must not replace those titles.
  return false;
}

function setName(byComp, comp, name, source) {
  const key = normCompKey(comp);
  const clean = String(name || '').trim();
  if (!key || !clean) return;
  const rank = SOURCE_RANK[source] ?? 0;
  const prev = byComp.get(key);
  if (!prev || rank >= prev.rank) {
    byComp.set(key, { name: clean, source, rank });
  }
}

function nameFromHints(comp, hints) {
  const part = normCompKey(comp).split('.').pop();
  if (!part) return null;
  if (hints.has(part)) return hints.get(part);
  const tail = part.replace(/^comp_05_legendary_/, '').replace(/^comp_06_pearl_/, '');
  if (hints.has(tail)) return hints.get(tail);
  if (hints.has(`comp_05_legendary_${tail}`)) return hints.get(`comp_05_legendary_${tail}`);
  return null;
}

function buildNpIndexes(nexusDir) {
  const byNp = new Map();
  const byUniToken = new Map();
  for (const ent of loadInvNamePartEntries(nexusDir)) {
    if (!ent.display || /^np_/i.test(ent.display)) continue;
    if (ent.np) byNp.set(ent.np.toLowerCase(), ent.display);
    const token = String(ent.token || '').trim();
    if (token && !/^(shield|classmod|turret)/i.test(token)) {
      byUniToken.set(token.toLowerCase(), ent.display);
    }
  }
  return { byNp, byUniToken };
}

function invCompSourceFiles(repoRoot, nexusDir) {
  const paths = [
    ...listNexusJsonFiles(nexusDir, /^Nexus-Data-inv\d+\.json$/i).map((fn) => path.join(nexusDir, fn)),
    path.join(nexusDir, 'Nexus-Data-inv_raid2_overlay.json'),
    path.join(nexusDir, 'Nexus-Data-inv_reference_overlay.json'),
    path.join(repoRoot, 'references/raid2_inv_comps/Nexus-Data-inv_raid2_overlay.json'),
    path.join(repoRoot, 'references/raid2_inv_comps/Nexus-Data-inv_reference_overlay.json'),
  ];
  return [...new Set(paths.filter((f) => fs.existsSync(f)))];
}

function npSlugForCompPart(partKey, byNp, invRoot = '') {
  const raw = String(partKey || '').toLowerCase();
  const tail = raw
    .replace(/^comp_05_legendary_/i, '')
    .replace(/^comp_06_pearl_/i, '')
    .replace(/^leg_body_/i, '')
    .toLowerCase();
  if (!tail) return null;
  const direct = `np_${tail}`;
  if (byNp.has(direct)) return direct;
  for (const np of byNp.keys()) {
    if (np.replace(/^np_/, '').toLowerCase() === tail) return np;
  }

  const root = String(invRoot || '').toLowerCase();
  const abbr = CLASSMOD_NP_ABBR[root];
  if (abbr) {
    const candidates = [`np_cm_${abbr}_leg_${tail}`];
    if (tail === 'cowbell') candidates.push(`np_cm_${abbr}_leg_dlc1`);
    if (tail === 'dlc1') candidates.push(`np_cm_${abbr}_leg_cowbell`);
    for (const c of candidates) {
      if (byNp.has(c)) return c;
    }
    return candidates[0];
  }
  return null;
}

/** comp (lowercase inv.comp) → np slug from comp part tail ↔ inv_name_part keys. */
export function buildCompToNpMap(repoRoot, nexusDir = pickNexusJsonDir(repoRoot)) {
  const byNp = new Map();
  for (const ent of loadInvNamePartEntries(nexusDir)) {
    if (ent.np) byNp.set(ent.np.toLowerCase(), ent.display);
  }

  const byComp = new Map();
  const remember = (comp, np) => {
    if (!comp || !np) return;
    if (!byComp.has(comp)) byComp.set(comp, np);
  };

  for (const fp of invCompSourceFiles(repoRoot, nexusDir)) {
    let inv;
    try {
      inv = getTableRoot(JSON.parse(fs.readFileSync(fp, 'utf8')), 'inv');
    } catch {
      continue;
    }
    if (!inv?.records) continue;

    for (const rec of inv.records) {
      for (const entry of rec.entries || []) {
        let invRoot = '';
        for (const ek of Object.keys(entry)) {
          if (ek === '__dep_entries' || ek === '__op') continue;
          if (!invRoot && /^[a-z][a-z0-9_]*$/i.test(ek)) invRoot = ek.toLowerCase();
        }
        if (!invRoot) continue;

        for (const dep of entry.__dep_entries || []) {
          if (sv(dep.depTableName) && sv(dep.depTableName) !== 'inv_comp') continue;
          for (const pk of Object.keys(dep)) {
            if (!/^comp_05_legendary_|^comp_06_pearl_|^leg_body_/i.test(pk)) continue;
            const comp = `${invRoot}.${pk}`.toLowerCase();
            const np = npSlugForCompPart(pk, byNp, invRoot);
            remember(comp, np);

            const m = pk.match(/^(?:comp_05_legendary_|leg_body_)(.+)$/i);
            if (m && CLASSMOD_NP_ABBR[invRoot]) {
              const tail = m[1].toLowerCase();
              remember(`${invRoot}.comp_05_legendary_${tail}`, np);
              remember(`${invRoot}.leg_body_${tail}`, np);
              if (tail === 'cowbell') {
                remember(`${invRoot}.comp_05_legendary_dlc1`, np);
                remember(`${invRoot}.leg_body_dlc1`, np);
              }
              if (tail === 'dlc1') {
                remember(`${invRoot}.comp_05_legendary_cowbell`, np);
                remember(`${invRoot}.leg_body_cowbell`, np);
              }
            }
          }
        }
      }
    }
  }
  return byComp;
}

function uniTokenToCompGuess(token) {
  const m = String(token || '').match(/^Uni_([A-Z0-9_]+)_([A-Za-z0-9_]+)$/);
  if (!m) return null;
  const inv = m[1].toLowerCase();
  const slug = m[2].replace(/([a-z])([A-Z])/g, '$1$2').toLowerCase();
  return `${inv}.comp_05_legendary_${slug}`;
}

function pickTitleFromLocValues(values) {
  const candidates = [];
  for (const v of values) {
    const s = String(v || '').trim();
    if (!s || s.startsWith('[')) continue;
    if (s.length > 80) continue;
    if (/^\[rarity_/i.test(s)) continue;
    if (/^you |^thought |^fight for |^while |^on /i.test(s)) continue;
    candidates.push(s);
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => a.length - b.length);
  return candidates[0].replace(/\s+$/, '');
}

function loadMandolinUniNames(repoRoot) {
  const out = new Map();
  const fp = path.join(
    repoRoot,
    'references/bl4_toolbox_export/tools/fmodel-workspace/Output/Exports/OakGame/Content/DLC/Mandolin/Localization/Mandolin/en/Mandolin.json',
  );
  if (!fs.existsSync(fp)) return out;
  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch {
    return out;
  }
  for (const [token, block] of Object.entries(doc)) {
    if (!token.startsWith('Uni_')) continue;
    const title = pickTitleFromLocValues(Object.values(block || {}));
    if (!title) continue;
    const comp = uniTokenToCompGuess(token);
    if (comp) out.set(comp, title);
    out.set(token.toLowerCase(), title);
  }
  // Cooper Duper lives under Uni_Spinning_Blade in loc, not mal_hw barrel token.
  if (out.has('uni_spinning_blade')) {
    out.set('mal_hw.comp_05_legendary_barrel', out.get('uni_spinning_blade'));
  }
  return out;
}

function loadStxRarityNames(repoRoot) {
  const out = new Map();
  const fp = path.join(repoRoot, 'assets/data/stx_rarities.js');
  if (!fs.existsSync(fp)) return out;
  const ctx = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(fp, 'utf8'), ctx);
  for (const row of ctx.window.STX_RARITIES || []) {
    const comp = String(row.itemTypeString || '').toLowerCase();
    const name = String(row.legendaryName || '').trim();
    if (!comp || !name) continue;
    if (!/comp_05_legendary_|comp_06_pearl_/.test(comp)) continue;
    out.set(comp, name);
  }
  return out;
}

/** Map classmod rarity comps from matching leg_body_* display names in STX datasets. */
function loadClassmodLegBodyNames(repoRoot) {
  /** @type {Map<string, string>} */
  const out = new Map();
  const noop = () => {};
  for (const rel of [
    'assets/data/stx_dataset.js',
    'assets/data/stx_dataset_supplement.js',
    'assets/data/stx_raid2_supplement.js',
    'assets/data/stx_nexus_gap_supplement.js',
  ]) {
    const fp = path.join(repoRoot, rel);
    if (!fs.existsSync(fp)) continue;
    const ctx = {
      window: {},
      console: { log: noop, warn: noop, error: noop, info: noop },
      document: {
        readyState: 'complete',
        addEventListener: noop,
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => [],
      },
      setTimeout: (fn) => {
        try {
          if (typeof fn === 'function') fn();
        } catch {
          /* ignore */
        }
        return 0;
      },
    };
    ctx.window.window = ctx.window;
    try {
      vm.createContext(ctx);
      vm.runInContext(fs.readFileSync(fp, 'utf8'), ctx, { filename: rel });
    } catch {
      continue;
    }
    const parts = ctx.window.STX_DATASET?.ALL_PARTS;
    if (!Array.isArray(parts)) continue;
    for (const p of parts) {
      const code = String(p?.code || '')
        .replace(/^"|"$/g, '')
        .toLowerCase();
      const m = code.match(/^(classmod_[a-z0-9_]+)\.leg_body_([a-z0-9_]+)$/);
      if (!m) continue;
      const name = String(p?.name || p?.legendaryName || '').trim();
      const tail = m[2];
      if (!name || isGenericName(name, tail)) continue;
      const root = m[1];
      out.set(`${root}.leg_body_${tail}`, name);
      out.set(`${root}.comp_05_legendary_${tail}`, name);
      if (tail === 'cowbell') {
        out.set(`${root}.leg_body_dlc1`, name);
        out.set(`${root}.comp_05_legendary_dlc1`, name);
      }
      if (tail === 'dlc1') {
        out.set(`${root}.leg_body_cowbell`, name);
        out.set(`${root}.comp_05_legendary_cowbell`, name);
      }
    }
  }
  return out;
}

export function loadUiStatLegendaryNames(nexusDir) {
  const bySlug = new Map();
  for (const fn of listNexusJsonFiles(nexusDir, /^Nexus-Data-ui_stat\d+\.json$/i)) {
    let raw;
    try {
      raw = fs.readFileSync(path.join(nexusDir, fn), 'utf8');
    } catch {
      continue;
    }
    const keyRe = /"uistat_([a-z0-9_]+)_desc"/gi;
    let km;
    while ((km = keyRe.exec(raw))) {
      const slug = km[1].toLowerCase();
      const chunk = raw.slice(km.index, km.index + 2500);
      const m = chunk.match(/\[rarity_legendary\]([^\[]+?)\[\/rarity_legendary\]/i);
      if (!m) continue;
      const name = String(m[1] || '').trim();
      if (!name || name.length > 60) continue;
      bySlug.set(slug, name);
    }
  }
  return bySlug;
}

/** Perk title from ui_stat rarity tags (Asymptotic), not the item card name (Convergence). */
export function getUiStatPerkTitle(slug, lookup = null) {
  const lk = lookup || getLegendaryNameLookup(process.cwd());
  const key = String(slug || '')
    .toLowerCase()
    .replace(/^shiny_/, '')
    .trim();
  if (!key) return null;
  return lk.bySlug?.get(key) || null;
}

function loadSupplementNames(repoRoot) {
  const out = new Map();
  for (const rel of ['assets/data/stx_dataset_supplement.js', 'assets/data/stx_raid2_supplement.js']) {
    const fp = path.join(repoRoot, rel);
    if (!fs.existsSync(fp)) continue;
    const text = fs.readFileSync(fp, 'utf8');
    const re =
      /"code":\s*"\\"([A-Z0-9_]+\.comp_05_legendary_([a-zA-Z0-9_]+))\\""[\s\S]*?"name":\s*"([^"]+)"/gi;
    let m;
    while ((m = re.exec(text))) {
      const comp = m[1].toLowerCase();
      const name = String(m[3] || '').replace(/^Legendary\s+/i, '').trim();
      if (name && !isGenericName(name, m[2])) out.set(comp, name);
    }
  }
  return out;
}

export function buildLegendaryNameLookup(repoRoot, nexusDir = pickNexusJsonDir(repoRoot)) {
  const byComp = new Map();
  const hints = buildDisplayHintMap(nexusDir);
  const invNameParts = loadInvNamePartEntries(nexusDir);
  const { byNp, byUniToken } = buildNpIndexes(nexusDir);
  const compToNp = buildCompToNpMap(repoRoot, nexusDir);
  const mandolin = loadMandolinUniNames(repoRoot);
  const uiStatBySlug = loadUiStatLegendaryNames(nexusDir);
  const tokenToNp = new Map();
  for (const ent of invNameParts) {
    if (ent.token) tokenToNp.set(ent.token.toLowerCase(), ent.np);
  }

  for (const [comp, np] of compToNp) {
    const display = byNp.get(np);
    if (display) setName(byComp, comp, display, 'np_link');
  }

  for (const [comp, name] of mandolin) {
    if (comp.includes('.')) setName(byComp, comp, name, 'mandolin_loc');
  }

  for (const [token, name] of mandolin) {
    if (!token.startsWith('uni_')) continue;
    const np = tokenToNp.get(token);
    if (!np) continue;
    for (const [comp, linkedNp] of compToNp) {
      if (linkedNp === np) setName(byComp, comp, name, 'mandolin_loc');
    }
  }

  for (const ent of invNameParts) {
    if (!ent.display) continue;
    const token = String(ent.token || '');
    if (token.startsWith('Uni_')) {
      const comp = uniTokenToCompGuess(token);
      if (comp) setName(byComp, comp, ent.display, 'inv_name_part');
    }
    if (ent.np) {
      for (const [comp, np] of compToNp) {
        if (np === ent.np) setName(byComp, comp, ent.display, 'inv_name_part');
      }
    }
  }

  for (const [comp, name] of loadStxRarityNames(repoRoot)) {
    if (!isGenericName(name, comp.split('.').pop()?.replace(/^comp_05_legendary_/, ''))) {
      setName(byComp, comp, name, 'stx_rarities');
    }
  }

  for (const [comp, name] of loadClassmodLegBodyNames(repoRoot)) {
    setName(byComp, comp, name, 'stx_leg_body');
  }

  for (const [comp, name] of loadSupplementNames(repoRoot)) {
    setName(byComp, comp, name, 'supplement');
  }

  for (const [comp, name] of Object.entries(CLASSMOD_DLC_DISPLAY)) {
    setName(byComp, comp, name, 'manual');
  }

  for (const [comp, name] of Object.entries(MANUAL_COMP_DISPLAY_OVERRIDES)) {
    setName(byComp, comp, name, 'manual');
  }

  // ui_stat [rarity_legendary]…[/rarity_legendary] tags are perk titles, not item names.
  // Keep them on bySlug for diagnostics only — do not write onto byComp display names.

  for (const [comp, np] of compToNp) {
    const key = normCompKey(comp);
    if (byComp.has(key)) continue;
    const hint = nameFromHints(comp, hints) || byNp.get(np);
    if (hint && !isGenericName(hint, comp.split('.').pop()?.replace(/^comp_05_legendary_/, ''))) {
      setName(byComp, comp, hint, 'display_hint');
    }
  }

  return { byComp, byNp, bySlug: uiStatBySlug, hints, compToNp, nexusDir };
}

export function getLegendaryNameLookup(repoRoot, nexusDir) {
  if (!lookupCache || lookupCache.repoRoot !== repoRoot) {
    lookupCache = { repoRoot, ...buildLegendaryNameLookup(repoRoot, nexusDir) };
  }
  return lookupCache;
}

/** @returns {string|null} */
export function resolveLegendaryDisplayName({ comp, slug } = {}, lookup = null) {
  const ck = normCompKey(comp);
  if (!ck) return null;
  const lk = lookup || getLegendaryNameLookup(process.cwd());
  const row = lk.byComp.get(ck);
  if (row?.name && !isGenericName(row.name, slug || ck.split('.').pop())) return row.name;

  const cm = ck.match(/^(classmod_[a-z0-9_]+)\.(?:comp_05_legendary_|leg_body_)(.+)$/);
  if (cm) {
    const root = cm[1];
    const tail = cm[2];
    for (const alt of [
      `${root}.leg_body_${tail}`,
      `${root}.comp_05_legendary_${tail}`,
      tail === 'cowbell' ? `${root}.leg_body_dlc1` : '',
      tail === 'cowbell' ? `${root}.comp_05_legendary_dlc1` : '',
      tail === 'dlc1' ? `${root}.leg_body_cowbell` : '',
      tail === 'dlc1' ? `${root}.comp_05_legendary_cowbell` : '',
    ].filter(Boolean)) {
      const altRow = lk.byComp.get(alt);
      if (altRow?.name && !isGenericName(altRow.name, tail)) return altRow.name;
    }
    const abbr = CLASSMOD_NP_ABBR[root];
    if (abbr && lk.byNp) {
      for (const np of [`np_cm_${abbr}_leg_${tail}`, tail === 'cowbell' ? `np_cm_${abbr}_leg_dlc1` : '', tail === 'dlc1' ? `np_cm_${abbr}_leg_cowbell` : ''].filter(Boolean)) {
        const fromNp = lk.byNp.get(np);
        if (fromNp && !isGenericName(fromNp, slug || tail)) return fromNp;
      }
    }
  }

  const tail = ck.split('.').pop()?.replace(/^comp_05_legendary_/, '').replace(/^comp_06_pearl_/, '').replace(/^leg_body_/, '');
  if (tail && lk.byNp) {
    const fromNp = lk.byNp.get(`np_${tail}`);
    if (fromNp && !isGenericName(fromNp, slug || tail)) return fromNp;
  }
  // Skip lk.bySlug here — those entries come from ui_stat rarity tags and are usually
  // legendary perk titles (Asymptotic), not the item/weapon name (Convergence).
  const fromHints = nameFromHints(ck, lk.hints);
  if (fromHints && !isGenericName(fromHints, slug || tail)) return fromHints;
  return null;
}

export function invalidateLegendaryNameLookupCache() {
  lookupCache = null;
}
