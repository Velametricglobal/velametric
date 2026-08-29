import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AgentRole } from '../../types/database.types';
import { CurrencySelector } from '../common/CurrencySelector';
import {
  LayoutDashboard, Users, UserCheck, Briefcase, GitPullRequest, Clock,
  Laptop, FolderKanban, FileText, Star, Layers, Layout, Menu, Image as ImageIcon,
  BookOpen, Target, FileSpreadsheet, CreditCard, DollarSign, ShieldAlert,
  Bell, BarChart3, Settings, LogOut, ChevronRight, Sparkles, User, Calendar, Shield, Headset, MessageCircle, Video, Building2, Key
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, switchRoleDemo, isPathAllowed } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-brand-500 selection:text-white">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-slate-900/90 border-r border-slate-800 flex flex-col transition-all duration-300 shrink-0 sticky top-0 h-screen z-40`}>
        
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-glow-brand">
              V
            </div>
            {!collapsed && (
              <span className="font-extrabold text-sm tracking-wider uppercase font-display bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                VELAMETRIC
              </span>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* ACTIVE AGENT PROFILE & DEMO ROLE SWITCHER */}
        {currentUser && (
          <div className="p-3 border-b border-slate-800 bg-slate-950/80">
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

                {/* Role Selector Dropdown */}
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
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {permittedNavLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-glow-brand'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!collapsed && (
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

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-1">
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
        <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Admin</span>
            <span className="text-slate-600">/</span>
            <span className="font-bold text-white uppercase tracking-wider font-display">
              {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Currency Selector Pill */}
            <CurrencySelector compact />

            <Link
              to="/"
              target="_blank"
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5"
            >
              <span>Preview Website</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Dynamic Route Content OR Permission Guard */}
        <div className="p-6 md:p-8 flex-1">
          {currentPathAllowed ? (
            <Outlet />
          ) : (
            <div className="max-w-xl mx-auto py-16 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <Shield className="w-16 h-16 text-rose-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white font-display">Restricted Access</h2>
              <p className="text-xs text-slate-400">
                Your current role <span className="text-amber-400 font-bold font-mono">({currentUser?.role})</span> does not have authorization to view this module.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
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
