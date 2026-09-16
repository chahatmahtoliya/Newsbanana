import React, { memo, useEffect, useRef, useState } from 'react';
import { Template } from '../services/templateService';
import { defaultStyleSettings, TextCase } from '../types';
import TemplateArtwork from './TemplateArtwork';

function textCase(text: string, casing: TextCase) {
  if (casing === 'uppercase') return text.toUpperCase();
  if (casing === 'lowercase') return text.toLowerCase();
  if (casing === 'sentence') return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  return text;
}

// Picker previews use DOM text and small artwork canvases, never the PNG exporter.
const TemplateThumbnail = memo(function TemplateThumbnail({ template }: { template: Template }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const resize = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    resize.observe(element);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '150px' });
    observer.observe(element);
    return () => { resize.disconnect(); observer.disconnect(); };
  }, []);
  const styles = { ...defaultStyleSettings, ...template.styles };
  const position = (key: 'headline' | 'description'): React.CSSProperties => ({
    position: 'absolute', left: `${template.layout[key].x}%`, top: `${template.layout[key].y}%`,
    width: `${Math.min((key === 'headline' ? template.headlineWidth : template.descriptionWidth) || 88, 96 - template.layout[key].x)}%`,
    whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', textAlign: 'left', margin: 0,
  });
  return <div ref={container} className="relative w-full h-full overflow-hidden" style={{ backgroundColor: template.theme.backgroundColor }} role="img" aria-label={template.name}>
    {visible && width > 0 ? <div aria-hidden="true" style={{ position: 'absolute', width: 1000, height: 1500, transform: `scale(${width / 1000})`, transformOrigin: 'top left' }}>
      {template.defaultMedia && <img src={template.defaultMedia} alt="" decoding="async" className="absolute inset-0 w-full h-full object-cover" />}
      <TemplateArtwork template={template} hasMedia={!!template.defaultMedia} resolution={240} />
      {template.defaultBanner && <span style={{ position: 'absolute', left: `${template.layout.banner.x}%`, top: `${template.layout.banner.y}%`, background: styles.bannerColor, color: '#fff', font: '700 28px Oswald, sans-serif', padding: '8px 14px' }}>{template.defaultBanner}</span>}
      <span style={{ ...position('headline'), color: styles.headlineColor, fontFamily: styles.headlineFont, fontSize: styles.headlineFontSize, fontWeight: 700, lineHeight: 1.1 }}>{textCase(template.defaultHeadline, styles.headlineCasing)}</span>
      <span style={{ ...position('description'), color: styles.descriptionColor, fontFamily: styles.descriptionFont, fontSize: styles.descriptionFontSize, lineHeight: 1.45 }}>{textCase(template.defaultDescription, styles.descriptionCasing)}</span>
    </div> : <span className="absolute inset-3 text-xs text-left" style={{ color: styles.headlineColor }}>{template.name}</span>}
  </div>;
});

export default TemplateThumbnail;
