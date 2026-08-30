import React, { useEffect, useState } from 'react';
import { PortfolioProject, CaseStudy } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import {
  Camera,
  Globe,
  Video,
  ExternalLink,
  Images,
  Eye,
  Sparkles,
  Trash2,
  Star,
  Plus,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Wrench,
  Search,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PortfolioCMS: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'photoshoot' | 'web_app' | 'video_production'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<PortfolioProject | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadProjects = async () => {
    const data = await portfolioService.getProjects();
    setProjects(data);
    if (selectedProject) {
      const updated = data.find(p => p.id === selectedProject.id);
      setSelectedProject(updated || null);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Action: Delete or remove single photo
  const handleDeletePhoto = async (projectId: string, photoUrl: string) => {
    const updated = await portfolioService.deletePhoto(projectId, photoUrl);
    if (updated) {
      showToast('Photo successfully removed from lookbook!');
      loadProjects();
    }
  };

  // Action: Set photo as display profile photo
  const handleSetFeaturedImage = async (projectId: string, photoUrl: string) => {
    const updated = await portfolioService.setFeaturedImage(projectId, photoUrl);
    if (updated) {
      showToast('Display profile photo updated successfully! ⭐');
      loadProjects();
    }
  };

  // Action: Delete the current display profile photo
  const handleDeleteFeaturedImage = async (projectId: string) => {
    const updated = await portfolioService.deleteFeaturedImage(projectId);
    if (updated) {
      showToast('Display profile photo removed & replaced with next frame!');
      loadProjects();
    }
  };

  // Action: Add new photo
  const handleAddPhoto = async (projectId: string) => {
    if (!newPhotoUrl.trim()) return;
    const updated = await portfolioService.addPhotoToGallery(projectId, newPhotoUrl.trim());
    if (updated) {
      setNewPhotoUrl('');
      showToast('New photo added to lookbook!');
      loadProjects();
    }
  };

  // Action: Delete entire project
  const handleDeleteProject = async (projectId: string) => {
    const success = await portfolioService.deleteProject(projectId);
    if (success) {
      setConfirmDeleteProject(null);
      setSelectedProject(null);
      showToast('Project deleted successfully from showcase!');
      loadProjects();
    }
  };

  // Action: Reset all to defaults
  const handleResetDefaults = async () => {
    if (window.confirm('Reset all portfolio projects & photos to default photoshoot showcase?')) {
      const def = await portfolioService.resetProjectsToDefault();
      setProjects(def);
      setSelectedProject(null);
      showToast('All portfolio lookbooks restored to defaults!');
    }
  };

  const filtered = projects.filter(p => {
    if (activeFilter !== 'ALL' && p.project_type !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        (p.industry && p.industry.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-black shadow-2xl border border-amber-400/50 animate-slideUp font-bold text-xs">
          <CheckCircle2 className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Stats */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" /> 3D Portfolio & Media Management CMS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            Showcase Projects & Profile Photos
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Control display profile photos, delete unwanted frames, organize high-fashion photoshoot galleries, and update live project links.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
            title="Restore original factory photoshoot images"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <Link
            to="/portfolio"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold text-xs hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 dark:hover:text-black transition-all shadow-md"
          >
            <Eye className="w-4 h-4" /> Preview Live ↗
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'ALL'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Work ({projects.length})
          </button>
          <button
            onClick={() => setActiveFilter('photoshoot')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'photoshoot'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Photoshoots ({projects.filter(p => p.project_type === 'photoshoot').length})
          </button>
          <button
            onClick={() => setActiveFilter('web_app')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'web_app'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Web & CRM ({projects.filter(p => p.project_type === 'web_app').length})
          </button>
          <button
            onClick={() => setActiveFilter('video_production')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'video_production'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Video Reels ({projects.filter(p => p.project_type === 'video_production').length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Projects Grid with 3D Admin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 [perspective:1400px]">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Display Profile Photo Container */}
              <div className="h-52 relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
                <img
                  src={proj.featured_image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Client Badge */}
                <span className="absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-1 bg-black/85 text-white rounded-full backdrop-blur-md border border-white/20">
                  {proj.client}
                </span>

                {/* Type Badge */}
                {proj.project_type === 'photoshoot' ? (
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 bg-amber-500 text-black rounded-full font-mono flex items-center gap-1 shadow-lg">
                    <Camera className="w-3 h-3" /> PHOTOSHOOT
                  </span>
                ) : proj.project_type === 'video_production' ? (
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 bg-purple-500 text-white rounded-full font-mono flex items-center gap-1 shadow-lg">
                    <Video className="w-3 h-3" /> VIDEO REELS
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 bg-emerald-500 text-black rounded-full font-mono shadow-lg">
                    LIVE PLATFORM
                  </span>
                )}

                {/* Active Display Profile Photo Indicator */}
                <span className="absolute bottom-3 left-3 text-[10px] font-bold px-2.5 py-1 bg-amber-500/90 text-black rounded-lg backdrop-blur font-mono flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-black" /> Display Profile Photo
                </span>

                {/* Photo Count */}
                {proj.gallery && proj.gallery.length > 0 && (
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 bg-black/80 text-white rounded-lg backdrop-blur font-mono flex items-center gap-1">
                    <Images className="w-3 h-3 text-amber-400" /> {proj.gallery.length} Photos
                  </span>
                )}
              </div>

              {/* Card Meta & Details */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                  <span>{proj.industry}</span>
                  <span>{proj.completion_date}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display line-clamp-1">{proj.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{proj.description}</p>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-2 mt-2">
              <button
                onClick={() => setSelectedProject(proj)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-black dark:bg-white dark:hover:bg-amber-400 dark:hover:text-black text-white dark:text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Images className="w-3.5 h-3.5" /> Manage Photos & Profile ({proj.gallery?.length || 1})
              </button>

              <div className="flex items-center justify-between pt-1 text-xs">
                <Link
                  to={`/portfolio/${proj.slug}`}
                  target="_blank"
                  className="font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-white inline-flex items-center gap-1"
                >
                  View Page <ExternalLink className="w-3 h-3" />
                </Link>

                <button
                  onClick={() => setConfirmDeleteProject(proj)}
                  className="text-rose-500 hover:text-rose-600 font-bold inline-flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3 h-3" /> Delete Project
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media & Profile Photo Manager Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
                  Media & Profile Photo Manager • {selectedProject.client}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                  {selectedProject.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Set any photo as the main display cover, delete unwanted frames, or add new lookbook images.
                </p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Display Profile Photo Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border-2 border-amber-400 shadow-md">
                  <img
                    src={selectedProject.featured_image}
                    alt="Active Display Profile Photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-bold uppercase font-mono">
                    <Star className="w-3 h-3 fill-black" /> Current Display Profile Photo
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    Primary Cover for Portfolio Cards
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    This photo is displayed on the main portfolio grid and case study hero.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteFeaturedImage(selectedProject.id)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Profile Photo
              </button>
            </div>

            {/* Gallery Frames Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                  <Images className="w-4 h-4 text-amber-500" />
                  Lookbook Gallery Frames ({selectedProject.gallery?.length || 0} Photos)
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Click ⭐ to set as cover, 🗑️ to delete
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(selectedProject.gallery || []).map((photoUrl, idx) => {
                  const isFeatured = selectedProject.featured_image === photoUrl;
                  return (
                    <div
                      key={idx}
                      className={`relative h-44 rounded-2xl overflow-hidden border-2 transition-all group bg-slate-100 dark:bg-slate-950 ${
                        isFeatured ? 'border-amber-400 shadow-lg ring-2 ring-amber-400/40' : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                      }`}
                    >
                      <img src={photoUrl} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />

                      {/* Top Overlay Badges */}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded bg-black/80 text-white text-[9px] font-mono">
                          #{idx + 1}
                        </span>
                        {isFeatured && (
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[9px] font-bold font-mono">
                            COVER
                          </span>
                        )}
                      </div>

                      {/* Action Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        {!isFeatured ? (
                          <button
                            onClick={() => handleSetFeaturedImage(selectedProject.id, photoUrl)}
                            className="w-full py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-md transition-all"
                          >
                            <Star className="w-3 h-3 fill-black" /> Set as Cover
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-400 uppercase font-mono text-center">
                            ★ Active Cover Photo
                          </span>
                        )}

                        <button
                          onClick={() => handleDeletePhoto(selectedProject.id, photoUrl)}
                          className="w-full py-1.5 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-md transition-all"
                        >
                          <Trash2 className="w-3 h-3" /> Delete Photo
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add New Photo Input */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-500" /> Add New Photo to this Project
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste local path (e.g. /images/photoshoot/my_photo.jpg) or image URL..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleAddPhoto(selectedProject.id)}
                  disabled={!newPhotoUrl.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Frame
                </button>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setConfirmDeleteProject(selectedProject)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Entire Project
              </button>

              <button
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs hover:bg-amber-500 hover:text-black transition-all shadow-md"
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Project Deletion */}
      {confirmDeleteProject && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Delete "{confirmDeleteProject.title}"?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to remove this project and its gallery from the public portfolio showcase? You can restore it anytime with "Reset Defaults".
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteProject(null)}
                className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(confirmDeleteProject.id)}
                className="px-6 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-lg"
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case Studies Section */}
      <CaseStudiesCMS />
    </div>
  );
};

export const CaseStudiesCMS: React.FC = () => {
  const [studies, setStudies] = useState<CaseStudy[]>([]);

  useEffect(() => {
    portfolioService.getCaseStudies().then(setStudies);
  }, []);

  return (
    <div className="space-y-6 pt-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">Case Studies & ROI Metrics</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Manage quantifiable ROI studies with performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studies.map((cs) => (
          <div key={cs.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">Client: {cs.client}</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">{cs.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{cs.results}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
