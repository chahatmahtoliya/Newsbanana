import { LayoutSettings, StyleSettings } from '../types';
import { REFERENCE_TEMPLATES, ReferenceId } from './referenceTemplates';

export type TemplateVariant = 'broadcast' | 'quote' | 'score' | 'announcement' | 'fact' | 'countdown' | 'viral' | 'tech' | 'weather' | 'event' | 'sale' | 'editorial' | 'classic' | 'breaking';
type LegacyTemplateType = 'default' | 'breaking-news' | 'quote-card' | 'sports-score' | 'announcement' | 'fact-card' | 'coming-soon' | 'viral-alert' | 'breaking-sports' | 'tech-update' | 'weather-alert' | 'event-highlight' | 'flash-sale' | 'trending-topic' | 'live-update' | 'exclusive-story' | 'hot-topic';

export type TemplateType = LegacyTemplateType | ReferenceId;

export interface TemplateTheme {
  backgroundColor: string;
  surfaceColor: string;
  accentColor: string;
  overlayOpacity: number;
}

export interface Template {
  id: TemplateType | ReferenceId;
  name: string;
  category: string;
  description: string;
  variant: TemplateVariant;
  defaultBanner: string;
  defaultHeadline: string;
  defaultDescription: string;
  theme: TemplateTheme;
  layout: LayoutSettings;
  styles: Partial<StyleSettings>;
  reference?: ReferenceId;
  defaultMedia?: string;
  headlineWidth?: number;
  descriptionWidth?: number;
  details?: { text: string; x: number; y: number; size: number }[];
}

const defaultBottom: LayoutSettings = { banner: { x: 5, y: 5 }, headline: { x: 5, y: 70 }, description: { x: 5, y: 85 } };
const bottom: LayoutSettings = { banner: { x: 6, y: 7 }, headline: { x: 6, y: 64 }, description: { x: 6, y: 82 } };
const center: LayoutSettings = { banner: { x: 12, y: 12 }, headline: { x: 12, y: 40 }, description: { x: 12, y: 66 } };
const editorial: LayoutSettings = { banner: { x: 7, y: 8 }, headline: { x: 7, y: 24 }, description: { x: 7, y: 73 } };

