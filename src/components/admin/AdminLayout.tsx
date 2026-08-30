import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AgentRole } from '../../types/database.types';
import { CurrencySelector } from '../common/CurrencySelector';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  LayoutDashboard, Users, UserCheck, Briefcase, GitPullRequest, Clock,
  Laptop, FolderKanban, FileText, Star, Layers, Layout, Menu, X, Image as ImageIcon,
  BookOpen, Target, FileSpreadsheet, CreditCard, DollarSign, ShieldAlert,
  Bell, BarChart3, Settings, LogOut, ChevronRight, Sparkles, User, Calendar, Shield, Headset, MessageCircle, Video, Building2, Key
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, switchRoleDemo, isPathAllowed } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const allNavLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Directory', path: '/admin/users', icon: Users, badge: 'IAM' },
    { label: 'Roles & Permissions', path: '/admin/roles', icon: Shield, badge: 'RBAC' },
    { label: 'Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Security & Audit', path: '/admin/security', icon: ShieldAlert },
    { label: 'Initial Setup Sheet', path: '/admin/setup', icon: Key, badge: 'SETUP' },
    { label: 'Events & Auditions', path: '/admin/events', icon: Calendar, badge: 'HOT' },
    { label: 'Leads CRM', path: '/admin/leads', icon: Users },
    { label: 'Sales Pipeline', path: '/admin/pipeline', icon: GitPullRequest },
    { label: 'Follow-ups', path: '/admin/follow-ups', icon: Clock },
    { label: 'Communication Hub', path: '/admin/communication', icon: MessageCircle, badge: 'API' },
    { label: 'Reel Marketing', path: '/admin/marketing/reels', icon: Video, badge: 'REELS' },
    { label: 'Clients', path: '/admin/clients', icon: UserCheck },
    { label: 'Homepage Builder', path: '/admin/homepage-builder', icon: Layout, badge: 'PRO' },
    { label: 'Services CMS', path: '/admin/services', icon: Laptop },
    { label: 'Portfolio', path: '/admin/portfolio', icon: FolderKanban },
    { label: 'Case Studies', path: '/admin/case-studies', icon: FileText },
    { label: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { label: 'Pages', path: '/admin/pages', icon: Layers },
    { label: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { label: 'Blog / CMS', path: '/admin/blog', icon: BookOpen },
    { label: 'Campaigns', path: '/admin/campaigns', icon: Target },
    { label: 'Proposals', path: '/admin/proposals', icon: FileSpreadsheet },
    { label: 'Invoices', path: '/admin/invoices', icon: CreditCard },
    { label: 'Payments', path: '/admin/payments', icon: DollarSign },
    { label: 'Team & Roles', path: '/admin/team', icon: ShieldAlert },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // Filter links according to active agent's role permissions
  const permittedNavLinks = allNavLinks.filter(item => isPathAllowed(item.path));
  const currentPathAllowed = isPathAllowed(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const renderNavItems = (isMobileView = false) => (
    <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
      {permittedNavLinks.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => isMobileView && setIsMobileDrawerOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            {(!collapsed || isMobileView) && (
              <div className="flex-1 flex items-center justify-between overflow-hidden">
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-mono">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-brand-500 selection:text-white relative">
      
      {/* MOBILE DRAWER BACKDROP */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* MOBILE OFF-CANVAS SLIDE-IN SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-2" onClick={() => setIsMobileDrawerOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-glow-brand">
              V
            </div>
            <span className="font-black text-sm tracking-wider uppercase font-display text-slate-950 dark:text-white logo-brand-text">
              VELAMETRIC
            </span>
          </Link>
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 touch-target"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile User Details */}
        {currentUser && (
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 shrink-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
                  {currentUser.full_name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.full_name}</div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono truncate">{currentUser.department} ({currentUser.user_code})</div>
                </div>
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">Switch Initial Role Demo:</label>
                <select
                  value={currentUser.role}
                  onChange={(e) => switchRoleDemo(e.target.value as AgentRole)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-slate-800 dark:text-slate-300 font-bold focus:outline-none focus:border-brand-500"
                >
                  <option value="SUPER_ADMIN">👑 SUPERADMIN-001</option>
                  <option value="ADMIN">🏢 ADMIN-001</option>
                  <option value="SALES_MANAGER">💼 SALES-MANAGER-001</option>
                  <option value="SALES_AGENT">💼 SALES-001</option>
                  <option value="MARKETING_MANAGER">📣 MARKETING-001</option>
                  <option value="EVENT_AGENT">🎟️ EVENT-001</option>
                  <option value="FINANCE_MANAGER">💰 FINANCE-001</option>
                  <option value="VIEWER">👁️ VIEWER-001</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {renderNavItems(true)}

        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0 pb-safe">
          <ThemeToggle variant="expanded" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors touch-target"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* DESKTOP SIDEBAR NAVIGATION (Hidden on mobile/tablet <lg) */}
      <aside className={`hidden lg:flex ${collapsed ? 'w-20' : 'w-64'} bg-white dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 flex-col transition-all duration-300 shrink-0 sticky top-0 h-screen z-40`}>
        
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-glow-brand">
              V
            </div>
            {!collapsed && (
              <span className="font-black text-sm tracking-wider uppercase font-display text-slate-950 dark:text-white logo-brand-text">
                VELAMETRIC
              </span>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 touch-target"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* ACTIVE AGENT PROFILE & DEMO ROLE SWITCHER */}
        {currentUser && (
          <div className="p-3 border-b border-slate-800 bg-slate-950/80 shrink-0">
            {!collapsed ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
                    {currentUser.full_name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{currentUser.full_name}</div>
                    <div className="text-[10px] text-amber-400 font-mono truncate">{currentUser.department} ({currentUser.user_code})</div>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Switch Initial Role Demo:</label>
                  <select
                    value={currentUser.role}
                    onChange={(e) => switchRoleDemo(e.target.value as AgentRole)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 font-bold focus:outline-none focus:border-brand-500"
                  >
                    <option value="SUPER_ADMIN">👑 SUPERADMIN-001</option>
                    <option value="ADMIN">🏢 ADMIN-001</option>
                    <option value="SALES_MANAGER">💼 SALES-MANAGER-001</option>
                    <option value="SALES_AGENT">💼 SALES-001</option>
                    <option value="MARKETING_MANAGER">📣 MARKETING-001</option>
                    <option value="EVENT_AGENT">🎟️ EVENT-001</option>
                    <option value="FINANCE_MANAGER">💰 FINANCE-001</option>
                    <option value="VIEWER">👁️ VIEWER-001</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex justify-center" title={`${currentUser.full_name} (${currentUser.role})`}>
                <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
                  {currentUser.full_name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nav Links */}
        {renderNavItems(false)}

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-2 shrink-0">
          {!collapsed ? (
            <ThemeToggle variant="expanded" />
          ) : (
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar Header */}
        <header className="h-16 border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between bg-slate-900/90 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-3 text-xs overflow-hidden">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 touch-target"
              aria-label="Open admin navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="text-slate-400 hidden sm:inline">Admin</span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="font-bold text-white uppercase tracking-wider font-display truncate">
                {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Dark & Light Theme Switcher */}
            <ThemeToggle />

            {/* Quick Currency Selector Pill */}
            <CurrencySelector compact />

            <Link
              to="/"
              target="_blank"
              className="text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 touch-target sm:touch-manipulation"
            >
              <span className="hidden sm:inline">Preview Website</span>
              <span className="sm:hidden">Site</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Dynamic Route Content OR Permission Guard */}
        <div className="p-3 sm:p-6 lg:p-8 flex-1 min-w-0">
          {currentPathAllowed ? (
            <Outlet />
          ) : (
            <div className="max-w-xl mx-auto py-12 sm:py-16 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-rose-400 mx-auto" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">Restricted Access</h2>
              <p className="text-xs text-slate-400">
                Your current role <span className="text-amber-400 font-bold font-mono">({currentUser?.role})</span> does not have authorization to view this module.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs touch-target"
                >
                  Return to Authorized Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  );
};
