import React, { useState, useRef } from 'react';
import { Newspaper, Download, Image as ImageIcon, Type, Palette, Grid, X, Moon, Sun, Save, Plus, Minus, Film, Layers, Move, Monitor, RotateCcw, Sparkles, Rocket, ShieldCheck, ChevronDown, CheckCircle2, Mail, Upload } from 'lucide-react';
import { generateNewsCreative, generateNewsVideoCreative } from './services/geminiService';
import { generateMultiImageVideo } from './services/slideshowService';
import { generateNewsVideo } from './services/videoService';
import { StyleSettings, defaultStyleSettings, MultiImageSettings, defaultMultiImageSettings, VideoMode, TransitionType, CollageLayout, socialMediaSizes, SocialMediaSizePreset, SocialMediaPlatform, LayoutSettings, defaultLayoutSettings, TextCase } from './types';
import CreatorSidebar from './components/CreatorSidebar';

const applyTextCase = (text: string, casing: TextCase): string => {
  if (!text) return text;
  switch (casing) {
    case 'uppercase': return text.toUpperCase();
    case 'lowercase': return text.toLowerCase();
    case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'none': return text;
  }
};

// Template definition
interface VisualTemplate {
  id: string;
  name: string;
  thumbnail: string;
  defaultBanner: string;
}

const VISUAL_TEMPLATES: VisualTemplate[] = [
  { id: 'breaking-news', name: 'Breaking News', thumbnail: '/templates/template_breaking_news_1769538066288.png', defaultBanner: 'BREAKING NEWS' },
  { id: 'quote-card', name: 'Quote Card', thumbnail: '/templates/template_quote_card_1769538092996.png', defaultBanner: '' },
  { id: 'sports-score', name: 'Sports Score', thumbnail: '/templates/template_sports_score_1769538110413.png', defaultBanner: 'FINAL SCORE' },
  { id: 'announcement', name: 'Announcement', thumbnail: '/templates/template_announcement_1769538128393.png', defaultBanner: 'ANNOUNCEMENT' },
  { id: 'fact-card', name: 'Did You Know?', thumbnail: '/templates/template_fact_card_1769538157930.png', defaultBanner: 'DID YOU KNOW?' },
  { id: 'coming-soon', name: 'Coming Soon', thumbnail: '/templates/template_coming_soon_1769538173005.png', defaultBanner: 'COMING SOON' },
  // New creative templates
  { id: 'viral-alert', name: 'Viral Alert', thumbnail: '/templates/template_breaking_news_1769538066288.png', defaultBanner: 'ðŸ”¥ VIRAL ALERT' },
  { id: 'breaking-sports', name: 'Breaking Sports', thumbnail: '/templates/template_sports_score_1769538110413.png', defaultBanner: 'âš½ BREAKING SPORTS' },
  { id: 'tech-update', name: 'Tech Update', thumbnail: '/templates/template_announcement_1769538128393.png', defaultBanner: 'ðŸ’» TECH UPDATE' },
  { id: 'weather-alert', name: 'Weather Alert', thumbnail: '/templates/template_fact_card_1769538157930.png', defaultBanner: 'ðŸŒ¦ï¸ WEATHER ALERT' },
  { id: 'event-highlight', name: 'Event Highlight', thumbnail: '/templates/template_coming_soon_1769538173005.png', defaultBanner: 'ðŸŽ‰ EVENT HIGHLIGHT' },
  { id: 'flash-sale', name: 'Flash Sale', thumbnail: '/templates/template_announcement_1769538128393.png', defaultBanner: 'ðŸ’° FLASH SALE' },
  { id: 'trending-topic', name: 'Trending Topic', thumbnail: '/templates/template_breaking_news_1769538066288.png', defaultBanner: 'ðŸ“ˆ TRENDING NOW' },
  { id: 'live-update', name: 'Live Update', thumbnail: '/templates/template_announcement_1769538128393.png', defaultBanner: 'ðŸ”´ LIVE UPDATE' },
  { id: 'exclusive-story', name: 'Exclusive Story', thumbnail: '/templates/template_quote_card_1769538092996.png', defaultBanner: 'â­ EXCLUSIVE' },
  { id: 'hot-topic', name: 'Hot Topic', thumbnail: '/templates/template_fact_card_1769538157930.png', defaultBanner: 'ðŸ”¥ HOT TOPIC' },
];

// Expanded font collection - organized by style
const FONTS = [
  // Bold Display Fonts (great for headlines)
  'Oswald', 'Anton', 'Bebas Neue', 'Staatliches', 'Russo One', 'Teko', 'Secular One', 'Titan One', 'Black Ops One', 'Bungee', 'Concert One', 'Bangers',
  // Modern Sans-Serif
  'Inter', 'Roboto', 'Montserrat', 'Poppins', 'Lato', 'Open Sans', 'Raleway', 'Nunito', 'Rubik', 'Ubuntu', 'Source Sans 3', 'Space Grotesk', 'Fredoka', 'Chakra Petch',
  // Elegant Serif
  'Playfair Display', 'Cinzel', 'Lobster',
  // Handwriting & Script
  'Pacifico', 'Dancing Script', 'Caveat', 'Great Vibes', 'Satisfy', 'Permanent Marker',
  // Gaming & Retro
  'Orbitron', 'Press Start 2P'
];

const videoModes: { value: VideoMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'single', label: 'Single', icon: <Film className="w-4 h-4" />, desc: 'One image/video' },
  { value: 'slideshow', label: 'Slideshow', icon: <Layers className="w-4 h-4" />, desc: 'Images cycle' },
  { value: 'collage', label: 'Collage', icon: <Grid className="w-4 h-4" />, desc: 'Grid layout' },
  { value: 'kenburns', label: 'Ken Burns', icon: <Move className="w-4 h-4" />, desc: 'Cinematic pan/zoom' },
];

const SITE_FEATURES: { title: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { title: 'One-Click Templates', description: 'Start from proven layouts for news, sports, announcements, and viral posts.', icon: Sparkles },
  { title: 'Fast Video + Image Output', description: 'Generate static cards or short clips with slideshow, collage, and motion modes.', icon: Rocket },
  { title: 'Brand-Safe Controls', description: 'Customize fonts, colors, logo placement, and layout with real-time drag controls.', icon: ShieldCheck },
  { title: 'Platform-Ready Sizes', description: 'Design with optimized dimensions for Instagram, X, Facebook, LinkedIn, and YouTube.', icon: CheckCircle2 },
];

