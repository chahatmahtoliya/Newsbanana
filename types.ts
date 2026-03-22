export type TextCase = 'uppercase' | 'lowercase' | 'sentence' | 'none';

export interface StyleSettings {
  headlineFontSize: number;      // 50-120px
  descriptionFontSize: number;   // 24-60px
  headlineColor: string;         // hex color
  descriptionColor: string;      // hex color
  bannerColor: string;           // hex color for "BREAKING NEWS"
  headlineFont: string;          // font family for headline
  descriptionFont: string;       // font family for description
  headlineCasing: TextCase;
  descriptionCasing: TextCase;
}

export interface ElementPosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface LayoutSettings {
  banner: ElementPosition;
  headline: ElementPosition;
  description: ElementPosition;
}

export const defaultLayoutSettings: LayoutSettings = {
  banner: { x: 5, y: 5 },
  headline: { x: 5, y: 70 },
  description: { x: 5, y: 85 }
};

export type VideoMode = 'single' | 'slideshow' | 'collage' | 'kenburns';
export type TransitionType = 'fade' | 'slide' | 'crossfade' | 'none';
export type CollageLayout = '2x2' | '3x3' | '2x3';

// Social media size presets
export type SocialMediaPlatform =
  | 'instagram-post'
  | 'instagram-story'
  | 'instagram-reel'
  | 'facebook-post'
  | 'twitter-post'
  | 'linkedin-post'
  | 'youtube-thumbnail'
  | 'pinterest-pin'
  | 'custom';

export interface SocialMediaSizePreset {
  id: SocialMediaPlatform;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export const socialMediaSizes: SocialMediaSizePreset[] = [
  { id: 'instagram-post', name: 'Instagram Post', width: 1080, height: 1080, aspectRatio: '1:1' },
  { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920, aspectRatio: '9:16' },
  { id: 'instagram-reel', name: 'Instagram Reel', width: 1080, height: 1920, aspectRatio: '9:16' },
  { id: 'facebook-post', name: 'Facebook Post', width: 1200, height: 630, aspectRatio: '1.91:1' },
  { id: 'twitter-post', name: 'Twitter/X Post', width: 1600, height: 900, aspectRatio: '16:9' },
  { id: 'linkedin-post', name: 'LinkedIn Post', width: 1200, height: 627, aspectRatio: '1.91:1' },
  { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720, aspectRatio: '16:9' },
  { id: 'pinterest-pin', name: 'Pinterest Pin', width: 1000, height: 1500, aspectRatio: '2:3' },
];

export interface MultiImageSettings {
  videoMode: VideoMode;
  imageDuration: number;         // seconds per image (1-10)
  transitionType: TransitionType;
  collageLayout: CollageLayout;
}

export interface NewsData {
  headline: string;
  description: string;
  uploadedMedia: string | null;   // base64 data URL for single image/video
  mediaType: 'image' | 'video';
  videoTimestamp: number;         // seconds, for video frame extraction
  styleSettings: StyleSettings;
  outputMode: 'image' | 'video';  // 'image' = single frame, 'video' = full video with overlay
  // Multi-image mode
  multipleImages: string[];       // array of base64 data URLs
  multiImageSettings: MultiImageSettings;
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  currentStep: 'idle' | 'generating' | 'encoding' | 'complete';
  videoProgress: number;          // 0-100 for video encoding progress
}

export interface GeneratedOutput {
  url: string;        // Base64 data URL or blob URL
  type: 'image' | 'video';
}

// Default style settings
export const defaultStyleSettings: StyleSettings = {
  headlineFontSize: 90,
  descriptionFontSize: 40,
  headlineColor: '#FFFFFF',
  descriptionColor: '#E5E5E5',
  bannerColor: '#D90000',
  headlineFont: 'Oswald',
  descriptionFont: 'Inter',
  headlineCasing: 'uppercase',
  descriptionCasing: 'sentence',
};

// Default multi-image settings
export const defaultMultiImageSettings: MultiImageSettings = {
  videoMode: 'single',
  imageDuration: 3,
  transitionType: 'fade',
  collageLayout: '2x2',
};

// Available fonts for selection
export const availableFonts = [
  'Oswald',
  'Inter',
  'Roboto',
  'Montserrat',
  'Poppins',
  'Playfair Display',
  'Bebas Neue',
  'Anton',
  'Lato',
  'Open Sans',
];