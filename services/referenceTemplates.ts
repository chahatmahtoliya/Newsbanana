import type { Template } from './templateService';

export type ReferenceId = 'studio-news' | 'studio-quote' | 'studio-sport' | 'studio-story' | 'studio-travel' | 'studio-audio' | 'studio-food' | 'studio-sale' | 'studio-fitness' | 'studio-phone' | 'studio-weather' | 'studio-market' | 'studio-health' | 'studio-cinema' | 'studio-motivation' | 'studio-music';

function design(id: ReferenceId, name: string, category: string, headline: string, description: string, banner: string, background: string, accent: string, color: string, font: string, size: number, headlineY: number, descriptionY: number, media?: string): Template {
  return {
    id, reference: id, name, category, variant: 'editorial',
    description: 'Reference collection · editable text, artwork colors and replaceable media.',
    defaultHeadline: headline, defaultDescription: description, defaultBanner: banner,
    defaultMedia: media ? `/template-media/${media}.jpg` : undefined,
    theme: { backgroundColor: background, surfaceColor: color, accentColor: accent, overlayOpacity: 55 },
    layout: { banner: { x: 8, y: 8 }, headline: { x: 8, y: headlineY }, description: { x: 8, y: descriptionY } },
    styles: { headlineFont: font, headlineFontSize: size, descriptionFont: 'Manrope', descriptionFontSize: 32, headlineColor: color, descriptionColor: color, bannerColor: accent, headlineCasing: 'none', descriptionCasing: 'none' },
  };
}

export const REFERENCE_TEMPLATES: Template[] = [
  design('studio-news', 'World Breaking', 'News', 'BREAKING\nNEWS', 'STAY UPDATED\nWITH REAL-TIME NEWS', 'LIVE', '#07090C', '#FF302F', '#FFFFFF', 'Space Grotesk', 142, 36, 78),
  design('studio-quote', 'Quiet Thoughts', 'Editorial', 'A small\npositive thought\ncan change\nyour whole day.', '— Your name', '', '#F2EEE7', '#BC9466', '#302D26', 'DM Sans', 65, 36, 76),
  design('studio-sport', 'Game Day', 'Sports', 'GAME\nDAY', 'BIGGER · FASTER · LOUDER\nYour team. Your moment.', 'MATCH DAY', '#08131D', '#32A9EF', '#FFFFFF', 'Space Grotesk', 144, 22, 81, 'sport'),
  { ...design('studio-story', 'Top Story', 'News', 'A new vision\nfor tomorrow', 'Key reforms and the\npeople behind them.', 'TOP STORY', '#F4F1EA', '#F3413E', '#23231F', 'Space Grotesk', 85, 40, 73, 'city'), headlineWidth: 56, descriptionWidth: 56 },
  design('studio-travel', 'Travel More', 'Travel', 'Travel\nMore', 'NEW PLACES\nNEW STORIES', 'THE GREAT OUTDOORS', '#193B36', '#D8E3B2', '#FFFFFF', 'DM Sans', 150, 16, 84, 'travel'),
  design('studio-audio', 'Big Sound', 'Commerce', 'Small Size\nBig Sound', 'Clear audio    ·    Long battery    ·    Active noise control', 'NEW LAUNCH', '#E8EAEC', '#45515C', '#172029', 'Space Grotesk', 100, 18, 88),
  { ...design('studio-food', 'Good Food Mood', 'Food', 'GOOD\nFOOD\nGOOD\nMOOD', 'Discover the menu →', 'FRESHLY MADE', '#10130D', '#EFCA29', '#F6EBCE', 'Space Grotesk', 107, 24, 83, 'food'), headlineWidth: 48 },
  design('studio-sale', 'Special Offer', 'Commerce', 'UP TO\n50%\nOFF', 'LIMITED TIME ONLY\nShop now →', 'SPECIAL OFFER', '#FF3D54', '#C82039', '#FFFFFF', 'Space Grotesk', 163, 26, 82),
  design('studio-fitness', 'Build Results', 'Fitness', 'DISCIPLINE\nBUILDS\nRESULTS', 'STRONGER\nEVERY DAY', 'KEEP SHOWING UP', '#090E0B', '#91D84B', '#FFFFFF', 'Space Grotesk', 102, 53, 85, 'fitness'),
  { ...design('studio-phone', 'What’s Next', 'Technology', 'What’s\nNext?', 'Latest releases,\nfeatures and more.', 'TECH UPDATE', '#10152B', '#8892E4', '#FFFFFF', 'Space Grotesk', 120, 27, 65), headlineWidth: 53, descriptionWidth: 48 },
  { ...design('studio-weather', 'Today’s Weather', 'Weather', '28°', 'New Delhi\nPartly cloudy', 'TODAY’S WEATHER', '#50BCEC', '#F8D551', '#FFFFFF', 'Space Grotesk', 230, 30, 57), details: [{ text: 'Wed\n27°', x: 9, y: 86, size: 34 }, { text: 'Thu\n29°', x: 31, y: 86, size: 34 }, { text: 'Fri\n26°', x: 53, y: 86, size: 34 }, { text: 'Sat\n30°', x: 75, y: 86, size: 34 }] },
  { ...design('studio-market', 'Market Pulse', 'Finance', '82,450', 'Markets end higher\nAdd your market commentary.', 'MARKET UPDATE', '#031A11', '#13D586', '#FFFFFF', 'Space Grotesk', 132, 28, 83), details: [{ text: 'SENSEX', x: 8, y: 22, size: 34 }, { text: '+1.26%', x: 8, y: 43, size: 56 }] },
  { ...design('studio-health', 'Small Steps', 'Wellness', 'Small\nSteps\nBig Change', 'Eat well\nStay active\nBe consistent', 'HEALTH TIPS', '#EFF1DE', '#698A35', '#26351E', 'Space Grotesk', 95, 25, 68), headlineWidth: 58, descriptionWidth: 52 },
  design('studio-cinema', 'After Dark', 'Entertainment', 'AFTER\nDARK', 'ACTION · THRILLER\nWatch the trailer →', 'NOW SHOWING', '#120909', '#EE292B', '#FFFFFF', 'Space Grotesk', 163, 57, 85, 'action'),
  design('studio-motivation', 'Better Days', 'Editorial', 'Better\nDays\nAhead', 'Keep moving forward.', '', '#E7E7E3', '#57574E', '#22251F', 'DM Sans', 100, 17, 53, 'mountains'),
  design('studio-music', 'Music Fest', 'Events', 'MUSIC\nFEST', '24 DEC 2026\nNEW DELHI\n\nBook tickets →', 'LIVE EVENT', '#130A35', '#7750D6', '#FFFFFF', 'Space Grotesk', 144, 24, 64, 'concert'),
];
