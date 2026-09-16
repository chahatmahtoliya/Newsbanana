module.exports = {
        content: ['./index.html', './App.tsx', './components/**/*.{ts,tsx}'],
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['"Albert Sans"', 'Manrope', 'sans-serif'],
              albert: ['"Albert Sans"', 'sans-serif'],
              display: ['Oswald', 'sans-serif'],
              mono: ['"Roboto Mono"', 'monospace'],
            },
            colors: {
              paper: 'var(--paper)',
              'paper-deep': 'var(--paper-deep)',
              surface: 'var(--surface)',
              'surface-soft': 'var(--surface-soft)',
              fill: 'var(--fill)',
              line: 'var(--line)',
              'line-soft': 'var(--line-soft)',
              ink: 'var(--ink)',
              'ink-soft': 'var(--ink-soft)',
              'ink-muted': 'var(--ink-muted)',
              'ink-faint': 'var(--ink-faint)',
              accent: 'var(--accent)',
              'accent-bright': 'var(--accent-bright)',
              news: {
                red: '#D90000',
                dark: '#111111',
                gray: '#2A2A2A',
              },
            },
            boxShadow: {
              bedo: 'var(--shadow-bedo)',
            }
          },
        },
      };
