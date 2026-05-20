import { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Plus, Minus, Check, Home, Building2, Settings, Trash2, Mail, ArrowRight, Sparkles, FolderOpen, Info, TrendingUp, Gift, Receipt, Repeat, Layers, MapPin, Briefcase, Users } from 'lucide-react';

/* ============================================================================
   PRODUCT CATALOG mit Familien und Varianten
   ============================================================================ */

const CATEGORIES = {
  wohnen:     { label: 'Wohnen',                 desc: 'Wohnmodule & Familienkombinationen' },
  aufenthalt: { label: 'Aufenthalt & Tourismus', desc: 'Ferien, Hotel, Kurzzeit' },
  arbeit:     { label: 'Arbeit & Gemeinschaft',  desc: 'Co-Working, Versammlung, Büro' },
  erlebnis:   { label: 'Erlebnis',               desc: 'Gym, Wellness, Musik, Pool' },
  ergaenzung: { label: 'Ergänzungen',            desc: 'Leer-Module zur individuellen Nutzung' },
};

const PRODUCTS_PRIVAT_RAW = [
  { kuerzel: 'CoMod Live (UK,D,M)',     family: 'live', kueche: 'U-Küche',     moebliert: true,  beschr: 'U-Küche, Duschbad, möbliert',          cat: 'wohnen',     nuf: 32, bgf: 36, herst: 149000, marge: 0.125 },
  { kuerzel: 'CoMod Live (UK,D)',       family: 'live', kueche: 'U-Küche',     moebliert: false, beschr: 'U-Küche, Duschbad',                    cat: 'wohnen',     nuf: 32, bgf: 36, herst: 144000, marge: 0.125 },
  { kuerzel: 'CoMod Live (LK,D,M)',     family: 'live', kueche: 'L-Küche',     moebliert: true,  beschr: 'L-Küche, Duschbad, möbliert',          cat: 'wohnen',     nuf: 32, bgf: 36, herst: 144000, marge: 0.125 },
  { kuerzel: 'CoMod Live (LK,D)',       family: 'live', kueche: 'L-Küche',     moebliert: false, beschr: 'L-Küche, Duschbad',                    cat: 'wohnen',     nuf: 32, bgf: 36, herst: 139000, marge: 0.125 },
  { kuerzel: 'CoMod Live (PK,D,M)',     family: 'live', kueche: 'Pantry',      moebliert: true,  beschr: 'Pantry-Küche, Duschbad, möbliert',     cat: 'wohnen',     nuf: 32, bgf: 36, herst: 139000, marge: 0.125 },
  { kuerzel: 'CoMod Live (PK,D)',       family: 'live', kueche: 'Pantry',      moebliert: false, beschr: 'Pantry-Küche, Duschbad',               cat: 'wohnen',     nuf: 32, bgf: 36, herst: 134000, marge: 0.125 },
  { kuerzel: 'CoMod Live (D,M)',        family: 'live', kueche: 'Ohne Küche',  moebliert: true,  beschr: 'Duschbad, möbliert',                   cat: 'wohnen',     nuf: 32, bgf: 36, herst: 134000, marge: 0.125 },
  { kuerzel: 'CoMod Live (D)',          family: 'live', kueche: 'Ohne Küche',  moebliert: false, beschr: 'Duschbad',                             cat: 'wohnen',     nuf: 32, bgf: 36, herst: 129000, marge: 0.125 },
  { kuerzel: 'CoMod Home 48 (UK,D,1Z)', family: 'home', groesse: 48, kueche: 'U-Küche', beschr: 'Kombi 48 m², U-Küche, 1 Zimmer',   cat: 'wohnen',     nuf: 48, bgf: 52, herst: 189000, marge: 0.15  },
  { kuerzel: 'CoMod Home 48 (LK,D,2Z)', family: 'home', groesse: 48, kueche: 'L-Küche', beschr: 'Kombi 48 m², L-Küche, 2 Zimmer',   cat: 'wohnen',     nuf: 48, bgf: 52, herst: 189000, marge: 0.15  },
  { kuerzel: 'CoMod Home 64 (UK,D,1Z)', family: 'home', groesse: 64, kueche: 'U-Küche', beschr: 'Kombi 64 m², U-Küche, 1 Zimmer',   cat: 'wohnen',     nuf: 64, bgf: 68, herst: 219000, marge: 0.15  },
  { kuerzel: 'CoMod Home 64 (LK,D,2Z)', family: 'home', groesse: 64, kueche: 'L-Küche', beschr: 'Kombi 64 m², L-Küche, 2 Zimmer',   cat: 'wohnen',     nuf: 64, bgf: 68, herst: 219000, marge: 0.15  },
  { kuerzel: 'CoMod Add 32',            family: 'add',  groesse: 32, beschr: 'Leer, groß (32 m²)',                                  cat: 'ergaenzung', nuf: 32, bgf: 36, herst: 39000,  marge: 0.075 },
  { kuerzel: 'CoMod Add 24',            family: 'add',  groesse: 24, beschr: 'Leer, mittel (24 m²)',                                cat: 'ergaenzung', nuf: 24, bgf: 28, herst: 35000,  marge: 0.075 },
  { kuerzel: 'CoMod Add 12',            family: 'add',  groesse: 12, beschr: 'Leer, klein (12 m²)',                                 cat: 'ergaenzung', nuf: 12, bgf: 14, herst: 29000,  marge: 0.075 },
];

const PRODUCTS_GEWERB_RAW = [
  { kuerzel: 'CoMod Live B (LK,D,M)',   family: 'liveb', kueche: 'L-Küche',    moebliert: true,  beschr: 'L-Küche, Duschbad, möbliert',          cat: 'wohnen',     nuf: 32, bgf: 36, herst: 149000, marge: 0.15,  einnahmen: 1800, fee: 0.15 },
  { kuerzel: 'CoMod Live B (D,M)',      family: 'liveb', kueche: 'Ohne Küche', moebliert: true,  beschr: 'Duschbad, möbliert',                   cat: 'wohnen',     nuf: 32, bgf: 36, herst: 144000, marge: 0.15,  einnahmen: 1700, fee: 0.15 },
  { kuerzel: 'CoMod Live B (D)',        family: 'liveb', kueche: 'Ohne Küche', moebliert: false, beschr: 'Duschbad',                             cat: 'wohnen',     nuf: 32, bgf: 36, herst: 139000, marge: 0.15,  einnahmen: 1600, fee: 0.15 },
  { kuerzel: 'CoMod Studio (PK,D,M)',   family: 'studio', beschr: 'Pantry-Küche, Duschbad, möbliert',                                            cat: 'aufenthalt', nuf: 32, bgf: 36, herst: 139000, marge: 0.15,  einnahmen: 2000, fee: 0.15 },
  { kuerzel: 'CoMod Stay (LK,D,M)',     family: 'stay',  kueche: 'L-Küche', beschr: 'L-Küche, Duschbad, möbliert',                               cat: 'aufenthalt', nuf: 24, bgf: 28, herst: 129000, marge: 0.15,  einnahmen: 1900, fee: 0.15 },
  { kuerzel: 'CoMod Stay (PK,D,M)',     family: 'stay',  kueche: 'Pantry', beschr: 'Pantry-Küche, Duschbad, möbliert',                            cat: 'aufenthalt', nuf: 24, bgf: 28, herst: 124000, marge: 0.15,  einnahmen: 1800, fee: 0.15 },
  { kuerzel: 'CoMod B 48 (LK,D,1Z)',    family: 'bcombi', groesse: 48, beschr: 'Kombi 48 m², L-Küche, 1 Zimmer',                                  cat: 'wohnen',     nuf: 48, bgf: 52, herst: 189000, marge: 0.15,  einnahmen: 2400, fee: 0.15 },
  { kuerzel: 'CoMod B 64 (LK,D,2Z)',    family: 'bcombi', groesse: 64, beschr: 'Kombi 64 m², L-Küche, 2 Zimmer',                                  cat: 'wohnen',     nuf: 48, bgf: 52, herst: 189000, marge: 0.15,  einnahmen: 2400, fee: 0.15 },
  { kuerzel: 'CoMod Double B (D,M)',    family: 'double', beschr: '2-in-1, 2 Duschbäder, möbliert',                                                cat: 'aufenthalt', nuf: 36, bgf: 40, herst: 119000, marge: 0.15,  einnahmen: 2200, fee: 0.15 },
  { kuerzel: 'CoMod Gym B',             family: 'gym',     beschr: 'Mit Duschen, Umkleiden',                                                      cat: 'erlebnis',   nuf: 32, bgf: 36, herst: 109000, marge: 0.175, einnahmen: 1400, fee: 0.10 },
  { kuerzel: 'CoMod Music B',           family: 'music',   beschr: 'Schalloptimiert',                                                             cat: 'erlebnis',   nuf: 32, bgf: 36, herst: 42000,  marge: 0.10,  einnahmen: 600,  fee: 0.10 },
  { kuerzel: 'CoMod Wellness B',        family: 'wellness',beschr: 'Sauna, Eisbad, Liegen',                                                       cat: 'erlebnis',   nuf: 32, bgf: 36, herst: 99000,  marge: 0.175, einnahmen: 1200, fee: 0.10 },
  { kuerzel: 'CoMod CoWork B 48',       family: 'cowork',  groesse: 48, beschr: 'Co-Working 48 m², Küchenzeile, WC',                              cat: 'arbeit',     nuf: 48, bgf: 52, herst: 89000,  marge: 0.125, einnahmen: 250,  fee: 0.05 },
  { kuerzel: 'CoMod CoWork B 64',       family: 'cowork',  groesse: 64, beschr: 'Co-Working 64 m², Küchenzeile, WC',                              cat: 'arbeit',     nuf: 64, bgf: 68, herst: 99000,  marge: 0.125, einnahmen: 300,  fee: 0.05 },
  { kuerzel: 'CoMod CoWork B 96',       family: 'cowork',  groesse: 96, beschr: 'Co-Working 96 m², Küchenzeile, WC',                              cat: 'arbeit',     nuf: 96, bgf: 100,herst: 109000, marge: 0.125, einnahmen: 350,  fee: 0.05 },
  { kuerzel: 'CoMod Community B 64',    family: 'community', groesse: 64, beschr: 'Versammlung 64 m², mit WC',                                    cat: 'arbeit',     nuf: 64, bgf: 68, herst: 89000,  marge: 0.10,  einnahmen: 0,    fee: 0    },
  { kuerzel: 'CoMod Community B 96',    family: 'community', groesse: 96, beschr: 'Versammlung 96 m², mit WC',                                    cat: 'arbeit',     nuf: 96, bgf: 100,herst: 99000,  marge: 0.10,  einnahmen: 0,    fee: 0    },
  { kuerzel: 'CoMod Add B 32',          family: 'addb',    groesse: 32, beschr: 'Leer, groß (32 m²)',                                              cat: 'ergaenzung', nuf: 32, bgf: 36, herst: 39000,  marge: 0.075, einnahmen: 0,    fee: 0    },
  { kuerzel: 'CoMod Add B 24',          family: 'addb',    groesse: 24, beschr: 'Leer, mittel (24 m²)',                                            cat: 'ergaenzung', nuf: 24, bgf: 28, herst: 35000,  marge: 0.075, einnahmen: 0,    fee: 0    },
  { kuerzel: 'CoMod Add B 12',          family: 'addb',    groesse: 12, beschr: 'Leer, klein (12 m²)',                                             cat: 'ergaenzung', nuf: 12, bgf: 14, herst: 29000,  marge: 0.075, einnahmen: 0,    fee: 0    },
  { kuerzel: 'Container-Pool',          family: 'pool',    beschr: 'Pool mit Strömungsanlage, Terrassen, Filter',                                  cat: 'erlebnis',   nuf: 32, bgf: 36, herst: 59000,  marge: 0.075, einnahmen: 0,    fee: 0    },
];

const PROV = 0.035;
const UST = 0.19;
const ANZ_PCT = 0.35;

const FAMILY_LABELS = {
  live:      { label: 'CoMod Live',     desc: 'Wohnmodul, 32 m² NUF' },
  home:      { label: 'CoMod Home',     desc: 'Wohnmodul-Kombi, 48 oder 64 m² NUF' },
  add:       { label: 'CoMod Add',      desc: 'Ergänzungsmodul leer, 12 / 24 / 32 m²' },
  liveb:     { label: 'CoMod Live B',   desc: 'Wohnmodul gewerblich, 32 m²' },
  studio:    { label: 'CoMod Studio',   desc: 'Ferienwohnung, 32 m² NUF, möbliert' },
  stay:      { label: 'CoMod Stay',     desc: 'Hotel/KZW-Modul, 24 m² NUF, möbliert' },
  bcombi:    { label: 'CoMod B 48/64',  desc: 'Wohnmodul-Kombi gewerblich' },
  double:    { label: 'CoMod Double',   desc: 'Doppelwohnmodul, 36 m² NUF, möbliert' },
  gym:       { label: 'CoMod Gym',      desc: 'Volldigitales Gym mit Duschen' },
  music:     { label: 'CoMod Music',    desc: 'Schalloptimierter Probe-/Musikraum' },
  wellness:  { label: 'CoMod Wellness', desc: 'Mini-Sauna, Eisbad, Liegen' },
  cowork:    { label: 'CoMod CoWork',   desc: 'Co-Working-Kombi, 48 / 64 / 96 m²' },
  community: { label: 'CoMod Community',desc: 'Versammlungs-/Gemeinschaftsmodul' },
  addb:      { label: 'CoMod Add B',    desc: 'Ergänzungsmodul gewerblich, leer' },
  pool:      { label: 'Container-Pool', desc: 'Pool mit Strömungsanlage' },
};

// Add ist die einzige Familie, die je nach Auswahl privat oder gewerblich werden kann
const ADD_FAMILY_PAIR = { privat: 'add', business: 'addb' };

const FAMILIES_PRIVAT = ['live', 'home', 'add'];
const FAMILIES_BUSINESS = ['liveb', 'studio', 'stay', 'bcombi', 'double', 'gym', 'music', 'wellness', 'cowork', 'community', 'addb', 'pool'];

// ⚠️ PLATZHALTER — alle Werte später Admin-pflegbar im Backend
// Plausibilitäts-Anmerkungen (Stand Oct 2025):
// - Strom 0,90 €/m² liegt über dem Markt-Durchschnitt (typ. 0,30-0,60 €/m²)
// - Heizung 1,20 €/m² im üblichen Bereich (1,00-1,50)
// - Gesamtsumme 5,40 €/m²/Mt enthält CoMod-spezifische Posten (Lizenz, QM)
const NEBENKOSTEN_POSTEN = [
  { id: 'lizenz',  label: 'Lizenzgebühr CoMod',   proM2: 0.80 },
  { id: 'qm',      label: 'Quartiersmanagement',  proM2: 0.70 },
  { id: 'strom',   label: 'Strom & Allgemein',    proM2: 0.90 },
  { id: 'wasser',  label: 'Wasser / Abwasser',    proM2: 0.60 },
  { id: 'heizung', label: 'Heizung / Warmwasser', proM2: 1.20 },
  { id: 'vers',    label: 'Versicherung',         proM2: 0.40 },
  { id: 'instand', label: 'Instandhaltung',       proM2: 0.80 },
];

const ZIEL_MODUL_NUF = 32; // Mittelwert für Pacht-Umlage-Berechnung (alle Module gerechnet mit 32 m²)
const ZIEL_MODUL_BGF = 36; // Standard-BGF eines Moduls für Mindestflächenberechnung
const BEBAUUNGSGRAD = 0.80; // 80% der Fläche sind effektiv bebaubar (Rest = Wege, Begrünung, Parkplätze etc.)
// Pauschalkosten je Modul (Platzhalter, später Admin-pflegbar)
const KOSTEN_TREPPEN_LAUBENGANG_PRO_MODUL = 3500; // OG + DG benötigen Aufgänge
const KOSTEN_TERRASSE_PRO_MODUL = 2500;           // EG bekommt Terrasse

function withPrices(p) {
  const grundpreis = p.herst * p.marge;
  const provision = p.herst * PROV;
  const netto = p.herst + grundpreis + provision;
  const brutto = netto * (1 + UST);
  return { ...p, netto, brutto };
}

const PRODUCTS = {
  privat:     PRODUCTS_PRIVAT_RAW.map(withPrices).map(p => ({ ...p, usage: 'p', einnahmen: 0, fee: 0 })),
  gewerblich: PRODUCTS_GEWERB_RAW.map(withPrices).map(p => ({ ...p, usage: 'g' })),
};
const ALL_PRODUCTS = [...PRODUCTS.privat, ...PRODUCTS.gewerblich];

const PROJECTS_TEMPLATES = [
  { id: 'voelk', name: 'Völklinger Straße', location: 'Düsseldorf',
    description: 'Urbanes Wohnprojekt mit Mischnutzung, 1.200 m² Grundstück',
    projektrabatt: 0.05, umlageProModulEinmalig: 8500,
    pachtJahr: 150000, pachtGewerblich: true,
    zielModulAnzahl: 80, maxModulAnzahl: 100,
    grundstueckGroesse: 1200,
    description2: 'Inkl. Quartiers-Gym, Wellness und CoWorking — anteilige Einnahmen werden auf alle Bewohner umgelegt.' },
  { id: 'albst', name: 'Albstadt Mitarbeiter-Campus', location: 'Albstadt',
    description: 'Wohnraum für Holzbau-Bodmer-Mitarbeiter, gewerblicher Pachtrahmen',
    projektrabatt: 0.05, umlageProModulEinmalig: 5400,
    pachtJahr: 0, pachtGewerblich: false,
    zielModulAnzahl: 40, maxModulAnzahl: 50,
    grundstueckGroesse: 2500,
    description2: 'Mitarbeiter-Wohnen mit verkürzter Pacht — keine Quartiers-Module.' },
];

const RABATT_STAFFEL = [
  { ab: 5, prozent: 0.05 }, { ab: 10, prozent: 0.10 }, { ab: 25, prozent: 0.15 },
  { ab: 50, prozent: 0.20 }, { ab: 75, prozent: 0.25 }, { ab: 100, prozent: 0.30 },
];

const PROJEKTKOSTEN_STAFFEL = [
  { maxMod: 10,       arch: 7500,  eing: 12500, pm: 36000  },
  { maxMod: 25,       arch: 15000, eing: 25000, pm: 60000  },
  { maxMod: 50,       arch: 25000, eing: 39000, pm: 90000  },
  { maxMod: Infinity, arch: 35000, eing: 59000, pm: 120000 },
];

const GRDST_OPTIONEN = [
  { id: 'abriss', label: 'Abriss vorhandener Bebauung',          netto: 50,  bezug: 'grundstueck', schaetzungsfaehig: false },
  { id: 'erschl', label: 'Erschließung (Strom/Wasser/Abwasser)', netto: 100, bezug: 'grundstueck', schaetzungsfaehig: true },
  { id: 'wege',   label: 'Wege, Schotter, Pflaster',              netto: 75,  bezug: 'freiflaeche', anteil: 0.3, schaetzungsfaehig: true },
  { id: 'gruen',  label: 'Begrünung, Bäume, Hecken',              netto: 75,  bezug: 'freiflaeche', anteil: 0.7, schaetzungsfaehig: true },
];

const FIN_DEFAULTS = {
  kfw: { foerderhoehe: 150000, zins: 0.02, laufzeit: 25, tilgungsnachlass: 0.15 },
  gls: { zins: 0.05, laufzeit: 10 }, // Laufzeit fix
  plattform: { zins: 0.055, laufzeit: 10, steuer: 0.30, afaJahre: 8, restwertPct: 0 }, // Laufzeit max 10
};

/* ============================================================================
   CALCULATIONS
   ============================================================================ */

function getRabatt(total) { let r = 0; for (const s of RABATT_STAFFEL) if (total >= s.ab) r = s.prozent; return r; }
function getNextRabattSchwelle(total) { for (const s of RABATT_STAFFEL) if (total < s.ab) return s; return null; }
function pmt(annualRate, years, principal) {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 12;
  const n = years * 12;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}
