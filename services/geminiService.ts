// This service now handles local canvas generation instead of AI APIs
import { StyleSettings, SocialMediaSizePreset, socialMediaSizes, LayoutSettings } from '../types';

// Helper to apply text casing
const applyTextCase = (text: string, casing: 'uppercase' | 'lowercase' | 'sentence' | 'none' = 'none'): string => {
  if (!text) return text;
  switch (casing) {
    case 'uppercase': return text.toUpperCase();
    case 'lowercase': return text.toLowerCase();
    case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'none': return text;
    default: return text;
  }
};

/**
 * Helper to wrap text on HTML5 Canvas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

/**
 * Extract a single frame from a video at a given timestamp
 */
export const extractVideoFrame = (
  videoDataUrl: string,
  timestamp: number
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(timestamp, video.duration);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(video, 0, 0);

      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to create image from video frame'));
      img.src = canvas.toDataURL('image/png');
    };

    video.onerror = () => reject(new Error('Failed to load video'));
    video.src = videoDataUrl;
  });
};

/**
 * Generates the news creative using HTML5 Canvas locally.
 * No API calls are made.
 */
export const generateNewsCreative = async (
  headline: string,
  description: string,
  uploadedMedia: string | null,
  mediaType: 'image' | 'video' = 'image',
  videoTimestamp: number = 0,
  styleSettings?: StyleSettings,
  socialMediaSize?: SocialMediaSizePreset,
  layoutSettings?: LayoutSettings,
  logoImage?: string | null,
  logoSize: number = 90,
  logoPosition?: { x: number; y: number }
): Promise<string> => {
  if (!uploadedMedia) {
    throw new Error("Background media is required");
  }

  // Default style settings
  const styles: StyleSettings = styleSettings || {
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

  // Ensure fonts are loaded before drawing so metrics are accurate
  await document.fonts.ready;

  // Get the source image (either directly or from video frame)
  let sourceImage: HTMLImageElement;

  if (mediaType === 'video') {
    sourceImage = await extractVideoFrame(uploadedMedia, videoTimestamp);
  } else {
    sourceImage = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = uploadedMedia;
    });
  }

  let logoAsset: HTMLImageElement | null = null;
  if (logoImage) {
    logoAsset = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load logo image'));
      img.src = logoImage;
    });
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    try {
      // Use social media size or default to Instagram Post dimensions (HD)
      const targetWidth = socialMediaSize?.width || 1080;
      const targetHeight = socialMediaSize?.height || 1350;
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // 1. Draw Background Image (Object-Cover style)
      const scale = Math.max(targetWidth / sourceImage.width, targetHeight / sourceImage.height);
      const x = (targetWidth / 2) - (sourceImage.width / 2) * scale;
      const y = (targetHeight / 2) - (sourceImage.height / 2) * scale;

      ctx.drawImage(sourceImage, x, y, sourceImage.width * scale, sourceImage.height * scale);

      // 2. Add Vignette/Gradient Overlay
      // Dark gradient at the bottom for text readability
      const gradient = ctx.createLinearGradient(0, targetHeight * 0.4, 0, targetHeight);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(0.6, "rgba(0,0,0,0.8)");
      gradient.addColorStop(1, "rgba(0,0,0,0.95)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // 3. Draw logo if provided
      if (logoAsset) {
        const logoPadding = Math.max(Math.round(targetWidth * 0.02), 16);
        const logoWidth = Math.max(Math.round((logoSize / 500) * targetWidth), 40);
        const logoHeight = (logoAsset.height / logoAsset.width) * logoWidth;
        let logoX = targetWidth - logoWidth - logoPadding;
        let logoY = logoPadding;

        if (logoPosition) {
          logoX = (targetWidth * logoPosition.x) / 100;
          logoY = (targetHeight * logoPosition.y) / 100;
        }

        logoX = Math.max(0, Math.min(targetWidth - logoWidth, logoX));
        logoY = Math.max(0, Math.min(targetHeight - logoHeight, logoY));
        ctx.drawImage(logoAsset, logoX, logoY, logoWidth, logoHeight);
      }

      // 4. Draw 'BREAKING NEWS' Banner (Using layout settings)
      // Scale banner based on canvas size
      const bannerScale = Math.min(targetWidth / 1080, 1);
      const bannerPadding = Math.round(20 * bannerScale);
      const bannerFontSize = Math.round(40 * bannerScale);
      const bannerHeight = Math.round(70 * bannerScale);

      let bannerX = 60;
      let bannerY = 60;

      if (layoutSettings) {
        bannerX = (targetWidth * layoutSettings.banner.x) / 100;
        bannerY = (targetHeight * layoutSettings.banner.y) / 100;
      }

      ctx.font = `bold ${bannerFontSize}px Oswald`;
      const bannerText = "BREAKING NEWS";
      const bannerMetrics = ctx.measureText(bannerText);
      const bannerWidth = bannerMetrics.width + (bannerPadding * 2);

      ctx.fillStyle = styles.bannerColor;
      ctx.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);

      ctx.fillStyle = "#FFFFFF";
      ctx.textBaseline = "middle";
      ctx.fillText(bannerText, bannerX + bannerPadding, bannerY + (bannerHeight / 2) + 2);

      // 5. Headline Setup (Using layout settings)
      let headlineX = 60;
      let headlineY = targetHeight * 0.70;

      if (layoutSettings) {
        headlineX = (targetWidth * layoutSettings.headline.x) / 100;
        headlineY = (targetHeight * layoutSettings.headline.y) / 100;
      }

      const maxHeadlineWidth = targetWidth - headlineX - 40; // 40px right margin

      // Draw Headline with dynamic styling
      ctx.fillStyle = styles.headlineColor;
      ctx.font = `bold ${styles.headlineFontSize}px ${styles.headlineFont}`;
      ctx.textBaseline = "top";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      const headlineLineHeight = styles.headlineFontSize + 10;
      const displayHeadline = applyTextCase(headline, styles.headlineCasing);
      wrapText(ctx, displayHeadline, headlineX, headlineY, maxHeadlineWidth, headlineLineHeight);

      // 6. Description (Using layout settings)
      let descX = 60;
      let descY = headlineY + (styles.headlineFontSize * 2) + 30;

      if (layoutSettings) {
        descX = (targetWidth * layoutSettings.description.x) / 100;
        descY = (targetHeight * layoutSettings.description.y) / 100;
      }

      const maxDescWidth = targetWidth - descX - 40; // 40px right margin

      ctx.fillStyle = styles.descriptionColor;
      ctx.font = `${styles.descriptionFontSize}px ${styles.descriptionFont}`;
      const bodyLineHeight = styles.descriptionFontSize + 15;

      const displayDescription = applyTextCase(description, styles.descriptionCasing);
      wrapText(ctx, displayDescription, descX, descY, maxDescWidth, bodyLineHeight);

      // Output
      resolve(canvas.toDataURL('image/png'));
    } catch (err) {
      reject(err);
    }
  });
};