export const TEMPLATES: Template[] = [
  {
    id: 'default',
    name: 'Default',
    category: 'News',
    variant: 'classic',
    description: 'Clean classic layout with headline and description at the bottom.',
    defaultBanner: '',
    defaultHeadline: 'Major story develops tonight',
    defaultDescription: 'Add the essential context your audience needs to know.',
    theme: { backgroundColor: '#090B10', surfaceColor: '#181B22', accentColor: '#DC2626', overlayOpacity: 65 },
    layout: defaultBottom,
    styles: { headlineFont: 'Space Grotesk', descriptionFont: 'Manrope', headlineFontSize: 70, descriptionFontSize: 18, headlineColor: '#FFFFFF', descriptionColor: '#E5E5E5', bannerColor: '#DC2626', headlineCasing: 'uppercase', descriptionCasing: 'sentence' }
  },
  {
    id: 'breaking-news',
    name: 'Breaking News',
    category: 'News',
    variant: 'breaking',
    description: 'Urgent breaking news banner with headline and description at the bottom.',
    defaultBanner: 'BREAKING NEWS',
    defaultHeadline: 'Major story develops tonight',
    defaultDescription: 'Add the essential context your audience needs to know.',
    theme: { backgroundColor: '#090B10', surfaceColor: '#181B22', accentColor: '#DC2626', overlayOpacity: 68 },
    layout: defaultBottom,
    styles: { headlineFont: 'Space Grotesk', descriptionFont: 'Manrope', headlineFontSize: 70, descriptionFontSize: 18, headlineColor: '#FFFFFF', descriptionColor: '#E5E5E5', bannerColor: '#DC2626', headlineCasing: 'uppercase', descriptionCasing: 'sentence' }
  },
  ...REFERENCE_TEMPLATES,
  { id: 'quote-card', name: 'Quote Card', category: 'Editorial', variant: 'quote', description: 'Editorial quote layout with an oversized mark.', defaultBanner: '', defaultHeadline: 'The future belongs to people who build it.', defaultDescription: 'Speaker name · Role or publication', theme: { backgroundColor: '#171512', surfaceColor: '#EEE7D9', accentColor: '#D2A84A', overlayOpacity: 28 }, layout: center, styles: { headlineFont: 'DM Sans', descriptionFont: 'Manrope', headlineFontSize: 66, descriptionFontSize: 20, headlineCasing: 'none' } },
  { id: 'sports-score', name: 'Sports Score', category: 'Sports', variant: 'score', description: 'High-energy score graphic with field markings.', defaultBanner: 'FINAL SCORE', defaultHeadline: 'CITY 3 — 2 UNITED', defaultDescription: 'Full time · A dramatic finish under the lights', theme: { backgroundColor: '#061B14', surfaceColor: '#0D3B2B', accentColor: '#B8FF3D', overlayOpacity: 50 }, layout: center, styles: { headlineFont: 'Space Grotesk', descriptionFont: 'Manrope', headlineFontSize: 78, descriptionFontSize: 20 } },
  { id: 'announcement', name: 'Announcement', category: 'Business', variant: 'announcement', description: 'Clean launch card with architectural shapes.', defaultBanner: 'ANNOUNCEMENT', defaultHeadline: 'A new chapter starts today', defaultDescription: 'Share a launch, company update, or important milestone.', theme: { backgroundColor: '#F3EFE6', surfaceColor: '#FFFFFF', accentColor: '#E54B2A', overlayOpacity: 18 }, layout: editorial, styles: { headlineFont: 'Space Grotesk', descriptionFont: 'Manrope', headlineColor: '#171717', descriptionColor: '#3F3F46', headlineFontSize: 72, descriptionFontSize: 20 } },
  { id: 'fact-card', name: 'Did You Know?', category: 'Education', variant: 'fact', description: 'Number-led card for facts and statistics.', defaultBanner: 'DID YOU KNOW?', defaultHeadline: '72%', defaultDescription: 'Use the description to explain the number and cite its meaning.', theme: { backgroundColor: '#101828', surfaceColor: '#1D2939', accentColor: '#53B1FD', overlayOpacity: 42 }, layout: center, styles: { headlineFont: 'Space Grotesk', descriptionFont: 'Manrope', headlineFontSize: 110, descriptionFontSize: 22 } },
  { id: 'coming-soon', name: 'Coming Soon', category: 'Launch', variant: 'countdown', description: 'Cinematic teaser with a countdown motif.', defaultBanner: 'COMING SOON', defaultHeadline: 'Something remarkable is on the way', defaultDescription: 'Save the date · 24 October', theme: { backgroundColor: '#0A0712', surfaceColor: '#211536', accentColor: '#A970FF', overlayOpacity: 55 }, layout: bottom, styles: { headlineFont: 'Space Grotesk', descriptionFont: 'Manrope', headlineFontSize: 82, descriptionFontSize: 20 } },
  { id: 'viral-alert', name: 'Viral Alert', category: 'Social', variant: 'viral', description: 'Fast, loud social format with kinetic rings.', defaultBanner: 'VIRAL ALERT', defaultHeadline: 'Everyone is talking about this', defaultDescription: 'Add the detail behind the trend.', theme: { backgroundColor: '#160709', surfaceColor: '#3A0B10', accentColor: '#FF553D', overlayOpacity: 48 }, layout: bottom, styles: { headlineFont: 'Bungee', descriptionFont: 'Manrope', headlineFontSize: 62, descriptionFontSize: 20 } },
  { id: 'breaking-sports', name: 'Breaking Sports', category: 'Sports', variant: 'score', description: 'Live sports update with broadcast energy.', defaultBanner: 'BREAKING SPORTS', defaultHeadline: 'Transfer confirmed', defaultDescription: 'Club statement · Contract details and reaction', theme: { backgroundColor: '#07111F', surfaceColor: '#10284A', accentColor: '#24D3EE', overlayOpacity: 56 }, layout: bottom, styles: { headlineFont: 'Teko', descriptionFont: 'Manrope', headlineFontSize: 84, descriptionFontSize: 20 } },
  { id: 'tech-update', name: 'Tech Update', category: 'Technology', variant: 'tech', description: 'Precise grid system for product and AI news.', defaultBanner: 'TECH UPDATE', defaultHeadline: 'A smarter way to work is here', defaultDescription: 'Product release · Features, access, and what changes', theme: { backgroundColor: '#070A0E', surfaceColor: '#111820', accentColor: '#53F5C7', overlayOpacity: 50 }, layout: editorial, styles: { headlineFont: 'Chakra Petch', descriptionFont: 'Manrope', headlineFontSize: 68, descriptionFontSize: 19 } },
  { id: 'weather-alert', name: 'Weather Alert', category: 'News', variant: 'weather', description: 'Atmospheric alert card with contour lines.', defaultBanner: 'WEATHER ALERT', defaultHeadline: 'Heavy rain expected overnight', defaultDescription: 'Stay updated and follow local travel advice.', theme: { backgroundColor: '#0C2333', surfaceColor: '#174A63', accentColor: '#F9D65C', overlayOpacity: 58 }, layout: bottom, styles: { headlineFont: 'Space Grotesk', descriptionFont: 'Manrope', headlineFontSize: 72, descriptionFontSize: 20 } },
  { id: 'event-highlight', name: 'Event Highlight', category: 'Events', variant: 'event', description: 'Poster-inspired layout for events and culture.', defaultBanner: 'EVENT HIGHLIGHT', defaultHeadline: 'One night. One unforgettable stage.', defaultDescription: 'Saturday · 8 PM · Your venue', theme: { backgroundColor: '#19110C', surfaceColor: '#3D2516', accentColor: '#FFB000', overlayOpacity: 40 }, layout: editorial, styles: { headlineFont: 'Space Grotesk', descriptionFont: 'Manrope', headlineFontSize: 86, descriptionFontSize: 20 } },
  { id: 'flash-sale', name: 'Flash Sale', category: 'Commerce', variant: 'sale', description: 'High-contrast promotional layout built for offers.', defaultBanner: 'FLASH SALE', defaultHeadline: 'UP TO 50% OFF', defaultDescription: 'Today only · Shop before midnight', theme: { backgroundColor: '#F6F0DF', surfaceColor: '#191919', accentColor: '#FF3D00', overlayOpacity: 20 }, layout: center, styles: { headlineFont: 'Space Grotesk', descriptionFont: 'Manrope', headlineColor: '#151515', descriptionColor: '#292524', headlineFontSize: 96, descriptionFontSize: 20 } },
  { id: 'trending-topic', name: 'Trending Topic', category: 'Social', variant: 'viral', description: 'Conversation-first card with bold signal graphics.', defaultBanner: 'TRENDING NOW', defaultHeadline: 'The conversation just changed', defaultDescription: 'Here is why this story is gaining momentum.', theme: { backgroundColor: '#141414', surfaceColor: '#252525', accentColor: '#FACC15', overlayOpacity: 52 }, layout: bottom, styles: { headlineFont: 'Space Grotesk', descriptionFont: 'Manrope', headlineFontSize: 78, descriptionFontSize: 20 } },
  { id: 'live-update', name: 'Live Update', category: 'News', variant: 'broadcast', description: 'Continuous coverage layout with live indicators.', defaultBanner: 'LIVE UPDATE', defaultHeadline: 'Updates as the story unfolds', defaultDescription: 'Latest information · Updated moments ago', theme: { backgroundColor: '#080A0D', surfaceColor: '#181C22', accentColor: '#FF2F45', overlayOpacity: 66 }, layout: bottom, styles: { headlineFont: 'Space Grotesk', descriptionFont: 'Manrope', headlineFontSize: 72, descriptionFontSize: 20 } },
  { id: 'exclusive-story', name: 'Exclusive Story', category: 'Editorial', variant: 'editorial', description: 'Magazine cover treatment for original reporting.', defaultBanner: 'EXCLUSIVE', defaultHeadline: 'Inside the story shaping tomorrow', defaultDescription: 'Original reporting · By your newsroom', theme: { backgroundColor: '#12100E', surfaceColor: '#2A241F', accentColor: '#D6B36A', overlayOpacity: 56 }, layout: editorial, styles: { headlineFont: 'DM Sans', descriptionFont: 'Manrope', headlineFontSize: 70, descriptionFontSize: 19, headlineCasing: 'none' } },
  { id: 'hot-topic', name: 'Hot Topic', category: 'Social', variant: 'fact', description: 'Opinion and explainer card with strong geometry.', defaultBanner: 'HOT TOPIC', defaultHeadline: 'Why this matters right now', defaultDescription: 'Break down the context in one clear sentence.', theme: { backgroundColor: '#1D0A06', surfaceColor: '#40150D', accentColor: '#FF7A1A', overlayOpacity: 46 }, layout: center, styles: { headlineFont: 'Space Grotesk', descriptionFont: 'Manrope', headlineFontSize: 76, descriptionFontSize: 20 } }
];

export function getTemplate(id: TemplateType): Template { return TEMPLATES.find(template => template.id === id) || TEMPLATES[0]; }
export function getDefaultTemplate(): Template { return TEMPLATES[0]; }
