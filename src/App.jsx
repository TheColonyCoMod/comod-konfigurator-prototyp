import { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Plus, Minus, Check, Home, Building2, Settings, Trash2, Mail, ArrowRight, Sparkles, FolderOpen, Info, TrendingUp, Gift, Receipt, Repeat, Layers, MapPin, Briefcase, Users, Cloud, CloudOff } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

/* ============================================================================
   SUPABASE CLIENT (mit Fallback auf hartcodierte Werte)
   ============================================================================ */
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://jruqvujjvcpzevjdntws.supabase.co';
const SUPABASE_KEY = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_pu9x37uNO1M0esCdf9ZpOg_ymE4nY6e';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const APP_VERSION = '0.9.65';

/* ============================================================================
   PRODUCT CATALOG mit Familien und Varianten
   ============================================================================ */

const CATEGORIES = {
  wohnen:     { label: 'Mitarbeiterwohnen, Short- & Midstay', desc: 'Wohnmodule, Familien-Kombinationen, Aufenthalt, Tourismus' },
  arbeit:     { label: 'Arbeit & Gemeinschaft',  desc: 'Co-Working, Versammlung, Büro' },
  erlebnis:   { label: 'Freizeit & Gesundheit',  desc: 'Gym, Wellness, Musik, Pool' },
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
  // CoMod Home — Einfamilien-Setup aus 2 oder 3 Modulen kombiniert
  // Home 44 = 2× mittlere Module (22 m²), Home 64 = 2× große (32 m²), Home 66 = 3× mittlere, Home 96 = 3× große
  { kuerzel: 'CoMod Home 44 (UK,D,1Z)', family: 'home', groesse: 44, kueche: 'U-Küche', zimmer: 1, beschr: '2× 22 m² · U-Küche, Dusche, 1 Zimmer',  cat: 'wohnen', nuf: 44, bgf: 52, herst: 189000, marge: 0.15 },
  { kuerzel: 'CoMod Home 44 (LK,D,2Z)', family: 'home', groesse: 44, kueche: 'L-Küche', zimmer: 2, beschr: '2× 22 m² · L-Küche, Dusche, 2 Zimmer',  cat: 'wohnen', nuf: 44, bgf: 52, herst: 189000, marge: 0.15 },
  { kuerzel: 'CoMod Home 64 (UK,D,2Z)', family: 'home', groesse: 64, kueche: 'U-Küche', zimmer: 2, beschr: '2× 32 m² · U-Küche, Dusche, 2 Zimmer',  cat: 'wohnen', nuf: 64, bgf: 72, herst: 219000, marge: 0.15 },
  { kuerzel: 'CoMod Home 64 (LK,D,2Z)', family: 'home', groesse: 64, kueche: 'L-Küche', zimmer: 2, beschr: '2× 32 m² · L-Küche, Dusche, 2 Zimmer',  cat: 'wohnen', nuf: 64, bgf: 72, herst: 219000, marge: 0.15 },
  { kuerzel: 'CoMod Home 64 (D,2Z)',    family: 'home', groesse: 64, kueche: 'Ohne Küche', zimmer: 2, beschr: '2× 32 m² · ohne Küche, 2 Zimmer',     cat: 'wohnen', nuf: 64, bgf: 72, herst: 209000, marge: 0.15 },
  { kuerzel: 'CoMod Home 64 (D,4Z)',    family: 'home', groesse: 64, kueche: 'Ohne Küche', zimmer: 4, beschr: '2× 32 m² · ohne Küche, 4 Zimmer (WG)', cat: 'wohnen', nuf: 64, bgf: 72, herst: 209000, marge: 0.15 },
  { kuerzel: 'CoMod Home 66 (UK,D,1Z)', family: 'home', groesse: 66, kueche: 'U-Küche', zimmer: 1, beschr: '3× 22 m² · U-Küche, Dusche, 1 Zimmer',  cat: 'wohnen', nuf: 66, bgf: 78, herst: 249000, marge: 0.15 },
  { kuerzel: 'CoMod Home 66 (LK,D,2Z)', family: 'home', groesse: 66, kueche: 'L-Küche', zimmer: 2, beschr: '3× 22 m² · L-Küche, Dusche, 2 Zimmer',  cat: 'wohnen', nuf: 66, bgf: 78, herst: 249000, marge: 0.15 },
  { kuerzel: 'CoMod Home 66 (D,3Z)',    family: 'home', groesse: 66, kueche: 'Ohne Küche', zimmer: 3, beschr: '3× 22 m² · ohne Küche, 3 Zimmer',     cat: 'wohnen', nuf: 66, bgf: 78, herst: 239000, marge: 0.15 },
  { kuerzel: 'CoMod Home 96 (UK,D,3Z)', family: 'home', groesse: 96, kueche: 'U-Küche', zimmer: 3, beschr: '3× 32 m² · U-Küche, Dusche, 3 Zimmer',  cat: 'wohnen', nuf: 96, bgf: 108, herst: 289000, marge: 0.15 },
  { kuerzel: 'CoMod Home 96 (LK,D,3Z)', family: 'home', groesse: 96, kueche: 'L-Küche', zimmer: 3, beschr: '3× 32 m² · L-Küche, Dusche, 3 Zimmer',  cat: 'wohnen', nuf: 96, bgf: 108, herst: 289000, marge: 0.15 },
  { kuerzel: 'CoMod Home 96 (D,3Z)',    family: 'home', groesse: 96, kueche: 'Ohne Küche', zimmer: 3, beschr: '3× 32 m² · ohne Küche, 3 Zimmer',     cat: 'wohnen', nuf: 96, bgf: 108, herst: 279000, marge: 0.15 },
  { kuerzel: 'CoMod Add 32',            family: 'add',  groesse: 32, beschr: 'Leer, groß (32 m²)',                                  cat: 'ergaenzung', nuf: 32, bgf: 36, herst: 39000,  marge: 0.075 },
  { kuerzel: 'CoMod Add 22',            family: 'add',  groesse: 22, beschr: 'Leer, mittel (22 m²)',                                cat: 'ergaenzung', nuf: 22, bgf: 26, herst: 35000,  marge: 0.075 },
  { kuerzel: 'CoMod Add 12',            family: 'add',  groesse: 12, beschr: 'Leer, klein (12 m²)',                                 cat: 'ergaenzung', nuf: 12, bgf: 14, herst: 29000,  marge: 0.075 },
];

// ⚠️ Einnahmen-Werte sind Indikationen — bitte vor Live-Gang mit Marc & Vanisson final abstimmen
//    Annahme: Monatsmieten brutto. CoWork-Werte basieren auf Vollauslastung mit ~25 €/m² Markt-Niveau.
//    Community-Module: 0 € weil Einnahmen über umliegende Bewohner umgelegt werden (Quartiers-Modell).
const PRODUCTS_GEWERB_RAW = [
  { kuerzel: 'CoMod Live B (LK,D,M)',   displayName: 'CoMod Live (LK,D,M)', family: 'liveb', kueche: 'L-Küche',    moebliert: true,  beschr: 'L-Küche, Duschbad, möbliert',          cat: 'wohnen',     nuf: 32, bgf: 36, herst: 149000, marge: 0.15,  einnahmen: 1800, fee: 0.15 },
  { kuerzel: 'CoMod Live B (D,M)',      displayName: 'CoMod Live (D,M)',    family: 'liveb', kueche: 'Ohne Küche', moebliert: true,  beschr: 'Duschbad, möbliert',                   cat: 'wohnen',     nuf: 32, bgf: 36, herst: 144000, marge: 0.15,  einnahmen: 1700, fee: 0.15 },
  { kuerzel: 'CoMod Live B (D)',        displayName: 'CoMod Live (D)',      family: 'liveb', kueche: 'Ohne Küche', moebliert: false, beschr: 'Duschbad',                             cat: 'wohnen',     nuf: 32, bgf: 36, herst: 139000, marge: 0.15,  einnahmen: 1600, fee: 0.15 },
  { kuerzel: 'CoMod Studio (PK,D,M)',   family: 'studio', beschr: 'Pantry-Küche, Duschbad, möbliert',                                            cat: 'wohnen'    , nuf: 32, bgf: 36, herst: 139000, marge: 0.15,  einnahmen: 2000, fee: 0.15 },
  { kuerzel: 'CoMod Stay (LK,D,M)',     family: 'stay',  kueche: 'L-Küche', beschr: 'L-Küche, Duschbad, möbliert',                               cat: 'wohnen'    , nuf: 24, bgf: 28, herst: 124000, marge: 0.15,  einnahmen: 1900, fee: 0.15 },
  { kuerzel: 'CoMod Stay (PK,D,M)',     family: 'stay',  kueche: 'Pantry', beschr: 'Pantry-Küche, Duschbad, möbliert',                            cat: 'wohnen'    , nuf: 24, bgf: 28, herst: 124000, marge: 0.15,  einnahmen: 1800, fee: 0.15 },
  { kuerzel: 'CoMod Double B (D,M)',    displayName: 'CoMod Double (D,M)',  family: 'double', beschr: '2-in-1, 2 Duschbäder, möbliert',                                                cat: 'wohnen'    , nuf: 36, bgf: 40, herst: 119000, marge: 0.15,  einnahmen: 2200, fee: 0.15 },
  { kuerzel: 'CoMod Gym',             family: 'gym',     beschr: 'Mit Duschen, Umkleiden',                                                      cat: 'erlebnis',   nuf: 32, bgf: 36, herst: 109000, marge: 0.175, einnahmen: 1400, fee: 0.10 },
  { kuerzel: 'CoMod Music',           family: 'music',   beschr: 'Schalloptimiert',                                                             cat: 'erlebnis',   nuf: 32, bgf: 36, herst: 42000,  marge: 0.10,  einnahmen: 800,  fee: 0.10 },
  { kuerzel: 'CoMod Wellness',        family: 'wellness',beschr: 'Sauna, Eisbad, Liegen',                                                       cat: 'erlebnis',   nuf: 32, bgf: 36, herst: 99000,  marge: 0.175, einnahmen: 1200, fee: 0.10 },
  { kuerzel: 'CoMod CoWork 32',       family: 'cowork',  groesse: 32, beschr: 'Co-Working 32 m², Küchenzeile, WC',                              cat: 'arbeit',     nuf: 32, bgf: 36, herst: 79000,  marge: 0.125, einnahmen: 800,  fee: 0.05 },
  { kuerzel: 'CoMod CoWork 64',       family: 'cowork',  groesse: 64, beschr: 'Co-Working 64 m², Küchenzeile, WC',                              cat: 'arbeit',     nuf: 64, bgf: 72, herst: 99000,  marge: 0.125, einnahmen: 1600, fee: 0.05 },
  { kuerzel: 'CoMod CoWork 96',       family: 'cowork',  groesse: 96, beschr: 'Co-Working 96 m², Küchenzeile, WC',                              cat: 'arbeit',     nuf: 96, bgf: 108,herst: 109000, marge: 0.125, einnahmen: 2400, fee: 0.05 },
  { kuerzel: 'CoMod Community 32',    family: 'community', groesse: 32, beschr: 'Versammlung 32 m², mit WC',                                    cat: 'arbeit',     nuf: 32, bgf: 36, herst: 79000,  marge: 0.10,  einnahmen: 0,    fee: 0    },
  { kuerzel: 'CoMod Community 64',    family: 'community', groesse: 64, beschr: 'Versammlung 64 m², mit WC',                                    cat: 'arbeit',     nuf: 64, bgf: 72, herst: 89000,  marge: 0.10,  einnahmen: 0,    fee: 0    },
  { kuerzel: 'CoMod Community 96',    family: 'community', groesse: 96, beschr: 'Versammlung 96 m², mit WC',                                    cat: 'arbeit',     nuf: 96, bgf: 108,herst: 99000,  marge: 0.10,  einnahmen: 0,    fee: 0    },
  { kuerzel: 'CoMod Add B 32',          family: 'addb',    groesse: 32, beschr: 'Leer, groß (32 m²)',                                              cat: 'ergaenzung', nuf: 32, bgf: 36, herst: 39000,  marge: 0.075, einnahmen: 0,    fee: 0    },
  { kuerzel: 'CoMod Add B 22',          family: 'addb',    groesse: 22, beschr: 'Leer, mittel (22 m²)',                                            cat: 'ergaenzung', nuf: 22, bgf: 26, herst: 35000,  marge: 0.075, einnahmen: 0,    fee: 0    },
  { kuerzel: 'CoMod Add B 12',          family: 'addb',    groesse: 12, beschr: 'Leer, klein (12 m²)',                                             cat: 'ergaenzung', nuf: 12, bgf: 14, herst: 29000,  marge: 0.075, einnahmen: 0,    fee: 0    },
  { kuerzel: 'Container-Pool',          family: 'pool',    beschr: 'Pool mit Strömungsanlage, Terrassen, Filter',                                  cat: 'erlebnis',   nuf: 32, bgf: 36, herst: 59000,  marge: 0.075, einnahmen: 0,    fee: 0    },
];

// === SETTINGS — werden beim App-Start aus DB überschrieben (Fallback: Werte hier) ===
let PROV = 0.035;
let MARGE_STD = 0.125; // globale Standard-Marge (Settings 'MARGE'); nur Fallback, falls ein Modul keine eigene Marge hat
let UST = 0.19;
let ANZ_PCT = 0.35;

const FAMILY_LABELS = {
  live:      { label: 'CoMod Live',     desc: 'Wohnmodul, 32 m² NUF' },
  home:      { label: 'CoMod Home',     desc: 'Wohnkombi aus 2-3 Modulen, 44 / 64 / 66 / 96 m² NUF' },
  add:       { label: 'CoMod Add',      desc: 'Ergänzungsmodul leer, 12 / 22 / 32 m²' },
  liveb:     { label: 'CoMod Live',     desc: 'Wohnmodul gewerblich, 32 m²' },
  studio:    { label: 'CoMod Studio',   desc: 'Ferienwohnung, 32 m² NUF, möbliert' },
  stay:      { label: 'CoMod Stay',     desc: 'Hotel/KZW-Modul, 22 m² NUF, möbliert' },
  double:    { label: 'CoMod Double',   desc: 'Doppelwohnmodul, 36 m² NUF, möbliert' },
  gym:       { label: 'CoMod Gym',      desc: 'Volldigitales Gym mit Duschen' },
  music:     { label: 'CoMod Music',    desc: 'Schalloptimierter Probe-/Musikraum' },
  wellness:  { label: 'CoMod Wellness', desc: 'Mini-Sauna, Eisbad, Liegen' },
  cowork:    { label: 'CoMod CoWork',   desc: 'Co-Working-Kombi, 32 / 64 / 96 m²' },
  community: { label: 'CoMod Community',desc: 'Versammlungsmodul, 32 / 64 / 96 m²' },
  addb:      { label: 'CoMod Add B',    desc: 'Ergänzungsmodul gewerblich, leer' },
  pool:      { label: 'Container-Pool', desc: 'Pool mit Strömungsanlage' },
  stack:     { label: 'CoMod Stack',    desc: 'Gestapelte Modul-Kombination, 2 Geschosse + Dachterrasse' },
};

// Add ist die einzige Familie, die je nach Auswahl privat oder gewerblich werden kann
const ADD_FAMILY_PAIR = { privat: 'add', business: 'addb' };

const FAMILIES_PRIVAT = ['live', 'home', 'add', 'stack'];
const FAMILIES_BUSINESS = ['liveb', 'studio', 'stay', 'double', 'gym', 'music', 'wellness', 'cowork', 'community', 'addb', 'pool', 'stack'];

// ⚠️ PLATZHALTER — alle Werte später Admin-pflegbar im Backend
// Plausibilitäts-Anmerkungen (Stand Oct 2025):
// - Strom 0,90 €/m² liegt über dem Markt-Durchschnitt (typ. 0,30-0,60 €/m²)
// - Heizung 1,20 €/m² im üblichen Bereich (1,00-1,50)
// - Gesamtsumme 5,40 €/m²/Mt enthält CoMod-spezifische Posten (Lizenz, QM)
// typ: 'fix' = laufende Fixkosten (kalkulierbar, Teil der Gesamtbelastung als "+ laufende Kosten")
//      'verbrauch' = variable Verbrauchskosten (individueller Richtwert, NICHT in Belastung eingerechnet)
let NEBENKOSTEN_POSTEN = [
  { id: 'lizenz',  label: 'Lizenzgebühr CoMod',   proM2: 0.80, typ: 'fix' },
  { id: 'qm',      label: 'Quartiersmanagement',  proM2: 0.70, typ: 'fix' },
  { id: 'vers',    label: 'Versicherung',         proM2: 0.40, typ: 'fix' },
  { id: 'instand', label: 'Instandhaltung',       proM2: 0.80, typ: 'fix' },
  { id: 'strom',   label: 'Strom & Allgemein',    proM2: 0.90, typ: 'verbrauch' },
  { id: 'wasser',  label: 'Wasser / Abwasser',    proM2: 0.60, typ: 'verbrauch' },
  { id: 'heizung', label: 'Heizung / Warmwasser', proM2: 1.20, typ: 'verbrauch' },
];

let ZIEL_MODUL_NUF = 32; // Mittelwert für Pacht-Umlage-Berechnung (alle Module gerechnet mit 32 m²)
let ZIEL_MODUL_BGF = 36; // Standard-BGF eines Moduls für Mindestflächenberechnung
let BEBAUUNGSGRAD = 0.80; // 80% der Fläche sind effektiv bebaubar (Rest = Wege, Begrünung, Parkplätze etc.)
// Pauschalkosten je Modul (aus Settings)
let KOSTEN_FUNDAMENT_PRO_EG_MODUL = 1000;       // Schraubfundamente inkl. Arbeit pro EG-Modul
let KOSTEN_TREPPEN_LAUBENGANG_PRO_MODUL = 3500; // OG + DG benötigen Aufgänge
let KOSTEN_TERRASSE_PRO_MODUL = 2500;           // EG bekommt Terrasse
let KOSTEN_PV_PRO_MODUL = 12000;                // PV-Anlage inkl. Speicher & Wechselrichter pro oberstem Modul
let KOSTEN_DACHBEGRUENUNG_PRO_MODUL = 4500;     // extensive Dachbegrünung je oberstem Modul

// Optionale Upgrades für Privatkunden (Brutto-Preise; werden auf GLS-Finanzierung aufgerechnet, nie KfW)
// Preise vorerst aus Gewerbe übernommen, später Backend-pflegbar
const PRIVAT_UPGRADES = [
  { id: 'terrasse', label: 'Terrasse', proModul: KOSTEN_TERRASSE_PRO_MODUL, hint: 'Je Modul im Erdgeschoss', bezug: 'alle' },
  { id: 'pv',       label: 'PV-Anlage inkl. Speicher', proModul: KOSTEN_PV_PRO_MODUL, hint: 'Je Modul, inkl. Wechselrichter & Speicher', bezug: 'alle' },
  { id: 'gruen',    label: 'Dachbegrünung', proModul: KOSTEN_DACHBEGRUENUNG_PRO_MODUL, hint: 'Extensive Begrünung je Modul', bezug: 'alle' },
];

// === BAUGENEHMIGUNG NRW ===
// Berechnung nach NRW-Schema: BRI × Bauwert × Gebührensatz
// (Richtwert — regional unterschiedlich; im Backend später anpassbar)
let MODUL_HOEHE = 3.2;          // m — einheitliche Stockwerkshöhe für BRI-Berechnung
let BAUWERT_PRO_M3 = 400;       // €/m³ — Richtwert NRW
let GEBUEHR_SATZ = 0.006;       // 0,6 % der Rohbausumme
let GEBUEHR_MINDEST = 500;      // €
let GEBUEHR_RUNDUNG = 500;      // aufgerundet auf volle 500 €

// Bruttorauminhalt eines Moduls (BRI = BGF × Höhe)
function calcBRI(bgf) {
  return bgf * MODUL_HOEHE;
}

// Baugenehmigungsgebühr auf Basis der Gesamt-BRI (Projekt-Sichtweise)
// Aufgerundet auf volle 500 €, Mindestgebühr 500 €
function calcBaugenehmigung(gesamtBGF) {
  if (gesamtBGF <= 0) return 0;
  const bri = gesamtBGF * MODUL_HOEHE;
  const rohbau = bri * BAUWERT_PRO_M3;
  const gebRaw = rohbau * GEBUEHR_SATZ;
  return Math.max(GEBUEHR_MINDEST, Math.ceil(gebRaw / GEBUEHR_RUNDUNG) * GEBUEHR_RUNDUNG);
}

function withPrices(p) {
  const grundpreis = p.herst * p.marge;
  const provision = p.herst * PROV;
  const netto = p.herst + grundpreis + provision;
  const brutto = netto * (1 + UST);
  return { ...p, netto, brutto };
}

// Rabatt wirkt auf Herstellungskosten — Marge UND Provision werden anteilig auf dem
// rabattierten Herstellpreis berechnet (Feedback V8). Damit profitiert der Kunde nicht
// nur über den Herstellungspreis-Rabatt, sondern auch über die korrespondierende Reduktion
// von Marge und Provision.
// margeOverride (optional): Projekt-Marge ersetzt im Projekt die Modul-Marge. null/undefined = Modul-Marge.
function calcRabattiertePreise(product, rabattPct, margeOverride) {
  const marge = (margeOverride != null) ? margeOverride
              : (product.marge != null ? product.marge : MARGE_STD);
  const herstRabattiert = product.herst * (1 - rabattPct);
  const grundpreis = herstRabattiert * marge;
  const provision = herstRabattiert * PROV;
  const netto = herstRabattiert + grundpreis + provision;
  const brutto = netto * (1 + UST);
  const baseNetto = product.herst * (1 + marge + PROV); // ungerabattete Referenz mit eff. Marge
  return { netto, brutto, rabattEUR: baseNetto - netto };
}

// Mapping: Modul-Kürzel → Grundriss-Icon (PNG im public/icons-Verzeichnis)
// Bei Modul-Kürzeln wird der Klammern-Suffix in einen Dateinamen umgewandelt
// "CoMod Live (UK,D,M)" → "comod_live_ukdm.png"
const ICON_MAP = {
  // Live (alle 8 Varianten zeigen das gleiche Layout je nach Küche; möbliert=unmöbliert visuell gleich)
  'CoMod Live (UK,D,M)':     'comod_live_ukdm.png',
  'CoMod Live (UK,D)':       'comod_live_ukdm.png',
  'CoMod Live (LK,D,M)':     'comod_live_lkdm.png',
  'CoMod Live (LK,D)':       'comod_live_lkdm.png',
  'CoMod Live (PK,D,M)':     'comod_live_pkdm.png',
  'CoMod Live (PK,D)':       'comod_live_pkdm.png',
  'CoMod Live (D,M)':        'comod_live_dm.png',
  'CoMod Live (D)':          'comod_live_dm.png',
  // Home — exakte Mapping nach Größe & Variante (Dateinamen behalten alte Bezeichnung,
  // damit Icon-Dateien im /public/icons/ Ordner nicht umbenannt werden müssen)
  'CoMod Home 44 (UK,D,1Z)': 'comod_home48_ukd1z.png',
  'CoMod Home 44 (LK,D,2Z)': 'comod_home48_lkd2z.png',
  'CoMod Home 64 (UK,D,2Z)': 'comod_home64_ukd2z.png',
  'CoMod Home 64 (LK,D,2Z)': 'comod_home64_lkd2z.png',
  'CoMod Home 64 (D,2Z)':    'comod_home64_d2z.png',
  'CoMod Home 64 (D,4Z)':    'comod_home64_d4z.png',
  'CoMod Home 66 (UK,D,1Z)': 'comod_home72_ukd1z.png',
  'CoMod Home 66 (LK,D,2Z)': 'comod_home72_lkd2z.png',
  'CoMod Home 66 (D,3Z)':    'comod_home72_d3z.png',
  'CoMod Home 96 (UK,D,3Z)': 'comod_home96_ukd3z.png',
  'CoMod Home 96 (LK,D,3Z)': 'comod_home96_lkd3z.png',
  'CoMod Home 96 (D,3Z)':    'comod_home96_d3z.png',
  // Add (Ergänzungsmodule, leer)
  'CoMod Add 12':            'comod_add12_leer.png',
  'CoMod Add 22':            'comod_add24_leer.png',
  'CoMod Add 32':            'comod_add32_leer.png',
  'CoMod Add B 12':          'comod_add12_leer.png',
  'CoMod Add B 22':          'comod_add24_leer.png',
  'CoMod Add B 32':          'comod_add32_leer.png',
  // Gewerblich
  'CoMod Live B (UK,D,M)':   'comod_live_ukdm.png',
  'CoMod Live B (LK,D,M)':   'comod_live_lkdm.png',
  'CoMod Live B (D,M)':      'comod_live_dm.png',
  'CoMod Studio (PK,D,M)':   'comod_studio_pkdm.png',
  'CoMod Stay (LK,D,M)':     'comod_stay_lkdm.png',
  'CoMod Stay (PK,D,M)':     'comod_stay_pkdm.png',
  'CoMod Double B (D,M)':    'comod_double.png',
  'CoMod Gym':             'comod_gym.png',
  'CoMod Music':           'comod_music.png',
  'CoMod Wellness':        'comod_wellness.png',
  'CoMod CoWork 32':       'comod_cowork32.png',
  'CoMod CoWork 64':       'comod_cowork64.png',
  'CoMod CoWork 96':       'comod_cowork96.png',
  'CoMod Community 32':    'comod_community32.png',
  'CoMod Community 64':    'comod_community64.png',
  'CoMod Community 96':    'comod_community96.png',
  'Container-Pool':          'comod_pool.png',
};

function getModulIcon(kuerzel) {
  return ICON_MAP[kuerzel] ? `/icons/${ICON_MAP[kuerzel]}` : null;
}

// Display-Name: bevorzugt displayName-Property, sonst kuerzel
// (manche Gewerbe-Module haben "B" im internen Kürzel für Eindeutigkeit, aber sollen ohne "B" angezeigt werden)
function getDisplayName(product) {
  return product.displayName || product.kuerzel;
}

// PRODUCTS und ALL_PRODUCTS sind initial mit RAW-Daten gefüllt (Fallback).
// Werden beim App-Start aus der Supabase-DB überschrieben (Stufe 2 — Backend-Anbindung).
// Bei DB-Fehler bleibt der Fallback bestehen.
let PRODUCTS = {
  privat:     PRODUCTS_PRIVAT_RAW.map(withPrices).map(p => ({ ...p, usage: 'p', einnahmen: 0, fee: 0 })),
  gewerblich: PRODUCTS_GEWERB_RAW.map(withPrices).map(p => ({ ...p, usage: 'g' })),
};
let ALL_PRODUCTS = [...PRODUCTS.privat, ...PRODUCTS.gewerblich];

// Mapping: DB-Schema → Frontend-Modul-Objekt
// withPrices wird danach noch angewandt für netto/brutto-Berechnung
function mapDbModuleToFrontend(db) {
  const base = {
    kuerzel: db.kuerzel,
    family: db.family,
    cat: db.category,
    usage: db.usage,
    beschr: db.beschreibung_de,
    nuf: db.nuf != null ? Number(db.nuf) : undefined,
    bgf: db.bgf != null ? Number(db.bgf) : undefined,
    // Footprint (EG-Grundfläche) — die für den Stellplatz auf dem Grundstück relevante Fläche.
    // Für 1-geschossige Module = bgf. Für Stack-Module = explizit gepflegt (z. B. 72 m²).
    footprint: db.footprint_m2 != null ? Number(db.footprint_m2) : (db.bgf != null ? Number(db.bgf) : undefined),
    herst: db.herst_preis,
    marge: Number(db.marge),
    // Anzahl Geschosse — Standard 1, für Stack-Module ggf. 2 oder 3 (Stapelung)
    // Wirkt sich auf Flächenbedarf (Footprint) aus
    geschosse: db.geschosse != null ? Number(db.geschosse) : 1,
  };
  // Optionale Felder nur setzen wenn vorhanden (Frontend prüft mit `in` oder undefined)
  if (db.display_name && db.display_name !== db.kuerzel) base.displayName = db.display_name;
  if (db.kueche) base.kueche = db.kueche;
  if (db.moebliert != null) base.moebliert = db.moebliert;
  if (db.groesse_label != null) base.groesse = db.groesse_label;
  if (db.usage === 'g') {
    base.einnahmen = db.einnahmen_indikation || 0;
    base.fee = Number(db.fee || 0);
  } else {
    base.einnahmen = 0;
    base.fee = 0;
  }
  return base;
}

// Lädt alle aktiven Module aus Supabase und ersetzt PRODUCTS + ALL_PRODUCTS
// Gibt true zurück bei Erfolg, false bei Fehler/Fallback
async function loadProductsFromDb() {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });
    if (error) { console.warn('[Supabase] Module-Load Fehler:', error.message); return false; }
    if (!data || data.length === 0) { console.warn('[Supabase] Keine Module in DB gefunden, Fallback aktiv'); return false; }
    const mapped = data.map(mapDbModuleToFrontend).map(withPrices);
    PRODUCTS = {
      privat:     mapped.filter(p => p.usage === 'p'),
      gewerblich: mapped.filter(p => p.usage === 'g'),
    };
    ALL_PRODUCTS = [...PRODUCTS.privat, ...PRODUCTS.gewerblich];
    console.log(`[Supabase] ${mapped.length} Module aus DB geladen (${PRODUCTS.privat.length} privat, ${PRODUCTS.gewerblich.length} gewerblich)`);
    return true;
  } catch (e) {
    console.warn('[Supabase] Verbindungsfehler, Fallback auf hartcodierte Module:', e.message);
    return false;
  }
}

