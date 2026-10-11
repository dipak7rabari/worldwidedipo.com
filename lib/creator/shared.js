export const THEMES = [
  { id: 'lavender', name: 'Lavender Dream', background: '#eee5ff', foreground: '#31204f', card: '#ffffff' },
  { id: 'rose', name: 'Pink Pop', background: '#ffe2ed', foreground: '#602642', card: '#ffffff' },
  { id: 'midnight', name: 'Midnight', background: '#141625', foreground: '#f9f7ff', card: '#292b42' },
  { id: 'cream', name: 'Soft Minimal', background: '#f5f0e5', foreground: '#302c25', card: '#ffffff' },
  { id: 'ocean', name: 'Ocean Glow', background: '#d8f6f3', foreground: '#114c51', card: '#ffffff' },
];
export const LINK_LIMITS = { starter: 5, pro: 10, elite: 15 };
export function limitFor(plan) { return LINK_LIMITS[String(plan || '').toLowerCase()] || 5; }
export function themeFor(id) { return THEMES.find(theme => theme.id === id) || THEMES[0]; }
export function safeUrl(value) {
  try { const u = new URL(String(value || '').trim()); return ['https:', 'http:'].includes(u.protocol) && !u.username && !u.password ? u.href : ''; }
  catch { return ''; }
}
export function mediaUrl(value) { return typeof value === 'string' ? safeUrl(value) : safeUrl(value?.url); }
