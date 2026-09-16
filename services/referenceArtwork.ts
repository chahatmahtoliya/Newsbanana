import type { Template, TemplateTheme } from './templateService';

// Artwork is drawn in a portrait coordinate system; all copy stays in editable fields.
export function drawReferenceArtwork(ctx: CanvasRenderingContext2D, template: Template, theme: TemplateTheme, width: number, height: number, hasMedia: boolean) {
  ctx.save();
  ctx.scale(width / 100, height / 150);
  const { backgroundColor: bg, accentColor: accent } = theme;
  const box = (x: number, y: number, w: number, h: number, color: string, radius = 0) => {
    ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fill();
  };
  const ellipse = (x: number, y: number, rx: number, ry: number, color: string, stroke = false) => {
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    if (stroke) { ctx.strokeStyle = color; ctx.stroke(); } else { ctx.fillStyle = color; ctx.fill(); }
  };
  const line = (points: number[][], color: string, weight = .4) => {
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = weight;
    points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
  };
  if (!hasMedia) box(0, 0, 100, 150, bg);
  if (hasMedia) {
    const side = ['studio-food', 'studio-story', 'studio-motivation'].includes(template.reference!);
    const wash = ctx.createLinearGradient(0, 0, side ? 110 : 0, side ? 0 : 150);
    const opacity = theme.overlayOpacity / 100;
    wash.addColorStop(0, `${bg}${Math.round((side ? Math.min(.98, opacity * 1.8) : opacity) * 255).toString(16).padStart(2, '0')}`);
    wash.addColorStop(side ? .5 : .45, `${bg}${Math.round(opacity * 180).toString(16).padStart(2, '0')}`);
    wash.addColorStop(1, side ? `${bg}00` : `${bg}${Math.round(Math.min(.96, opacity * 1.8) * 255).toString(16).padStart(2, '0')}`);
    ctx.fillStyle = wash; ctx.fillRect(0, 0, 100, 150);
  }
  switch (template.reference) {
    case 'studio-news':
      ctx.save(); ctx.shadowColor = accent; ctx.shadowBlur = 12; ctx.lineWidth = .35;
      ellipse(99, 72, 43, 62, accent, true);
      for (let i = 1; i < 5; i++) ellipse(99, 72, i * 8, 62, accent, true);
      for (let i = -3; i <= 3; i++) ellipse(99, 72 + i * 15, 43 * Math.sqrt(1 - (i / 4) ** 2), 5, accent, true);
      ctx.restore(); box(8, 48, 34, .8, accent); box(8, 110, 46, .8, accent); break;
    case 'studio-quote':
      ctx.font = '56px Georgia'; ctx.fillStyle = accent; ctx.fillText('“', 8, 56);
      ctx.save(); ctx.globalAlpha = .12;
      for (let i = 0; i < 8; i++) { ctx.save(); ctx.translate(96 - i * 3, 145 - i * 7); ctx.rotate(-.6); ellipse(0, 0, 5, 17, accent); ctx.restore(); }
      ctx.restore(); break;
    case 'studio-sport':
      box(8, 75, 27, 2, accent); break;
    case 'studio-story':
      box(8, 137, 20, 1.3, accent); break;
    case 'studio-travel':
      ellipse(85, 134, 6, 6, '#FFFFFFDB'); line([[82,134],[88,134],[86,132],[88,134],[86,136]], bg, .7); break;
    case 'studio-audio':
      if (!hasMedia) {
        ellipse(53, 119, 32, 4, '#36404B20');
        const shell = ctx.createLinearGradient(0, 85, 0, 120); shell.addColorStop(0, '#FFFFFF'); shell.addColorStop(1, '#B6BDC4');
        ctx.fillStyle = shell; ctx.beginPath(); ctx.roundRect(23, 89, 58, 30, 12); ctx.fill();
        ellipse(52, 90, 29, 7, '#FFFFFF'); ellipse(52, 90, 24, 4, '#BAC2CA');
        for (const [x, y, rot] of [[35, 75, -.25], [67, 69, .3]]) {
          ctx.save(); ctx.translate(x, y); ctx.rotate(rot); box(-3, 0, 7, 29, '#FAFCFF', 3); ellipse(0, 0, 10, 8, '#FFFFFF'); ellipse(-3, -1, 3, 4, '#323B45'); ctx.restore();
        }
      }
      break;
    case 'studio-food': box(8, 116, 22, .7, accent); break;
    case 'studio-sale':
      ctx.save(); ctx.globalAlpha = .18; ctx.translate(71, 47); ctx.rotate(.12);
      box(-18, 0, 40, 66, '#FFFFFF', 3); ctx.lineWidth = 4; ellipse(2, 0, 10, 16, '#FFFFFF', true); ctx.restore(); break;
    case 'studio-fitness': box(8, 121, 30, 1, accent); break;
    case 'studio-phone':
      if (!hasMedia) {
        ctx.save(); ctx.translate(64, 44); ctx.rotate(-.07);
        const metal = ctx.createLinearGradient(0, 0, 37, 0); metal.addColorStop(0, '#C2C5EB'); metal.addColorStop(.14, accent); metal.addColorStop(1, '#343452');
        ctx.fillStyle = metal; ctx.beginPath(); ctx.roundRect(0, 0, 38, 112, 7); ctx.fill();
        box(3, 5, 19, 36, '#26283F', 6);
        for (const y of [15, 31]) { ellipse(12, y, 6, 6, '#9399BC'); ellipse(12, y, 4.5, 4.5, '#080D19'); ellipse(10.5, y - 1, 1.4, 1.4, '#4C6580'); }
        ctx.restore();
      } break;
    case 'studio-weather':
      ctx.save(); ctx.shadowColor = '#FFF2A9'; ctx.shadowBlur = 20; ellipse(77, 38, 14, 14, accent); ctx.restore();
      for (const [x,y,r] of [[68,49,12],[81,47,15],[95,54,13]]) ellipse(x,y,r,r*.7,'#FFFFFFE8');
      for (let i = 0; i < 4; i++) { box(7 + i * 22, 118, 19, 25, '#FFFFFF45', 3); ellipse(16 + i * 22, 123, 2, 2, accent); }
      break;
    case 'studio-market':
      ctx.save(); ctx.globalAlpha = .13;
      for (let i=0;i<6;i++) line([[8,76+i*8],[94,76+i*8]],accent);
      for (let i=0;i<9;i++) box(10+i*10,115-i*4,5,5+i*4,accent);
      ctx.restore(); line([[8,113],[18,105],[26,108],[38,91],[48,98],[58,78],[68,83],[78,69],[88,75],[94,58]],accent,1.2); break;
    case 'studio-health':
      if (!hasMedia) {
        ctx.save(); ctx.translate(77, 113); ctx.rotate(-.07);
        box(-18, -16, 35, 54, '#88AA48', 5); ellipse(0, -16, 17, 5, '#D6E7A4'); ellipse(0, -16, 13, 3, accent); box(5, -42, 2, 32, '#E4B980'); ctx.restore();
        for (const [x,y,r] of [[85,15,.5],[95,40,-.5],[72,83,.8]]) { ctx.save(); ctx.translate(x,y); ctx.rotate(r); ellipse(0,0,5,16,accent); line([[0,-13],[0,13]],'#C4DC95'); ctx.restore(); }
      } break;
    case 'studio-cinema':
      box(7, 14, .7, 61, accent); box(93, 0, 1, 150, accent); break;
    case 'studio-motivation': box(8, 91, 18, .6, accent); break;
    case 'studio-music':
      ctx.save(); ctx.globalAlpha = .12; ctx.fillStyle = accent;
      for (const x of [20,60,95]) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x-35,115); ctx.lineTo(x+22,115); ctx.fill(); } ctx.restore(); break;
  }
  ctx.fillStyle = theme.surfaceColor;
  for (const detail of template.details || []) {
    ctx.font = `500 ${detail.size / 10}px Manrope, sans-serif`; ctx.textBaseline = 'top';
    detail.text.split('\n').forEach((text, i) => ctx.fillText(text, detail.x, detail.y * 1.5 + i * detail.size / 8));
  }
  ctx.restore();
}
