import React, { useState } from 'react';
import {
    Image,
    Video,
    Smile,
    Film,
    Layout,
    Type,
    Palette,
    Shapes,
    Upload,
    ChevronLeft,
    ChevronRight,
    Home,
    FolderOpen,
    Sparkles
} from 'lucide-react';
import TemplateThumbnail from './TemplateThumbnail';
import { Template, TEMPLATES } from '../services/templateService';
import ElementsPanel from './ElementsPanel';
import { CanvasOverlay } from '../types';


interface SidebarCategory {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}

interface CreatorSidebarProps {
    darkMode: boolean;
    onCategorySelect: (categoryId: string) => void;
    selectedCategory: string | null;
    onTemplateSelect?: (template: Template) => void;
    onAddOverlay?: (overlay: Omit<CanvasOverlay, 'id' | 'x' | 'y'>) => void;
}


interface SidebarItem {
    id: string;
    name: string;
    template?: Template;
}

const SIDEBAR_CATEGORIES: SidebarCategory[] = [
    {
        id: 'home',
        label: 'Home',
        icon: <Home className="w-5 h-5" />,
        color: 'bg-stone-800'
    },
    {
        id: 'templates',
        label: 'Templates',
        icon: <Layout className="w-5 h-5" />,
        color: 'bg-red-500'
    },
    {
        id: 'images',
        label: 'Images',
        icon: <Image className="w-5 h-5" />,
        color: 'bg-amber-600'
    },
    {
        id: 'videos',
        label: 'Videos',
        icon: <Video className="w-5 h-5" />,
        color: 'bg-red-700'
    },
    {
        id: 'meme-templates',
        label: 'Meme Templates',
        icon: <Smile className="w-5 h-5" />,
        color: 'bg-orange-600'
    },
    {
        id: 'video-templates',
        label: 'Video Templates',
        icon: <Film className="w-5 h-5" />,
        color: 'bg-stone-700'
    },
    {
        id: 'text',
        label: 'Text',
        icon: <Type className="w-5 h-5" />,
        color: 'bg-zinc-700'
    },
    {
        id: 'elements',
        label: 'Elements',
        icon: <Shapes className="w-5 h-5" />,
        color: 'bg-orange-700'
    },
    {
        id: 'uploads',
        label: 'Uploads',
        icon: <Upload className="w-5 h-5" />,
        color: 'bg-stone-600'
    },
    {
        id: 'ai',
        label: 'AI Magic',
        icon: <Sparkles className="w-5 h-5" />,
        color: 'bg-rose-700'
    },
];

// Sample template data for each category
const TEMPLATE_DATA: Record<string, SidebarItem[]> = {
    'templates': TEMPLATES.map(template => ({ id: template.id, name: template.name, template })),
    'meme-templates': [
        { id: 'm1', name: 'Viral Meme' },
        { id: 'm2', name: 'Reaction Meme' },
        { id: 'm3', name: 'Quote Meme' },
        { id: 'm4', name: 'Comparison' },
    ],
    'video-templates': [
        { id: 'v1', name: 'News Intro' },
        { id: 'v2', name: 'Story Reel' },
        { id: 'v3', name: 'Slideshow' },
        { id: 'v4', name: 'Ken Burns' },
    ],
};

