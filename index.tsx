import React, { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LandingPage from './components/LandingPage';

const getPageFromUrl = () => ({
  studio: new URLSearchParams(window.location.search).get('view') === 'studio',
  templateId: new URLSearchParams(window.location.search).get('template') || undefined,
});

const Site: React.FC = () => {
  const [page, setPage] = useState(getPageFromUrl);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const syncPage = () => setPage(getPageFromUrl());
    window.addEventListener('popstate', syncPage);
    return () => window.removeEventListener('popstate', syncPage);
  }, []);

  const navigate = (studio: boolean, templateId?: string) => {
    const url = new URL(window.location.href);
    if (studio) {
      url.searchParams.set('view', 'studio');
      if (templateId) url.searchParams.set('template', templateId);
      else url.searchParams.delete('template');
    } else {
      url.searchParams.delete('view');
      url.searchParams.delete('template');
    }
    url.hash = '';
    window.history.pushState(null, '', url);
    setPage({ studio, templateId });
    window.scrollTo(0, 0);
  };

  return (
    <>
      {page.studio ? (
        <App
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(value => !value)}
          onBack={() => navigate(false)}
          initialTemplateId={page.templateId}
        />
      ) : (
        <LandingPage
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(value => !value)}
          onOpenStudio={templateId => navigate(true, templateId)}
        />
      )}
      <Analytics />
    </>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Site />
  </React.StrictMode>
);
