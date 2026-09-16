import React, { useEffect, useRef, useState } from 'react';
import { Check, Loader2, Search, X } from 'lucide-react';
import { Template, TEMPLATES } from '../services/templateService';
import TemplateThumbnail from './TemplateThumbnail';

interface TemplatePickerProps {
  darkMode: boolean;
  selectedId?: string;
  onSelect: (template: Template) => Promise<void>;
  onClose: () => void;
}

export default function TemplatePicker({ darkMode, selectedId, onSelect, onClose }: TemplatePickerProps) {
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    return () => previousFocus?.focus();
  }, []);
  const templates = TEMPLATES.filter(template => `${template.name} ${template.category}`.toLowerCase().includes(search.toLowerCase().trim()));
  const selectTemplate = async (template: Template) => {
    setLoadingId(template.id);
    setError('');
    try {
      await onSelect(template);
    } catch {
      setError('Could not load this template. Please try again.');
    } finally {
      setLoadingId(null);
    }
  };
  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close templates" onClick={onClose} />
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="template-picker-title"
        className={`template-picker relative w-full sm:max-w-lg h-[100dvh] flex flex-col shadow-2xl ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
        onKeyDown={event => {
          if (event.key !== 'Tab') return;
          const controls: HTMLElement[] = dialog.current ? Array.from(dialog.current.querySelectorAll<HTMLElement>('button:not(:disabled), input')) : [];
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }}>
        <div className={`shrink-0 p-4 pt-[max(1rem,env(safe-area-inset-top))] border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div><h2 id="template-picker-title" className="text-lg font-bold">Templates</h2><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Choose a layout for your next creative.</p></div>
            <button ref={closeButton} type="button" aria-label="Close templates" onClick={onClose} className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center hover:bg-gray-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"><X className="w-5 h-5" /></button>
          </div>
          <label className={`flex items-center gap-2 rounded-lg border px-3 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
            <Search className="w-4 h-4 shrink-0" /><input type="search" aria-label="Search templates" placeholder="Search templates or categories" value={search} onChange={event => setSearch(event.target.value)} className="w-full min-w-0 min-h-11 bg-transparent text-base outline-none" />
          </label>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {error && <p role="alert" className="mb-3 text-sm text-red-500">{error}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {templates.map(template => <button key={template.id} type="button" aria-label={template.name} aria-pressed={template.id === selectedId} disabled={loadingId !== null} onClick={() => selectTemplate(template)}
              className={`relative min-w-0 rounded-xl overflow-hidden border-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${template.id === selectedId ? 'border-red-500' : darkMode ? 'border-gray-700 hover:border-gray-500' : 'border-gray-200 hover:border-gray-400'}`}>
              <div className="relative aspect-[2/3]"><TemplateThumbnail template={template} /></div>
              <div className={`min-h-11 p-2 text-xs font-medium ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>{template.name}</div>
              {template.id === selectedId && <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"><Check className="w-3 h-3" /></span>}
              {template.id === loadingId && <span role="status" aria-label="Loading template" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white"><Loader2 className="w-6 h-6 animate-spin" /></span>}
            </button>)}
          </div>
          {templates.length === 0 && <p className="py-10 text-sm text-center">No templates found. Try another search.</p>}
        </div>
      </div>
    </div>
  );
}