const WORKFLOW_STEPS = [
  { title: 'Pick Canvas + Template', description: 'Select target platform size and choose a visual template that fits your story.' },
  { title: 'Add Content + Brand', description: 'Insert headline, description, background media, and your logo in seconds.' },
  { title: 'Generate + Publish', description: 'Create your final image/video and download production-ready output instantly.' },
];

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    subtitle: 'For quick social updates',
    features: ['Core templates', 'Single export workflow', 'Basic style controls'],
    highlighted: false
  },
  {
    name: 'Creator Pro',
    price: '$10/mo',
    subtitle: 'For daily publishing',
    features: ['All templates', 'Video generation modes', 'Advanced style + layout controls'],
    highlighted: true
  },
  {
    name: 'Agency',
    price: '$40/mo',
    subtitle: 'For teams and brands',
    features: ['Team workflows', 'Brand consistency presets', 'Priority support'],
    highlighted: false
  },
];

const FAQ_ITEMS = [
  {
    question: 'Can I create both images and videos?',
    answer: 'Yes. You can generate static graphics or short videos using single media, slideshow, collage, and Ken Burns modes.'
  },
  {
    question: 'Does it support different social platforms?',
    answer: 'Yes. The app includes multiple social-media canvas presets so your content exports in platform-optimized dimensions.'
  },
  {
    question: 'Can I keep my branding consistent?',
    answer: 'Yes. You can upload your logo, set color themes, choose fonts, and position text elements to match brand guidelines.'
  },
  {
    question: 'Is this usable on mobile?',
    answer: 'Yes. The editor includes a mobile bottom bar and responsive panels for creating on smaller screens.'
  },
];

type ResizableTextElement = 'headline' | 'description';

const TEXT_SIZE_LIMITS: Record<ResizableTextElement, { min: number; max: number }> = {
  headline: { min: 24, max: 120 },
  description: { min: 12, max: 48 }
};

