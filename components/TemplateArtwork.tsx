import React, { useEffect, useRef } from 'react';
import { Template, TemplateTheme } from '../services/templateService';
import { drawCodeTemplate } from '../services/templateRenderer';

export default function TemplateArtwork({ template, theme = template.theme, hasMedia = false, resolution = 1000 }: { template: Template; theme?: TemplateTheme; hasMedia?: boolean; resolution?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    const draw = () => { ctx.clearRect(0, 0, resolution, resolution * 1.5); drawCodeTemplate(ctx, template, theme, resolution, resolution * 1.5, hasMedia); };
    draw();
    let alive = true;
    document.fonts.ready.then(() => { if (alive) draw(); });
    return () => { alive = false; };
  }, [template, theme, hasMedia, resolution]);
  return <canvas ref={canvas} width={resolution} height={resolution * 1.5} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}
