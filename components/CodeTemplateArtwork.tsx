import React from 'react';
import { TemplateTheme, TemplateVariant } from '../services/templateService';

interface CodeTemplateArtworkProps {
  variant: TemplateVariant;
  theme: TemplateTheme;
  hasMedia?: boolean;
}

export const CodeTemplateArtwork: React.FC<CodeTemplateArtworkProps> = ({ variant, theme, hasMedia = false }) => {
  const bg = hasMedia ? 'transparent' : theme.backgroundColor;
  const surface = theme.surfaceColor;
  const accent = theme.accentColor;

  const artwork = (() => {
    switch (variant) {
      case 'broadcast':
        return <>
          <path d="M0 0h100v7H0zM0 93h100v7H0z" fill={accent} />
          <path d="M0 10h58v1H0zM67 10h33v1H67zM0 89h28v1H0zM35 89h65v1H35z" fill={surface} />
          <path d="M76 0h24v31L89 21 76 31z" fill={surface} opacity=".9" />
          <circle cx="88" cy="11" r="3" fill={accent} />
        </>;
      case 'quote':
        return <>
          <circle cx="84" cy="19" r="25" fill={surface} opacity=".12" />
          <text x="6" y="42" fontFamily="Georgia, serif" fontSize="51" fill={accent} opacity=".95">“</text>
          <path d="M8 84h50v1.5H8zM64 84h28v1.5H64z" fill={accent} />
        </>;
      case 'score':
        return <>
          <path d="M50 0v100M0 50h100" stroke={surface} strokeWidth=".7" opacity=".55" />
          <circle cx="50" cy="50" r="18" fill="none" stroke={surface} strokeWidth=".7" opacity=".55" />
          <path d="M0 7h33l10 7H0zM100 93H67l-10-7h43z" fill={accent} />
          <path d="M5 18h2v28H5zM93 54h2v28h-2z" fill={accent} opacity=".75" />
        </>;
      case 'announcement':
        return <>
          <path d="M65 0h35v47L81 31 65 47z" fill={surface} />
          <circle cx="13" cy="86" r="25" fill={accent} opacity=".22" />
          <path d="M7 88h86v1H7zM7 92h62v1H7z" fill={accent} />
        </>;
      case 'fact':
        return <>
          <circle cx="78" cy="22" r="30" fill={surface} opacity=".7" />
          <circle cx="78" cy="22" r="20" fill="none" stroke={accent} strokeWidth="1.2" />
          <path d="M0 75h100v25H0z" fill={surface} opacity=".55" />
          <path d="M8 9h16v2H8zM8 14h9v2H8z" fill={accent} />
        </>;
      case 'countdown':
        return <>
          <circle cx="80" cy="20" r="30" fill="none" stroke={accent} strokeWidth=".7" opacity=".7" />
          <circle cx="80" cy="20" r="21" fill="none" stroke={surface} strokeWidth="5" opacity=".8" />
          <path d="M0 78L100 43v57H0z" fill={surface} opacity=".62" />
          <path d="M8 12h25v1H8z" fill={accent} />
        </>;
      case 'viral':
        return <>
          <circle cx="82" cy="17" r="25" fill="none" stroke={accent} strokeWidth="7" opacity=".8" />
          <circle cx="82" cy="17" r="13" fill={surface} opacity=".85" />
          <path d="M-8 76L108 41v12L-8 88z" fill={accent} opacity=".82" />
          <path d="M0 90h100v10H0z" fill={surface} />
        </>;
      case 'tech':
        return <>
          <defs><pattern id="tech-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0v10" fill="none" stroke={surface} strokeWidth=".35" /></pattern></defs>
          <path d="M0 0h100v100H0z" fill="url(#tech-grid)" opacity=".7" />
          <path d="M68 0h32v32H86V18H68zM0 73h18v9h9v18H0z" fill={surface} opacity=".85" />
          <path d="M72 8h20v2H72zM8 89h11v2H8z" fill={accent} />
        </>;
      case 'weather':
        return <>
          <path d="M54 8c21-12 43 1 45 20S88 58 68 54 42 28 54 8zm-8 48c20-9 40 4 39 20S70 99 51 93 27 65 46 56z" fill="none" stroke={surface} strokeWidth="1.2" opacity=".8" />
          <circle cx="83" cy="19" r="9" fill={accent} opacity=".85" />
          <path d="M0 82h100v18H0z" fill={surface} opacity=".6" />
        </>;
      case 'event':
        return <>
          <path d="M0 0h38v100H0z" fill={surface} opacity=".65" />
          <path d="M32 0h6v100h-6zM89 0h11v100H89z" fill={accent} />
          <circle cx="72" cy="23" r="18" fill="none" stroke={accent} strokeWidth="1" />
          <path d="M48 84h31v2H48zM48 90h21v2H48z" fill={surface} />
        </>;
      case 'sale':
        return <>
          <path d="M58-10L110 42 66 86 14 34z" fill={surface} />
          <path d="M0 71L71 0h15L0 86zM24 100l76-76v17l-59 59z" fill={accent} opacity=".88" />
          <circle cx="84" cy="83" r="10" fill={surface} />
        </>;
      case 'editorial':
        return <>
          <path d="M0 0h5v100H0z" fill={accent} />
          <path d="M76 0h24v100H76z" fill={surface} opacity=".55" />
          <text x="79" y="84" transform="rotate(-90 79 84)" fontFamily="Georgia, serif" fontSize="7" letterSpacing="2" fill={accent}>ORIGINAL STORY</text>
          <path d="M9 89h57v1H9z" fill={accent} />
        </>;
    }
  })();

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        backgroundColor: bg,
        backgroundImage: hasMedia
          ? undefined
          : `radial-gradient(circle at 78% 18%, ${surface}CC 0%, ${surface}33 26%, ${theme.backgroundColor}00 58%)`
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-sm">{artwork}</svg>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-black/10" />
    </div>
  );
};

export default CodeTemplateArtwork;
