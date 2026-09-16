import React, { useState, useMemo } from 'react';
import type { CanvasOverlay } from '../types';

// ─── Icon definitions ────────────────────────────────────────────────────────

export interface IconDef {
  id: string;
  label: string;
  category: 'news' | 'sports' | 'business' | 'social' | 'arrows';
  svg: string; // raw SVG path content
}

const ICONS: IconDef[] = [
  // ── News ──
  { id: 'mic', category: 'news', label: 'Microphone', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4m-4 0h8"/>' },
  { id: 'camera', category: 'news', label: 'Camera', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'breaking', category: 'news', label: 'Breaking Alert', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'newspaper', category: 'news', label: 'Newspaper', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z"/>' },
  { id: 'tv', category: 'news', label: 'TV / Broadcast', svg: '<rect x="2" y="7" width="20" height="15" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="17 2 12 7 7 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'radio', category: 'news', label: 'Radio', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/><circle cx="12" cy="12" r="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'live', category: 'news', label: 'Live Signal', svg: '<circle cx="12" cy="12" r="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.56 2.9A9.9 9.9 0 0 0 2 12a9.9 9.9 0 0 0 6.56 9.1M15.44 2.9A9.9 9.9 0 0 1 22 12a9.9 9.9 0 0 1-6.56 9.1"/>' },
  { id: 'flash', category: 'news', label: 'Flash / Alert', svg: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'globe', category: 'news', label: 'Globe / World', svg: '<circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' },
  { id: 'bell', category: 'news', label: 'Alert Bell', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.73 21a2 2 0 0 1-3.46 0"/>' },
  { id: 'eye', category: 'news', label: 'Eye / Watch', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'search', category: 'news', label: 'Search', svg: '<circle cx="11" cy="11" r="8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'megaphone', category: 'news', label: 'Megaphone', svg: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.54 8.46a5 5 0 0 1 0 7.07"/>' },
  { id: 'map-pin', category: 'news', label: 'Location / Map Pin', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'clock', category: 'news', label: 'Clock / Time', svg: '<circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'calendar', category: 'news', label: 'Calendar', svg: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'fire', category: 'news', label: 'Hot / Fire', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2c0 5-3.5 7.5-3.5 11a5.5 5.5 0 0 0 11 0c0-4-4-6-4-10.5C15.5 3 14 2 12 2z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18c0-2.5 2-3.5 2-5.5"/>' },
  { id: 'flag', category: 'news', label: 'Flag', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'tag', category: 'news', label: 'Tag / Label', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'link', category: 'news', label: 'Link', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' },

  // ── Sports ──
  { id: 'ball', category: 'sports', label: 'Ball', svg: '<circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M14.83 9.17l3.53 3.53M4.93 19.07l4.24-4.24"/>' },
  { id: 'trophy', category: 'sports', label: 'Trophy', svg: '<polyline points="14 8 14 2 10 2 10 8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 8h20v1a7 7 0 0 1-7 7h-6a7 7 0 0 1-7-7V8z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v6M8 22h8"/>' },
  { id: 'medal', category: 'sports', label: 'Medal', svg: '<circle cx="12" cy="15" r="7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/><polyline points="15 7 15 2 9 2 9 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'target', category: 'sports', label: 'Target', svg: '<circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><circle cx="12" cy="12" r="6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><circle cx="12" cy="12" r="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'activity', category: 'sports', label: 'Activity / Pulse', svg: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'zap', category: 'sports', label: 'Speed / Zap', svg: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'flag-sport', category: 'sports', label: 'Race Flag', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'heart', category: 'sports', label: 'Heart / Fitness', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' },
  { id: 'gauge', category: 'sports', label: 'Speed Gauge', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a10 10 0 1 0 10 10"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12l4.2-4.2"/><circle cx="12" cy="12" r="1"/>' },
  { id: 'star', category: 'sports', label: 'Star Player', svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'users', category: 'sports', label: 'Team', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 21v-2a4 4 0 0 0-3-3.87"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { id: 'shield', category: 'sports', label: 'Team Shield', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  { id: 'timer', category: 'sports', label: 'Stopwatch', svg: '<circle cx="12" cy="13" r="8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4l3 3"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 2h6M12 2v3"/>' },
  { id: 'award', category: 'sports', label: 'Award', svg: '<circle cx="12" cy="8" r="6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>' },
  { id: 'crosshair', category: 'sports', label: 'Crosshair', svg: '<circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="22" y1="12" x2="18" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="6" y1="12" x2="2" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="12" y1="6" x2="12" y2="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="12" y1="22" x2="12" y2="18" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'git-commit', category: 'sports', label: 'Score Dot', svg: '<circle cx="12" cy="12" r="4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="1.05" y1="12" x2="7" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="17.01" y1="12" x2="22.96" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'repeat', category: 'sports', label: 'Replay', svg: '<polyline points="17 1 21 5 17 9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13v2a4 4 0 0 1-4 4H3"/>' },
  { id: 'volleyball', category: 'sports', label: 'Volleyball', svg: '<circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12h20"/>' },
  { id: 'compass', category: 'sports', label: 'Compass', svg: '<circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'wind', category: 'sports', label: 'Wind / Speed', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>' },

  // ── Business ──
  { id: 'chart-line', category: 'business', label: 'Line Chart', svg: '<line x1="18" y1="20" x2="18" y2="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="12" y1="20" x2="12" y2="4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="6" y1="20" x2="6" y2="14" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="1 20 23 20" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'briefcase', category: 'business', label: 'Briefcase', svg: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>' },
  { id: 'dollar', category: 'business', label: 'Dollar Sign', svg: '<line x1="12" y1="1" x2="12" y2="23" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { id: 'trending-up', category: 'business', label: 'Trending Up', svg: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="17 6 23 6 23 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'trending-down', category: 'business', label: 'Trending Down', svg: '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="17 18 23 18 23 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'pie-chart', category: 'business', label: 'Pie Chart', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 12A10 10 0 0 0 12 2v10z"/>' },
  { id: 'package', category: 'business', label: 'Package / Product', svg: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="12" y1="22.08" x2="12" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'credit-card', category: 'business', label: 'Credit Card', svg: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="1" y1="10" x2="23" y2="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'building', category: 'business', label: 'Building / Office', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12H4a2 2 0 0 0-2 2v8h4M18 9h2a2 2 0 0 1 2 2v11h-4"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6h4M10 10h4M10 14h4M10 18h4"/>' },
  { id: 'handshake', category: 'business', label: 'Deal / Handshake', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>' },
  { id: 'percent', category: 'business', label: 'Percent', svg: '<line x1="19" y1="5" x2="5" y2="19" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><circle cx="6.5" cy="6.5" r="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><circle cx="17.5" cy="17.5" r="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'layers', category: 'business', label: 'Layers / Levels', svg: '<polygon points="12 2 2 7 12 12 22 7 12 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="2 17 12 22 22 17" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="2 12 12 17 22 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'rocket', category: 'business', label: 'Launch / Rocket', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>' },
  { id: 'sparkles', category: 'business', label: 'Sparkle / New', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>' },
  { id: 'settings', category: 'business', label: 'Settings / Config', svg: '<circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
  { id: 'lock', category: 'business', label: 'Security / Lock', svg: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
  { id: 'wifi', category: 'business', label: 'WiFi / Digital', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12.55a11 11 0 0 1 14.08 0"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1.42 9a16 16 0 0 1 21.16 0"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'cpu', category: 'business', label: 'Tech / CPU', svg: '<rect x="4" y="4" width="16" height="16" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><rect x="9" y="9" width="6" height="6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="9" y1="1" x2="9" y2="4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="15" y1="1" x2="15" y2="4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="9" y1="20" x2="9" y2="23" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="15" y1="20" x2="15" y2="23" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="20" y1="9" x2="23" y2="9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="20" y1="14" x2="23" y2="14" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="1" y1="9" x2="4" y2="9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="1" y1="14" x2="4" y2="14" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'headphones', category: 'business', label: 'Podcast / Audio', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18v-6a9 9 0 0 1 18 0v6"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>' },

  // ── Social ──
  { id: 'thumbs-up', category: 'social', label: 'Like / Thumbs Up', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>' },
  { id: 'comment', category: 'social', label: 'Comment', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  { id: 'share', category: 'social', label: 'Share', svg: '<circle cx="18" cy="5" r="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><circle cx="6" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><circle cx="18" cy="19" r="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'retweet', category: 'social', label: 'Retweet / Repost', svg: '<polyline points="17 1 21 5 17 9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13v2a4 4 0 0 1-4 4H3"/>' },
  { id: 'bookmark', category: 'social', label: 'Save / Bookmark', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>' },
  { id: 'at-sign', category: 'social', label: 'Mention / @', svg: '<circle cx="12" cy="12" r="4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>' },
  { id: 'hash', category: 'social', label: 'Hashtag #', svg: '<line x1="4" y1="9" x2="20" y2="9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="4" y1="15" x2="20" y2="15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="10" y1="3" x2="8" y2="21" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="16" y1="3" x2="14" y2="21" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'send', category: 'social', label: 'Send / DM', svg: '<line x1="22" y1="2" x2="11" y2="13" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'user', category: 'social', label: 'Profile / User', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'bell-social', category: 'social', label: 'Notification Bell', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.73 21a2 2 0 0 1-3.46 0"/>' },
  { id: 'message-circle', category: 'social', label: 'Chat Bubble', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' },
  { id: 'rss', category: 'social', label: 'RSS Feed', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 11a9 9 0 0 1 9 9"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'mail', category: 'social', label: 'Email / Mail', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'video-social', category: 'social', label: 'Video Post', svg: '<polygon points="23 7 16 12 23 17 23 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'image-social', category: 'social', label: 'Photo Post', svg: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="21 15 16 10 5 21" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'plus-circle', category: 'social', label: 'Add Story', svg: '<circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="8" y1="12" x2="16" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'thumbs-down', category: 'social', label: 'Dislike', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>' },
  { id: 'poll', category: 'social', label: 'Poll / Vote', svg: '<line x1="18" y1="20" x2="18" y2="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="12" y1="20" x2="12" y2="4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="6" y1="20" x2="6" y2="14" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'followers', category: 'social', label: 'Followers', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="23" y1="11" x2="17" y2="11" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="20" y1="8" x2="20" y2="14" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'verified', category: 'social', label: 'Verified Check', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'trending-social', category: 'social', label: 'Trending', svg: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="17 6 23 6 23 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },

  // ── Arrows ──
  { id: 'arrow-right', category: 'arrows', label: 'Arrow Right', svg: '<line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="12 5 19 12 12 19" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'arrow-left', category: 'arrows', label: 'Arrow Left', svg: '<line x1="19" y1="12" x2="5" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="12 19 5 12 12 5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'arrow-up', category: 'arrows', label: 'Arrow Up', svg: '<line x1="12" y1="19" x2="12" y2="5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="5 12 12 5 19 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'arrow-down', category: 'arrows', label: 'Arrow Down', svg: '<line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="19 12 12 19 5 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'arrow-up-right', category: 'arrows', label: 'Arrow Up-Right', svg: '<line x1="7" y1="17" x2="17" y2="7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="7 7 17 7 17 17" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'arrow-down-left', category: 'arrows', label: 'Arrow Down-Left', svg: '<line x1="17" y1="7" x2="7" y2="17" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="17 17 7 17 7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'chevron-right', category: 'arrows', label: 'Chevron Right', svg: '<polyline points="9 18 15 12 9 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'chevron-left', category: 'arrows', label: 'Chevron Left', svg: '<polyline points="15 18 9 12 15 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'chevrons-right', category: 'arrows', label: 'Double Chevron Right', svg: '<polyline points="13 17 18 12 13 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="6 17 11 12 6 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'corner-up-right', category: 'arrows', label: 'Corner Up-Right', svg: '<polyline points="15 14 20 9 15 4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 20v-7a4 4 0 0 1 4-4h12"/>' },
  { id: 'corner-down-right', category: 'arrows', label: 'Corner Down-Right', svg: '<polyline points="15 10 20 15 15 20" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v7a4 4 0 0 0 4 4h12"/>' },
  { id: 'arrow-circle', category: 'arrows', label: 'Circular Arrow', svg: '<polyline points="23 4 23 10 17 10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>' },
  { id: 'move', category: 'arrows', label: 'Move / Drag', svg: '<polyline points="5 9 2 12 5 15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="9 5 12 2 15 5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="15 19 12 22 9 19" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="19 9 22 12 19 15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="12" y1="2" x2="12" y2="22" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'external-link', category: 'arrows', label: 'External Link', svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="10" y1="14" x2="21" y2="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
  { id: 'maximize', category: 'arrows', label: 'Expand / Maximize', svg: '<polyline points="15 3 21 3 21 9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="9 21 3 21 3 15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="21" y1="3" x2="14" y2="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><line x1="3" y1="21" x2="10" y2="14" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>' },
];

// ─── Shapes ─────────────────────────────────────────────────────────────────

export type ShapeType = 'circle' | 'rect' | 'rounded-rect' | 'triangle' | 'star' | 'badge' | 'diamond' | 'arrow-right' | 'arrow-up' | 'hexagon' | 'speech-bubble' | 'heart-shape' | 'pentagon' | 'cross';

export interface ShapeDef {
  id: ShapeType;
  label: string;
  path: string; // SVG path element
}

export const SHAPES: ShapeDef[] = [
  { id: 'circle', label: 'Circle', path: '<circle cx="50" cy="50" r="48" fill="currentColor"/>' },
  { id: 'rect', label: 'Rectangle', path: '<rect x="2" y="10" width="96" height="80" fill="currentColor"/>' },
  { id: 'rounded-rect', label: 'Rounded Rect', path: '<rect x="2" y="10" width="96" height="80" rx="16" ry="16" fill="currentColor"/>' },
  { id: 'triangle', label: 'Triangle', path: '<polygon points="50,2 98,96 2,96" fill="currentColor"/>' },
  { id: 'star', label: 'Star', path: '<polygon points="50,3 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor"/>' },
  { id: 'badge', label: 'Badge', path: '<path d="M50 5 L60 20 L78 15 L75 34 L93 42 L82 58 L90 75 L73 78 L68 96 L50 87 L32 96 L27 78 L10 75 L18 58 L7 42 L25 34 L22 15 L40 20 Z" fill="currentColor"/>' },
  { id: 'diamond', label: 'Diamond', path: '<polygon points="50,2 98,50 50,98 2,50" fill="currentColor"/>' },
  { id: 'arrow-right', label: 'Arrow Right', path: '<polygon points="0,25 65,25 65,5 100,50 65,95 65,75 0,75" fill="currentColor"/>' },
  { id: 'arrow-up', label: 'Arrow Up', path: '<polygon points="25,100 25,35 5,35 50,0 95,35 75,35 75,100" fill="currentColor"/>' },
  { id: 'hexagon', label: 'Hexagon', path: '<polygon points="50,2 90,26 90,74 50,98 10,74 10,26" fill="currentColor"/>' },
  { id: 'speech-bubble', label: 'Speech Bubble', path: '<path d="M10,5 Q2,5 2,15 L2,65 Q2,75 10,75 L35,75 L50,95 L65,75 L90,75 Q98,75 98,65 L98,15 Q98,5 90,5 Z" fill="currentColor"/>' },
  { id: 'heart-shape', label: 'Heart', path: '<path d="M50,85 L12,48 C4,38 4,22 16,14 C26,7 38,12 50,25 C62,12 74,7 84,14 C96,22 96,38 88,48 Z" fill="currentColor"/>' },
  { id: 'pentagon', label: 'Pentagon', path: '<polygon points="50,2 97,37 79,97 21,97 3,37" fill="currentColor"/>' },
  { id: 'cross', label: 'Plus / Cross', path: '<path d="M35,0 L65,0 L65,35 L100,35 L100,65 L65,65 L65,100 L35,100 L35,65 L0,65 L0,35 L35,35 Z" fill="currentColor"/>' },
];

// ─── Patterns ────────────────────────────────────────────────────────────────

export interface PatternDef {
  id: string;
  label: string;
  svgPattern: string; // full SVG defs + pattern element
}

export const PATTERNS: PatternDef[] = [
  {
    id: 'dots-sm', label: 'Small Dots',
    svgPattern: `<defs><pattern id="p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.4"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>`
  },
  {
    id: 'dots-lg', label: 'Large Dots',
    svgPattern: `<defs><pattern id="p" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="6" fill="currentColor" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>`
  },
  {
    id: 'lines-h', label: 'Horizontal Lines',
    svgPattern: `<defs><pattern id="p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" stroke-width="1.5" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>`
  },
  {
    id: 'lines-v', label: 'Vertical Lines',
    svgPattern: `<defs><pattern id="p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" stroke-width="1.5" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>`
  },
  {
    id: 'lines-diag', label: 'Diagonal Lines',
    svgPattern: `<defs><pattern id="p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><line x1="0" y1="20" x2="20" y2="0" stroke="currentColor" stroke-width="1.5" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>`
  },
  {
    id: 'lines-cross', label: 'Cross-hatch',
    svgPattern: `<defs><pattern id="p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="20" y2="20" stroke="currentColor" stroke-width="1" opacity="0.25"/><line x1="20" y1="0" x2="0" y2="20" stroke="currentColor" stroke-width="1" opacity="0.25"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>`
  },
  {
    id: 'grid', label: 'Grid',
    svgPattern: `<defs><pattern id="p" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><line x1="30" y1="0" x2="30" y2="30" stroke="currentColor" stroke-width="1" opacity="0.3"/><line x1="0" y1="30" x2="30" y2="30" stroke="currentColor" stroke-width="1" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>`
  },
  {
    id: 'triangles', label: 'Triangles',
    svgPattern: `<defs><pattern id="p" x="0" y="0" width="30" height="26" patternUnits="userSpaceOnUse"><polygon points="15,0 30,26 0,26" fill="currentColor" opacity="0.15"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>`
  },
  {
    id: 'waves', label: 'Waves',
    svgPattern: `<defs><pattern id="p" x="0" y="0" width="60" height="20" patternUnits="userSpaceOnUse"><path d="M0,10 Q15,0 30,10 Q45,20 60,10" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>`
  },
  {
    id: 'hexagons', label: 'Hexagons',
    svgPattern: `<defs><pattern id="p" x="0" y="0" width="30" height="34" patternUnits="userSpaceOnUse"><polygon points="15,1 28,8.5 28,24.5 15,32 2,24.5 2,8.5" fill="none" stroke="currentColor" stroke-width="1" opacity="0.25"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>`
  },
  {
    id: 'checker', label: 'Checkerboard',
    svgPattern: `<defs><pattern id="p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="10" height="10" fill="currentColor" opacity="0.2"/><rect x="10" y="10" width="10" height="10" fill="currentColor" opacity="0.2"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>`
  },
  {
    id: 'noise', label: 'Dense Dots',
    svgPattern: `<defs><pattern id="p" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1" fill="currentColor" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>`
  },
];

// ─── Frames ──────────────────────────────────────────────────────────────────

export interface FrameDef {
  id: string;
  label: string;
  svgContent: string;
}

export const FRAMES: FrameDef[] = [
  {
    id: 'frame-modern', label: 'Modern',
    svgContent: `<rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" stroke-width="4" rx="2"/>`
  },
  {
    id: 'frame-rounded', label: 'Rounded',
    svgContent: `<rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" stroke-width="4" rx="16"/>`
  },
  {
    id: 'frame-double', label: 'Double',
    svgContent: `<rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" stroke-width="2" rx="2"/><rect x="8" y="8" width="84" height="84" fill="none" stroke="currentColor" stroke-width="2" rx="2"/>`
  },
  {
    id: 'frame-thick', label: 'Bold',
    svgContent: `<rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" stroke-width="8" rx="2"/>`
  },
  {
    id: 'frame-dashed', label: 'Dashed',
    svgContent: `<rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="12,6" rx="2"/>`
  },
  {
    id: 'frame-dotted', label: 'Dotted',
    svgContent: `<rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="2,8" stroke-linecap="round" rx="2"/>`
  },
  {
    id: 'frame-minimal', label: 'Minimal',
    svgContent: `<line x1="0" y1="2" x2="30" y2="2" stroke="currentColor" stroke-width="4"/><line x1="0" y1="2" x2="2" y2="30" stroke="currentColor" stroke-width="4"/><line x1="70" y1="2" x2="100" y2="2" stroke="currentColor" stroke-width="4"/><line x1="98" y1="2" x2="98" y2="30" stroke="currentColor" stroke-width="4"/><line x1="0" y1="98" x2="30" y2="98" stroke="currentColor" stroke-width="4"/><line x1="2" y1="70" x2="2" y2="98" stroke="currentColor" stroke-width="4"/><line x1="70" y1="98" x2="100" y2="98" stroke="currentColor" stroke-width="4"/><line x1="98" y1="70" x2="98" y2="98" stroke="currentColor" stroke-width="4"/>`
  },
  {
    id: 'frame-classic', label: 'Classic',
    svgContent: `<rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" stroke-width="2"/><rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" stroke-width="1" opacity="0.6"/><rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" stroke-width="2"/>`
  },
  {
    id: 'frame-shadow-br', label: 'Shadow Bottom',
    svgContent: `<rect x="6" y="6" width="92" height="92" fill="currentColor" opacity="0.15" rx="2"/><rect x="2" y="2" width="92" height="92" fill="none" stroke="currentColor" stroke-width="3" rx="2"/>`
  },
  {
    id: 'frame-circle', label: 'Circular',
    svgContent: `<circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="4"/>`
  },
  {
    id: 'frame-fancy-corners', label: 'Fancy Corners',
    svgContent: `<rect x="12" y="2" width="76" height="96" fill="none" stroke="currentColor" stroke-width="2" rx="0"/><rect x="2" y="12" width="96" height="76" fill="none" stroke="currentColor" stroke-width="2" rx="0"/><rect x="6" y="6" width="88" height="88" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4" rx="0"/>`
  },
  {
    id: 'frame-badge-border', label: 'Badge Border',
    svgContent: `<path d="M50,2 L62,18 L82,12 L79,32 L98,42 L85,58 L92,78 L72,80 L66,98 L50,88 L34,98 L28,80 L8,78 L15,58 L2,42 L21,32 L18,12 L38,18 Z" fill="none" stroke="currentColor" stroke-width="3"/>`
  },
];

// ─── Emojis ──────────────────────────────────────────────────────────────────

export const EMOJI_CATEGORIES: Record<string, string[]> = {
  'Reactions': ['😀','😂','🤣','😍','🥰','😎','🤔','😱','🔥','💥','⚡','💫','✨','🎉','🎊','👏','🙌','👍','❤️','💔'],
  'News': ['📰','📡','📻','🎙️','📢','📣','🔔','🚨','⚠️','🔴','🟡','🟢','📊','📈','📉','🗺️','🌍','💬','🗞️','📺'],
  'Sports': ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🏓','🏸','🥊','🥋','⛳','🎯','🏆','🥇','🥈','🥉','🏅','🎽','🏃'],
  'Business': ['💼','💰','💵','📊','🏦','💳','🤝','📱','💻','🖥️','⌨️','🖱️','🔒','🔑','📋','📌','🗂️','💡','🚀','✈️'],
  'Weather': ['☀️','🌤️','⛅','🌦️','🌧️','⛈️','🌩️','❄️','🌪️','🌈','🌊','🔥','💨','🌡️','🌙','⭐','🌟','☁️','🌬️','🌂'],
  'Time & Events': ['📅','⏰','⏱️','🕐','🕛','📆','🗓️','⌛','⏳','🕰️','🎈','🎁','🎂','🎆','🎇','🎀','🎟️','🎪','🎭','🎬'],
  'Symbols': ['✅','❌','⭕','🔵','🔴','🟠','🟡','🟢','🔶','🔷','🔸','🔹','◼','◻','🟥','🟦','🟧','🟨','🟩','🟪'],
  'People': ['👤','👥','🧑','👨','👩','🧒','👶','🧑‍💼','👩‍💻','👨‍🏫','👷','💂','🕵️','👮','🧑‍⚕️','👨‍🍳','🎅','🦸','🦹','🧑‍🚀'],
};

// ─── Stickers ────────────────────────────────────────────────────────────────

export interface StickerDef {
  id: string;
  label: string;
  content: string; // text/emoji sticker content
  style: string;   // CSS class name set for styling
  category: 'alert' | 'badge' | 'promo' | 'fun';
}

export const STICKERS: StickerDef[] = [
  // Alert stickers
  { id: 'breaking', label: 'BREAKING', content: '🔴 BREAKING', style: 'bg-red-600 text-white font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded', category: 'alert' },
  { id: 'live', label: 'LIVE', content: '⚡ LIVE', style: 'bg-red-500 text-white font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded-full', category: 'alert' },
  { id: 'urgent', label: 'URGENT', content: '🚨 URGENT', style: 'bg-orange-600 text-white font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded', category: 'alert' },
  { id: 'exclusive', label: 'EXCLUSIVE', content: '⭐ EXCLUSIVE', style: 'bg-yellow-500 text-black font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded', category: 'alert' },
  { id: 'alert', label: 'ALERT', content: '⚠️ ALERT', style: 'bg-yellow-400 text-black font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded', category: 'alert' },
  // Badge stickers
  { id: 'new', label: 'NEW', content: 'NEW', style: 'bg-blue-600 text-white font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded-full', category: 'badge' },
  { id: 'hot', label: 'HOT', content: '🔥 HOT', style: 'bg-red-500 text-white font-bold uppercase tracking-widest text-xs px-3 py-1.5 rounded-full', category: 'badge' },
  { id: 'trending', label: 'TRENDING', content: '📈 TRENDING', style: 'bg-green-600 text-white font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded', category: 'badge' },
  { id: 'viral', label: 'VIRAL', content: '🚀 VIRAL', style: 'bg-purple-600 text-white font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded', category: 'badge' },
  { id: 'must-see', label: 'MUST SEE', content: '👁 MUST SEE', style: 'bg-pink-600 text-white font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded', category: 'badge' },
  // Promo stickers
  { id: 'sale', label: 'SALE', content: '💰 SALE', style: 'bg-green-500 text-white font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded-full', category: 'promo' },
  { id: 'free', label: 'FREE', content: 'FREE!', style: 'bg-emerald-500 text-white font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded-full', category: 'promo' },
  { id: 'offer', label: 'OFFER', content: '🎁 OFFER', style: 'bg-amber-500 text-white font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded', category: 'promo' },
  { id: 'limited', label: 'LIMITED', content: '⏱ LIMITED', style: 'bg-red-700 text-white font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded', category: 'promo' },
  { id: 'flash-sale', label: 'FLASH SALE', content: '⚡ FLASH SALE', style: 'bg-yellow-400 text-black font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded', category: 'promo' },
  // Fun stickers
  { id: 'wow', label: 'WOW', content: '😱 WOW!', style: 'bg-orange-400 text-white font-black text-xs px-3 py-1.5 rounded-full', category: 'fun' },
  { id: 'lol', label: 'LOL', content: '😂 LOL', style: 'bg-yellow-300 text-black font-black text-xs px-3 py-1.5 rounded-full', category: 'fun' },
  { id: 'omg', label: 'OMG', content: '😲 OMG', style: 'bg-pink-500 text-white font-black text-xs px-3 py-1.5 rounded-full', category: 'fun' },
  { id: 'win', label: 'WIN', content: '🏆 WIN', style: 'bg-gold-500 bg-yellow-500 text-black font-black text-xs px-3 py-1.5 rounded-full', category: 'fun' },
  { id: 'fail', label: 'FAIL', content: '❌ FAIL', style: 'bg-gray-700 text-white font-black text-xs px-3 py-1.5 rounded-full', category: 'fun' },
];

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'icons' | 'shapes' | 'patterns' | 'frames' | 'emojis' | 'stickers';
type IconCategory = 'all' | 'news' | 'sports' | 'business' | 'social' | 'arrows';

interface ElementsPanelProps {
  darkMode: boolean;
  onAddOverlay: (overlay: Omit<CanvasOverlay, 'id' | 'x' | 'y'>) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const IconPreview: React.FC<{ icon: IconDef; size?: number }> = ({ icon, size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    dangerouslySetInnerHTML={{ __html: icon.svg }}
  />
);

const ShapePreview: React.FC<{ shape: ShapeDef; color?: string }> = ({ shape, color = '#ef4444' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className="w-full h-full"
    style={{ color }}
    dangerouslySetInnerHTML={{ __html: shape.path }}
  />
);

const PatternPreview: React.FC<{ pattern: PatternDef }> = ({ pattern }) => {
  const unique = `pp-${pattern.id}`;
  const patternSvg = pattern.svgPattern.replace(/id="p"/g, `id="${unique}"`).replace(/url\(#p\)/g, `url(#${unique})`);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ color: '#ef4444' }}
      dangerouslySetInnerHTML={{ __html: patternSvg }}
    />
  );
};

const FramePreview: React.FC<{ frame: FrameDef }> = ({ frame }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className="w-full h-full"
    style={{ color: '#ef4444' }}
    dangerouslySetInnerHTML={{ __html: frame.svgContent }}
  />
);

// ─── Main component ──────────────────────────────────────────────────────────

const ElementsPanel: React.FC<ElementsPanelProps> = ({ darkMode, onAddOverlay }) => {
  const [activeTab, setActiveTab] = useState<Tab>('icons');
  const [iconCategory, setIconCategory] = useState<IconCategory>('all');
  const [emojiCategory, setEmojiCategory] = useState<string>('Reactions');
  const [stickerCategory, setStickerCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ef4444');
  const [selectedOpacity, setSelectedOpacity] = useState(100);

  const dm = darkMode;
  const bg = dm ? 'bg-[#0f111a]' : 'bg-slate-50';
  const border = dm ? 'border-[#1e2235]' : 'border-slate-200';
  const text = dm ? 'text-white' : 'text-slate-900';
  const muted = dm ? 'text-slate-400' : 'text-slate-500';
  const btn = dm ? 'bg-[#141724] border-[#22273c] hover:border-red-500' : 'bg-white border-slate-200 hover:border-red-400';
  const activeBtnCls = 'border-red-500 bg-red-500/10';

  const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: 'icons', label: 'Icons', emoji: '🔷' },
    { id: 'shapes', label: 'Shapes', emoji: '🔶' },
    { id: 'patterns', label: 'Patterns', emoji: '🟰' },
    { id: 'frames', label: 'Frames', emoji: '🖼️' },
    { id: 'emojis', label: 'Emojis', emoji: '😀' },
    { id: 'stickers', label: 'Stickers', emoji: '🏷️' },
  ];

  const ICON_CATS: { id: IconCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'news', label: 'News' },
    { id: 'sports', label: 'Sports' },
    { id: 'business', label: 'Business' },
    { id: 'social', label: 'Social' },
    { id: 'arrows', label: 'Arrows' },
  ];

  const filteredIcons = useMemo(() => {
    let list = iconCategory === 'all' ? ICONS : ICONS.filter(i => i.category === iconCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(i => i.label.toLowerCase().includes(q) || i.category.includes(q));
    }
    return list;
  }, [iconCategory, searchQuery]);

  const filteredStickers = useMemo(() => {
    let list = stickerCategory === 'all' ? STICKERS : STICKERS.filter(s => s.category === stickerCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.label.toLowerCase().includes(q));
    }
    return list;
  }, [stickerCategory, searchQuery]);

  const colorWithOpacity = (() => {
    const hex = selectedColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${selectedOpacity / 100})`;
  })();

  const addIcon = (icon: IconDef) => {
    onAddOverlay({
      type: 'icon',
      content: icon.svg,
      color: colorWithOpacity,
      width: 60,
      height: 60,
      label: icon.label,
    });
  };

  const addShape = (shape: ShapeDef) => {
    onAddOverlay({
      type: 'shape',
      content: shape.path,
      color: colorWithOpacity,
      width: 80,
      height: 80,
      label: shape.label,
    });
  };

  const addPattern = (pattern: PatternDef) => {
    onAddOverlay({
      type: 'pattern',
      content: pattern.svgPattern,
      color: colorWithOpacity,
      width: 100,
      height: 100,
      label: pattern.label,
      isFullCanvas: true,
    });
  };

  const addFrame = (frame: FrameDef) => {
    onAddOverlay({
      type: 'frame',
      content: frame.svgContent,
      color: colorWithOpacity,
      width: 100,
      height: 100,
      label: frame.label,
      isFullCanvas: true,
    });
  };

  const addEmoji = (emoji: string) => {
    onAddOverlay({
      type: 'emoji',
      content: emoji,
      color: 'transparent',
      width: 60,
      height: 60,
      label: emoji,
      fontSize: 48,
    });
  };

  const addSticker = (sticker: StickerDef) => {
    onAddOverlay({
      type: 'sticker',
      content: sticker.content,
      color: 'transparent',
      width: 120,
      height: 36,
      label: sticker.label,
      stickerStyle: sticker.style,
    });
  };

  return (
    <div className={`flex flex-col h-full ${bg}`}>
      {/* Tab Bar */}
      <div className={`flex overflow-x-auto border-b ${border} shrink-0`} style={{ scrollbarWidth: 'none' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
            className={`flex-shrink-0 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${activeTab === tab.id
              ? 'border-red-500 text-red-500'
              : `border-transparent ${muted} hover:text-white`
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* Color + Opacity Controls */}
      <div className={`px-3 py-2 border-b ${border} shrink-0 flex items-center gap-2`}>
        <input
          type="color"
          value={selectedColor}
          onChange={e => setSelectedColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent shrink-0"
          title="Element color"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <span className={`text-[10px] ${muted}`}>Opacity</span>
            <span className={`text-[10px] ${muted}`}>{selectedOpacity}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={selectedOpacity}
            onChange={e => setSelectedOpacity(parseInt(e.target.value))}
            className="w-full accent-red-500 h-1"
          />
        </div>
      </div>

      {/* Search (for icons and stickers) */}
      {(activeTab === 'icons' || activeTab === 'stickers') && (
        <div className={`px-3 py-2 border-b ${border} shrink-0`}>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full px-2.5 py-1.5 rounded-lg text-xs border focus:outline-none focus:border-red-500 ${dm
              ? 'bg-[#0b0e18] border-[#22273c] text-white placeholder-slate-500'
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── ICONS ── */}
        {activeTab === 'icons' && (
          <div className="p-2">
            {/* Category filter */}
            <div className="flex flex-wrap gap-1 mb-2">
              {ICON_CATS.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setIconCategory(cat.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors border ${iconCategory === cat.id
                    ? 'bg-red-500 text-white border-red-500'
                    : `${muted} border-transparent hover:border-red-400 ${dm ? 'hover:text-white' : 'hover:text-slate-700'}`
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {filteredIcons.map(icon => (
                <button
                  key={icon.id}
                  onClick={() => addIcon(icon)}
                  title={icon.label}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all hover:scale-105 ${btn}`}
                >
                  <span style={{ color: selectedColor }}>
                    <IconPreview icon={icon} size={22} />
                  </span>
                  <span className={`text-[9px] mt-1 leading-tight text-center line-clamp-1 w-full ${muted}`}>{icon.label}</span>
                </button>
              ))}
              {filteredIcons.length === 0 && (
                <div className={`col-span-4 py-8 text-center text-xs ${muted}`}>No icons match "{searchQuery}"</div>
              )}
            </div>
          </div>
        )}

        {/* ── SHAPES ── */}
        {activeTab === 'shapes' && (
          <div className="p-2">
            <div className="grid grid-cols-3 gap-2">
              {SHAPES.map(shape => (
                <button
                  key={shape.id}
                  onClick={() => addShape(shape)}
                  title={shape.label}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all hover:scale-105 ${btn}`}
                >
                  <div className="w-10 h-10 flex items-center justify-center" style={{ color: selectedColor }}>
                    <ShapePreview shape={shape} color={selectedColor} />
                  </div>
                  <span className={`text-[9px] mt-1 ${muted}`}>{shape.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PATTERNS ── */}
        {activeTab === 'patterns' && (
          <div className="p-2">
            <p className={`text-[10px] ${muted} mb-2 px-1`}>Patterns are placed as full-canvas overlays. Adjust color and opacity above.</p>
            <div className="grid grid-cols-3 gap-2">
              {PATTERNS.map(pattern => (
                <button
                  key={pattern.id}
                  onClick={() => addPattern(pattern)}
                  title={pattern.label}
                  className={`flex flex-col items-center justify-center overflow-hidden rounded-lg border transition-all hover:scale-105 ${btn}`}
                >
                  <div className={`w-full h-16 ${dm ? 'bg-[#0b0e18]' : 'bg-slate-100'}`} style={{ color: selectedColor }}>
                    <PatternPreview pattern={pattern} />
                  </div>
                  <span className={`text-[9px] py-1 ${muted}`}>{pattern.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── FRAMES ── */}
        {activeTab === 'frames' && (
          <div className="p-2">
            <p className={`text-[10px] ${muted} mb-2 px-1`}>Frames are placed as full-canvas borders. Adjust color and opacity above.</p>
            <div className="grid grid-cols-3 gap-2">
              {FRAMES.map(frame => (
                <button
                  key={frame.id}
                  onClick={() => addFrame(frame)}
                  title={frame.label}
                  className={`flex flex-col items-center justify-center overflow-hidden rounded-lg border transition-all hover:scale-105 ${btn}`}
                >
                  <div className={`w-full h-16 p-2 ${dm ? 'bg-[#0b0e18]' : 'bg-slate-100'}`} style={{ color: selectedColor }}>
                    <FramePreview frame={frame} />
                  </div>
                  <span className={`text-[9px] py-1 ${muted}`}>{frame.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── EMOJIS ── */}
        {activeTab === 'emojis' && (
          <div className="p-2">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1 mb-2">
              {Object.keys(EMOJI_CATEGORIES).map(cat => (
                <button
                  key={cat}
                  onClick={() => setEmojiCategory(cat)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors border ${emojiCategory === cat
                    ? 'bg-red-500 text-white border-red-500'
                    : `${muted} border-transparent hover:border-red-400 ${dm ? 'hover:text-white' : 'hover:text-slate-700'}`
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {(EMOJI_CATEGORIES[emojiCategory] || []).map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => addEmoji(emoji)}
                  title={emoji}
                  className={`flex items-center justify-center text-2xl p-2 rounded-lg border transition-all hover:scale-110 ${btn}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STICKERS ── */}
        {activeTab === 'stickers' && (
          <div className="p-2">
            {/* Category filter */}
            <div className="flex flex-wrap gap-1 mb-2">
              {(['all', 'alert', 'badge', 'promo', 'fun'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setStickerCategory(cat)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize transition-colors border ${stickerCategory === cat
                    ? 'bg-red-500 text-white border-red-500'
                    : `${muted} border-transparent hover:border-red-400 ${dm ? 'hover:text-white' : 'hover:text-slate-700'}`
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              {filteredStickers.map(sticker => (
                <button
                  key={sticker.id}
                  onClick={() => addSticker(sticker)}
                  title={`Add "${sticker.label}" sticker`}
                  className={`flex items-center justify-start p-2 rounded-lg border transition-all hover:scale-[1.02] text-left ${btn}`}
                >
                  <span className={sticker.style}>
                    {sticker.content}
                  </span>
                </button>
              ))}
              {filteredStickers.length === 0 && (
                <div className={`py-8 text-center text-xs ${muted}`}>No stickers match "{searchQuery}"</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ElementsPanel;