function getProjektkostenStaffel(modulAnzahl) {
  if (modulAnzahl <= 0) return { arch: 0, eing: 0, pm: 0, netto: 0, brutto: 0 };
  const t = PROJEKTKOSTEN_STAFFEL.find(s => modulAnzahl <= s.maxMod);
  const netto = t.arch + t.eing + t.pm;
  return { arch: t.arch, eing: t.eing, pm: t.pm, netto, brutto: netto * (1 + UST) };
}
function calcMindestflaeche({ totalBGF, geschosse }) {
  if (totalBGF <= 0 || geschosse <= 0) return { gebaeudeflaeche: 0, mindestGrundstueck: 0 };
  const gebaeudeflaeche = Math.ceil(totalBGF / geschosse);
  const mindestGrundstueck = Math.ceil(gebaeudeflaeche / BEBAUUNGSGRAD);
  return { gebaeudeflaeche, mindestGrundstueck };
}

// Berechnet max. Module die auf der Fläche untergebracht werden können
// max pro Geschoss = (Fläche × Bebauungsgrad) / 36 m² BGF
// max gesamt = max pro Geschoss × Geschosse
function calcMaxModule({ grundstueckGroesse, geschosse }) {
  if (!grundstueckGroesse || !geschosse) return { maxProGeschoss: 0, maxGesamt: 0 };
  const maxProGeschoss = Math.floor((grundstueckGroesse * BEBAUUNGSGRAD) / ZIEL_MODUL_BGF);
  const maxGesamt = maxProGeschoss * geschosse;
  return { maxProGeschoss, maxGesamt };
}

// Berechnet Mindestgrundstück rückwärts aus gewünschter Modulanzahl
// Konsistent zur Vorwärts-Formel: mindestGrundstück = ceil((Modul/Geschoss × 36 m²) / 0.80)
// Der Bebauungsgrad deckt Wege, Grünflächen, Parkplätze bereits ab — KEIN zusätzlicher Freiflächenaufschlag!
function calcMindestflaecheFuerModule({ modulAnzahl, geschosse }) {
  if (!modulAnzahl || !geschosse) return { gebaeudeflaeche: 0, mindestGrundstueck: 0 };
  const modulProGeschoss = Math.ceil(modulAnzahl / geschosse);
  const gebaeudeflaeche = modulProGeschoss * ZIEL_MODUL_BGF;
  const mindestGrundstueck = Math.ceil(gebaeudeflaeche / BEBAUUNGSGRAD);
  return { gebaeudeflaeche, mindestGrundstueck };
}

// Default-Verteilung: gleichmäßig, Aufrundung von unten nach oben
// Beispiel: 50 Module / 3 Geschosse → EG=17, OG=17, DG=16
// Berechnet wie viele "Stellplatz-Einheiten" ein Modul verbraucht
// 1 Einheit = 36 m² BGF = Standard-Stellplatz im Konfigurator
// Größere Module belegen entsprechend mehr Stellplätze:
//   - CoMod Live (36 m²) → 1 Einheit
//   - CoMod Home 48 (52 m²) → 2 Einheiten
//   - CoMod CoWork 96 (100 m²) → 3 Einheiten
//   - Kleine Add 12/24 → trotzdem 1 Einheit (passt nicht enger)
function calcModulEinheiten(product) {
  if (!product || !product.bgf) return 1;
  return Math.ceil(product.bgf / ZIEL_MODUL_BGF);
}

function defaultGeschossVerteilung(zielwert, geschosse) {
  if (!zielwert || !geschosse) return Array(geschosse || 0).fill(0);
  const basis = Math.floor(zielwert / geschosse);
  const rest = zielwert - basis * geschosse;
  // Von unten nach oben: EG, OG, DG bekommen Rest verteilt
  const verteilung = Array(geschosse).fill(basis);
  for (let i = 0; i < rest; i++) verteilung[i] += 1;
  return verteilung;
}

// Validierung: EG ≥ OG ≥ DG, Summe ≤ Zielwert
function validateGeschossVerteilung(verteilung, zielwert) {
  if (!verteilung || verteilung.length === 0) return { valid: true, error: null };
  const summe = verteilung.reduce((s, n) => s + n, 0);
  if (summe > zielwert) return { valid: false, error: `Summe (${summe}) überschreitet Zielwert (${zielwert})` };
  for (let i = 1; i < verteilung.length; i++) {
    if (verteilung[i] > verteilung[i-1]) {
      const namen = ['EG', 'OG', 'DG'];
      return { valid: false, error: `${namen[i]} darf nicht mehr Module als ${namen[i-1]} haben` };
    }
  }
  return { valid: true, error: null };
}
function calcEinmaligeProjektkosten({ modulAnzahl, grundstueckGroesse, geschosse, activeOptionen, hasGrundstueck, useEstimates, totalBGF, geschossVerteilung }) {
  const staffel = getProjektkostenStaffel(modulAnzahl);
  const gAnzahl = geschosse || 2;
  const belegteFlaeche = (totalBGF || 0) > 0 ? Math.ceil(totalBGF / gAnzahl) : Math.ceil((modulAnzahl * 36) / gAnzahl);
  const tatsaechlicheGrdst = grundstueckGroesse || (useEstimates ? Math.ceil(belegteFlaeche / BEBAUUNGSGRAD) : 0);
  const freiflaeche = Math.max(0, tatsaechlicheGrdst - belegteFlaeche);
  const posten = [
    { id: 'arch', label: 'Architektur & Entwurfsplanung', netto: staffel.arch, brutto: staffel.arch * (1 + UST), typ: 'pflicht' },
    { id: 'eing', label: 'Eingabeplanung & Genehmigung',   netto: staffel.eing, brutto: staffel.eing * (1 + UST), typ: 'pflicht' },
    { id: 'pm',   label: 'Projektmanagement & Bauleitung',  netto: staffel.pm,   brutto: staffel.pm   * (1 + UST), typ: 'pflicht' },
  ];

  // Treppen/Laubengänge für OG + DG, Terrassen für EG (basierend auf Geschoss-Verteilung)
  if (geschossVerteilung && geschossVerteilung.length > 0) {
    const egCount = geschossVerteilung[0] || 0;
    const obereCount = geschossVerteilung.slice(1).reduce((s, n) => s + n, 0); // OG + DG
    if (obereCount > 0) {
      const netto = obereCount * KOSTEN_TREPPEN_LAUBENGANG_PRO_MODUL;
      posten.push({
        id: 'treppen', label: 'Treppen & Laubengänge',
        netto, brutto: netto * (1 + UST), typ: 'pflicht',
        detail: `${obereCount} Module in OG/DG × ${fmtEUR(KOSTEN_TREPPEN_LAUBENGANG_PRO_MODUL)}`
      });
    }
    if (egCount > 0) {
      const netto = egCount * KOSTEN_TERRASSE_PRO_MODUL;
      posten.push({
        id: 'terrasse', label: 'Terrassen (EG-Module)',
        netto, brutto: netto * (1 + UST), typ: 'pflicht',
        detail: `${egCount} EG-Module × ${fmtEUR(KOSTEN_TERRASSE_PRO_MODUL)}`
      });
    }
  }

  if (hasGrundstueck && tatsaechlicheGrdst > 0) {
    for (const opt of GRDST_OPTIONEN) {
      const isActive = activeOptionen[opt.id];
      const useFromEstimate = useEstimates && opt.schaetzungsfaehig;
      if (!isActive && !useFromEstimate) continue;
      const flaeche = opt.bezug === 'grundstueck' ? tatsaechlicheGrdst : freiflaeche * (opt.anteil || 1);
      const netto = flaeche * opt.netto;
      posten.push({ id: opt.id, label: opt.label, netto, brutto: netto * (1 + UST), typ: useFromEstimate ? 'schaetzung' : 'option' });
    }
  }
  const summeNetto = posten.reduce((s, p) => s + p.netto, 0);
  const summeBrutto = posten.reduce((s, p) => s + p.brutto, 0);
  return { posten, summeNetto, summeBrutto, belegteFlaeche, freiflaeche, tatsaechlicheGrdst };
}
function calcNebenkosten({ hasPacht, pachtJahr, pachtGewerblich, gesamtNUF, nufPrivat, nufGewerb, zielModulAnzahl }) {
  // Pacht-Berechnung:
  // - Wenn Projekt (zielModulAnzahl > 0): Umlage = pachtJahr / Ziel-Module / 32 m² / 12
  //   - Privat-Anteil bekommt brutto (inkl. 19 % USt) aufgeschlagen, falls pachtGewerblich
  //   - Gewerb-Anteil bekommt netto (Vorsteuerabzug)
  // - Wenn Gewerbe-Konfig (keine Ziel-Module): kompletter Jahresbetrag auf NUF
  let pachtMonat = 0;
  let pachtProM2_priv = 0;  // €/m² für private Module
  let pachtProM2_gewerb = 0;  // €/m² für gewerbliche Module

  if (hasPacht) {
    if (zielModulAnzahl && zielModulAnzahl > 0) {
      // Projekt-Logik: getrennte Sätze je nach Modul-Nutzung
      const pachtNettoProM2 = pachtJahr / zielModulAnzahl / ZIEL_MODUL_NUF / 12;
      pachtProM2_gewerb = pachtNettoProM2;
      pachtProM2_priv = pachtGewerblich ? pachtNettoProM2 * (1 + UST) : pachtNettoProM2;
      pachtMonat = pachtProM2_priv * (nufPrivat || 0) + pachtProM2_gewerb * (nufGewerb || 0);
    } else {
      // Gewerbe-Logik (eigene Fläche): Kunde trägt komplette Jahrespacht
      const pachtBruttoJahr = pachtGewerblich ? pachtJahr * (1 + UST) : pachtJahr;
      pachtMonat = pachtBruttoJahr / 12;
      const satz = gesamtNUF > 0 ? pachtMonat / gesamtNUF : 0;
      pachtProM2_priv = satz;
      pachtProM2_gewerb = satz;
    }
  }
  // Effektiver Mittelwert nur zur Anzeige
  const pachtProM2 = gesamtNUF > 0 ? pachtMonat / gesamtNUF : 0;

  const nebenkostenProM2 = NEBENKOSTEN_POSTEN.reduce((s, p) => s + p.proM2, 0);
  const proM2Gesamt = pachtProM2 + nebenkostenProM2;
  return {
    pachtBruttoJahr: hasPacht ? (pachtGewerblich ? pachtJahr * (1 + UST) : pachtJahr) : 0,
    pachtMonat, pachtProM2, pachtProM2_priv, pachtProM2_gewerb,
    nebenkostenProM2, proM2Gesamt, posten: NEBENKOSTEN_POSTEN,
  };
}
function getDefaultMode(usage) { return usage === 'p' ? 'eigennutzung' : 'einnahmen'; }
function isModeToggleable(product) {
  if (product.usage === 'p') return false;
  if ((product.einnahmen || 0) <= 0) return false;
  return true;
}

function calculateTotals({ selections, modes, project, gewerbConfig, ekPrivat, ekGewerb, financing, vermietungDurchCoMod }) {
  const lineItems = Object.entries(selections)
    .filter(([_, count]) => count > 0)
    .map(([kuerzel, count]) => {
      const p = ALL_PRODUCTS.find(x => x.kuerzel === kuerzel);
      if (!p) return null;
      const mode = isModeToggleable(p) ? (modes[kuerzel] || getDefaultMode(p.usage)) : getDefaultMode(p.usage);
      return { ...p, count, mode };
    })
    .filter(Boolean);

  const privatItems = lineItems.filter(x => x.usage === 'p');
  const gewerbItems = lineItems.filter(x => x.usage === 'g');
  const countPrivat = privatItems.reduce((s, x) => s + x.count, 0);
  const countGewerb = gewerbItems.reduce((s, x) => s + x.count, 0);
  const countTotal = countPrivat + countGewerb;
  // Modul-Einheiten: größere Module belegen mehrere Stellplätze
  // z. B. 3× CoWork 96 = 9 Einheiten (jeweils ceil(100/36) = 3)
  const einheitenPrivat = privatItems.reduce((s, x) => s + x.count * calcModulEinheiten(x), 0);
  const einheitenGewerb = gewerbItems.reduce((s, x) => s + x.count * calcModulEinheiten(x), 0);
  const einheitenTotal = einheitenPrivat + einheitenGewerb;
  const gesamtNUF = lineItems.reduce((s, x) => s + x.count * x.nuf, 0);
  const gesamtBGF = lineItems.reduce((s, x) => s + x.count * x.bgf, 0);
  const nufPrivat = privatItems.reduce((s, x) => s + x.count * x.nuf, 0);
  const nufGewerb = gewerbItems.reduce((s, x) => s + x.count * x.nuf, 0);
  const bruttoPrivat = privatItems.reduce((s, x) => s + x.count * x.brutto, 0);
  const nettoGewerb = gewerbItems.reduce((s, x) => s + x.count * x.netto, 0);
  // Rabattbasis: bei Gewerbekunden auf Ziel-Modulanzahl, sonst auf Ist-Auswahl
  // Bei Projekten könnte man theoretisch auch auf zielModulAnzahl des Projekts gehen, aber das ist die Quartiers-Größe — wir lassen es bei Ist-Auswahl
  const rabattBasis = (gewerbConfig && gewerbConfig.zielModulAnzahl > 0) ? gewerbConfig.zielModulAnzahl : countTotal;
  const rabattPct = getRabatt(rabattBasis) + (project ? project.projektrabatt : 0);
  const nextStaffel = getNextRabattSchwelle(rabattBasis);
  const mindestflaeche = gewerbConfig ? calcMindestflaeche({ totalBGF: gesamtBGF, geschosse: gewerbConfig.geschosse || 2 }) : null;

  let einmaligGesamtBrutto = 0;
  let einmaligDetail = null;
  if (project) {
    einmaligGesamtBrutto = countTotal * (project.umlageProModulEinmalig || 0);
  } else if (gewerbConfig) {
    einmaligDetail = calcEinmaligeProjektkosten({
      modulAnzahl: countTotal,
      grundstueckGroesse: gewerbConfig.flaecheStatus === 'ja' ? gewerbConfig.grundstueckGroesse : 0,
      geschosse: gewerbConfig.geschosse || 2,
      activeOptionen: gewerbConfig.activeOptionen || {},
      hasGrundstueck: gewerbConfig.flaecheStatus === 'ja',
      useEstimates: gewerbConfig.flaecheStatus === 'ja' && !gewerbConfig.detailKosten,
      totalBGF: gesamtBGF,
      geschossVerteilung: gewerbConfig.geschossVerteilung || [],
    });
    einmaligGesamtBrutto = einmaligDetail.summeBrutto;
  }
  const einmaligProModul = countTotal > 0 ? einmaligGesamtBrutto / countTotal : 0;

  const effPrivat = bruttoPrivat * (1 - rabattPct) + countPrivat * einmaligProModul;
  const effGewerbNetto = nettoGewerb * (1 - rabattPct) + countGewerb * (einmaligProModul / (1 + UST));
  const effGewerbBrutto = effGewerbNetto * (1 + UST);

  const pachtSource = project ? { hasPacht: (project.pachtJahr || 0) > 0, pachtJahr: project.pachtJahr || 0, pachtGewerblich: project.pachtGewerblich, zielModulAnzahl: project.zielModulAnzahl || 0 }
    : gewerbConfig ? { hasPacht: !!gewerbConfig.hasPacht, pachtJahr: gewerbConfig.pachtJahr || 0, pachtGewerblich: gewerbConfig.pachtGewerblich, zielModulAnzahl: 0 }
    : { hasPacht: false, pachtJahr: 0, pachtGewerblich: false, zielModulAnzahl: 0 };
  const nebenkosten = calcNebenkosten({ ...pachtSource, gesamtNUF, nufPrivat, nufGewerb });
  // Gesamt = Pacht (bereits brutto/netto-aufgesplittet in calcNebenkosten) + sonstige Nebenkosten * NUF
  const nebenkostenMonatGesamt = nebenkosten.pachtMonat + nebenkosten.nebenkostenProM2 * gesamtNUF;

  const kfwBasis = Math.min(countPrivat * financing.kfw.foerderhoehe, effPrivat);
  const kfwAfterNachlass = kfwBasis * (1 - financing.kfw.tilgungsnachlass);
  const kfwRate = pmt(financing.kfw.zins, financing.kfw.laufzeit, kfwAfterNachlass);
  const glsBasis = Math.max(0, effPrivat - kfwBasis - ekPrivat);
  const glsRate = pmt(financing.gls.zins, financing.gls.laufzeit, glsBasis);

  const restwertEUR = effGewerbNetto * financing.plattform.restwertPct;
  const plattformBasis = Math.max(0, effGewerbNetto - ekGewerb - restwertEUR);
  const plattformRate = pmt(financing.plattform.zins, financing.plattform.laufzeit, plattformBasis);
  const steuerentlastung = effGewerbNetto > 0 && financing.plattform.afaJahre > 0
    ? ((effGewerbNetto / financing.plattform.afaJahre) + (plattformBasis * financing.plattform.zins)) * financing.plattform.steuer / 12
    : 0;
  const plattformRateEff = Math.max(0, plattformRate - steuerentlastung);

  const finanzierungMonat = kfwRate + glsRate + plattformRateEff;
  const monatlichGesamt = finanzierungMonat + nebenkostenMonatGesamt;

  const incomeItems = lineItems.filter(x => x.mode === 'einnahmen' && (x.einnahmen || 0) > 0);
  const monthlyIncomeBrutto = incomeItems.reduce((s, x) => s + x.count * x.einnahmen, 0);
  const feeAbzug = vermietungDurchCoMod ? incomeItems.reduce((s, x) => s + x.count * x.einnahmen * x.fee, 0) : 0;
  const monthlyIncomeNetto = monthlyIncomeBrutto - feeAbzug;
  const cashflowNetto = monthlyIncomeNetto - monatlichGesamt;
  const cashflowPositive = cashflowNetto >= 0;

  const anzahlung = lineItems.reduce((s, x) => {
    const basis = x.usage === 'p' ? x.brutto : x.netto;
    return s + x.count * basis * ANZ_PCT;
  }, 0) + einmaligGesamtBrutto * ANZ_PCT;

  return {
    lineItems, privatItems, gewerbItems, incomeItems,
    countPrivat, countGewerb, countTotal, einheitenPrivat, einheitenGewerb, einheitenTotal, gesamtNUF, gesamtBGF, nufPrivat, nufGewerb,
    bruttoPrivat, nettoGewerb, rabattPct, nextStaffel,
    effPrivat, effGewerbNetto, effGewerbBrutto,
    kfwBasis, kfwRate, glsBasis, glsRate,
    plattformBasis, plattformRate, plattformRateEff, steuerentlastung, restwertEUR,
    finanzierungMonat, monatlichGesamt, anzahlung,
    bruttoGesamt: effPrivat + effGewerbBrutto,
    monthlyIncomeBrutto, monthlyIncomeNetto, feeAbzug,
    cashflowNetto, cashflowPositive, hasIncome: incomeItems.length > 0,
    nebenkosten, nebenkostenMonatGesamt,
    einmaligGesamtBrutto, einmaligProModul, einmaligDetail,
    mindestflaeche,
  };
}

/* ============================================================================
   FORMAT + PRIMITIVES
   ============================================================================ */

const fmtEUR = (n) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n || 0);
const fmtEUR2 = (n) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
const fmtPct = (n) => new Intl.NumberFormat('de-DE', { style: 'percent', maximumFractionDigits: 1 }).format(n || 0);
const fmtNum = (n) => new Intl.NumberFormat('de-DE').format(n || 0);

function FontStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..700,0..100&family=DM+Sans:wght@300..700&display=swap');
      .font-display { font-family: 'Fraunces', Georgia, serif; font-variation-settings: "SOFT" 60; }
      .font-body { font-family: 'DM Sans', system-ui, sans-serif; }
      .num { font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
      input[type="range"] { accent-color: #3D5446; }
      .scrollbar-none::-webkit-scrollbar { display: none; }
      .scrollbar-none { scrollbar-width: none; }
    `}</style>
  );
}

function Button({ children, variant = 'primary', onClick, disabled, className = '', ...rest }) {
  const base = 'inline-flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-body';
  const styles = {
    primary: 'bg-[#3D5446] text-[#F8F5F0] hover:bg-[#2C3D33]',
    secondary: 'border border-[#1C1C1A]/20 text-[#1C1C1A] hover:bg-[#1C1C1A]/5',
    inverse: 'bg-[#F8F5F0] text-[#1C1C1A] hover:bg-white',
  };
  return <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`} {...rest}>{children}</button>;
}

function NumberInput({ value, onChange, placeholder, className = '' }) {
  const [local, setLocal] = useState(value === 0 || value == null ? '' : String(value));
  useEffect(() => {
    setLocal(prev => {
      const prevNum = prev === '' ? 0 : parseFloat(prev);
      if (prevNum !== value) return value === 0 || value == null ? '' : String(value);
      return prev;
    });
  }, [value]);
  function handle(e) {
    let raw = e.target.value.replace(/[^\d]/g, '');
    raw = raw.replace(/^0+(?=\d)/, '');
    setLocal(raw);
    onChange(raw === '' ? 0 : parseInt(raw, 10));
  }
  return <input type="text" inputMode="numeric" value={local} onChange={handle} placeholder={placeholder}
    className={`font-body num focus:outline-none ${className}`} />;
}