export const generateNewsVideoCreative = async (
  headline: string,
  description: string,
  uploadedMedia: string | null,
  styleSettings?: StyleSettings,
  socialMediaSize?: SocialMediaSizePreset,
  layoutSettings?: LayoutSettings,
  logoImage?: string | null,
  logoSize: number = 90,
  logoPosition?: { x: number; y: number }
): Promise<{ url: string; extension: 'webm' | 'mp4' }> => {
  if (!uploadedMedia) {
    throw new Error("Background media is required");
  }

  const styles: StyleSettings = styleSettings || {
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

  await document.fonts.ready;

  let logoAsset: HTMLImageElement | null = null;
  if (logoImage) {
    logoAsset = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load logo image'));
      img.src = logoImage;
    });
  }

  const video = await new Promise<HTMLVideoElement>((resolve, reject) => {
    const v = document.createElement('video');
    v.crossOrigin = 'anonymous';
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.onloadedmetadata = () => resolve(v);
    v.onerror = () => reject(new Error('Failed to load video'));
    v.src = uploadedMedia;
  });

  const targetWidth = socialMediaSize?.width || 1080;
  const targetHeight = socialMediaSize?.height || 1350;
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  if (typeof MediaRecorder === 'undefined') {
    throw new Error('MediaRecorder is not supported in this browser');
  }

  const preferredTypes = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4'
  ];
  const mimeType = preferredTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
  const extension: 'webm' | 'mp4' = mimeType.includes('mp4') ? 'mp4' : 'webm';

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 8_000_000
  });

  const chunks: Blob[] = [];
  let animationFrameId: number | null = null;

  const drawOverlay = () => {
    const scale = Math.max(targetWidth / video.videoWidth, targetHeight / video.videoHeight);
    const x = (targetWidth / 2) - (video.videoWidth / 2) * scale;
    const y = (targetHeight / 2) - (video.videoHeight / 2) * scale;
    ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);

    const gradient = ctx.createLinearGradient(0, targetHeight * 0.4, 0, targetHeight);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.6, "rgba(0,0,0,0.8)");
    gradient.addColorStop(1, "rgba(0,0,0,0.95)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    if (logoAsset) {
      const logoPadding = Math.max(Math.round(targetWidth * 0.02), 16);
      const logoWidth = Math.max(Math.round((logoSize / 500) * targetWidth), 40);
      const logoHeight = (logoAsset.height / logoAsset.width) * logoWidth;
      let logoX = targetWidth - logoWidth - logoPadding;
      let logoY = logoPadding;

      if (logoPosition) {
        logoX = (targetWidth * logoPosition.x) / 100;
        logoY = (targetHeight * logoPosition.y) / 100;
      }

      logoX = Math.max(0, Math.min(targetWidth - logoWidth, logoX));
      logoY = Math.max(0, Math.min(targetHeight - logoHeight, logoY));
      ctx.drawImage(logoAsset, logoX, logoY, logoWidth, logoHeight);
    }

    const bannerScale = Math.min(targetWidth / 1080, 1);
    const bannerPadding = Math.round(20 * bannerScale);
    const bannerFontSize = Math.round(40 * bannerScale);
    const bannerHeight = Math.round(70 * bannerScale);

    let bannerX = 60;
    let bannerY = 60;
    if (layoutSettings) {
      bannerX = (targetWidth * layoutSettings.banner.x) / 100;
      bannerY = (targetHeight * layoutSettings.banner.y) / 100;
    }

    ctx.font = `bold ${bannerFontSize}px Oswald`;
    const bannerText = "BREAKING NEWS";
    const bannerMetrics = ctx.measureText(bannerText);
    const bannerWidth = bannerMetrics.width + (bannerPadding * 2);
    ctx.fillStyle = styles.bannerColor;
    ctx.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);
    ctx.fillStyle = "#FFFFFF";
    ctx.textBaseline = "middle";
    ctx.fillText(bannerText, bannerX + bannerPadding, bannerY + (bannerHeight / 2) + 2);

    let headlineX = 60;
    let headlineY = targetHeight * 0.70;
    if (layoutSettings) {
      headlineX = (targetWidth * layoutSettings.headline.x) / 100;
      headlineY = (targetHeight * layoutSettings.headline.y) / 100;
    }
    const maxHeadlineWidth = targetWidth - headlineX - 40;
    ctx.fillStyle = styles.headlineColor;
    ctx.font = `bold ${styles.headlineFontSize}px ${styles.headlineFont}`;
    ctx.textBaseline = "top";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    const headlineLineHeight = styles.headlineFontSize + 10;
    const displayHeadline = applyTextCase(headline, styles.headlineCasing);
    wrapText(ctx, displayHeadline, headlineX, headlineY, maxHeadlineWidth, headlineLineHeight);

    let descX = 60;
    let descY = headlineY + (styles.headlineFontSize * 2) + 30;
    if (layoutSettings) {
      descX = (targetWidth * layoutSettings.description.x) / 100;
      descY = (targetHeight * layoutSettings.description.y) / 100;
    }
    const maxDescWidth = targetWidth - descX - 40;
    ctx.fillStyle = styles.descriptionColor;
    ctx.font = `${styles.descriptionFontSize}px ${styles.descriptionFont}`;
    const bodyLineHeight = styles.descriptionFontSize + 15;
    const displayDescription = applyTextCase(description, styles.descriptionCasing);
    wrapText(ctx, displayDescription, descX, descY, maxDescWidth, bodyLineHeight);
  };

  return new Promise(async (resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onerror = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      stream.getTracks().forEach(track => track.stop());
      reject(new Error('Failed to record output video'));
    };

    recorder.onstop = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      stream.getTracks().forEach(track => track.stop());
      const blob = new Blob(chunks, { type: mimeType });
      resolve({ url: URL.createObjectURL(blob), extension });
    };

    const drawLoop = () => {
      if (video.paused || video.ended) return;
      drawOverlay();
      animationFrameId = requestAnimationFrame(drawLoop);
    };

    video.onended = () => {
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
    };

    try {
      video.currentTime = 0;
      recorder.start(100);
      await video.play();
      drawLoop();
    } catch (err) {
      if (recorder.state !== 'inactive') recorder.stop();
      reject(err instanceof Error ? err : new Error('Video rendering failed'));
    }
  });
};