// PROJECTS_TEMPLATES — Fallback. Wird beim App-Start aus DB überschrieben.
// Bei DB-Fehler bleibt diese hartcodierte Liste aktiv.
let PROJECTS_TEMPLATES = [
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

// Mapping DB-Schema → Frontend-Format
function mapDbProjectToFrontend(db) {
  return {
    id: db.slug,                                        // Frontend nutzt Slug als id
    name: db.name,
    location: db.location || '',
    description: db.description_de || '',
    description2: db.description2_de || '',
    heroImageUrl: db.hero_image_url || null,
    projektrabatt: Number(db.projektrabatt || 0),
    projektMarge: (db.projekt_marge == null ? null : Number(db.projekt_marge)),
    einnahmenFaktor: (db.einnahmen_faktor == null ? 1 : Number(db.einnahmen_faktor)),
    transportProModul: Number(db.transport_pro_modul || 0),
    aufstellungProModul: Number(db.aufstellung_pro_modul || 0),
    umlageProModulEinmalig: db.umlage_pro_modul_einmalig || 0,
    pachtJahr: db.pacht_jahr || 0,
    pachtGewerblich: !!db.pacht_gewerblich,
    zielModulAnzahl: db.ziel_modul_anzahl,
    maxModulAnzahl: db.max_modul_anzahl,
    grundstueckGroesse: db.grundstueck_groesse,
    fassadenVarianteId: db.fassaden_variante_id,
  };
}

// Lädt alle 'live'-Projekte aus DB und ersetzt PROJECTS_TEMPLATES
async function loadProjectsFromDb() {
  try {
    const { data, error } = await supabase
      .from('projects').select('*')
      .eq('status', 'live').is('deleted_at', null)
      .order('sort_order', { ascending: true });
    if (error) { console.warn('[Supabase] Projekt-Load Fehler:', error.message); return false; }
    if (!data || data.length === 0) { console.warn('[Supabase] Keine Live-Projekte in DB, Fallback aktiv'); return false; }
    PROJECTS_TEMPLATES = data.map(mapDbProjectToFrontend);
    console.log(`[Supabase] ${PROJECTS_TEMPLATES.length} Projekte aus DB geladen`);
    return true;
  } catch (e) {
    console.warn('[Supabase] Projekt-Load Verbindungsfehler:', e.message);
    return false;
  }
}

// ===== Content-Blocks (editierbare Texte) =====
// Modul-globaler Cache: { key: { de, en } }. Wird beim Start aus der DB befüllt.
// getContentText() liefert den DB-Text, sonst den übergebenen Fallback (= aktueller Code-Text).
let CONTENT_BLOCKS = {};
function getContentText(key, fallback = '', lang = 'de') {
  const b = CONTENT_BLOCKS[key];
  if (!b) return fallback;
  const val = lang === 'en' ? b.en : b.de;
  return (val != null && String(val).trim() !== '') ? val : fallback;
}
async function loadContentBlocksFromDb() {
  try {
    const { data, error } = await supabase.from('content_blocks').select('key, content_de, content_en');
    if (error) { console.warn('[Supabase] Content-Blocks-Load Fehler:', error.message); return false; }
    if (!data || data.length === 0) { console.warn('[Supabase] Keine Content-Blocks in DB, Fallback aktiv'); return false; }
    const map = {};
    data.forEach(b => { if (b.key) map[b.key] = { de: b.content_de, en: b.content_en }; });
    CONTENT_BLOCKS = map;
    console.log(`[Supabase] ${Object.keys(CONTENT_BLOCKS).length} Content-Blocks aus DB geladen`);
    return true;
  } catch (e) {
    console.warn('[Supabase] Content-Blocks-Load Verbindungsfehler:', e.message);
    return false;
  }
}

let RABATT_STAFFEL = [
  { ab: 5, prozent: 0.05 }, { ab: 10, prozent: 0.10 }, { ab: 25, prozent: 0.15 },
  { ab: 50, prozent: 0.20 }, { ab: 75, prozent: 0.25 }, { ab: 100, prozent: 0.30 },
];

// Lädt alle globalen Settings aus der DB und überschreibt die Default-Konstanten.
// Bei Fehler bleibt der Fallback (hartcodiert) aktiv.
async function loadSettingsFromDb() {
  try {
    const { data, error } = await supabase.from('settings').select('*').is('workspace_id', null);
    if (error) { console.warn('[Supabase] Settings-Load Fehler:', error.message); return false; }
    if (!data || data.length === 0) { console.warn('[Supabase] Keine Settings in DB'); return false; }
    const map = {};
    data.forEach(s => { map[s.key] = s.value; });

    // Einfache Skalar-Settings
    if (map.PROV != null)             PROV = Number(map.PROV);
    if (map.MARGE != null)            MARGE_STD = Number(map.MARGE);
    if (map.UST != null)              UST = Number(map.UST);
    if (map.ANZ_PCT != null)          ANZ_PCT = Number(map.ANZ_PCT);
    if (map.BEBAUUNGSGRAD != null)    BEBAUUNGSGRAD = Number(map.BEBAUUNGSGRAD);
    if (map.ZIEL_MODUL_NUF != null)   ZIEL_MODUL_NUF = Number(map.ZIEL_MODUL_NUF);
    if (map.ZIEL_MODUL_BGF != null)   ZIEL_MODUL_BGF = Number(map.ZIEL_MODUL_BGF);
    if (map.MODUL_HOEHE_CM != null)   MODUL_HOEHE = Number(map.MODUL_HOEHE_CM) / 100;
    if (map.BAUWERT_PRO_M3 != null)   BAUWERT_PRO_M3 = Number(map.BAUWERT_PRO_M3);
    if (map.GEBUEHR_SATZ != null)     GEBUEHR_SATZ = Number(map.GEBUEHR_SATZ);
    if (map.GEBUEHR_MINDEST != null)  GEBUEHR_MINDEST = Number(map.GEBUEHR_MINDEST);
    if (map.GEBUEHR_RUNDUNG != null)  GEBUEHR_RUNDUNG = Number(map.GEBUEHR_RUNDUNG);
    if (map.KOSTEN_TREPPEN_LAUBENGANG_PRO_MODUL != null) KOSTEN_TREPPEN_LAUBENGANG_PRO_MODUL = Number(map.KOSTEN_TREPPEN_LAUBENGANG_PRO_MODUL);
    if (map.KOSTEN_FUNDAMENT_PRO_EG_MODUL != null)       KOSTEN_FUNDAMENT_PRO_EG_MODUL = Number(map.KOSTEN_FUNDAMENT_PRO_EG_MODUL);
    if (map.KOSTEN_TERRASSE_PRO_MODUL != null)           KOSTEN_TERRASSE_PRO_MODUL = Number(map.KOSTEN_TERRASSE_PRO_MODUL);
    if (map.KOSTEN_PV_PRO_MODUL != null)                 KOSTEN_PV_PRO_MODUL = Number(map.KOSTEN_PV_PRO_MODUL);
    if (map.KOSTEN_DACHBEGRUENUNG_PRO_MODUL != null)     KOSTEN_DACHBEGRUENUNG_PRO_MODUL = Number(map.KOSTEN_DACHBEGRUENUNG_PRO_MODUL);

    // Rabattstaffel (Array)
    if (Array.isArray(map.RABATT_STAFFEL) && map.RABATT_STAFFEL.length > 0) {
      RABATT_STAFFEL = [...map.RABATT_STAFFEL]
        .map(s => ({ ab: Number(s.ab), prozent: Number(s.prozent) }))
        .sort((a, b) => a.ab - b.ab);
    }

    // Projektkosten-Staffel (Array) — Sortierung: Stufen mit maxMod=null/Infinity ans Ende
    if (Array.isArray(map.PROJEKTKOSTEN_STAFFEL) && map.PROJEKTKOSTEN_STAFFEL.length > 0) {
      PROJEKTKOSTEN_STAFFEL = [...map.PROJEKTKOSTEN_STAFFEL]
        .map(s => ({
          maxMod: (s.maxMod == null || s.maxMod === 'unbegrenzt') ? null : Number(s.maxMod),
          arch: Number(s.arch) || 0,
          eing: Number(s.eing) || 0,
          pm:   Number(s.pm)   || 0,
        }))
        .sort((a, b) => {
          if (a.maxMod == null) return 1;
          if (b.maxMod == null) return -1;
          return a.maxMod - b.maxMod;
        });
    }

    // Grundstücks-Optionen (Array) — nur netto + label sind vom Admin editierbar.
    // bezug/anteil/schaetzungsfaehig sind Logik-Felder; wir nehmen sie aus DB, falls vorhanden,
    // sonst aus den Code-Defaults (Sicherheitsnetz).
    if (Array.isArray(map.GRDST_OPTIONEN) && map.GRDST_OPTIONEN.length > 0) {
      const codeDefaults = Object.fromEntries(GRDST_OPTIONEN.map(o => [o.id, o]));
      GRDST_OPTIONEN = map.GRDST_OPTIONEN.map(s => {
        const def = codeDefaults[s.id] || {};
        return {
          id: s.id,
          label: s.label || def.label || s.id,
          netto: Number(s.netto) || 0,
          bezug: s.bezug || def.bezug || 'grundstueck',
          anteil: s.anteil != null ? Number(s.anteil) : def.anteil,
          schaetzungsfaehig: s.schaetzungsfaehig != null ? !!s.schaetzungsfaehig : !!def.schaetzungsfaehig,
        };
      });
    }

    // Finanzierungs-Defaults aus mehreren Settings zusammenbauen
    FIN_DEFAULTS = {
      kfw: {
        foerderhoehe: Number(map.KFW_FOERDERHOEHE ?? FIN_DEFAULTS.kfw.foerderhoehe),
        zins:         Number(map.KFW_ZINS ?? FIN_DEFAULTS.kfw.zins),
        laufzeit:     Number(map.KFW_LAUFZEIT_JAHRE ?? FIN_DEFAULTS.kfw.laufzeit),
        tilgungsnachlass: Number(map.KFW_TILGUNGSNACHLASS ?? FIN_DEFAULTS.kfw.tilgungsnachlass),
      },
      gls: {
        zins:     Number(map.GLS_ZINS ?? FIN_DEFAULTS.gls.zins),
        laufzeit: Number(map.GLS_LAUFZEIT_JAHRE ?? FIN_DEFAULTS.gls.laufzeit),
      },
      plattform: {
        zins:        Number(map.PLATTFORM_ZINS_DEFAULT ?? FIN_DEFAULTS.plattform.zins),
        laufzeit:    Number(map.PLATTFORM_LAUFZEIT_JAHRE ?? FIN_DEFAULTS.plattform.laufzeit),
        steuer:      Number(map.STEUER_GMBH ?? FIN_DEFAULTS.plattform.steuer),
        afaJahre:    Number(map.AFA_JAHRE ?? FIN_DEFAULTS.plattform.afaJahre),
        restwertPct: Number(map.PLATTFORM_RESTWERT_PCT ?? FIN_DEFAULTS.plattform.restwertPct),
      },
    };

    // Nebenkosten/Verbrauch aus Settings
    const nebenkostenMap = {
      lizenz: 'NEBENKOSTEN_LIZENZ_PRO_M2',
      qm:     'NEBENKOSTEN_QM_PRO_M2',
      vers:   'NEBENKOSTEN_VERS_PRO_M2',
      instand: 'NEBENKOSTEN_INSTAND_PRO_M2',
      strom:  'VERBRAUCH_STROM_PRO_M2',
      wasser: 'VERBRAUCH_WASSER_PRO_M2',
      heizung: 'VERBRAUCH_HEIZUNG_PRO_M2',
    };
    NEBENKOSTEN_POSTEN = NEBENKOSTEN_POSTEN.map(p => {
      const k = nebenkostenMap[p.id];
      return k && map[k] != null ? { ...p, proM2: Number(map[k]) } : p;
    });

    console.log(`[Supabase] ${data.length} Settings aus DB geladen`);
    return true;
  } catch (e) {
    console.warn('[Supabase] Settings-Load Verbindungsfehler:', e.message);
    return false;
  }
}

// Projektkosten-Staffel — Pflicht-Posten, die unabhängig von der Modulanzahl anfallen.
// `maxMod: null` bedeutet "unbegrenzt" (höchste Stufe). Wird beim App-Start aus DB überschrieben.
let PROJEKTKOSTEN_STAFFEL = [
  { maxMod: 10,   arch: 7500,  eing: 12500, pm: 36000  },
  { maxMod: 25,   arch: 15000, eing: 25000, pm: 60000  },
  { maxMod: 50,   arch: 25000, eing: 39000, pm: 90000  },
  { maxMod: null, arch: 35000, eing: 59000, pm: 120000 },
];

// Grundstücksbezogene Optionen — wird beim App-Start aus DB überschrieben
let GRDST_OPTIONEN = [
  { id: 'abriss', label: 'Abriss vorhandener Bebauung',          netto: 50,  bezug: 'grundstueck', schaetzungsfaehig: false },
  { id: 'erschl', label: 'Erschließung (Strom/Wasser/Abwasser)', netto: 100, bezug: 'grundstueck', schaetzungsfaehig: true },
  { id: 'wege',   label: 'Wege, Schotter, Pflaster',              netto: 75,  bezug: 'freiflaeche', anteil: 0.3, schaetzungsfaehig: true },
  { id: 'gruen',  label: 'Begrünung, Bäume, Hecken',              netto: 75,  bezug: 'freiflaeche', anteil: 0.7, schaetzungsfaehig: true },
];

let FIN_DEFAULTS = {
  kfw: { foerderhoehe: 150000, zins: 0.02, laufzeit: 25, tilgungsnachlass: 0.15 },
  gls: { zins: 0.05, laufzeit: 10 }, // Laufzeit fix
  plattform: { zins: 0.055, laufzeit: 10, steuer: 0.30, afaJahre: 10, restwertPct: 0 }, // Laufzeit max 10, AfA wie Container (nicht Tiny House)
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
  // maxMod === null bedeutet "unbegrenzt" — gilt für alle Anzahlen oberhalb der vorletzten Stufe
  const t = PROJEKTKOSTEN_STAFFEL.find(s => s.maxMod == null || modulAnzahl <= s.maxMod)
         || PROJEKTKOSTEN_STAFFEL[PROJEKTKOSTEN_STAFFEL.length - 1];
  const netto = t.arch + t.eing + t.pm;
  return { arch: t.arch, eing: t.eing, pm: t.pm, netto, brutto: netto * (1 + UST) };
}
// Footprint = EG-Grundfläche eines Moduls auf dem Grundstück
// - Module mit eigenem footprint (z. B. Stack: 72 m²): exakter Wert aus DB
// - Module ohne footprint: bgf verteilt auf userGeschosse (Normalfall: 1-geschossige Module)
function calcFootprintProModul(product, userGeschosse) {
  if (!product || !product.bgf) return 0;
  // Module mit explizitem Footprint (Stack u. Ä.): eigener Wert, ignoriert User-Slider
  if (product.footprint != null && product.footprint > 0) return product.footprint;
  // Normale Module: verteilen sich auf vom User gewünschte Anzahl Geschosse
  return product.bgf / Math.max(1, userGeschosse || 1);
}

function calcMindestflaeche({ totalFootprint }) {
  if (totalFootprint <= 0) return { gebaeudeflaeche: 0, mindestGrundstueck: 0 };
  const gebaeudeflaeche = Math.ceil(totalFootprint);
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
//   - CoMod Home 44 (52 m²) → 2 Einheiten
//   - CoMod CoWork 96 (100 m²) → 3 Einheiten
//   - Kleine Add 12/24 → trotzdem 1 Einheit (passt nicht enger)
function calcModulEinheiten(product) {
  if (!product || !product.bgf) return 1;
  // CoMod Double ist ein einzelnes großes Modul (wie Live) — zählt für Flächenbedarf als 1 Einheit
  if (product.family === 'double') return 1;
  // Stellplatz-Einheiten basieren auf der EG-Grundfläche (footprint), nicht auf der Gesamt-BGF.
  // Bei Stack: 72 m² Footprint → 2 Einheiten (nicht 130/36 = 4).
  const footprint = (product.footprint != null && product.footprint > 0) ? product.footprint : product.bgf;
  return Math.max(1, Math.ceil(footprint / ZIEL_MODUL_BGF));
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
function calcEinmaligeProjektkosten({ modulAnzahl, grundstueckGroesse, geschosse, activeOptionen, hasGrundstueck, useEstimates, totalBGF, geschossVerteilung, pvAnteil, projektTotalBGF, projektModulAnzahl }) {
  const staffel = getProjektkostenStaffel(modulAnzahl);
  const gAnzahl = geschosse || 2;
  // Belegte Fläche für Grundstücks-Berechnung: basiert auf der GEPLANTEN Modulanzahl × Standard-BGF / Geschosse
  // (nicht auf der bisherigen User-Auswahl — sonst springt der Wert bei jedem Klick und wird kleiner je mehr Module gewählt)
  const belegteFlaeche = Math.ceil((modulAnzahl * ZIEL_MODUL_BGF) / gAnzahl);
  const tatsaechlicheGrdst = grundstueckGroesse || (useEstimates ? Math.ceil(belegteFlaeche / BEBAUUNGSGRAD) : 0);
  const freiflaeche = Math.max(0, tatsaechlicheGrdst - belegteFlaeche);
  const posten = [
    { id: 'arch', label: 'Architektur & Entwurfsplanung', netto: staffel.arch, brutto: staffel.arch * (1 + UST), typ: 'pflicht' },
    { id: 'eing', label: 'Eingabeplanung (Architekt)',   netto: staffel.eing, brutto: staffel.eing * (1 + UST), typ: 'pflicht' },
    { id: 'pm',   label: 'Projektmanagement & Bauleitung',  netto: staffel.pm,   brutto: staffel.pm   * (1 + UST), typ: 'pflicht' },
  ];

  // Baugenehmigungsgebühr (NRW-Richtwert)
  // - Wenn projektTotalBGF/projektModulAnzahl gesetzt (Projekt-Beitritt): Berechnung auf Projekt-Gesamt, anteilig auf Kunde
  // - Sonst (Privat eigen / Gewerbe): direkt auf gewählte Module
  // Steuerlich: Baugenehmigungsgebühren sind Verwaltungsgebühren der Behörde — KEINE Umsatzsteuer
  if (totalBGF > 0) {
    if (projektTotalBGF && projektModulAnzahl > 0) {
      const gesamtGebuehr = calcBaugenehmigung(projektTotalBGF);
      const anteil = gesamtGebuehr * (modulAnzahl / projektModulAnzahl);
      // Anteilig wieder auf 500er gerundet aufschlagen, Mindestgebühr greift nicht beim Anteil
      const anteilGerundet = Math.ceil(anteil / GEBUEHR_RUNDUNG) * GEBUEHR_RUNDUNG;
      posten.push({
        id: 'baugenehmigung', label: 'Baugenehmigung (anteilig)',
        netto: anteilGerundet, brutto: anteilGerundet, typ: 'pflicht',
        ohneUst: true,
        detail: `Anteilig ${modulAnzahl} von ${projektModulAnzahl} Modulen am Projekt-BRI`
      });
    } else {
      const gebuehr = calcBaugenehmigung(totalBGF);
      posten.push({
        id: 'baugenehmigung', label: 'Baugenehmigung (NRW-Richtwert)',
        netto: gebuehr, brutto: gebuehr, typ: 'pflicht',
        ohneUst: true,
        detail: `${(totalBGF * MODUL_HOEHE).toFixed(1)} m³ BRI × ${BAUWERT_PRO_M3} €/m³ × ${(GEBUEHR_SATZ * 100).toFixed(1)} %`
      });
    }
  }

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
      const nettoFund = egCount * KOSTEN_FUNDAMENT_PRO_EG_MODUL;
      posten.push({
        id: 'fundament', label: 'Fundamente (EG-Module)',
        netto: nettoFund, brutto: nettoFund * (1 + UST), typ: 'pflicht',
        detail: `${egCount} EG-Module × ${fmtEUR(KOSTEN_FUNDAMENT_PRO_EG_MODUL)} (Schraubfundamente inkl. Arbeit)`
      });
      const netto = egCount * KOSTEN_TERRASSE_PRO_MODUL;
      posten.push({
        id: 'terrasse', label: 'Terrassen (EG-Module)',
        netto, brutto: netto * (1 + UST), typ: 'pflicht',
        detail: `${egCount} EG-Module × ${fmtEUR(KOSTEN_TERRASSE_PRO_MODUL)}`
      });
    }
    // PV-Anlage auf oberstem Geschoss
    if ((pvAnteil || 0) > 0) {
      // Oberstes Geschoss = letztes Element der Verteilung
      const oberstesGeschoss = geschossVerteilung[geschossVerteilung.length - 1] || 0;
      const pvModule = Math.round(oberstesGeschoss * pvAnteil);
      if (pvModule > 0) {
        const netto = pvModule * KOSTEN_PV_PRO_MODUL;
        const pctLabel = pvAnteil === 1 ? '100 %' : pvAnteil === 0.5 ? '50 %' : `${Math.round(pvAnteil * 100)} %`;
        posten.push({
          id: 'pv', label: `PV-Anlage (${pctLabel} Dachfläche)`,
          netto, brutto: netto * (1 + UST), typ: 'option',
          detail: `${pvModule} oberste Module × ${fmtEUR(KOSTEN_PV_PRO_MODUL)} (inkl. Speicher & Wechselrichter)`
        });
      }
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

  // Aufteilung: laufende Fixkosten (inkl. Pacht) vs. variable Verbrauchskosten
  const fixProM2 = NEBENKOSTEN_POSTEN.filter(p => p.typ === 'fix').reduce((s, p) => s + p.proM2, 0);
  const verbrauchProM2 = NEBENKOSTEN_POSTEN.filter(p => p.typ === 'verbrauch').reduce((s, p) => s + p.proM2, 0);
  const nebenkostenProM2 = fixProM2 + verbrauchProM2;
  const proM2Gesamt = pachtProM2 + nebenkostenProM2;
  return {
    pachtBruttoJahr: hasPacht ? (pachtGewerblich ? pachtJahr * (1 + UST) : pachtJahr) : 0,
    pachtMonat, pachtProM2, pachtProM2_priv, pachtProM2_gewerb,
    nebenkostenProM2, fixProM2, verbrauchProM2, proM2Gesamt, posten: NEBENKOSTEN_POSTEN,
  };
}
function getDefaultMode(usage) { return usage === 'p' ? 'eigennutzung' : 'einnahmen'; }
function isModeToggleable(product) {
  if (product.usage === 'p') return false;
  if ((product.einnahmen || 0) <= 0) return false;
  return true;
}

function calculateTotals({ selections, modes, project, gewerbConfig, ekPrivat, ekGewerb, financing, vermietungDurchCoMod, privatOptionen, iabBetrag }) {
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
  // Rabattbasis:
  // - Bei Gewerbekunden mit Zielwert: auf Ziel-Modulanzahl
  // - Bei Privatkunden mit Projektbeitritt: auf Projekt-Zielwert (Kunde profitiert von der Quartiers-Größe)
  // - Sonst: auf Ist-Auswahl
  const rabattBasis = (gewerbConfig && gewerbConfig.zielModulAnzahl > 0)
    ? gewerbConfig.zielModulAnzahl
    : (project && project.zielModulAnzahl > 0)
      ? project.zielModulAnzahl
      : countTotal;
  const rabattPct = getRabatt(rabattBasis) + (project ? project.projektrabatt : 0);
  // Projekt-Overrides (Etappe 1): wirken nur im Projekt-Kontext, sonst neutral
  const projMargeOverride = (project && project.projektMarge != null) ? project.projektMarge : undefined; // ersetzt Modul-Marge
  const einnahmenFaktor   = project ? (project.einnahmenFaktor ?? 1) : 1;                                  // Faktor auf alle Vermietungs-Einnahmen
  const tpaNettoProModul  = project ? ((Number(project.transportProModul) || 0) + (Number(project.aufstellungProModul) || 0)) : 0; // Transport + Aufstellung (netto, Durchleitung)
  const nextStaffel = getNextRabattSchwelle(rabattBasis);
  // Mindestfläche-Berechnung — pro Modul den Footprint summieren (berücksichtigt Stack-Stapelung)
  // - Gewerbekunden im Such-Modus: aus gewünschter Modulanzahl
  // - Gewerbekunden mit eigener Fläche: aus tatsächlicher Auswahl
  // - Privatkunden ohne Projekt (eigenes Grundstück): default 1 Geschoss, Stack stapelt sich aber selbst
  let mindestflaeche = null;
  if (gewerbConfig) {
    const istSuchModus = gewerbConfig.flaecheStatus === 'suche_selbst' || gewerbConfig.flaecheStatus === 'sucht_fuer_mich';
    if (istSuchModus && gewerbConfig.gewuenschteModulAnzahl > 0 && gewerbConfig.geschosse > 0) {
      mindestflaeche = calcMindestflaecheFuerModule({ modulAnzahl: gewerbConfig.gewuenschteModulAnzahl, geschosse: gewerbConfig.geschosse });
    } else if (gesamtBGF > 0) {
      const userGeschosse = gewerbConfig.geschosse || 2;
      const totalFootprint = lineItems.reduce((s, x) => s + x.count * calcFootprintProModul(x, userGeschosse), 0);
      mindestflaeche = calcMindestflaeche({ totalFootprint });
    }
  } else if (!project && gesamtBGF > 0) {
    const totalFootprint = lineItems.reduce((s, x) => s + x.count * calcFootprintProModul(x, 1), 0);
    mindestflaeche = calcMindestflaeche({ totalFootprint });
  }

  let einmaligGesamtBrutto = 0;
  let einmaligDetail = null;
  let baugenehmigungEinzeln = 0; // separate Tracking-Variable für Anzeige in Privat-Pfaden
  if (project) {
    // Projekt-Beitritt: Umlage pro Modul + anteilige Baugenehmigung auf Projekt-Zielwert
    const projektZiel = project.zielModulAnzahl || countTotal;
    // Annahme: Projekt-Standardmodul = 36 m² BGF (Standard-Live/Add)
    const projektTotalBGF = projektZiel * 36;
    const gesamtBaugenehmigung = calcBaugenehmigung(projektTotalBGF);
    const anteil = gesamtBaugenehmigung * (countTotal / projektZiel);
    baugenehmigungEinzeln = Math.ceil(anteil / GEBUEHR_RUNDUNG) * GEBUEHR_RUNDUNG;
    einmaligGesamtBrutto = countTotal * (project.umlageProModulEinmalig || 0) + baugenehmigungEinzeln;
  } else if (gewerbConfig) {
    einmaligDetail = calcEinmaligeProjektkosten({
      modulAnzahl: gewerbConfig.zielModulAnzahl || countTotal,
      grundstueckGroesse: gewerbConfig.flaecheStatus === 'ja' ? gewerbConfig.grundstueckGroesse : 0,
      geschosse: gewerbConfig.geschosse || 2,
      activeOptionen: gewerbConfig.activeOptionen || {},
      hasGrundstueck: gewerbConfig.flaecheStatus === 'ja',
      useEstimates: gewerbConfig.flaecheStatus === 'ja' && !gewerbConfig.detailKosten,
      totalBGF: gesamtBGF,
      geschossVerteilung: gewerbConfig.geschossVerteilung || [],
      pvAnteil: gewerbConfig.pvAnteil || 0,
    });
    einmaligGesamtBrutto = einmaligDetail.summeBrutto;
    // Tracking
    const bg = einmaligDetail.posten.find(p => p.id === 'baugenehmigung');
    if (bg) baugenehmigungEinzeln = bg.brutto;
  } else if (gesamtBGF > 0) {
    // Privat mit eigenem Grundstück (kein Projekt, kein Gewerbe-Setup):
    // Modul-bezogene Pflicht-Posten + Planungskosten aus Staffel.
    // In der Sidebar werden die zwei Blöcke (modulbezogen / planungsbezogen) optisch getrennt
    // dargestellt — Planung als "kommt bei jedem Bauprojekt on top" Hinweis (Sekundär-Block).
    baugenehmigungEinzeln = calcBaugenehmigung(gesamtBGF);
    const fundamentNetto = countTotal * KOSTEN_FUNDAMENT_PRO_EG_MODUL;
    const terrasseNetto = countTotal * KOSTEN_TERRASSE_PRO_MODUL;
    const staffel = getProjektkostenStaffel(countTotal);
    const posten = [
      // Modul-bezogene Pflichtkosten (typ: pflicht)
      { id: 'fundament', label: 'Fundamente', netto: fundamentNetto, brutto: fundamentNetto * (1 + UST), typ: 'pflicht',
        detail: `${countTotal} Module × ${fmtEUR(KOSTEN_FUNDAMENT_PRO_EG_MODUL)} (Schraubfundamente inkl. Arbeit)` },
      { id: 'terrasse', label: 'Terrassen', netto: terrasseNetto, brutto: terrasseNetto * (1 + UST), typ: 'pflicht',
        detail: `${countTotal} Module × ${fmtEUR(KOSTEN_TERRASSE_PRO_MODUL)}` },
      { id: 'baugenehmigung', label: 'Baugenehmigung (Richtwert NRW)',
        netto: baugenehmigungEinzeln, brutto: baugenehmigungEinzeln, typ: 'pflicht', ohneUst: true },
      // Planungs-Pauschalen (typ: planung) — kommt bei jedem Bauprojekt on top
      { id: 'arch', label: 'Architektur & Entwurfsplanung', netto: staffel.arch, brutto: staffel.arch * (1 + UST), typ: 'planung' },
      { id: 'eing', label: 'Eingabeplanung (Architekt)',     netto: staffel.eing, brutto: staffel.eing * (1 + UST), typ: 'planung' },
      { id: 'pm',   label: 'Projektmanagement & Bauleitung', netto: staffel.pm,   brutto: staffel.pm   * (1 + UST), typ: 'planung' },
    ];
    const summeNetto = posten.reduce((s, p) => s + p.netto, 0);
    const summeBrutto = posten.reduce((s, p) => s + p.brutto, 0);
    einmaligDetail = { posten, summeNetto, summeBrutto };
    einmaligGesamtBrutto = summeBrutto;
  }
  const einmaligProModul = countTotal > 0 ? einmaligGesamtBrutto / countTotal : 0;

  // Rabatt wirkt nur auf Herstellungskosten (siehe calcRabattiertePreise); Projekt-Marge ersetzt ggf. die Modul-Marge
  const rabattPreiseSum = (items) => items.reduce((acc, x) => {
    const r = calcRabattiertePreise(x, rabattPct, projMargeOverride);
    return { netto: acc.netto + x.count * r.netto, brutto: acc.brutto + x.count * r.brutto };
  }, { netto: 0, brutto: 0 });
  const privatSum = rabattPreiseSum(privatItems);
  const gewerbSum = rabattPreiseSum(gewerbItems);
  // Transport & Aufstellung: netto, ohne Marge/Provision/Rabatt durchgereicht; privat brutto (+USt), gewerb netto
  const effPrivat = privatSum.brutto + countPrivat * einmaligProModul + countPrivat * tpaNettoProModul * (1 + UST);
  const effGewerbNetto = gewerbSum.netto + countGewerb * (einmaligProModul / (1 + UST)) + countGewerb * tpaNettoProModul;
  const effGewerbBrutto = effGewerbNetto * (1 + UST);

  const pachtSource = project ? { hasPacht: (project.pachtJahr || 0) > 0, pachtJahr: project.pachtJahr || 0, pachtGewerblich: project.pachtGewerblich, zielModulAnzahl: project.zielModulAnzahl || 0 }
    : gewerbConfig ? { hasPacht: !!gewerbConfig.hasPacht, pachtJahr: gewerbConfig.pachtJahr || 0, pachtGewerblich: gewerbConfig.pachtGewerblich, zielModulAnzahl: 0 }
    : { hasPacht: false, pachtJahr: 0, pachtGewerblich: false, zielModulAnzahl: 0 };
  const nebenkosten = calcNebenkosten({ ...pachtSource, gesamtNUF, nufPrivat, nufGewerb });
  // Gesamt = Pacht (bereits brutto/netto-aufgesplittet in calcNebenkosten) + sonstige Nebenkosten * NUF
  const nebenkostenMonatGesamt = nebenkosten.pachtMonat + nebenkosten.nebenkostenProM2 * gesamtNUF;
  // Aufteilung nach Feedback V4:
  // - laufende Fixkosten (Pacht + Lizenz + QM + Versicherung + Instandhaltung) → Teil der Gesamtbelastung "+ laufende Kosten"
  // - Verbrauchskosten (Strom + Wasser + Heizung) → variabler Richtwert, NICHT in Belastung eingerechnet
  const laufendeKostenMonat = nebenkosten.pachtMonat + nebenkosten.fixProM2 * gesamtNUF;
  const verbrauchskostenMonat = nebenkosten.verbrauchProM2 * gesamtNUF;

  // === Optionale Upgrades Privat (Terrasse, PV, Dachbegrünung) ===
  // Gelten pro eigengenutztem Privatmodul. Summe fließt auf GLS-Finanzierung (nie KfW).
  const privOpt = privatOptionen || {};
  const privatOptionenKosten = PRIVAT_UPGRADES.reduce((s, opt) => {
    if (!privOpt[opt.id]) return s;
    return s + opt.proModul * countPrivat;
  }, 0);

  // === KfW / GLS Finanzierung (Privat) — Logik nach Feedback V4 ===
  // Regel:
  // - KfW-Förderung 150k PAUSCHAL pro Privat-Antrag (sobald mind. 1 eigengenutztes Privatmodul)
  // - KfW-Rate = pmt auf (Förderbetrag abzgl. Tilgungsnachlass)
  // - GLS finanziert den Rest: Auftragswert − KfW-Förderung − EK + optionale Upgrades
  // - Modul < 150k: komplett KfW (auf Auftragswert), GLS nur für Upgrades/Baunebenkosten − EK
  // - Optionale Upgrades (Terrasse, PV, Dachbegrünung) laufen IMMER über GLS, nie KfW
  // - EK reduziert ausschließlich den GLS-Teil
  const hatPrivatEigennutzung = countPrivat > 0;
  const kfwFoerderMax = financing.kfw.foerderhoehe; // pauschal (Default 150k)
  // optionale Upgrades für Privat (werden auf GLS aufgerechnet)
  const privatUpgradesBrutto = privatOptionenKosten || 0;

  let kfwBasis = 0, glsBasis = 0;
  if (hatPrivatEigennutzung) {
    if (effPrivat <= kfwFoerderMax) {
      // Modul(e) günstiger als Förderhöhe: komplett über KfW
      kfwBasis = effPrivat;
      glsBasis = Math.max(0, privatUpgradesBrutto - ekPrivat); // nur Upgrades/Baunebenkosten, EK gegengerechnet
    } else {
      // Auftragswert über Förderhöhe: KfW deckelt, GLS finanziert Rest + Upgrades − EK
      kfwBasis = kfwFoerderMax;
      glsBasis = Math.max(0, effPrivat - kfwFoerderMax - ekPrivat + privatUpgradesBrutto);
    }
  }
  const kfwAfterNachlass = kfwBasis * (1 - financing.kfw.tilgungsnachlass);
  const kfwRate = pmt(financing.kfw.zins, financing.kfw.laufzeit, kfwAfterNachlass);
  const glsRate = pmt(financing.gls.zins, financing.gls.laufzeit, glsBasis);

  const restwertEUR = effGewerbNetto * financing.plattform.restwertPct;
  // EK wird gewerblich nicht mehr von der Finanzierungs-Basis abgezogen (siehe Feedback V2: EK macht in Finanzierung keinen Sinn)
  const plattformBasis = Math.max(0, effGewerbNetto - restwertEUR);
  const plattformRate = pmt(financing.plattform.zins, financing.plattform.laufzeit, plattformBasis);
  const steuerentlastung = effGewerbNetto > 0 && financing.plattform.afaJahre > 0
    ? ((effGewerbNetto / financing.plattform.afaJahre) + (plattformBasis * financing.plattform.zins)) * financing.plattform.steuer / 12
    : 0;

  // === IAB-Steuerersparnis (Feedback V4) ===
  // Der IAB bringt eine einmalige Steuerersparnis (iabBetrag × Steuersatz).
  // Diese wird zusätzlich auf die Plattform-Laufzeit (Monate) umgelegt, um die effektive
  // monatliche Belastung weiter zu senken. Auf Wunsch auch als Cent-Betrag pro MA-Modul sichtbar.
  const iabClamped = Math.min(iabBetrag || 0, (effGewerbNetto || 0) * 0.5);
  const iabSteuerersparnis = iabClamped * financing.plattform.steuer; // einmalig
  const plattformLaufzeitMonate = (financing.plattform.laufzeit || 10) * 12;
  const iabEntlastungMonat = plattformLaufzeitMonate > 0 ? iabSteuerersparnis / plattformLaufzeitMonate : 0;

  // Effektive Plattform-Rate = Rate − laufende Steuerentlastung − anteilige IAB-Entlastung
  const plattformRateEff = Math.max(0, plattformRate - steuerentlastung - iabEntlastungMonat);

  const finanzierungMonat = kfwRate + glsRate + plattformRate;
  // Effektive monatliche Belastung (Feedback V4):
  // = Finanzierung + laufende Fixkosten (Pacht, Lizenz, QM, Versicherung, Instandhaltung).
  // Verbrauchskosten (Strom/Wasser/Heizung) bleiben SEPARAT als variabler Richtwert oberhalb, nicht eingerechnet.
  const monatlichGesamt = finanzierungMonat + laufendeKostenMonat;
  const monatlichInklNebenkosten = finanzierungMonat + nebenkostenMonatGesamt; // inkl. Verbrauch, für Detail-Stellen

  const incomeItems = lineItems.filter(x => x.mode === 'einnahmen' && (x.einnahmen || 0) > 0);
  // Gewerbliche Module in Eigennutzung — Basis für "Rate pro Mitarbeiter"-Logik
  const eigennutzungGewerbItems = lineItems.filter(x => x.usage === 'g' && x.mode === 'eigennutzung');
  const eigennutzungGewerbCount = eigennutzungGewerbItems.reduce((s, x) => s + x.count, 0);
  const monthlyIncomeBrutto = incomeItems.reduce((s, x) => s + x.count * x.einnahmen * einnahmenFaktor, 0);
  const feeAbzug = vermietungDurchCoMod ? incomeItems.reduce((s, x) => s + x.count * x.einnahmen * einnahmenFaktor * x.fee, 0) : 0;
  const monthlyIncomeNetto = monthlyIncomeBrutto - feeAbzug;

  // === Effektive monatliche Belastung (Feedback V5) ===
  // === Aufteilung der Finanzierungsbelastung nach Privat / Gewerblich (Feedback V6) ===
  // - Privat: KfW + GLS (KfW-Tilgungsnachlass bereits berücksichtigt)
  // - Gewerblich nach Steuer: plattformRateEff (= Plattform-Rate − laufende AfA-Steuerentlastung − IAB-Entlastung)
  // - Summe der beiden = effektive Finanzierungs-Belastung
  const privatFinanzierungMonat = kfwRate + glsRate;
  const gewerblichRateNachSteuer = plattformRateEff; // existiert oben, inkl. AfA + IAB
  const belastungFinanzierungEff = privatFinanzierungMonat + gewerblichRateNachSteuer;

  // Kunden-Typ-Flags für Sidebar-Logik
  const hatPrivatAnteil = countPrivat > 0;
  const hatGewerbEigen = eigennutzungGewerbCount > 0;
  const hatGewerbVermietet = incomeItems.length > 0 && incomeItems.some(x => x.usage === 'g');
  const hatGewerbModule = countGewerb > 0;
  // Investor: rein gewerblich, keine Eigennutzung, mit Vermietung
  const istInvestor = !hatPrivatAnteil && !hatGewerbEigen && hatGewerbVermietet;
  // Mitarbeiter-Wohnen: rein gewerblich mit Eigennutzung (kein Privat-Anteil) — MA-Umrechnung sinnvoll
  const istMAWohnen = !hatPrivatAnteil && hatGewerbEigen;

  // Effektive Belastung = Finanzierung-eff + laufende Kosten − Einnahmen (Verbrauch trägt der Bewohner)
  // Gilt einheitlich für alle Kundentypen; Vorzeichen-Logik: negativ = Überschuss (Investor)
  const effektiveBelastung = belastungFinanzierungEff + laufendeKostenMonat - monthlyIncomeNetto;
  const cashflowPositive = effektiveBelastung < 0;
  const cashflowNetto = -effektiveBelastung; // Beibehaltung Vorzeichen-Konvention: positiv = Überschuss

  // Rate pro Mitarbeiter NUR bei reinem MA-Wohnen-Setup sinnvoll (Feedback V6)
  // Bei Privatkunden mit eigengenutztem Add-Modul gewerblich: keine MA-Umrechnung
  const belastungProMA = istMAWohnen ? (belastungFinanzierungEff + laufendeKostenMonat) / eigennutzungGewerbCount : 0;
  const iabEntlastungProMA = istMAWohnen ? iabEntlastungMonat / eigennutzungGewerbCount : 0;
  // Beibehaltung der alten Variable für Backward-Compat in der Modul-Auswahl-Sidebar
  const monatlichGesamtNachIab = Math.max(0, monatlichGesamt - iabEntlastungMonat);

  const anzahlung = lineItems.reduce((s, x) => {
    const basis = x.usage === 'p' ? x.brutto : x.netto;
    return s + x.count * basis * ANZ_PCT;
  }, 0) + einmaligGesamtBrutto * ANZ_PCT;

  return {
    lineItems, privatItems, gewerbItems, incomeItems,
    eigennutzungGewerbCount,
    countPrivat, countGewerb, countTotal, einheitenPrivat, einheitenGewerb, einheitenTotal, gesamtNUF, gesamtBGF, nufPrivat, nufGewerb,
    bruttoPrivat, nettoGewerb, rabattPct, nextStaffel,
    effPrivat, effGewerbNetto, effGewerbBrutto,
    kfwBasis, kfwRate, glsBasis, glsRate, privatOptionenKosten,
    plattformBasis, plattformRate, plattformRateEff, steuerentlastung, restwertEUR,
    iabClamped, iabSteuerersparnis, iabEntlastungMonat,
    finanzierungMonat, monatlichGesamt, monatlichInklNebenkosten, anzahlung,
    bruttoGesamt: effPrivat + effGewerbBrutto,
    nettoGesamt: (effPrivat / (1 + UST)) + effGewerbNetto,
    einmaligGesamtNetto: (einmaligDetail?.summeNetto != null ? einmaligDetail.summeNetto : einmaligGesamtBrutto / (1 + UST)),
    monthlyIncomeBrutto, monthlyIncomeNetto, feeAbzug,
    cashflowNetto, cashflowPositive, hasIncome: incomeItems.length > 0,
    monatlichGesamtNachIab, effektiveBelastung, belastungProMA, iabEntlastungProMA,
    privatFinanzierungMonat, gewerblichRateNachSteuer, belastungFinanzierungEff,
    hatPrivatAnteil, hatGewerbEigen, hatGewerbVermietet, hatGewerbModule, istInvestor, istMAWohnen,
    nebenkosten, nebenkostenMonatGesamt, laufendeKostenMonat, verbrauchskostenMonat,
    einmaligGesamtBrutto, einmaligProModul, einmaligDetail, baugenehmigungEinzeln,
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
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300..700&family=Ubuntu:wght@300;400;500;700&display=swap');
      .font-display { font-family: 'Roboto Slab', Georgia, serif; }
      .font-body { font-family: 'Ubuntu', system-ui, sans-serif; }
      .num { font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
      input[type="range"] { accent-color: #D2563E; }
      .scrollbar-none::-webkit-scrollbar { display: none; }
      .scrollbar-none { scrollbar-width: none; }
    `}</style>
  );
}

function Button({ children, variant = 'primary', onClick, disabled, className = '', ...rest }) {
  const base = 'inline-flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-body';
  const styles = {
    primary: 'bg-[#D2563E] text-[#F8F5F0] hover:bg-[#B04528]',
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
          ? <span className="text-[#C5392E] font-medium">*</span>
          : <span className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] bg-[#1C1C1A]/5 px-1.5 py-0.5">optional</span>}
      </label>
      {hint && <span className="font-body text-xs text-[#6B6961]">{hint}</span>}
    </div>
  );
}

function StepIndicator({ currentStep, onJump }) {
  const steps = ['Auswahl', 'Module', 'Finanzierung', 'Unverb. Angebot'];
  return (
    <div className="flex items-center gap-3 font-body text-xs tracking-wider uppercase">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-3">
          <button onClick={() => i < currentStep && onJump(i)} disabled={i >= currentStep}
            className={`flex items-center gap-2 transition-colors ${i === currentStep ? 'text-[#1C1C1A]' : i < currentStep ? 'text-[#6B6961] hover:text-[#1C1C1A] cursor-pointer' : 'text-[#6B6961]/40 cursor-default'}`}>
            <span className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentStep ? 'bg-[#D2563E] w-6' : i < currentStep ? 'bg-[#6B6961]' : 'bg-[#6B6961]/30'}`} />
            <span>{label}</span>
          </button>
          {i < steps.length - 1 && <span className="text-[#6B6961]/30">·</span>}
        </div>
      ))}
    </div>
  );
}

function Header({ step, onJump, view, setView }) {
  function handleRestart() {
    // Nur fragen, wenn der Nutzer schon irgendwo unterwegs ist (step > 1 oder im Admin)
    const inProgress = view === 'customer' && step > 1;
    if (inProgress) {
      const ok = window.confirm('Konfigurator von vorne starten? Aktuelle Eingaben gehen verloren.');
      if (!ok) return;
    }
    // Sauberer Reset via Page-Reload (alle States, Auswahl, Mode zurück auf Initial)
    window.location.reload();
  }
  return (
    <header className="border-b border-[#1C1C1A]/10 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={handleRestart} title="Zum Start des Konfigurators"
            className="flex items-center hover:opacity-70 transition-opacity">
            <img src="/brand/comod_logo_black.png" alt="CoMod — zum Start" className="h-10 w-auto" />
          </button>
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
        <rect x="1" y="1" width={w-2} height={h-2} stroke="#D2563E" strokeWidth="1" fill="none"/>
        <line x1={w*0.62} y1="1" x2={w*0.62} y2={h-1} stroke="#D2563E" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5"/>
        <line x1={w*0.62} y1={h*0.55} x2={w-1} y2={h*0.55} stroke="#D2563E" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5"/>
      </svg>
    </div>
  );
}

/* ============================================================================
   STEPS
   ============================================================================ */

function WelcomeStep({ onSelect }) {
  const options = [
    { id: 'privat', icon: Home, image: '/headers/header_privat.jpg', title: 'Privat', subtitle: 'Eigenes Wohnen, optional gewerbliche Erweiterung',
      desc: 'Module für die private Nutzung — auf Deinem eigenen Grundstück oder als Teil eines unserer Projekte. Auch gewerbliche Module möglich (z. B. Praxis, Büro).' },
    { id: 'gewerblich', icon: Building2, image: '/headers/header_gewerbe.jpg', title: 'Gewerblich', subtitle: 'Tourismus, Mitarbeiter, Investment',
      desc: 'Du hast bereits eine Fläche oder suchst noch? Wir berechnen den Mindestflächenbedarf — oder die volle Wirtschaftlichkeit, wenn Du Deine Fläche kennst.' },
  ];
  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <div className="mb-16">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-6">Willkommen</p>
        <h1 className="font-display text-5xl md:text-6xl leading-tight tracking-tight mb-6">
          Was passt zu Dir<span className="text-[#D2563E]">,</span><br/>
          <em className="font-display">erzähl es uns kurz</em><span className="opacity-40"> …</span>
        </h1>
        <p className="font-body text-lg text-[#6B6961] max-w-2xl leading-relaxed">
          In wenigen Schritten konfigurierst Du Dein CoMod-Setup, siehst die Kosten, die Monatsrate und kannst direkt ein unverbindliches Angebot anfordern.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {options.map(o => {
          const Icon = o.icon;
          return (
            <button key={o.id} onClick={() => onSelect(o.id)}
              className="group text-left bg-white border border-[#1C1C1A]/10 hover:border-[#D2563E] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_-12px_rgba(60,84,70,0.25)]">
              {/* Header-Visual im Querformat 3:2, mit Icon-Fallback */}
              <div className="relative bg-[#F8F5F0] overflow-hidden" style={{ aspectRatio: '3 / 2' }}>
                {o.image ? (
                  <img src={o.image} alt={o.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F0EDE5] to-[#E8E3D6]">
                    <Icon className="w-12 h-12 text-[#A87DAE]/40" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              {/* Textteil */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-[#D2563E]/5 group-hover:bg-[#D2563E]/10 flex items-center justify-center transition-colors shrink-0">
                    <Icon className="w-5 h-5 text-[#D2563E]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-3xl">{o.title}</h3>
                </div>
                <p className="font-body text-xs tracking-wider uppercase text-[#6B6961] mb-4">{o.subtitle}</p>
                <p className="font-body text-sm text-[#1C1C1A]/70 leading-relaxed mb-6">{o.desc}</p>
                <div className="flex items-center gap-2 font-body text-sm text-[#D2563E] opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                  Weiter <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-16 pt-8 border-t border-[#1C1C1A]/10 flex items-center gap-3 text-sm font-body text-[#6B6961]">
        <Sparkles className="w-4 h-4 text-[#7B2D8E]" strokeWidth={1.5} />
        <span>Unverbindliche Modellrechnung zur ersten Orientierung — alle Zahlen sind Indikationen, keine zugesicherten Werte.</span>
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
              className="group text-left bg-white border border-[#1C1C1A]/10 hover:border-[#D2563E] p-8 transition-all duration-300 hover:shadow-[0_8px_30px_-12px_rgba(60,84,70,0.25)]">
              <div className="w-12 h-12 rounded-full bg-[#D2563E]/5 group-hover:bg-[#D2563E]/10 flex items-center justify-center mb-6 transition-colors">
                <Icon className="w-5 h-5 text-[#D2563E]" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-1">{o.title}</h3>
              <p className="font-body text-xs tracking-wider uppercase text-[#6B6961] mb-4">{o.subtitle}</p>
              <p className="font-body text-sm text-[#1C1C1A]/70 leading-relaxed mb-6">{o.desc}</p>
              <div className="flex items-center gap-2 font-body text-sm text-[#D2563E] opacity-0 group-hover:opacity-100 transition-opacity">
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

      <div className="grid md:grid-cols-2 gap-5">
        {PROJECTS_TEMPLATES.map(p => {
          const mengenrabatt = getRabatt(p.zielModulAnzahl || 0);
          const gesamtrabatt = mengenrabatt + (p.projektrabatt || 0);
          const isSelected = selectedProject?.id === p.id;
          return (
          <button key={p.id} onClick={() => onSelect(p)}
            className={`text-left bg-white border transition-all duration-300 overflow-hidden flex flex-col ${isSelected ? 'border-[#D2563E] shadow-[0_8px_30px_-12px_rgba(60,84,70,0.25)]' : 'border-[#1C1C1A]/10 hover:border-[#D2563E]/50'}`}>
            {/* Hero-Image im Querformat 3:2, mit Fallback */}
            <div className="relative bg-[#F8F5F0] overflow-hidden" style={{ aspectRatio: '3 / 2' }}>
              {p.heroImageUrl ? (
                <img src={p.heroImageUrl} alt={p.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                // Platzhalter: dezenter monochromer Hintergrund mit Projekt-Initiale
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F0EDE5] to-[#E8E3D6]">
                  <span className="font-display text-7xl text-[#A87DAE]/40">{p.name?.[0] || '?'}</span>
                </div>
              )}
              {isSelected && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#D2563E] flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Textteil */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="font-display text-2xl mb-1">{p.name}</h3>
                <p className="font-body text-sm text-[#6B6961]">{p.location}</p>
              </div>
              <p className="font-body text-sm text-[#1C1C1A]/70 leading-relaxed mb-3">{p.description}</p>
              {p.description2 && <p className="font-body text-xs text-[#7B2D8E] leading-relaxed mb-4 italic">{p.description2}</p>}
              <div className="flex gap-4 mb-4 font-body text-xs text-[#6B6961]">
                <span><span className="num text-[#1C1C1A]">{p.zielModulAnzahl}</span> Module Zielgröße</span>
                <span className="opacity-50">·</span>
                <span>max. <span className="num text-[#1C1C1A]">{p.maxModulAnzahl}</span> möglich</span>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#1C1C1A]/10 mt-auto">
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider text-[#6B6961] mb-1">Projektkosten</p>
                  <p className="font-display text-base num">{fmtEUR(p.umlageProModulEinmalig)}</p>
                  <p className="font-body text-[10px] text-[#6B6961]">/Modul einm.</p>
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider text-[#6B6961] mb-1">Rabatt gesamt</p>
                  <p className="font-display text-base num text-[#D2563E]">{fmtPct(gesamtrabatt)}</p>
                  <p className="font-body text-[10px] text-[#6B6961]">{fmtPct(mengenrabatt)} Menge + {fmtPct(p.projektrabatt)} Projekt</p>
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
            </div>
          </button>
          );
        })}
      </div>

      {/* Vor- und Nachteile der Projekt-Beteiligung — unterhalb der Projekte */}
      <div className="mt-10 grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#D2563E]/20 p-5">
          <p className="font-body text-[11px] uppercase tracking-wider text-[#D2563E] mb-3 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" strokeWidth={2} /> Vorteile
          </p>
          <ul className="space-y-2 font-body text-sm text-[#1C1C1A]/85 leading-relaxed">
            <li className="flex gap-2"><Check className="w-4 h-4 text-[#D2563E] shrink-0 mt-0.5" strokeWidth={2} /><span>Mengenrabatte aus der Gesamtgröße des Projekts</span></li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-[#D2563E] shrink-0 mt-0.5" strokeWidth={2} /><span>Zusätzliche Einnahmenpotenziale aus Gemeinschaftsmodulen (Gym, CoWork, Wellness)</span></li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-[#D2563E] shrink-0 mt-0.5" strokeWidth={2} /><span>Nutzung der Gemeinschaftsmodule ohne eigene Investition</span></li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-[#D2563E] shrink-0 mt-0.5" strokeWidth={2} /><span>Wir kümmern uns um Grundstück, Genehmigung & Bauleitung</span></li>
          </ul>
        </div>
        <div className="bg-white border border-[#7B2D8E]/30 p-5">
          <p className="font-body text-[11px] uppercase tracking-wider text-[#7B2D8E] mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" strokeWidth={2} /> Zu bedenken
          </p>
          <ul className="space-y-2 font-body text-sm text-[#1C1C1A]/85 leading-relaxed">
            <li className="flex gap-2"><span className="text-[#7B2D8E] shrink-0 mt-0.5">·</span><span>Höheres Gesamtinvestment durch Anteil an Gemeinschaftsflächen</span></li>
            <li className="flex gap-2"><span className="text-[#7B2D8E] shrink-0 mt-0.5">·</span><span>Höhere einmalige Projektkosten (Architektur, PM) auf alle Beteiligten umgelegt</span></li>
            <li className="flex gap-2"><span className="text-[#7B2D8E] shrink-0 mt-0.5">·</span><span>Laufende Umlagen für Pacht, Gemeinschaftsflächen und Verwaltung</span></li>
            <li className="flex gap-2"><span className="text-[#7B2D8E] shrink-0 mt-0.5">·</span><span>Standort und Ausführung werden gemeinsam mit allen Beteiligten festgelegt</span></li>
          </ul>
        </div>
      </div>

      <div className="mt-6 bg-[#FBF7EF] border border-[#7B2D8E]/30 p-4 flex gap-3 items-start">
        <Info className="w-5 h-5 text-[#7B2D8E] shrink-0 mt-0.5" strokeWidth={1.5} />
        <p className="font-body text-xs text-[#6B6961] leading-relaxed">
          {getContentText('hinweis_projekt_umlage', 'Alle Umlagen kalkuliert auf die Ziel-Modulanzahl. Wir geben das Projekt erst frei, wenn die Ziel-Modulanzahl erreicht ist. Bei höherer tatsächlicher Auslastung verringern sich Deine Umlagen anteilig — schlechter werden sie nicht.')}
        </p>
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
              className="group text-left bg-white border border-[#1C1C1A]/10 hover:border-[#D2563E] p-7 transition-all duration-300 hover:shadow-[0_8px_30px_-12px_rgba(60,84,70,0.25)]">
              <div className="w-12 h-12 rounded-full bg-[#D2563E]/5 group-hover:bg-[#D2563E]/10 flex items-center justify-center mb-5 transition-colors">
                <Icon className="w-5 h-5 text-[#D2563E]" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-1">{o.title}</h3>
              <p className="font-body text-xs tracking-wider uppercase text-[#6B6961] mb-3">{o.subtitle}</p>
              <p className="font-body text-sm text-[#1C1C1A]/70 leading-relaxed mb-5">{o.desc}</p>
              <div className="pt-3 border-t border-[#1C1C1A]/10 flex items-center justify-between">
                <p className="font-body text-[10px] uppercase tracking-wider text-[#7B2D8E]">{o.finanzhinweis}</p>
                <ArrowRight className="w-4 h-4 text-[#D2563E] opacity-0 group-hover:opacity-100 transition-opacity" />
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
      <div className="bg-[#D2563E]/5 border border-[#D2563E]/20 px-4 py-3 mb-8 flex items-center gap-2.5 max-w-2xl">
        <span className="text-[#C5392E] font-medium text-base">*</span>
        <p className="font-body text-xs text-[#6B6961]">Pflichtangaben mit Stern. Diese erste Kostenindikation verfeinern wir gemeinsam im Beratungsgespräch.</p>
      </div>

      <div className="space-y-6">

        {/* SCHRITT 1: Fläche-Status */}
        <div className="bg-white border border-[#1C1C1A]/10 p-7 space-y-4">
          <h3 className="font-display text-xl flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#D2563E] text-[#F8F5F0] flex items-center justify-center text-xs font-body">1</span> Fläche</h3>
          <FieldLabel required>Wie sieht's mit der Fläche aus?</FieldLabel>
          <div className="grid md:grid-cols-3 gap-3">
            <button onClick={() => setFlaecheStatus('ja')}
              className={`p-4 border text-left transition-colors ${config.flaecheStatus === 'ja' ? 'border-[#D2563E] bg-[#D2563E]/10 ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0]' : 'border-[#1C1C1A]/15 hover:border-[#1C1C1A]/30'}`}>
              <MapPin className="w-5 h-5 text-[#D2563E] mb-2" strokeWidth={1.5} />
              <p className="font-body text-sm text-[#1C1C1A] font-medium">Ja, ich habe</p>
              <p className="font-body text-xs text-[#6B6961] mt-1">Konkretes Grundstück vorhanden</p>
            </button>
            <button onClick={() => setFlaecheStatus('suche_selbst')}
              className={`p-4 border text-left transition-colors ${config.flaecheStatus === 'suche_selbst' ? 'border-[#D2563E] bg-[#D2563E]/10 ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0]' : 'border-[#1C1C1A]/15 hover:border-[#1C1C1A]/30'}`}>
              <MapPin className="w-5 h-5 text-[#D2563E] mb-2" strokeWidth={1.5} />
              <p className="font-body text-sm text-[#1C1C1A] font-medium">Noch nicht — ich suche</p>
              <p className="font-body text-xs text-[#6B6961] mt-1">Ich kümmere mich selbst um die Fläche</p>
            </button>
            <button onClick={() => setFlaecheStatus('sucht_fuer_mich')}
              className={`p-4 border text-left transition-colors ${config.flaecheStatus === 'sucht_fuer_mich' ? 'border-[#D2563E] bg-[#D2563E]/10 ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0]' : 'border-[#1C1C1A]/15 hover:border-[#1C1C1A]/30'}`}>
              <MapPin className="w-5 h-5 text-[#7B2D8E] mb-2" strokeWidth={1.5} />
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
                className="w-full px-4 py-2.5 bg-[#F8F5F0] border border-[#1C1C1A]/15 text-sm focus:border-[#D2563E]" />
            </div>
          )}
          {(config.flaecheStatus === 'suche_selbst' || config.flaecheStatus === 'sucht_fuer_mich') && (
            <div className="pt-4 border-t border-[#1C1C1A]/8 space-y-3">
              <FieldLabel required hint="Daraus berechnen wir den Mindestflächenbedarf">Wie viele Module wünschst Du Dir?</FieldLabel>
              <NumberInput value={config.gewuenschteModulAnzahl} onChange={v => setConfig(c => ({...c, gewuenschteModulAnzahl: v, geschosse: 0, zielModulAnzahl: 0, geschossVerteilung: []}))}
                placeholder="z. B. 50"
                className="w-full px-4 py-2.5 bg-[#F8F5F0] border border-[#1C1C1A]/15 text-sm focus:border-[#D2563E]" />
              {config.flaecheStatus === 'sucht_fuer_mich' && (
                <div className="bg-[#FBF7EF] border border-[#7B2D8E]/30 p-3 flex gap-2 items-start">
                  <Info className="w-4 h-4 text-[#7B2D8E] shrink-0 mt-0.5" strokeWidth={1.5} />
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
            <h3 className="font-display text-xl flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#D2563E] text-[#F8F5F0] flex items-center justify-center text-xs font-body">2</span> Geschossigkeit</h3>
            <FieldLabel required hint="Beeinflusst die maximale Modulanzahl">Wie viele Geschosse sind geplant?</FieldLabel>
            <div className="grid grid-cols-3 gap-3">
              {[
                { n: 1, label: '1 Geschoss', sub: 'eingeschossig' },
                { n: 2, label: '2 Geschosse', sub: 'EG + OG' },
                { n: 3, label: '3 Geschosse', sub: 'EG + OG + DG' },
              ].map(g => (
                <button key={g.n} onClick={() => setGeschosse(g.n)}
                  className={`p-4 border text-left transition-colors flex items-center gap-3 ${config.geschosse === g.n ? 'border-[#D2563E] bg-[#D2563E]/10 ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0]' : 'border-[#1C1C1A]/15 hover:border-[#1C1C1A]/30'}`}>
                  <Layers className="w-5 h-5 text-[#D2563E]" strokeWidth={1.5} />
                  <div><p className="font-body text-sm text-[#1C1C1A]">{g.label}</p><p className="font-body text-xs text-[#6B6961]">{g.sub}</p></div>
                </button>
              ))}
            </div>

            {/* Berechnete Kapazität anzeigen */}
            {maxModuleData && config.geschosse > 0 && (
              <div className="mt-3 bg-[#D2563E]/5 border border-[#D2563E]/15 p-4">
                <p className="font-body text-xs uppercase tracking-wider text-[#D2563E] mb-2">Berechnete Kapazität</p>
                <div className="font-body text-sm text-[#1C1C1A] space-y-1">
                  <p><span className="num">{config.grundstueckGroesse} m²</span> × {Math.round(BEBAUUNGSGRAD * 100)} % bebaubar ÷ {ZIEL_MODUL_BGF} m² BGF = <span className="num font-medium">{maxModuleData.maxProGeschoss}</span> Module / Geschoss</p>
                  <p><span className="num font-medium">{maxModuleData.maxGesamt}</span> Module insgesamt möglich (bei {config.geschosse} {config.geschosse === 1 ? 'Geschoss' : 'Geschossen'})</p>
                </div>
              </div>
            )}
            {mindestflaecheData && config.geschosse > 0 && (
              <div className="mt-3 bg-[#FBF7EF] border border-[#7B2D8E]/30 p-5">
                <p className="font-body text-xs uppercase tracking-wider text-[#7B2D8E] mb-3">Mindestflächenbedarf</p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-body text-sm text-[#6B6961]">Gebäude-Grundfläche (EG)</span>
                    <span className="font-display text-xl num text-[#1C1C1A]">{fmtNum(mindestflaecheData.gebaeudeflaeche)} m²</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 pt-3 border-t border-[#7B2D8E]/20">
                    <span className="font-body text-sm text-[#1C1C1A]">
                      Empfohlene Mindestgröße<br/>
                      <span className="text-[11px] text-[#6B6961]">inkl. Wege, Parkplätze, Grünflächen</span>
                    </span>
                    <span className="font-display text-2xl num text-[#7B2D8E]">≥ {fmtNum(Math.ceil(mindestflaecheData.mindestGrundstueck / 100) * 100)} m²</span>
                  </div>
                </div>
                <p className="font-body text-[11px] text-[#6B6961] italic leading-relaxed">
                  Berechnungsgrundlage: {config.gewuenschteModulAnzahl} Module auf {config.geschosse} {config.geschosse === 1 ? 'Geschoss' : 'Geschossen'} bei {Math.round(BEBAUUNGSGRAD * 100)} % Bebauungsgrad.
                </p>
                {config.flaecheStatus === 'sucht_fuer_mich' && (
                  <p className="font-body text-[11px] text-[#1C1C1A] mt-3 pt-3 border-t border-[#7B2D8E]/20 leading-relaxed">
                    <span className="font-medium">Wir suchen Flächen ≥ {fmtNum(Math.ceil(mindestflaecheData.mindestGrundstueck / 100) * 100)} m² in Deiner Region.</span> Diese Information wird an uns übermittelt.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* SCHRITT 3: Zielwert + Geschoss-Verteilung */}
        {config.geschosse > 0 && maxZielwert > 0 && (
          <div className="bg-white border border-[#1C1C1A]/10 p-7 space-y-5">
            <h3 className="font-display text-xl flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#D2563E] text-[#F8F5F0] flex items-center justify-center text-xs font-body">3</span> Zielwert & Verteilung</h3>

            <div>
              {(config.flaecheStatus === 'suche_selbst' || config.flaecheStatus === 'sucht_fuer_mich') ? (
                // Such-Modus: Modulanzahl ist fix (= gewünschte Modulanzahl), kein Slider
                <div>
                  <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-2">Modulanzahl</p>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-2xl num text-[#D2563E]">{config.zielModulAnzahl}</span>
                    <span className="font-body text-xs text-[#6B6961]">aus Deiner Wunsch-Vorgabe</span>
                  </div>
                  <p className="font-body text-xs text-[#6B6961] mt-2">Die Modulanzahl ist durch Deine Wunsch-Vorgabe oben festgelegt. Du kannst nur die Verteilung auf die Geschosse anpassen.</p>
                </div>
              ) : (
                // Fläche bekannt: voller Slider
                <>
                  <FieldLabel required hint={`Default = Maximum von ${maxZielwert}`}>Ziel-Modulanzahl</FieldLabel>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-display text-2xl num text-[#D2563E]">{config.zielModulAnzahl}</span>
                    <span className="font-body text-xs text-[#6B6961]">max. {maxZielwert}</span>
                  </div>
                  <input type="range" min={1} max={maxZielwert} step={1}
                    value={config.zielModulAnzahl}
                    onChange={e => setZielwert(parseInt(e.target.value, 10))}
                    className="w-full" />
                  <p className="font-body text-xs text-[#6B6961] mt-2">Du kannst weniger Module einplanen, wenn das Projekt kleiner werden soll.</p>
                </>
              )}
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
                        className="w-full px-2 py-1.5 bg-white border border-[#1C1C1A]/15 text-lg font-display focus:border-[#D2563E]" />
                      <p className="font-body text-[10px] text-[#6B6961] mt-1">Module</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 font-body text-sm">
                  <span className="text-[#6B6961]">Summe Verteilung: <span className="num text-[#1C1C1A]">{verteilungSumme}</span> / {config.zielModulAnzahl}</span>
                  {validierung.valid
                    ? <span className="text-[#D2563E] flex items-center gap-1"><Check className="w-3.5 h-3.5" strokeWidth={2.5}/> gültig</span>
                    : <span className="text-[#C5392E] text-xs">{validierung.error}</span>}
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
                    <div className="flex justify-between py-2 bg-[#D2563E]/5 px-3 -mx-3">
                      <div>
                        <p className="text-[#1C1C1A]">Dachfläche (oberstes Geschoss)</p>
                        <p className="text-xs text-[#6B6961]">{verteilung[verteilung.length-1]} Module × {ZIEL_MODUL_BGF} m² — verfügbar für PV & Begrünung</p>
                      </div>
                      <span className="num shrink-0 text-[#D2563E]">{fmtNum(dachflaeche)} m²</span>
                    </div>
                  )}
                </div>

                {/* PV-Anlage-Auswahl */}
                {dachflaeche > 0 && (() => {
                  const oberstesGeschoss = verteilung[verteilung.length - 1] || 0;
                  const pv50 = Math.round(oberstesGeschoss * 0.5);
                  const pv100 = oberstesGeschoss;
                  return (
                    <div className="mt-4 pt-4 border-t border-[#1C1C1A]/8">
                      <FieldLabel required={false} hint="Inkl. Speicher & Wechselrichter">PV-Anlage auf Dachfläche</FieldLabel>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <button onClick={() => setConfig(c => ({...c, pvAnteil: 0}))}
                          className={`p-3 border text-left transition-colors ${(config.pvAnteil || 0) === 0 ? 'border-[#D2563E] bg-[#D2563E]/10 ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-white font-medium' : 'border-[#1C1C1A]/15 hover:border-[#1C1C1A]/30'}`}>
                          <p className="font-body text-sm text-[#1C1C1A]">Keine PV</p>
                          <p className="font-body text-[10px] text-[#6B6961] mt-0.5">—</p>
                        </button>
                        <button onClick={() => setConfig(c => ({...c, pvAnteil: 0.5}))}
                          className={`p-3 border text-left transition-colors ${(config.pvAnteil || 0) === 0.5 ? 'border-[#D2563E] bg-[#D2563E]/10 ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-white font-medium' : 'border-[#1C1C1A]/15 hover:border-[#1C1C1A]/30'}`}>
                          <p className="font-body text-sm text-[#1C1C1A]">50 % Dach</p>
                          <p className="font-body text-[10px] text-[#6B6961] mt-0.5">{pv50} Module · {fmtEUR(pv50 * KOSTEN_PV_PRO_MODUL)}</p>
                        </button>
                        <button onClick={() => setConfig(c => ({...c, pvAnteil: 1}))}
                          className={`p-3 border text-left transition-colors ${(config.pvAnteil || 0) === 1 ? 'border-[#D2563E] bg-[#D2563E]/10 ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-white font-medium' : 'border-[#1C1C1A]/15 hover:border-[#1C1C1A]/30'}`}>
                          <p className="font-body text-sm text-[#1C1C1A]">100 % Dach</p>
                          <p className="font-body text-[10px] text-[#6B6961] mt-0.5">{pv100} Module · {fmtEUR(pv100 * KOSTEN_PV_PRO_MODUL)}</p>
                        </button>
                      </div>
                      <p className="font-body text-[11px] text-[#6B6961] mt-2">PV-Anlage inkl. Speicher und Wechselrichter, je Modul {fmtEUR(KOSTEN_PV_PRO_MODUL)} netto. Berechnung auf Anzahl der Module im obersten Geschoss.</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* SCHRITT 4: Pacht (nur bei eigener Fläche) */}
        {config.flaecheStatus === 'ja' && config.zielModulAnzahl > 0 && (
          <div className="bg-white border border-[#1C1C1A]/10 p-7 space-y-6">
            <h3 className="font-display text-xl flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#D2563E] text-[#F8F5F0] flex items-center justify-center text-xs font-body">4</span> Vorarbeiten & Pacht</h3>

            <div>
              <FieldLabel required>Möchtest Du Erschließung, Wege & Begrünung im Detail angeben?</FieldLabel>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setConfig(c => ({...c, detailKosten: true}))}
                  className={`px-4 py-2 font-body text-sm border transition-colors ${config.detailKosten ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Ja, ich weiß, was anfällt</button>
                <button onClick={() => setConfig(c => ({...c, detailKosten: false}))}
                  className={`px-4 py-2 font-body text-sm border transition-colors ${config.detailKosten === false ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Nein — bitte schätzen</button>
              </div>
              <p className="font-body text-xs text-[#6B6961]">Bei Schätzung nehmen wir Erschließung, Wege und Begrünung pauschal an — Abriss/Entsorgung musst Du dennoch explizit ankreuzen.</p>
              {config.detailKosten && (
                <div className="space-y-2.5 mt-4">
                  <p className="font-body text-xs uppercase tracking-wider text-[#6B6961]">Welche Vorarbeiten kommen dazu?</p>
                  {GRDST_OPTIONEN.map(opt => (
                    <label key={opt.id} className="flex items-start gap-3 cursor-pointer group">
                      <button onClick={() => toggleOption(opt.id)}
                        className={`mt-0.5 w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${config.activeOptionen[opt.id] ? 'bg-[#D2563E] border-[#D2563E]' : 'border-[#1C1C1A]/20 group-hover:border-[#D2563E]/50'}`}>
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
                        className={`mt-0.5 w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${config.activeOptionen[opt.id] ? 'bg-[#D2563E] border-[#D2563E]' : 'border-[#1C1C1A]/20 group-hover:border-[#D2563E]/50'}`}>
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
                  className={`px-4 py-2 font-body text-sm border transition-colors ${config.hasPacht ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Ja, Pacht</button>
                <button onClick={() => setConfig(c => ({...c, hasPacht: false}))}
                  className={`px-4 py-2 font-body text-sm border transition-colors ${config.hasPacht === false ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Nein / Eigentum</button>
              </div>
              {config.hasPacht && (
                <>
                  <div>
                    <FieldLabel required hint="€ gesamt pro Jahr">Jahrespacht gesamt</FieldLabel>
                    <div className="flex items-center gap-2">
                      <NumberInput value={config.pachtJahr} onChange={v => setConfig(c => ({...c, pachtJahr: v}))}
                        placeholder="z. B. 96000"
                        className="flex-1 w-full px-4 py-2.5 bg-[#F8F5F0] border border-[#1C1C1A]/15 text-sm focus:border-[#D2563E]" />
                      <span className="font-body text-sm text-[#6B6961]">€ / Jahr</span>
                    </div>
                  </div>
                  <div>
                    <FieldLabel required>Wird die Pacht gewerblich oder privat berechnet?</FieldLabel>
                    <div className="flex gap-2">
                      <button onClick={() => setConfig(c => ({...c, pachtGewerblich: true}))}
                        className={`px-4 py-2 font-body text-sm border transition-colors ${config.pachtGewerblich ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Gewerblich (+19 % USt)</button>
                      <button onClick={() => setConfig(c => ({...c, pachtGewerblich: false}))}
                        className={`px-4 py-2 font-body text-sm border transition-colors ${config.pachtGewerblich === false ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Privat (keine USt)</button>
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
        {pflichtfelderOk && !validierung.valid && <p className="font-body text-xs text-[#C5392E] text-right">{validierung.error}</p>}
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
                className={`px-3 py-1.5 font-body text-xs border transition-colors num ${selectedVariant.groesse === g ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
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
                className={`px-3 py-1.5 font-body text-xs border transition-colors ${selectedVariant.kueche === k ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
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
              className={`px-3 py-1.5 font-body text-xs border transition-colors ${selectedVariant.moebliert === false ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>Ohne Möbel</button>
            <button onClick={() => setSelectedVariant({...selectedVariant, moebliert: true})}
              className={`px-3 py-1.5 font-body text-xs border transition-colors ${selectedVariant.moebliert === true ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>Möbliert</button>
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
          className={`flex-1 py-2 px-2 font-body text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 ${mode === 'eigennutzung' ? 'bg-[#D2563E] text-[#F8F5F0]' : 'border border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
          <Gift className="w-3 h-3" strokeWidth={2} /> Eigennutzung
        </button>
        <button onClick={() => onChange('einnahmen')}
          className={`flex-1 py-2 px-2 font-body text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 ${mode === 'einnahmen' ? 'bg-[#7B2D8E] text-white' : 'border border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
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
function AddFamilyCard({ selections, setSelections, einmaligProModul, hasProjectOrConfig, addUsageState, setAddUsageState, isPureGewerb }) {
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
  function setExact(val) {
    const k = product.kuerzel;
    const n = Math.max(0, Math.min(999, parseInt(val, 10) || 0));
    setSelections(prev => {
      const next = { ...prev };
      if (n === 0) delete next[k]; else next[k] = n;
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

  // Modulpreis bleibt STABIL — anteilige Projektkosten werden NICHT eingerechnet,
  // weil sie sich mit jeder Modulanzahl-Änderung ändern und dadurch Preissprünge erzeugen würden
  // (Feedback V7). Projektkosten stehen separat in der Sidebar als eigener Block.
  // Im rein gewerblichen Pfad: netto-Preise (Hinweis steht im Sidebar-Banner)
  const effectivePrice = isPureGewerb ? product.netto : product.brutto;

  return (
    <div className={`border transition-all duration-300 overflow-hidden flex flex-col ${familyTotal > 0 ? 'border-[#D2563E] bg-white shadow-[0_4px_20px_-8px_rgba(60,84,70,0.15)]' : 'border-[#1C1C1A]/10 bg-white hover:border-[#1C1C1A]/25'}`}>
      {/* Hero-Image: Grundriss groß, weißer Hintergrund (Feedback V4) */}
      <div className="relative bg-white flex items-center justify-center px-2 py-2" style={{ minHeight: '200px' }}>
        {(() => {
          const iconPath = getModulIcon(product.kuerzel);
          return iconPath ? (
            <img src={iconPath} alt={`Grundriss ${getDisplayName(product)}`} className="max-h-56 w-auto object-contain" loading="lazy" />
          ) : (
            <ModuleIcon nuf={product.nuf} />
          );
        })()}
        {familyTotal > 0 && (
          <span className="absolute top-3 right-3 font-body text-[10px] tracking-wider uppercase text-[#D2563E] bg-[#F8F5F0] border border-[#D2563E]/30 px-2 py-0.5 num">{familyTotal} gewählt</span>
        )}
      </div>
      <div className="p-6 bg-[#F8F5F0] border-t border-[#1C1C1A]/8 flex-1">
        <div className="mb-4">
          <h4 className="font-display text-xl leading-tight mb-1">CoMod Add</h4>
          <p className="font-body text-xs text-[#6B6961] leading-snug">Ergänzungsmodul leer — z. B. Hobby, Lager, Praxis, Büro</p>
        </div>

        {/* Privat / Gewerblich Toggle */}
        <div className="mt-3 pt-3 border-t border-[#1C1C1A]/8">
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#6B6961] mb-2">Nutzung & Finanzierung</p>
          <div className="flex gap-1">
            <button onClick={() => switchUsage('p')}
              className={`flex-1 py-2 px-2 font-body text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 ${usageState === 'p' ? 'bg-[#D2563E] text-[#F8F5F0]' : 'border border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
              <Home className="w-3 h-3" strokeWidth={2} /> Privat (KfW/GLS)
            </button>
            <button onClick={() => switchUsage('g')}
              className={`flex-1 py-2 px-2 font-body text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 ${usageState === 'g' ? 'bg-[#7B2D8E] text-white' : 'border border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
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
                className={`px-3 py-1.5 font-body text-xs border transition-colors num ${groesse === g ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
                {g} m²
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 pt-4 mt-4 border-t border-[#1C1C1A]/8">
          <div className="space-y-1 text-xs font-body">
            <p className="text-[11px] text-[#6B6961]">Aktuelle Auswahl:</p>
            <p className="text-sm text-[#1C1C1A]">{getDisplayName(product)}</p>
            <p className="font-display text-xl num text-[#1C1C1A]">{fmtEUR(effectivePrice)}</p>
            <p className="text-[10px] text-[#6B6961] tracking-wider uppercase opacity-60">Modulpreis</p>
          </div>
          <div className="flex items-center gap-2">
            {count > 0 ? (
              <>
                <button onClick={() => adjust(-1)} className="w-9 h-9 rounded-full border border-[#1C1C1A]/15 hover:border-[#D2563E] hover:bg-[#D2563E]/5 flex items-center justify-center transition-colors">
                  <Minus className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <input type="number" min={0} max={999} value={count}
                  onChange={e => setExact(e.target.value)}
                  onFocus={e => e.target.select()}
                  className="font-display text-xl num w-12 text-center bg-transparent border-b border-[#1C1C1A]/15 focus:border-[#D2563E] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => adjust(1)} className="w-9 h-9 rounded-full bg-[#D2563E] hover:bg-[#B04528] text-[#F8F5F0] flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <button onClick={() => adjust(1)} className="font-body text-sm flex items-center gap-1.5 px-4 py-2 border border-[#1C1C1A]/15 hover:border-[#D2563E] hover:bg-[#D2563E]/5 transition-colors">
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
                  <span className="text-[#6B6961]">{selections[p.kuerzel]}× <span className="text-[#1C1C1A]">{getDisplayName(p)}</span></span>
                  <button onClick={() => setSelections(prev => { const n = {...prev}; delete n[p.kuerzel]; return n; })}
                    className="text-[#6B6961] hover:text-[#C5392E] transition-colors text-[10px]">entfernen</button>
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
function FamilyCard({ familyId, products, selections, setSelections, modes, setModes, einmaligProModul, hasProjectOrConfig, variantState, setVariantState, isPureGewerb }) {
  // Defensive: Falls für eine Family kein Label hinterlegt ist, mit Defaults weitermachen statt zu crashen
  const fam = FAMILY_LABELS[familyId] || { label: products[0]?.kuerzel || familyId, desc: '' };
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
  function setExact(val) {
    const k = product.kuerzel;
    const n = Math.max(0, Math.min(999, parseInt(val, 10) || 0));
    setSelections(prev => {
      const next = { ...prev };
      if (n === 0) delete next[k]; else next[k] = n;
      return next;
    });
  }
  function setMode(m) { setModes(prev => ({ ...prev, [product.kuerzel]: m })); }

  // Modulpreis bleibt STABIL — anteilige Projektkosten werden NICHT eingerechnet,
  // weil sie sich mit jeder Modulanzahl-Änderung ändern und dadurch Preissprünge erzeugen würden
  // (Feedback V7). Projektkosten stehen separat in der Sidebar als eigener Block.
  const effectivePrice = isPureGewerb ? product.netto : product.brutto;
  const showsIncome = isModeToggleable(product) && mode === 'einnahmen';

  return (
    <div className={`border transition-all duration-300 overflow-hidden flex flex-col ${
      familyTotal > 0
        ? (showsIncome && product.usage === 'g' ? 'border-[#7B2D8E] bg-white shadow-[0_4px_20px_-8px_rgba(168,139,90,0.25)]' : 'border-[#D2563E] bg-white shadow-[0_4px_20px_-8px_rgba(60,84,70,0.15)]')
        : 'border-[#1C1C1A]/10 bg-white hover:border-[#1C1C1A]/25'}`}>

      {/* Hero-Image: Grundriss groß, weißer Hintergrund, minimales Padding (Feedback V4) */}
      <div className="relative bg-white flex items-center justify-center px-2 py-2" style={{ minHeight: '200px' }}>
        {(() => {
          const iconPath = getModulIcon(product.kuerzel);
          return iconPath ? (
            <img src={iconPath} alt={`Grundriss ${getDisplayName(product)}`} className="max-h-56 w-auto object-contain" loading="lazy" />
          ) : (
            <ModuleIcon nuf={product.nuf} />
          );
        })()}
        {familyTotal > 0 && (
          <span className="absolute top-3 right-3 font-body text-[10px] tracking-wider uppercase text-[#D2563E] bg-[#F8F5F0] border border-[#D2563E]/30 px-2 py-0.5 num">{familyTotal} gewählt</span>
        )}
      </div>

      {/* Textteil dezent farblich abgesetzt vom weißen Hero — flex-1 füllt die restliche Höhe der Karte */}
      <div className="p-6 bg-[#F8F5F0] border-t border-[#1C1C1A]/8 flex-1">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h4 className="font-display text-xl leading-tight">{fam.label}</h4>
        </div>
        <p className="font-body text-xs text-[#6B6961] leading-snug mb-4">{fam.desc}</p>

        <VariantPicker products={products} selectedVariant={variant} setSelectedVariant={setVar} />

        <div className="flex items-end justify-between gap-4 pt-4 mt-4 border-t border-[#1C1C1A]/10">
          <div className="space-y-1 text-xs font-body">
            <p className="text-[11px] text-[#6B6961]">Aktuelle Auswahl:</p>
            <p className="text-sm text-[#1C1C1A]">{getDisplayName(product)}</p>
            <div className="flex gap-3 text-[#6B6961] text-[11px]">
              <span>{product.nuf} m² NUF</span><span>·</span><span>{product.bgf} m² BGF</span>
              {calcModulEinheiten(product) > 1 && <><span>·</span><span className="text-[#7B2D8E]">{calcModulEinheiten(product)} Einheiten</span></>}
            </div>
            <p className="font-display text-xl num text-[#1C1C1A]">{fmtEUR(effectivePrice)}</p>
            <p className="text-[10px] text-[#6B6961] tracking-wider uppercase opacity-60">Modulpreis</p>
          </div>
          <div className="flex items-center gap-2">
            {count > 0 ? (
              <>
                <button onClick={() => adjust(-1)} className="w-9 h-9 rounded-full border border-[#1C1C1A]/15 hover:border-[#D2563E] hover:bg-[#D2563E]/5 flex items-center justify-center transition-colors">
                  <Minus className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <input type="number" min={0} max={999} value={count}
                  onChange={e => setExact(e.target.value)}
                  onFocus={e => e.target.select()}
                  className="font-display text-xl num w-12 text-center bg-transparent border-b border-[#1C1C1A]/15 focus:border-[#D2563E] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button onClick={() => adjust(1)} className="w-9 h-9 rounded-full bg-[#D2563E] hover:bg-[#B04528] text-[#F8F5F0] flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <button onClick={() => adjust(1)} className="font-body text-sm flex items-center gap-1.5 px-4 py-2 border border-[#1C1C1A]/15 hover:border-[#D2563E] hover:bg-[#D2563E]/5 transition-colors">
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Hinzufügen
              </button>
            )}
          </div>
        </div>

        <AvailabilityToggle product={product} mode={mode} onChange={setMode} />

        {showsIncome && (
          <div className="mt-3 px-3 py-2 bg-[#7B2D8E]/10 border border-[#7B2D8E]/25 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#7B2D8E]" strokeWidth={2} />
              <span className="font-body text-xs text-[#1C1C1A]">Mietindikation / Monat</span>
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
                  <span className="text-[#6B6961]">{selections[p.kuerzel]}× <span className="text-[#1C1C1A]">{getDisplayName(p)}</span></span>
                  <button onClick={() => setSelections(prev => { const n = {...prev}; delete n[p.kuerzel]; return n; })}
                    className="text-[#6B6961] hover:text-[#C5392E] transition-colors text-[10px]">entfernen</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModulesStep({ customerType, modulart, project, gewerbConfig, selections, setSelections, modes, setModes, totals, onNext, onBack, addUsageState, setAddUsageState }) {
  const [variantState, setVariantState] = useState({});

  // Reiner Gewerbe-Pfad: alle Beträge netto anzeigen (Vorsteuer-Abzug möglich)
  const isPureGewerb = customerType === 'gewerblich';
  const priceMode = isPureGewerb ? 'netto' : 'brutto';
  // Helper: nimmt einen Posten mit { brutto, netto } und gibt den anzuzeigenden Wert
  const showPrice = (item) => isPureGewerb && item?.netto != null ? item.netto : (item?.brutto ?? item);

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
  // Mindestflächenbedarf anzeigen wenn:
  // - Gewerbekunde ohne eigene Fläche (suche selbst / sucht für mich)
  // - Privatkunde mit eigenem Grundstück (kein Projekt-Beitritt)
  const showMindestflaeche = totals.countTotal > 0 && (
    (gewerbConfig && gewerbConfig.flaecheStatus !== 'ja') ||
    (!project && !gewerbConfig && customerType === 'privat')
  );

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

          {totals.rabattPct > 0 && (
            <div className="bg-[#D2563E]/5 border border-[#D2563E]/20 px-4 py-3 mb-6 flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-[#D2563E]" strokeWidth={1.5} />
              <p className="font-body text-xs text-[#1C1C1A]">
                <span className="font-medium num">{fmtPct(totals.rabattPct)} Rabatt</span> berücksichtigt
                {gewerbConfig && gewerbConfig.zielModulAnzahl > 0
                  ? <> — basierend auf Deinem Zielwert von <span className="num">{gewerbConfig.zielModulAnzahl}</span> Modulen.</>
                  : project && project.zielModulAnzahl > 0
                    ? <> — Mengen-Rabatt aus dem Gesamt-Projekt ({project.zielModulAnzahl} Module) {project.projektrabatt > 0 && <>+ Projekt-Bonus {fmtPct(project.projektrabatt)}</>}.</>
                    : <> — basierend auf <span className="num">{totals.countTotal}</span> ausgewählten Modulen.</>}
              </p>
            </div>
          )}
          {totals.nextStaffel && totals.countTotal > 0 && totals.rabattPct === 0 && !gewerbConfig && (
            <div className="bg-[#D2563E]/5 border border-[#D2563E]/20 px-4 py-3 mb-6 flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-[#D2563E]" strokeWidth={1.5} />
              <p className="font-body text-xs text-[#1C1C1A]">
                Noch <span className="font-medium num">{totals.nextStaffel.ab - totals.countTotal}</span> Module bis zum nächsten Rabatt-Sprung ({fmtPct(totals.nextStaffel.prozent)}).
              </p>
            </div>
          )}

          {availableCategories.length > 1 && (
            <div className="flex gap-2 font-body text-xs tracking-wider uppercase flex-wrap mb-8">
              <button onClick={() => setCatFilter('alle')}
                className={`px-3 py-1.5 transition-colors ${catFilter === 'alle' ? 'border-[#D2563E] text-[#D2563E]' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'} border`}>
                Alle Kategorien
              </button>
              {availableCategories.map(c => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`px-3 py-1.5 transition-colors ${catFilter === c ? 'border-[#D2563E] text-[#D2563E]' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'} border`}>
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
                      variantState={variantState} setVariantState={setVariantState}
                      isPureGewerb={isPureGewerb} />
                  ))}
                  {catId === 'ergaenzung' && showAddInCat && (
                    <AddFamilyCard selections={selections} setSelections={setSelections}
                      einmaligProModul={totals.einmaligProModul} hasProjectOrConfig={hasProjectOrConfig}
                      addUsageState={addUsageState} setAddUsageState={setAddUsageState}
                      isPureGewerb={isPureGewerb} />
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
                    addUsageState={addUsageState} setAddUsageState={setAddUsageState}
                    isPureGewerb={isPureGewerb} />
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:w-96 lg:shrink-0">
          <div className="lg:sticky lg:top-24 bg-white border border-[#1C1C1A]/10 p-7">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-2">Dein unverbindliches Angebot</p>
            <h3 className="font-display text-2xl mb-6">Übersicht</h3>
            {isPureGewerb && (
              <div className="mb-5 -mx-7 px-7 py-2 bg-[#7B2D8E]/8 border-y border-[#7B2D8E]/15">
                <p className="font-body text-[11px] text-[#7B2D8E] flex items-center gap-1.5">
                  <Info className="w-3 h-3" strokeWidth={2} /> Alle Beträge netto, exkl. 19 % USt
                </p>
              </div>
            )}
            {totals.countTotal === 0 ? (
              <p className="font-body text-sm text-[#6B6961] py-8 text-center border-y border-[#1C1C1A]/10">
                Noch keine Module gewählt<span className="opacity-50"> …</span>
              </p>
            ) : (
              <>
                {/* MONATLICHE BELASTUNG — Hero-Element der Sidebar (Verkaufspsychologie) */}
                {(totals.finanzierungMonat > 0 || totals.hasIncome) && (
                  <div className="-mx-7 px-7 py-5 mb-5 bg-gradient-to-b from-[#D2563E]/5 to-transparent border-y border-[#D2563E]/15">
                    {/* Verbrauchskosten klein, informativ, OBERHALB der Belastung (Feedback V4) */}
                    {totals.verbrauchskostenMonat > 0 && (
                      <div className="mb-3 pb-3 border-b border-[#1C1C1A]/8">
                        <div className="flex items-baseline justify-between text-[#6B6961]">
                          <span className="font-body text-[10px] uppercase tracking-wider">Verbrauchskosten (variabel)</span>
                          <span className="font-body text-xs num">ca. {fmtEUR(totals.verbrauchskostenMonat)}/Mt.</span>
                        </div>
                        <p className="font-body text-[10px] text-[#6B6961] mt-0.5 italic">
                          Strom, Wasser, Heizung — individueller Richtwert, nicht in der Rate enthalten
                        </p>
                      </div>
                    )}
                    {totals.finanzierungMonat > 0 && (
                      <div className="mb-3">
                        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[#D2563E] mb-1">Voraussichtliche Monatsrate</p>
                        <p className="font-display text-3xl num text-[#1C1C1A] leading-none">{fmtEUR(totals.monatlichGesamt)}</p>
                        <div className="mt-2 space-y-0.5">
                          <div className="flex justify-between font-body text-[11px] text-[#6B6961]">
                            <span>Finanzierungsrate</span><span className="num">{fmtEUR(totals.finanzierungMonat)}</span>
                          </div>
                          {totals.laufendeKostenMonat > 0 && (
                            <div className="flex justify-between font-body text-[11px] text-[#6B6961]">
                              <span>+ laufende Kosten</span><span className="num">{fmtEUR(totals.laufendeKostenMonat)}</span>
                            </div>
                          )}
                        </div>
                        <p className="font-body text-[10px] text-[#6B6961] mt-1.5">Vorschau mit Standard-Konditionen — anpassbar im nächsten Schritt</p>
                        {totals.eigennutzungGewerbCount > 0 && (
                          <div className="mt-3 pt-3 border-t border-[#D2563E]/15">
                            <div className="flex justify-between items-baseline">
                              <span className="font-body text-[10px] uppercase tracking-wider text-[#D2563E] flex items-center gap-1"><Users className="w-3 h-3" strokeWidth={2}/> pro Mitarbeiter</span>
                              <span className="font-display text-lg num text-[#D2563E]">{fmtEUR(totals.belastungProMA)}</span>
                            </div>
                            <p className="font-body text-[10px] text-[#6B6961] mt-0.5">{totals.monatlichGesamt > 0 ? `${fmtEUR(totals.monatlichGesamt)} ÷ ${totals.eigennutzungGewerbCount} eigengenutzte Module` : ''}</p>
                          </div>
                        )}
                      </div>
                    )}
                    {totals.hasIncome && (
                      <div className={totals.finanzierungMonat > 0 ? 'pt-3 border-t border-[#7B2D8E]/20' : ''}>
                        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[#7B2D8E] mb-1 flex items-center gap-1.5">
                          <TrendingUp className="w-3 h-3" strokeWidth={2} /> Mietindikation / Monat
                        </p>
                        <p className="font-display text-2xl num text-[#7B2D8E] leading-none">{fmtEUR(totals.monthlyIncomeBrutto)}</p>
                        {totals.cashflowPositive && (
                          <p className="font-body text-xs text-[#7FB069] mt-1.5 flex items-center gap-1">
                            <Check className="w-3 h-3" strokeWidth={2.5} /> rechnerisch positiv
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* PROJEKT-ECKDATEN (nur bei Projekt-Beitritt) */}
                {project && (
                  <div className="mb-4 pb-4 border-b border-[#1C1C1A]/10">
                    <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[#7B2D8E] mb-2">Projekt-Beteiligung</p>
                    <p className="font-display text-base text-[#1C1C1A] leading-tight mb-1">{project.name}</p>
                    <p className="font-body text-[11px] text-[#6B6961] mb-3">{project.location}</p>
                    <dl className="space-y-1 text-[11px] font-body text-[#6B6961]">
                      <div className="flex justify-between"><dt>Projekt-Gesamtmodule</dt><dd className="num text-[#1C1C1A]">{project.zielModulAnzahl}</dd></div>
                      {project.grundstueckGroesse > 0 && <div className="flex justify-between"><dt>Grundstück</dt><dd className="num">{fmtNum(project.grundstueckGroesse)} m²</dd></div>}
                      <div className="flex justify-between"><dt>Anteil</dt><dd className="num text-[#1C1C1A]">{totals.countTotal} von {project.zielModulAnzahl} ({fmtPct(totals.countTotal / project.zielModulAnzahl)})</dd></div>
                      {project.projektrabatt > 0 && <div className="flex justify-between text-[#D2563E]"><dt>Projekt-Bonus</dt><dd className="num">−{fmtPct(project.projektrabatt)}</dd></div>}
                    </dl>
                  </div>
                )}

                {/* GEWERBE-KONFIG-ECKDATEN (nur bei Gewerbe mit Konfig) */}
                {gewerbConfig && (gewerbConfig.geschosse > 0 || gewerbConfig.zielModulAnzahl > 0) && (
                  <div className="mb-4 pb-4 border-b border-[#1C1C1A]/10">
                    <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[#6B6961] mb-2">Deine Konfiguration</p>
                    <dl className="space-y-1 text-[11px] font-body text-[#6B6961]">
                      {gewerbConfig.zielModulAnzahl > 0 && <div className="flex justify-between"><dt>Zielwert Module</dt><dd className="num text-[#1C1C1A]">{gewerbConfig.zielModulAnzahl}</dd></div>}
                      {gewerbConfig.geschosse > 0 && <div className="flex justify-between"><dt>Geschosse</dt><dd className="num text-[#1C1C1A]">{gewerbConfig.geschosse}</dd></div>}
                      {gewerbConfig.geschossVerteilung && gewerbConfig.geschossVerteilung.length > 1 && (
                        <div className="flex justify-between"><dt>Verteilung</dt><dd className="num">{gewerbConfig.geschossVerteilung.join(' / ')}</dd></div>
                      )}
                      {gewerbConfig.grundstueckGroesse > 0 && <div className="flex justify-between"><dt>Grundstück</dt><dd className="num">{fmtNum(gewerbConfig.grundstueckGroesse)} m²</dd></div>}
                      {(gewerbConfig.pvAnteil || 0) > 0 && <div className="flex justify-between text-[#7B2D8E]"><dt>PV-Anlage</dt><dd className="num">{Math.round(gewerbConfig.pvAnteil * 100)} % Dach</dd></div>}
                    </dl>
                  </div>
                )}

                {/* MODULAUSWAHL — kompakt, Preise dezent */}
                <div className="space-y-2 pb-4 mb-4 border-b border-[#1C1C1A]/10 max-h-48 overflow-auto scrollbar-none">
                  {totals.lineItems.map(it => (
                    <div key={it.kuerzel} className="flex items-start justify-between gap-2 text-sm font-body group">
                      <span className="text-[#1C1C1A] flex-1 leading-tight min-w-0">
                        <span className="num">{it.count}×</span> <span className="text-[#6B6961]">{getDisplayName(it)}</span>
                        {it.mode === 'einnahmen' && it.einnahmen > 0 && <span className="text-[10px] text-[#7B2D8E] ml-1 tracking-wider uppercase">verm.</span>}
                      </span>
                      <button
                        onClick={() => setSelections(prev => { const n = {...prev}; delete n[it.kuerzel]; return n; })}
                        className="opacity-30 hover:opacity-100 hover:text-[#C5392E] transition-all p-0.5 shrink-0"
                        title="Modul aus Auswahl entfernen">
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>

                <dl className="space-y-1.5 text-xs font-body mb-5 text-[#6B6961]">
                  <div className="flex justify-between"><dt>Module gesamt</dt><dd className="num text-[#1C1C1A]">{totals.countTotal}</dd></div>
                  {totals.einheitenTotal !== totals.countTotal && (
                    <div className="flex justify-between"><dt className="pl-2">Stellplatz-Einheiten</dt><dd className="num">{totals.einheitenTotal}</dd></div>
                  )}
                  {totals.countPrivat > 0 && totals.countGewerb > 0 && (
                    <>
                      <div className="flex justify-between"><dt className="pl-2">davon privat</dt><dd className="num">{totals.countPrivat}</dd></div>
                      <div className="flex justify-between"><dt className="pl-2">davon gewerblich</dt><dd className="num">{totals.countGewerb}</dd></div>
                    </>
                  )}
                  <div className="flex justify-between"><dt>NUF</dt><dd className="num">{fmtNum(totals.gesamtNUF)} m²</dd></div>
                  {totals.rabattPct > 0 && <div className="flex justify-between text-[#D2563E]"><dt>Rabatt gesamt</dt><dd className="num">−{fmtPct(totals.rabattPct)}</dd></div>}
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
                      <div className="pb-4 mb-4 border-b border-[#1C1C1A]/10 -mx-7 px-7 py-4 bg-[#C5392E]/10 border-l-4 border-l-[#C5392E]">
                        <p className="font-body text-xs uppercase tracking-wider text-[#C5392E] mb-1.5 font-medium flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" strokeWidth={2.5}/> Kapazität überschritten
                        </p>
                        <p className="font-display text-xl num text-[#C5392E]">
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
                      <div className="pb-4 mb-4 border-b border-[#1C1C1A]/10 -mx-7 px-7 py-4 bg-[#FCE4E0] border-l-4 border-l-[#C5392E]">
                        <p className="font-body text-xs uppercase tracking-wider text-[#C5392E] mb-1.5 font-medium flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" strokeWidth={2.5}/> Über Zielwert
                        </p>
                        <p className="font-display text-xl num text-[#C5392E]">
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
                      <div className="pb-4 mb-4 border-b border-[#1C1C1A]/10 -mx-7 px-7 py-4 bg-[#FCE4E0] border-l-4 border-l-[#C5392E]">
                        <p className="font-body text-xs uppercase tracking-wider text-[#C5392E] mb-1.5 font-medium flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" strokeWidth={2.5}/> Unter Zielwert
                        </p>
                        <p className="font-display text-xl num text-[#C5392E]">
                          Noch {frei} Einheit{frei === 1 ? '' : 'en'} frei
                        </p>
                        <p className="font-body text-xs text-[#1C1C1A]/80 mt-2 leading-relaxed">
                          Dein Zielwert: <span className="num font-medium">{zielwert}</span> Module · Aktuelle Auswahl: <span className="num font-medium">{ist}</span> Einheiten.
                        </p>
                        <p className="font-body text-xs text-[#6B6961] mt-1.5 leading-relaxed">
                          Du kannst noch Module hinzufügen — oder wir kalkulieren das unverbindliche Angebot mit Deiner aktuellen Auswahl.
                        </p>
                      </div>
                    );
                  }

                  return null;
                })()}

                {showMindestflaeche && totals.mindestflaeche && (
                  <div className="pb-4 mb-4 border-b border-[#1C1C1A]/10 bg-[#FBF7EF] -mx-7 px-7 py-4">
                    <p className="font-body text-xs uppercase tracking-wider text-[#7B2D8E] mb-2 flex items-center gap-1.5"><MapPin className="w-3 h-3" strokeWidth={2}/> Mindestflächenbedarf</p>
                    <p className="font-display text-2xl num">{fmtNum(totals.mindestflaeche.mindestGrundstueck)} m²</p>
                    <p className="font-body text-xs text-[#6B6961] mt-1">
                      Gebäude-Grundfläche {fmtNum(totals.mindestflaeche.gebaeudeflaeche)} m² ÷ {Math.round(BEBAUUNGSGRAD * 100)} % Bebauungsgrad
                    </p>
                  </div>
                )}

                {totals.einmaligGesamtBrutto > 0 && (
                  <details className="pb-4 mb-4 border-b border-[#1C1C1A]/10 group">
                    <summary className="cursor-pointer list-none flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-1 flex items-center gap-1.5"><Receipt className="w-3 h-3" strokeWidth={2}/> Einmalige Projektkosten {isPureGewerb && <span className="text-[10px] normal-case tracking-normal text-[#6B6961]">(netto)</span>}</p>
                        <p className="font-display text-xl num text-[#1C1C1A]">{fmtEUR(isPureGewerb ? totals.einmaligGesamtNetto : totals.einmaligGesamtBrutto)}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#6B6961] transition-transform group-open:rotate-90" strokeWidth={2} />
                    </summary>
                    <div className="mt-3 pt-3 border-t border-[#1C1C1A]/8">
                    {project ? (
                      // Projekt-Beitritt: Umlage stabil pro Modul (fixer Projekt-Tarif)
                      <>
                        <div className="flex justify-between text-sm font-body"><dt className="text-[#6B6961]">{fmtEUR(project.umlageProModulEinmalig)}/Modul × {totals.countTotal} Module</dt><dd className="num">{fmtEUR(totals.countTotal * project.umlageProModulEinmalig)}</dd></div>
                        {totals.baugenehmigungEinzeln > 0 && (
                          <div className="flex justify-between text-sm font-body mt-1"><dt className="text-[#6B6961]">+ Baugenehmigung (anteilig)</dt><dd className="num">{fmtEUR(totals.baugenehmigungEinzeln)}</dd></div>
                        )}
                        <div className="flex justify-between text-sm font-body pt-1.5 mt-1.5 border-t border-[#1C1C1A]/8"><dt className="text-[#1C1C1A]">Summe einmalig</dt><dd className="num text-[#1C1C1A]">{fmtEUR(totals.einmaligGesamtBrutto)}</dd></div>
                      </>
                    ) : gewerbConfig ? (
                      // Gewerblich: Detail-Posten analog Privat, aber mit zusätzlichem Block für Optionen/Schätzungen
                      // Posten-Typen aus calcEinmaligeProjektkosten: 'pflicht' (Module-bezogen) | 'option' / 'schaetzung' (Grundstück, PV) | wir behandeln Arch/Eing/PM als 'pflicht' aber separieren sie unten
                      <>
                        {totals.einmaligDetail?.posten?.filter(p => p.typ === 'pflicht' && !['arch', 'eing', 'pm'].includes(p.id)).map(p => (
                          <div key={p.id} className="flex justify-between text-sm font-body mt-1">
                            <dt className="text-[#6B6961]">{p.label}</dt>
                            <dd className="num">{fmtEUR(isPureGewerb ? p.netto : p.brutto)}</dd>
                          </div>
                        ))}

                        {/* Grundstücks-Optionen + PV/Dachbegrünung */}
                        {totals.einmaligDetail?.posten?.some(p => p.typ === 'option' || p.typ === 'schaetzung') && (
                          <div className="mt-3 pt-3 border-t border-dashed border-[#1C1C1A]/15">
                            <p className="font-body text-[11px] text-[#6B6961] mb-1.5">Optionen / Grundstück</p>
                            {totals.einmaligDetail.posten.filter(p => p.typ === 'option' || p.typ === 'schaetzung').map(p => (
                              <div key={p.id} className="flex justify-between text-xs font-body text-[#6B6961] mt-0.5">
                                <dt>
                                  {p.label}
                                  {p.typ === 'schaetzung' && <span className="text-[10px] italic ml-1">(Schätzung)</span>}
                                </dt>
                                <dd className="num">{fmtEUR(isPureGewerb ? p.netto : p.brutto)}</dd>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Planungs-Block analog Privat */}
                        {totals.einmaligDetail?.posten?.some(p => ['arch', 'eing', 'pm'].includes(p.id)) && (
                          <div className="mt-3 pt-3 border-t border-dashed border-[#1C1C1A]/15">
                            <p className="font-body text-[11px] text-[#6B6961] italic mb-1.5 leading-snug">
                              Planung & Bauleitung (Pflicht, gestaffelt nach Ziel-Modulanzahl):
                            </p>
                            {totals.einmaligDetail.posten.filter(p => ['arch', 'eing', 'pm'].includes(p.id)).map(p => (
                              <div key={p.id} className="flex justify-between text-xs font-body text-[#6B6961] mt-0.5">
                                <dt>{p.label}</dt>
                                <dd className="num">{fmtEUR(isPureGewerb ? p.netto : p.brutto)}</dd>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between text-sm font-body pt-1.5 mt-1.5 border-t border-[#1C1C1A]/8">
                          <dt className="text-[#1C1C1A]">Summe einmalig</dt>
                          <dd className="num text-[#1C1C1A]">{fmtEUR(isPureGewerb ? totals.einmaligGesamtNetto : totals.einmaligGesamtBrutto)}</dd>
                        </div>
                      </>
                    ) : (
                      // Privat eigenes Grundstück: zwei Sub-Blöcke
                      // Block 1 (prominent): Modul-bezogene Pflichtkosten (typ='pflicht')
                      // Block 2 (zurückhaltender, on-top-Hinweis): Planungskosten (typ='planung')
                      <>
                        {totals.einmaligDetail?.posten?.filter(p => p.typ === 'pflicht').map(p => (
                          <div key={p.id} className="flex justify-between text-sm font-body mt-1">
                            <dt className="text-[#6B6961]">{p.label}</dt>
                            <dd className="num">{fmtEUR(p.brutto)}</dd>
                          </div>
                        ))}

                        {/* Planungs-Block: kleinere Typo, gedämpfte Farbe, mit Hinweistext */}
                        {totals.einmaligDetail?.posten?.some(p => p.typ === 'planung') && (
                          <div className="mt-3 pt-3 border-t border-dashed border-[#1C1C1A]/15">
                            <p className="font-body text-[11px] text-[#6B6961] italic mb-1.5 leading-snug">
                              Diese Kosten kommen leider bei jedem Bauprojekt noch on top:
                            </p>
                            {totals.einmaligDetail.posten.filter(p => p.typ === 'planung').map(p => (
                              <div key={p.id} className="flex justify-between text-xs font-body text-[#6B6961] mt-0.5">
                                <dt>{p.label}</dt>
                                <dd className="num">{fmtEUR(p.brutto)}</dd>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between text-sm font-body pt-1.5 mt-1.5 border-t border-[#1C1C1A]/8"><dt className="text-[#1C1C1A]">Summe einmalig</dt><dd className="num text-[#1C1C1A]">{fmtEUR(totals.einmaligGesamtBrutto)}</dd></div>
                      </>
                    )}
                    <p className="font-body text-[10px] text-[#6B6961] mt-1.5 italic">
                      {hasProjectOrConfig
                        ? 'Pflicht — fallen unabhängig von uns an (Planung, Erschließung, Außenanlagen, Behörde).'
                        : 'Behördliche Gebühr — regional unterschiedlich. Weitere Kosten (Planung, Erschließung) hängen vom konkreten Bauprojekt ab.'}
                    </p>
                    </div>
                  </details>
                )}

                {/* INVESTMENT — als Detail, nicht als Hero */}
                <details className="mb-4 pb-4 border-b border-[#1C1C1A]/10 group">
                  <summary className="font-body text-xs uppercase tracking-wider text-[#6B6961] cursor-pointer hover:text-[#1C1C1A] flex items-center justify-between gap-2 list-none">
                    <span className="flex items-center gap-1.5"><Receipt className="w-3 h-3" strokeWidth={2}/> Investmentsumme anzeigen {isPureGewerb && <span className="text-[10px] normal-case tracking-normal text-[#6B6961]">(netto)</span>}</span>
                    <ChevronRight className="w-3 h-3 transition-transform group-open:rotate-90" strokeWidth={2} />
                  </summary>
                  <div className="mt-3 pt-3 border-t border-[#1C1C1A]/8 space-y-1.5">
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-[#6B6961]">Anschaffung gesamt</span>
                      <span className="num text-[#1C1C1A]">{fmtEUR(isPureGewerb ? totals.nettoGesamt : totals.bruttoGesamt)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-[#6B6961]">Anzahlung ca.</span>
                      <span className="num text-[#1C1C1A]">{fmtEUR(isPureGewerb ? totals.anzahlung / (1 + UST) : totals.anzahlung)}</span>
                    </div>
                    {totals.lineItems.length > 0 && (
                      <div className="pt-2 mt-2 border-t border-[#1C1C1A]/8 space-y-1">
                        {totals.lineItems.map(it => (
                          <div key={it.kuerzel} className="flex justify-between text-[11px] font-body text-[#6B6961]">
                            <span>{it.count}× {getDisplayName(it)}</span>
                            <span className="num">{fmtEUR(it.count * (isPureGewerb ? it.netto : it.brutto))}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </details>

                {hasProjectOrConfig && totals.verbrauchskostenMonat > 0 && totals.countTotal > 0 && (
                  <div className="pb-3 mb-4 text-[#6B6961]">
                    <div className="flex justify-between items-baseline">
                      <span className="font-body text-[11px] uppercase tracking-wider flex items-center gap-1"><Repeat className="w-3 h-3" strokeWidth={1.5}/> Verbrauchskosten</span>
                      <span className="font-body text-sm num">ca. {fmtEUR(totals.verbrauchskostenMonat / totals.countTotal)}/Modul/Mt.</span>
                    </div>
                    <p className="font-body text-[10px] mt-1 italic">Strom, Wasser, Heizung — variabel je nach Verbrauch, kommen on top</p>
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
        <span className="font-display text-base num text-[#D2563E]">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} className="w-full" />
      {hint && <p className="font-body text-xs text-[#6B6961] mt-1.5">{hint}</p>}
    </div>
  );
}

function PrivatFinanzPanel({ totals, financing, setFinancing, ekPrivat, setEkPrivat, privatOptionen, setPrivatOptionen, countPrivat }) {
  return (
    <>
      {/* KfW-Panel */}
      <div className="bg-white border border-[#1C1C1A]/10 p-7">
        <div className="flex items-baseline justify-between mb-1 gap-4 flex-wrap">
          <h3 className="font-display text-2xl">1. KfW-Förderung (privat)</h3>
          <span className="font-body text-xs tracking-wider uppercase text-[#D2563E] bg-[#D2563E]/5 px-2 py-1">{totals.countPrivat} Modul{totals.countPrivat > 1 ? 'e' : ''}</span>
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
          <div className="flex justify-between text-[#D2563E]"><span>davon Tilgungsnachlass ({fmtPct(financing.kfw.tilgungsnachlass)})</span><span className="num">−{fmtEUR(totals.kfwBasis * financing.kfw.tilgungsnachlass)}</span></div>
          <div className="flex justify-between pt-2 border-t border-[#1C1C1A]/10"><span className="text-[#1C1C1A]">Zurückzuzahlender Betrag</span><span className="num">{fmtEUR(totals.kfwBasis * (1 - financing.kfw.tilgungsnachlass))}</span></div>
          <div className="flex justify-between font-display text-base pt-2"><span>KfW-Monatsrate</span><span className="num text-[#D2563E]">{fmtEUR(totals.kfwRate)}</span></div>
        </div>
      </div>

      {/* GLS-Panel */}
      <div className="bg-white border border-[#1C1C1A]/10 p-7">
        <div className="flex items-baseline justify-between mb-1 gap-4 flex-wrap">
          <h3 className="font-display text-2xl">2. GLS Bank (Restfinanzierung)</h3>
          <span className="font-body text-xs tracking-wider uppercase text-[#D2563E] bg-[#D2563E]/5 px-2 py-1">10 J · fix</span>
        </div>
        <p className="font-body text-sm text-[#6B6961] mb-5">
          Der Auftragswert abzüglich KfW-Förderhöhe und Eigenkapital — zuzüglich optionaler Upgrades — wird über die GLS Bank finanziert.
        </p>

        {/* Optionale Upgrades (Feedback V4) */}
        <div className="mb-6">
          <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Optionale Upgrades</p>
          <div className="space-y-2">
            {PRIVAT_UPGRADES.map(opt => {
              const aktiv = !!privatOptionen[opt.id];
              const kosten = opt.proModul * (countPrivat || 0);
              return (
                <button key={opt.id} onClick={() => setPrivatOptionen(p => ({ ...p, [opt.id]: !p[opt.id] }))}
                  className={`w-full flex items-start gap-3 p-3 border text-left transition-colors ${aktiv ? 'border-[#D2563E] bg-[#D2563E]/5' : 'border-[#1C1C1A]/15 hover:border-[#D2563E]/40'}`}>
                  <div className={`mt-0.5 w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${aktiv ? 'bg-[#D2563E] border-[#D2563E]' : 'border-[#1C1C1A]/20'}`}>
                    {aktiv && <Check className="w-3.5 h-3.5 text-[#F8F5F0]" strokeWidth={2.5} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <span className="font-body text-sm text-[#1C1C1A]">{opt.label}</span>
                      <span className="font-body text-sm num text-[#6B6961]">{countPrivat > 0 ? fmtEUR(kosten) : `${fmtEUR(opt.proModul)}/Modul`}</span>
                    </div>
                    <p className="font-body text-[11px] text-[#6B6961] mt-0.5">{opt.hint}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {totals.privatOptionenKosten > 0 && (
            <p className="font-body text-xs text-[#D2563E] mt-2 text-right">
              Upgrades gesamt: <span className="num font-medium">{fmtEUR(totals.privatOptionenKosten)}</span> → fließen in GLS-Finanzierung
            </p>
          )}
        </div>

        <div className="bg-[#F8F5F0] border border-[#1C1C1A]/8 p-4 mb-6 font-body text-sm space-y-1.5">
          <div className="flex justify-between"><span className="text-[#6B6961]">Auftragswert privat (inkl. ant. Projektkosten)</span><span className="num">{fmtEUR(totals.effPrivat)}</span></div>
          <div className="flex justify-between"><span className="text-[#6B6961]">− KfW-Förderhöhe</span><span className="num">−{fmtEUR(totals.kfwBasis)}</span></div>
          {totals.privatOptionenKosten > 0 && <div className="flex justify-between text-[#D2563E]"><span>+ optionale Upgrades</span><span className="num">+{fmtEUR(totals.privatOptionenKosten)}</span></div>}
          <div className="flex justify-between"><span className="text-[#6B6961]">− Eigenkapital</span><span className="num">−{fmtEUR(ekPrivat)}</span></div>
          <div className="flex justify-between pt-1.5 border-t border-[#1C1C1A]/10 font-display text-base"><span>= GLS-Basis</span><span className="num text-[#D2563E]">{fmtEUR(totals.glsBasis)}</span></div>
        </div>
        <div className="space-y-6">
          <Slider label="GLS Zinssatz" value={financing.gls.zins} onChange={v => setFinancing(f => ({...f, gls: {...f.gls, zins: v}}))} min={0.04} max={0.06} step={0.0025} format={fmtPct} hint="Üblicher Bereich 4–6 %" />
          <div className="pt-4 border-t border-[#1C1C1A]/10">
            <div className="flex justify-between items-baseline mb-2 gap-2">
              <FieldLabel required={false} hint="Reduziert den über die GLS Bank zu finanzierenden Betrag">Eigenkapital</FieldLabel>
            </div>
            {(() => {
              // EK-Maximum: der GLS-finanzierbare Teil (Auftragswert über KfW-Förderung + optionale Upgrades)
              const ekMax = Math.max(0, totals.effPrivat - totals.kfwBasis + (totals.privatOptionenKosten || 0));
              const ekClamped = Math.min(ekPrivat, ekMax);
              return (
                <>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-display text-base num text-[#D2563E]">{fmtEUR(ekPrivat)}</span>
                    <span className="font-body text-xs text-[#6B6961]">max. {fmtEUR(ekMax)}</span>
                  </div>
                  <input type="range"
                    min={0}
                    max={ekMax || 1}
                    step={1000}
                    value={ekClamped}
                    disabled={ekMax === 0}
                    onChange={e => setEkPrivat(parseInt(e.target.value, 10))}
                    className="w-full" />
                  <div className="mt-2 flex items-center gap-2">
                    <NumberInput value={ekPrivat} onChange={v => setEkPrivat(Math.min(v, ekMax))} placeholder="0"
                      className="flex-1 w-full px-3 py-2 bg-[#F8F5F0] border border-[#1C1C1A]/15 text-sm focus:border-[#D2563E]" />
                    <span className="font-body text-xs text-[#6B6961]">€</span>
                  </div>
                  {ekMax === 0 && (
                    <p className="font-body text-[11px] text-[#6B6961] mt-2 italic">
                      Dein Auftragswert liegt vollständig in der KfW-Förderung — Eigenkapital ist hier nicht erforderlich.
                    </p>
                  )}
                </>
              );
            })()}
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-[#1C1C1A]/3 border border-[#1C1C1A]/10 font-body text-xs text-[#6B6961]">
            <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Laufzeit fix bei 10 Jahren</span>
          </div>
        </div>
        <div className="mt-6 pt-5 border-t border-[#1C1C1A]/10 flex justify-between font-display text-base">
          <span>GLS-Monatsrate</span><span className="num text-[#D2563E]">{fmtEUR(totals.glsRate)}</span>
        </div>

        {/* Info-Hinweis zur Hausbank-Option */}
        <div className="mt-5 bg-[#FBF7EF] border border-[#7B2D8E]/30 p-4 flex gap-3 items-start">
          <Info className="w-5 h-5 text-[#7B2D8E] shrink-0 mt-0.5" strokeWidth={1.5} />
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

function GewerblichFinanzPanel({ totals, financing, setFinancing }) {
  return (
    <div className="bg-white border border-[#1C1C1A]/10 p-7">
      <div className="flex items-baseline justify-between mb-1 gap-4 flex-wrap">
        <h3 className="font-display text-2xl">Plattform-Finanzierung (gewerblich)</h3>
        <span className="font-body text-xs tracking-wider uppercase text-[#7B2D8E] bg-[#7B2D8E]/10 px-2 py-1">{totals.countGewerb} Modul{totals.countGewerb > 1 ? 'e' : ''}</span>
      </div>
      <p className="font-body text-sm text-[#6B6961] mb-7 num">Effektive Kosten netto {fmtEUR(totals.effGewerbNetto)}</p>
      <div className="space-y-6">
        <Slider label="Zinssatz" value={financing.plattform.zins} onChange={v => setFinancing(f => ({...f, plattform: {...f.plattform, zins: v}}))} min={0.03} max={0.10} step={0.0025} format={fmtPct} hint="Bonitätsabhängig, 3–10 % möglich (Default 5,5 %)" />
        <Slider label="Laufzeit" value={financing.plattform.laufzeit} onChange={v => setFinancing(f => ({...f, plattform: {...f.plattform, laufzeit: v}}))} min={5} max={10} step={1} format={v => `${v} Jahre`} hint="Max. 10 Jahre — nur Verkürzung möglich" />
        <Slider label="Restwert am Laufzeitende" value={financing.plattform.restwertPct} onChange={v => setFinancing(f => ({...f, plattform: {...f.plattform, restwertPct: v}}))} min={0} max={0.5} step={0.05} format={fmtPct} />
      </div>
      <div className="mt-6 pt-5 border-t border-[#1C1C1A]/10 space-y-1.5 font-body text-sm">
        <div className="flex justify-between"><span className="text-[#6B6961]">Finanzierungs-Basis</span><span className="num">{fmtEUR(totals.plattformBasis)}</span></div>
        <div className="flex justify-between font-display text-base pt-2 border-t border-[#1C1C1A]/10"><span>Plattform-Monatsrate</span><span className="num text-[#7B2D8E]">{fmtEUR(totals.plattformRate)}</span></div>
      </div>
      <p className="font-body text-[11px] text-[#6B6961] mt-4 italic leading-relaxed">
        Hinweis: Bei gewerblicher Nutzung wird die Finanzierung üblicherweise ohne Eigenkapital-Beteiligung abgeschlossen. Steuerliche Vorteile (z. B. Investitionsabzugsbetrag IAB) wirken sich über die Steuererklärung aus, nicht über die Raten — siehe Steuerblock unten.
      </p>
    </div>
  );
}

function SteuerOptionenPanel({ totals, financing, setFinancing, iabBetrag, setIabBetrag }) {
  const [aktiv, setAktiv] = useState(false);
  if (totals.countGewerb === 0) return null;
  // IAB: maximal 50% des Netto-Investments (Vereinfachung der gesetzlichen Regelung)
  const iabMax = Math.max(0, (totals.effGewerbNetto || 0) * 0.5);
  const iabClamped = Math.min(iabBetrag, iabMax);
  return (
    <div className="bg-[#F8F5F0] border border-dashed border-[#1C1C1A]/20 p-7">
      <div className="flex items-baseline justify-between mb-1 gap-4 flex-wrap">
        <h3 className="font-display text-2xl flex items-center gap-2"><Receipt className="w-5 h-5 text-[#6B6961]" strokeWidth={1.5} />Mögliche Steuervorteile (B2B)</h3>
        <span className="font-body text-xs tracking-wider uppercase text-[#6B6961] bg-white px-2 py-1 border border-[#1C1C1A]/15">Optional</span>
      </div>
      <p className="font-body text-sm text-[#6B6961] mb-5 leading-relaxed">
        Als gewerblicher Käufer kannst Du u. U. Sonder-AfA, Investitionsabzugsbetrag (IAB) oder andere steuerliche Gestaltungen nutzen, um Deine effektive Belastung zu senken. Ob und in welcher Höhe das gilt, hängt von Deinem Unternehmen, Deiner Bilanzsituation und Deinen Investitionsabsichten ab.
      </p>
      <div className="bg-white border border-[#C5392E]/30 p-3 mb-5 flex gap-2 items-start">
        <Info className="w-4 h-4 text-[#C5392E] shrink-0 mt-0.5" strokeWidth={1.5} />
        <p className="font-body text-xs text-[#1C1C1A]/80 leading-relaxed">
          <span className="font-medium">Keine Steuerberatung.</span> Die folgende Modellrechnung zeigt eine Indikation auf Basis allgemeiner Annahmen. Bitte sprich vor einer Entscheidung unbedingt mit Deinem Steuerberater.
        </p>
      </div>

      <button onClick={() => setAktiv(!aktiv)}
        className={`w-full px-4 py-3 font-body text-sm border transition-colors ${aktiv ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-[#F8F5F0] font-medium' : 'border-[#1C1C1A]/15 text-[#1C1C1A] hover:border-[#D2563E]'}`}>
        {aktiv ? 'Steuervorteile-Modellrechnung aktiv' : 'Modellrechnung mit Steuervorteilen anzeigen'}
      </button>

      {aktiv && (
        <div className="mt-5 space-y-5">
          <Slider label="Unternehmenssteuer (Annahme)" value={financing.plattform.steuer} onChange={v => setFinancing(f => ({...f, plattform: {...f.plattform, steuer: v}}))} min={0.15} max={0.40} step={0.01} format={fmtPct} hint="GewSt + KSt + Soli für GmbH meist 28–32 %" />
          {/* IAB-Slider + Eingabefeld — beeinflusst nur die steuerliche Wirkung, NICHT die Finanzierungs-Rate */}
          <div>
            <div className="flex justify-between items-baseline mb-2 gap-2">
              <FieldLabel required={false} hint="Bis zu 50 % der geplanten Investition können vorab steuerlich abgezogen werden (§ 7g EStG)">Investitionsabzugsbetrag (IAB)</FieldLabel>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <input type="number" min={0} max={iabMax} step={1000}
                value={iabClamped}
                onChange={e => {
                  const v = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  setIabBetrag(Math.max(0, Math.min(iabMax, isNaN(v) ? 0 : v)));
                }}
                className="w-32 bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-display text-base text-[#7B2D8E] focus:outline-none focus:border-[#D2563E] num [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <span className="font-body text-sm text-[#6B6961]">€</span>
              <span className="font-body text-xs text-[#6B6961] ml-auto">max. 50 % · {fmtEUR(iabMax)}</span>
            </div>
            <input type="range" min={0} max={iabMax} step={1000} value={iabClamped}
              onChange={e => setIabBetrag(parseInt(e.target.value, 10))} className="w-full" />
            <p className="font-body text-[11px] text-[#6B6961] mt-2 leading-relaxed">
              Der IAB reduziert die zu versteuernde Gewinngrundlage im Anschaffungsjahr, ohne dass das Geld tatsächlich fließen muss. Effekt: einmalige Steuerersparnis im Anschaffungsjahr.
            </p>
          </div>
          <div className="pt-4 border-t border-[#1C1C1A]/10 space-y-2 font-body text-sm">
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961]">Modellhafte Belastung mit Steuervorteilen</p>
            <div className="flex justify-between"><span className="text-[#6B6961]">Plattform-Rate (vor Steuer)</span><span className="num">{fmtEUR(totals.plattformRate)}</span></div>
            <div className="flex justify-between text-[#D2563E]"><span>− Laufende Steuerentlastung (AfA + Zinsen × {fmtPct(financing.plattform.steuer)})</span><span className="num">−{fmtEUR(totals.steuerentlastung)}</span></div>
            {totals.iabEntlastungMonat > 0 && (
              <div className="flex justify-between text-[#D2563E]"><span>− IAB-Vorteil, auf {financing.plattform.laufzeit} J verteilt</span><span className="num">−{fmtEUR(totals.iabEntlastungMonat)}</span></div>
            )}
            <div className="flex justify-between font-display text-base pt-2 border-t border-[#1C1C1A]/10"><span>Mögliche Rate nach Steuer</span><span className="num text-[#D2563E]">{fmtEUR(totals.plattformRateEff)}</span></div>
            {totals.eigennutzungGewerbCount > 0 && totals.plattformRateEff > 0 && (
              <div className="flex justify-between text-[#6B6961] text-xs"><span>pro Mitarbeiter-Modul ({totals.eigennutzungGewerbCount})</span><span className="num">{fmtEUR(totals.plattformRateEff / totals.eigennutzungGewerbCount)}</span></div>
            )}
            {iabClamped > 0 && (
              <div className="mt-3 pt-3 border-t border-[#1C1C1A]/10">
                <div className="flex justify-between text-[#D2563E]">
                  <span className="font-medium">Einmalige IAB-Steuerersparnis (Anschaffungsjahr)</span>
                  <span className="num font-medium">{fmtEUR(totals.iabSteuerersparnis)}</span>
                </div>
                <p className="font-body text-[11px] text-[#6B6961] mt-1.5 italic">
                  {fmtEUR(iabClamped)} IAB × {fmtPct(financing.plattform.steuer)} = {fmtEUR(totals.iabSteuerersparnis)} einmalig. Zusätzlich auf {financing.plattform.laufzeit} Jahre verteilt senkt das die Monatsrate um {fmtEUR(totals.iabEntlastungMonat)}.
                </p>
              </div>
            )}
          </div>
          <p className="font-body text-xs text-[#6B6961] italic">Diese Werte sind Modellwerte. Bitte unbedingt mit Steuerberater abstimmen.</p>
        </div>
      )}
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
    <div className="bg-white border border-[#A87DAE]/40 p-7">
      <div className="flex items-baseline justify-between mb-1 gap-4 flex-wrap">
        <h3 className="font-display text-2xl flex items-center gap-2"><Repeat className="w-5 h-5 text-[#7B2D8E]" strokeWidth={1.5} />Laufende Neben- und Verbrauchskosten</h3>
        <span className="font-body text-xs tracking-wider uppercase text-[#7B2D8E] bg-[#7B2D8E]/10 px-2 py-1">Richtwerte</span>
      </div>
      <p className="font-body text-sm text-[#6B6961] mb-6">Geschätzte Richtwerte zur ersten Orientierung — die tatsächlichen Beträge können je nach Standort, Projektgröße, Verbrauchsverhalten und Versorgern abweichen. Konkrete Werte ermitteln wir gemeinsam mit Dir.</p>
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
          <span className="num text-[#7B2D8E]">{fmtEUR2(p.proM2Gesamt)}/m²/Mt.</span>
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
    <div className="bg-[#FBF7EF] border border-[#7B2D8E]/30 p-7">
      <div className="flex items-baseline justify-between mb-1 gap-4 flex-wrap">
        <h3 className="font-display text-2xl flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[#7B2D8E]" strokeWidth={1.5} />Einnahmen-Prognose</h3>
        <span className="font-body text-xs tracking-wider uppercase text-[#7B2D8E] bg-[#7B2D8E]/15 px-2 py-1">Vermietung</span>
      </div>
      <p className="font-body text-sm text-[#6B6961] mb-5">Unverbindliche Mietindikation auf Basis aktueller Marktbeobachtungen — die tatsächlich erzielbaren Mieten hängen von Standort, Lage, Nachfrage und Vermarktung ab und können erheblich abweichen.</p>
      <div className="mb-5 p-3 bg-white border border-[#1C1C1A]/10">
        <FieldLabel required={false}>Wer übernimmt die Vermietung?</FieldLabel>
        <div className="flex gap-2">
          <button onClick={() => setVermietungDurchCoMod(false)}
            className={`flex-1 px-3 py-2 font-body text-xs border transition-colors ${!vermietungDurchCoMod ? 'border-[#D2563E] bg-[#D2563E]/10 text-[#D2563E] ring-1 ring-[#D2563E]/30 ring-offset-1 ring-offset-white font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Selbst</button>
          <button onClick={() => setVermietungDurchCoMod(true)}
            className={`flex-1 px-3 py-2 font-body text-xs border transition-colors ${vermietungDurchCoMod ? 'border-[#7B2D8E] bg-[#7B2D8E]/10 text-[#7B2D8E] ring-1 ring-[#7B2D8E]/30 ring-offset-1 ring-offset-white font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Durch uns bewirtschaftet</button>
        </div>
        {vermietungDurchCoMod && <p className="font-body text-[11px] text-[#6B6961] mt-2">Wir übernehmen Vermarktung & Verwaltung — eine Betreiber-Fee wird von der Miete abgezogen.</p>}
      </div>
      <div className="space-y-2.5 mb-5 max-h-48 overflow-auto scrollbar-none">
        {totals.incomeItems.map(it => (
          <div key={it.kuerzel} className="flex justify-between gap-4 text-sm font-body py-2 border-b border-[#1C1C1A]/8 last:border-b-0">
            <p className="text-[#1C1C1A] leading-tight flex-1"><span className="num">{it.count}×</span> {getDisplayName(it)}</p>
            <span className="num text-[#1C1C1A] shrink-0 text-right">{fmtEUR(it.count * it.einnahmen)}</span>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-[#1C1C1A]/10 space-y-2 text-sm font-body">
        <div className="flex justify-between"><dt className="text-[#6B6961]">Bruttomieten / Monat</dt><dd className="num">{fmtEUR(totals.monthlyIncomeBrutto)}</dd></div>
        {vermietungDurchCoMod && <div className="flex justify-between text-[#6B6961]"><dt>Betreiber-Fee</dt><dd className="num">−{fmtEUR(totals.feeAbzug)}</dd></div>}
        <div className="flex justify-between font-display text-base pt-2 border-t border-[#1C1C1A]/10">
          <dt>Einnahmen netto / Mt.</dt><dd className="num text-[#7B2D8E]">{fmtEUR(totals.monthlyIncomeNetto)}</dd>
        </div>
      </div>
    </div>
  );
}

function FinancingStep({ totals, project, gewerbConfig, financing, setFinancing, ekPrivat, setEkPrivat, ekGewerb, setEkGewerb, vermietungDurchCoMod, setVermietungDurchCoMod, mitarbeiterAnzahl, setMitarbeiterAnzahl, iabBetrag, setIabBetrag, privatOptionen, setPrivatOptionen, onNext, onBack }) {
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
        <div className="mb-8 bg-[#D2563E]/5 border border-[#D2563E]/30 p-5 flex gap-3 items-start">
          <Info className="w-5 h-5 text-[#D2563E] shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="font-body text-sm text-[#1C1C1A]/80">
            <span className="text-[#1C1C1A] font-medium">Mischfinanzierung erkannt.</span> {totals.countPrivat} private und {totals.countGewerb} gewerbliche Module — beide Finanzierungswege werden parallel gezeigt. Die gewerblichen Module bieten zusätzlich Steuervorteile.
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 min-w-0 space-y-8">
          {hasPrivat && <PrivatFinanzPanel totals={totals} financing={financing} setFinancing={setFinancing} ekPrivat={ekPrivat} setEkPrivat={setEkPrivat} privatOptionen={privatOptionen} setPrivatOptionen={setPrivatOptionen} countPrivat={totals.countPrivat} />}
          {hasGewerb && <GewerblichFinanzPanel totals={totals} financing={financing} setFinancing={setFinancing} />}
          {hasGewerb && <SteuerOptionenPanel totals={totals} financing={financing} setFinancing={setFinancing} iabBetrag={iabBetrag} setIabBetrag={setIabBetrag} />}
          <NebenkostenBreakdown totals={totals} project={project} gewerbConfig={gewerbConfig} />
          <IncomeBreakdown totals={totals} vermietungDurchCoMod={vermietungDurchCoMod} setVermietungDurchCoMod={setVermietungDurchCoMod} />
        </div>

        <aside className="lg:w-96 lg:shrink-0">
          <div className="lg:sticky lg:top-24 bg-[#1C1C1A] text-[#F8F5F0] p-7">
            <p className="font-body text-xs tracking-[0.3em] uppercase opacity-50 mb-2">
              {totals.istInvestor ? 'Investmentrechnung' : (totals.hasIncome ? 'Wirtschaftlichkeit' : 'Deine Monatsrate')}
            </p>
            <h3 className="font-display text-2xl mb-7">Monatlich</h3>

            <div className="pb-5 mb-5 border-b border-[#F8F5F0]/15">
              <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-3">Finanzierung im Detail</p>
              <dl className="space-y-2 text-sm font-body">
                {hasPrivat && <>
                  <div className="flex justify-between"><dt className="opacity-70">KfW-Rate</dt><dd className="num">{fmtEUR(totals.kfwRate)}</dd></div>
                  <div className="flex justify-between"><dt className="opacity-70">GLS-Rate</dt><dd className="num">{fmtEUR(totals.glsRate)}</dd></div>
                </>}
                {hasGewerb && <>
                  <div className="flex justify-between"><dt className="opacity-70">Plattform (brutto)</dt><dd className="num">{fmtEUR(totals.plattformRate)}</dd></div>
                  {(totals.steuerentlastung > 0 || totals.iabEntlastungMonat > 0) && (
                    <div className="flex justify-between text-[#7FB069]"><dt className="opacity-90">− Steuervorteile</dt><dd className="num">−{fmtEUR(totals.steuerentlastung + totals.iabEntlastungMonat)}</dd></div>
                  )}
                </>}
              </dl>
            </div>

            {/* === BELASTUNGS-AUFTEILUNG je Kunden-Typ === */}
            {/* Variante A: Misch- oder reiner Privatkunde — Aufteilung Privat / Gewerblich */}
            {totals.hatPrivatAnteil && (
              <div className="pb-5 mb-5 border-b border-[#F8F5F0]/15">
                <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-3">Monatsrate</p>
                <dl className="space-y-2.5 text-sm font-body">
                  <div className="flex justify-between items-baseline">
                    <dt className="opacity-80">Monatsrate privat <span className="opacity-50 text-xs">(KfW + GLS)</span></dt>
                    <dd className="font-display text-lg num">{fmtEUR(totals.privatFinanzierungMonat)}</dd>
                  </div>
                  {totals.hatGewerbModule && (
                    <div className="flex justify-between items-baseline">
                      <dt className="opacity-80">Monatsrate gewerblich <span className="opacity-50 text-xs">(nach Steuer)</span></dt>
                      <dd className="font-display text-lg num">{fmtEUR(totals.gewerblichRateNachSteuer)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2.5 border-t border-[#F8F5F0]/10">
                    <dt className="font-body text-xs uppercase tracking-wider opacity-70">Summe Monatsrate</dt>
                    <dd className="font-display text-2xl num">{fmtEUR(totals.belastungFinanzierungEff)}</dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Variante B & C: rein gewerblich — eine konsolidierte Finanzierungs-Belastung */}
            {!totals.hatPrivatAnteil && totals.hatGewerbModule && (
              <div className="pb-5 mb-5 border-b border-[#F8F5F0]/15">
                <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-1 flex items-center gap-1.5">Monatsrate gewerblich <span className="opacity-70">(nach Steuer)</span></p>
                <p className="font-display text-3xl num">{fmtEUR(totals.gewerblichRateNachSteuer)}</p>
                {(totals.steuerentlastung > 0 || totals.iabEntlastungMonat > 0) && (
                  <p className="font-body text-[10px] opacity-50 mt-0.5">inkl. AfA, Zins-Abzug{totals.iabEntlastungMonat > 0 ? ' & IAB-Vorteil' : ''}</p>
                )}
              </div>
            )}

            {/* Laufende Fixkosten (Lizenz, QM, Versicherung, Instandhaltung + Pacht) — separat ausgewiesen */}
            {totals.laufendeKostenMonat > 0 && (
              <div className="pb-5 mb-5 border-b border-[#F8F5F0]/15">
                <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-1 flex items-center gap-1.5"><Repeat className="w-3 h-3" strokeWidth={2}/> Laufende Fixkosten</p>
                <p className="font-display text-xl num text-[#A87DAE]">{fmtEUR(totals.laufendeKostenMonat)}</p>
                <p className="font-body text-[10px] opacity-50 mt-0.5">Pacht, Lizenz, Quartiersmgmt, Versicherung, Instandhaltung</p>
              </div>
            )}

            {/* Verbrauchskosten als Hinweis */}
            {totals.verbrauchskostenMonat > 0 && (
              <div className="pb-5 mb-5 border-b border-[#F8F5F0]/15">
                <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-1">Verbrauchskosten <span className="opacity-50">(variabel)</span></p>
                <p className="font-display text-lg num opacity-70">ca. {fmtEUR(totals.verbrauchskostenMonat)}</p>
                <p className="font-body text-[10px] opacity-50 mt-0.5">{getContentText('tooltip_verbrauchskosten', 'Strom, Wasser, Heizung — trägt der Bewohner')}</p>
              </div>
            )}

            {/* Mieteinnahmen */}
            {totals.hasIncome && (
              <div className="pb-5 mb-5 border-b border-[#F8F5F0]/15">
                <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-1 flex items-center gap-1.5"><TrendingUp className="w-3 h-3" strokeWidth={2} /> Einnahmen / Monat</p>
                <p className="font-display text-3xl num text-[#A87DAE]">+ {fmtEUR(totals.monthlyIncomeNetto)}</p>
              </div>
            )}

            {/* Rate pro Mitarbeiter NUR bei reinem MA-Wohnen-Setup (Feedback V6) */}
            {totals.istMAWohnen && (
              <div className="pb-5 mb-5 border-b border-[#F8F5F0]/15">
                <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-1 flex items-center gap-1.5"><Users className="w-3 h-3" strokeWidth={2} /> Rate pro Mitarbeiter</p>
                <p className="font-display text-3xl num">{fmtEUR(totals.belastungProMA)}</p>
                <p className="font-body text-[10px] opacity-50 mt-0.5">
                  ÷ {totals.eigennutzungGewerbCount} {totals.eigennutzungGewerbCount === 1 ? 'eigengen. Modul' : 'eigengen. Module'}
                  {totals.iabEntlastungProMA > 0 && <> · inkl. IAB −{fmtEUR(totals.iabEntlastungProMA)}/MA</>}
                </p>
              </div>
            )}

            {/* Effektive Belastung / Cashflow — der zentrale Endwert */}
            <div className="mb-7">
              <p className="font-body text-xs uppercase tracking-wider opacity-50 mb-1">
                {totals.cashflowPositive
                  ? (totals.istInvestor ? 'Cashflow / Monat' : 'Überschuss / Monat')
                  : 'Effektive Monatsrate'}
              </p>
              <p className={`font-display text-4xl num ${totals.cashflowPositive ? 'text-[#7FB069]' : ''}`}>
                {totals.cashflowPositive ? '+' : ''}{fmtEUR(Math.abs(totals.effektiveBelastung))}
              </p>
              {totals.cashflowPositive
                ? <p className="font-body text-xs text-[#7FB069] mt-1.5 flex items-center gap-1"><Check className="w-3 h-3" strokeWidth={2.5} /> rechnerisch positiv</p>
                : <p className="font-body text-[10px] opacity-50 mt-1.5 leading-relaxed">
                    Finanzierung {totals.hatGewerbModule ? '(nach Steuer) ' : ''}+ laufende Fixkosten{totals.hasIncome ? ' − Einnahmen' : ''}
                  </p>}
            </div>

            <Button variant="inverse" onClick={onNext} className="w-full">Unverbindliches Angebot anfragen <ChevronRight className="w-4 h-4" /></Button>
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
          className="w-full px-4 py-2.5 bg-[#F8F5F0] border border-[#1C1C1A]/15 font-body text-sm focus:outline-none focus:border-[#D2563E] resize-none" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-[#F8F5F0] border border-[#1C1C1A]/15 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
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
          <p className="font-body text-base text-[#6B6961] mb-8 max-w-2xl">Hinterlasse uns Deine Kontaktdaten — wir senden Dir Dein detailliertes, unverbindliches Angebot und melden uns persönlich.</p>
          <div className="bg-[#D2563E]/5 border border-[#D2563E]/20 px-4 py-3 mb-6 flex items-center gap-2.5">
            <span className="text-[#C5392E] font-medium text-base">*</span>
            <p className="font-body text-xs text-[#6B6961]">Pflichtangaben für die Kontaktaufnahme.</p>
          </div>
          <div className="bg-white border border-[#1C1C1A]/10 p-7 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Vorname" required value={contact.vorname || ''} onChange={v => setContact(c => ({...c, vorname: v}))} />
              <Field label="Nachname" required value={contact.nachname || ''} onChange={v => setContact(c => ({...c, nachname: v}))} />
            </div>
            <Field label="E-Mail" required type="email" value={contact.email || ''} onChange={v => setContact(c => ({...c, email: v}))} />
            <Field label="Telefon" value={contact.telefon || ''} onChange={v => setContact(c => ({...c, telefon: v}))} />
            <div className="pt-2 mt-2 border-t border-[#1C1C1A]/8">
              <p className="font-body text-xs tracking-wider uppercase text-[#6B6961] mb-3">Anschrift</p>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <Field label="Straße" value={contact.strasse || ''} onChange={v => setContact(c => ({...c, strasse: v}))} />
                <div className="w-24"><Field label="Nr." value={contact.hausnr || ''} onChange={v => setContact(c => ({...c, hausnr: v}))} /></div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-3 mt-3">
                <div className="w-24"><Field label="PLZ" value={contact.plz || ''} onChange={v => setContact(c => ({...c, plz: v}))} /></div>
                <Field label="Ort" value={contact.ort || ''} onChange={v => setContact(c => ({...c, ort: v}))} />
              </div>
            </div>
            <Field label="Anmerkung" textarea value={contact.notiz || ''} onChange={v => setContact(c => ({...c, notiz: v}))} placeholder="z. B. Wunschtermin, Standortdetails, Fragen …" />
            <Button onClick={onSubmit} disabled={!isValid} className="w-full mt-4"><Mail className="w-4 h-4" /> Unverbindliches Angebot anfragen</Button>
            <p className="font-body text-xs text-[#6B6961]">Mit dem Senden willigst Du ein, dass wir Dich kontaktieren dürfen. Keine Weitergabe an Dritte.</p>
            <div className="mt-3 pt-3 border-t border-[#1C1C1A]/10">
              <p className="font-body text-[11px] text-[#6B6961] leading-relaxed">
                <span className="font-medium">Hinweis:</span> Diese Konfiguration ist eine unverbindliche Modellrechnung zur ersten Orientierung. Alle Preise, Mieten, Nebenkosten, Förderbeträge, Zinssätze und Steuervorteile sind Indikationen auf Basis aktueller Marktdaten und allgemeiner Annahmen. Sie stellen keine Zusicherung dar. Die tatsächlichen Werte können je nach Standort, Bonität, Bauausführung, Verbrauchsverhalten und gesetzlichen Rahmenbedingungen abweichen. Verbindliche Aussagen erhältst Du erst im persönlichen Angebot. Finanzierungs- und Steueraussagen ersetzen nicht die individuelle Beratung durch Bank bzw. Steuerberater.
              </p>
            </div>
          </div>
        </div>
        <aside style={{ alignSelf: 'start' }}>
          <div className="bg-[#F8F5F0] border border-[#1C1C1A]/10 p-7"
            style={{
              position: 'sticky',
              top: '6rem',
              maxHeight: 'calc(100vh - 7rem)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-2">Zusammenfassung</p>
            <h3 className="font-display text-xl mb-5">Dein Setup</h3>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-2">Typ</p>
            <p className="font-body text-sm mb-4">
              {customerType === 'privat' ? (project ? `Privat — ${project.name}` : 'Privat — eig. Grundstück') : 'Gewerblich'}
              {modulart && ` · ${modulart === 'privat' ? 'Wohnen' : modulart === 'business' ? 'Business' : 'Beides'}`}
            </p>
            {gewerbConfig && gewerbConfig.flaecheStatus !== 'ja' && totals.mindestflaeche && (
              <p className="font-body text-xs text-[#7B2D8E] mb-4">Mindestflächenbedarf: {fmtNum(totals.mindestflaeche.mindestGrundstueck)} m²</p>
            )}
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-2">Module ({totals.countTotal})</p>
            <ul className="space-y-1 mb-5 text-sm font-body max-h-40 overflow-auto scrollbar-none">
              {totals.lineItems.map(it => (
                <li key={it.kuerzel} className="flex justify-between gap-3">
                  <span><span className="num">{it.count}×</span> <span className="text-[#6B6961]">{getDisplayName(it)}</span>
                    {it.mode === 'einnahmen' && it.einnahmen > 0 && <span className="text-[10px] text-[#7B2D8E] ml-1 tracking-wider uppercase">v</span>}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2.5 text-sm font-body pt-4 border-t border-[#1C1C1A]/10">
              <div className="flex justify-between"><dt className="text-[#6B6961]">Anschaffung brutto</dt><dd className="num">{fmtEUR(totals.bruttoGesamt)}</dd></div>
              {(project || gewerbConfig) && <div className="flex justify-between"><dt className="text-[#6B6961]">Projektkosten einm.</dt><dd className="num">{fmtEUR(totals.einmaligGesamtBrutto)}</dd></div>}
              <div className="flex justify-between"><dt className="text-[#6B6961]">Anzahlung</dt><dd className="num">{fmtEUR(totals.anzahlung)}</dd></div>
              <div className="flex justify-between pt-2 border-t border-[#1C1C1A]/10"><dt className="text-[#6B6961]">Finanzierung/Mt.</dt><dd className="num">{fmtEUR(totals.finanzierungMonat)}</dd></div>
              {(project || gewerbConfig) && <div className="flex justify-between text-[#7B2D8E]"><dt>Nebenkosten/Mt.</dt><dd className="num">{fmtEUR(totals.nebenkostenMonatGesamt)}</dd></div>}
              <div className="flex justify-between font-body"><dt className="text-[#1C1C1A]">Belastung/Mt.</dt><dd className="num">{fmtEUR(totals.monatlichGesamt)}</dd></div>
              {totals.hasIncome && (
                <>
                  <div className="flex justify-between text-[#7B2D8E]"><dt>Einnahmen/Mt.</dt><dd className="num">+{fmtEUR(totals.monthlyIncomeNetto)}</dd></div>
                  <div className={`flex justify-between font-display text-base pt-2 border-t border-[#1C1C1A]/10 ${totals.cashflowPositive ? 'text-[#D2563E]' : ''}`}>
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
      <div className="w-16 h-16 rounded-full bg-[#D2563E] flex items-center justify-center mx-auto mb-8">
        <Check className="w-7 h-7 text-[#F8F5F0]" strokeWidth={1.5} />
      </div>
      <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-4">Unverbindliche Angebotsanfrage eingegangen</p>
      <h1 className="font-display text-5xl md:text-6xl leading-tight tracking-tight mb-6">Danke, <em>{lead?.contact?.vorname}</em><span className="opacity-40"> …</span></h1>
      <p className="font-body text-lg text-[#6B6961] mb-10 max-w-xl mx-auto leading-relaxed">Wir haben Deine Anfrage erhalten und melden uns innerhalb von 1–2 Werktagen mit einem detaillierten, unverbindlichen Angebot.</p>
      <div className="bg-white border border-[#1C1C1A]/10 p-6 inline-flex items-center gap-3 font-body text-sm text-[#6B6961] mb-10">
        <Sparkles className="w-4 h-4 text-[#7B2D8E]" strokeWidth={1.5} />
        Im Live-System würden jetzt automatisch E-Mail + Pipedrive-Eintrag erstellt.
      </div>
      <div><Button onClick={onRestart} variant="secondary">Neue Konfiguration starten</Button></div>
    </div>
  );
}

/* ============================================================================
   ADMIN-BEREICH (Auth + Lead-Verwaltung aus DB)
   ============================================================================ */

const LEAD_STATUS_LABELS = {
  neu:         { label: 'Neu',         color: '#D2563E', bg: '#FBEDE7' },
  kontaktiert: { label: 'Kontaktiert', color: '#7B2D8E', bg: '#F4ECF6' },
  angeboten:   { label: 'Angeboten',   color: '#C9A876', bg: '#FBF5E8' },
  gewonnen:    { label: 'Gewonnen',    color: '#7FB069', bg: '#EFF7EA' },
  verloren:    { label: 'Verloren',    color: '#6B6961', bg: '#F0EFEC' },
  archiviert:  { label: 'Archiv',      color: '#6B6961', bg: '#F0EFEC' },
};

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }
  return (
    <div className="max-w-md mx-auto px-8 py-20">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-3">Admin-Bereich</p>
      <h1 className="font-display text-4xl tracking-tight mb-8">Login</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-[#1C1C1A]/10 p-8 space-y-4">
        <div>
          <label className="font-body text-xs tracking-wider uppercase text-[#6B6961] block mb-1">E-Mail</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-3 py-2 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
        </div>
        <div>
          <label className="font-body text-xs tracking-wider uppercase text-[#6B6961] block mb-1">Passwort</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-3 py-2 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
        </div>
        {error && <p className="text-sm text-[#C5392E] font-body">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Bitte warten …' : 'Anmelden'} <ChevronRight className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}

function AdminLeadDetail({ lead, onClose, onUpdate }) {
  const [status, setStatus] = useState(lead.status);
  const [internalNotes, setInternalNotes] = useState(lead.internal_notes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true); setSaved(false);
    const { error } = await supabase.from('leads').update({
      status, internal_notes: internalNotes
    }).eq('id', lead.id);
    if (!error) { setSaved(true); onUpdate({ ...lead, status, internal_notes: internalNotes }); setTimeout(() => setSaved(false), 2000); }
    else { alert('Fehler beim Speichern: ' + error.message); }
    setSaving(false);
  }

  const modulesArr = lead.modules_snapshot?.items || [];
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 sm:py-10" onClick={onClose}>
      <div
        className="bg-white max-w-4xl w-full"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto', overflowX: 'hidden' }}>
        <div className="flex items-start justify-between p-8 border-b border-[#1C1C1A]/10">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-2">Lead</p>
            <h2 className="font-display text-3xl tracking-tight">{lead.vorname} {lead.nachname}</h2>
            <p className="font-body text-sm text-[#6B6961] mt-1">{lead.email} {lead.telefon ? '· ' + lead.telefon : ''}</p>
            {lead.firma && <p className="font-body text-sm text-[#6B6961]">{lead.firma}</p>}
            <p className="font-body text-xs text-[#6B6961] mt-3">{new Date(lead.created_at).toLocaleString('de-DE', { dateStyle: 'long', timeStyle: 'short' })}</p>
          </div>
          <button onClick={onClose} className="text-[#6B6961] hover:text-[#1C1C1A] p-2"><Plus className="w-5 h-5 rotate-45" /></button>
        </div>
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-2">Konfiguration</p>
            <div className="bg-[#F8F5F0] p-4 space-y-2 font-body text-sm">
              <p><span className="text-[#6B6961]">Typ:</span> {lead.customer_type === 'privat' ? 'Privat' : 'Gewerblich'}{lead.privat_mode ? ` · ${lead.privat_mode === 'projekt' ? 'Projekt-Beitritt' : 'Eigenes Grundstück'}` : ''}</p>
              {(lead.project?.name || lead.finanzen_snapshot?.project_name) && (
                <p><span className="text-[#6B6961]">Projekt:</span> <span className="text-[#7B2D8E]">{lead.project?.name || lead.finanzen_snapshot?.project_name}{(lead.project?.location || lead.finanzen_snapshot?.project_location) ? ` (${lead.project?.location || lead.finanzen_snapshot?.project_location})` : ''}</span></p>
              )}
              <p><span className="text-[#6B6961]">Module gesamt:</span> <span className="num">{lead.modulanzahl_gesamt}</span></p>
              <p><span className="text-[#6B6961]">NUF:</span> <span className="num">{Number(lead.nuf_gesamt || 0).toFixed(1)} m²</span></p>
              <div className="pt-2 mt-2 border-t border-[#1C1C1A]/10 space-y-1">
                {modulesArr.map((it, i) => (
                  <div key={i} className="text-xs"><span className="num">{it.count}×</span> {it.kuerzel}</div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-2">Finanzen</p>
            <div className="bg-[#F8F5F0] p-4 space-y-2 font-body text-sm">
              <p><span className="text-[#6B6961]">Investmentsumme brutto:</span> <span className="font-display num">{fmtEUR(lead.einmalig_gesamt || 0)}</span></p>
              <p><span className="text-[#6B6961]">Monatsrate gesamt:</span> <span className="num">{fmtEUR(lead.monatlich_gesamt || 0)}</span></p>
              {lead.einnahmen_monat > 0 && <p><span className="text-[#6B6961]">Einnahmen / Monat:</span> <span className="num text-[#7FB069]">{fmtEUR(lead.einnahmen_monat)}</span></p>}
              {lead.angewandter_rabatt_pct > 0 && <p><span className="text-[#6B6961]">Rabatt:</span> <span className="num">{(lead.angewandter_rabatt_pct * 100).toFixed(1)} %</span></p>}
            </div>
          </div>
        </div>
        {lead.notiz && (
          <div className="px-8 pb-4">
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-2">Notiz vom Kunden</p>
            <div className="bg-[#FBF7EF] p-4 font-body text-sm whitespace-pre-wrap">{lead.notiz}</div>
          </div>
        )}

        {/* Finanzierungs-Details (alle Kunden-Eingaben für Nachvollziehbarkeit) */}
        {(() => {
          const fin = lead.finanzen_snapshot || {};
          const fp = fin.financingParams || {};
          const mod = lead.modules_snapshot || {};
          // Pfad-Erkennung: rein privat / rein gewerblich / gemischt
          const hasPrivatLead = (mod.countPrivat ?? 0) > 0;
          const hasGewerbLead = (mod.countGewerb ?? 0) > 0;
          const hasFinDetails = (fin.ekPrivat > 0 || fin.ekGewerb > 0 || fin.iabBetrag != null || fp.kfw || fp.gls || fp.plattform);
          if (!hasFinDetails) return null;
          return (
            <div className="px-8 pb-4">
              <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-2">Finanzierungs-Eingaben des Kunden</p>
              <div className="bg-[#F8F5F0] p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 font-body text-xs">
                {fin.ekPrivat > 0 && hasPrivatLead && (
                  <p><span className="text-[#6B6961]">Eigenkapital privat:</span> <span className="num text-[#1C1C1A]">{fmtEUR(fin.ekPrivat)}</span></p>
                )}
                {fin.ekGewerb > 0 && hasGewerbLead && (
                  <p><span className="text-[#6B6961]">Eigenkapital gewerblich:</span> <span className="num text-[#1C1C1A]">{fmtEUR(fin.ekGewerb)}</span></p>
                )}
                {fp.kfw && hasPrivatLead && (
                  <>
                    <p><span className="text-[#6B6961]">KfW Zins:</span> <span className="num">{(fp.kfw.zins * 100).toFixed(2)} %</span></p>
                    <p><span className="text-[#6B6961]">KfW Laufzeit:</span> <span className="num">{fp.kfw.laufzeit} Jahre</span></p>
                    <p><span className="text-[#6B6961]">KfW Tilgungsnachlass:</span> <span className="num">{(fp.kfw.tilgungsnachlass * 100).toFixed(0)} %</span></p>
                  </>
                )}
                {fp.gls && hasPrivatLead && (
                  <>
                    <p><span className="text-[#6B6961]">GLS Zins:</span> <span className="num">{(fp.gls.zins * 100).toFixed(2)} %</span></p>
                    <p><span className="text-[#6B6961]">GLS Laufzeit:</span> <span className="num">{fp.gls.laufzeit} Jahre</span></p>
                  </>
                )}
                {fp.plattform && hasGewerbLead && (
                  <>
                    <p><span className="text-[#6B6961]">Plattform Zins:</span> <span className="num">{(fp.plattform.zins * 100).toFixed(2)} %</span></p>
                    <p><span className="text-[#6B6961]">Plattform Laufzeit:</span> <span className="num">{fp.plattform.laufzeit} Jahre</span></p>
                    <p><span className="text-[#6B6961]">Restwert:</span> <span className="num">{(fp.plattform.restwertPct * 100).toFixed(0)} %</span></p>
                    {fp.plattform.afaJahre > 0 && (
                      <p><span className="text-[#6B6961]">AfA-Dauer:</span> <span className="num">{fp.plattform.afaJahre} Jahre</span></p>
                    )}
                    {fp.plattform.steuer > 0 && (
                      <p><span className="text-[#6B6961]">Steuerlast (Annahme):</span> <span className="num">{(fp.plattform.steuer * 100).toFixed(0)} %</span></p>
                    )}
                  </>
                )}
                {fin.iabBetrag != null && fin.iabBetrag > 0 && hasGewerbLead && (
                  <p><span className="text-[#6B6961]">IAB beantragt:</span> <span className="num text-[#7B2D8E]">{fmtEUR(fin.iabBetrag)}</span></p>
                )}
                {fin.anzahlung != null && (
                  <p><span className="text-[#6B6961]">Anzahlung:</span> <span className="num">{fmtEUR(fin.anzahlung)}</span></p>
                )}
                {fin.vermietungDurchUns && (
                  <p className="sm:col-span-2 lg:col-span-3 text-[#7B2D8E]">↗ Vermietung durch CoMod</p>
                )}
              </div>
            </div>
          );
        })()}

        {/* Einmalige Posten — Detail-Snapshot aller Pflicht-, Optionen- und Planungs-Kosten */}
        {(() => {
          const detail = lead.finanzen_snapshot?.einmaligDetail;
          if (!detail?.posten?.length) return null;
          const pflicht = detail.posten.filter(p => p.typ === 'pflicht' && !['arch', 'eing', 'pm'].includes(p.id));
          const optionen = detail.posten.filter(p => p.typ === 'option' || p.typ === 'schaetzung');
          const planung = detail.posten.filter(p => p.typ === 'planung' || ['arch', 'eing', 'pm'].includes(p.id));
          return (
            <div className="px-8 pb-4">
              <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-2">Einmalige Posten — Detail</p>
              <div className="bg-[#F8F5F0] p-4 space-y-3 font-body text-xs">
                {pflicht.length > 0 && (
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-wider text-[#6B6961] mb-1.5">Modul-Pflichtkosten</p>
                    <div className="space-y-1">
                      {pflicht.map(p => (
                        <div key={p.id} className="flex justify-between">
                          <span className="text-[#1C1C1A]">{p.label}{p.detail && <span className="text-[#6B6961] italic ml-1.5">({p.detail})</span>}</span>
                          <span className="num text-[#1C1C1A]">{fmtEUR(p.brutto)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {optionen.length > 0 && (
                  <div className="pt-2 border-t border-[#1C1C1A]/8">
                    <p className="font-body text-[10px] uppercase tracking-wider text-[#6B6961] mb-1.5">Optionen / Grundstück</p>
                    <div className="space-y-1">
                      {optionen.map(p => (
                        <div key={p.id} className="flex justify-between">
                          <span className="text-[#1C1C1A]">
                            {p.label}
                            {p.typ === 'schaetzung' && <span className="text-[#6B6961] italic ml-1.5">(Schätzung)</span>}
                            {p.detail && <span className="text-[#6B6961] italic ml-1.5">({p.detail})</span>}
                          </span>
                          <span className="num text-[#1C1C1A]">{fmtEUR(p.brutto)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {planung.length > 0 && (
                  <div className="pt-2 border-t border-[#1C1C1A]/8">
                    <p className="font-body text-[10px] uppercase tracking-wider text-[#6B6961] mb-1.5">Planung &amp; Bauleitung</p>
                    <div className="space-y-1">
                      {planung.map(p => (
                        <div key={p.id} className="flex justify-between">
                          <span className="text-[#1C1C1A]">{p.label}</span>
                          <span className="num text-[#1C1C1A]">{fmtEUR(p.brutto)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-[#1C1C1A]/15 flex justify-between font-display">
                  <span className="text-[#1C1C1A]">Summe einmalig</span>
                  <span className="num text-[#1C1C1A]">{fmtEUR(detail.summeBrutto)}</span>
                </div>
              </div>
            </div>
          );
        })()}
        <div className="grid md:grid-cols-2 gap-8 p-8 border-t border-[#1C1C1A]/10">
          <div>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Status</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(LEAD_STATUS_LABELS).map(([key, meta]) => (
                <button key={key} onClick={() => setStatus(key)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-body border transition-colors ${status === key ? 'border-[#1C1C1A] text-[#1C1C1A]' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:border-[#1C1C1A]/40'}`}
                  style={status === key ? { background: meta.bg, color: meta.color, borderColor: meta.color } : {}}>
                  {meta.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Interne Notizen</p>
            <textarea value={internalNotes} onChange={e => setInternalNotes(e.target.value)}
              rows={4} placeholder="Eigene Notizen — nur intern sichtbar"
              className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 p-3 font-body text-sm focus:outline-none focus:border-[#D2563E] resize-y" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-[#1C1C1A]/10 bg-[#F8F5F0]">
          {saved && <span className="font-body text-xs text-[#7FB069] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Gespeichert</span>}
          <button onClick={onClose} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-4 py-2">Abbrechen</button>
          <Button onClick={save} disabled={saving} className="">{saving ? 'Speichere …' : 'Speichern'}</Button>
        </div>
      </div>
    </div>
  );
}

function AdminLeadsView({ authUser, authProfile }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | '7d' | '30d'
  const [selectedLead, setSelectedLead] = useState(null);

  async function loadLeads() {
    setLoading(true); setError(null);
    // Join mit projects um Namen mitzuladen — ohne Match einfach null
    let query = supabase.from('leads')
      .select('*, project:projects(name, location, slug)')
      .order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) setError(error.message);
    else setLeads(data || []);
    setLoading(false);
  }

  useEffect(() => { loadLeads(); }, []);

  // Client-seitige Filterung (DB-Anzahl ist klein, das reicht)
  const filteredLeads = useMemo(() => {
    let list = leads;
    if (statusFilter !== 'all') list = list.filter(l => l.status === statusFilter);
    if (dateFilter !== 'all') {
      const days = dateFilter === '7d' ? 7 : 30;
      const cutoff = Date.now() - days * 86400000;
      list = list.filter(l => new Date(l.created_at).getTime() >= cutoff);
    }
    return list;
  }, [leads, statusFilter, dateFilter]);

  return (
    <div>
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl tracking-tight mb-2">Leads</h1>
          <p className="font-body text-sm text-[#6B6961]">
            {filteredLeads.length} von {leads.length} {leads.length === 1 ? 'Lead' : 'Leads'}
          </p>
        </div>
        <button onClick={loadLeads} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-3 py-2 border border-[#1C1C1A]/10 hover:border-[#1C1C1A]/30">Neu laden</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="font-body text-xs uppercase tracking-wider text-[#6B6961]">Status:</span>
          <button onClick={() => setStatusFilter('all')} className={`px-3 py-1 text-xs font-body uppercase tracking-wider border ${statusFilter === 'all' ? 'border-[#1C1C1A] text-[#1C1C1A]' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:border-[#1C1C1A]/30'}`}>Alle</button>
          {Object.entries(LEAD_STATUS_LABELS).map(([key, meta]) => (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`px-3 py-1 text-xs font-body uppercase tracking-wider border ${statusFilter === key ? 'border-current' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:border-[#1C1C1A]/30'}`}
              style={statusFilter === key ? { color: meta.color, borderColor: meta.color, background: meta.bg } : {}}>
              {meta.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="font-body text-xs uppercase tracking-wider text-[#6B6961]">Zeitraum:</span>
          <button onClick={() => setDateFilter('all')} className={`px-3 py-1 text-xs font-body uppercase tracking-wider border ${dateFilter === 'all' ? 'border-[#1C1C1A] text-[#1C1C1A]' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>Alle</button>
          <button onClick={() => setDateFilter('30d')} className={`px-3 py-1 text-xs font-body uppercase tracking-wider border ${dateFilter === '30d' ? 'border-[#1C1C1A] text-[#1C1C1A]' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>30 Tage</button>
          <button onClick={() => setDateFilter('7d')} className={`px-3 py-1 text-xs font-body uppercase tracking-wider border ${dateFilter === '7d' ? 'border-[#1C1C1A] text-[#1C1C1A]' : 'border-[#1C1C1A]/15 text-[#6B6961]'}`}>7 Tage</button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center font-body text-sm text-[#6B6961]">Lade Leads aus Datenbank …</div>
      ) : error ? (
        <div className="bg-white border border-[#C5392E]/30 p-8">
          <p className="font-body text-sm text-[#C5392E]">Fehler beim Laden: {error}</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center">
          <p className="font-display text-xl text-[#6B6961] mb-2">Keine Leads mit diesen Filtern{leads.length > 0 ? '' : ' vorhanden'}<span className="opacity-50"> …</span></p>
          {leads.length === 0 && <p className="font-body text-sm text-[#6B6961]">Wechsel zum Konfigurator und sende eine Test-Anfrage.</p>}
        </div>
      ) : (
        <div className="bg-white border border-[#1C1C1A]/10 overflow-x-auto">
          <div className="min-w-[1050px]">
            <div className="grid grid-cols-[1.4fr_1fr_2fr_0.5fr_1fr_1fr] gap-4 px-6 py-4 border-b border-[#1C1C1A]/10 font-body text-xs tracking-wider uppercase text-[#6B6961]">
              <div>Kontakt</div><div>Status</div><div>Setup</div><div className="text-right">Mod.</div><div className="text-right">Brutto</div><div className="text-right">Rate</div>
            </div>
            {filteredLeads.map(lead => {
              const meta = LEAD_STATUS_LABELS[lead.status] || LEAD_STATUS_LABELS.neu;
              const items = lead.modules_snapshot?.items || [];
              return (
                <button key={lead.id} onClick={() => setSelectedLead(lead)}
                  className="w-full text-left grid grid-cols-[1.4fr_1fr_2fr_0.5fr_1fr_1fr] gap-4 px-6 py-5 border-b border-[#1C1C1A]/5 last:border-b-0 font-body text-sm items-start hover:bg-[#F8F5F0]/50 transition-colors">
                  <div>
                    <p className="text-[#1C1C1A]">{lead.vorname} {lead.nachname}</p>
                    <p className="text-xs text-[#6B6961] mt-0.5">{lead.email}</p>
                    <p className="text-xs text-[#6B6961] mt-2">{new Date(lead.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 text-xs tracking-wider uppercase border" style={{ color: meta.color, borderColor: meta.color, background: meta.bg }}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="text-xs text-[#6B6961] leading-relaxed">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="inline-block px-2 py-0.5 text-[10px] tracking-wider uppercase bg-[#F8F5F0] border border-[#1C1C1A]/10">{lead.customer_type === 'privat' ? 'Privat' : 'Gewerbe'}</span>
                      {lead.project?.name && (
                        <span className="text-[11px] text-[#7B2D8E] tracking-wide">{lead.project.name}{lead.project.location ? `, ${lead.project.location}` : ''}</span>
                      )}
                    </div>
                    {items.slice(0, 3).map(it => (
                      <div key={it.kuerzel} className="mt-1"><span className="num text-[#1C1C1A]">{it.count}×</span> {it.kuerzel}</div>
                    ))}
                    {items.length > 3 && <div className="mt-1 text-[#7B2D8E]">… und {items.length - 3} weitere</div>}
                  </div>
                  <div className="text-right num">{lead.modulanzahl_gesamt}</div>
                  <div className="text-right num">{fmtEUR(lead.einmalig_gesamt || 0)}</div>
                  <div className="text-right num font-display">{fmtEUR(lead.monatlich_gesamt || 0)}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedLead && <AdminLeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={updated => {
        setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
        setSelectedLead(updated);
      }} />}
    </div>
  );
}

/* ============================================================================
   ADMIN-MODULE: Liste + Edit-Modal
   ============================================================================ */

const MODULE_CATEGORIES = [
  { key: 'wohnen',     label: 'Wohnen' },
  { key: 'arbeit',     label: 'Arbeit' },
  { key: 'erlebnis',   label: 'Erlebnis' },
  { key: 'ergaenzung', label: 'Ergänzung' },
];
const MODULE_USAGE = [
  { key: 'p',      label: 'Privat' },
  { key: 'g',      label: 'Gewerblich' },
  { key: 'beides', label: 'Beides' },
];

function AdminModuleEdit({ module, workspaces, authProfile, onClose, onSaved }) {
  // Neu-anlegen: module ist null → leerer Default
  const isNew = !module;
  const [form, setForm] = useState(() => ({
    kuerzel: '',
    display_name: '',
    family: '',
    category: 'wohnen',
    usage: 'g',
    beschreibung_de: '',
    beschreibung_en: '',
    icon_path: '',
    breite_korpus_cm: 350,
    laenge_korpus_cm: 700,
    hoehe_cm: 320,
    is_kombimodul: false,
    grundmodul_count: 1,
    kombi_richtung: 'einzel',
    nuf: null,
    bgf: null,
    footprint_m2: null,
    groesse_label: null,
    geschosse: 1,
    herst_preis: 0,
    marge: 0.15,
    einnahmen_indikation: null,
    fee: null,
    kueche: null,
    moebliert: null,
    is_durchlaufposten: false,
    is_active: true,
    sort_order: 0,
    ...(module || {}),
  }));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // String-Buffer für Prozent-Felder, damit "15,5" oder "15." flüssig getippt werden kann
  // (DB hält 0.155, UI zeigt 15,5). Beim Save in form-Werte zurückkonvertiert.
  const pctToStr = (v) => (v == null || v === '' || isNaN(v)) ? '' : String(+(v * 100).toFixed(4)).replace('.', ',');
  const strToPct = (s) => {
    if (s == null || s === '') return null;
    const cleaned = String(s).replace(',', '.').trim();
    const n = Number(cleaned);
    return isNaN(n) ? null : n / 100;
  };
  const [margeStr, setMargeStr] = useState(() => pctToStr(form.marge));
  const [feeStr,   setFeeStr]   = useState(() => pctToStr(form.fee));

  // Modul-Sichtbarkeit: Welche Workspaces haben dieses Modul ausgeblendet?
  // Set von workspace-IDs. Wird beim Mount geladen (nur wenn Modul existiert) und beim Save gespeichert.
  const [hiddenInWorkspaces, setHiddenInWorkspaces] = useState(new Set());
  const [hiddenInWorkspacesOrig, setHiddenInWorkspacesOrig] = useState(new Set());
  useEffect(() => {
    if (!module?.id) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('module_visibility')
        .select('scope_id')
        .eq('module_id', module.id)
        .eq('scope_type', 'workspace')
        .eq('hidden', true);
      if (cancelled) return;
      const set = new Set((data || []).map(r => r.scope_id));
      setHiddenInWorkspaces(set);
      setHiddenInWorkspacesOrig(new Set(set));
    })();
    return () => { cancelled = true; };
  }, [module?.id]);

  function toggleWorkspaceHidden(workspaceId) {
    setHiddenInWorkspaces(prev => {
      const next = new Set(prev);
      if (next.has(workspaceId)) next.delete(workspaceId);
      else next.add(workspaceId);
      return next;
    });
  }

  const update = (key) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked
            : e.target.type === 'number' ? (e.target.value === '' ? null : Number(e.target.value))
            : e.target.value === '' ? null : e.target.value;
    setForm(f => ({ ...f, [key]: v }));
  };

  async function save() {
    setSaving(true); setError(null); setSaved(false);
    // Prozent-Strings in numerische Werte zurück (DB-Format 0.15)
    const margeNum = strToPct(margeStr);
    const feeNum   = strToPct(feeStr);
    const { id, created_at, updated_at, deleted_at, ...rest } = form;
    const payload = { ...rest, marge: margeNum, fee: feeNum };
    let res;
    if (isNew) {
      res = await supabase.from('modules').insert(payload).select('*').single();
    } else {
      res = await supabase.from('modules').update(payload).eq('id', module.id).select('*').single();
    }
    if (res.error) { setError(res.error.message); setSaving(false); return; }

    // Modul-Sichtbarkeit: Diff zwischen orig und current state
    const moduleId = res.data.id;
    const toAdd = [...hiddenInWorkspaces].filter(ws => !hiddenInWorkspacesOrig.has(ws));
    const toRemove = [...hiddenInWorkspacesOrig].filter(ws => !hiddenInWorkspaces.has(ws));
    if (toAdd.length > 0) {
      const inserts = toAdd.map(ws => ({ module_id: moduleId, scope_type: 'workspace', scope_id: ws, hidden: true }));
      const { error: e } = await supabase.from('module_visibility').insert(inserts);
      if (e) { setError('Sichtbarkeit speichern fehlgeschlagen: ' + e.message); setSaving(false); return; }
    }
    if (toRemove.length > 0) {
      const { error: e } = await supabase.from('module_visibility')
        .delete()
        .eq('module_id', moduleId)
        .eq('scope_type', 'workspace')
        .in('scope_id', toRemove);
      if (e) { setError('Sichtbarkeit löschen fehlgeschlagen: ' + e.message); setSaving(false); return; }
    }
    setHiddenInWorkspacesOrig(new Set(hiddenInWorkspaces));

    setSaved(true); setSaving(false);
    setTimeout(() => { onSaved(res.data); }, 600);
  }

  // CSS-Klasse für Felder ohne Spinner-Pfeile (Preise + Prozente):
  // appearance:none plus Vendor-Prefixes für Chrome/Safari
  const NO_SPINNER = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0';

  // Input-Felder werden inline gerendert. Eine Sub-Component innerhalb von AdminModuleEdit
  // würde bei jedem Render neu erzeugt → Inputs verlieren den Fokus beim Tippen.

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 sm:py-8" onClick={onClose}>
      <div
        className="bg-white max-w-5xl w-full"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto', overflowX: 'hidden' }}>
        <div className="flex items-start justify-between p-8 border-b border-[#1C1C1A]/10">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-2">{isNew ? 'Neues Modul' : 'Modul bearbeiten'}</p>
            <h2 className="font-display text-3xl tracking-tight">{form.display_name || form.kuerzel || 'Neu'}</h2>
          </div>
          <button onClick={onClose} className="text-[#6B6961] hover:text-[#1C1C1A] p-2"><Plus className="w-5 h-5 rotate-45" /></button>
        </div>

        <div className="p-8 space-y-7">
          <section>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Identifikation</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Kürzel (intern, eindeutig)</label>
                <input type="text" value={form.kuerzel ?? ''} onChange={update('kuerzel')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              <p className="font-body text-[10px] text-[#6B6961] mt-0.5">z. B. 'CoMod Stay (LK,D,M)'</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Anzeigename</label>
                <input type="text" value={form.display_name ?? ''} onChange={update('display_name')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Family</label>
                <input type="text" value={form.family ?? ''} onChange={update('family')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              <p className="font-body text-[10px] text-[#6B6961] mt-0.5">z. B. 'stay', 'live', 'home'</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Kategorie</label>
                <select value={form.category} onChange={update('category')} className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]">
                  {MODULE_CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Nutzung</label>
                <select value={form.usage} onChange={update('usage')} className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]">
                  {MODULE_USAGE.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Größen-Label</label>
                <input type="number" value={form.groesse_label ?? ''} onChange={update('groesse_label')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              <p className="font-body text-[10px] text-[#6B6961] mt-0.5">z. B. 32 für 'Stay 32'</p>
              </div>
            </div>
          </section>

          <section>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Beschreibung & Icon</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Beschreibung (DE)</label>
                <textarea value={form.beschreibung_de ?? ''} onChange={update('beschreibung_de')} rows={2}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Beschreibung (EN)</label>
                <textarea value={form.beschreibung_en ?? ''} onChange={update('beschreibung_en')} rows={2}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Icon-Pfad</label>
                <input type="text" value={form.icon_path ?? ''} onChange={update('icon_path')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">z. B. '/icons/comod_stay_lkdm.png'</p>
              </div>
            </div>
          </section>

          <section>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Geometrie</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Breite Korpus (cm)</label>
                <input type="number" value={form.breite_korpus_cm ?? ''} onChange={update('breite_korpus_cm')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Länge Korpus (cm)</label>
                <input type="number" value={form.laenge_korpus_cm ?? ''} onChange={update('laenge_korpus_cm')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Höhe (cm)</label>
                <input type="number" value={form.hoehe_cm ?? ''} onChange={update('hoehe_cm')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">NUF (m²)</label>
                <input type="number" value={form.nuf ?? ''} onChange={update('nuf')} step="0.01"
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">BGF (m²)</label>
                <input type="number" value={form.bgf ?? ''} onChange={update('bgf')} step="0.01"
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">Bei Stapelung: Gesamt-BGF über alle Geschosse</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Footprint (m²)</label>
                <input type="number" value={form.footprint_m2 ?? ''} onChange={update('footprint_m2')} step="0.01"
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">EG-Grundfläche für Stellplatz. Bei 1-geschossigen Modulen = BGF</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Anzahl Geschosse</label>
                <input type="number" min="1" max="5" value={form.geschosse ?? 1} onChange={update('geschosse')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">Standard 1, für Stack/Stapelung &gt; 1</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_kombi" checked={form.is_kombimodul} onChange={update('is_kombimodul')} />
                <label htmlFor="is_kombi" className="font-body text-sm">Kombi-Modul</label>
              </div>
              {form.is_kombimodul && <>
                <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Grundmodul-Anzahl</label>
                <input type="number" value={form.grundmodul_count ?? ''} onChange={update('grundmodul_count')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
                <div>
                  <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Kombi-Richtung</label>
                  <select value={form.kombi_richtung ?? 'laengs'} onChange={update('kombi_richtung')} className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm">
                    <option value="laengs">Längs</option>
                    <option value="stirn">Stirn</option>
                    <option value="einzel">Einzel</option>
                  </select>
                </div>
              </>}
            </div>
          </section>

          <section>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Preise</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Herstellpreis (€)</label>
                <input type="number" value={form.herst_preis ?? ''} onChange={update('herst_preis')}
                  className={`w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] ${NO_SPINNER}`} />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Marge (%)</label>
                <input type="text" inputMode="decimal" value={margeStr} onChange={e => setMargeStr(e.target.value)}
                  placeholder="z. B. 15 oder 15,5"
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Einnahmen-Indikation (€/Mt)</label>
                <input type="number" value={form.einnahmen_indikation ?? ''} onChange={update('einnahmen_indikation')}
                  className={`w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] ${NO_SPINNER}`} />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Fee (%)</label>
                <input type="text" inputMode="decimal" value={feeStr} onChange={e => setFeeStr(e.target.value)}
                  placeholder="z. B. 15 oder 15,5"
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
            </div>
          </section>

          <section>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Eigenschaften & Status</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Küche</label>
                <select value={form.kueche ?? ''} onChange={update('kueche')} className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm">
                  <option value="">— keine —</option>
                  <option value="L-Küche">L-Küche</option>
                  <option value="Pantry">Pantry</option>
                  <option value="U-Küche">U-Küche</option>
                  <option value="Ohne Küche">Ohne Küche</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="moebliert" checked={!!form.moebliert} onChange={update('moebliert')} />
                <label htmlFor="moebliert" className="font-body text-sm">möbliert</label>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="durchlauf" checked={form.is_durchlaufposten} onChange={update('is_durchlaufposten')} />
                <label htmlFor="durchlauf" className="font-body text-sm">Durchlaufposten (Pool)</label>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Sortier-Reihenfolge</label>
                <input type="number" value={form.sort_order ?? ''} onChange={update('sort_order')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="active" checked={form.is_active} onChange={update('is_active')} />
                <label htmlFor="active" className="font-body text-sm">Aktiv (im Konfigurator sichtbar)</label>
              </div>
            </div>
          </section>

          {/* Sichtbarkeit pro Workspace — nur für Master-Admin und nur bei bestehenden Modulen */}
          {authProfile?.role === 'master_admin' && !isNew && (
            <section className="border-l-4 border-[#7B2D8E]/30 pl-4 -ml-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-xs uppercase tracking-wider text-[#7B2D8E]">Sichtbarkeit pro Workspace</p>
                <p className="font-body text-[10px] text-[#6B6961]">Global aktive Module für einzelne Partner ausblenden</p>
              </div>
              {workspaces.length === 0 ? (
                <div className="bg-[#F4ECF6]/30 p-4 font-body text-xs text-[#6B6961]">
                  Aktuell keine Partner-Workspaces angelegt. Wenn Partner-Makler-Workspaces eingerichtet werden, kannst Du hier festlegen, welche Module für sie sichtbar sind.
                </div>
              ) : (
                <div className="bg-[#F8F5F0]/40 p-3 space-y-2">
                  <p className="font-body text-[11px] text-[#6B6961] mb-2">
                    Aktivierte Workspaces zeigen dieses Modul <strong>nicht</strong> im Konfigurator (Modul muss global aktiv bleiben).
                  </p>
                  {workspaces.map(ws => (
                    <label key={ws.id} className="flex items-center gap-3 py-1 cursor-pointer hover:bg-white/40 px-2 -mx-2">
                      <input type="checkbox"
                        checked={hiddenInWorkspaces.has(ws.id)}
                        onChange={() => toggleWorkspaceHidden(ws.id)} />
                      <span className="font-body text-sm">
                        {ws.name}
                        <span className="text-[10px] text-[#6B6961] ml-2 font-mono">{ws.slug}</span>
                      </span>
                      {hiddenInWorkspaces.has(ws.id) && (
                        <span className="ml-auto font-body text-[10px] text-[#7B2D8E] uppercase tracking-wider">ausgeblendet</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </section>
          )}

          {error && <div className="p-3 bg-[#FAE5E2] border border-[#C5392E]/30 font-body text-sm text-[#C5392E]">Fehler: {error}</div>}
        </div>

        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-[#1C1C1A]/10 bg-[#F8F5F0]">
          {saved && <span className="font-body text-xs text-[#7FB069] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Gespeichert</span>}
          <button onClick={onClose} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-4 py-2">Abbrechen</button>
          <Button onClick={save} disabled={saving}>{saving ? 'Speichere …' : (isNew ? 'Modul anlegen' : 'Speichern')}</Button>
        </div>
      </div>
    </div>
  );
}

function AdminModulesView({ authProfile }) {
  const [modules, setModules] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [usageFilter, setUsageFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [editing, setEditing] = useState(undefined); // undefined = nichts | null = neu | object = bearbeiten

  async function loadModules() {
    setLoading(true); setError(null);
    const [mRes, wRes] = await Promise.all([
      supabase.from('modules').select('*').is('deleted_at', null).order('sort_order', { ascending: true }),
      // Workspaces für Sichtbarkeits-UI laden (alle außer dem CoMod-Default-Workspace)
      supabase.from('workspaces').select('id, slug, name').neq('id', '00000000-0000-0000-0000-000000000001').order('name'),
    ]);
    if (mRes.error) setError(mRes.error.message);
    else setModules(mRes.data || []);
    if (!wRes.error) setWorkspaces(wRes.data || []);
    setLoading(false);
  }

  useEffect(() => { loadModules(); }, []);

  const filtered = useMemo(() => {
    let list = modules;
    if (usageFilter !== 'all') list = list.filter(m => m.usage === usageFilter);
    if (activeFilter !== 'all') list = list.filter(m => activeFilter === 'active' ? m.is_active : !m.is_active);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(m =>
        (m.kuerzel || '').toLowerCase().includes(s) ||
        (m.display_name || '').toLowerCase().includes(s) ||
        (m.family || '').toLowerCase().includes(s));
    }
    return list;
  }, [modules, usageFilter, activeFilter, search]);

  function handleSaved(savedRow) {
    setModules(prev => {
      const exists = prev.some(m => m.id === savedRow.id);
      if (exists) return prev.map(m => m.id === savedRow.id ? savedRow : m);
      return [...prev, savedRow].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    });
    setEditing(undefined);
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl tracking-tight mb-2">Module</h1>
          <p className="font-body text-sm text-[#6B6961]">
            {filtered.length} von {modules.length} {modules.length === 1 ? 'Modul' : 'Modulen'} · global gepflegt
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadModules} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-3 py-2 border border-[#1C1C1A]/10 hover:border-[#1C1C1A]/30">Neu laden</button>
          <button onClick={() => setEditing(null)} className="font-body text-xs tracking-wider uppercase bg-[#D2563E] hover:bg-[#B04528] text-white px-4 py-2 flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Neues Modul</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input type="text" placeholder="Suche Kürzel, Family, Name …" value={search} onChange={e => setSearch(e.target.value)}
          className="bg-white border border-[#1C1C1A]/10 px-3 py-2 font-body text-sm w-72 focus:outline-none focus:border-[#D2563E]" />
        <div className="flex items-center gap-2">
          <span className="font-body text-xs uppercase tracking-wider text-[#6B6961]">Nutzung:</span>
          {[['all','Alle'],['p','Privat'],['g','Gewerblich']].map(([k,l]) => (
            <button key={k} onClick={() => setUsageFilter(k)} className={`px-3 py-1 text-xs font-body uppercase tracking-wider border ${usageFilter === k ? 'border-[#1C1C1A] text-[#1C1C1A]' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:border-[#1C1C1A]/30'}`}>{l}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="font-body text-xs uppercase tracking-wider text-[#6B6961]">Status:</span>
          {[['all','Alle'],['active','Aktiv'],['inactive','Inaktiv']].map(([k,l]) => (
            <button key={k} onClick={() => setActiveFilter(k)} className={`px-3 py-1 text-xs font-body uppercase tracking-wider border ${activeFilter === k ? 'border-[#1C1C1A] text-[#1C1C1A]' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:border-[#1C1C1A]/30'}`}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center font-body text-sm text-[#6B6961]">Lade Module …</div>
      ) : error ? (
        <div className="bg-white border border-[#C5392E]/30 p-8"><p className="font-body text-sm text-[#C5392E]">Fehler: {error}</p></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center"><p className="font-display text-xl text-[#6B6961]">Keine Module mit diesen Filtern<span className="opacity-50"> …</span></p></div>
      ) : (
        <div className="bg-white border border-[#1C1C1A]/10 overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[2fr_0.8fr_0.8fr_0.6fr_1fr_1fr_0.5fr] gap-3 px-5 py-4 border-b border-[#1C1C1A]/10 font-body text-xs tracking-wider uppercase text-[#6B6961]">
              <div>Modul</div><div>Family</div><div>Kategorie</div><div>Nutz.</div><div className="text-right">Herst-Preis</div><div className="text-right">Marge</div><div className="text-center">Aktiv</div>
            </div>
            {filtered.map(m => (
              <button key={m.id} onClick={() => setEditing(m)} className="w-full text-left grid grid-cols-[2fr_0.8fr_0.8fr_0.6fr_1fr_1fr_0.5fr] gap-3 px-5 py-3.5 border-b border-[#1C1C1A]/5 last:border-b-0 font-body text-sm items-center hover:bg-[#F8F5F0]/50 transition-colors">
                <div>
                  <p className="text-[#1C1C1A]">{m.display_name || m.kuerzel}</p>
                  {m.kuerzel !== m.display_name && <p className="text-[10px] text-[#6B6961]">{m.kuerzel}</p>}
                </div>
                <div className="text-xs text-[#6B6961]">{m.family}</div>
                <div className="text-xs text-[#6B6961]">{m.category}</div>
                <div className="text-xs">
                  <span className="px-1.5 py-0.5 border border-[#1C1C1A]/10 bg-[#F8F5F0] uppercase tracking-wider">{m.usage}</span>
                </div>
                <div className="text-right num">{fmtEUR(m.herst_preis || 0)}</div>
                <div className="text-right num text-[#6B6961]">{((m.marge || 0) * 100).toFixed(1)} %</div>
                <div className="text-center">
                  {m.is_active ? <Check className="w-3.5 h-3.5 text-[#7FB069] inline" /> : <span className="text-[10px] text-[#6B6961] uppercase tracking-wider">aus</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {editing !== undefined && <AdminModuleEdit module={editing} workspaces={workspaces} authProfile={authProfile} onClose={() => setEditing(undefined)} onSaved={handleSaved} />}
    </div>
  );
}

/* ============================================================================
   ADMIN-PROJEKTE: Liste + Edit-Modal (inkl. Fassaden-Mini-Editor)
   ============================================================================ */

const PROJECT_STATUS_LABELS = {
  draft:             { label: 'Entwurf',         color: '#6B6961', bg: '#F0EFEC' },
  pending_approval:  { label: 'Wartet auf Freigabe', color: '#C9A876', bg: '#FBF5E8' },
  approved:          { label: 'Freigegeben',     color: '#7B2D8E', bg: '#F4ECF6' },
  live:              { label: 'Live',            color: '#7FB069', bg: '#EFF7EA' },
  paused:            { label: 'Pausiert',        color: '#D2563E', bg: '#FBEDE7' },
  rejected:          { label: 'Abgelehnt',       color: '#C5392E', bg: '#FAE5E2' },
  archived:          { label: 'Archiviert',      color: '#6B6961', bg: '#F0EFEC' },
};

function AdminProjectEdit({ project, fassaden, onClose, onSaved, onDeleted }) {
  const isNew = !project;
  const [form, setForm] = useState(() => ({
    workspace_id: '00000000-0000-0000-0000-000000000001',
    slug: '',
    name: '',
    location: '',
    description_de: '',
    description_en: '',
    description2_de: '',
    description2_en: '',
    hero_image_url: '',
    ziel_modul_anzahl: 20,
    max_modul_anzahl: 30,
    grundstueck_groesse: null,
    projektrabatt: 0,
    projekt_marge: null,
    einnahmen_faktor: 1,
    transport_pro_modul: 0,
    aufstellung_pro_modul: 0,
    umlage_pro_modul_einmalig: 0,
    pacht_jahr: 0,
    pacht_gewerblich: false,
    provision_pct: null,
    fassaden_variante_id: fassaden.find(f => f.slug === 'standard')?.id || null,
    status: 'draft',
    sort_order: 0,
    ...(project || {}),
  }));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // String-Buffer für Prozent-Felder
  const pctToStr = (v) => (v == null || v === '' || isNaN(v)) ? '' : String(+(v * 100).toFixed(4)).replace('.', ',');
  const strToPct = (s) => {
    if (s == null || s === '') return null;
    const cleaned = String(s).replace(',', '.').trim();
    const n = Number(cleaned);
    return isNaN(n) ? null : n / 100;
  };
  const [rabattStr,     setRabattStr]     = useState(() => pctToStr(form.projektrabatt));
  const [provisionStr,  setProvisionStr]  = useState(() => pctToStr(form.provision_pct));
  const [margeStr,      setMargeStr]      = useState(() => pctToStr(form.projekt_marge));
  const [faktorStr,     setFaktorStr]     = useState(() => pctToStr(form.einnahmen_faktor == null ? 1 : form.einnahmen_faktor));
  // Berechnungshilfe: temporäre Geschoss-Wahl, nicht persistiert
  const [geschosseHilfe, setGeschosseHilfe] = useState(2);

  const update = (key) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked
            : e.target.type === 'number' ? (e.target.value === '' ? null : Number(e.target.value))
            : e.target.value === '' ? null : e.target.value;
    setForm(f => ({ ...f, [key]: v }));
  };

  const NO_SPINNER = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0';

  async function save() {
    setSaving(true); setError(null); setSaved(false);
    const rabattNum    = strToPct(rabattStr) ?? 0;
    const provisionNum = strToPct(provisionStr);
    const margeNum     = strToPct(margeStr);          // null = Modul-Marge gilt
    const faktorNum    = strToPct(faktorStr) ?? 1;    // 1 = 100 % (unverändert)
    const { id, created_at, updated_at, deleted_at, project: _p, ...rest } = form;
    const payload = { ...rest, projektrabatt: rabattNum, provision_pct: provisionNum, projekt_marge: margeNum, einnahmen_faktor: faktorNum };
    let res;
    if (isNew) {
      res = await supabase.from('projects').insert(payload).select('*').single();
    } else {
      res = await supabase.from('projects').update(payload).eq('id', project.id).select('*').single();
    }
    if (res.error) { setError(res.error.message); setSaving(false); return; }
    setSaved(true); setSaving(false);
    setTimeout(() => { onSaved(res.data); }, 600);
  }

  async function softDelete() {
    if (!project) return;
    setDeleting(true); setError(null);
    const { error } = await supabase.from('projects').update({ deleted_at: new Date().toISOString() }).eq('id', project.id);
    if (error) { setError(error.message); setDeleting(false); return; }
    onDeleted(project.id);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 sm:py-8" onClick={onClose}>
      <div
        className="bg-white max-w-5xl w-full"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto', overflowX: 'hidden' }}>
        <div className="flex items-start justify-between p-8 border-b border-[#1C1C1A]/10">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-2">{isNew ? 'Neues Projekt' : 'Projekt bearbeiten'}</p>
            <h2 className="font-display text-3xl tracking-tight">{form.name || 'Neu'}</h2>
            {form.location && <p className="font-body text-sm text-[#6B6961] mt-1">{form.location}</p>}
          </div>
          <button onClick={onClose} className="text-[#6B6961] hover:text-[#1C1C1A] p-2"><Plus className="w-5 h-5 rotate-45" /></button>
        </div>

        <div className="p-8 space-y-7">

          <section>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Identifikation</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Slug (URL-Kürzel)</label>
                <input type="text" value={form.slug ?? ''} onChange={update('slug')}
                  placeholder="z. B. voelk, albst" className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">Wird in URLs verwendet, möglichst kurz</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Projekt-Name</label>
                <input type="text" value={form.name ?? ''} onChange={update('name')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Ort</label>
                <input type="text" value={form.location ?? ''} onChange={update('location')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
            </div>
          </section>

          <section>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Beschreibung</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Beschreibung (DE)</label>
                <textarea value={form.description_de ?? ''} onChange={update('description_de')} rows={2}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Beschreibung (EN)</label>
                <textarea value={form.description_en ?? ''} onChange={update('description_en')} rows={2}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Hinweistext (DE, im Akzent angezeigt)</label>
                <textarea value={form.description2_de ?? ''} onChange={update('description2_de')} rows={2}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Hinweistext (EN)</label>
                <textarea value={form.description2_en ?? ''} onChange={update('description2_en')} rows={2}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
            </div>
          </section>

          <section>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Visual</p>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4 items-start">
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Hero-Image-URL</label>
                <input type="text" value={form.hero_image_url ?? ''} onChange={update('hero_image_url')}
                  placeholder="z. B. /projects/voelk.jpg oder https://…"
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
                <p className="font-body text-[10px] text-[#6B6961] mt-1">
                  Querformat 3:2 empfohlen (z. B. 900×600 px). Bilder im GitHub-Repo unter <span className="font-mono">/public/projects/</span> ablegen, dann hier den Pfad <span className="font-mono">/projects/dateiname.jpg</span> eintragen. Leer = Platzhalter mit Projekt-Initiale.
                </p>
              </div>
              <div className="bg-[#F8F5F0] border border-[#1C1C1A]/10 overflow-hidden" style={{ aspectRatio: '3 / 2' }}>
                {form.hero_image_url ? (
                  <img src={form.hero_image_url} alt="Vorschau"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F0EDE5] to-[#E8E3D6]">
                    <span className="font-display text-4xl text-[#A87DAE]/40">{form.name?.[0] || '?'}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Dimensionierung</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Ziel-Modulanzahl</label>
                <input type="number" value={form.ziel_modul_anzahl ?? ''} onChange={update('ziel_modul_anzahl')}
                  className={`w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] ${NO_SPINNER}`} />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">Wird benötigt, um Projekt freizugeben</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Max. Modulanzahl</label>
                <input type="number" value={form.max_modul_anzahl ?? ''} onChange={update('max_modul_anzahl')}
                  className={`w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] ${NO_SPINNER}`} />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">Obergrenze, wieviele Module wirklich gebaut werden</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Grundstück (m²)</label>
                <input type="number" value={form.grundstueck_groesse ?? ''} onChange={update('grundstueck_groesse')}
                  className={`w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] ${NO_SPINNER}`} />
              </div>
            </div>
          </section>

          {/* Berechnungshilfe — verwendet calcMaxModule + ZIEL_MODUL_BGF + BEBAUUNGSGRAD */}
          {form.grundstueck_groesse > 0 && (() => {
            const calc = (geschosse) => calcMaxModule({ grundstueckGroesse: form.grundstueck_groesse, geschosse });
            const result = calc(geschosseHilfe);
            const empfZiel = Math.round(result.maxGesamt * 0.8);
            const empfMax  = result.maxGesamt;
            // Pacht-Empfehlung: typisch 5-15 €/m² Grundstück und Jahr — Mitte 10
            const pachtEmpf = Math.round((form.grundstueck_groesse || 0) * 10 / 1000) * 1000;
            // Umlage/Modul: typisch 5.000-10.000 € Erschließung — Mitte 7.500
            const umlageEmpf = 7500;
            return (
              <section className="border-l-4 border-[#7B2D8E]/30 pl-4 -ml-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-body text-xs uppercase tracking-wider text-[#7B2D8E]">↺ Berechnungshilfe</p>
                  <p className="font-body text-[10px] text-[#6B6961]">basierend auf Grundstück {fmtEUR(form.grundstueck_groesse).replace(' €','')} m² · 80 % bebaubar · Modul-BGF 36 m²</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1.5">Geplante Anzahl Geschosse (nur für Schätzung)</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map(g => (
                        <button key={g} onClick={() => setGeschosseHilfe(g)}
                          className={`px-4 py-1.5 font-body text-xs border transition-colors num ${geschosseHilfe === g ? 'border-[#7B2D8E] bg-[#7B2D8E]/10 text-[#7B2D8E] font-medium' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A]'}`}>
                          {g} {g === 1 ? 'Geschoss' : 'Geschosse'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#F4ECF6]/40 p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="font-body text-sm">
                      <p className="text-[#6B6961] text-xs mb-1">Maximal möglich auf diesem Grundstück</p>
                      <p><span className="num text-[#1C1C1A]">{result.maxProGeschoss}</span> Module pro Geschoss · <span className="num text-[#7B2D8E]">{result.maxGesamt}</span> Module gesamt</p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-start sm:justify-end">
                      <button onClick={() => setForm(f => ({...f, ziel_modul_anzahl: empfZiel, max_modul_anzahl: empfMax}))}
                        className="font-body text-xs uppercase tracking-wider bg-[#7B2D8E]/10 text-[#7B2D8E] border border-[#7B2D8E]/40 hover:bg-[#7B2D8E]/20 px-3 py-1.5">
                        ↓ Ziel {empfZiel} · Max {empfMax} übernehmen
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-body text-xs text-[#6B6961]">
                    <div className="bg-[#F8F5F0]/60 p-3">
                      <p className="uppercase tracking-wider mb-1.5">Umlage/Modul — Richtwert</p>
                      <p>Typisch <span className="num text-[#1C1C1A]">5.000 – 10.000 €</span> pro Modul für Erschließung, Architektur, gemeinsame Flächen.</p>
                      <button onClick={() => setForm(f => ({...f, umlage_pro_modul_einmalig: umlageEmpf}))}
                        className="mt-2 text-[#7B2D8E] hover:text-[#5D2069] underline underline-offset-2">
                        Mittelwert {fmtEUR(umlageEmpf)} übernehmen
                      </button>
                    </div>
                    <div className="bg-[#F8F5F0]/60 p-3">
                      <p className="uppercase tracking-wider mb-1.5">Pacht/Jahr — Richtwert</p>
                      <p>Typisch <span className="num text-[#1C1C1A]">5 – 15 €/m²</span> Grundstück/Jahr. Stadtlage höher, Land niedriger.</p>
                      {pachtEmpf > 0 && (
                        <button onClick={() => setForm(f => ({...f, pacht_jahr: pachtEmpf}))}
                          className="mt-2 text-[#7B2D8E] hover:text-[#5D2069] underline underline-offset-2">
                          Mittelwert {fmtEUR(pachtEmpf)}/Jahr übernehmen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          })()}

          <section>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Finanzielles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Projektrabatt (%)</label>
                <input type="text" inputMode="decimal" value={rabattStr} onChange={e => setRabattStr(e.target.value)}
                  placeholder="z. B. 5 oder 5,5"
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">zusätzlich zur Mengenstaffel</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Umlage / Modul einmalig (€)</label>
                <input type="number" value={form.umlage_pro_modul_einmalig ?? ''} onChange={update('umlage_pro_modul_einmalig')}
                  className={`w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] ${NO_SPINNER}`} />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">Erschließung, gemeinsame Flächen, etc.</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Pacht / Jahr (€)</label>
                <input type="number" value={form.pacht_jahr ?? ''} onChange={update('pacht_jahr')}
                  className={`w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] ${NO_SPINNER}`} />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">wird auf Ziel-Anzahl umgelegt</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Provision (%, Override)</label>
                <input type="text" inputMode="decimal" value={provisionStr} onChange={e => setProvisionStr(e.target.value)}
                  placeholder="leer = global"
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">leer = globaler Default 3,5 %</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Projekt-Marge (%, Override)</label>
                <input type="text" inputMode="decimal" value={margeStr} onChange={e => setMargeStr(e.target.value)}
                  placeholder="leer = Modul-Marge"
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">ersetzt die Modul-Marge (Pilotprojekte)</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Einnahmen-Faktor (%)</label>
                <input type="text" inputMode="decimal" value={faktorStr} onChange={e => setFaktorStr(e.target.value)}
                  placeholder="z. B. 50 oder 150"
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">100 = unverändert · 50 = Hälfte · 150 = ×1,5</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Transport / Modul (€, netto)</label>
                <input type="number" value={form.transport_pro_modul ?? ''} onChange={update('transport_pro_modul')}
                  className={`w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] ${NO_SPINNER}`} />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">Durchleitung, ohne Marge/Provision</p>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Aufstellung / Modul (€, netto)</label>
                <input type="number" value={form.aufstellung_pro_modul ?? ''} onChange={update('aufstellung_pro_modul')}
                  className={`w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] ${NO_SPINNER}`} />
                <p className="font-body text-[10px] text-[#6B6961] mt-0.5">Aufbau & Anschluss, ohne Marge/Provision</p>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="pacht_gewerb" checked={!!form.pacht_gewerblich} onChange={update('pacht_gewerblich')} />
                <label htmlFor="pacht_gewerb" className="font-body text-sm">Gewerbliche Pacht (+19 % USt für Privat-Anteil)</label>
              </div>
            </div>
          </section>

          <section>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Fassaden-Variante</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fassaden.map(f => (
                <button key={f.id} onClick={() => setForm(form => ({...form, fassaden_variante_id: f.id}))}
                  className={`text-left p-3 border transition-colors ${form.fassaden_variante_id === f.id ? 'border-[#D2563E] bg-[#D2563E]/5' : 'border-[#1C1C1A]/15 hover:border-[#1C1C1A]/30'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-body text-sm ${form.fassaden_variante_id === f.id ? 'text-[#D2563E]' : 'text-[#1C1C1A]'}`}>{f.label_de}</span>
                    {form.fassaden_variante_id === f.id && <Check className="w-4 h-4 text-[#D2563E]" />}
                  </div>
                  <p className="font-body text-xs text-[#6B6961] mt-1">
                    {f.ist_auf_anfrage ? 'Individuelle Konfiguration auf Anfrage' :
                     f.aufpreis_pro_einzelmodul_eur > 0 ? `+${fmtEUR(f.aufpreis_pro_einzelmodul_eur)} pro Einzelmodul · ${f.dicke_cm} cm` :
                     `Im Preis enthalten · ${f.dicke_cm} cm`}
                  </p>
                </button>
              ))}
            </div>
            <p className="font-body text-[10px] text-[#6B6961] mt-2">
              Die Variante gilt für alle Module, die in diesem Projekt gewählt werden. Fassaden-Mengen pflegst Du in der DB (settings/fassaden_varianten).
            </p>
          </section>

          <section>
            <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Status & Reihenfolge</p>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {Object.entries(PROJECT_STATUS_LABELS).map(([key, meta]) => (
                  <button key={key} onClick={() => setForm(f => ({...f, status: key}))}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider font-body border transition-colors`}
                    style={form.status === key ? { background: meta.bg, color: meta.color, borderColor: meta.color } : { borderColor: '#1C1C1A26', color: '#6B6961' }}>
                    {meta.label}
                  </button>
                ))}
              </div>
              <p className="font-body text-[10px] text-[#6B6961]">
                Status <strong>Live</strong> = im Konfigurator wählbar. Andere Stati sind nur im Admin sichtbar.
              </p>
              <div className="max-w-xs">
                <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Sortier-Reihenfolge</label>
                <input type="number" value={form.sort_order ?? ''} onChange={update('sort_order')}
                  className="w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              </div>
            </div>
          </section>

          {error && <div className="p-3 bg-[#FAE5E2] border border-[#C5392E]/30 font-body text-sm text-[#C5392E]">Fehler: {error}</div>}
        </div>

        <div className="flex items-center justify-between gap-3 px-8 py-5 border-t border-[#1C1C1A]/10 bg-[#F8F5F0]">
          <div>
            {!isNew && !confirmDelete && (
              <button onClick={() => setConfirmDelete(true)} className="font-body text-xs tracking-wider uppercase text-[#C5392E]/70 hover:text-[#C5392E] flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Projekt archivieren</button>
            )}
            {!isNew && confirmDelete && (
              <div className="flex items-center gap-2">
                <span className="font-body text-xs text-[#C5392E]">Wirklich archivieren?</span>
                <button onClick={softDelete} disabled={deleting} className="font-body text-xs uppercase tracking-wider bg-[#C5392E] text-white px-3 py-1.5 hover:bg-[#A52E25]">{deleting ? 'Lösche …' : 'Ja, archivieren'}</button>
                <button onClick={() => setConfirmDelete(false)} className="font-body text-xs uppercase tracking-wider text-[#6B6961] hover:text-[#1C1C1A] px-2">Abbrechen</button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="font-body text-xs text-[#7FB069] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Gespeichert</span>}
            <button onClick={onClose} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-4 py-2">Abbrechen</button>
            <Button onClick={save} disabled={saving}>{saving ? 'Speichere …' : (isNew ? 'Projekt anlegen' : 'Speichern')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminProjectsView() {
  const [projects, setProjects] = useState([]);
  const [fassaden, setFassaden] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editing, setEditing] = useState(undefined);

  async function loadAll() {
    setLoading(true); setError(null);
    const [pRes, fRes] = await Promise.all([
      supabase.from('projects').select('*').is('deleted_at', null).order('sort_order', { ascending: true }),
      supabase.from('fassaden_varianten').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    ]);
    if (pRes.error) setError(pRes.error.message);
    else setProjects(pRes.data || []);
    if (!fRes.error) setFassaden(fRes.data || []);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return projects;
    return projects.filter(p => p.status === statusFilter);
  }, [projects, statusFilter]);

  function handleSaved(savedRow) {
    setProjects(prev => {
      const exists = prev.some(p => p.id === savedRow.id);
      if (exists) return prev.map(p => p.id === savedRow.id ? savedRow : p);
      return [...prev, savedRow].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    });
    setEditing(undefined);
  }

  function handleDeleted(deletedId) {
    setProjects(prev => prev.filter(p => p.id !== deletedId));
    setEditing(undefined);
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl tracking-tight mb-2">Projekte</h1>
          <p className="font-body text-sm text-[#6B6961]">
            {filtered.length} von {projects.length} {projects.length === 1 ? 'Projekt' : 'Projekten'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadAll} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-3 py-2 border border-[#1C1C1A]/10 hover:border-[#1C1C1A]/30">Neu laden</button>
          <button onClick={() => setEditing(null)} className="font-body text-xs tracking-wider uppercase bg-[#D2563E] hover:bg-[#B04528] text-white px-4 py-2 flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Neues Projekt</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-body text-xs uppercase tracking-wider text-[#6B6961]">Status:</span>
        <button onClick={() => setStatusFilter('all')} className={`px-3 py-1 text-xs font-body uppercase tracking-wider border ${statusFilter === 'all' ? 'border-[#1C1C1A] text-[#1C1C1A]' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:border-[#1C1C1A]/30'}`}>Alle</button>
        {Object.entries(PROJECT_STATUS_LABELS).map(([key, meta]) => (
          <button key={key} onClick={() => setStatusFilter(key)}
            className={`px-3 py-1 text-xs font-body uppercase tracking-wider border ${statusFilter === key ? 'border-current' : 'border-[#1C1C1A]/15 text-[#6B6961] hover:border-[#1C1C1A]/30'}`}
            style={statusFilter === key ? { color: meta.color, borderColor: meta.color, background: meta.bg } : {}}>
            {meta.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center font-body text-sm text-[#6B6961]">Lade Projekte …</div>
      ) : error ? (
        <div className="bg-white border border-[#C5392E]/30 p-8"><p className="font-body text-sm text-[#C5392E]">Fehler: {error}</p></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center"><p className="font-display text-xl text-[#6B6961]">Keine Projekte mit diesem Filter<span className="opacity-50"> …</span></p></div>
      ) : (
        <div className="bg-white border border-[#1C1C1A]/10 overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_1fr_0.7fr] gap-3 px-5 py-4 border-b border-[#1C1C1A]/10 font-body text-xs tracking-wider uppercase text-[#6B6961]">
              <div>Projekt</div><div>Ort</div><div>Status</div><div className="text-right">Ziel-Mod.</div><div className="text-right">Umlage/Mod</div><div className="text-right">Pacht/Jahr</div>
            </div>
            {filtered.map(p => {
              const meta = PROJECT_STATUS_LABELS[p.status] || PROJECT_STATUS_LABELS.draft;
              return (
                <button key={p.id} onClick={() => setEditing(p)} className="w-full text-left grid grid-cols-[1.5fr_1fr_1fr_0.7fr_1fr_0.7fr] gap-3 px-5 py-3.5 border-b border-[#1C1C1A]/5 last:border-b-0 font-body text-sm items-center hover:bg-[#F8F5F0]/50 transition-colors">
                  <div>
                    <p className="text-[#1C1C1A]">{p.name}</p>
                    <p className="text-[10px] text-[#6B6961]">{p.slug}</p>
                  </div>
                  <div className="text-xs text-[#6B6961]">{p.location || '—'}</div>
                  <div>
                    <span className="inline-block px-2 py-0.5 text-[10px] tracking-wider uppercase border" style={{ color: meta.color, borderColor: meta.color, background: meta.bg }}>{meta.label}</span>
                  </div>
                  <div className="text-right num">{p.ziel_modul_anzahl}</div>
                  <div className="text-right num">{p.umlage_pro_modul_einmalig > 0 ? fmtEUR(p.umlage_pro_modul_einmalig) : '—'}</div>
                  <div className="text-right num">{p.pacht_jahr > 0 ? fmtEUR(p.pacht_jahr) : '—'}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {editing !== undefined && <AdminProjectEdit project={editing} fassaden={fassaden} onClose={() => setEditing(undefined)} onSaved={handleSaved} onDeleted={handleDeleted} />}
    </div>
  );
}

/* ============================================================================
   ADMIN-SETTINGS: Globale Konstanten
   ============================================================================ */

// Setting-Definitionen mit Kategorie + Typ + Label + Beschreibung
const SETTING_DEFS = [
  // PROVISIONEN & STEUERN
  { key: 'PROV',           cat: 'provision', type: 'percent', label: 'Provisionssatz',                desc: 'Default-Provision auf den rabattierten Herstellpreis' },
  { key: 'MARGE',          cat: 'provision', type: 'percent', label: 'Standard-Marge',                desc: 'Aufschlag auf Herstellungskosten — Fallback, falls ein Modul keine eigene Marge hat' },
  { key: 'UST',            cat: 'provision', type: 'percent', label: 'Umsatzsteuer',                  desc: 'Wird auf den Netto-Preis aufgeschlagen' },
  { key: 'ANZ_PCT',        cat: 'provision', type: 'percent', label: 'Anzahlung',                     desc: 'Anteil der Investmentsumme als Anzahlung' },
  { key: 'STEUER_GMBH',    cat: 'provision', type: 'percent', label: 'Steuerlast GmbH',               desc: 'GewSt + KSt + Soli (Annahme)' },
  { key: 'IAB_MAX_PCT',    cat: 'provision', type: 'percent', label: 'IAB Maximum',                   desc: 'Investitionsabzugsbetrag maximal % der Investition' },

  // FINANZIERUNG
  { key: 'KFW_FOERDERHOEHE',     cat: 'finanz', type: 'euro',    label: 'KfW Förderhöhe',           desc: 'Pauschal pro Privat-Antrag' },
  { key: 'KFW_ZINS',             cat: 'finanz', type: 'percent', label: 'KfW Zinssatz',             desc: 'Standard-Zinssatz' },
  { key: 'KFW_LAUFZEIT_JAHRE',   cat: 'finanz', type: 'years',   label: 'KfW Laufzeit',             desc: 'in Jahren' },
  { key: 'KFW_TILGUNGSNACHLASS', cat: 'finanz', type: 'percent', label: 'KfW Tilgungsnachlass',     desc: 'Anteil, der nicht zurückgezahlt werden muss' },
  { key: 'GLS_ZINS',             cat: 'finanz', type: 'percent', label: 'GLS Zinssatz',             desc: 'Standard-Zinssatz GLS-Bank' },
  { key: 'GLS_LAUFZEIT_JAHRE',   cat: 'finanz', type: 'years',   label: 'GLS Laufzeit',             desc: 'in Jahren' },
  { key: 'PLATTFORM_ZINS_DEFAULT',  cat: 'finanz', type: 'percent', label: 'Plattform Zinssatz',     desc: 'Default-Zinssatz Plattform-Finanzierung' },
  { key: 'PLATTFORM_LAUFZEIT_JAHRE', cat: 'finanz', type: 'years', label: 'Plattform Laufzeit',     desc: 'in Jahren' },
  { key: 'PLATTFORM_RESTWERT_PCT',   cat: 'finanz', type: 'percent', label: 'Restwert am Laufzeitende', desc: 'Anteil des Werts am Ende' },
  { key: 'AFA_JAHRE',            cat: 'finanz', type: 'years',   label: 'AfA-Dauer Modulhaus',      desc: 'Abschreibungsdauer in Jahren' },

  // KOSTEN LAUFEND (€ pro m²/Monat)
  { key: 'NEBENKOSTEN_LIZENZ_PRO_M2',   cat: 'kosten_lfd', type: 'euro_decimal', label: 'Lizenzgebühr CoMod',       desc: '€ pro m²/Monat' },
  { key: 'NEBENKOSTEN_QM_PRO_M2',       cat: 'kosten_lfd', type: 'euro_decimal', label: 'Quartiersmanagement',      desc: '€ pro m²/Monat' },
  { key: 'NEBENKOSTEN_VERS_PRO_M2',     cat: 'kosten_lfd', type: 'euro_decimal', label: 'Versicherung',             desc: '€ pro m²/Monat' },
  { key: 'NEBENKOSTEN_INSTAND_PRO_M2',  cat: 'kosten_lfd', type: 'euro_decimal', label: 'Instandhaltung',           desc: '€ pro m²/Monat' },
  { key: 'VERBRAUCH_STROM_PRO_M2',      cat: 'kosten_lfd', type: 'euro_decimal', label: 'Strom (variabel)',         desc: '€ pro m²/Monat' },
  { key: 'VERBRAUCH_WASSER_PRO_M2',     cat: 'kosten_lfd', type: 'euro_decimal', label: 'Wasser/Abwasser',          desc: '€ pro m²/Monat' },
  { key: 'VERBRAUCH_HEIZUNG_PRO_M2',    cat: 'kosten_lfd', type: 'euro_decimal', label: 'Heizung/Warmwasser',       desc: '€ pro m²/Monat' },
  // KOSTEN EINMALIG (€ pro Modul)
  { key: 'KOSTEN_FUNDAMENT_PRO_EG_MODUL',       cat: 'kosten_einmal', type: 'euro', label: 'Fundamente',               desc: '€ pro EG-Modul (Schraubfundamente inkl. Arbeit)' },
  { key: 'KOSTEN_TREPPEN_LAUBENGANG_PRO_MODUL', cat: 'kosten_einmal', type: 'euro', label: 'Treppen/Laubengang',       desc: '€ pro Modul in OG/DG' },
  { key: 'KOSTEN_TERRASSE_PRO_MODUL',           cat: 'kosten_einmal', type: 'euro', label: 'Terrasse',                 desc: '€ pro Modul im EG' },
  { key: 'KOSTEN_PV_PRO_MODUL',                 cat: 'kosten_einmal', type: 'euro', label: 'PV-Anlage inkl. Speicher', desc: '€ pro oberstem Modul' },
  { key: 'KOSTEN_DACHBEGRUENUNG_PRO_MODUL',     cat: 'kosten_einmal', type: 'euro', label: 'Dachbegrünung',            desc: '€ pro oberstem Modul' },

  // GEOMETRIE & BAUGENEHMIGUNG
  { key: 'ZIEL_MODUL_NUF',        cat: 'geometrie', type: 'integer', label: 'Standard-NUF eines Moduls', desc: 'in m² (für Pacht-Umlage)' },
  { key: 'ZIEL_MODUL_BGF',        cat: 'geometrie', type: 'integer', label: 'Standard-BGF eines Moduls', desc: 'in m²' },
  { key: 'MODUL_HOEHE_CM',        cat: 'geometrie', type: 'integer', label: 'Modul-Höhe',                desc: 'in cm' },
  { key: 'BEBAUUNGSGRAD',         cat: 'geometrie', type: 'percent', label: 'Bebauungsgrad',             desc: 'Anteil bebaubare Fläche vom Grundstück' },
  { key: 'WANDSTAERKE_LAENGS_CM', cat: 'geometrie', type: 'integer', label: 'Wandstärke Längsseiten',    desc: 'in cm (Kiri 5-lagig)' },
  { key: 'WANDSTAERKE_STIRN_CM',  cat: 'geometrie', type: 'integer', label: 'Wandstärke Stirnseiten',    desc: 'in cm (Derix CLT)' },
  { key: 'BAUWERT_PRO_M3',        cat: 'geometrie', type: 'euro',    label: 'Bauwert NRW',               desc: '€ pro m³ BRI (Baugenehmigung)' },
  { key: 'GEBUEHR_SATZ',          cat: 'geometrie', type: 'percent', label: 'Gebührensatz NRW',          desc: 'auf Bauwert (Baugenehmigung)' },
  { key: 'GEBUEHR_MINDEST',       cat: 'geometrie', type: 'euro',    label: 'Mindestgebühr NRW',         desc: 'für Baugenehmigung' },
  { key: 'GEBUEHR_RUNDUNG',       cat: 'geometrie', type: 'euro',    label: 'Gebühren-Rundung NRW',      desc: 'auf nächste X €' },
];

const SETTING_CATEGORIES = [
  { key: 'provision',     label: 'Provisionen & Steuern' },
  { key: 'rabatt',        label: 'Mengen-Rabatt' },
  { key: 'projektkosten', label: 'Projektkostenstaffel' },
  { key: 'grundstueck',   label: 'Grundstückskosten' },
  { key: 'finanz',        label: 'Finanzierung' },
  { key: 'kosten_lfd',    label: 'Kosten laufend' },
  { key: 'kosten_einmal', label: 'Kosten einmalig' },
  { key: 'geometrie',     label: 'Geometrie & Baugenehmigung' },
];

function AdminSettingsView() {
  const [settings, setSettings]   = useState({});
  const [original, setOriginal]   = useState({});
  // Pro Prozent-Setting ein Display-String-Buffer, damit "17,5" flüssig getippt werden kann
  // (sonst verschluckt React das Komma beim Re-Render)
  const [pctBuffers, setPctBuffers] = useState({});
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [activeCat, setActiveCat] = useState('provision');

  const pctToStr = (v) => (v == null || v === '' || isNaN(v)) ? '' : String(+(v * 100).toFixed(4)).replace('.', ',');
  const strToPct = (s) => {
    if (s == null || s === '') return null;
    const cleaned = String(s).replace(',', '.').trim();
    if (cleaned === '' || cleaned === '.' || cleaned === '-') return null;
    const n = Number(cleaned);
    return isNaN(n) ? null : n / 100;
  };

  async function loadAll() {
    setLoading(true); setError(null);
    const { data, error } = await supabase.from('settings').select('*').is('workspace_id', null);
    if (error) { setError(error.message); setLoading(false); return; }
    const map = {};
    (data || []).forEach(s => { map[s.key] = s.value; });
    setSettings(map);
    setOriginal(JSON.parse(JSON.stringify(map)));
    // Buffers für alle Prozent-Settings initialisieren
    const buf = {};
    SETTING_DEFS.filter(d => d.type === 'percent').forEach(d => { buf[d.key] = pctToStr(map[d.key]); });
    // Rabattstaffel-Buffers (pro Zeile)
    if (Array.isArray(map.RABATT_STAFFEL)) {
      map.RABATT_STAFFEL.forEach((row, i) => { buf[`RABATT_${i}`] = pctToStr(row.prozent); });
    }
    setPctBuffers(buf);
    setLoading(false);
  }
  useEffect(() => { loadAll(); }, []);

  const dirtyKeys = useMemo(() =>
    Object.keys(settings).filter(k => JSON.stringify(settings[k]) !== JSON.stringify(original[k])),
    [settings, original]);
  const isDirty = dirtyKeys.length > 0;

  function updateSetting(key, value) { setSettings(s => ({ ...s, [key]: value })); }

  async function saveAll() {
    setSaving(true); setError(null); setSaved(false);
    const updates = dirtyKeys.map(key =>
      supabase.from('settings').update({ value: settings[key] }).is('workspace_id', null).eq('key', key)
    );
    const results = await Promise.all(updates);
    const firstError = results.find(r => r.error);
    if (firstError) { setError(firstError.error.message); setSaving(false); return; }
    setOriginal(JSON.parse(JSON.stringify(settings)));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }
  function resetChanges() { setSettings(JSON.parse(JSON.stringify(original))); }

  const NO_SPINNER = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0';

  function renderSettingInput(def) {
    const val = settings[def.key];
    const orig = original[def.key];
    const changed = JSON.stringify(val) !== JSON.stringify(orig);

    if (def.type === 'percent') {
      // Buffer-String erlaubt freies Tippen mit Komma ("17,5" ohne dass das Komma verschluckt wird)
      const display = pctBuffers[def.key] ?? pctToStr(val);
      return (
        <div className="flex items-center gap-2">
          <input type="text" inputMode="decimal" value={display}
            onChange={e => {
              const raw = e.target.value;
              setPctBuffers(b => ({ ...b, [def.key]: raw }));
              const parsed = strToPct(raw);
              updateSetting(def.key, parsed);
            }}
            onBlur={() => {
              // Beim Verlassen: Buffer auf saubere Anzeige normalisieren
              setPctBuffers(b => ({ ...b, [def.key]: pctToStr(settings[def.key]) }));
            }}
            className={`flex-1 bg-[#F8F5F0] border ${changed ? 'border-[#7B2D8E]' : 'border-[#1C1C1A]/10'} px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] num`} />
          <span className="font-body text-xs text-[#6B6961]">%</span>
        </div>
      );
    }
    if (def.type === 'euro' || def.type === 'euro_decimal') {
      const step = def.type === 'euro_decimal' ? '0.01' : '1';
      return (
        <div className="flex items-center gap-2">
          <input type="number" step={step} value={val ?? ''}
            onChange={e => updateSetting(def.key, e.target.value === '' ? null : Number(e.target.value))}
            className={`flex-1 bg-[#F8F5F0] border ${changed ? 'border-[#7B2D8E]' : 'border-[#1C1C1A]/10'} px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] num ${NO_SPINNER}`} />
          <span className="font-body text-xs text-[#6B6961]">€</span>
        </div>
      );
    }
    if (def.type === 'integer' || def.type === 'years') {
      return (
        <div className="flex items-center gap-2">
          <input type="number" value={val ?? ''}
            onChange={e => updateSetting(def.key, e.target.value === '' ? null : Number(e.target.value))}
            className={`flex-1 bg-[#F8F5F0] border ${changed ? 'border-[#7B2D8E]' : 'border-[#1C1C1A]/10'} px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] num`} />
          {def.type === 'years' && <span className="font-body text-xs text-[#6B6961]">Jahre</span>}
        </div>
      );
    }
    return <p className="font-body text-xs text-[#C5392E]">Unbekannter Typ: {def.type}</p>;
  }

  function renderRabattStaffel() {
    const list = Array.isArray(settings.RABATT_STAFFEL) ? settings.RABATT_STAFFEL : [];
    const orig = original.RABATT_STAFFEL;
    const changed = JSON.stringify(list) !== JSON.stringify(orig);

    function updateRow(i, field, val) {
      const next = [...list];
      next[i] = { ...next[i], [field]: val };
      updateSetting('RABATT_STAFFEL', next);
    }
    function removeRow(i) {
      updateSetting('RABATT_STAFFEL', list.filter((_, idx) => idx !== i));
    }
    function addRow() {
      const next = [...list, { ab: 0, prozent: 0 }];
      updateSetting('RABATT_STAFFEL', next);
    }
    function sortByAb() {
      updateSetting('RABATT_STAFFEL', [...list].sort((a, b) => a.ab - b.ab));
    }

    return (
      <div className="bg-white border border-[#1C1C1A]/10 p-6">
        <div className="flex items-end justify-between mb-4 gap-4 flex-wrap">
          <div>
            <p className="font-body text-base text-[#1C1C1A] mb-1">Mengen-Rabattstaffel</p>
            <p className="font-body text-xs text-[#6B6961] max-w-xl">Ab der angegebenen Modulanzahl wird der jeweilige Rabatt angewendet. Höhere Stufe überschreibt niedrigere. Wird im Konfigurator automatisch berechnet.</p>
          </div>
          {changed && <span className="font-body text-[10px] text-[#7B2D8E] uppercase tracking-wider whitespace-nowrap">geändert</span>}
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-3 px-2 font-body text-[10px] tracking-wider uppercase text-[#6B6961]">
            <div>Ab Modulanzahl</div>
            <div>Rabatt</div>
            <div></div>
          </div>
          {list.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center">
              <input type="number" value={row.ab ?? 0}
                onChange={e => updateRow(i, 'ab', Number(e.target.value) || 0)}
                className={`bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] num ${NO_SPINNER}`} />
              <div className="flex items-center gap-2">
                <input type="text" inputMode="decimal"
                  value={pctBuffers[`RABATT_${i}`] ?? pctToStr(row.prozent)}
                  onChange={e => {
                    const raw = e.target.value;
                    setPctBuffers(b => ({ ...b, [`RABATT_${i}`]: raw }));
                    const parsed = strToPct(raw);
                    updateRow(i, 'prozent', parsed ?? 0);
                  }}
                  onBlur={() => {
                    setPctBuffers(b => ({ ...b, [`RABATT_${i}`]: pctToStr(list[i]?.prozent) }));
                  }}
                  className="flex-1 bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] num" />
                <span className="font-body text-xs text-[#6B6961]">%</span>
              </div>
              <button onClick={() => removeRow(i)} title="Zeile entfernen"
                className="text-[#C5392E]/60 hover:text-[#C5392E] p-1.5">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button onClick={addRow} className="font-body text-xs tracking-wider uppercase border border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A] hover:border-[#1C1C1A]/30 px-3 py-1.5 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Stufe hinzufügen
          </button>
          {list.length > 1 && (
            <button onClick={sortByAb} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-2 py-1.5">
              Nach Modulanzahl sortieren
            </button>
          )}
        </div>
      </div>
    );
  }

  // Projektkosten-Staffel: Pflicht-Posten Architektur / Eingabeplanung / Projektmanagement
  // Pro Stufe: bis X Module → arch/eing/pm Beträge in € netto
  function renderProjektkostenStaffel() {
    const list = Array.isArray(settings.PROJEKTKOSTEN_STAFFEL) ? settings.PROJEKTKOSTEN_STAFFEL : [];
    const orig = original.PROJEKTKOSTEN_STAFFEL;
    const changed = JSON.stringify(list) !== JSON.stringify(orig);

    function updateRow(i, field, val) {
      const next = [...list];
      next[i] = { ...next[i], [field]: val };
      updateSetting('PROJEKTKOSTEN_STAFFEL', next);
    }
    function removeRow(i) {
      updateSetting('PROJEKTKOSTEN_STAFFEL', list.filter((_, idx) => idx !== i));
    }
    function addRow() {
      updateSetting('PROJEKTKOSTEN_STAFFEL', [...list, { maxMod: 0, arch: 0, eing: 0, pm: 0 }]);
    }
    function sortByMax() {
      // Stufen mit maxMod=null ans Ende
      const sorted = [...list].sort((a, b) => {
        if (a.maxMod == null) return 1;
        if (b.maxMod == null) return -1;
        return Number(a.maxMod) - Number(b.maxMod);
      });
      updateSetting('PROJEKTKOSTEN_STAFFEL', sorted);
    }

    return (
      <div className="bg-white border border-[#1C1C1A]/10 p-6">
        <div className="flex items-end justify-between mb-4 gap-4 flex-wrap">
          <div>
            <p className="font-body text-base text-[#1C1C1A] mb-1">Projektkostenstaffel</p>
            <p className="font-body text-xs text-[#6B6961] max-w-2xl">
              Pflichtkosten für Architektur / Eingabeplanung / Projektmanagement. Pro Stufe gilt: bis zur angegebenen Modulanzahl wird der jeweilige Pauschalbetrag verrechnet. Die letzte Stufe (mit leerer Modulanzahl = „unbegrenzt") gilt für alle Anzahlen oberhalb der vorletzten Stufe. Werte sind netto in €.
            </p>
          </div>
          {changed && <span className="font-body text-[10px] text-[#7B2D8E] uppercase tracking-wider whitespace-nowrap">geändert</span>}
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 px-2 font-body text-[10px] tracking-wider uppercase text-[#6B6961]">
            <div>Bis Modulanzahl</div>
            <div>Architektur (€)</div>
            <div>Eingabeplanung (€)</div>
            <div>Projektmgmt. (€)</div>
            <div></div>
          </div>
          {list.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-center">
              <input type="number" value={row.maxMod ?? ''}
                placeholder="unbegrenzt"
                onChange={e => updateRow(i, 'maxMod', e.target.value === '' ? null : Number(e.target.value))}
                className={`bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] num ${NO_SPINNER}`} />
              <input type="number" value={row.arch ?? 0}
                onChange={e => updateRow(i, 'arch', Number(e.target.value) || 0)}
                className={`bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] num ${NO_SPINNER}`} />
              <input type="number" value={row.eing ?? 0}
                onChange={e => updateRow(i, 'eing', Number(e.target.value) || 0)}
                className={`bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] num ${NO_SPINNER}`} />
              <input type="number" value={row.pm ?? 0}
                onChange={e => updateRow(i, 'pm', Number(e.target.value) || 0)}
                className={`bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] num ${NO_SPINNER}`} />
              <button onClick={() => removeRow(i)} title="Zeile entfernen"
                className="text-[#C5392E]/60 hover:text-[#C5392E] p-1.5">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button onClick={addRow} className="font-body text-xs tracking-wider uppercase border border-[#1C1C1A]/15 text-[#6B6961] hover:text-[#1C1C1A] hover:border-[#1C1C1A]/30 px-3 py-1.5 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Stufe hinzufügen
          </button>
          {list.length > 1 && (
            <button onClick={sortByMax} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-2 py-1.5">
              Nach Modulanzahl sortieren
            </button>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-[#1C1C1A]/10 font-body text-[11px] text-[#6B6961] italic">
          Tipp: Die letzte Stufe (leeres Feld „Bis Modulanzahl") wirkt als „über alle Schwellen hinaus". Wenn keine offene Stufe vorhanden ist, gilt die höchste begrenzte Stufe als Maximum.
        </div>
      </div>
    );
  }

  // Grundstücks-Optionen: 4 Posten (Abriss, Erschließung, Wege, Begrünung).
  // Master-Admin kann Label und Netto-Wert ändern. bezug/anteil sind Logik-Felder (read-only Anzeige).
  function renderGrundstueckskosten() {
    const list = Array.isArray(settings.GRDST_OPTIONEN) ? settings.GRDST_OPTIONEN : [];
    const orig = original.GRDST_OPTIONEN;
    const changed = JSON.stringify(list) !== JSON.stringify(orig);

    function updateRow(i, field, val) {
      const next = [...list];
      next[i] = { ...next[i], [field]: val };
      updateSetting('GRDST_OPTIONEN', next);
    }

    return (
      <div className="bg-white border border-[#1C1C1A]/10 p-6">
        <div className="flex items-end justify-between mb-4 gap-4 flex-wrap">
          <div>
            <p className="font-body text-base text-[#1C1C1A] mb-1">Grundstückskosten</p>
            <p className="font-body text-xs text-[#6B6961] max-w-2xl">
              Die vier kundenseitig wählbaren Posten. Werte sind <strong>netto in € pro m²</strong>. Bezug auf <em>Grundstück</em> = volle Grundstücksfläche, Bezug auf <em>Freifläche</em> = Grundstück minus Gebäudefläche (anteilig auf Wege und Begrünung verteilt, üblicherweise 30 / 70).
            </p>
          </div>
          {changed && <span className="font-body text-[10px] text-[#7B2D8E] uppercase tracking-wider whitespace-nowrap">geändert</span>}
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 px-2 font-body text-[10px] tracking-wider uppercase text-[#6B6961]">
            <div>Bezeichnung</div>
            <div>Netto € / m²</div>
            <div>Bezug</div>
            <div>Anteil</div>
          </div>
          {list.map((row, i) => (
            <div key={row.id || i} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 items-center">
              <input type="text" value={row.label ?? ''}
                onChange={e => updateRow(i, 'label', e.target.value)}
                className="bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
              <div className="flex items-center gap-2">
                <input type="number" value={row.netto ?? 0}
                  onChange={e => updateRow(i, 'netto', Number(e.target.value) || 0)}
                  className={`flex-1 bg-[#F8F5F0] border border-[#1C1C1A]/10 px-2 py-1.5 font-body text-sm focus:outline-none focus:border-[#D2563E] num ${NO_SPINNER}`} />
                <span className="font-body text-xs text-[#6B6961]">€/m²</span>
              </div>
              <div className="font-body text-xs text-[#6B6961]">
                {row.bezug === 'grundstueck' ? 'Grundstücksfläche' : 'Freifläche'}
              </div>
              <div className="font-body text-xs text-[#6B6961] num">
                {row.bezug === 'freiflaeche' && row.anteil != null ? `${Math.round(row.anteil * 100)} %` : '100 %'}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#1C1C1A]/10 font-body text-[11px] text-[#6B6961] italic">
          Hinweis: Bezug und Anteil sind Logik-Felder und werden über die DB gepflegt (z. B. bei Bedarf via SQL). Im Konfigurator werden die Posten als Checkboxen angeboten, die Berechnung erfolgt anhand der Grundstücks- und Gebäudefläche.
        </div>
      </div>
    );
  }

  const activeDefs = (activeCat === 'rabatt' || activeCat === 'projektkosten' || activeCat === 'grundstueck') ? [] : SETTING_DEFS.filter(d => d.cat === activeCat);

  return (
    <div>
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl tracking-tight mb-2">Settings</h1>
          <p className="font-body text-sm text-[#6B6961]">
            Globale Konstanten — wirken auf alle Workspaces und Projekte
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {isDirty && <span className="font-body text-xs text-[#7B2D8E] uppercase tracking-wider">{dirtyKeys.length} ungespeicherte Änderung{dirtyKeys.length === 1 ? '' : 'en'}</span>}
          {saved && <span className="font-body text-xs text-[#7FB069] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Gespeichert</span>}
          {isDirty && (
            <button onClick={resetChanges} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-3 py-2">Verwerfen</button>
          )}
          <button onClick={loadAll} disabled={isDirty} title={isDirty ? 'Erst speichern oder verwerfen' : ''}
            className={`font-body text-xs tracking-wider uppercase px-3 py-2 border ${isDirty ? 'text-[#6B6961]/40 border-[#1C1C1A]/5 cursor-not-allowed' : 'text-[#6B6961] hover:text-[#1C1C1A] border-[#1C1C1A]/10 hover:border-[#1C1C1A]/30'}`}>
            Neu laden
          </button>
          <Button onClick={saveAll} disabled={!isDirty || saving}>
            {saving ? 'Speichere …' : 'Alle Änderungen speichern'}
          </Button>
        </div>
      </div>

      {/* Netto/Brutto-Hinweis */}
      <div className="bg-[#F4ECF6]/40 border-l-4 border-[#7B2D8E]/40 px-4 py-3 mb-6 font-body text-xs text-[#6B6961]">
        <span className="text-[#7B2D8E] font-medium">Hinweis:</span> Alle €-Werte sind <strong>netto</strong> einzugeben.
        Umsatzsteuer (USt) und Provision werden in den Berechnungen automatisch aufgeschlagen.
        Prozent-Felder akzeptieren Komma und Punkt (z. B. "5,75" oder "5.75").
      </div>

      <div className="flex flex-wrap items-center gap-1 mb-6 border-b border-[#1C1C1A]/10">
        {SETTING_CATEGORIES.map(c => {
          const catDirty = c.key === 'rabatt'
            ? (JSON.stringify(settings.RABATT_STAFFEL) !== JSON.stringify(original.RABATT_STAFFEL))
            : c.key === 'projektkosten'
            ? (JSON.stringify(settings.PROJEKTKOSTEN_STAFFEL) !== JSON.stringify(original.PROJEKTKOSTEN_STAFFEL))
            : c.key === 'grundstueck'
            ? (JSON.stringify(settings.GRDST_OPTIONEN) !== JSON.stringify(original.GRDST_OPTIONEN))
            : SETTING_DEFS.filter(d => d.cat === c.key).some(d => JSON.stringify(settings[d.key]) !== JSON.stringify(original[d.key]));
          return (
            <button key={c.key} onClick={() => setActiveCat(c.key)}
              className={`font-body text-sm tracking-wider uppercase px-4 py-2 border-b-2 transition-colors -mb-px ${activeCat === c.key ? 'border-[#D2563E] text-[#1C1C1A]' : 'border-transparent text-[#6B6961] hover:text-[#1C1C1A]'}`}>
              {c.label}
              {catDirty && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#7B2D8E]" />}
            </button>
          );
        })}
      </div>

      {error && <div className="bg-[#FAE5E2] border border-[#C5392E]/30 p-4 mb-4 font-body text-sm text-[#C5392E]">Fehler: {error}</div>}

      {loading ? (
        <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center font-body text-sm text-[#6B6961]">Lade Settings …</div>
      ) : activeCat === 'rabatt' ? (
        renderRabattStaffel()
      ) : activeCat === 'projektkosten' ? (
        renderProjektkostenStaffel()
      ) : activeCat === 'grundstueck' ? (
        renderGrundstueckskosten()
      ) : (
        <div className="bg-white border border-[#1C1C1A]/10 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
            {activeDefs.map(def => (
              <div key={def.key} className="grid grid-cols-[1.4fr_1fr] gap-4 items-start">
                <div>
                  <p className="font-body text-sm text-[#1C1C1A]">{def.label}</p>
                  <p className="font-body text-xs text-[#6B6961] mt-0.5">{def.desc}</p>
                  <p className="font-body text-[10px] text-[#6B6961]/60 mt-0.5 font-mono">{def.key}</p>
                </div>
                {renderSettingInput(def)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   ADMIN · BACKUPS (Config-Snapshots, Phase 1: erstellen · auflisten · exportieren)
   Snapshot = JSON-Abzug der 6 Konfig-Tabellen. Kundendaten (leads etc.) bleiben aussen vor.
   In-App-Restore folgt in Phase 2; vorerst exportiert man das JSON und stellt manuell wieder her.
   ============================================================================ */

const SNAPSHOT_TABLES = ['settings', 'projects', 'modules', 'module_visibility', 'fassaden_varianten', 'content_blocks'];
const SNAPSHOT_TABLE_LABELS = {
  settings: 'Settings', projects: 'Projekte', modules: 'Module',
  module_visibility: 'Sichtbarkeiten', fassaden_varianten: 'Fassaden', content_blocks: 'Texte',
};

function AdminBackupsView({ authUser, authProfile }) {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [creating, setCreating]   = useState(false);
  const [label, setLabel]         = useState('');
  const [exportingId, setExportingId] = useState(null);

  const isMaster = authProfile?.role === 'master_admin';

  // Liste OHNE payload laden (payload kann gross sein) — payload wird erst beim Export nachgeholt.
  async function loadAll() {
    setLoading(true); setError(null);
    const { data, error } = await supabase
      .from('config_snapshots')
      .select('id, label, created_at, created_by_email, app_version, counts')
      .order('created_at', { ascending: false });
    if (error) { setError(error.message); setLoading(false); return; }
    setSnapshots(data || []);
    setLoading(false);
  }
  useEffect(() => { loadAll(); }, []);

  async function createSnapshot() {
    setCreating(true); setError(null);
    try {
      const results = await Promise.all(SNAPSHOT_TABLES.map(t => supabase.from(t).select('*')));
      const errIdx = results.findIndex(r => r.error);
      if (errIdx !== -1) {
        setError(`Tabelle „${SNAPSHOT_TABLES[errIdx]}" konnte nicht gelesen werden: ${results[errIdx].error.message}`);
        setCreating(false); return;
      }
      const payload = {};
      const counts = {};
      SNAPSHOT_TABLES.forEach((t, i) => {
        const rows = results[i].data || [];
        payload[t] = rows;
        counts[t] = rows.length;
      });
      const ins = await supabase.from('config_snapshots').insert({
        label: label.trim() || null,
        app_version: APP_VERSION,
        created_by_email: authUser?.email || null,
        counts,
        payload,
      }).select('id, label, created_at, created_by_email, app_version, counts').single();
      if (ins.error) { setError(`Snapshot konnte nicht gespeichert werden: ${ins.error.message}`); setCreating(false); return; }
      setLabel('');
      setSnapshots(prev => [ins.data, ...prev]);
      setCreating(false);
    } catch (e) {
      setError(e.message || 'Unbekannter Fehler'); setCreating(false);
    }
  }

  async function exportSnapshot(snap) {
    setExportingId(snap.id); setError(null);
    const { data, error } = await supabase.from('config_snapshots').select('*').eq('id', snap.id).single();
    if (error) { setError('Export fehlgeschlagen: ' + error.message); setExportingId(null); return; }
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const d = new Date(data.created_at);
      const p2 = (n) => String(n).padStart(2, '0');
      const stamp = `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}_${p2(d.getHours())}${p2(d.getMinutes())}`;
      const safeLabel = (data.label || 'snapshot').replace(/[^a-z0-9-_]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'snapshot';
      const a = document.createElement('a');
      a.href = url;
      a.download = `comod-config_${stamp}_${safeLabel}.json`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError('Export fehlgeschlagen: ' + (e.message || 'Unbekannter Fehler'));
    }
    setExportingId(null);
  }

  const fmtDateTime = (s) => { try { return new Date(s).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return s; } };
  const countsSummary = (counts) => {
    if (!counts || typeof counts !== 'object') return '';
    return SNAPSHOT_TABLES.filter(t => counts[t] != null).map(t => `${counts[t]} ${SNAPSHOT_TABLE_LABELS[t]}`).join(' · ');
  };
  const countsTotal = (counts) => {
    if (!counts || typeof counts !== 'object') return 0;
    return SNAPSHOT_TABLES.reduce((sum, t) => sum + (Number(counts[t]) || 0), 0);
  };

  if (!isMaster) {
    return (
      <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center font-body text-sm text-[#6B6961]">
        Backups sind nur für Master-Admins verfügbar.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl tracking-tight mb-2">Backups</h1>
          <p className="font-body text-sm text-[#6B6961]">
            Konfigurations-Snapshots als Wiederherstellungspunkt — {snapshots.length} {snapshots.length === 1 ? 'Snapshot' : 'Snapshots'}
          </p>
        </div>
        <button onClick={loadAll} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-3 py-2 border border-[#1C1C1A]/10 hover:border-[#1C1C1A]/30">Neu laden</button>
      </div>

      {/* Snapshot erstellen */}
      <div className="bg-white border border-[#1C1C1A]/10 p-6 mb-6">
        <p className="font-body text-xs uppercase tracking-wider text-[#6B6961] mb-3">Neuen Snapshot erstellen</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text" value={label} onChange={e => setLabel(e.target.value)}
            placeholder="Bezeichnung (optional, z. B. „vor Rabattstaffel-Umbau“)"
            maxLength={120}
            className="flex-1 bg-[#F8F5F0] border border-[#1C1C1A]/10 px-3 py-2 font-body text-sm focus:outline-none focus:border-[#D2563E]" />
          <button
            onClick={createSnapshot} disabled={creating}
            className="font-body text-xs tracking-wider uppercase bg-[#D2563E] hover:bg-[#B04528] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 flex items-center justify-center gap-2 shrink-0">
            <Cloud className="w-3.5 h-3.5" /> {creating ? 'Sichere …' : 'Snapshot erstellen'}
          </button>
        </div>
        <p className="font-body text-[11px] leading-relaxed text-[#6B6961] mt-3">
          Sichert den aktuellen Stand von <span className="font-mono">{SNAPSHOT_TABLES.join(', ')}</span>. Kundendaten (Leads) sind bewusst nicht enthalten.
          Wiederherstellen erfolgt vorerst manuell über den JSON-Export — die In-App-Wiederherstellung kommt in einem späteren Schritt.
        </p>
      </div>

      {error && (
        <div className="bg-white border border-[#C5392E]/30 p-4 mb-6"><p className="font-body text-sm text-[#C5392E]">{error}</p></div>
      )}

      {loading ? (
        <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center font-body text-sm text-[#6B6961]">Lade Snapshots …</div>
      ) : snapshots.length === 0 ? (
        <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center">
          <p className="font-display text-xl text-[#6B6961]">Noch keine Snapshots<span className="opacity-50"> …</span></p>
          <p className="font-body text-sm text-[#6B6961] mt-2">Erstelle oben deinen ersten Wiederherstellungspunkt.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#1C1C1A]/10">
          {snapshots.map((s, idx) => (
            <div key={s.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 ${idx !== snapshots.length - 1 ? 'border-b border-[#1C1C1A]/5' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-body text-sm text-[#1C1C1A]">{s.label || <span className="text-[#6B6961] italic">ohne Bezeichnung</span>}</p>
                  {s.app_version && <span className="font-mono text-[10px] text-[#6B6961] border border-[#1C1C1A]/10 px-1.5 py-0.5">v{s.app_version}</span>}
                </div>
                <p className="font-body text-xs text-[#6B6961] mt-1">
                  {fmtDateTime(s.created_at)}{s.created_by_email ? ` · ${s.created_by_email}` : ''}
                </p>
                <p className="font-body text-[11px] text-[#6B6961]/80 mt-0.5">
                  <span className="num">{countsTotal(s.counts)}</span> Zeilen — {countsSummary(s.counts)}
                </p>
              </div>
              <button
                onClick={() => exportSnapshot(s)} disabled={exportingId === s.id}
                className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-3 py-2 border border-[#1C1C1A]/10 hover:border-[#1C1C1A]/30 disabled:opacity-50 shrink-0 flex items-center gap-1.5 self-start sm:self-auto">
                <FolderOpen className="w-3.5 h-3.5" /> {exportingId === s.id ? 'Export …' : 'JSON exportieren'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   ADMIN · TEXTE (content_blocks-Editor, Ebene A: CRUD)
   Pflegt die Text-Blöcke in der DB. Hinweis: Die Texte werden derzeit noch
   nicht automatisch in der App ausgespielt — das ist die separate Verdrahtung.
   ============================================================================ */

function AdminContentBlockEdit({ block, authUser, onClose, onSaved, onDeleted }) {
  const isNew = !block;
  const [form, setForm] = useState(() => ({
    key: '', description: '', content_de: '', content_en: '', workspace_id: null,
    ...(block || {}),
  }));
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]     = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const update = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const inputCls = 'w-full bg-[#F8F5F0] border border-[#1C1C1A]/10 px-3 py-2 font-body text-sm focus:outline-none focus:border-[#D2563E]';

  async function save() {
    setError(null);
    if (!form.key || !form.key.trim()) { setError('Der Schlüssel (key) darf nicht leer sein.'); return; }
    setSaving(true);
    const payload = {
      key: form.key.trim(),
      description: form.description?.trim() || null,
      content_de: form.content_de ?? null,
      content_en: (form.content_en && form.content_en.trim()) ? form.content_en : null,
      workspace_id: form.workspace_id ?? null,
      updated_at: new Date().toISOString(),
      updated_by: authUser?.id || null,
    };
    let res;
    if (isNew) res = await supabase.from('content_blocks').insert(payload).select('*').single();
    else       res = await supabase.from('content_blocks').update(payload).eq('id', block.id).select('*').single();
    if (res.error) { setError(res.error.message); setSaving(false); return; }
    setSaving(false);
    onSaved(res.data);
  }

  async function del() {
    if (!block) return;
    setDeleting(true); setError(null);
    const { error } = await supabase.from('content_blocks').delete().eq('id', block.id);
    if (error) { setError(error.message); setDeleting(false); return; }
    onDeleted(block.id);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 sm:py-8" onClick={onClose}>
      <div className="bg-white max-w-3xl w-full" onClick={e => e.stopPropagation()}
        style={{ maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto', overflowX: 'hidden' }}>
        <div className="flex items-start justify-between p-8 border-b border-[#1C1C1A]/10">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-2">{isNew ? 'Neuer Textblock' : 'Textblock bearbeiten'}</p>
            <h2 className="font-display text-3xl tracking-tight font-mono">{form.key || 'neu'}</h2>
          </div>
          <button onClick={onClose} className="text-[#6B6961] hover:text-[#1C1C1A] p-2"><Plus className="w-5 h-5 rotate-45" /></button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Schlüssel (key)</label>
              <input type="text" value={form.key ?? ''} onChange={update('key')} className={`${inputCls} font-mono`} placeholder="z. B. footer_disclaimer" />
              <p className="font-body text-[10px] text-[#6B6961] mt-1">Eindeutiger Bezeichner — wird später im Code referenziert. Bei bestehenden Blöcken nur ändern, wenn nötig.</p>
            </div>
            <div>
              <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Beschreibung (intern)</label>
              <input type="text" value={form.description ?? ''} onChange={update('description')} className={inputCls} placeholder="Wo/wofür wird der Text verwendet?" />
            </div>
          </div>

          <div>
            <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Inhalt (Deutsch)</label>
            <textarea value={form.content_de ?? ''} onChange={update('content_de')} rows={7} className={`${inputCls} leading-relaxed resize-y`} />
          </div>

          <div>
            <label className="font-body text-[10px] tracking-wider uppercase text-[#6B6961] block mb-1">Inhalt (Englisch) — optional</label>
            <textarea value={form.content_en ?? ''} onChange={update('content_en')} rows={4} className={`${inputCls} leading-relaxed resize-y`} placeholder="Noch nicht gepflegt — leer lassen, falls nicht benötigt." />
          </div>

          {error && <div className="bg-[#C5392E]/5 border border-[#C5392E]/30 p-3"><p className="font-body text-sm text-[#C5392E]">{error}</p></div>}
        </div>

        <div className="flex items-center justify-between p-8 border-t border-[#1C1C1A]/10 gap-4 flex-wrap">
          <div>
            {!isNew && (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="font-body text-xs text-[#C5392E]">Wirklich löschen?</span>
                  <button onClick={del} disabled={deleting} className="font-body text-xs tracking-wider uppercase bg-[#C5392E] text-white px-3 py-2 disabled:opacity-50">{deleting ? 'Lösche …' : 'Ja, löschen'}</button>
                  <button onClick={() => setConfirmDelete(false)} className="font-body text-xs tracking-wider uppercase text-[#6B6961] px-3 py-2">Abbrechen</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)} className="font-body text-xs tracking-wider uppercase text-[#C5392E] hover:text-[#A12C23] px-3 py-2 flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Löschen</button>
              )
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-4 py-2.5">Abbrechen</button>
            <button onClick={save} disabled={saving} className="font-body text-xs tracking-wider uppercase bg-[#D2563E] hover:bg-[#B04528] disabled:opacity-50 text-white px-5 py-2.5 flex items-center gap-2"><Check className="w-3.5 h-3.5" /> {saving ? 'Speichere …' : 'Speichern'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminContentBlocksView({ authUser, authProfile }) {
  const [blocks, setBlocks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [editing, setEditing] = useState(undefined); // undefined = zu, null = neu, Objekt = bearbeiten
  const isMaster = authProfile?.role === 'master_admin';

  async function loadAll() {
    setLoading(true); setError(null);
    const { data, error } = await supabase.from('content_blocks').select('*').order('key', { ascending: true });
    if (error) { setError(error.message); setLoading(false); return; }
    setBlocks(data || []);
    setLoading(false);
  }
  useEffect(() => { loadAll(); }, []);

  function handleSaved(row) {
    setBlocks(prev => {
      const exists = prev.some(b => b.id === row.id);
      const next = exists ? prev.map(b => b.id === row.id ? row : b) : [...prev, row];
      return next.sort((a, b) => (a.key || '').localeCompare(b.key || ''));
    });
    setEditing(undefined);
  }
  function handleDeleted(id) { setBlocks(prev => prev.filter(b => b.id !== id)); setEditing(undefined); }

  const fmtDate = (s) => { try { return new Date(s).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return ''; } };
  const preview = (t) => { const s = (t || '').trim(); return s.length > 160 ? s.slice(0, 160) + ' …' : s; };

  if (!isMaster) {
    return <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center font-body text-sm text-[#6B6961]">Der Texte-Editor ist nur für Master-Admins verfügbar.</div>;
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl tracking-tight mb-2">Texte</h1>
          <p className="font-body text-sm text-[#6B6961]">{blocks.length} {blocks.length === 1 ? 'Textblock' : 'Textblöcke'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadAll} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-3 py-2 border border-[#1C1C1A]/10 hover:border-[#1C1C1A]/30">Neu laden</button>
          <button onClick={() => setEditing(null)} className="font-body text-xs tracking-wider uppercase bg-[#D2563E] hover:bg-[#B04528] text-white px-4 py-2 flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Neuer Block</button>
        </div>
      </div>

      <div className="bg-[#A87DAE]/5 border border-[#A87DAE]/30 p-4 mb-6">
        <p className="font-body text-[12px] leading-relaxed text-[#6B6961]">
          Hinweis: Diese Texte werden aktuell noch <span className="text-[#1C1C1A]">nicht automatisch</span> in der App ausgespielt — die entsprechenden Stellen nutzen vorerst weiter die fest hinterlegten Texte. Das Ausspielen (Verdrahtung) ist der nächste, separate Schritt.
        </p>
      </div>

      {loading ? (
        <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center font-body text-sm text-[#6B6961]">Lade Textblöcke …</div>
      ) : error ? (
        <div className="bg-white border border-[#C5392E]/30 p-8"><p className="font-body text-sm text-[#C5392E]">Fehler: {error}</p></div>
      ) : blocks.length === 0 ? (
        <div className="bg-white border border-[#1C1C1A]/10 p-16 text-center"><p className="font-display text-xl text-[#6B6961]">Noch keine Textblöcke<span className="opacity-50"> …</span></p></div>
      ) : (
        <div className="bg-white border border-[#1C1C1A]/10">
          {blocks.map((b, idx) => (
            <button key={b.id} onClick={() => setEditing(b)}
              className={`w-full text-left px-5 py-4 ${idx !== blocks.length - 1 ? 'border-b border-[#1C1C1A]/5' : ''} hover:bg-[#F8F5F0]/50 transition-colors`}>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-mono text-sm text-[#1C1C1A]">{b.key}</span>
                {b.description && <span className="font-body text-xs text-[#6B6961]">· {b.description}</span>}
              </div>
              <p className="font-body text-sm text-[#1C1C1A]/70 leading-relaxed">{preview(b.content_de)}</p>
              <p className="font-body text-[10px] text-[#6B6961]/70 mt-1.5">{b.content_en ? 'DE + EN' : 'nur DE'}{b.updated_at ? ` · zuletzt ${fmtDate(b.updated_at)}` : ''}</p>
            </button>
          ))}
        </div>
      )}

      {editing !== undefined && <AdminContentBlockEdit block={editing} authUser={authUser} onClose={() => setEditing(undefined)} onSaved={handleSaved} onDeleted={handleDeleted} />}
    </div>
  );
}

function AdminPanel({ authUser, authProfile }) {
  const [tab, setTab] = useState('leads'); // 'leads' | 'modules' | 'projects' | 'settings' | 'backups'
  async function logout() { await supabase.auth.signOut(); }
  const tabs = [
    { key: 'leads',    label: 'Leads' },
    { key: 'modules',  label: 'Module' },
    { key: 'projects', label: 'Projekte' },
    { key: 'settings', label: 'Settings' },
    ...(authProfile?.role === 'master_admin' ? [{ key: 'texte', label: 'Texte' }, { key: 'backups', label: 'Backups' }] : []),
  ];
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[#6B6961] mb-3">
            Admin · {authProfile?.role === 'master_admin' ? 'Master' : 'Partner'} · {authUser?.email}
          </p>
          <div className="flex items-center gap-1 -ml-1">
            {tabs.map(t => (
              <button key={t.key} onClick={() => !t.disabled && setTab(t.key)} disabled={t.disabled}
                className={`font-body text-sm tracking-wider uppercase px-4 py-2 border-b-2 transition-colors ${tab === t.key ? 'border-[#D2563E] text-[#1C1C1A]' : t.disabled ? 'border-transparent text-[#6B6961]/50 cursor-not-allowed' : 'border-transparent text-[#6B6961] hover:text-[#1C1C1A]'}`}>
                {t.label}{t.disabled && <span className="ml-1 text-[10px] text-[#6B6961]">·bald</span>}
              </button>
            ))}
          </div>
        </div>
        <button onClick={logout} className="font-body text-xs tracking-wider uppercase text-[#6B6961] hover:text-[#1C1C1A] px-3 py-2">Abmelden</button>
      </div>

      {tab === 'leads'    && <AdminLeadsView authUser={authUser} authProfile={authProfile} />}
      {tab === 'modules'  && <AdminModulesView authProfile={authProfile} />}
      {tab === 'projects' && <AdminProjectsView />}
      {tab === 'settings' && <AdminSettingsView />}
      {tab === 'backups'  && <AdminBackupsView authUser={authUser} authProfile={authProfile} />}
      {tab === 'texte'    && <AdminContentBlocksView authUser={authUser} authProfile={authProfile} />}
    </div>
  );
}

function AdminGate({ authUser, authProfile }) {
  if (authUser === null) {
    return <div className="max-w-md mx-auto px-8 py-20 font-body text-sm text-[#6B6961]">Lade Session …</div>;
  }
  if (!authUser) return <AdminLogin />;
  if (!authProfile) return <div className="max-w-md mx-auto px-8 py-20 font-body text-sm text-[#6B6961]">Lade Profil …</div>;
  return <AdminPanel authUser={authUser} authProfile={authProfile} />;
}


/* ============================================================================
   MAIN APP
   ============================================================================ */

const EMPTY_GEWERB_CONFIG = {
  flaecheStatus: null,
  grundstueckGroesse: 0,
  gewuenschteModulAnzahl: 0,
  geschosse: 0,
  zielModulAnzahl: 0,
  geschossVerteilung: [],
  pvAnteil: 0, // 0 = keine PV, 0.5 = 50%, 1 = 100% der Dachfläche
  detailKosten: null,
  hasPacht: null, pachtJahr: 0, pachtGewerblich: null,
  activeOptionen: { abriss: false, erschl: false, wege: false, gruen: false },
};

export default function App() {
  const [view, setView] = useState('customer');
  const [step, setStep] = useState(0);

  // Supabase-Anbindung: Module aus DB laden (Fallback auf hartcodiert bei Fehler).
  // dbStatus: 'loading' → 'db' (DB erfolgreich geladen) | 'fallback' (hartcodierte Daten)
  // _productsTick: erzwingt Re-Render wenn DB-Module geladen sind (PRODUCTS ist let-Variable)
  const [dbStatus, setDbStatus] = useState('loading');
  const [_productsTick, setProductsTick] = useState(0);
  useEffect(() => {
    let cancelled = false;
    // Module + Projekte + Settings parallel laden — alle ersetzen Fallback-Daten bei Erfolg
    Promise.all([loadProductsFromDb(), loadProjectsFromDb(), loadSettingsFromDb(), loadContentBlocksFromDb()]).then(([modOk, projOk, setOk, cbOk]) => {
      if (cancelled) return;
      // dbStatus = 'db' nur wenn alle drei Kern-Loader geklappt haben (sonst zeigt der Footer 'fallback' an)
      // cbOk bewusst NICHT einbezogen — Texte haben einen eigenen Fallback und sollen keinen DB-Warnhinweis auslösen
      setDbStatus((modOk && projOk && setOk) ? 'db' : 'fallback');
      // Re-Render in jedem Fall, damit zumindest die teilweise geladenen Daten sichtbar werden
      setProductsTick(t => t + 1);
    });
    return () => { cancelled = true; };
  }, []);

  // === Auth-State für Admin-Bereich ===
  // null = noch nicht geprüft, false = nicht eingeloggt, object = eingeloggter User mit Profil
  const [authUser, setAuthUser] = useState(null);
  const [authProfile, setAuthProfile] = useState(null);
  useEffect(() => {
    let cancelled = false;
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session?.user) {
        setAuthUser(session.user);
        // Profil laden für Rolle + workspace_id
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (!cancelled) setAuthProfile(profile);
      } else {
        setAuthUser(false);
        setAuthProfile(null);
      }
    }
    checkSession();
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setAuthUser(session.user);
        const { data: profile } = await supabase
          .from('user_profiles').select('*').eq('id', session.user.id).single();
        setAuthProfile(profile);
      } else {
        setAuthUser(false);
        setAuthProfile(null);
      }
    });
    return () => { cancelled = true; sub?.subscription?.unsubscribe(); };
  }, []);

  // Scroll-to-Top bei jedem Schrittwechsel — sonst landet der User unten in der Sidebar
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);
  const [customerType, setCustomerType] = useState(null);
  const [privatMode, setPrivatMode] = useState(null);
  const [project, setProject] = useState(null);
  const [gewerbConfig, setGewerbConfig] = useState(EMPTY_GEWERB_CONFIG);
  const [modulart, setModulart] = useState(null);
  const [selections, setSelections] = useState({});
  const [modes, setModes] = useState({});
  const [addUsageState, setAddUsageState] = useState('g');
  const [vermietungDurchCoMod, setVermietungDurchCoMod] = useState(false);
  const [mitarbeiterAnzahl, setMitarbeiterAnzahl] = useState(0); // 0 = nicht gesetzt → Anzahl Module als Default
  const [iabBetrag, setIabBetrag] = useState(0); // Investitionsabzugsbetrag (steuerlich, kein Cashflow)
  const [privatOptionen, setPrivatOptionen] = useState({ terrasse: false, pv: false, gruen: false }); // optionale Privat-Upgrades
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
    ekPrivat, ekGewerb, financing, vermietungDurchCoMod, privatOptionen, iabBetrag,
  }), [selections, modes, project, effectiveGewerbConfig, ekPrivat, ekGewerb, financing, vermietungDurchCoMod, privatOptionen, iabBetrag]);

  function handleTypeSelect(type) {
    // Bei Typ-Wechsel kompletter Reset der Modul-Auswahl, damit private/gewerbliche Pfade nicht vermischen
    setSelections({}); setModes({}); setAddUsageState('g');
    setEkPrivat(0); setEkGewerb(0); setFinancing(FIN_DEFAULTS); setVermietungDurchCoMod(false); setMitarbeiterAnzahl(0); setIabBetrag(0); setPrivatOptionen({ terrasse: false, pv: false, gruen: false });
    setCustomerType(type);
    if (type === 'privat') {
      setGewerbConfig(EMPTY_GEWERB_CONFIG); setModulart(null);
      setStep(0.3);
    } else {
      setProject(null); setPrivatMode(null); setGewerbConfig(EMPTY_GEWERB_CONFIG); setModulart(null);
      setStep(0.5);
    }
  }
  // Beim Zurückgehen zum Welcome-Screen: alle Auswahlen zurücksetzen, damit der nächste Pfad sauber startet
  function goToWelcome() {
    setSelections({}); setModes({}); setAddUsageState('g');
    setEkPrivat(0); setEkGewerb(0); setFinancing(FIN_DEFAULTS); setVermietungDurchCoMod(false); setMitarbeiterAnzahl(0); setIabBetrag(0); setPrivatOptionen({ terrasse: false, pv: false, gruen: false });
    setProject(null); setPrivatMode(null); setGewerbConfig(EMPTY_GEWERB_CONFIG); setModulart(null);
    setCustomerType(null);
    setStep(0);
  }
  function handlePrivatMode(mode) {
    setPrivatMode(mode);
    if (mode === 'projekt') setStep(0.4); else setStep(0.45);
  }
  function handleProjectSelect(p) { setProject(p); setStep(0.45); }
  function handleModulart(m) { setModulart(m); setStep(1); }
  function handleGewerbContinue() { setModulart('business'); setStep(1); }

  async function handleSubmit() {
    // Strukturierter Lead-Snapshot — Schema-Version für späteres Backend-Mapping
    const lead = {
      // META
      schemaVersion: '1.0',
      prototypVersion: '0.9.13',
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),

      // KONTAKT
      contact: {
        vorname: contact.vorname || '',
        nachname: contact.nachname || '',
        email: contact.email || '',
        telefon: contact.telefon || '',
        strasse: contact.strasse || '',
        hausnr: contact.hausnr || '',
        plz: contact.plz || '',
        ort: contact.ort || '',
        notiz: contact.notiz || '',
      },

      // KONFIGURATION
      pfad: {
        customerType, // 'privat' | 'gewerblich'
        privatMode,   // 'eigen' | 'projekt'
        modulart,     // 'privat' | 'business' | 'beides'
        project: project ? { id: project.id, name: project.name } : null,
        gewerbConfig: effectiveGewerbConfig, // enthält flaecheStatus, geschosse, zielModulAnzahl, geschossVerteilung, pvAnteil, pacht
      },

      // MODULE & FLÄCHEN
      module: {
        items: totals.lineItems.map(it => ({
          kuerzel: it.kuerzel,
          family: it.family,
          count: it.count,
          modulEinheiten: calcModulEinheiten(it),
          mode: it.mode,
          usage: it.usage,
          einnahmen: it.einnahmen,
          fee: it.fee,
          herst: it.herst,
          netto: it.netto,
          brutto: it.brutto,
        })),
        countTotal: totals.countTotal,
        countPrivat: totals.countPrivat,
        countGewerb: totals.countGewerb,
        einheitenTotal: totals.einheitenTotal,
        gesamtNUF: totals.gesamtNUF,
        gesamtBGF: totals.gesamtBGF,
        mindestflaeche: totals.mindestflaeche,
      },

      // FINANZWERTE
      finanzen: {
        rabattPct: totals.rabattPct,
        bruttoGesamt: totals.bruttoGesamt,
        effPrivat: totals.effPrivat,
        effGewerbNetto: totals.effGewerbNetto,
        einmaligGesamtBrutto: totals.einmaligGesamtBrutto,
        anzahlung: totals.anzahlung,
        kfwRate: totals.kfwRate,
        glsRate: totals.glsRate,
        plattformRate: totals.plattformRate,
        steuerentlastung: totals.steuerentlastung, // optionaler Indikationswert
        finanzierungMonat: totals.finanzierungMonat,
        nebenkostenMonatGesamt: totals.nebenkostenMonatGesamt,
        monatlichGesamt: totals.monatlichGesamt,
        monthlyIncomeBrutto: totals.monthlyIncomeBrutto,
        monthlyIncomeNetto: totals.monthlyIncomeNetto,
        cashflowNetto: totals.cashflowNetto,
        cashflowPositive: totals.cashflowPositive,
        vermietungDurchUns: vermietungDurchCoMod,
        ekPrivat: ekPrivat,
        ekGewerb: ekGewerb,
        financingParams: financing,
        mitarbeiterAnzahl: totals.eigennutzungGewerbCount > 0 ? totals.eigennutzungGewerbCount : null,
        iabBetrag: iabBetrag > 0 ? iabBetrag : null,
        privatOptionen: Object.entries(privatOptionen).filter(([_, v]) => v).map(([k]) => k),
        // Detail-Snapshot aller Einmal-Posten (Fundament, Terrasse, Treppen, Grundstück, Planung, Baugenehmigung)
        // Wird im Admin-Lead-Modal angezeigt für vollständige Nachvollziehbarkeit
        einmaligDetail: totals.einmaligDetail || null,
      },
    };
    try {
      const existing = localStorage.getItem('leads-list');
      const list = existing ? JSON.parse(existing) : [];
      list.push(lead);
      localStorage.setItem('leads-list', JSON.stringify(list));
      setLeads(list);
    } catch (e) { console.error('Storage failed:', e); }

    // === NEU: Lead zusätzlich in Supabase speichern ===
    // Mapping vom Frontend-Lead-Format auf das DB-Schema. Wenn DB nicht erreichbar,
    // läuft die Submission trotzdem durch (localStorage als Fallback bleibt aktiv).
    (async () => {
      try {
        // Projekt-ID via Slug-Lookup auflösen (Frontend nutzt Slugs wie 'voelk', DB UUIDs)
        let dbProjectId = null;
        if (lead.pfad?.project?.id) {
          const { data: pr } = await supabase
            .from('projects').select('id').eq('slug', lead.pfad.project.id).maybeSingle();
          if (pr?.id) dbProjectId = pr.id;
        }
        const dbLead = {
          workspace_id: '00000000-0000-0000-0000-000000000001', // CoMod-Default-Workspace
          project_id: dbProjectId,
          source_url: typeof window !== 'undefined' ? window.location.pathname : null,
          customer_type: lead.pfad?.customerType,
          privat_mode: lead.pfad?.privatMode,
          modulart: lead.pfad?.modulart,
          anrede: lead.contact?.anrede,
          vorname: lead.contact?.vorname,
          nachname: lead.contact?.nachname,
          email: lead.contact?.email,
          telefon: lead.contact?.telefon,
          firma: lead.contact?.firma,
          strasse: lead.contact?.strasse,
          hausnr: lead.contact?.hausnr,
          plz: lead.contact?.plz,
          ort: lead.contact?.ort,
          notiz: lead.contact?.notiz,
          modules_snapshot: lead.module,
          finanzen_snapshot: { ...(lead.finanzen || {}), project_name: lead.pfad?.project?.name || null, project_location: lead.pfad?.project?.location || null },
          gewerb_config_snapshot: lead.pfad?.gewerbConfig,
          angewandter_rabatt_pct: lead.finanzen?.rabattPct,
          angewandte_provision_pct: 0.035, // bis Provision pro Workspace in DB-Settings gelesen wird
          einmalig_gesamt: Math.round(lead.finanzen?.bruttoGesamt ?? 0),
          monatlich_gesamt: Math.round(lead.finanzen?.monatlichGesamt ?? 0),
          verbrauchskosten_monat: Math.round(lead.finanzen?.verbrauchskostenMonat ?? 0),
          einnahmen_monat: Math.round(lead.finanzen?.monthlyIncomeNetto ?? 0),
          modulanzahl_gesamt: lead.module?.countTotal ?? 0,
          nuf_gesamt: lead.module?.gesamtNUF ?? 0,
          bgf_gesamt: lead.module?.gesamtBGF ?? 0,
          status: 'neu',
          priority: 'normal',
        };
        const { data, error } = await supabase.from('leads').insert(dbLead).select('id').single();
        if (error) {
          console.warn('[Supabase] Lead-Insert Fehler:', error.message);
        } else {
          console.log('[Supabase] Lead in DB gespeichert, ID:', data?.id);
        }
      } catch (e) {
        console.warn('[Supabase] Lead-Insert Verbindungsfehler:', e.message);
      }
    })();

    setLastLead(lead);
    setStep(4);
  }

  function restart() {
    setStep(0); setCustomerType(null); setPrivatMode(null); setProject(null);
    setGewerbConfig(EMPTY_GEWERB_CONFIG); setModulart(null);
    setSelections({}); setModes({}); setFinancing(FIN_DEFAULTS);
    setEkPrivat(0); setEkGewerb(0); setContact({}); setLastLead(null);
    setVermietungDurchCoMod(false); setMitarbeiterAnzahl(0); setIabBetrag(0); setPrivatOptionen({ terrasse: false, pv: false, gruen: false }); setAddUsageState('g');
  }
  function jumpToStep(s) { if (s < Math.floor(step)) setStep(s); }
  function backFromModules() { setStep(0.45); }

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1C1C1A] font-body">
      <FontStyles />
      <Header step={Math.floor(step)} onJump={jumpToStep} view={view} setView={setView} />

      {view === 'admin' ? <AdminGate authUser={authUser} authProfile={authProfile} />
        : step === 0 ? <WelcomeStep onSelect={handleTypeSelect} />
        : step === 0.3 ? <PrivatModeStep onSelectMode={handlePrivatMode} onBack={goToWelcome} />
        : step === 0.4 ? <ProjectPickerStep selectedProject={project} onSelect={handleProjectSelect} onBack={() => setStep(0.3)} />
        : step === 0.45 ? <ModulartStep onSelect={handleModulart} onBack={() => {
            if (customerType === 'privat') {
              if (privatMode === 'projekt') setStep(0.4); else setStep(0.3);
            } else setStep(0.5);
          }} />
        : step === 0.5 ? <GewerbeConfigStep config={gewerbConfig} setConfig={setGewerbConfig} onContinue={handleGewerbContinue} onBack={goToWelcome} />
        : step === 1 ? <ModulesStep customerType={customerType} modulart={modulart} project={project} gewerbConfig={effectiveGewerbConfig} selections={selections} setSelections={setSelections} modes={modes} setModes={setModes} totals={totals} onNext={() => setStep(2)} onBack={backFromModules} addUsageState={addUsageState} setAddUsageState={setAddUsageState} />
        : step === 2 ? <FinancingStep totals={totals} project={project} gewerbConfig={effectiveGewerbConfig} financing={financing} setFinancing={setFinancing} ekPrivat={ekPrivat} setEkPrivat={setEkPrivat} ekGewerb={ekGewerb} setEkGewerb={setEkGewerb} vermietungDurchCoMod={vermietungDurchCoMod} setVermietungDurchCoMod={setVermietungDurchCoMod} mitarbeiterAnzahl={mitarbeiterAnzahl} setMitarbeiterAnzahl={setMitarbeiterAnzahl} iabBetrag={iabBetrag} setIabBetrag={setIabBetrag} privatOptionen={privatOptionen} setPrivatOptionen={setPrivatOptionen} onNext={() => setStep(3)} onBack={() => setStep(1)} />
        : step === 3 ? <SummaryStep totals={totals} customerType={customerType} modulart={modulart} project={project} gewerbConfig={effectiveGewerbConfig} contact={contact} setContact={setContact} onSubmit={handleSubmit} onBack={() => setStep(2)} />
        : step === 4 ? <SuccessStep lead={lastLead} onRestart={restart} />
        : null}

      <footer className="border-t border-[#1C1C1A]/10 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-8 font-body text-xs text-[#6B6961]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <p>CoMod Konfigurator — Prototyp v{APP_VERSION}</p>
              {/* DB-Status: dezenter Indikator, nur sichtbar wenn Fallback-Modus */}
              {dbStatus === 'fallback' && (
                <span className="inline-flex items-center gap-1 text-[10px] text-[#A87DAE]" title="DB nicht erreichbar — Tool nutzt lokale Backup-Daten">
                  <CloudOff className="w-3 h-3" /> offline
                </span>
              )}
              {dbStatus === 'db' && (
                <span className="inline-flex items-center gap-1 text-[10px] text-[#7FB069]/60" title="DB verbunden">
                  <Cloud className="w-3 h-3" /> live
                </span>
              )}
            </div>
            <p>Wohngesund, wertig & wunderschön<span className="opacity-50"> …</span></p>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed max-w-3xl">
            {getContentText('footer_disclaimer', 'Alle dargestellten Preise, Mieten, Förderbeträge, Zinssätze, Steuervorteile, Nebenkosten und behördliche Gebühren sind unverbindliche Modellrechnungen auf Basis aktueller Marktdaten und allgemeiner Annahmen (Baugenehmigung: Richtwert NRW — kann regional abweichen). Verbindliche Aussagen erhältst Du erst im persönlichen Angebot.')}
          </p>
        </div>
      </footer>
    </div>
  );
}