function FieldLabel({ children, required, hint }) {
  return (
    <div className="flex items-baseline justify-between mb-2 gap-2">
      <label className="font-body text-sm text-[#1C1C1A] flex items-center gap-1.5">
        {children}
        {required
          ? <span className="text-[#B0452C] font-medium">*</span>
          : <span className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] bg-[#1C1C1A]/5 px-1.5 py-0.5">optional</span>}
      </label>
      {hint && <span className="font-body text-xs text-[#6B6961]">{hint}</span>}
    </div>
  );
}

function StepIndicator({ currentStep, onJump }) {
  const steps = ['Auswahl', 'Module', 'Finanzierung', 'Anfrage'];
  return (
    <div className="flex items-center gap-3 font-body text-xs tracking-wider uppercase">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-3">
          <button onClick={() => i < currentStep && onJump(i)} disabled={i >= currentStep}
            className={`flex items-center gap-2 transition-colors ${i === currentStep ? 'text-[#1C1C1A]' : i < currentStep ? 'text-[#6B6961] hover:text-[#1C1C1A] cursor-pointer' : 'text-[#6B6961]/40 cursor-default'}`}>
            <span className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentStep ? 'bg-[#3D5446] w-6' : i < currentStep ? 'bg-[#6B6961]' : 'bg-[#6B6961]/30'}`} />
            <span>{label}</span>
          </button>
          {i < steps.length - 1 && <span className="text-[#6B6961]/30">·</span>}
        </div>
      ))}
    </div>
  );
}

function Header({ step, onJump, view, setView }) {
  return (
    <header className="border-b border-[#1C1C1A]/10 bg-[#F8F5F0]/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl tracking-tight">CoMod</span>
          <span className="font-body text-xs text-[#6B6961] tracking-[0.2em] uppercase border-l border-[#1C1C1A]/15 pl-3 hidden md:inline">Konfigurator</span>
        </div>
        {view === 'customer' && step < 4 && <div className="hidden lg:block"><StepIndicator currentStep={step} onJump={onJump} /></div>}
        <button onClick={() => setView(view === 'customer' ? 'admin' : 'customer')}
          className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] transition-colors flex items-center gap-1.5">
          {view === 'customer' ? <><Settings className="w-3.5 h-3.5" /> Admin</> : <><ChevronLeft className="w-3.5 h-3.5" /> Konfigurator</>}
        </button>
      </div>
    </header>
  );
}

function ModuleIcon({ nuf }) {
  const ratio = Math.min(nuf / 96, 1);
  const w = 44 + (16 * ratio);
  const h = 32 + (10 * ratio);
  return (
    <div className="shrink-0 w-16 h-16 bg-[#F8F5F0] rounded-sm flex items-center justify-center border border-[#1C1C1A]/8">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
        <rect x="1" y="1" width={w-2} height={h-2} stroke="#3D5446" strokeWidth="1" fill="none"/>
        <line x1={w*0.62} y1="1" x2={w*0.62} y2={h-1} stroke="#3D5446" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5"/>
        <line x1={w*0.62} y1={h*0.55} x2={w-1} y2={h*0.55} stroke="#3D5446" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5"/>
      </svg>
    </div>
  );
}

/* ============================================================================
   STEPS
   ============================================================================ */

function WelcomeStep({ onSelect }) {
  const options = [
    { id: 'privat', icon: Home, title: 'Privat', subtitle: 'Eigenes Wohnen, optional gewerbliche Erweiterung',
      desc: 'Module für die private Nutzung — auf Deinem eigenen Grundstück oder als Teil eines unserer Projekte. Auch gewerbliche Module möglich (z. B. Praxis, Büro).' },
    { id: 'gewerblich', icon: Building2, title: 'Gewerblich', subtitle: 'Tourismus, Mitarbeiter, Investment',
      desc: 'Du hast bereits eine Fläche oder suchst noch? Wir berechnen den Mindestflächenbedarf — oder die volle Wirtschaftlichkeit, wenn Du Deine Fläche kennst.' },
  ];
  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <div className="mb-16">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-6">Willkommen</p>
        <h1 className="font-display text-5xl md:text-6xl leading-tight tracking-tight mb-6">
          Was passt zu Dir<span className="text-[#3D5446]">,</span><br/>
          <em className="font-display">erzähl es uns kurz</em><span className="opacity-40"> …</span>
        </h1>
        <p className="font-body text-lg text-[#6B6961] max-w-2xl leading-relaxed">
          In wenigen Schritten konfigurierst Du Dein CoMod-Setup, siehst die Kosten, die monatliche Belastung und kannst direkt ein unverbindliches Angebot anfordern.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {options.map(o => {
          const Icon = o.icon;
          return (
            <button key={o.id} onClick={() => onSelect(o.id)}
              className="group text-left bg-white border border-[#1C1C1A]/10 hover:border-[#3D5446] p-10 transition-all duration-300 hover:shadow-[0_8px_30px_-12px_rgba(60,84,70,0.25)]">
              <div className="w-14 h-14 rounded-full bg-[#3D5446]/5 group-hover:bg-[#3D5446]/10 flex items-center justify-center mb-6 transition-colors">
                <Icon className="w-6 h-6 text-[#3D5446]" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-3xl mb-2">{o.title}</h3>
              <p className="font-body text-xs tracking-wider uppercase text-[#6B6961] mb-4">{o.subtitle}</p>
              <p className="font-body text-sm text-[#1C1C1A]/70 leading-relaxed mb-6">{o.desc}</p>
              <div className="flex items-center gap-2 font-body text-sm text-[#3D5446] opacity-0 group-hover:opacity-100 transition-opacity">
                Weiter <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-16 pt-8 border-t border-[#1C1C1A]/10 flex items-center gap-3 text-sm font-body text-[#6B6961]">
        <Sparkles className="w-4 h-4 text-[#A88B5A]" strokeWidth={1.5} />
        <span>Test-Modus aktiv — keine echten Daten werden übertragen.</span>
      </div>
    </div>
  );
}

function PrivatModeStep({ onSelectMode, onBack }) {
  const options = [
    { id: 'eigen', icon: MapPin, title: 'Eigenes Grundstück', subtitle: 'Module auf Deiner Fläche',
      desc: 'Du hast oder planst ein eigenes Grundstück. Du bekommst Modulpreise plus die einmaligen Pflicht-Projektkosten.' },
    { id: 'projekt', icon: FolderOpen, title: 'Einem CoMod-Projekt anschließen', subtitle: 'Mit Rabatten und Quartiers-Vorteilen',
      desc: 'Du wirst Teil eines unserer kuratierten Projekte. Mit Projektrabatt, geringerer Umlage und ggf. Einnahmen aus Gemeinschaftsmodulen.' },
  ];
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <button onClick={onBack} className="font-body text-sm text-[#6B6961] hover:text-[#1C1C1A] flex items-center gap-1.5 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Zurück
      </button>
      <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-3">Privatkunde</p>
      <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-3">
        Wo sollen Deine <em>Module</em> stehen<span className="opacity-40"> …</span>
      </h1>
      <p className="font-body text-base text-[#6B6961] mb-10 max-w-2xl">
        Du hast zwei Wege: eigenes Grundstück oder einem unserer kuratierten Projekte beitreten.
      </p>
      <div className="grid md:grid-cols-2 gap-5">
        {options.map(o => {
          const Icon = o.icon;
          return (
            <button key={o.id} onClick={() => onSelectMode(o.id)}
              className="group text-left bg-white border border-[#1C1C1A]/10 hover:border-[#3D5446] p-8 transition-all duration-300 hover:shadow-[0_8px_30px_-12px_rgba(60,84,70,0.25)]">
              <div className="w-12 h-12 rounded-full bg-[#3D5446]/5 group-hover:bg-[#3D5446]/10 flex items-center justify-center mb-6 transition-colors">
                <Icon className="w-5 h-5 text-[#3D5446]" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-1">{o.title}</h3>
              <p className="font-body text-xs tracking-wider uppercase text-[#6B6961] mb-4">{o.subtitle}</p>
              <p className="font-body text-sm text-[#1C1C1A]/70 leading-relaxed mb-6">{o.desc}</p>
              <div className="flex items-center gap-2 font-body text-sm text-[#3D5446] opacity-0 group-hover:opacity-100 transition-opacity">
                Auswählen <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProjectPickerStep({ selectedProject, onSelect, onBack }) {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <button onClick={onBack} className="font-body text-sm text-[#6B6961] hover:text-[#1C1C1A] flex items-center gap-1.5 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Zurück
      </button>
      <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-3">Privat — Projekt-Zuordnung</p>
      <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-3">
        Wähle Dein <em>CoMod-Projekt</em><span className="opacity-40"> …</span>
      </h1>
      <p className="font-body text-base text-[#6B6961] mb-8 max-w-2xl">
        Du wirst Teil eines Quartiers — mit klar definierten Eckdaten, geringeren Umlagen und ggf. Einnahmen aus Gemeinschaftsmodulen.
      </p>
      <div className="mb-10 bg-[#FBF7EF] border border-[#A88B5A]/30 p-4 flex gap-3 items-start max-w-3xl">
        <Info className="w-5 h-5 text-[#A88B5A] shrink-0 mt-0.5" strokeWidth={1.5} />
        <div className="space-y-1">
          <p className="font-body text-sm text-[#1C1C1A]">
            <span className="font-medium">Alle Umlagen kalkuliert auf die Ziel-Modulanzahl</span> des Projekts.
          </p>
          <p className="font-body text-xs text-[#6B6961] leading-relaxed">
            Wir geben das Projekt erst frei, wenn die Ziel-Modulanzahl erreicht ist. Bei höherer tatsächlicher Auslastung verringern sich Deine Umlagen anteilig — schlechter werden sie nicht.
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {PROJECTS_TEMPLATES.map(p => (
          <button key={p.id} onClick={() => onSelect(p)}
            className={`text-left bg-white border p-8 transition-all duration-300 ${selectedProject?.id === p.id ? 'border-[#3D5446] shadow-[0_8px_30px_-12px_rgba(60,84,70,0.25)]' : 'border-[#1C1C1A]/10 hover:border-[#3D5446]/50'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-2xl mb-1">{p.name}</h3>
                <p className="font-body text-sm text-[#6B6961]">{p.location}</p>
              </div>
              {selectedProject?.id === p.id && <div className="w-6 h-6 rounded-full bg-[#3D5446] flex items-center justify-center"><Check className="w-3.5 h-3.5 text-[#F8F5F0]" /></div>}
            </div>
            <p className="font-body text-sm text-[#1C1C1A]/70 leading-relaxed mb-3">{p.description}</p>
            <p className="font-body text-xs text-[#A88B5A] leading-relaxed mb-4 italic">{p.description2}</p>
            <div className="flex gap-4 mb-4 font-body text-xs text-[#6B6961]">
              <span><span className="num text-[#1C1C1A]">{p.zielModulAnzahl}</span> Module Zielgröße</span>
              <span className="opacity-50">·</span>
              <span>max. <span className="num text-[#1C1C1A]">{p.maxModulAnzahl}</span> möglich</span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#1C1C1A]/10">
              <div>
                <p className="font-body text-[10px] uppercase tracking-wider text-[#6B6961] mb-1">Projektkosten</p>
                <p className="font-display text-base num">{fmtEUR(p.umlageProModulEinmalig)}</p>
                <p className="font-body text-[10px] text-[#6B6961]">/Modul einm.</p>
              </div>
              <div>
                <p className="font-body text-[10px] uppercase tracking-wider text-[#6B6961] mb-1">Rabatt</p>
                <p className="font-display text-base num text-[#3D5446]">+{fmtPct(p.projektrabatt)}</p>
              </div>
              <div>
                <p className="font-body text-[10px] uppercase tracking-wider text-[#6B6961] mb-1">Pacht-Umlage</p>
                {p.pachtJahr > 0 ? (
                  <>
                    <p className="font-display text-base num">{fmtEUR2(p.pachtJahr / (p.zielModulAnzahl || 1) / ZIEL_MODUL_NUF / 12)}</p>
                    <p className="font-body text-[10px] text-[#6B6961]">/m²/Mt. netto{p.pachtGewerblich ? ' (+19 % bei privat)' : ''}</p>
                  </>
                ) : <p className="font-display text-base num">—</p>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ModulartStep({ onSelect, onBack }) {
  const options = [
    { id: 'privat', icon: Home, title: 'Private Module',
      subtitle: 'Wohnen — KfW-förderfähig',
      desc: 'Wohnmodule für Dich, Deine Familie oder als zusätzliche Wohneinheit. Finanzierung über KfW & GLS mit Tilgungsnachlass.',
      finanzhinweis: 'KfW + GLS' },
    { id: 'business', icon: Briefcase, title: 'Module für Dein Business',
      subtitle: 'Lager, Büro, Praxis, Studio',
      desc: 'Gewerbliche Module für Selbstständige, Freiberufler oder Investments. Finanzierung über unsere Plattform — mit Steuervorteilen wie AfA und Vorsteuerabzug.',
      finanzhinweis: 'Plattform-Finanzierung' },
    { id: 'beides', icon: Users, title: 'Beides',
      subtitle: 'Privatwohnen UND Business',
      desc: 'Z. B. Wohnung für die Familie + Büro oder Praxis. Beide Modul-Arten parallel — mit der jeweils passenden Finanzierungslogik.',
      finanzhinweis: 'KfW + GLS + Plattform' },
  ];
  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <button onClick={onBack} className="font-body text-sm text-[#6B6961] hover:text-[#1C1C1A] flex items-center gap-1.5 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Zurück
      </button>
      <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-3">Modul-Art</p>
      <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-3">
        Welche <em>Art von Modulen</em><span className="opacity-40"> …</span>
      </h1>
      <p className="font-body text-base text-[#6B6961] mb-10 max-w-2xl">
        Auch auf einem privaten Grundstück oder in einem Projekt lassen sich Wohnmodule und gewerbliche Module kombinieren — die Finanzierung passen wir dann automatisch an.
      </p>
      <div className="grid md:grid-cols-3 gap-5">
        {options.map(o => {
          const Icon = o.icon;
          return (
            <button key={o.id} onClick={() => onSelect(o.id)}
              className="group text-left bg-white border border-[#1C1C1A]/10 hover:border-[#3D5446] p-7 transition-all duration-300 hover:shadow-[0_8px_30px_-12px_rgba(60,84,70,0.25)]">
              <div className="w-12 h-12 rounded-full bg-[#3D5446]/5 group-hover:bg-[#3D5446]/10 flex items-center justify-center mb-5 transition-colors">
                <Icon className="w-5 h-5 text-[#3D5446]" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-1">{o.title}</h3>
              <p className="font-body text-xs tracking-wider uppercase text-[#6B6961] mb-3">{o.subtitle}</p>
              <p className="font-body text-sm text-[#1C1C1A]/70 leading-relaxed mb-5">{o.desc}</p>
              <div className="pt-3 border-t border-[#1C1C1A]/10 flex items-center justify-between">
                <p className="font-body text-[10px] uppercase tracking-wider text-[#A88B5A]">{o.finanzhinweis}</p>
                <ArrowRight className="w-4 h-4 text-[#3D5446] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GewerbeConfigStep({ config, setConfig, onContinue, onBack }) {
  // Pflichtfeld-Check je nach Pfad
  const hasFlaecheData = config.flaecheStatus === 'ja'
    ? config.grundstueckGroesse > 0
    : (config.flaecheStatus === 'suche_selbst' || config.flaecheStatus === 'sucht_fuer_mich')
      ? config.gewuenschteModulAnzahl > 0
      : false;

  const pflichtfelderOk = config.flaecheStatus !== null
    && hasFlaecheData
    && config.geschosse > 0
    && config.zielModulAnzahl > 0
    && (config.flaecheStatus !== 'ja' || config.hasPacht !== null)
    && (config.flaecheStatus !== 'ja' || !config.hasPacht || (config.pachtJahr > 0 && config.pachtGewerblich !== null));

  function toggleOption(id) {
    setConfig(c => ({ ...c, activeOptionen: { ...c.activeOptionen, [id]: !c.activeOptionen[id] } }));
  }

  // Reset abhängiger Felder bei Status-Wechsel
  function setFlaecheStatus(status) {
    setConfig(c => ({
      ...c,
      flaecheStatus: status,
      grundstueckGroesse: status === 'ja' ? c.grundstueckGroesse : 0,
      gewuenschteModulAnzahl: status !== 'ja' ? c.gewuenschteModulAnzahl : 0,
      // Reset Folge-Felder, weil sich die Berechnung ändert
      geschosse: 0,
      zielModulAnzahl: 0,
      geschossVerteilung: [],
      hasPacht: status === 'ja' ? c.hasPacht : null,
    }));
  }

  // Berechnung der max. Module
  const maxModuleData = config.flaecheStatus === 'ja' && config.grundstueckGroesse > 0 && config.geschosse > 0
    ? calcMaxModule({ grundstueckGroesse: config.grundstueckGroesse, geschosse: config.geschosse })
    : null;

  // Bei "ich suche": Mindestflächenberechnung rückwärts
  const mindestflaecheData = (config.flaecheStatus === 'suche_selbst' || config.flaecheStatus === 'sucht_fuer_mich')
    && config.gewuenschteModulAnzahl > 0 && config.geschosse > 0
    ? calcMindestflaecheFuerModule({ modulAnzahl: config.gewuenschteModulAnzahl, geschosse: config.geschosse })
    : null;

  // Maximum Zielwert für den Slider
  const maxZielwert = maxModuleData ? maxModuleData.maxGesamt
    : (config.gewuenschteModulAnzahl > 0 ? config.gewuenschteModulAnzahl : 0);

  // Bei Geschoss-Auswahl: Zielwert auf Max setzen + Default-Verteilung
  function setGeschosse(n) {
    setConfig(c => {
      const newConfig = { ...c, geschosse: n };
      let max;
      if (c.flaecheStatus === 'ja' && c.grundstueckGroesse > 0) {
        const d = calcMaxModule({ grundstueckGroesse: c.grundstueckGroesse, geschosse: n });
        max = d.maxGesamt;
      } else if (c.gewuenschteModulAnzahl > 0) {
        max = c.gewuenschteModulAnzahl;
      } else {
        max = 0;
      }
      newConfig.zielModulAnzahl = max;
      newConfig.geschossVerteilung = defaultGeschossVerteilung(max, n);
      return newConfig;
    });
  }

  // Zielwert ändern: Default-Verteilung neu setzen
  function setZielwert(v) {
    setConfig(c => ({
      ...c,
      zielModulAnzahl: v,
      geschossVerteilung: defaultGeschossVerteilung(v, c.geschosse),
    }));
  }

  // Verteilung manuell ändern
  function setVerteilungWert(idx, wert) {
    setConfig(c => {
      const neu = [...c.geschossVerteilung];
      neu[idx] = Math.max(0, wert);
      return { ...c, geschossVerteilung: neu };
    });
  }

  const verteilung = config.geschossVerteilung || [];
  const validierung = validateGeschossVerteilung(verteilung, config.zielModulAnzahl);
  const verteilungSumme = verteilung.reduce((s, n) => s + n, 0);
  const geschossNamen = ['EG', 'OG', 'DG'];
  // Dachfläche = oberstes Geschoss × 36 m²
  const dachflaeche = verteilung.length > 0 ? verteilung[verteilung.length - 1] * ZIEL_MODUL_BGF : 0;

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <button onClick={onBack} className="font-body text-sm text-[#6B6961] hover:text-[#1C1C1A] flex items-center gap-1.5 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Zurück
      </button>
      <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-3">Gewerblich — Rahmenbedingungen</p>
      <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-3">
        Erzähl uns vom <em>Standort</em><span className="opacity-40"> …</span>
      </h1>
      <p className="font-body text-base text-[#6B6961] mb-8 max-w-2xl">
        Damit wir Dir realistische Zahlen zeigen können. Wir starten mit Deiner Flächensituation und ermitteln daraus die mögliche Modulanzahl und Geschoss-Verteilung.
      </p>
      <div className="bg-[#3D5446]/5 border border-[#3D5446]/20 px-4 py-3 mb-8 flex items-center gap-2.5 max-w-2xl">
        <span className="text-[#B0452C] font-medium text-base">*</span>
        <p className="font-body text-xs text-[#6B6961]">Pflichtangaben mit Stern. Diese erste Kostenindikation verfeinern wir gemeinsam im Beratungsgespräch.</p>
      </div>

      <div className="space-y-6">

        {/* SCHRITT 1: Fläche-Status */}
        <div className="bg-white border border-[#1C1C1A]/10 p-7 space-y-4">
          <h3 className="font-display text-xl flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#3D5446] text-[#F8F5F0] flex items-center justify-center text-xs font-body">1</span> Fläche</h3>
          <FieldLabel required>Wie sieht's mit der Fläche aus?</FieldLabel>
          <div className="grid md:grid-cols-3 gap-3">
            <button onClick={() => setFlaecheStatus('ja')}
              className={`p-4 border text-left transition-colors ${config.flaecheStatus === 'ja' ? 'border-[#3D5446] bg-[#3D5446]/10 ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0]' : 'border-[#1C1C1A]/15 hover:border-[#1C1C1A]/30'}`}>
              <MapPin className="w-5 h-5 text-[#3D5446] mb-2" strokeWidth={1.5} />
              <p className="font-body text-sm text-[#1C1C1A] font-medium">Ja, ich habe</p>
              <p className="font-body text-xs text-[#6B6961] mt-1">Konkretes Grundstück vorhanden</p>
            </button>
            <button onClick={() => setFlaecheStatus('suche_selbst')}
              className={`p-4 border text-left transition-colors ${config.flaecheStatus === 'suche_selbst' ? 'border-[#3D5446] bg-[#3D5446]/10 ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0]' : 'border-[#1C1C1A]/15 hover:border-[#1C1C1A]/30'}`}>
              <MapPin className="w-5 h-5 text-[#3D5446] mb-2" strokeWidth={1.5} />
              <p className="font-body text-sm text-[#1C1C1A] font-medium">Noch nicht — ich suche</p>
              <p className="font-body text-xs text-[#6B6961] mt-1">Ich kümmere mich selbst um die Fläche</p>
            </button>
            <button onClick={() => setFlaecheStatus('sucht_fuer_mich')}
              className={`p-4 border text-left transition-colors ${config.flaecheStatus === 'sucht_fuer_mich' ? 'border-[#3D5446] bg-[#3D5446]/10 ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0]' : 'border-[#1C1C1A]/15 hover:border-[#1C1C1A]/30'}`}>
              <MapPin className="w-5 h-5 text-[#A88B5A] mb-2" strokeWidth={1.5} />
              <p className="font-body text-sm text-[#1C1C1A] font-medium">Bitte sucht eine Fläche für mich</p>
              <p className="font-body text-xs text-[#6B6961] mt-1">Ihr unterstützt mich bei der Suche</p>
            </button>
          </div>

          {/* Eingabefeld je nach Auswahl */}
          {config.flaecheStatus === 'ja' && (
            <div className="pt-4 border-t border-[#1C1C1A]/8">
              <FieldLabel required>Grundstücksgröße in m²</FieldLabel>
              <NumberInput value={config.grundstueckGroesse} onChange={v => setConfig(c => ({...c, grundstueckGroesse: v, geschosse: 0, zielModulAnzahl: 0, geschossVerteilung: []}))}
                placeholder="z. B. 2000"
                className="w-full px-4 py-2.5 bg-[#F8F5F0] border border-[#1C1C1A]/15 text-sm focus:border-[#3D5446]" />
            </div>
          )}
          {(config.flaecheStatus === 'suche_selbst' || config.flaecheStatus === 'sucht_fuer_mich') && (
            <div className="pt-4 border-t border-[#1C1C1A]/8 space-y-3">
              <FieldLabel required hint="Daraus berechnen wir den Mindestflächenbedarf">Wie viele Module wünschst Du Dir?</FieldLabel>
              <NumberInput value={config.gewuenschteModulAnzahl} onChange={v => setConfig(c => ({...c, gewuenschteModulAnzahl: v, geschosse: 0, zielModulAnzahl: 0, geschossVerteilung: []}))}
                placeholder="z. B. 50"
                className="w-full px-4 py-2.5 bg-[#F8F5F0] border border-[#1C1C1A]/15 text-sm focus:border-[#3D5446]" />
              {config.flaecheStatus === 'sucht_fuer_mich' && (
                <div className="bg-[#FBF7EF] border border-[#A88B5A]/30 p-3 flex gap-2 items-start">
                  <Info className="w-4 h-4 text-[#A88B5A] shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="font-body text-xs text-[#1C1C1A]/80 leading-relaxed">
                    Wir suchen passende Flächen in Deiner Wunschregion. Details besprechen wir gerne persönlich.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SCHRITT 2: Geschossigkeit */}
        {hasFlaecheData && (
          <div className="bg-white border border-[#1C1C1A]/10 p-7 space-y-4">
            <h3 className="font-display text-xl flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#3D5446] text-[#F8F5F0] flex items-center justify-center text-xs font-body">2</span> Geschossigkeit</h3>
            <FieldLabel required hint="Beeinflusst die maximale Modulanzahl">Wie viele Geschosse sind geplant?</FieldLabel>
            <div className="grid grid-cols-3 gap-3">
              {[
                { n: 1, label: '1 Geschoss', sub: 'eingeschossig' },
                { n: 2, label: '2 Geschosse', sub: 'EG + OG' },
                { n: 3, label: '3 Geschosse', sub: 'EG + OG + DG' },
              ].map(g => (
                <button key={g.n} onClick={() => setGeschosse(g.n)}
                  className={`p-4 border text-left transition-colors flex items-center gap-3 ${config.geschosse === g.n ? 'border-[#3D5446] bg-[#3D5446]/10 ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0]' : 'border-[#1C1C1A]/15 hover:border-[#1C1C1A]/30'}`}>
                  <Layers className="w-5 h-5 text-[#3D5446]" strokeWidth={1.5} />
                  <div><p className="font-body text-sm text-[#1C1C1A]">{g.label}</p><p className="font-body text-xs text-[#6B6961]">{g.sub}</p></div>
                </button>
              ))}
            </div>

            {/* Berechnete Kapazität anzeigen */}
            {maxModuleData && config.geschosse > 0 && (
              <div className="mt-3 bg-[#3D5446]/5 border border-[#3D5446]/15 p-4">
                <p className="font-body text-xs uppercase tracking-wider text-[#3D5446] mb-2">Berechnete Kapazität</p>
                <div className="font-body text-sm text-[#1C1C1A] space-y-1">
                  <p><span className="num">{config.grundstueckGroesse} m²</span> × {Math.round(BEBAUUNGSGRAD * 100)} % bebaubar ÷ {ZIEL_MODUL_BGF} m² BGF = <span className="num font-medium">{maxModuleData.maxProGeschoss}</span> Module / Geschoss</p>
                  <p><span className="num font-medium">{maxModuleData.maxGesamt}</span> Module insgesamt möglich (bei {config.geschosse} {config.geschosse === 1 ? 'Geschoss' : 'Geschossen'})</p>
                </div>
              </div>
            )}
            {mindestflaecheData && config.geschosse > 0 && (
              <div className="mt-3 bg-[#FBF7EF] border border-[#A88B5A]/30 p-4">
                <p className="font-body text-xs uppercase tracking-wider text-[#A88B5A] mb-2">Mindestflächenbedarf</p>
                <div className="font-body text-sm text-[#1C1C1A] space-y-1">
                  <p>ceil(<span className="num">{config.gewuenschteModulAnzahl}</span> ÷ <span className="num">{config.geschosse}</span>) Module/Geschoss × {ZIEL_MODUL_BGF} m² BGF</p>
                  <p>= <span className="num font-medium">{fmtNum(mindestflaecheData.gebaeudeflaeche)} m²</span> Gebäudefläche</p>
                  <p>÷ {Math.round(BEBAUUNGSGRAD * 100)} % Bebauungsgrad = <span className="num font-medium">{fmtNum(mindestflaecheData.mindestGrundstueck)} m²</span> Mindestgrundstück</p>
                  <p className="text-xs text-[#6B6961] italic pt-1">Die übrigen {Math.round((1 - BEBAUUNGSGRAD) * 100)} % decken Wege, Parkplätze und Grünflächen ab.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SCHRITT 3: Zielwert + Geschoss-Verteilung */}
        {config.geschosse > 0 && maxZielwert > 0 && (
          <div className="bg-white border border-[#1C1C1A]/10 p-7 space-y-5">
            <h3 className="font-display text-xl flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#3D5446] text-[#F8F5F0] flex items-center justify-center text-xs font-body">3</span> Zielwert & Verteilung</h3>

            <div>
              <FieldLabel required hint={`Default = Maximum von ${maxZielwert}`}>Ziel-Modulanzahl</FieldLabel>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-display text-2xl num text-[#3D5446]">{config.zielModulAnzahl}</span>
                <span className="font-body text-xs text-[#6B6961]">max. {maxZielwert}</span>
              </div>
              <input type="range" min={1} max={maxZielwert} step={1}
                value={config.zielModulAnzahl}
                onChange={e => setZielwert(parseInt(e.target.value, 10))}
                className="w-full" />
              <p className="font-body text-xs text-[#6B6961] mt-2">Du kannst weniger Module einplanen, wenn das Projekt kleiner werden soll.</p>
            </div>

            {/* Verteilung auf Geschosse */}
            {config.geschosse > 1 && verteilung.length > 0 && (
              <div className="pt-4 border-t border-[#1C1C1A]/8">
                <FieldLabel required={false} hint="Default: gleichmäßig, von unten nach oben">Verteilung auf Geschosse</FieldLabel>
                <p className="font-body text-xs text-[#6B6961] mb-3">Regel: EG ≥ OG ≥ DG. Die Summe darf den Zielwert nicht überschreiten.</p>
                <div className={`grid gap-3 ${config.geschosse === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {verteilung.map((wert, idx) => (
                    <div key={idx} className="bg-[#F8F5F0] border border-[#1C1C1A]/10 p-3">
                      <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-1">{geschossNamen[idx]}</p>
                      <NumberInput value={wert} onChange={v => setVerteilungWert(idx, v)}
                        placeholder="0"
                        className="w-full px-2 py-1.5 bg-white border border-[#1C1C1A]/15 text-lg font-display focus:border-[#3D5446]" />
                      <p className="font-body text-[10px] text-[#6B6961] mt-1">Module</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 font-body text-sm">
                  <span className="text-[#6B6961]">Summe Verteilung: <span className="num text-[#1C1C1A]">{verteilungSumme}</span> / {config.zielModulAnzahl}</span>
                  {validierung.valid
                    ? <span className="text-[#3D5446] flex items-center gap-1"><Check className="w-3.5 h-3.5" strokeWidth={2.5}/> gültig</span>
                    : <span className="text-[#B0452C] text-xs">{validierung.error}</span>}
                </div>
              </div>
            )}

            {/* Abgeleitete Pauschalkosten + Dachfläche */}
            {validierung.valid && verteilungSumme > 0 && (
              <div className="pt-4 border-t border-[#1C1C1A]/8 space-y-3">
                <p className="font-body text-xs uppercase tracking-wider text-[#6B6961]">Abgeleitete Pauschalpositionen</p>
                <div className="space-y-2 font-body text-sm">
                  {(verteilung[0] || 0) > 0 && (
                    <div className="flex justify-between py-2 border-b border-[#1C1C1A]/8">
                      <div>
                        <p className="text-[#1C1C1A]">Terrassen (EG-Module)</p>
                        <p className="text-xs text-[#6B6961]">{verteilung[0]} × {fmtEUR(KOSTEN_TERRASSE_PRO_MODUL)}</p>
                      </div>
                      <span className="num shrink-0">{fmtEUR(verteilung[0] * KOSTEN_TERRASSE_PRO_MODUL)}</span>
                    </div>
                  )}
                  {verteilung.slice(1).reduce((s, n) => s + n, 0) > 0 && (
                    <div className="flex justify-between py-2 border-b border-[#1C1C1A]/8">
                      <div>
                        <p className="text-[#1C1C1A]">Treppen & Laubengänge (OG/DG-Module)</p>
                        <p className="text-xs text-[#6B6961]">{verteilung.slice(1).reduce((s, n) => s + n, 0)} × {fmtEUR(KOSTEN_TREPPEN_LAUBENGANG_PRO_MODUL)}</p>
                      </div>
                      <span className="num shrink-0">{fmtEUR(verteilung.slice(1).reduce((s, n) => s + n, 0) * KOSTEN_TREPPEN_LAUBENGANG_PRO_MODUL)}</span>
                    </div>
                  )}
                  {dachflaeche > 0 && (
                    <div className="flex justify-between py-2 bg-[#3D5446]/5 px-3 -mx-3">
                      <div>
                        <p className="text-[#1C1C1A]">Dachfläche (oberstes Geschoss)</p>
                        <p className="text-xs text-[#6B6961]">{verteilung[verteilung.length-1]} Module × {ZIEL_MODUL_BGF} m² — verfügbar für PV & Begrünung</p>
                      </div>
                      <span className="num shrink-0 text-[#3D5446]">{fmtNum(dachflaeche)} m²</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SCHRITT 4: Pacht (nur bei eigener Fläche) */}
        {config.flaecheStatus === 'ja' && config.zielModulAnzahl > 0 && (
          <div className="bg-white border border-[#1C1C1A]/10 p-7 space-y-6">
            <h3 className="font-display text-xl flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#3D5446] text-[#F8F5F0] flex items-center justify-center text-xs font-body">4</span> Vorarbeiten & Pacht</h3>

            <div>
              <FieldLabel required>Möchtest Du Erschließung, Wege & Begrünung im Detail angeben?</FieldLabel>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setConfig(c => ({...c, detailKosten: true}))}
                  className={`px-4 py-2 font-body text-sm border transition-colors ${config.detailKosten ? 'border-[#3D5446] bg-[#3D5446]/10 text-[#3D5446] ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Ja, ich weiß, was anfällt</button>
                <button onClick={() => setConfig(c => ({...c, detailKosten: false}))}
                  className={`px-4 py-2 font-body text-sm border transition-colors ${config.detailKosten === false ? 'border-[#3D5446] bg-[#3D5446]/10 text-[#3D5446] ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Nein — bitte schätzen</button>
              </div>
              <p className="font-body text-xs text-[#6B6961]">Bei Schätzung nehmen wir Erschließung, Wege und Begrünung pauschal an — Abriss/Entsorgung musst Du dennoch explizit ankreuzen.</p>
              {config.detailKosten && (
                <div className="space-y-2.5 mt-4">
                  <p className="font-body text-xs uppercase tracking-wider text-[#6B6961]">Welche Vorarbeiten kommen dazu?</p>
                  {GRDST_OPTIONEN.map(opt => (
                    <label key={opt.id} className="flex items-start gap-3 cursor-pointer group">
                      <button onClick={() => toggleOption(opt.id)}
                        className={`mt-0.5 w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${config.activeOptionen[opt.id] ? 'bg-[#3D5446] border-[#3D5446]' : 'border-[#1C1C1A]/20 group-hover:border-[#3D5446]/50'}`}>
                        {config.activeOptionen[opt.id] && <Check className="w-3.5 h-3.5 text-[#F8F5F0]" strokeWidth={2.5} />}
                      </button>
                      <span className="font-body text-sm text-[#1C1C1A]">{opt.label}</span>
                    </label>
                  ))}
                </div>
              )}
              {config.detailKosten === false && (
                <div className="space-y-2.5 mt-4">
                  <p className="font-body text-xs uppercase tracking-wider text-[#6B6961]">Optional — nur falls dies dazukommt:</p>
                  {GRDST_OPTIONEN.filter(o => !o.schaetzungsfaehig).map(opt => (
                    <label key={opt.id} className="flex items-start gap-3 cursor-pointer group">
                      <button onClick={() => toggleOption(opt.id)}
                        className={`mt-0.5 w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${config.activeOptionen[opt.id] ? 'bg-[#3D5446] border-[#3D5446]' : 'border-[#1C1C1A]/20 group-hover:border-[#3D5446]/50'}`}>
                        {config.activeOptionen[opt.id] && <Check className="w-3.5 h-3.5 text-[#F8F5F0]" strokeWidth={2.5} />}
                      </button>
                      <span className="font-body text-sm text-[#1C1C1A]">{opt.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#1C1C1A]/8 space-y-4">
              <FieldLabel required>Fällt für die Fläche eine Pacht an?</FieldLabel>
              <div className="flex gap-2">
                <button onClick={() => setConfig(c => ({...c, hasPacht: true}))}
                  className={`px-4 py-2 font-body text-sm border transition-colors ${config.hasPacht ? 'border-[#3D5446] bg-[#3D5446]/10 text-[#3D5446] ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Ja, Pacht</button>
                <button onClick={() => setConfig(c => ({...c, hasPacht: false}))}
                  className={`px-4 py-2 font-body text-sm border transition-colors ${config.hasPacht === false ? 'border-[#3D5446] bg-[#3D5446]/10 text-[#3D5446] ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Nein / Eigentum</button>
              </div>
              {config.hasPacht && (
                <>
                  <div>
                    <FieldLabel required hint="€ gesamt pro Jahr">Jahrespacht gesamt</FieldLabel>
                    <div className="flex items-center gap-2">
                      <NumberInput value={config.pachtJahr} onChange={v => setConfig(c => ({...c, pachtJahr: v}))}
                        placeholder="z. B. 96000"
                        className="flex-1 w-full px-4 py-2.5 bg-[#F8F5F0] border border-[#1C1C1A]/15 text-sm focus:border-[#3D5446]" />
                      <span className="font-body text-sm text-[#6B6961]">€ / Jahr</span>
                    </div>
                  </div>
                  <div>
                    <FieldLabel required>Wird die Pacht gewerblich oder privat berechnet?</FieldLabel>
                    <div className="flex gap-2">
                      <button onClick={() => setConfig(c => ({...c, pachtGewerblich: true}))}
                        className={`px-4 py-2 font-body text-sm border transition-colors ${config.pachtGewerblich ? 'border-[#3D5446] bg-[#3D5446]/10 text-[#3D5446] ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Gewerblich (+19 % USt)</button>
                      <button onClick={() => setConfig(c => ({...c, pachtGewerblich: false}))}
                        className={`px-4 py-2 font-body text-sm border transition-colors ${config.pachtGewerblich === false ? 'border-[#3D5446] bg-[#3D5446]/10 text-[#3D5446] ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Privat (keine USt)</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button onClick={onContinue} disabled={!pflichtfelderOk || !validierung.valid}>
            Module wählen <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        {!pflichtfelderOk && <p className="font-body text-xs text-[#6B6961] text-right">Bitte alle Pflichtfelder ausfüllen</p>}
        {pflichtfelderOk && !validierung.valid && <p className="font-body text-xs text-[#B0452C] text-right">{validierung.error}</p>}
      </div>
    </div>
  );
}

/* ============================================================================
   STEP 1 — Modules mit Family-Cards + Variant-Picker + Add-Toggle
   ============================================================================ */

function VariantPicker({ products, selectedVariant, setSelectedVariant }) {
  const hasKueche = products.some(p => p.kueche);
  const hasMoebliert = products.some(p => typeof p.moebliert === 'boolean');
  const hasGroesse = products.some(p => p.groesse);

  if (!hasKueche && !hasMoebliert && !hasGroesse) return null;

  const kuechen = Array.from(new Set(products.filter(p => p.kueche).map(p => p.kueche)));
  const groessen = Array.from(new Set(products.filter(p => p.groesse).map(p => p.groesse))).sort((a,b)=>a-b);

  return (
    <div className="mt-4 pt-4 border-t border-[#1C1C1A]/8 space-y-3">
      {hasGroesse && groessen.length > 1 && (
        <div>
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#6B6961] mb-1.5">Größe</p>
          <div className="flex gap-1.5 flex-wrap">
            {groessen.map(g => (
              <button key={g} onClick={() => setSelectedVariant({...selectedVariant, groesse: g})}
                className={`px-3 py-1.5 font-body text-xs border transition-colors num ${selectedVariant.groesse === g ? 'border-[#3D5446] bg-[#3D5446]/10 text-[#3D5446] ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
                {g} m²
              </button>
            ))}
          </div>
        </div>
      )}
      {hasKueche && kuechen.length > 1 && (
        <div>
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#6B6961] mb-1.5">Küche</p>
          <div className="flex gap-1.5 flex-wrap">
            {kuechen.map(k => (
              <button key={k} onClick={() => setSelectedVariant({...selectedVariant, kueche: k})}
                className={`px-3 py-1.5 font-body text-xs border transition-colors ${selectedVariant.kueche === k ? 'border-[#3D5446] bg-[#3D5446]/10 text-[#3D5446] ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
                {k}
              </button>
            ))}
          </div>
        </div>
      )}
      {hasMoebliert && (
        <div>
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#6B6961] mb-1.5">Möblierung</p>
          <div className="flex gap-1.5 flex-wrap">
            <button onClick={() => setSelectedVariant({...selectedVariant, moebliert: false})}
              className={`px-3 py-1.5 font-body text-xs border transition-colors ${selectedVariant.moebliert === false ? 'border-[#3D5446] bg-[#3D5446]/10 text-[#3D5446] ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>Ohne Möbel</button>
            <button onClick={() => setSelectedVariant({...selectedVariant, moebliert: true})}
              className={`px-3 py-1.5 font-body text-xs border transition-colors ${selectedVariant.moebliert === true ? 'border-[#3D5446] bg-[#3D5446]/10 text-[#3D5446] ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>Möbliert</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AvailabilityToggle({ product, mode, onChange }) {
  if (!isModeToggleable(product)) return null;
  return (
    <div className="mt-3 pt-3 border-t border-[#1C1C1A]/8">
      <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#6B6961] mb-2">Nutzung dieses Moduls</p>
      <div className="flex gap-1">
        <button onClick={() => onChange('eigennutzung')}
          className={`flex-1 py-2 px-2 font-body text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 ${mode === 'eigennutzung' ? 'bg-[#3D5446] text-[#F8F5F0]' : 'border border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
          <Gift className="w-3 h-3" strokeWidth={2} /> Eigennutzung
        </button>
        <button onClick={() => onChange('einnahmen')}
          className={`flex-1 py-2 px-2 font-body text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 ${mode === 'einnahmen' ? 'bg-[#A88B5A] text-white' : 'border border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
          <TrendingUp className="w-3 h-3" strokeWidth={2} /> Vermietung
        </button>
      </div>
    </div>
  );
}

function findVariantProduct(products, variant) {
  return products.find(p => {
    if (variant.kueche !== undefined && p.kueche !== variant.kueche) return false;
    if (variant.moebliert !== undefined && typeof p.moebliert === 'boolean' && p.moebliert !== variant.moebliert) return false;
    if (variant.groesse !== undefined && p.groesse !== variant.groesse) return false;
    return true;
  });
}

// AddFamilyCard – für die zusammengeführte Add-Karte im 'Beides'-Modus
function AddFamilyCard({ selections, setSelections, einmaligProModul, hasProjectOrConfig, addUsageState, setAddUsageState }) {
  // addUsageState = 'p' | 'g' (für die ganze Add-Karte)
  const usageState = addUsageState || 'g'; // Default gewerblich (Hauptanwendungsfall)
  const familyId = usageState === 'p' ? 'add' : 'addb';
  const products = (usageState === 'p' ? PRODUCTS.privat : PRODUCTS.gewerblich).filter(p => p.family === familyId);

  const [groesse, setGroesse] = useState(32);
  const product = products.find(p => p.groesse === groesse) || products[0];
  const count = selections[product.kuerzel] || 0;

  // Wenn Toggle wechselt: alte Auswahl löschen, neue Auswahl beibehalten? Hier einfach: alle Add-Selections in der jeweils anderen Familie löschen
  function switchUsage(newUsage) {
    if (newUsage === usageState) return;
    setSelections(prev => {
      const next = { ...prev };
      const oldFamily = usageState === 'p' ? 'add' : 'addb';
      // Lösche alle Selections der alten Add-Familie
      for (const k of Object.keys(next)) {
        const p = ALL_PRODUCTS.find(x => x.kuerzel === k);
        if (p && p.family === oldFamily) delete next[k];
      }
      return next;
    });
    setAddUsageState(newUsage);
  }

  function adjust(delta) {
    setSelections(prev => {
      const next = { ...prev };
      next[product.kuerzel] = Math.max(0, (next[product.kuerzel] || 0) + delta);
      if (next[product.kuerzel] === 0) delete next[product.kuerzel];
      return next;
    });
  }

  // Total in der gesamten Add-Familie (über alle Größen)
  const familyTotal = useMemo(() => {
    const fam = usageState === 'p' ? 'add' : 'addb';
    let total = 0;
    for (const k of Object.keys(selections)) {
      const p = ALL_PRODUCTS.find(x => x.kuerzel === k);
      if (p && p.family === fam) total += selections[k];
    }
    return total;
  }, [selections, usageState]);

  const effectivePrice = product.brutto + (hasProjectOrConfig ? einmaligProModul : 0);

  return (
    <div className={`border transition-all duration-300 ${familyTotal > 0 ? 'border-[#3D5446] bg-white shadow-[0_4px_20px_-8px_rgba(60,84,70,0.15)]' : 'border-[#1C1C1A]/10 bg-white hover:border-[#1C1C1A]/25'}`}>
      <div className="p-6">
        <div className="flex gap-4 mb-4">
          <ModuleIcon nuf={product.nuf} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <h4 className="font-display text-xl leading-tight">CoMod Add</h4>
              {familyTotal > 0 && (
                <span className="font-body text-[10px] tracking-wider uppercase text-[#3D5446] bg-[#3D5446]/10 px-2 py-0.5 num">
                  {familyTotal} gewählt
                </span>
              )}
            </div>
            <p className="font-body text-xs text-[#6B6961] leading-snug">Ergänzungsmodul leer — z. B. Hobby, Lager, Praxis, Büro</p>
          </div>
        </div>

        {/* Privat / Gewerblich Toggle */}
        <div className="mt-3 pt-3 border-t border-[#1C1C1A]/8">
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#6B6961] mb-2">Nutzung & Finanzierung</p>
          <div className="flex gap-1">
            <button onClick={() => switchUsage('p')}
              className={`flex-1 py-2 px-2 font-body text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 ${usageState === 'p' ? 'bg-[#3D5446] text-[#F8F5F0]' : 'border border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
              <Home className="w-3 h-3" strokeWidth={2} /> Privat (KfW/GLS)
            </button>
            <button onClick={() => switchUsage('g')}
              className={`flex-1 py-2 px-2 font-body text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 ${usageState === 'g' ? 'bg-[#A88B5A] text-white' : 'border border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
              <Briefcase className="w-3 h-3" strokeWidth={2} /> Gewerblich (Plattform)
            </button>
          </div>
          <p className="font-body text-[11px] text-[#6B6961] mt-1.5 leading-snug">
            {usageState === 'p' ? 'Z. B. Hobby-Werkstatt, Gartenhaus. Brutto-Preis, KfW/GLS-Finanzierung.' : 'Z. B. Lager, Büro, Praxis. Netto-Preis, Plattform-Finanzierung mit Steuervorteilen.'}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-[#1C1C1A]/8">
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#6B6961] mb-1.5">Größe</p>
          <div className="flex gap-1.5 flex-wrap">
            {[12, 24, 32].map(g => (
              <button key={g} onClick={() => setGroesse(g)}
                className={`px-3 py-1.5 font-body text-xs border transition-colors num ${groesse === g ? 'border-[#3D5446] bg-[#3D5446]/10 text-[#3D5446] ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
                {g} m²
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 pt-4 mt-4 border-t border-[#1C1C1A]/8">
          <div className="space-y-1 text-xs font-body">
            <p className="text-[11px] text-[#6B6961]">Aktuelle Auswahl:</p>
            <p className="text-sm text-[#1C1C1A]">{product.kuerzel}</p>
            <p className="font-display text-xl num text-[#1C1C1A]">{fmtEUR(effectivePrice)}</p>
            {hasProjectOrConfig && <p className="text-[10px] text-[#A88B5A] tracking-wider uppercase">inkl. ant. Projektkosten</p>}
          </div>
          <div className="flex items-center gap-2">
            {count > 0 ? (
              <>
                <button onClick={() => adjust(-1)} className="w-9 h-9 rounded-full border border-[#1C1C1A]/15 hover:border-[#3D5446] hover:bg-[#3D5446]/5 flex items-center justify-center transition-colors">
                  <Minus className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <span className="font-display text-xl num w-8 text-center">{count}</span>
                <button onClick={() => adjust(1)} className="w-9 h-9 rounded-full bg-[#3D5446] hover:bg-[#2C3D33] text-[#F8F5F0] flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <button onClick={() => adjust(1)} className="font-body text-sm flex items-center gap-1.5 px-4 py-2 border border-[#1C1C1A]/15 hover:border-[#3D5446] hover:bg-[#3D5446]/5 transition-colors">
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Hinzufügen
              </button>
            )}
          </div>
        </div>

        {familyTotal > count && (
          <div className="mt-3 pt-3 border-t border-[#1C1C1A]/8">
            <p className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] mb-1.5">Alle Größen in dieser Familie</p>
            <div className="space-y-1">
              {products.filter(p => (selections[p.kuerzel] || 0) > 0).map(p => (
                <div key={p.kuerzel} className="flex justify-between gap-2 font-body text-xs">
                  <span className="text-[#6B6961]">{selections[p.kuerzel]}× <span className="text-[#1C1C1A]">{p.kuerzel}</span></span>
                  <button onClick={() => setSelections(prev => { const n = {...prev}; delete n[p.kuerzel]; return n; })}
                    className="text-[#6B6961] hover:text-[#B0452C] transition-colors text-[10px]">entfernen</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// FamilyCard – Standard für alle anderen Familien
function FamilyCard({ familyId, products, selections, setSelections, modes, setModes, einmaligProModul, hasProjectOrConfig, variantState, setVariantState }) {
  const fam = FAMILY_LABELS[familyId];
  const defaultVariant = useMemo(() => {
    const first = products[0];
    return {
      kueche: first.kueche,
      moebliert: typeof first.moebliert === 'boolean' ? first.moebliert : undefined,
      groesse: first.groesse,
    };
  }, [products]);
  const variant = variantState[familyId] || defaultVariant;
  const setVar = (newV) => setVariantState(prev => ({ ...prev, [familyId]: newV }));

  const product = findVariantProduct(products, variant) || products[0];
  const count = selections[product.kuerzel] || 0;
  const mode = isModeToggleable(product) ? (modes[product.kuerzel] || getDefaultMode(product.usage)) : getDefaultMode(product.usage);

  const familyTotal = useMemo(() => {
    let total = 0;
    for (const p of products) total += selections[p.kuerzel] || 0;
    return total;
  }, [products, selections]);

  function adjust(delta) {
    const k = product.kuerzel;
    setSelections(prev => {
      const next = { ...prev };
      next[k] = Math.max(0, (next[k] || 0) + delta);
      if (next[k] === 0) delete next[k];
      return next;
    });
  }
  function setMode(m) { setModes(prev => ({ ...prev, [product.kuerzel]: m })); }

  const effectivePrice = product.brutto + (hasProjectOrConfig ? einmaligProModul : 0);
  const showsIncome = isModeToggleable(product) && mode === 'einnahmen';

  return (
    <div className={`border transition-all duration-300 ${
      familyTotal > 0
        ? (showsIncome && product.usage === 'g' ? 'border-[#A88B5A] bg-[#FBF7EF] shadow-[0_4px_20px_-8px_rgba(168,139,90,0.25)]' : 'border-[#3D5446] bg-white shadow-[0_4px_20px_-8px_rgba(60,84,70,0.15)]')
        : 'border-[#1C1C1A]/10 bg-white hover:border-[#1C1C1A]/25'}`}>
      <div className="p-6">
        <div className="flex gap-4 mb-4">
          <ModuleIcon nuf={product.nuf} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <h4 className="font-display text-xl leading-tight">{fam.label}</h4>
              {familyTotal > 0 && (
                <span className="font-body text-[10px] tracking-wider uppercase text-[#3D5446] bg-[#3D5446]/10 px-2 py-0.5 num">{familyTotal} gewählt</span>
              )}
            </div>
            <p className="font-body text-xs text-[#6B6961] leading-snug">{fam.desc}</p>
          </div>
        </div>

        <VariantPicker products={products} selectedVariant={variant} setSelectedVariant={setVar} />

        <div className="flex items-end justify-between gap-4 pt-4 mt-4 border-t border-[#1C1C1A]/8">
          <div className="space-y-1 text-xs font-body">
            <p className="text-[11px] text-[#6B6961]">Aktuelle Auswahl:</p>
            <p className="text-sm text-[#1C1C1A]">{product.kuerzel}</p>
            <div className="flex gap-3 text-[#6B6961] text-[11px]">
              <span>{product.nuf} m² NUF</span><span>·</span><span>{product.bgf} m² BGF</span>
              {calcModulEinheiten(product) > 1 && <><span>·</span><span className="text-[#A88B5A]">{calcModulEinheiten(product)} Einheiten</span></>}
            </div>
            <p className="font-display text-xl num text-[#1C1C1A]">{fmtEUR(effectivePrice)}</p>
            {hasProjectOrConfig && <p className="text-[10px] text-[#A88B5A] tracking-wider uppercase">inkl. ant. Projektkosten</p>}
          </div>
          <div className="flex items-center gap-2">
            {count > 0 ? (
              <>
                <button onClick={() => adjust(-1)} className="w-9 h-9 rounded-full border border-[#1C1C1A]/15 hover:border-[#3D5446] hover:bg-[#3D5446]/5 flex items-center justify-center transition-colors">
                  <Minus className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <span className="font-display text-xl num w-8 text-center">{count}</span>
                <button onClick={() => adjust(1)} className="w-9 h-9 rounded-full bg-[#3D5446] hover:bg-[#2C3D33] text-[#F8F5F0] flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <button onClick={() => adjust(1)} className="font-body text-sm flex items-center gap-1.5 px-4 py-2 border border-[#1C1C1A]/15 hover:border-[#3D5446] hover:bg-[#3D5446]/5 transition-colors">
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Hinzufügen
              </button>
            )}
          </div>
        </div>

        <AvailabilityToggle product={product} mode={mode} onChange={setMode} />

        {showsIncome && (
          <div className="mt-3 px-3 py-2 bg-[#A88B5A]/10 border border-[#A88B5A]/25 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#A88B5A]" strokeWidth={2} />
              <span className="font-body text-xs text-[#1C1C1A]">Erwartete Miete / Monat</span>
            </div>
            <span className="font-display text-sm num text-[#1C1C1A]">{fmtEUR(product.einnahmen)}</span>
          </div>
        )}

        {familyTotal > count && (
          <div className="mt-3 pt-3 border-t border-[#1C1C1A]/8">
            <p className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] mb-1.5">Alle Varianten in dieser Familie</p>
            <div className="space-y-1">
              {products.filter(p => (selections[p.kuerzel] || 0) > 0).map(p => (
                <div key={p.kuerzel} className="flex justify-between gap-2 font-body text-xs">
                  <span className="text-[#6B6961]">{selections[p.kuerzel]}× <span className="text-[#1C1C1A]">{p.kuerzel}</span></span>
                  <button onClick={() => setSelections(prev => { const n = {...prev}; delete n[p.kuerzel]; return n; })}
                    className="text-[#6B6961] hover:text-[#B0452C] transition-colors text-[10px]">entfernen</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModulesStep({ modulart, project, gewerbConfig, selections, setSelections, modes, setModes, totals, onNext, onBack, addUsageState, setAddUsageState }) {
  const [variantState, setVariantState] = useState({});

  // Welche Familien sollen gezeigt werden?
  const familyIdsToShow = useMemo(() => {
    if (modulart === 'privat') return FAMILIES_PRIVAT;
    if (modulart === 'business') return FAMILIES_BUSINESS;
    // 'beides': alle Familien außer Add — Add wird durch die kombinierte AddFamilyCard ersetzt
    return [...FAMILIES_PRIVAT.filter(f => f !== 'add'),
            ...FAMILIES_BUSINESS.filter(f => f !== 'addb')];
  }, [modulart]);

  const showAddCombined = modulart === 'beides';

  const productsByFamily = useMemo(() => {
    const groups = {};
    for (const fid of familyIdsToShow) {
      const all = [...PRODUCTS.privat, ...PRODUCTS.gewerblich];
      groups[fid] = all.filter(p => p.family === fid);
    }
    return groups;
  }, [familyIdsToShow]);

  const [catFilter, setCatFilter] = useState('alle');
  const availableCategories = useMemo(() => {
    const cats = new Set();
    for (const fid of familyIdsToShow) {
      const prods = productsByFamily[fid];
      if (prods && prods[0]) cats.add(prods[0].cat);
    }
    if (showAddCombined) cats.add('ergaenzung');
    return Array.from(cats);
  }, [familyIdsToShow, productsByFamily, showAddCombined]);

  const filteredFamilyIds = catFilter === 'alle'
    ? familyIdsToShow
    : familyIdsToShow.filter(fid => productsByFamily[fid]?.[0]?.cat === catFilter);

  const familiesByCat = useMemo(() => {
    const groups = {};
    for (const fid of filteredFamilyIds) {
      const prods = productsByFamily[fid];
      if (!prods || prods.length === 0) continue;
      const cat = prods[0].cat;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(fid);
    }
    return groups;
  }, [filteredFamilyIds, productsByFamily]);

  const showAddInCat = showAddCombined && (catFilter === 'alle' || catFilter === 'ergaenzung');

  const hasProjectOrConfig = !!(project || gewerbConfig);
  const showMindestflaeche = gewerbConfig && gewerbConfig.flaecheStatus !== 'ja' && totals.countTotal > 0;

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 min-w-0">
          <button onClick={onBack} className="font-body text-sm text-[#6B6961] hover:text-[#1C1C1A] flex items-center gap-1.5 mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Zurück
          </button>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-3">
            {project ? `Projekt — ${project.name}` : 'Module wählen'}
            {' · '}
            {modulart === 'privat' ? 'Private Module' : modulart === 'business' ? 'Business' : 'Privat + Business'}
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Wähle Deine <em>Module</em>
          </h1>
          <p className="font-body text-base text-[#6B6961] mb-6 max-w-2xl">
            Pro Modulfamilie wählst Du eine Variante (Küche, Möblierung, Größe) und die Anzahl. Du kannst pro Familie auch mehrere Varianten kombinieren.
          </p>

          {gewerbConfig && gewerbConfig.zielModulAnzahl > 0 && totals.rabattPct > 0 && (
            <div className="bg-[#3D5446]/5 border border-[#3D5446]/20 px-4 py-3 mb-6 flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-[#3D5446]" strokeWidth={1.5} />
              <p className="font-body text-xs text-[#1C1C1A]">
                <span className="font-medium num">{fmtPct(totals.rabattPct)} Rabatt</span> berücksichtigt — basierend auf Deinem Zielwert von <span className="num">{gewerbConfig.zielModulAnzahl}</span> Modulen.
              </p>
            </div>
          )}
          {!gewerbConfig && totals.nextStaffel && totals.countTotal > 0 && (
            <div className="bg-[#3D5446]/5 border border-[#3D5446]/20 px-4 py-3 mb-6 flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-[#3D5446]" strokeWidth={1.5} />
              <p className="font-body text-xs text-[#1C1C1A]">
                Noch <span className="font-medium num">{totals.nextStaffel.ab - totals.countTotal}</span> Module bis zum nächsten Rabatt-Sprung ({fmtPct(totals.nextStaffel.prozent)}).
              </p>
            </div>
          )}

          {availableCategories.length > 1 && (
            <div className="flex gap-2 font-body text-xs tracking-wider uppercase flex-wrap mb-8">
              <button onClick={() => setCatFilter('alle')}
                className={`px-3 py-1.5 transition-colors ${catFilter === 'alle' ? 'border-[#3D5446] text-[#3D5446]' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'} border`}>
                Alle Kategorien
              </button>
              {availableCategories.map(c => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`px-3 py-1.5 transition-colors ${catFilter === c ? 'border-[#3D5446] text-[#3D5446]' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'} border`}>
                  {CATEGORIES[c].label}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-10">
            {Object.entries(familiesByCat).map(([catId, famIds]) => (
              <div key={catId}>
                <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-[#1C1C1A]/10">
                  <h2 className="font-display text-2xl">{CATEGORIES[catId].label}</h2>
                  <p className="font-body text-xs text-[#6B6961] hidden md:block">{CATEGORIES[catId].desc}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {famIds.map(fid => (
                    <FamilyCard key={fid} familyId={fid} products={productsByFamily[fid]}
                      selections={selections} setSelections={setSelections}
                      modes={modes} setModes={setModes}
                      einmaligProModul={totals.einmaligProModul} hasProjectOrConfig={hasProjectOrConfig}
                      variantState={variantState} setVariantState={setVariantState} />
                  ))}
                  {catId === 'ergaenzung' && showAddInCat && (
                    <AddFamilyCard selections={selections} setSelections={setSelections}
                      einmaligProModul={totals.einmaligProModul} hasProjectOrConfig={hasProjectOrConfig}
                      addUsageState={addUsageState} setAddUsageState={setAddUsageState} />
                  )}
                </div>
              </div>
            ))}
            {/* Falls Ergänzungen noch keine Familie hat aber AddCombined gezeigt werden soll */}
            {showAddInCat && !familiesByCat['ergaenzung'] && (
              <div>
                <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-[#1C1C1A]/10">
                  <h2 className="font-display text-2xl">{CATEGORIES.ergaenzung.label}</h2>
                  <p className="font-body text-xs text-[#6B6961] hidden md:block">{CATEGORIES.ergaenzung.desc}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <AddFamilyCard selections={selections} setSelections={setSelections}
                    einmaligProModul={totals.einmaligProModul} hasProjectOrConfig={hasProjectOrConfig}
                    addUsageState={addUsageState} setAddUsageState={setAddUsageState} />
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:w-96 lg:shrink-0">
          <div className="lg:sticky lg:top-24 bg-white border border-[#1C1C1A]/10 p-7">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-2">Dein Angebot</p>
            <h3 className="font-display text-2xl mb-6">Übersicht</h3>
            {totals.countTotal === 0 ? (
              <p className="font-body text-sm text-[#6B6961] py-8 text-center border-y border-[#1C1C1A]/10">
                Noch keine Module gewählt<span className="opacity-50"> …</span>
              </p>
            ) : (
              <>
                <div className="space-y-2.5 pb-5 mb-5 border-b border-[#1C1C1A]/10 max-h-48 overflow-auto scrollbar-none">
                  {totals.lineItems.map(it => (
                    <div key={it.kuerzel} className="flex justify-between gap-4 text-sm font-body">
                      <span className="text-[#1C1C1A] flex-1 leading-tight">
                        <span className="num">{it.count}×</span> <span className="text-[#6B6961]">{it.kuerzel}</span>
                        {it.mode === 'einnahmen' && it.einnahmen > 0 && <span className="text-[10px] text-[#A88B5A] ml-1 tracking-wider uppercase">verm.</span>}
                      </span>
                      <span className="num text-[#1C1C1A] shrink-0">{fmtEUR(it.count * it.brutto)}</span>
                    </div>
                  ))}
                </div>
                <dl className="space-y-2 text-sm font-body mb-5">
                  <div className="flex justify-between"><dt className="text-[#6B6961]">Module gesamt</dt><dd className="num">{totals.countTotal}</dd></div>
                  {totals.einheitenTotal !== totals.countTotal && (
                    <div className="flex justify-between text-xs"><dt className="text-[#6B6961] pl-2">Stellplatz-Einheiten</dt><dd className="num">{totals.einheitenTotal}</dd></div>
                  )}
                  {totals.countPrivat > 0 && totals.countGewerb > 0 && (
                    <>
                      <div className="flex justify-between text-xs"><dt className="text-[#6B6961] pl-2">davon privat</dt><dd className="num">{totals.countPrivat}</dd></div>
                      <div className="flex justify-between text-xs"><dt className="text-[#6B6961] pl-2">davon gewerblich</dt><dd className="num">{totals.countGewerb}</dd></div>
                    </>
                  )}
                  <div className="flex justify-between"><dt className="text-[#6B6961]">NUF</dt><dd className="num">{fmtNum(totals.gesamtNUF)} m²</dd></div>
                  {totals.rabattPct > 0 && <div className="flex justify-between text-[#3D5446]"><dt>Rabatt gesamt</dt><dd className="num">−{fmtPct(totals.rabattPct)}</dd></div>}
                </dl>

                {/* Mismatch-Banner: 3 mögliche Zustände */}
                {gewerbConfig && (() => {
                  // Berechne maximale Kapazität (echte Fläche oder gewünschte Modulanzahl)
                  let kapazitaetMax = 0;
                  let kapazitaetLabel = '';
                  if (gewerbConfig.flaecheStatus === 'ja' && gewerbConfig.grundstueckGroesse > 0 && gewerbConfig.geschosse > 0) {
                    const max = calcMaxModule({ grundstueckGroesse: gewerbConfig.grundstueckGroesse, geschosse: gewerbConfig.geschosse });
                    kapazitaetMax = max.maxGesamt;
                    kapazitaetLabel = `${fmtNum(gewerbConfig.grundstueckGroesse)} m² × ${Math.round(BEBAUUNGSGRAD * 100)} % bei ${gewerbConfig.geschosse} Geschossen`;
                  } else if (gewerbConfig.gewuenschteModulAnzahl > 0) {
                    kapazitaetMax = gewerbConfig.gewuenschteModulAnzahl;
                    kapazitaetLabel = 'gewünschte Modulanzahl';
                  }
                  const zielwert = gewerbConfig.zielModulAnzahl;
                  const ist = totals.einheitenTotal;

                  // Priorität 1: Kapazität überschritten (rot, hart)
                  if (kapazitaetMax > 0 && ist > kapazitaetMax) {
                    const ueber = ist - kapazitaetMax;
                    return (
                      <div className="pb-4 mb-4 border-b border-[#1C1C1A]/10 -mx-7 px-7 py-4 bg-[#B0452C]/10 border-l-4 border-l-[#B0452C]">
                        <p className="font-body text-xs uppercase tracking-wider text-[#B0452C] mb-1.5 font-medium flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" strokeWidth={2.5}/> Kapazität überschritten
                        </p>
                        <p className="font-display text-xl num text-[#B0452C]">
                          +{ueber} Einheit{ueber === 1 ? '' : 'en'} zu viel
                        </p>
                        <p className="font-body text-xs text-[#1C1C1A]/80 mt-2 leading-relaxed">
                          Auf der Fläche passen <span className="num font-medium">{kapazitaetMax}</span> Stellplatz-Einheiten ({kapazitaetLabel}). Deine Auswahl belegt <span className="num font-medium">{ist}</span> Einheiten.
                        </p>
                        <p className="font-body text-xs text-[#6B6961] mt-1.5 leading-relaxed">
                          Bitte entferne Module oder lass uns über eine größere Fläche bzw. zusätzliche Geschosse sprechen.
                        </p>
                      </div>
                    );
                  }

                  // Priorität 2: Zielwert überschritten, aber Kapazität noch OK (rosa, warnend)
                  if (zielwert > 0 && ist > zielwert) {
                    const ueber = ist - zielwert;
                    return (
                      <div className="pb-4 mb-4 border-b border-[#1C1C1A]/10 -mx-7 px-7 py-4 bg-[#FCE4E0] border-l-4 border-l-[#B0452C]">
                        <p className="font-body text-xs uppercase tracking-wider text-[#B0452C] mb-1.5 font-medium flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" strokeWidth={2.5}/> Über Zielwert
                        </p>
                        <p className="font-display text-xl num text-[#B0452C]">
                          +{ueber} Einheit{ueber === 1 ? '' : 'en'} über Ziel
                        </p>
                        <p className="font-body text-xs text-[#1C1C1A]/80 mt-2 leading-relaxed">
                          Dein Zielwert: <span className="num font-medium">{zielwert}</span> Module · Aktuelle Auswahl: <span className="num font-medium">{ist}</span> Einheiten.
                        </p>
                        <p className="font-body text-xs text-[#6B6961] mt-1.5 leading-relaxed">
                          Wir besprechen gerne, ob der Zielwert auf {ist} Einheiten angepasst werden soll. Auf Deine Fläche passen noch bis zu {kapazitaetMax} Einheiten.
                        </p>
                      </div>
                    );
                  }

                  // Priorität 3: Unter Zielwert (rosa-rot, deutlicher als vorher)
                  if (zielwert > 0 && ist < zielwert && ist > 0) {
                    const frei = zielwert - ist;
                    return (
                      <div className="pb-4 mb-4 border-b border-[#1C1C1A]/10 -mx-7 px-7 py-4 bg-[#FCE4E0] border-l-4 border-l-[#B0452C]">
                        <p className="font-body text-xs uppercase tracking-wider text-[#B0452C] mb-1.5 font-medium flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" strokeWidth={2.5}/> Unter Zielwert
                        </p>
                        <p className="font-display text-xl num text-[#B0452C]">
                          Noch {frei} Einheit{frei === 1 ? '' : 'en'} frei
                        </p>
                        <p className="font-body text-xs text-[#1C1C1A]/80 mt-2 leading-relaxed">
                          Dein Zielwert: <span className="num font-medium">{zielwert}</span> Module · Aktuelle Auswahl: <span className="num font-medium">{ist}</span> Einheiten.
                        </p>
                        <p className="font-body text-xs text-[#6B6961] mt-1.5 leading-relaxed">
                          Du kannst noch Module hinzufügen — oder wir kalkulieren das Angebot mit Deiner aktuellen Auswahl.
                        </p>
                      </div>
                    );
                  }

                  return null;
                })()}

                {showMindestflaeche && totals.mindestflaeche && (
                  <div className="pb-4 mb-4 border-b border-[#1C1C1A]/10 bg-[#FBF7EF] -mx-7 px-7 py-4">
                    <p className="font-body text-xs uppercase tracking-wider text-[#A88B5A] mb-2 flex items-center gap-1.5"><MapPin className="w-3 h-3" strokeWidth={2}/> Mindestflächenbedarf</p>
                    <p className="font-display text-2xl num">{fmtNum(totals.mindestflaeche.mindestGrundstueck)} m²</p>
                    <p className="font-body text-xs text-[#6B6961] mt-1">
                      Gebäudefläche {fmtNum(totals.mindestflaeche.gebaeudeflaeche)} m² ÷ {Math.round(BEBAUUNGSGRAD * 100)} % Bebauungsgrad
                    </p>
                  </div>
                )}

                {hasProjectOrConfig && totals.einmaligGesamtBrutto > 0 && (
                  <div className="pb-4 mb-4 border-b border-[#1C1C1A]/10">
                    <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-2 flex items-center gap-1.5"><Receipt className="w-3 h-3" strokeWidth={2}/> Projektkosten (einmalig)</p>
                    <div className="flex justify-between text-sm font-body"><dt className="text-[#6B6961]">{fmtEUR(totals.einmaligProModul)}/Modul × {totals.countTotal}</dt><dd className="num">{fmtEUR(totals.einmaligGesamtBrutto)}</dd></div>
                  </div>
                )}

                <div className="pt-1 mb-4">
                  <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-1">Anschaffung gesamt</p>
                  <p className="font-display text-2xl num">{fmtEUR(totals.bruttoGesamt)}</p>
                  <p className="font-body text-xs text-[#6B6961] mt-1">Anzahlung ca. {fmtEUR(totals.anzahlung)}</p>
                </div>

                {hasProjectOrConfig && (
                  <div className="pt-3 pb-1 border-t border-[#C9A876]/40 mb-4">
                    <p className="font-body text-xs uppercase tracking-wider text-[#A88B5A] mb-1 flex items-center gap-1.5"><Repeat className="w-3 h-3" strokeWidth={2}/> Neben- & Verbrauchskosten</p>
                    <p className="font-display text-xl num text-[#A88B5A]">{fmtEUR2(totals.nebenkosten.proM2Gesamt)}<span className="text-xs"> /m²/Mt.</span></p>
                    <p className="font-body text-xs text-[#6B6961] mt-0.5">≈ {fmtEUR(totals.nebenkostenMonatGesamt)} / Monat gesamt</p>
                    <p className="font-body text-[10px] text-[#6B6961] mt-0.5">Richtwerte zur Orientierung</p>
                  </div>
                )}

                {totals.hasIncome && (
                  <div className="pt-3 pb-2 border-t border-[#A88B5A]/30 mb-6">
                    <p className="font-body text-xs uppercase tracking-wider text-[#A88B5A] mb-1 flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" strokeWidth={2} /> Mieteinnahmen / Mt.
                    </p>
                    <p className="font-display text-xl num text-[#A88B5A]">{fmtEUR(totals.monthlyIncomeBrutto)}</p>
                  </div>
                )}
                <Button onClick={onNext} className="w-full" disabled={totals.countTotal === 0}>
                  Weiter zur Finanzierung <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ============================================================================
   STEP 2 — Finance
   ============================================================================ */

function Slider({ label, value, onChange, min, max, step, format = (v) => v, hint }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="font-body text-sm text-[#1C1C1A]">{label}</label>
        <span className="font-display text-base num text-[#3D5446]">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} className="w-full" />
      {hint && <p className="font-body text-xs text-[#6B6961] mt-1.5">{hint}</p>}
    </div>
  );
}

function PrivatFinanzPanel({ totals, financing, setFinancing, ekPrivat, setEkPrivat }) {
  return (
    <>
      {/* KfW-Panel */}
      <div className="bg-white border border-[#1C1C1A]/10 p-7">
        <div className="flex items-baseline justify-between mb-1 gap-4 flex-wrap">
          <h3 className="font-display text-2xl">1. KfW-Förderung (privat)</h3>
          <span className="font-body text-xs tracking-wider uppercase text-[#3D5446] bg-[#3D5446]/5 px-2 py-1">{totals.countPrivat} Modul{totals.countPrivat > 1 ? 'e' : ''}</span>
        </div>
        <p className="font-body text-sm text-[#6B6961] mb-7">
          Tilgungszuschuss-fähige Förderung der KfW für energieeffizientes Wohnen — bis 150.000 € pro Modul. Der Tilgungsnachlass reduziert den effektiv zurückzuzahlenden Betrag.
        </p>
        <div className="space-y-6">
          <Slider label="KfW Förderhöhe je Modul" value={financing.kfw.foerderhoehe} onChange={v => setFinancing(f => ({...f, kfw: {...f.kfw, foerderhoehe: v}}))} min={100000} max={150000} step={5000} format={fmtEUR} hint="Programm variiert — aktuell max. 150.000 €" />
          <Slider label="KfW Zinssatz" value={financing.kfw.zins} onChange={v => setFinancing(f => ({...f, kfw: {...f.kfw, zins: v}}))} min={0.02} max={0.03} step={0.0025} format={fmtPct} hint="Aktuell 2–3 % bonitätsabhängig" />
          <Slider label="KfW Laufzeit" value={financing.kfw.laufzeit} onChange={v => setFinancing(f => ({...f, kfw: {...f.kfw, laufzeit: v}}))} min={10} max={35} step={1} format={v => `${v} Jahre`} />
          <Slider label="Tilgungsnachlass" value={financing.kfw.tilgungsnachlass} onChange={v => setFinancing(f => ({...f, kfw: {...f.kfw, tilgungsnachlass: v}}))} min={0.10} max={0.15} step={0.01} format={fmtPct} hint="10–15 % je nach Effizienzklasse" />
        </div>
        <div className="mt-6 pt-5 border-t border-[#1C1C1A]/10 space-y-1.5 font-body text-sm">
          <div className="flex justify-between"><span className="text-[#6B6961]">KfW-Förderbetrag gesamt</span><span className="num">{fmtEUR(totals.kfwBasis)}</span></div>
          <div className="flex justify-between text-[#3D5446]"><span>davon Tilgungsnachlass ({fmtPct(financing.kfw.tilgungsnachlass)})</span><span className="num">−{fmtEUR(totals.kfwBasis * financing.kfw.tilgungsnachlass)}</span></div>
          <div className="flex justify-between pt-2 border-t border-[#1C1C1A]/10"><span className="text-[#1C1C1A]">Zurückzuzahlender Betrag</span><span className="num">{fmtEUR(totals.kfwBasis * (1 - financing.kfw.tilgungsnachlass))}</span></div>
          <div className="flex justify-between font-display text-base pt-2"><span>KfW-Monatsrate</span><span className="num text-[#3D5446]">{fmtEUR(totals.kfwRate)}</span></div>
        </div>
      </div>

      {/* GLS-Panel */}
      <div className="bg-white border border-[#1C1C1A]/10 p-7">
        <div className="flex items-baseline justify-between mb-1 gap-4 flex-wrap">
          <h3 className="font-display text-2xl">2. GLS Bank (Restfinanzierung)</h3>
          <span className="font-body text-xs tracking-wider uppercase text-[#3D5446] bg-[#3D5446]/5 px-2 py-1">10 J · fix</span>
        </div>
        <p className="font-body text-sm text-[#6B6961] mb-5">
          Der Auftragswert abzüglich KfW-Förderhöhe und Eigenkapital wird über die GLS Bank finanziert.
        </p>
        <div className="bg-[#F8F5F0] border border-[#1C1C1A]/8 p-4 mb-6 font-body text-sm space-y-1.5">
          <div className="flex justify-between"><span className="text-[#6B6961]">Auftragswert privat (inkl. ant. Projektkosten)</span><span className="num">{fmtEUR(totals.effPrivat)}</span></div>
          <div className="flex justify-between"><span className="text-[#6B6961]">− KfW-Förderhöhe</span><span className="num">−{fmtEUR(totals.kfwBasis)}</span></div>
          <div className="flex justify-between"><span className="text-[#6B6961]">− Eigenkapital</span><span className="num">−{fmtEUR(ekPrivat)}</span></div>
          <div className="flex justify-between pt-1.5 border-t border-[#1C1C1A]/10 font-display text-base"><span>= GLS-Basis</span><span className="num text-[#3D5446]">{fmtEUR(totals.glsBasis)}</span></div>
        </div>
        <div className="space-y-6">
          <Slider label="GLS Zinssatz" value={financing.gls.zins} onChange={v => setFinancing(f => ({...f, gls: {...f.gls, zins: v}}))} min={0.04} max={0.06} step={0.0025} format={fmtPct} hint="Üblicher Bereich 4–6 %" />
          <div className="pt-4 border-t border-[#1C1C1A]/10">
            <div className="flex justify-between items-baseline mb-2 gap-2">
              <FieldLabel required={false} hint="Probiere den Slider — er zeigt direkt den Einfluss auf Deine Monatsrate">Eigenkapital</FieldLabel>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-display text-base num text-[#3D5446]">{fmtEUR(ekPrivat)}</span>
              <span className="font-body text-xs text-[#6B6961]">max. {fmtEUR(Math.max(0, totals.effPrivat - totals.kfwBasis))}</span>
            </div>
            <input type="range"
              min={0}
              max={Math.max(0, totals.effPrivat - totals.kfwBasis)}
              step={1000}
              value={Math.min(ekPrivat, Math.max(0, totals.effPrivat - totals.kfwBasis))}
              onChange={e => setEkPrivat(parseInt(e.target.value, 10))}
              className="w-full" />
            <div className="mt-2 flex items-center gap-2">
              <NumberInput value={ekPrivat} onChange={setEkPrivat} placeholder="0"
                className="flex-1 w-full px-3 py-2 bg-[#F8F5F0] border border-[#1C1C1A]/15 text-sm focus:border-[#3D5446]" />
              <span className="font-body text-xs text-[#6B6961]">€</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-[#1C1C1A]/3 border border-[#1C1C1A]/10 font-body text-xs text-[#6B6961]">
            <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Laufzeit fix bei 10 Jahren</span>
          </div>
        </div>
        <div className="mt-6 pt-5 border-t border-[#1C1C1A]/10 flex justify-between font-display text-base">
          <span>GLS-Monatsrate</span><span className="num text-[#3D5446]">{fmtEUR(totals.glsRate)}</span>
        </div>

        {/* Info-Hinweis zur Hausbank-Option */}
        <div className="mt-5 bg-[#FBF7EF] border border-[#A88B5A]/30 p-4 flex gap-3 items-start">
          <Info className="w-5 h-5 text-[#A88B5A] shrink-0 mt-0.5" strokeWidth={1.5} />
          <div className="space-y-1.5">
            <p className="font-body text-sm text-[#1C1C1A] font-medium">Gut zu wissen</p>
            <p className="font-body text-xs text-[#1C1C1A]/80 leading-relaxed">
              Die GLS Bank finanziert dieses Modellprojekt mit <span className="font-medium">10 Jahren Laufzeit</span>. Bei höheren Restbeträgen lassen sich die monatlichen Raten flexibel gestalten — z.&nbsp;B. durch eine höhere Anzahlung oder eine zusätzliche Finanzierung über Deine Hausbank.
            </p>
            <p className="font-body text-xs text-[#6B6961] leading-relaxed italic">
              Die hier gezeigten Werte dienen der Orientierung. Die passende Finanzierungsstruktur besprechen wir gerne persönlich mit Dir.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function GewerblichFinanzPanel({ totals, financing, setFinancing, ekGewerb, setEkGewerb }) {
  return (
    <div className="bg-white border border-[#1C1C1A]/10 p-7">
      <div className="flex items-baseline justify-between mb-1 gap-4 flex-wrap">
        <h3 className="font-display text-2xl">Plattform-Finanzierung (gewerblich)</h3>
        <span className="font-body text-xs tracking-wider uppercase text-[#A88B5A] bg-[#A88B5A]/10 px-2 py-1">{totals.countGewerb} Modul{totals.countGewerb > 1 ? 'e' : ''}</span>
      </div>
      <p className="font-body text-sm text-[#6B6961] mb-7 num">Effektive Kosten netto {fmtEUR(totals.effGewerbNetto)}</p>
      <div className="space-y-6">
        <Slider label="Zinssatz" value={financing.plattform.zins} onChange={v => setFinancing(f => ({...f, plattform: {...f.plattform, zins: v}}))} min={0.03} max={0.10} step={0.0025} format={fmtPct} hint="Bonitätsabhängig, 3–10 % möglich (Default 5,5 %)" />
        <Slider label="Laufzeit" value={financing.plattform.laufzeit} onChange={v => setFinancing(f => ({...f, plattform: {...f.plattform, laufzeit: v}}))} min={5} max={10} step={1} format={v => `${v} Jahre`} hint="Max. 10 Jahre — nur Verkürzung möglich" />
        <Slider label="Restwert am Laufzeitende" value={financing.plattform.restwertPct} onChange={v => setFinancing(f => ({...f, plattform: {...f.plattform, restwertPct: v}}))} min={0} max={0.5} step={0.05} format={fmtPct} />
        <Slider label="Unternehmenssteuer (Annahme)" value={financing.plattform.steuer} onChange={v => setFinancing(f => ({...f, plattform: {...f.plattform, steuer: v}}))} min={0.15} max={0.40} step={0.01} format={fmtPct} />
        <div className="pt-4 border-t border-[#1C1C1A]/10">
          <div className="flex justify-between items-baseline mb-2 gap-2">
            <FieldLabel required={false} hint="Anteil 0–50 % des Netto-Auftragswerts">Eigenkapital / IAB</FieldLabel>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-display text-base num text-[#A88B5A]">{fmtEUR(ekGewerb)}</span>
            <span className="font-body text-xs text-[#6B6961]">max. 50 % · {fmtEUR((totals.effGewerbNetto || 0) * 0.5)}</span>
          </div>
          <input type="range"
            min={0}
            max={Math.max(0, (totals.effGewerbNetto || 0) * 0.5)}
            step={1000}
            value={Math.min(ekGewerb, Math.max(0, (totals.effGewerbNetto || 0) * 0.5))}
            onChange={e => setEkGewerb(parseInt(e.target.value, 10))}
            className="w-full" />
          <div className="mt-2 flex items-center gap-2">
            <NumberInput value={ekGewerb} onChange={setEkGewerb} placeholder="0"
              className="flex-1 w-full px-3 py-2 bg-[#F8F5F0] border border-[#1C1C1A]/15 text-sm focus:border-[#3D5446]" />
            <span className="font-body text-xs text-[#6B6961]">€</span>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-5 border-t border-[#1C1C1A]/10 space-y-1.5 font-body text-sm">
        <div className="flex justify-between"><span className="text-[#6B6961]">Finanzierungs-Basis</span><span className="num">{fmtEUR(totals.plattformBasis)}</span></div>
        <div className="flex justify-between"><span className="text-[#6B6961]">Rohrate (vor Steuer)</span><span className="num">{fmtEUR(totals.plattformRate)}</span></div>
        <div className="flex justify-between text-[#3D5446]"><span>− Steuerentlastung (AfA + Zinsen × Steuersatz)</span><span className="num">−{fmtEUR(totals.steuerentlastung)}</span></div>
        <div className="flex justify-between font-display text-base pt-2 border-t border-[#1C1C1A]/10"><span>Plattform-Monatsrate (n. Steuer)</span><span className="num text-[#A88B5A]">{fmtEUR(totals.plattformRateEff)}</span></div>
      </div>
    </div>
  );
}

function NebenkostenBreakdown({ totals, project, gewerbConfig }) {
  if (!project && !gewerbConfig) return null;
  const p = totals.nebenkosten;
  const pachtSource = project ? { pachtJahr: project.pachtJahr || 0, pachtGewerblich: project.pachtGewerblich, zielModulAnzahl: project.zielModulAnzahl || 0, isProject: true }
    : gewerbConfig ? { pachtJahr: gewerbConfig.pachtJahr || 0, pachtGewerblich: gewerbConfig.pachtGewerblich, zielModulAnzahl: 0, isProject: false }
    : { pachtJahr: 0, pachtGewerblich: false, zielModulAnzahl: 0, isProject: false };
  return (
    <div className="bg-white border border-[#C9A876]/40 p-7">
      <div className="flex items-baseline justify-between mb-1 gap-4 flex-wrap">
        <h3 className="font-display text-2xl flex items-center gap-2"><Repeat className="w-5 h-5 text-[#A88B5A]" strokeWidth={1.5} />Laufende Neben- und Verbrauchskosten</h3>
        <span className="font-body text-xs tracking-wider uppercase text-[#A88B5A] bg-[#A88B5A]/10 px-2 py-1">Richtwerte</span>
      </div>
      <p className="font-body text-sm text-[#6B6961] mb-6">Richtwerte zur Orientierung — übliche laufende Kosten für CoMod-Module. Die tatsächlichen Beträge variieren je nach Standort und Verbrauch.</p>
      <div className="space-y-2.5 text-sm font-body">
        {/* Pacht — bei Misch-Setup getrennte Zeilen für privat (brutto) und gewerblich (netto) */}
        {pachtSource.pachtJahr > 0 ? (
          <>
            {(totals.nufPrivat > 0 || !pachtSource.isProject) && totals.nufPrivat > 0 && pachtSource.isProject && (
              <div className="flex justify-between py-2 border-b border-[#1C1C1A]/8">
                <div>
                  <p className="text-[#1C1C1A]">Pacht-Umlage (private Module{pachtSource.pachtGewerblich ? ', inkl. 19 % USt' : ''})</p>
                  <p className="text-xs text-[#6B6961]">{fmtNum(totals.nufPrivat)} m² × {fmtEUR2(p.pachtProM2_priv)}/m²</p>
                </div>
                <span className="num shrink-0">{fmtEUR2(p.pachtProM2_priv)}/m²</span>
              </div>
            )}
            {totals.nufGewerb > 0 && pachtSource.isProject && (
              <div className="flex justify-between py-2 border-b border-[#1C1C1A]/8">
                <div>
                  <p className="text-[#1C1C1A]">Pacht-Umlage (gewerbliche Module, netto)</p>
                  <p className="text-xs text-[#6B6961]">{fmtNum(totals.nufGewerb)} m² × {fmtEUR2(p.pachtProM2_gewerb)}/m²</p>
                </div>
                <span className="num shrink-0">{fmtEUR2(p.pachtProM2_gewerb)}/m²</span>
              </div>
            )}
            {!pachtSource.isProject && (
              <div className="flex justify-between py-2 border-b border-[#1C1C1A]/8">
                <div>
                  <p className="text-[#1C1C1A]">Pacht{pachtSource.pachtGewerblich ? ' (inkl. 19 % USt)' : ' (privat, ohne USt)'}</p>
                  <p className="text-xs text-[#6B6961]">{fmtEUR(pachtSource.pachtJahr)}/Jahr ÷ 12 ÷ {fmtNum(totals.gesamtNUF)} m²</p>
                </div>
                <span className="num shrink-0">{fmtEUR2(p.pachtProM2)}/m²</span>
              </div>
            )}
            {pachtSource.isProject && (
              <p className="text-xs text-[#6B6961] italic pb-2">
                Basis: {fmtEUR(pachtSource.pachtJahr)}/Jahr ÷ {pachtSource.zielModulAnzahl} Ziel-Module ÷ {ZIEL_MODUL_NUF} m² ÷ 12 = {fmtEUR2(p.pachtProM2_gewerb)}/m² netto
              </p>
            )}
          </>
        ) : (
          <div className="flex justify-between py-2 border-b border-[#1C1C1A]/8">
            <p className="text-[#1C1C1A]">Keine Pacht</p>
            <span className="num shrink-0 text-[#6B6961]">—</span>
          </div>
        )}
        {p.posten.map(post => (
          <div key={post.id} className="flex justify-between py-2 border-b border-[#1C1C1A]/8">
            <span className="text-[#1C1C1A]">{post.label}</span><span className="num shrink-0">{fmtEUR2(post.proM2)}/m²</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 font-display text-base">
          <span>Summe Richtwert</span>
          <span className="num text-[#A88B5A]">{fmtEUR2(p.proM2Gesamt)}/m²/Mt.</span>
        </div>
        <div className="flex justify-between text-[#6B6961] text-xs">
          <span>Bei {fmtNum(totals.gesamtNUF)} m² NUF</span>
          <span className="num">≈ {fmtEUR(totals.nebenkostenMonatGesamt)} / Monat</span>
        </div>
      </div>
    </div>
  );
}

function IncomeBreakdown({ totals, vermietungDurchCoMod, setVermietungDurchCoMod }) {
  if (!totals.hasIncome) return null;
  return (
    <div className="bg-[#FBF7EF] border border-[#A88B5A]/30 p-7">
      <div className="flex items-baseline justify-between mb-1 gap-4 flex-wrap">
        <h3 className="font-display text-2xl flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[#A88B5A]" strokeWidth={1.5} />Einnahmen-Prognose</h3>
        <span className="font-body text-xs tracking-wider uppercase text-[#A88B5A] bg-[#A88B5A]/15 px-2 py-1">Vermietung</span>
      </div>
      <p className="font-body text-sm text-[#6B6961] mb-5">Erwartete Mieten — von uns kalkulierte Marktindikationen für die vermieteten Module.</p>
      <div className="mb-5 p-3 bg-white border border-[#1C1C1A]/10">
        <FieldLabel required={false}>Wer übernimmt die Vermietung?</FieldLabel>
        <div className="flex gap-2">
          <button onClick={() => setVermietungDurchCoMod(false)}
            className={`flex-1 px-3 py-2 font-body text-xs border transition-colors ${!vermietungDurchCoMod ? 'border-[#3D5446] bg-[#3D5446]/10 text-[#3D5446] ring-1 ring-[#3D5446]/30 ring-offset-1 ring-offset-white font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Selbst</button>
          <button onClick={() => setVermietungDurchCoMod(true)}
            className={`flex-1 px-3 py-2 font-body text-xs border transition-colors ${vermietungDurchCoMod ? 'border-[#A88B5A] bg-[#A88B5A]/10 text-[#A88B5A] ring-1 ring-[#A88B5A]/30 ring-offset-1 ring-offset-white font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Durch uns bewirtschaftet</button>
        </div>
        {vermietungDurchCoMod && <p className="font-body text-[11px] text-[#6B6961] mt-2">Wir übernehmen Vermarktung & Verwaltung — eine Betreiber-Fee wird von der Miete abgezogen.</p>}
      </div>
      <div className="space-y-2.5 mb-5 max-h-48 overflow-auto scrollbar-none">
        {totals.incomeItems.map(it => (
          <div key={it.kuerzel} className="flex justify-between gap-4 text-sm font-body py-2 border-b border-[#1C1C1A]/8 last:border-b-0">
            <p className="text-[#1C1C1A] leading-tight flex-1"><span className="num">{it.count}×</span> {it.kuerzel}</p>
            <span className="num text-[#1C1C1A] shrink-0 text-right">{fmtEUR(it.count * it.einnahmen)}</span>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-[#1C1C1A]/10 space-y-2 text-sm font-body">
        <div className="flex justify-between"><dt className="text-[#6B6961]">Bruttomieten / Monat</dt><dd className="num">{fmtEUR(totals.monthlyIncomeBrutto)}</dd></div>
        {vermietungDurchCoMod && <div className="flex justify-between text-[#6B6961]"><dt>Betreiber-Fee</dt><dd className="num">−{fmtEUR(totals.feeAbzug)}</dd></div>}
        <div className="flex justify-between font-display text-base pt-2 border-t border-[#1C1C1A]/10">
          <dt>Einnahmen netto / Mt.</dt><dd className="num text-[#A88B5A]">{fmtEUR(totals.monthlyIncomeNetto)}</dd>
        </div>
      </div>
    </div>
  );
}

function FinancingStep({ totals, project, gewerbConfig, financing, setFinancing, ekPrivat, setEkPrivat, ekGewerb, setEkGewerb, vermietungDurchCoMod, setVermietungDurchCoMod, onNext, onBack }) {
  const hasPrivat = totals.countPrivat > 0;
  const hasGewerb = totals.countGewerb > 0;
  const hasBoth = hasPrivat && hasGewerb;

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <button onClick={onBack} className="font-body text-sm text-[#6B6961] hover:text-[#1C1C1A] flex items-center gap-1.5 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Zurück
      </button>
      <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-3">Schritt 3 von 4</p>
      <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-3">
        Wie möchtest Du <em>finanzieren</em><span className="opacity-40"> …</span>
      </h1>
      <p className="font-body text-base text-[#6B6961] mb-10 max-w-2xl">
        Wir zeigen Dir typische Finanzierungswege sowie die laufenden Neben- und Verbrauchskosten als Richtwerte.
      </p>

      {hasBoth && (
        <div className="mb-8 bg-[#3D5446]/5 border border-[#3D5446]/30 p-5 flex gap-3 items-start">
          <Info className="w-5 h-5 text-[#3D5446] shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="font-body text-sm text-[#1C1C1A]/80">
            <span className="text-[#1C1C1A] font-medium">Mischfinanzierung erkannt.</span> {totals.countPrivat} private und {totals.countGewerb} gewerbliche Module — beide Finanzierungswege werden parallel gezeigt. Die gewerblichen Module bieten zusätzlich Steuervorteile.
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 min-w-0 space-y-8">
          {hasPrivat && <PrivatFinanzPanel totals={totals} financing={financing} setFinancing={setFinancing} ekPrivat={ekPrivat} setEkPrivat={setEkPrivat} />}
          {hasGewerb && <GewerblichFinanzPanel totals={totals} financing={financing} setFinancing={setFinancing} ekGewerb={ekGewerb} setEkGewerb={setEkGewerb} />}
          <NebenkostenBreakdown totals={totals} project={project} gewerbConfig={gewerbConfig} />
          <IncomeBreakdown totals={totals} vermietungDurchCoMod={vermietungDurchCoMod} setVermietungDurchCoMod={setVermietungDurchCoMod} />
        </div>

        <aside className="lg:w-96 lg:shrink-0">
          <div className="lg:sticky lg:top-24 bg-[#1C1C1A] text-[#F8F5F0] p-7">
            <p className="font-body text-xs tracking-[0.3em] uppercase opacity-50 mb-2">
              {totals.hasIncome ? 'Wirtschaftlichkeit' : 'Deine Belastung'}
            </p>
            <h3 className="font-display text-2xl mb-7">Monatlich</h3>

            <div className="pb-5 mb-5 border-b border-[#F8F5F0]/15">
              <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-3">Finanzierung</p>
              <dl className="space-y-2 text-sm font-body">
                {hasPrivat && <>
                  <div className="flex justify-between"><dt className="opacity-70">KfW-Rate</dt><dd className="num">{fmtEUR(totals.kfwRate)}</dd></div>
                  <div className="flex justify-between"><dt className="opacity-70">GLS-Rate</dt><dd className="num">{fmtEUR(totals.glsRate)}</dd></div>
                </>}
                {hasGewerb && <div className="flex justify-between"><dt className="opacity-70">Plattform (n. Steuer)</dt><dd className="num">{fmtEUR(totals.plattformRateEff)}</dd></div>}
                <div className="flex justify-between pt-1 border-t border-[#F8F5F0]/10"><dt>Summe</dt><dd className="num">{fmtEUR(totals.finanzierungMonat)}</dd></div>
              </dl>
            </div>

            {(project || gewerbConfig) && (
              <div className="pb-5 mb-5 border-b border-[#F8F5F0]/15">
                <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-1 flex items-center gap-1.5"><Repeat className="w-3 h-3" strokeWidth={2}/> Nebenkosten (Richtwert)</p>
                <p className="font-display text-2xl num text-[#C9A876]">{fmtEUR(totals.nebenkostenMonatGesamt)}</p>
                <p className="font-body text-[10px] opacity-50 mt-0.5">{fmtEUR2(totals.nebenkosten.proM2Gesamt)}/m² · alle Verbrauchskosten inkl.</p>
              </div>
            )}

            <div className={`mb-5 ${totals.hasIncome ? 'pb-5 border-b border-[#F8F5F0]/15' : ''}`}>
              <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-1">Belastung gesamt</p>
              <p className="font-display text-3xl num">{fmtEUR(totals.monatlichGesamt)}</p>
            </div>

            {totals.hasIncome && (
              <>
                <div className="mb-5 pb-5 border-b border-[#F8F5F0]/15">
                  <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-1 flex items-center gap-1.5"><TrendingUp className="w-3 h-3" strokeWidth={2} /> Einnahmen / Monat</p>
                  <p className="font-display text-3xl num text-[#C9A876]">{fmtEUR(totals.monthlyIncomeNetto)}</p>
                </div>
                <div className="mb-7">
                  <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-1">
                    {totals.cashflowPositive ? 'Überschuss / Monat' : 'Effektive Monatsbelastung'}
                  </p>
                  <p className={`font-display text-4xl num ${totals.cashflowPositive ? 'text-[#7FB069]' : ''}`}>
                    {totals.cashflowPositive ? '+' : ''}{fmtEUR(Math.abs(totals.cashflowNetto))}
                  </p>
                  {totals.cashflowPositive
                    ? <p className="font-body text-xs text-[#7FB069] mt-1.5 flex items-center gap-1"><Check className="w-3 h-3" strokeWidth={2.5} /> Cashflow-positiv</p>
                    : <p className="font-body text-xs opacity-50 mt-1.5">Belastung nach Abzug der Mieteinnahmen</p>}
                </div>
              </>
            )}
            {!totals.hasIncome && <div className="mb-7" />}

            <Button variant="inverse" onClick={onNext} className="w-full">Weiter zur Anfrage <ChevronRight className="w-4 h-4" /></Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ============================================================================
   STEP 3 / 4 / Admin
   ============================================================================ */

function Field({ label, value, onChange, type = 'text', textarea = false, placeholder, required }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-[#F8F5F0] border border-[#1C1C1A]/15 font-body text-sm focus:outline-none focus:border-[#3D5446] resize-none" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-[#F8F5F0] border border-[#1C1C1A]/15 font-body text-sm focus:outline-none focus:border-[#3D5446]" />
      )}
    </div>
  );
}

function SummaryStep({ totals, customerType, modulart, project, gewerbConfig, contact, setContact, onSubmit, onBack }) {
  const isValid = contact.vorname?.trim() && contact.nachname?.trim() && contact.email?.includes('@');
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <button onClick={onBack} className="font-body text-sm text-[#6B6961] hover:text-[#1C1C1A] flex items-center gap-1.5 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Zurück
      </button>
      <div className="grid md:grid-cols-[1fr_360px] gap-10">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-3">Letzter Schritt</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-3">Wir <em>melden uns</em><span className="opacity-40"> …</span></h1>
          <p className="font-body text-base text-[#6B6961] mb-8 max-w-2xl">Hinterlasse uns Deine Kontaktdaten — wir senden Dir ein detailliertes Angebot und melden uns persönlich.</p>
          <div className="bg-[#3D5446]/5 border border-[#3D5446]/20 px-4 py-3 mb-6 flex items-center gap-2.5">
            <span className="text-[#B0452C] font-medium text-base">*</span>
            <p className="font-body text-xs text-[#6B6961]">Pflichtangaben für die Kontaktaufnahme.</p>
          </div>
          <div className="bg-white border border-[#1C1C1A]/10 p-7 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Vorname" required value={contact.vorname || ''} onChange={v => setContact(c => ({...c, vorname: v}))} />
              <Field label="Nachname" required value={contact.nachname || ''} onChange={v => setContact(c => ({...c, nachname: v}))} />
            </div>
            <Field label="E-Mail" required type="email" value={contact.email || ''} onChange={v => setContact(c => ({...c, email: v}))} />
            <Field label="Telefon" value={contact.telefon || ''} onChange={v => setContact(c => ({...c, telefon: v}))} />
            <Field label="Anmerkung" textarea value={contact.notiz || ''} onChange={v => setContact(c => ({...c, notiz: v}))} placeholder="z. B. Wunschtermin, Standortdetails, Fragen …" />
            <Button onClick={onSubmit} disabled={!isValid} className="w-full mt-4"><Mail className="w-4 h-4" /> Anfrage senden</Button>
            <p className="font-body text-xs text-[#6B6961]">Mit dem Senden willigst Du ein, dass wir Dich kontaktieren dürfen. Keine Weitergabe an Dritte.</p>
          </div>
        </div>
        <aside>
          <div className="bg-[#F8F5F0] border border-[#1C1C1A]/10 p-7 sticky top-24">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-2">Zusammenfassung</p>
            <h3 className="font-display text-xl mb-5">Dein Setup</h3>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-2">Typ</p>
            <p className="font-body text-sm mb-4">
              {customerType === 'privat' ? (project ? `Privat — ${project.name}` : 'Privat — eig. Grundstück') : 'Gewerblich'}
              {modulart && ` · ${modulart === 'privat' ? 'Wohnen' : modulart === 'business' ? 'Business' : 'Beides'}`}
            </p>
            {gewerbConfig && gewerbConfig.flaecheStatus !== 'ja' && totals.mindestflaeche && (
              <p className="font-body text-xs text-[#A88B5A] mb-4">Mindestflächenbedarf: {fmtNum(totals.mindestflaeche.mindestGrundstueck)} m²</p>
            )}
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-2">Module ({totals.countTotal})</p>
            <ul className="space-y-1 mb-5 text-sm font-body max-h-40 overflow-auto scrollbar-none">
              {totals.lineItems.map(it => (
                <li key={it.kuerzel} className="flex justify-between gap-3">
                  <span><span className="num">{it.count}×</span> <span className="text-[#6B6961]">{it.kuerzel}</span>
                    {it.mode === 'einnahmen' && it.einnahmen > 0 && <span className="text-[10px] text-[#A88B5A] ml-1 tracking-wider uppercase">v</span>}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2.5 text-sm font-body pt-4 border-t border-[#1C1C1A]/10">
              <div className="flex justify-between"><dt className="text-[#6B6961]">Anschaffung brutto</dt><dd className="num">{fmtEUR(totals.bruttoGesamt)}</dd></div>
              {(project || gewerbConfig) && <div className="flex justify-between"><dt className="text-[#6B6961]">Projektkosten einm.</dt><dd className="num">{fmtEUR(totals.einmaligGesamtBrutto)}</dd></div>}
              <div className="flex justify-between"><dt className="text-[#6B6961]">Anzahlung</dt><dd className="num">{fmtEUR(totals.anzahlung)}</dd></div>
              <div className="flex justify-between pt-2 border-t border-[#1C1C1A]/10"><dt className="text-[#6B6961]">Finanzierung/Mt.</dt><dd className="num">{fmtEUR(totals.finanzierungMonat)}</dd></div>
              {(project || gewerbConfig) && <div className="flex justify-between text-[#A88B5A]"><dt>Nebenkosten/Mt.</dt><dd className="num">{fmtEUR(totals.nebenkostenMonatGesamt)}</dd></div>}
              <div className="flex justify-between font-body"><dt className="text-[#1C1C1A]">Belastung/Mt.</dt><dd className="num">{fmtEUR(totals.monatlichGesamt)}</dd></div>
              {totals.hasIncome && (
                <>
                  <div className="flex justify-between text-[#A88B5A]"><dt>Einnahmen/Mt.</dt><dd className="num">+{fmtEUR(totals.monthlyIncomeNetto)}</dd></div>
                  <div className={`flex justify-between font-display text-base pt-2 border-t border-[#1C1C1A]/10 ${totals.cashflowPositive ? 'text-[#3D5446]' : ''}`}>
                    <dt>{totals.cashflowPositive ? 'Überschuss' : 'Eff. Belastung'}</dt>
                    <dd className="num">{totals.cashflowPositive ? '+' : ''}{fmtEUR(Math.abs(totals.cashflowNetto))}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SuccessStep({ lead, onRestart }) {
  return (
    <div className="max-w-3xl mx-auto px-8 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-[#3D5446] flex items-center justify-center mx-auto mb-8">
        <Check className="w-7 h-7 text-[#F8F5F0]" strokeWidth={1.5} />
      </div>
      <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-4">Anfrage eingegangen</p>
      <h1 className="font-display text-5xl md:text-6xl leading-tight tracking-tight mb-6">Danke, <em>{lead?.contact?.vorname}</em><span className="opacity-40"> …</span></h1>
      <p className="font-body text-lg text-[#6B6961] mb-10 max-w-xl mx-auto leading-relaxed">Wir haben Deine Anfrage erhalten und melden uns innerhalb von 1–2 Werktagen mit einem detaillierten Angebot.</p>
      <div className="bg-white border border-[#1C1C1A]/10 p-6 inline-flex items-center gap-3 font-body text-sm text-[#6B6961] mb-10">
        <Sparkles className="w-4 h-4 text-[#A88B5A]" strokeWidth={1.5} />
        Im Live-System würden jetzt automatisch E-Mail + Pipedrive-Eintrag erstellt.
      </div>
      <div><Button onClick={onRestart} variant="secondary">Neue Konfiguration starten</Button></div>
    </div>
  );
}

function AdminView({ leads, refreshLeads }) {
  async function clearAll() {
    try { localStorage.removeItem('leads-list'); refreshLeads(); }
    catch (e) { console.error(e); }
  }
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-3">Admin</p>
          <h1 className="font-display text-4xl tracking-tight mb-2">Pipeline</h1>
          <p className="font-body text-sm text-[#6B6961]">{leads.length} {leads.length === 1 ? 'Eintrag' : 'Einträge'} · Im Live-System würde hier ein Pipedrive-Sync laufen</p>
        </div>
        {leads.length > 0 && (
          <button onClick={clearAll} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" /> Alle löschen
          </button>
        )}
      </div>
      {leads.length === 0 ? (
        <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center">
          <p className="font-display text-xl text-[#6B6961] mb-2">Noch keine Einträge<span className="opacity-50"> …</span></p>
          <p className="font-body text-sm text-[#6B6961]">Wechsel zum Konfigurator und sende eine Test-Anfrage.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#1C1C1A]/10 overflow-x-auto">
          <div className="min-w-[1050px]">
            <div className="grid grid-cols-[1.5fr_2fr_1fr_0.6fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-[#1C1C1A]/10 font-body text-xs tracking-wider uppercase text-[#6B6961]">
              <div>Kontakt</div><div>Setup</div><div>Typ</div><div className="text-right">Mod.</div><div className="text-right">Brutto</div><div className="text-right">Belastung</div><div className="text-right">Einnahmen</div>
            </div>
            {leads.slice().reverse().map((lead, idx) => (
              <div key={lead.id || idx} className="grid grid-cols-[1.5fr_2fr_1fr_0.6fr_1fr_1fr_1fr] gap-4 px-6 py-5 border-b border-[#1C1C1A]/5 last:border-b-0 font-body text-sm items-start">
                <div>
                  <p className="text-[#1C1C1A]">{lead.contact?.vorname} {lead.contact?.nachname}</p>
                  <p className="text-xs text-[#6B6961] mt-0.5">{lead.contact?.email}</p>
                  <p className="text-xs text-[#6B6961] mt-2">{new Date(lead.timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="text-xs text-[#6B6961] leading-relaxed">
                  {lead.lineItems?.map(it => (
                    <div key={it.kuerzel}><span className="num text-[#1C1C1A]">{it.count}×</span> {it.kuerzel}{it.mode === 'einnahmen' && <span className="text-[10px] text-[#A88B5A] ml-1">v</span>}</div>
                  ))}
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 text-xs tracking-wider uppercase bg-[#F8F5F0] border border-[#1C1C1A]/10">
                    {lead.customerType === 'privat' ? 'Privat' : 'Gewerbe'}
                  </span>
                  {lead.project && <p className="text-xs text-[#A88B5A] mt-1.5">{lead.project.name}</p>}
                </div>
                <div className="text-right num">{lead.countTotal}</div>
                <div className="text-right num">{fmtEUR(lead.bruttoGesamt)}</div>
                <div className="text-right num font-display">{fmtEUR(lead.monatlichGesamt)}</div>
                <div className="text-right num">
                  {lead.monthlyIncomeNetto > 0 ? (
                    <><span className="text-[#A88B5A]">{fmtEUR(lead.monthlyIncomeNetto)}</span>
                      {lead.cashflowPositive && <p className="text-[10px] text-[#3D5446] uppercase tracking-wider mt-0.5">+CF</p>}</>
                  ) : <span className="text-[#6B6961]">—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   MAIN APP
   ============================================================================ */

const EMPTY_GEWERB_CONFIG = {
  flaecheStatus: null, // 'ja' | 'suche_selbst' | 'sucht_fuer_mich'
  grundstueckGroesse: 0,
  gewuenschteModulAnzahl: 0, // bei 'suche_selbst' / 'sucht_fuer_mich'
  geschosse: 0,
  zielModulAnzahl: 0, // Default = berechnete max-Anzahl, vom Kunden anpassbar
  geschossVerteilung: [], // [EG, OG, DG] — Verteilung der Zielmodule
  detailKosten: null,
  hasPacht: null, pachtJahr: 0, pachtGewerblich: null,
  activeOptionen: { abriss: false, erschl: false, wege: false, gruen: false },
};

export default function App() {
  const [view, setView] = useState('customer');
  const [step, setStep] = useState(0);
  const [customerType, setCustomerType] = useState(null);
  const [privatMode, setPrivatMode] = useState(null);
  const [project, setProject] = useState(null);
  const [gewerbConfig, setGewerbConfig] = useState(EMPTY_GEWERB_CONFIG);
  const [modulart, setModulart] = useState(null);
  const [selections, setSelections] = useState({});
  const [modes, setModes] = useState({});
  const [addUsageState, setAddUsageState] = useState('g');
  const [vermietungDurchCoMod, setVermietungDurchCoMod] = useState(false);
  const [financing, setFinancing] = useState(FIN_DEFAULTS);
  const [ekPrivat, setEkPrivat] = useState(0);
  const [ekGewerb, setEkGewerb] = useState(0);
  const [contact, setContact] = useState({});
  const [leads, setLeads] = useState([]);
  const [lastLead, setLastLead] = useState(null);

  useEffect(() => { refreshLeads(); }, []);
  async function refreshLeads() {
    try {
      const value = localStorage.getItem('leads-list');
      setLeads(value ? JSON.parse(value) : []);
    } catch { setLeads([]); }
  }

  const effectiveGewerbConfig = customerType === 'gewerblich' && gewerbConfig.geschosse > 0 && gewerbConfig.zielModulAnzahl > 0 ? gewerbConfig : null;

  const totals = useMemo(() => calculateTotals({
    selections, modes, project, gewerbConfig: effectiveGewerbConfig,
    ekPrivat, ekGewerb, financing, vermietungDurchCoMod,
  }), [selections, modes, project, effectiveGewerbConfig, ekPrivat, ekGewerb, financing, vermietungDurchCoMod]);

  function handleTypeSelect(type) {
    setCustomerType(type);
    if (type === 'privat') setStep(0.3);
    else { setProject(null); setPrivatMode(null); setGewerbConfig(EMPTY_GEWERB_CONFIG); setModulart(null); setStep(0.5); }
  }
  function handlePrivatMode(mode) {
    setPrivatMode(mode);
    if (mode === 'projekt') setStep(0.4); else setStep(0.45);
  }
  function handleProjectSelect(p) { setProject(p); setStep(0.45); }
  function handleModulart(m) { setModulart(m); setStep(1); }
  function handleGewerbContinue() { setModulart('business'); setStep(1); }

  async function handleSubmit() {
    const lead = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      contact, customerType,
      privatMode, modulart,
      project: project ? { id: project.id, name: project.name } : null,
      gewerbConfig: effectiveGewerbConfig,
      lineItems: totals.lineItems.map(it => ({ kuerzel: it.kuerzel, count: it.count, brutto: it.brutto, netto: it.netto, usage: it.usage, mode: it.mode, einnahmen: it.einnahmen, fee: it.fee })),
      countTotal: totals.countTotal, countPrivat: totals.countPrivat, countGewerb: totals.countGewerb,
      gesamtNUF: totals.gesamtNUF, gesamtBGF: totals.gesamtBGF, mindestflaeche: totals.mindestflaeche,
      bruttoGesamt: totals.bruttoGesamt, einmaligGesamtBrutto: totals.einmaligGesamtBrutto,
      finanzierungMonat: totals.finanzierungMonat, nebenkostenMonatGesamt: totals.nebenkostenMonatGesamt,
      monatlichGesamt: totals.monatlichGesamt,
      monthlyIncomeNetto: totals.monthlyIncomeNetto, cashflowNetto: totals.cashflowNetto, cashflowPositive: totals.cashflowPositive,
      vermietungDurchCoMod, anzahlung: totals.anzahlung, rabattPct: totals.rabattPct,
    };
    try {
      const existing = localStorage.getItem('leads-list');
      const list = existing ? JSON.parse(existing) : [];
      list.push(lead);
      localStorage.setItem('leads-list', JSON.stringify(list));
      setLeads(list);
    } catch (e) { console.error('Storage failed:', e); }
    setLastLead(lead);
    setStep(4);
  }

  function restart() {
    setStep(0); setCustomerType(null); setPrivatMode(null); setProject(null);
    setGewerbConfig(EMPTY_GEWERB_CONFIG); setModulart(null);
    setSelections({}); setModes({}); setFinancing(FIN_DEFAULTS);
    setEkPrivat(0); setEkGewerb(0); setContact({}); setLastLead(null);
    setVermietungDurchCoMod(false); setAddUsageState('g');
  }
  function jumpToStep(s) { if (s < Math.floor(step)) setStep(s); }
  function backFromModules() { setStep(0.45); }

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1C1C1A] font-body">
      <FontStyles />
      <Header step={Math.floor(step)} onJump={jumpToStep} view={view} setView={setView} />

      {view === 'admin' ? <AdminView leads={leads} refreshLeads={refreshLeads} />
        : step === 0 ? <WelcomeStep onSelect={handleTypeSelect} />
        : step === 0.3 ? <PrivatModeStep onSelectMode={handlePrivatMode} onBack={() => setStep(0)} />
        : step === 0.4 ? <ProjectPickerStep selectedProject={project} onSelect={handleProjectSelect} onBack={() => setStep(0.3)} />
        : step === 0.45 ? <ModulartStep onSelect={handleModulart} onBack={() => {
            if (customerType === 'privat') {
              if (privatMode === 'projekt') setStep(0.4); else setStep(0.3);
            } else setStep(0.5);
          }} />
        : step === 0.5 ? <GewerbeConfigStep config={gewerbConfig} setConfig={setGewerbConfig} onContinue={handleGewerbContinue} onBack={() => setStep(0)} />
        : step === 1 ? <ModulesStep modulart={modulart} project={project} gewerbConfig={effectiveGewerbConfig} selections={selections} setSelections={setSelections} modes={modes} setModes={setModes} totals={totals} onNext={() => setStep(2)} onBack={backFromModules} addUsageState={addUsageState} setAddUsageState={setAddUsageState} />
        : step === 2 ? <FinancingStep totals={totals} project={project} gewerbConfig={effectiveGewerbConfig} financing={financing} setFinancing={setFinancing} ekPrivat={ekPrivat} setEkPrivat={setEkPrivat} ekGewerb={ekGewerb} setEkGewerb={setEkGewerb} vermietungDurchCoMod={vermietungDurchCoMod} setVermietungDurchCoMod={setVermietungDurchCoMod} onNext={() => setStep(3)} onBack={() => setStep(1)} />
        : step === 3 ? <SummaryStep totals={totals} customerType={customerType} modulart={modulart} project={project} gewerbConfig={effectiveGewerbConfig} contact={contact} setContact={setContact} onSubmit={handleSubmit} onBack={() => setStep(2)} />
        : step === 4 ? <SuccessStep lead={lastLead} onRestart={restart} />
        : null}

      <footer className="border-t border-[#1C1C1A]/10 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between font-body text-xs text-[#6B6961] flex-wrap gap-4">
          <p>CoMod Konfigurator — Prototyp v0.9.11</p>
          <p>Wohngesund, wertig & wunderschön<span className="opacity-50"> …</span></p>
        </div>
      </footer>
    </div>
  );
}