const App: React.FC = () => {
  // Theme
  const [darkMode, setDarkMode] = useState(false);

  // UI state
  const [showTemplateSidebar, setShowTemplateSidebar] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [activeColorTab, setActiveColorTab] = useState<'banner' | 'headline' | 'desc'>('banner');
  const [selectedSidebarCategory, setSelectedSidebarCategory] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Template
  const [selectedTemplate, setSelectedTemplate] = useState<VisualTemplate | null>(VISUAL_TEMPLATES[0]);

  // Content
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [bannerText, setBannerText] = useState('BREAKING NEWS');
  const [showBanner, setShowBanner] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMediaType, setUploadedMediaType] = useState<'image' | 'video'>('image');
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(90);
  const [logoPosition, setLogoPosition] = useState({ x: 75, y: 5 });
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);

  // Multi-image
  const [multipleImages, setMultipleImages] = useState<string[]>([]);
  const [multiImageSettings, setMultiImageSettings] = useState<MultiImageSettings>(defaultMultiImageSettings);

  // Style
  const [styleSettings, setStyleSettings] = useState<StyleSettings>({
    ...defaultStyleSettings,
    headlineFont: 'Oswald',
    descriptionFont: 'Inter',
    headlineFontSize: 70,
    descriptionFontSize: 18,
    headlineColor: '#FFFFFF',
    descriptionColor: '#E5E5E5',
    bannerColor: '#DC2626',
    headlineCasing: 'uppercase',
    descriptionCasing: 'sentence'
  });

  // Generation
  const [generatedOutput, setGeneratedOutput] = useState<{ url: string; type: 'image' | 'video'; extension?: 'png' | 'mp4' | 'webm' } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [generationTarget, setGenerationTarget] = useState<'image' | 'video' | null>(null);
  const [showVideoProgress, setShowVideoProgress] = useState(false);

  // Social media size
  const [selectedSocialMediaSize, setSelectedSocialMediaSize] = useState<SocialMediaSizePreset>(socialMediaSizes[0]);

  // Layout
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(defaultLayoutSettings);
  const [draggingElement, setDraggingElement] = useState<'banner' | 'headline' | 'description' | null>(null);
  const [resizingTextElement, setResizingTextElement] = useState<ResizableTextElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoDragOffsetRef = useRef({ x: 0, y: 0 });
  const textResizeStartRef = useRef({
    element: null as ResizableTextElement | null,
    startX: 0,
    startY: 0,
    startFontSize: 0
  });
  const mobileUploadInputRef = useRef<HTMLInputElement>(null);

  const isMultiImageMode = multiImageSettings.videoMode !== 'single';
  const previewMedia = uploadedImage || selectedTemplate?.thumbnail || null;
  const previewMediaType: 'image' | 'video' = uploadedImage ? uploadedMediaType : 'image';
  const isVideoGenerationInProgress = isGenerating && generationTarget === 'video';
  const generationPrimaryLabel = !isGenerating
    ? 'Create Graphic'
    : isVideoGenerationInProgress
      ? (showVideoProgress ? `Processing video... ${videoProgress}%` : 'Processing video...')
      : 'Creating image...';
  const generationCompactLabel = !isGenerating
    ? 'Create'
    : isVideoGenerationInProgress
      ? 'Processing'
      : 'Creating';

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobilePanel(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  React.useEffect(() => {
    if (!previewRef.current) return;

    const updatePreviewScale = () => {
      if (!previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const nextScale = rect.width / selectedSocialMediaSize.width;
      setPreviewScale(nextScale > 0 ? nextScale : 1);
    };

    updatePreviewScale();
    const observer = new ResizeObserver(updatePreviewScale);
    observer.observe(previewRef.current);
    window.addEventListener('resize', updatePreviewScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePreviewScale);
    };
  }, [selectedSocialMediaSize.id, generatedOutput]);

  React.useEffect(() => {
    if (!generatedOutput) return;
    setGeneratedOutput(null);
  }, [
    headline,
    description,
    bannerText,
    showBanner,
    uploadedImage,
    uploadedMediaType,
    uploadedLogo,
    logoSize,
    logoPosition.x,
    logoPosition.y,
    selectedTemplate?.id,
    selectedSocialMediaSize.id,
    styleSettings,
    layoutSettings,
    multipleImages,
    multiImageSettings
  ]);

  const updateDraggedElementPosition = (element: 'banner' | 'headline' | 'description', clientX: number, clientY: number) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setLayoutSettings(prev => ({
      ...prev,
      [element]: {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y))
      }
    }));
  };

  const updateLogoPosition = (clientX: number, clientY: number) => {
    if (!previewRef.current || !logoRef.current) return;
    const previewRect = previewRef.current.getBoundingClientRect();
    const logoRect = logoRef.current.getBoundingClientRect();
    const maxX = Math.max(0, previewRect.width - logoRect.width);
    const maxY = Math.max(0, previewRect.height - logoRect.height);

    const rawX = clientX - previewRect.left - logoDragOffsetRef.current.x;
    const rawY = clientY - previewRect.top - logoDragOffsetRef.current.y;
    const clampedX = Math.max(0, Math.min(maxX, rawX));
    const clampedY = Math.max(0, Math.min(maxY, rawY));

    setLogoPosition({
      x: (clampedX / previewRect.width) * 100,
      y: (clampedY / previewRect.height) * 100
    });
  };

  // Handlers
  const handleMouseDown = (e: React.MouseEvent, element: 'banner' | 'headline' | 'description') => {
    e.stopPropagation();
    e.preventDefault();
    setDraggingElement(element);
  };

  const handleTouchStart = (e: React.TouchEvent, element: 'banner' | 'headline' | 'description') => {
    if (!e.touches.length) return;
    e.stopPropagation();
    e.preventDefault();
    const touch = e.touches[0];
    setDraggingElement(element);
    updateDraggedElementPosition(element, touch.clientX, touch.clientY);
  };

  const updateTextSizeFromCanvasResize = (clientX: number, clientY: number) => {
    const resizeState = textResizeStartRef.current;
    if (!resizeState.element) return;

    const delta = (clientX - resizeState.startX) + (clientY - resizeState.startY);
    const speed = resizeState.element === 'headline' ? 0.35 : 0.2;
    const limits = TEXT_SIZE_LIMITS[resizeState.element];
    const nextSize = Math.round(Math.max(limits.min, Math.min(limits.max, resizeState.startFontSize + (delta * speed))));

    if (resizeState.element === 'headline') {
      setStyleSettings(prev => prev.headlineFontSize === nextSize ? prev : { ...prev, headlineFontSize: nextSize });
    } else {
      setStyleSettings(prev => prev.descriptionFontSize === nextSize ? prev : { ...prev, descriptionFontSize: nextSize });
    }
  };

  const startTextResize = (element: ResizableTextElement, clientX: number, clientY: number) => {
    setDraggingElement(null);
    textResizeStartRef.current = {
      element,
      startX: clientX,
      startY: clientY,
      startFontSize: element === 'headline' ? styleSettings.headlineFontSize : styleSettings.descriptionFontSize
    };
    setResizingTextElement(element);
  };

  const handleTextResizeMouseDown = (e: React.MouseEvent, element: ResizableTextElement) => {
    e.stopPropagation();
    e.preventDefault();
    startTextResize(element, e.clientX, e.clientY);
  };

  const handleTextResizeTouchStart = (e: React.TouchEvent, element: ResizableTextElement) => {
    if (!e.touches.length) return;
    e.stopPropagation();
    e.preventDefault();
    const touch = e.touches[0];
    startTextResize(element, touch.clientX, touch.clientY);
  };

  const handleLogoMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!previewRef.current || !logoRef.current) return;
    const logoRect = logoRef.current.getBoundingClientRect();
    logoDragOffsetRef.current = {
      x: e.clientX - logoRect.left,
      y: e.clientY - logoRect.top
    };
    setIsDraggingLogo(true);
  };

  const handleLogoTouchStart = (e: React.TouchEvent) => {
    if (!e.touches.length) return;
    e.stopPropagation();
    e.preventDefault();
    if (!previewRef.current || !logoRef.current) return;
    const touch = e.touches[0];
    const logoRect = logoRef.current.getBoundingClientRect();
    logoDragOffsetRef.current = {
      x: touch.clientX - logoRect.left,
      y: touch.clientY - logoRect.top
    };
    setIsDraggingLogo(true);
  };

  React.useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!draggingElement) return;
      updateDraggedElementPosition(draggingElement, e.clientX, e.clientY);
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (!draggingElement || !e.touches.length) return;
      e.preventDefault();
      const touch = e.touches[0];
      updateDraggedElementPosition(draggingElement, touch.clientX, touch.clientY);
    };

    const handleWindowMouseUp = () => {
      setDraggingElement(null);
    };

    const handleWindowTouchEnd = () => {
      setDraggingElement(null);
    };

    if (draggingElement) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
      window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
      window.addEventListener('touchend', handleWindowTouchEnd);
      window.addEventListener('touchcancel', handleWindowTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowTouchEnd);
      window.removeEventListener('touchcancel', handleWindowTouchEnd);
    };
  }, [draggingElement]);

  React.useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!resizingTextElement) return;
      updateTextSizeFromCanvasResize(e.clientX, e.clientY);
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (!resizingTextElement || !e.touches.length) return;
      e.preventDefault();
      const touch = e.touches[0];
      updateTextSizeFromCanvasResize(touch.clientX, touch.clientY);
    };

    const stopResize = () => {
      setResizingTextElement(null);
      textResizeStartRef.current.element = null;
    };

    if (resizingTextElement) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', stopResize);
      window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
      window.addEventListener('touchend', stopResize);
      window.addEventListener('touchcancel', stopResize);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', stopResize);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', stopResize);
      window.removeEventListener('touchcancel', stopResize);
    };
  }, [resizingTextElement]);

  React.useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDraggingLogo) return;
      updateLogoPosition(e.clientX, e.clientY);
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (!isDraggingLogo || !e.touches.length) return;
      e.preventDefault();
      const touch = e.touches[0];
      updateLogoPosition(touch.clientX, touch.clientY);
    };

    const handleWindowMouseUp = () => {
      if (isDraggingLogo) {
        setIsDraggingLogo(false);
      }
    };

    const handleWindowTouchEnd = () => {
      if (isDraggingLogo) {
        setIsDraggingLogo(false);
      }
    };

    if (isDraggingLogo) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
      window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
      window.addEventListener('touchend', handleWindowTouchEnd);
      window.addEventListener('touchcancel', handleWindowTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowTouchEnd);
      window.removeEventListener('touchcancel', handleWindowTouchEnd);
    };
  }, [isDraggingLogo]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      if (!isVideo && !isImage) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setUploadedMediaType(isVideo ? 'video' : 'image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMobileUploadClick = () => {
    setShowMobilePanel(false);
    mobileUploadInputRef.current?.click();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedLogo(reader.result as string);
        setLogoPosition({ x: 75, y: 5 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMultipleImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSelectTemplate = (template: VisualTemplate) => {
    setSelectedTemplate(template);
    setBannerText(template.defaultBanner);
    setShowBanner(!!template.defaultBanner);
    setShowTemplateSidebar(false);
  };

  const handleGenerate = async () => {
    if (!headline) return;
    const activeMediaType: 'image' | 'video' = uploadedImage ? uploadedMediaType : 'image';
    const isMultiImageVideo = isMultiImageMode && multipleImages.length > 0;
    const willGenerateVideo = isMultiImageVideo || activeMediaType === 'video';

    setVideoProgress(0);
    setGenerationTarget(willGenerateVideo ? 'video' : 'image');
    setShowVideoProgress(willGenerateVideo); // Show progress for any video generation
    setIsGenerating(true);

    try {
      if (isMultiImageVideo) {
        const videoUrl = await generateMultiImageVideo(
          multipleImages,
          headline,
          description,
          styleSettings,
          multiImageSettings,
          uploadedImage || undefined, // Pass uploaded media as audio source
          (p) => setVideoProgress(p)
        );
        setGeneratedOutput({ url: videoUrl, type: 'video', extension: 'mp4' });
      } else {
        const activeMedia = uploadedImage || selectedTemplate?.thumbnail || null;
        if (activeMediaType === 'video') {
          const videoUrl = await generateNewsVideo(
            headline,
            description,
            activeMedia,
            styleSettings,
            (p) => setVideoProgress(p)
          );
          setGeneratedOutput({ url: videoUrl, type: 'video', extension: 'mp4' });
        } else {
          const imageUrl = await generateNewsCreative(
            headline, description, activeMedia,
            activeMediaType, 0, styleSettings, selectedSocialMediaSize, layoutSettings, uploadedLogo, logoSize, logoPosition
          );
          setGeneratedOutput({ url: imageUrl, type: 'image', extension: 'png' });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setGenerationTarget(null);
      setShowVideoProgress(false);
    }
  };

  const handleDownload = () => {
    if (generatedOutput) {
      const extension = generatedOutput.extension || (generatedOutput.type === 'video' ? 'mp4' : 'png');
      const link = document.createElement('a');
      link.href = generatedOutput.url;
      link.download = `newsbanana-${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getActiveColor = () => {
    switch (activeColorTab) {
      case 'banner': return styleSettings.bannerColor;
      case 'headline': return styleSettings.headlineColor;
      case 'desc': return styleSettings.descriptionColor;
    }
  };

  const setActiveColor = (color: string) => {
    switch (activeColorTab) {
      case 'banner': setStyleSettings(prev => ({ ...prev, bannerColor: color })); break;
      case 'headline': setStyleSettings(prev => ({ ...prev, headlineColor: color })); break;
      case 'desc': setStyleSettings(prev => ({ ...prev, descriptionColor: color })); break;
    }
  };

  const shellBase = darkMode
    ? 'bg-gray-900 text-white border border-gray-800'
    : 'border border-gray-200 bg-white text-gray-900 shadow-sm';
  const shellMuted = darkMode ? 'text-[#8ba1b5]' : 'text-gray-500';
  const shellHeading = darkMode ? 'text-[#e8fff8]' : 'text-gray-900';
  const shellField = darkMode
    ? 'bg-[#09151f] border-[#183243] text-white placeholder-[#62798c]'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';
  const shellSubtle = darkMode
    ? 'border-gray-800 bg-gray-900'
    : 'border-gray-200 bg-gray-50';
  const accentSolid = darkMode
    ? 'bg-[#7EF7D4] text-[#041017] hover:bg-[#98ffe1]'
    : 'bg-gray-900 text-white hover:bg-gray-800';
  const accentGhost = darkMode
    ? 'border border-[#173042] bg-[#0a1822] text-[#d8fff4] hover:border-[#7EF7D4] hover:text-white'
    : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50';
  const successButton = darkMode
    ? 'bg-[#5BC0EB] text-[#06111A] hover:bg-[#76cff2]'
    : 'bg-emerald-600 text-white hover:bg-emerald-700';

  const styleSettingsPanel = (
    <div className="space-y-4">
      <div>
        <p className={`text-[11px] font-mono uppercase tracking-[0.28em] ${shellMuted}`}>Visual System</p>
        <h3 className={`mt-2 flex items-center text-sm font-semibold ${shellHeading}`}>
          <Palette className="w-4 h-4 mr-2 text-[#7EF7D4]" />
        Style Settings
        </h3>
      </div>

      <div className="mb-3">
        <label className={`text-sm block mb-1 ${darkMode ? 'text-[#cde7da]' : 'text-gray-700'}`}>Headline Font</label>
        <select
          value={styleSettings.headlineFont}
          onChange={(e) => setStyleSettings(prev => ({ ...prev, headlineFont: e.target.value }))}
          className={`w-full px-3 py-3 rounded-2xl border text-sm ${shellField} focus:outline-none focus:border-[#7EF7D4]`}
        >
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="mb-4">
        <label className={`text-sm block mb-1 ${darkMode ? 'text-[#cde7da]' : 'text-gray-700'}`}>Headline Casing</label>
        <div className="grid grid-cols-4 gap-1">
          {(['uppercase', 'lowercase', 'sentence', 'none'] as const).map(casing => (
            <button
              key={casing}
              onClick={() => setStyleSettings(prev => ({ ...prev, headlineCasing: casing }))}
              className={`text-xs py-1 rounded border transition-colors ${styleSettings.headlineCasing === casing
                ? 'bg-[#7EF7D4] text-[#041017] border-[#7EF7D4]'
                : darkMode ? 'bg-[#0c1b27] text-[#8ba1b5] border-[#173042]' : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
            >
              {casing === 'uppercase' ? 'AA' : casing === 'lowercase' ? 'aa' : casing === 'sentence' ? 'Aa' : 'Raw'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className={`text-sm block mb-1 ${darkMode ? 'text-[#cde7da]' : 'text-gray-700'}`}>Description Casing</label>
        <div className="grid grid-cols-4 gap-1">
          {(['uppercase', 'lowercase', 'sentence', 'none'] as const).map(casing => (
            <button
              key={casing}
              onClick={() => setStyleSettings(prev => ({ ...prev, descriptionCasing: casing }))}
              className={`text-xs py-1 rounded border transition-colors ${styleSettings.descriptionCasing === casing
                ? 'bg-[#7EF7D4] text-[#041017] border-[#7EF7D4]'
                : darkMode ? 'bg-[#0c1b27] text-[#8ba1b5] border-[#173042]' : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
            >
              {casing === 'uppercase' ? 'AA' : casing === 'lowercase' ? 'aa' : casing === 'sentence' ? 'Aa' : 'Raw'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <label className={`text-sm ${darkMode ? 'text-[#cde7da]' : 'text-gray-700'}`}>Headline Size</label>
          <span className={`text-xs ${shellMuted}`}>{styleSettings.headlineFontSize}px</span>
        </div>
        <input
          type="range"
          min={TEXT_SIZE_LIMITS.headline.min}
          max={TEXT_SIZE_LIMITS.headline.max}
          value={styleSettings.headlineFontSize}
          onChange={(e) => setStyleSettings(prev => ({ ...prev, headlineFontSize: parseInt(e.target.value) }))}
          className="w-full accent-red-500"
        />
      </div>

      <div className="mb-3">
        <label className={`text-sm block mb-1 ${darkMode ? 'text-[#cde7da]' : 'text-gray-700'}`}>Description Font</label>
        <select
          value={styleSettings.descriptionFont}
          onChange={(e) => setStyleSettings(prev => ({ ...prev, descriptionFont: e.target.value }))}
          className={`w-full px-3 py-3 rounded-2xl border text-sm ${shellField} focus:outline-none focus:border-[#7EF7D4]`}
        >
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <label className={`text-sm ${darkMode ? 'text-[#cde7da]' : 'text-gray-700'}`}>Description Size</label>
          <span className={`text-xs ${shellMuted}`}>{styleSettings.descriptionFontSize}px</span>
        </div>
        <input
          type="range"
          min={TEXT_SIZE_LIMITS.description.min}
          max={TEXT_SIZE_LIMITS.description.max}
          value={styleSettings.descriptionFontSize}
          onChange={(e) => setStyleSettings(prev => ({ ...prev, descriptionFontSize: parseInt(e.target.value) }))}
          className="w-full accent-red-500"
        />
      </div>

      <div className={`flex rounded-2xl overflow-hidden border ${darkMode ? 'border-[#173042]' : 'border-gray-300'}`}>
        {(['banner', 'headline', 'desc'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveColorTab(tab)}
            className={`flex-1 py-2 text-xs font-medium uppercase transition-colors ${activeColorTab === tab
              ? 'bg-[#7EF7D4] text-[#041017]'
              : darkMode ? 'bg-[#09151f] text-[#8ba1b5]' : 'bg-gray-100 text-gray-600'
              }`}
          >
            {tab === 'desc' ? 'Desc.' : tab}
          </button>
        ))}
      </div>
      <div className="mt-3">
        <input
          type="color"
          value={getActiveColor()}
          onChange={(e) => setActiveColor(e.target.value)}
          className="w-full h-12 rounded-2xl cursor-pointer"
        />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-black' : 'bg-gray-100'}`}>
      {/* ============ CREATOR SIDEBAR ============ */}
      <div className="hidden md:flex h-screen sticky top-0">
        <CreatorSidebar
          darkMode={darkMode}
          onCategorySelect={setSelectedSidebarCategory}
          selectedCategory={selectedSidebarCategory}
        />
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
        {/* ============ HEADER ============ */}
        <header className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} border-b px-4 py-3 sticky top-0 z-40`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className={`${darkMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white'} p-2 rounded-lg`}>
                <Newspaper className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>news</span>
                  <span className="text-red-500 font-bold">banana</span>
                </div>
                <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Create Professional News Graphics</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-5">
              {[
                { href: '#studio', label: 'Studio' },
                { href: '#features', label: 'Features' },
                { href: '#pricing', label: 'Pricing' },
                { href: '#faq', label: 'FAQ' },
                { href: '#contact', label: 'Contact' },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setShowMobilePanel(!showMobilePanel)}
              className={`md:hidden p-2 rounded-lg ${showMobilePanel ? 'bg-red-500 text-white' : darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
            >
              <Type className="w-5 h-5" />
            </button>

            {/* Action buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setShowTemplateSidebar(true)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Grid className="w-4 h-4 mr-2" />
                Templates
              </button>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !headline}
                className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                {generationPrimaryLabel}
              </button>

              <button
                onClick={handleDownload}
                disabled={!generatedOutput}
                className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-900 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        <div id="studio" className="relative flex flex-col md:flex-row max-w-7xl mx-auto w-full scroll-mt-24 gap-4 md:gap-0">
          {showMobilePanel && (
            <button
              type="button"
              aria-label="Close editor panel"
              onClick={() => setShowMobilePanel(false)}
              className="md:hidden fixed inset-0 top-[57px] z-40 bg-black/45"
            />
          )}

          {/* ============ LEFT PANEL ============ */}
          <aside className={`
          fixed md:static inset-x-0 top-[57px] bottom-0 md:inset-auto
          ${showMobilePanel ? 'translate-y-0' : 'translate-y-full pointer-events-none'} md:translate-y-0 md:pointer-events-auto
          z-50 md:z-auto
          w-full md:w-80 lg:w-96
          max-h-[calc(100dvh-57px)] md:max-h-none
          ${darkMode ? 'bg-black' : 'bg-white'}
          md:min-h-[calc(100vh-57px)] overflow-y-auto md:overflow-visible overscroll-y-contain md:overscroll-auto
          p-4 md:p-6 pb-24 md:pb-6
          border-t md:border-t-0 border-b md:border-b-0 md:border-r
          ${darkMode ? 'border-gray-800' : 'border-gray-200'}
          transition-transform duration-300 ease-out
        `}>
            {/* Canvas Size Selection */}
            <div className="mb-6">
              <h3 className={`flex items-center text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <Monitor className="w-4 h-4 mr-2 text-red-500" />
                Canvas Size
              </h3>
              <select
                value={selectedSocialMediaSize.id}
                onChange={(e) => {
                  const size = socialMediaSizes.find(s => s.id === e.target.value);
                  if (size) setSelectedSocialMediaSize(size);
                }}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:border-red-500`}
              >
                {socialMediaSizes.map(size => (
                  <option key={size.id} value={size.id}>
                    {size.name} ({size.width}x{size.height})
                  </option>
                ))}
              </select>
            </div>

            {/* Video Mode Selection */}
            <div className="mb-6">
              <h3 className={`flex items-center text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <Film className="w-4 h-4 mr-2 text-red-500" />
                Video Mode
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {videoModes.map(mode => (
                  <button
                    key={mode.value}
                    onClick={() => setMultiImageSettings(prev => ({ ...prev, videoMode: mode.value }))}
                    className={`p-2 rounded-lg border text-left transition-all ${multiImageSettings.videoMode === mode.value
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : darkMode
                        ? 'border-gray-800 bg-gray-900 text-gray-300 hover:border-gray-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center space-x-2">
                      {mode.icon}
                      <span className="text-xs font-medium">{mode.label}</span>
                    </div>
                    <span className="text-xs opacity-60">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Image */}
            <div className="mb-6">
              <h3 className={`flex items-center text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <ImageIcon className="w-4 h-4 mr-2 text-red-500" />
                Background Media
              </h3>

              {isMultiImageMode ? (
                // Multi-image upload
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {multipleImages.map((img, i) => (
                      <div key={i} className="relative w-16 h-16">
                        <img src={img} alt="" className="w-full h-full object-cover rounded" />
                        <button
                          onClick={() => setMultipleImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className={`block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${darkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-300 hover:border-gray-400'}`}>
                    <ImageIcon className={`w-6 h-6 mx-auto mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add images</span>
                    <input type="file" accept="image/*" multiple onChange={handleMultiImageUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                // Single image upload
                uploadedImage ? (
                  <div className="relative">
                    {uploadedMediaType === 'video' ? (
                      <video src={uploadedImage} className="w-full h-24 object-cover rounded-lg" controls muted playsInline />
                    ) : (
                      <img src={uploadedImage} alt="Background" className="w-full h-24 object-cover rounded-lg" />
                    )}
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setUploadedMediaType('image');
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p className={`text-xs text-center mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click to replace</p>
                  </div>
                ) : (
                  <label className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${darkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-300 hover:border-gray-400'}`}>
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <ImageIcon className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    </div>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click to replace</span>
                    <input type="file" accept="image/*,video/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )
              )}
            </div>

            {/* Logo */}
            <div className="mb-6">
              <h3 className={`flex items-center text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <ImageIcon className="w-4 h-4 mr-2 text-red-500" />
                Logo
              </h3>

              {uploadedLogo ? (
                <div className="relative mb-3">
                  <img src={uploadedLogo} alt="Logo" className="w-auto h-16 object-contain rounded-lg bg-black/10 p-1" />
                  <button
                    onClick={() => setUploadedLogo(null)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    title="Remove logo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className={`block border-2 border-dashed rounded-lg p-2.5 text-center cursor-pointer transition-colors mb-3 ${darkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-300 hover:border-gray-400'}`}>
                  <div className={`w-8 h-8 mx-auto mb-1 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <ImageIcon className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <span className={`text-[11px] leading-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              )}

              <div>
                <div className="flex justify-between mb-1">
                  <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Logo Size</label>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{logoSize}px</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={220}
                  value={logoSize}
                  onChange={(e) => setLogoSize(parseInt(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Drag logo to move. Drag text corner handles on canvas to resize in real time.</p>
              </div>
            </div>

            {/* Text Content */}
            <div className="mb-6">
              <h3 className={`flex items-center text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <Type className="w-4 h-4 mr-2 text-red-500" />
                Text Content
              </h3>

              {/* Banner Toggle */}
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Banner Text</label>
                <button
                  onClick={() => setShowBanner(!showBanner)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${showBanner ? 'bg-red-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showBanner ? 'translate-x-6' : ''}`} />
                </button>
              </div>
              {showBanner && (
                <input
                  type="text"
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value.toUpperCase())}
                  className={`w-full px-3 py-2 rounded-lg border text-sm mb-3 ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:border-red-500`}
                />
              )}

              {/* Headline */}
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Headline <span className="text-red-500">*</span></label>
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{headline.length}/50</span>
                </div>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  // maxLength={50} // Limit removed
                  placeholder="Enter headline..."
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:border-red-500`}
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{description.length}/300</span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={300}
                  rows={4}
                  placeholder="Enter description..."
                  className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${darkMode ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:border-red-500`}
                />
              </div>
            </div>

            <div className="lg:hidden">
              {styleSettingsPanel}
            </div>
          </aside>

          {/* ============ RIGHT PANEL - PREVIEW ============ */}
          <main className={`flex-1 p-3 sm:p-4 md:p-8 pb-24 md:pb-8 ${darkMode ? 'bg-black' : 'bg-gray-100'} min-h-[calc(100vh-57px)] flex flex-col`}>
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              <div className="flex-1 flex flex-col">
                {/* Preview Canvas */}
                <div className="flex-1 flex items-start justify-center pt-2 md:pt-4 mb-4 px-1 sm:px-2">
                  <div
                    className="bg-black rounded-xl overflow-hidden shadow-2xl transition-transform"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                  >
                    {generatedOutput ? (
                      generatedOutput.type === 'video' ? (
                        <video src={generatedOutput.url} controls autoPlay loop className="max-w-full max-h-[70vh]" />
                      ) : (
                        <img src={generatedOutput.url} alt="Generated" className="max-w-full max-h-[70vh]" />
                      )
                    ) : (
                      <div
                        ref={previewRef}
                        className="w-full max-w-[500px] relative transition-all duration-300 cursor-crosshair group"
                        style={{ aspectRatio: selectedSocialMediaSize.aspectRatio.replace(':', '/') }}

                      >
                        {/* Background */}
                        {previewMedia ? (
                          previewMediaType === 'video' ? (
                            <video src={previewMedia} className="w-full h-full object-cover select-none pointer-events-none" autoPlay muted loop playsInline />
                          ) : (
                            <img src={previewMedia} alt="" className="w-full h-full object-cover select-none pointer-events-none" />
                          )
                        ) : (
                          <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 select-none pointer-events-none" />
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none select-none" />

                        {/* Logo overlay */}
                        {uploadedLogo && (
                          <div
                            ref={logoRef}
                            onMouseDown={handleLogoMouseDown}
                            onTouchStart={handleLogoTouchStart}
                            className={`absolute z-30 select-none cursor-move transition-shadow ${isDraggingLogo ? 'ring-2 ring-red-500 shadow-xl' : 'hover:ring-1 hover:ring-white/60'}`}
                            style={{
                              left: `${logoPosition.x}%`,
                              top: `${logoPosition.y}%`
                            }}
                          >
                            <img
                              src={uploadedLogo}
                              alt="Logo overlay"
                              className="h-auto object-contain drop-shadow-lg pointer-events-none"
                              style={{ width: `${logoSize}px` }}
                            />
                          </div>
                        )}

                        {/* Icon button (top right) */}
                        <button className={`absolute top-4 right-4 w-8 h-8 bg-gray-800/80 rounded-lg flex items-center justify-center z-20 ${uploadedLogo ? 'opacity-0 pointer-events-none' : ''}`}>
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                        </button>

                        {/* Content Layer */}
                        <div className="absolute inset-0 overflow-hidden">
                          {showBanner && bannerText && (
                            <div
                              onMouseDown={(e) => handleMouseDown(e, 'banner')}
                              onTouchStart={(e) => handleTouchStart(e, 'banner')}
                              className={`absolute px-3 py-1 text-xs font-bold mb-3 uppercase tracking-wide cursor-move select-none transition-shadow ${draggingElement === 'banner' ? 'ring-2 ring-red-500 shadow-xl z-20' : 'hover:ring-1 hover:ring-white/50 z-10'}`}
                              style={{
                                left: `${layoutSettings.banner.x}%`,
                                top: `${layoutSettings.banner.y}%`,
                                backgroundColor: styleSettings.bannerColor,
                                fontFamily: 'Oswald, sans-serif'
                              }}
                            >
                              {bannerText}
                            </div>
                          )}

                          <h2
                            onMouseDown={(e) => handleMouseDown(e, 'headline')}
                            onTouchStart={(e) => handleTouchStart(e, 'headline')}
                            className={`absolute relative font-bold mb-3 leading-tight cursor-move select-none transition-shadow ${draggingElement === 'headline' || resizingTextElement === 'headline' ? 'ring-2 ring-red-500 shadow-xl z-20' : 'hover:ring-1 hover:ring-white/50 z-10'}`}
                            style={{
                              left: `${layoutSettings.headline.x}%`,
                              top: `${layoutSettings.headline.y}%`,
                              color: styleSettings.headlineColor,
                              fontFamily: `${styleSettings.headlineFont}, sans-serif`,
                              fontSize: `${Math.max(10, styleSettings.headlineFontSize * previewScale)}px`,
                              wordBreak: 'break-word',
                              maxWidth: '90%'
                            }}
                          >
                            {applyTextCase(headline || 'TEMPLATE', styleSettings.headlineCasing)}
                            <button
                              type="button"
                              onMouseDown={(e) => handleTextResizeMouseDown(e, 'headline')}
                              onTouchStart={(e) => handleTextResizeTouchStart(e, 'headline')}
                               className="absolute -bottom-2 -right-2 w-4 h-4 rounded-sm border border-white/80 bg-red-500/90 shadow-md cursor-nwse-resize"
                              title="Resize headline text"
                              aria-label="Resize headline text"
                            />
                          </h2>

                          <p
                            onMouseDown={(e) => handleMouseDown(e, 'description')}
                            onTouchStart={(e) => handleTouchStart(e, 'description')}
                            className={`absolute relative leading-relaxed cursor-move select-none transition-shadow ${draggingElement === 'description' || resizingTextElement === 'description' ? 'ring-2 ring-red-500 shadow-xl z-20' : 'hover:ring-1 hover:ring-white/50 z-10'}`}
                            style={{
                              left: `${layoutSettings.description.x}%`,
                              top: `${layoutSettings.description.y}%`,
                              color: styleSettings.descriptionColor,
                              fontFamily: `${styleSettings.descriptionFont}, sans-serif`,
                              fontSize: `${Math.max(8, styleSettings.descriptionFontSize * previewScale)}px`,
                              wordBreak: 'break-word',
                              maxWidth: '90%'
                            }}
                          >
                            {applyTextCase(description || 'Your description will appear here...', styleSettings.descriptionCasing)}
                            <button
                              type="button"
                              onMouseDown={(e) => handleTextResizeMouseDown(e, 'description')}
                              onTouchStart={(e) => handleTextResizeTouchStart(e, 'description')}
                               className="absolute -bottom-2 -right-2 w-4 h-4 rounded-sm border border-white/80 bg-red-500/90 shadow-md cursor-nwse-resize"
                              title="Resize description text"
                              aria-label="Resize description text"
                            />
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {isVideoGenerationInProgress && (
                  <div className={`mb-4 rounded-lg border px-4 py-3 ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-200 bg-white text-gray-700'}`}>
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>Video is processing...</span>
                      {showVideoProgress && <span>{videoProgress}%</span>}
                    </div>
                    {showVideoProgress && (
                        <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div
                           className="h-full bg-red-500 transition-all duration-200"
                           style={{ width: `${videoProgress}%` }}
                         />
                       </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
                  <button className={`flex items-center justify-center px-4 sm:px-6 py-2 rounded-lg text-sm font-medium border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !headline}
                    className="flex items-center justify-center px-4 sm:px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {generationPrimaryLabel}
                  </button>
                </div>

                {/* Zoom Controls & Reset Layout */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <button
                    onClick={() => setLayoutSettings(defaultLayoutSettings)}
                    className={`w-full sm:w-auto p-2 rounded-lg text-xs flex items-center justify-center ${darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                    title="Reset Layout"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset Layout
                  </button>

                  <div className="w-full sm:w-auto flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setZoom(Math.max(50, zoom - 10))}
                      className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700 border border-gray-200'}`}>
                      {zoom}%
                    </span>
                    <button
                      onClick={() => setZoom(Math.min(150, zoom + 10))}
                      className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <aside className={`hidden lg:block lg:w-80 2xl:w-96 rounded-xl border p-4 h-fit lg:sticky lg:top-24 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                {styleSettingsPanel}
              </aside>
            </div>
          </main>
        </div>

        <section
          id="features"
          className={`scroll-mt-24 border-t reveal ${darkMode ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20 reveal reveal-delay-1">
            <p className="text-red-500 text-xs tracking-[0.2em] font-semibold uppercase mb-3">Complete Creator Suite</p>
            <h2 className={`font-sans text-3xl md:text-5xl leading-tight reveal reveal-delay-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Build, brand, and publish from one workspace
            </h2>
            <p className={`mt-4 max-w-3xl text-sm md:text-base reveal reveal-delay-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Newsbanana now includes full-site sections so visitors can understand your product, pricing, and workflow before entering the editor.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mt-10">
              {SITE_FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    className={`rounded-2xl border p-5 transition-transform hover:-translate-y-1 smooth-card reveal ${idx > 0 ? `reveal-delay-${Math.min(idx, 3)}` : ''} ${darkMode ? 'border-gray-800 bg-gradient-to-b from-gray-950 to-black' : 'border-gray-200 bg-gradient-to-b from-white to-gray-50'}`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`reveal ${darkMode ? 'bg-black' : 'bg-gray-100'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 reveal reveal-delay-1">
            <div className={`rounded-2xl border p-6 md:p-10 reveal reveal-delay-2 ${darkMode ? 'border-gray-800 bg-gradient-to-br from-gray-950 to-black' : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'}`}>
              <p className="text-red-500 text-xs tracking-[0.2em] font-semibold uppercase mb-3">Workflow</p>
              <h2 className={`font-sans text-2xl md:text-4xl mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Three steps to ship every post faster
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {WORKFLOW_STEPS.map((step, idx) => (
                  <div key={step.title} className={`rounded-xl border p-5 reveal smooth-card ${idx > 0 ? `reveal-delay-${Math.min(idx, 3)}` : ''} ${darkMode ? 'border-gray-800 bg-black/40' : 'border-gray-200 bg-white'}`}>
                    <p className="text-xs uppercase tracking-[0.18em] text-red-500 mb-2">Step {idx + 1}</p>
                    <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className={`scroll-mt-24 reveal ${darkMode ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20 reveal reveal-delay-1">
            <p className="text-red-500 text-xs tracking-[0.2em] font-semibold uppercase mb-3">Pricing</p>
            <h2 className={`font-sans text-3xl md:text-5xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Plans for creators and teams
            </h2>
            <div className="grid gap-5 md:grid-cols-3 mt-10">
              {PRICING_PLANS.map((plan, idx) => (
                <article
                  key={plan.name}
                  className={`rounded-2xl border p-6 reveal smooth-card ${idx > 0 ? `reveal-delay-${Math.min(idx, 3)}` : ''} ${plan.highlighted ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]' : darkMode ? 'border-gray-800' : 'border-gray-200'} ${darkMode ? 'bg-gradient-to-b from-gray-950 to-black' : 'bg-gradient-to-b from-white to-gray-50'}`}
                >
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{plan.name}</p>
                  <p className={`font-sans text-4xl mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{plan.price}</p>
                  <p className={`text-sm mt-2 mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{plan.subtitle}</p>
                  <div className="space-y-2.5">
                    {plan.features.map(feature => (
                      <div key={feature} className="flex items-start space-x-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className={`w-full mt-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${plan.highlighted ? 'bg-red-500 text-white hover:bg-red-600' : darkMode ? 'bg-gray-900 text-gray-200 hover:bg-gray-800 border border-gray-700' : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-300'}`}
                  >
                    Choose {plan.name}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className={`scroll-mt-24 border-y reveal ${darkMode ? 'border-gray-800 bg-black' : 'border-gray-200 bg-gray-100'}`}>
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-14 md:py-16 reveal reveal-delay-1">
            <p className="text-red-500 text-xs tracking-[0.2em] font-semibold uppercase mb-3">FAQ</p>
            <h2 className={`font-sans text-3xl md:text-4xl mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Common questions before you publish
            </h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={item.question} className={`rounded-xl border reveal ${idx > 0 ? `reveal-delay-${Math.min(idx, 3)}` : ''} ${darkMode ? 'border-gray-800 bg-gray-950/50' : 'border-gray-200 bg-white'}`}>
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className={`w-full flex items-center justify-between text-left p-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      <span className="font-medium">{item.question}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>
                    {isOpen && (
                      <p className={`px-4 pb-4 text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact" className={`scroll-mt-24 reveal ${darkMode ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20 reveal reveal-delay-1">
            <div className={`rounded-3xl border p-8 md:p-12 reveal reveal-delay-2 ${darkMode ? 'border-gray-800 bg-gradient-to-r from-gray-950 via-black to-gray-900' : 'border-gray-200 bg-gradient-to-r from-white via-gray-50 to-gray-100'}`}>
              <p className="text-red-500 text-xs tracking-[0.2em] font-semibold uppercase mb-3">Contact</p>
              <h2 className={`font-sans text-3xl md:text-5xl leading-tight max-w-3xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Ready to launch faster content production?
              </h2>
              <p className={`mt-4 max-w-2xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Use the studio above to create now, or contact us for team onboarding and custom setup.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a
                  href="#studio"
                  className="inline-flex items-center justify-center rounded-lg px-5 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
                >
                  Open Creator Studio
                </a>
                <a
                  href="mailto:hello@newsbanana.com"
                  className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-medium border ${darkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-900' : 'border-gray-300 text-gray-800 hover:bg-gray-50'}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  hello@newsbanana.com
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className={`border-t reveal ${darkMode ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3 reveal reveal-delay-1">
            <div className="flex items-center space-x-2">
              <div className="bg-red-500 p-1.5 rounded-md">
                <Newspaper className="w-4 h-4 text-white" />
              </div>
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>newsbanana</span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Copyright {new Date().getFullYear()} newsbanana. All rights reserved.
            </p>
          </div>
        </footer>

        {/* ============ TEMPLATE SIDEBAR ============ */}
        {showTemplateSidebar && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowTemplateSidebar(false)} />
            <div className={`relative ml-auto w-full max-w-sm h-full overflow-y-auto shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Templates</h2>
                  <button onClick={() => setShowTemplateSidebar(false)} className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {VISUAL_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTemplate(t)}
                      className={`rounded-lg overflow-hidden border-2 transition-all ${selectedTemplate?.id === t.id ? 'border-red-500' : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                      </div>
                      <p className={`p-2 text-xs text-center font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>{t.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Floating Upload */}
        <div className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-[calc(env(safe-area-inset-bottom)+4.25rem)] z-[60]">
          <button
            type="button"
            onClick={handleMobileUploadClick}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-xl border-4 border-white/20 flex items-center justify-center"
            title="Upload image or video"
            aria-label="Upload image or video"
          >
            <Upload className="w-6 h-6" />
          </button>
          <input
            ref={mobileUploadInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Mobile Bottom Bar */}
        <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t px-2 sm:px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] flex justify-around z-50 ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          <button
            onClick={() => setShowMobilePanel(!showMobilePanel)}
            className={`flex flex-col items-center ${showMobilePanel ? 'text-red-500' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            <Type className="w-5 h-5" />
            <span className="text-xs mt-1">Edit</span>
          </button>
          <button
            onClick={() => {
              setShowMobilePanel(false);
              setShowTemplateSidebar(true);
            }}
            className={`flex flex-col items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            <Grid className="w-5 h-5" />
            <span className="text-xs mt-1">Templates</span>
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !headline}
            className="flex flex-col items-center text-red-500 disabled:opacity-40"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs mt-1">{generationCompactLabel}</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={!generatedOutput}
            className="flex flex-col items-center text-green-500 disabled:opacity-40"
          >
            <Download className="w-5 h-5" />
            <span className="text-xs mt-1">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
