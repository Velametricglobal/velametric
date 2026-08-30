import React, { useEffect, useState } from 'react';
import { Page, PageSection, PageVersion, SectionType, ThemeSettings } from '../../types/database.types';
import { pageService } from '../../services/pageService';
import { settingsService } from '../../services/settingsService';
import { SectionRenderer } from '../../components/public/SectionRenderer';
import {
  Save, Eye, Globe, RotateCcw, Plus, Trash2, EyeOff, ArrowUp, ArrowDown,
  Copy, Monitor, Laptop, Tablet, Smartphone, Palette, Settings, Sparkles, Layers, Check, Layout, Video, Film, Play
} from 'lucide-react';

export const HomepageBuilder: React.FC = () => {
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [selectedSecId, setSelectedSecId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('mobile'); // Default to mobile preview for convenience
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [isVersionsDrawerOpen, setIsVersionsDrawerOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [inspectorTab, setInspectorTab] = useState<'content' | 'video' | 'style'>('content');

  useEffect(() => {
    pageService.getPageBySlug('home').then(p => {
      if (p) {
        setPage(p);
        setSections(p.sections || []);
        if (p.sections && p.sections.length > 0) {
          setSelectedSecId(p.sections[0].id);
        }
      }
    });

    settingsService.getThemeSettings().then(setTheme);
  }, []);

  const selectedSection = sections.find(s => s.id === selectedSecId);

  // Actions
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newSecs = [...sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSecs.length) return;

    const temp = newSecs[index];
    newSecs[index] = newSecs[targetIdx];
    newSecs[targetIdx] = temp;

    newSecs.forEach((sec, idx) => (sec.position = idx + 1));
    setSections(newSecs);
  };

  const handleToggleVisibility = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, is_enabled: !s.is_enabled } : s));
  };

  const handleDeleteSection = (id: string) => {
    const newSecs = sections.filter(s => s.id !== id);
    setSections(newSecs);
    if (selectedSecId === id) {
      setSelectedSecId(newSecs.length > 0 ? newSecs[0].id : null);
    }
  };

  const handleDuplicateSection = (sec: PageSection) => {
    const duplicated: PageSection = {
      ...JSON.parse(JSON.stringify(sec)),
      id: `sec-${Date.now()}`,
      name: `${sec.name} (Copy)`,
      position: sections.length + 1
    };
    setSections([...sections, duplicated]);
    setSelectedSecId(duplicated.id);
  };

  const handleAddSection = (type: SectionType) => {
    const newSec: PageSection = {
      id: `sec-${Date.now()}`,
      page_id: page?.id || 'page-home',
      section_type: type,
      name: `New ${type.replace('_', ' ').toUpperCase()} Section`,
      position: sections.length + 1,
      is_enabled: true,
      visibility: { desktop: true, tablet: true, mobile: true },
      content: {
        heading: 'New Section Heading',
        subheading: 'Enter your section subtitle or description here.',
        primaryCtaText: 'Explore More',
        primaryCtaUrl: '/services'
      },
      style: { paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#09090b' },
      responsive: { desktopCols: 3, tabletCols: 2, mobileCols: 1 },
      animation: { type: 'fade-up', duration: 0.5 },
      background_settings: { type: 'color' }
    };

    setSections([...sections, newSec]);
    setSelectedSecId(newSec.id);
  };

  const handleUpdateContentProperty = (key: string, value: any) => {
    if (!selectedSecId) return;
    setSections(sections.map(s => {
      if (s.id === selectedSecId) {
        return {
          ...s,
          content: { ...s.content, [key]: value }
        };
      }
      return s;
    }));
  };

  const handleSaveDraft = async () => {
    if (!page) return;
    setSaveStatus('Saving working draft...');
    await pageService.savePageSections(page.id, sections);
    setSaveStatus("Draft saved. Click 'Publish Live' to make changes live on website.");
    setTimeout(() => setSaveStatus(''), 5000);
  };

  const handlePublish = async () => {
    if (!page) return;
    setSaveStatus('Publishing live to website...');
    const { version } = await pageService.publishPage(page.id, sections);
    setSaveStatus(`🎉 Published Live! Website updated instantly (Version ${version.version_number}).`);
    setTimeout(() => setSaveStatus(''), 5000);
  };

  const handleOpenVersions = async () => {
    if (!page) return;
    const vList = await pageService.getPageVersions(page.id);
    setVersions(vList);
    setIsVersionsDrawerOpen(true);
  };

  const handleRestoreVersion = async (versionId: string) => {
    const restoredPage = await pageService.restoreVersion(versionId);
    setPage(restoredPage);
    setSections(restoredPage.sections || []);
    setIsVersionsDrawerOpen(false);
    setSaveStatus('Version restored!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const [mobileTab, setMobileTab] = useState<'sections' | 'preview' | 'inspector'>('preview');

  const getViewportWidth = () => {
    switch (viewport) {
      case 'desktop': return 'w-full';
      case 'laptop': return 'w-[1280px]';
      case 'tablet': return 'w-[768px]';
      case 'mobile': return 'w-[390px] max-w-full';
    }
  };

  return (
    <div className="-m-4 sm:-m-6 h-[calc(100vh-4rem)] flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 overflow-hidden font-sans">
      {/* Top Action Header Bar */}
      <div className="min-h-14 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2 font-display uppercase tracking-wider">
            <Layout className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline">Homepage Video & Section Manager</span>
            <span className="sm:hidden">Page Builder</span>
          </span>
          {saveStatus && (
            <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 font-mono truncate max-w-[150px] sm:max-w-none">
              {saveStatus}
            </span>
          )}
        </div>

        {/* 4 Device Viewport Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl border border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${viewport === 'desktop' ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'}`}
          >
            <Monitor className="w-3.5 h-3.5" /> 1440px
          </button>
          <button
            onClick={() => setViewport('laptop')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${viewport === 'laptop' ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'}`}
          >
            <Laptop className="w-3.5 h-3.5" /> 1280px
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${viewport === 'tablet' ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'}`}
          >
            <Tablet className="w-3.5 h-3.5" /> 768px
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${viewport === 'mobile' ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'}`}
          >
            <Smartphone className="w-3.5 h-3.5" /> 390px
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={handleOpenVersions}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 flex items-center gap-1 border border-slate-200 dark:border-transparent"
          >
            <RotateCcw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Versions</span>
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white flex items-center gap-1 border border-slate-200 dark:border-transparent"
          >
            <Save className="w-3.5 h-3.5" /> Save<span className="hidden sm:inline"> Draft</span>
          </button>
          <button
            onClick={handlePublish}
            className="px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black flex items-center gap-1 shadow-md"
          >
            <Globe className="w-3.5 h-3.5" /> Publish
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Tab Switcher (< lg screens) */}
      <div className="lg:hidden bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 p-1.5 flex items-center justify-around text-xs font-bold shrink-0">
        <button
          onClick={() => setMobileTab('sections')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all ${
            mobileTab === 'sections' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          <Layout className="w-3.5 h-3.5" /> Sections ({sections.length})
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all ${
            mobileTab === 'preview' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Live Preview
        </button>
        <button
          onClick={() => setMobileTab('inspector')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all ${
            mobileTab === 'inspector' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" /> Inspector
        </button>
      </div>

      {/* 3-PANEL WORKSPACE (Responsive on mobile/tablet) */}
      <div className="flex-1 flex min-h-0">
        
        {/* LEFT PANEL: Section Reordering & Palette */}
        <div className={`${mobileTab === 'sections' ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 bg-white dark:bg-zinc-900/95 border-r border-slate-200 dark:border-zinc-800 flex-col shrink-0 overflow-y-auto custom-scrollbar`}>
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-400 uppercase tracking-wider">Add Custom Section</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'hero_3d', label: 'Event Video Hero' },
                { type: 'rich_text', label: 'About Intro' },
                { type: 'services', label: 'What We Do' },
                { type: 'portfolio', label: 'Featured Work' },
                { type: 'video_reels', label: 'Testimonial Video' },
                { type: 'testimonials', label: 'Text Carousel' },
                { type: 'contact', label: 'Enquiry Form' },
                { type: 'cta', label: 'Final CTA' }
              ].map(item => (
                <button
                  key={item.type}
                  onClick={() => {
                    handleAddSection(item.type as SectionType);
                    setMobileTab('inspector');
                  }}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center gap-1.5 transition-colors touch-target shadow-sm"
                >
                  <Plus className="w-3 h-3 text-amber-500 dark:text-amber-400" /> {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Tree List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-3">Homepage Sections ({sections.length})</h3>
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                onClick={() => {
                  setSelectedSecId(sec.id);
                  if (window.innerWidth < 1024) setMobileTab('inspector');
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-sm ${
                  selectedSecId === sec.id
                    ? 'bg-slate-100 dark:bg-zinc-800 border-slate-900 dark:border-white text-slate-950 dark:text-white ring-1 ring-slate-900 dark:ring-white shadow-md'
                    : 'bg-white dark:bg-zinc-950/60 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold truncate max-w-[170px] font-display text-slate-900 dark:text-white">{sec.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 'up'); }}
                      className="p-1 text-slate-400 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white touch-target"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 'down'); }}
                      className="p-1 text-slate-400 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white touch-target"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-500">
                  <span className="uppercase font-bold text-amber-600 dark:text-amber-400 font-mono">{sec.section_type}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleVisibility(sec.id); }}
                      title="Toggle Visibility"
                      className="p-1 text-slate-400 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      {sec.is_enabled ? <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDuplicateSection(sec); }}
                      title="Duplicate Section"
                      className="p-1 text-slate-400 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteSection(sec.id); }}
                      title="Delete Section"
                      className="p-1 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER PANEL: Live Interactive Workspace */}
        <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} lg:flex flex-1 bg-slate-100 dark:bg-zinc-950 overflow-y-auto p-2 sm:p-6 justify-center custom-scrollbar`}>
          <div
            className={`transition-all duration-300 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-x-hidden ${getViewportWidth()}`}
          >
            {sections.filter(s => s.is_enabled).map((sec) => (
              <div
                key={sec.id}
                onClick={() => {
                  setSelectedSecId(sec.id);
                  if (window.innerWidth < 1024) setMobileTab('inspector');
                }}
                className={`relative transition-all cursor-pointer overflow-x-hidden ${
                  selectedSecId === sec.id ? 'ring-2 ring-white ring-offset-4 ring-offset-zinc-950' : ''
                }`}
              >
                <SectionRenderer section={sec} />
                {selectedSecId === sec.id && (
                  <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-extrabold px-3 py-1 rounded-full shadow-2xl uppercase tracking-wider font-mono z-30">
                    Editing: {sec.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: Property Inspector */}
        <div className={`${mobileTab === 'inspector' ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 bg-white dark:bg-zinc-900/95 border-l border-slate-200 dark:border-zinc-800 flex-col shrink-0 overflow-y-auto custom-scrollbar`}>
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">
              Section Inspector
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">Configure content & media parameters</p>
            
            {/* Inspector Tabs */}
            <div className="flex gap-1 mt-3 p-1 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
              <button
                onClick={() => setInspectorTab('content')}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors ${inspectorTab === 'content' ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'}`}
              >
                Content
              </button>
              <button
                onClick={() => setInspectorTab('video')}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors ${inspectorTab === 'video' ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'}`}
              >
                Video / Media
              </button>
              <button
                onClick={() => setInspectorTab('style')}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors ${inspectorTab === 'style' ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'}`}
              >
                Style
              </button>
            </div>
          </div>

          {selectedSection ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {inspectorTab === 'content' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Section Identifier</label>
                    <input
                      type="text"
                      value={selectedSection.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections(sections.map(s => s.id === selectedSecId ? { ...s, name: val } : s));
                      }}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  {selectedSection.content.heading !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Main Heading</label>
                      <textarea
                        rows={2}
                        value={selectedSection.content.heading || ''}
                        onChange={(e) => handleUpdateContentProperty('heading', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  {selectedSection.content.subheading !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Subtitle / Description</label>
                      <textarea
                        rows={3}
                        value={selectedSection.content.subheading || ''}
                        onChange={(e) => handleUpdateContentProperty('subheading', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  )}

                  {/* Primary CTA & Button Link Configuration */}
                  <div className="space-y-4 pt-2 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-amber-400 uppercase tracking-wider font-display flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" /> Section Button & Link Options
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Primary Button Label / Text</label>
                      <input
                        type="text"
                        placeholder="e.g. VISIT LIVE SITE ↗, Start a Project"
                        value={selectedSection.content.primaryCtaText || selectedSection.content.buttonText || ''}
                        onChange={(e) => {
                          handleUpdateContentProperty('primaryCtaText', e.target.value);
                          handleUpdateContentProperty('buttonText', e.target.value);
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Primary Button Target Link URL</label>
                      <input
                        type="text"
                        placeholder="e.g. https://navajowhite-ant-953565.hostingersite.com/ or /services"
                        value={selectedSection.content.primaryCtaUrl || selectedSection.content.buttonUrl || ''}
                        onChange={(e) => {
                          handleUpdateContentProperty('primaryCtaUrl', e.target.value);
                          handleUpdateContentProperty('buttonUrl', e.target.value);
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* PORTFOLIO & FEATURED CARDS INDIVIDUAL BUTTON LINKS */}
                  {(selectedSection.section_type === 'portfolio' || selectedSection.id.includes('portfolio') || selectedSection.name.toLowerCase().includes('portfolio') || selectedSection.name.toLowerCase().includes('work')) && (
                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-display">
                          Project Cards Live Link Settings
                        </span>
                      </div>

                      {/* Header View All Link */}
                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
                        <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">Header "View All Work" Button Settings</span>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">Button Text</label>
                          <input
                            type="text"
                            value={selectedSection.content.header_cta_text || 'View All Work'}
                            onChange={(e) => handleUpdateContentProperty('header_cta_text', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">Target Link URL</label>
                          <input
                            type="text"
                            value={selectedSection.content.header_cta_url || '/portfolio'}
                            onChange={(e) => handleUpdateContentProperty('header_cta_url', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSection.content.header_cta_open_new_tab || false}
                              onChange={(e) => handleUpdateContentProperty('header_cta_open_new_tab', e.target.checked)}
                              className="accent-amber-400 rounded"
                            />
                            <span className="text-[10px] text-zinc-300 font-semibold">Open in New Tab</span>
                          </label>
                          <a
                            href={selectedSection.content.header_cta_url || '/portfolio'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                          >
                            🔗 Test Link ↗
                          </a>
                        </div>
                      </div>

                      {/* CARD 1 */}
                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
                        <span className="text-[10px] font-bold text-zinc-300 uppercase font-mono">Card 1: Real Estate CRM</span>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">Project Title</label>
                          <input
                            type="text"
                            value={selectedSection.content.card1_title || 'Website & Real Estate CRM Platform'}
                            onChange={(e) => handleUpdateContentProperty('card1_title', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">Button Text</label>
                          <input
                            type="text"
                            placeholder="VISIT LIVE SITE"
                            value={selectedSection.content.card1_button_text || 'VISIT LIVE SITE'}
                            onChange={(e) => handleUpdateContentProperty('card1_button_text', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">Live Site Target URL</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={selectedSection.content.card1_url || 'https://navajowhite-ant-953565.hostingersite.com/'}
                            onChange={(e) => handleUpdateContentProperty('card1_url', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSection.content.card1_open_new_tab !== false}
                              onChange={(e) => handleUpdateContentProperty('card1_open_new_tab', e.target.checked)}
                              className="accent-amber-400 rounded"
                            />
                            <span className="text-[10px] text-zinc-300 font-semibold">Open in New Tab</span>
                          </label>
                          <a
                            href={selectedSection.content.card1_url || 'https://navajowhite-ant-953565.hostingersite.com/'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                          >
                            🔗 Test Link ↗
                          </a>
                        </div>
                      </div>

                      {/* CARD 2 */}
                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
                        <span className="text-[10px] font-bold text-zinc-300 uppercase font-mono">Card 2: Distance Education CRM</span>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">Project Title</label>
                          <input
                            type="text"
                            value={selectedSection.content.card2_title || 'Website & Institute of Distance Education CRM'}
                            onChange={(e) => handleUpdateContentProperty('card2_title', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">Button Text</label>
                          <input
                            type="text"
                            placeholder="VISIT LIVE SITE"
                            value={selectedSection.content.card2_button_text || 'VISIT LIVE SITE'}
                            onChange={(e) => handleUpdateContentProperty('card2_button_text', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">Live Site Target URL</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={selectedSection.content.card2_url || 'https://sienna-chimpanzee-129344.hostingersite.com/'}
                            onChange={(e) => handleUpdateContentProperty('card2_url', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSection.content.card2_open_new_tab !== false}
                              onChange={(e) => handleUpdateContentProperty('card2_open_new_tab', e.target.checked)}
                              className="accent-amber-400 rounded"
                            />
                            <span className="text-[10px] text-zinc-300 font-semibold">Open in New Tab</span>
                          </label>
                          <a
                            href={selectedSection.content.card2_url || 'https://sienna-chimpanzee-129344.hostingersite.com/'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                          >
                            🔗 Test Link ↗
                          </a>
                        </div>
                      </div>

                      {/* CARD 3 */}
                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
                        <span className="text-[10px] font-bold text-zinc-300 uppercase font-mono">Card 3: E-Commerce CRM</span>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">Project Title</label>
                          <input
                            type="text"
                            value={selectedSection.content.card3_title || 'E-Commerce Website with Integrated CRM'}
                            onChange={(e) => handleUpdateContentProperty('card3_title', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">Button Text</label>
                          <input
                            type="text"
                            placeholder="VISIT LIVE SITE"
                            value={selectedSection.content.card3_button_text || 'VISIT LIVE SITE'}
                            onChange={(e) => handleUpdateContentProperty('card3_button_text', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400 mb-1">Live Site Target URL</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={selectedSection.content.card3_url || 'https://mediumvioletred-viper-351367.hostingersite.com/'}
                            onChange={(e) => handleUpdateContentProperty('card3_url', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSection.content.card3_open_new_tab !== false}
                              onChange={(e) => handleUpdateContentProperty('card3_open_new_tab', e.target.checked)}
                              className="accent-amber-400 rounded"
                            />
                            <span className="text-[10px] text-zinc-300 font-semibold">Open in New Tab</span>
                          </label>
                          <a
                            href={selectedSection.content.card3_url || 'https://mediumvioletred-viper-351367.hostingersite.com/'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                          >
                            🔗 Test Link ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {inspectorTab === 'video' && (
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                  <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5 font-display">
                    <Video className="w-3.5 h-3.5" /> Video Media Controls
                  </h4>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Video Source Type</label>
                    <select
                      value={selectedSection.content.video_source || 'youtube'}
                      onChange={(e) => handleUpdateContentProperty('video_source', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="youtube">YouTube Video URL</option>
                      <option value="upload">Uploaded Video (MP4 / WebM)</option>
                      <option value="image">Static Poster Image</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">YouTube Video URL</label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={selectedSection.content.youtube_url || ''}
                      onChange={(e) => handleUpdateContentProperty('youtube_url', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Uploaded Video URL</label>
                    <input
                      type="text"
                      placeholder="https://.../video.mp4"
                      value={selectedSection.content.upload_video_url || ''}
                      onChange={(e) => handleUpdateContentProperty('upload_video_url', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Poster Image URL (Fallback)</label>
                    <input
                      type="text"
                      placeholder="https://.../poster.jpg"
                      value={selectedSection.content.poster_url || ''}
                      onChange={(e) => handleUpdateContentProperty('poster_url', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {inspectorTab === 'style' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Background Surface</label>
                    <select
                      value={selectedSection.background_settings?.type || 'color'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections(sections.map(s => s.id === selectedSecId ? { ...s, background_settings: { ...s.background_settings, type: val } } : s));
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="color">Solid Obsidian Dark</option>
                      <option value="video">Cinematic Video Mesh</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 p-6 text-center text-zinc-500 text-xs flex items-center justify-center">
              Select a section to edit properties.
            </div>
          )}
        </div>

      </div>

      {/* Version History Drawer Modal */}
      {isVersionsDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-96 bg-zinc-900 border-l border-zinc-800 p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-white font-display">Version History</h3>
              <button onClick={() => setIsVersionsDrawerOpen(false)} className="text-zinc-400 hover:text-white text-sm font-bold">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4">
              {versions.map((ver) => (
                <div key={ver.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">Version #{ver.version_number}</div>
                    <div className="text-xs text-zinc-400">{new Date(ver.created_at).toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => handleRestoreVersion(ver.id)}
                    className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