const CreatorSidebar: React.FC<CreatorSidebarProps> = ({ darkMode, onCategorySelect, selectedCategory, onTemplateSelect, onAddOverlay }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [activePanel, setActivePanel] = useState<string | null>(null);

    const handleCategoryClick = (categoryId: string) => {
        if (activePanel === categoryId) {
            setActivePanel(null);
        } else {
            setActivePanel(categoryId);
            onCategorySelect(categoryId);
        }
    };


    return (
        <div className="flex h-full">
            {/* Icon Bar - Always visible */}
            <div className={`
        flex flex-col items-center py-4 px-2 
        ${darkMode ? 'bg-[#0b0d14] border-[#1e2235]' : 'bg-white border-slate-200'}
        border-r transition-all duration-300
        ${isExpanded ? 'w-16' : 'w-16'}
      `}>
                {/* Logo/Collapse Toggle */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`
            p-2 rounded-lg mb-4 transition-all
            ${darkMode ? 'hover:bg-[#161a28] text-slate-400' : 'hover:bg-slate-100 text-slate-600'}
          `}
                    title={isExpanded ? 'Collapse' : 'Expand'}
                >
                    {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>

                {/* Category Icons */}
                <div className="flex-1 flex flex-col items-center space-y-1 overflow-y-auto">
                    {SIDEBAR_CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`
                w-12 h-12 rounded-xl flex flex-col items-center justify-center
                transition-all duration-200 group relative
                ${activePanel === category.id
                                    ? `${category.color} text-white shadow-lg scale-105`
                                    : darkMode
                                        ? 'hover:bg-[#161a28] text-slate-400 hover:text-white'
                                        : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                                }
              `}
                            title={category.label}
                        >
                            {category.icon}
                            <span className={`
                text-[9px] mt-0.5 font-medium truncate w-full text-center
                ${activePanel === category.id ? 'text-white' : ''}
              `}>
                                {category.label.split(' ')[0]}
                            </span>

                            {/* Tooltip on hover when collapsed */}
                            {!isExpanded && (
                                <div className={`
                  absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium
                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                  whitespace-nowrap z-50 shadow-lg
                  ${darkMode ? 'bg-[#181c2b] text-white border border-[#2a304a]' : 'bg-slate-900 text-white'}
                `}>
                                    {category.label}
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Projects at bottom */}
                <button
                    className={`
            w-12 h-12 rounded-xl flex flex-col items-center justify-center mt-4
            transition-all duration-200
            ${darkMode ? 'hover:bg-[#161a28] text-slate-400' : 'hover:bg-slate-100 text-slate-600'}
          `}
                    title="Projects"
                >
                    <FolderOpen className="w-5 h-5" />
                    <span className="text-[9px] mt-0.5 font-medium">Projects</span>
                </button>
            </div>

            {/* Expandable Panel */}
            <div className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${darkMode ? 'bg-[#0f111a] border-[#1e2235]' : 'bg-slate-50 border-slate-200'}
        ${isExpanded && activePanel ? 'w-64 border-r' : 'w-0'}
      `}>
                {activePanel && (
                    <div className="w-64 h-full flex flex-col">
                        {/* Panel Header */}
                        <div className={`
              px-4 py-3 border-b flex items-center justify-between
              ${darkMode ? 'border-[#1e2235]' : 'border-slate-200'}
            `}>
                            <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {SIDEBAR_CATEGORIES.find(c => c.id === activePanel)?.label}
                            </h3>
                            <button
                                onClick={() => setActivePanel(null)}
                                className={`p-1 rounded ${darkMode ? 'hover:bg-[#1e2235] text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Panel Content */}
                        <div className={`flex-1 overflow-y-auto ${activePanel === 'elements' ? 'p-0' : 'p-3'}`}>
                            {activePanel === 'elements' ? (
                                <ElementsPanel
                                    darkMode={darkMode}
                                    onAddOverlay={overlay => onAddOverlay?.(overlay)}
                                />
                            ) : (
                                <>
                                    {/* Search Bar */}
                                    <div className="mb-3 relative">
                                        <input
                                            type="text"
                                            placeholder={`Search ${SIDEBAR_CATEGORIES.find(c => c.id === activePanel)?.label.toLowerCase()}...`}
                                            className={`
                    w-full px-3 py-2 rounded-lg text-sm
                    ${darkMode
                                                    ? 'bg-[#0b0e18] border-[#22273c] text-white placeholder-slate-500'
                                                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                                                }
                    border focus:outline-none focus:border-red-500
                  `}
                                        />
                                    </div>

                                    {/* Template Grid */}
                                    {TEMPLATE_DATA[activePanel] ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {TEMPLATE_DATA[activePanel].map((item) => (
                                                <button
                                                    key={item.id}
                                                    title={item.name}
                                                    aria-label={item.name}
                                                    onClick={() => item.template && onTemplateSelect?.(item.template)}
                                                    className={`
                        aspect-[2/3] rounded-lg overflow-hidden border transition-all
                        hover:border-red-500 hover:scale-105
                        ${darkMode ? 'border-[#22273c] bg-[#141724]' : 'border-slate-200 bg-white'}
                      `}
                                                >
                                                    {item.template ? (
                                                        <div className="relative w-full h-full">
                                                            <TemplateThumbnail template={item.template} />

                                                        </div>
                                                    ) : (
                                                        <div className={`
                          w-full h-full flex items-center justify-center
                          ${darkMode ? 'bg-[#141724]' : 'bg-slate-100'}
                        `}>
                                                            <span className={`text-xs text-center px-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={`
                  text-center py-8
                  ${darkMode ? 'text-slate-400' : 'text-slate-500'}
                `}>
                                            <div className={`
                    w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center
                    ${darkMode ? 'bg-[#141724]' : 'bg-slate-200'}
                  `}>
                                                {SIDEBAR_CATEGORIES.find(c => c.id === activePanel)?.icon}
                                            </div>
                                            <p className="text-sm font-medium mb-1">
                                                {SIDEBAR_CATEGORIES.find(c => c.id === activePanel)?.label}
                                            </p>
                                            <p className="text-xs opacity-70">
                                                Coming soon...
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default CreatorSidebar;
