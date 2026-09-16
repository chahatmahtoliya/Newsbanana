import { Template, TemplateTheme } from './templateService';
import { drawReferenceArtwork } from './referenceArtwork';

const rect = (ctx: CanvasRenderingContext2D, color: string, x: number, y: number, width: number, height: number, alpha = 1) => {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
};

const circle = (ctx: CanvasRenderingContext2D, color: string, x: number, y: number, radius: number, alpha = 1, stroke = false, lineWidth = 1) => {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  if (stroke) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  } else {
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.restore();
};

export function drawCodeTemplate(
  ctx: CanvasRenderingContext2D,
  template: Template,
  theme: TemplateTheme,
  width: number,
  height: number,
  hasMedia: boolean
) {
  if (template.reference) {
    drawReferenceArtwork(ctx, template, theme, width, height, hasMedia);
    return;
  }
  if (!hasMedia) rect(ctx, theme.backgroundColor, 0, 0, width, height);

  if (hasMedia) {
    const overlay = ctx.createLinearGradient(0, 0, 0, height);
    const opacity = theme.overlayOpacity / 100;
    overlay.addColorStop(0, `rgba(0,0,0,${opacity * 0.18})`);
    overlay.addColorStop(0.55, `rgba(0,0,0,${opacity * 0.45})`);
    overlay.addColorStop(1, `rgba(0,0,0,${Math.min(.94, opacity + .2)})`);
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);
  } else {
    const glow = ctx.createRadialGradient(width * .78, height * .2, 0, width * .78, height * .2, width * .7);
    glow.addColorStop(0, `${theme.surfaceColor}CC`);
    glow.addColorStop(1, `${theme.backgroundColor}00`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  const a = theme.accentColor;
  const s = theme.surfaceColor;
  const u = width / 100;
  const v = height / 100;

  switch (template.variant) {
    case 'classic':
      // Clean classic template: clean bottom gradient only
      break;
    case 'breaking':
      // Clean subtle broadcast accent line at bottom
      rect(ctx, a, 0, height - Math.max(4, 0.5 * v), width, Math.max(4, 0.5 * v));
      break;
    case 'broadcast':
      rect(ctx, a, 0, 0, width, 7 * v);
      rect(ctx, a, 0, 93 * v, width, 7 * v);
      rect(ctx, s, 0, 10 * v, 58 * u, Math.max(2, .7 * v), .8);
      rect(ctx, s, 67 * u, 10 * v, 33 * u, Math.max(2, .7 * v), .8);
      rect(ctx, s, 76 * u, 0, 24 * u, 31 * v, .75);
      circle(ctx, a, 88 * u, 11 * v, 3 * u);
      break;
    case 'quote':
      circle(ctx, s, 84 * u, 19 * v, 25 * u, .12);
      ctx.save();
      ctx.fillStyle = a;
      ctx.font = `${Math.round(52 * u)}px Georgia`;
      ctx.fillText('“', 6 * u, 42 * v);
      ctx.restore();
      rect(ctx, a, 8 * u, 84 * v, 50 * u, Math.max(3, 1.4 * v));
      break;
    case 'score':
      ctx.save();
      ctx.globalAlpha = .45;
      ctx.strokeStyle = s;
      ctx.lineWidth = Math.max(2, .6 * u);
      ctx.beginPath();
      ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.restore();
      circle(ctx, s, width / 2, height / 2, 18 * u, .45, true, Math.max(2, .7 * u));
      rect(ctx, a, 0, 7 * v, 40 * u, 7 * v);
      rect(ctx, a, 60 * u, 86 * v, 40 * u, 7 * v);
      break;
    case 'announcement':
      rect(ctx, s, 65 * u, 0, 35 * u, 46 * v, .9);
      circle(ctx, a, 13 * u, 86 * v, 25 * u, .22);
      rect(ctx, a, 7 * u, 88 * v, 86 * u, Math.max(2, v));
      break;
    case 'fact':
      circle(ctx, s, 78 * u, 22 * v, 30 * u, .62);
      circle(ctx, a, 78 * u, 22 * v, 20 * u, .9, true, Math.max(3, 1.2 * u));
      rect(ctx, s, 0, 75 * v, width, 25 * v, .45);
      break;
    case 'countdown':
      circle(ctx, a, 80 * u, 20 * v, 30 * u, .65, true, Math.max(2, .8 * u));
      circle(ctx, s, 80 * u, 20 * v, 21 * u, .55, true, Math.max(8, 4 * u));
      ctx.save();
      ctx.fillStyle = s; ctx.globalAlpha = .55;
      ctx.beginPath(); ctx.moveTo(0, 78 * v); ctx.lineTo(width, 43 * v); ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();
      ctx.restore();
      break;
    case 'viral':
      circle(ctx, a, 82 * u, 17 * v, 25 * u, .75, true, Math.max(8, 7 * u));
      circle(ctx, s, 82 * u, 17 * v, 13 * u, .75);
      ctx.save(); ctx.fillStyle = a; ctx.globalAlpha = .78;
      ctx.beginPath(); ctx.moveTo(-8 * u, 76 * v); ctx.lineTo(108 * u, 41 * v); ctx.lineTo(108 * u, 53 * v); ctx.lineTo(-8 * u, 88 * v); ctx.fill(); ctx.restore();
      break;
    case 'tech':
      ctx.save(); ctx.strokeStyle = s; ctx.globalAlpha = .42; ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 10 * u) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y < height; y += 10 * v) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
      ctx.restore();
      rect(ctx, s, 68 * u, 0, 32 * u, 18 * v, .7);
      rect(ctx, a, 72 * u, 8 * v, 20 * u, Math.max(3, 2 * v));
      break;
    case 'weather':
      circle(ctx, a, 83 * u, 19 * v, 9 * u, .82);
      circle(ctx, s, 72 * u, 30 * v, 27 * u, .5, true, Math.max(3, u));
      circle(ctx, s, 62 * u, 72 * v, 23 * u, .45, true, Math.max(3, u));
      rect(ctx, s, 0, 82 * v, width, 18 * v, .5);
      break;
    case 'event':
      rect(ctx, s, 0, 0, 38 * u, height, .58);
      rect(ctx, a, 32 * u, 0, 6 * u, height);
      rect(ctx, a, 89 * u, 0, 11 * u, height);
      circle(ctx, a, 72 * u, 23 * v, 18 * u, .8, true, Math.max(3, u));
      break;
    case 'sale':
      ctx.save(); ctx.translate(58 * u, -10 * v); ctx.rotate(Math.PI / 4); rect(ctx, s, 0, 0, 68 * u, 68 * u); ctx.restore();
      ctx.save(); ctx.strokeStyle = a; ctx.globalAlpha = .88; ctx.lineWidth = 15 * u;
      ctx.beginPath(); ctx.moveTo(-5 * u, 80 * v); ctx.lineTo(80 * u, -5 * v); ctx.moveTo(25 * u, 105 * v); ctx.lineTo(105 * u, 25 * v); ctx.stroke(); ctx.restore();
      break;
    case 'editorial':
      rect(ctx, a, 0, 0, 5 * u, height);
      rect(ctx, s, 76 * u, 0, 24 * u, height, .5);
      rect(ctx, a, 9 * u, 89 * v, 57 * u, Math.max(2, v));
      break;
  }
}
