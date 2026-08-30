import React, { useEffect, useState } from 'react';
import { Lead, LeadStatus, CommunicationChannel } from '../../types/database.types';
import { leadService } from '../../services/leadService';
import { Users, Search, Plus, Upload, Filter, Mail, Phone, Calendar, MessageSquare, Clock, Shield, Sparkles, GitPullRequest, FileSpreadsheet, UserCheck, ChevronRight, X, ExternalLink, Download, MessageCircle, MoreVertical } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ContactActionButtons } from '../../components/crm/ContactActionButtons';
import { CommunicationDrawer } from '../../components/crm/CommunicationDrawer';
import { AddLeadModal } from '../../components/crm/AddLeadModal';
import { CSVImportModal } from '../../components/crm/CSVImportModal';

// Unified Responsive CRM Sub-Navigation Bar
export const CRMNavigationHeader: React.FC = () => {
  const location = useLocation();

  const crmTabs = [
    { label: 'Leads Repository', path: '/admin/leads', icon: Users },
    { label: 'Sales Kanban', path: '/admin/pipeline', icon: GitPullRequest },
    { label: 'Follow-ups', path: '/admin/follow-ups', icon: Clock },
    { label: 'Events', path: '/admin/events', icon: Calendar, badge: 'LIVE' },
    { label: 'Proposals & Invoices', path: '/admin/proposals', icon: FileSpreadsheet },
    { label: 'Client Roster', path: '/admin/clients', icon: UserCheck },
    { label: 'Reel Marketing', path: '/admin/marketing/reels', icon: Sparkles, badge: 'NEW' },
    { label: 'Communication Hub', path: '/admin/communication', icon: Mail }
  ];

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 sm:p-2 rounded-2xl overflow-x-auto custom-scrollbar -mx-1 px-1 sm:mx-0 sm:px-2 shrink-0 shadow-sm">
      {crmTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`);
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
              isActive
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export const LeadsCRM: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [newNote, setNewNote] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Communication Drawer State
  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    contactName: string;
    phone?: string;
    email?: string;
    contactId?: string;
    initialChannel?: CommunicationChannel;
    initialTab?: 'MESSAGE' | 'PROMOTE';
  }>({
    isOpen: false,
    contactName: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const data = await leadService.getLeads();
    setLeads(data);
  };

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    const updated = await leadService.updateLeadStatus(leadId, status);
    fetchLeads();
    if (selectedLead?.id === leadId) setSelectedLead(updated);
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return;
    const updated = await leadService.addLeadNote(selectedLead.id, newNote);
    setSelectedLead(updated);
    setNewNote('');
    fetchLeads();
  };

  const handleOpenDrawer = (params: { contactName: string; phone?: string; email?: string; contactId?: string; initialChannel?: CommunicationChannel; initialTab?: 'MESSAGE' | 'PROMOTE' }) => {
    setDrawerState({
      isOpen: true,
      ...params
    });
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = `${l.lead_code || ''} ${l.first_name} ${l.last_name} ${l.email} ${l.company_name} ${l.phone}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesSource = sourceFilter === 'ALL' || l.source_name === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadgeStyle = (status: LeadStatus) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'CONTACTED': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'QUALIFIED': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'MEETING': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'PROPOSAL': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'NEGOTIATION': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'WON': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'LOST': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* CRM UNIFIED SUB-NAVIGATION HEADER */}
      <CRMNavigationHeader />

      {/* Top Header with PROMINENT [+ Add Lead] & [Import CSV] buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] uppercase tracking-wider font-bold">
            <Users className="w-3.5 h-3.5" /> CRM LEADS ENGINE & CSV IMPORT
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-display mt-0.5">Leads Repository</h2>
          <p className="text-slate-400 text-xs mt-0.5 sm:mt-1">Manage inbound web inquiries, manual sales entries, and bulk CSV lead imports.</p>
        </div>

        {/* PROMINENT LEAD ACTION BUTTONS */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xl touch-target"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
          
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all shadow-xl touch-target"
          >
            <Upload className="w-4 h-4 text-emerald-400" /> Import CSV
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 sm:gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search LEAD-XXXXXX, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
          />
        </div>

        {/* Horizontally Scrollable Status Pills on Mobile */}
        <div className="flex items-center gap-1.5 font-mono overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                statusFilter === st ? 'bg-amber-400 text-black shadow-lg font-extrabold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE RESPONSIVE LEAD CARDS (< md screens) */}
      <div className="md:hidden space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-400 text-xs">
            No leads found matching your filter criteria.
          </div>
        ) : (
          filteredLeads.map((l) => (
            <div key={l.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
              {/* Header row: Code + Priority + Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {l.lead_code || `LEAD-${l.id.substr(0, 6)}`}
                  </span>
                  {l.priority === 'HIGH' && (
                    <span className="text-[9px] font-bold uppercase text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 font-mono">
                      HIGH
                    </span>
                  )}
                </div>

                <select
                  value={l.status}
                  onChange={(e) => handleStatusChange(l.id, e.target.value as LeadStatus)}
                  className={`border rounded-lg px-2 py-0.5 text-[10px] font-bold ${getStatusBadgeStyle(l.status)}`}
                >
                  <option value="NEW" className="bg-slate-900 text-white">NEW</option>
                  <option value="CONTACTED" className="bg-slate-900 text-white">CONTACTED</option>
                  <option value="QUALIFIED" className="bg-slate-900 text-white">QUALIFIED</option>
                  <option value="MEETING" className="bg-slate-900 text-white">MEETING</option>
                  <option value="PROPOSAL" className="bg-slate-900 text-white">PROPOSAL</option>
                  <option value="NEGOTIATION" className="bg-slate-900 text-white">NEGOTIATION</option>
                  <option value="WON" className="bg-slate-900 text-white">WON</option>
                  <option value="LOST" className="bg-slate-900 text-white">LOST</option>
                </select>
              </div>

              {/* Contact Information */}
              <div>
                <div className="font-bold text-white text-base font-display">{l.first_name} {l.last_name}</div>
                <div className="text-slate-400 text-xs mt-0.5">{l.email}</div>
                <div className="text-slate-300 text-xs font-semibold mt-0.5 flex items-center justify-between">
                  <span>{l.company_name || 'Individual'}</span>
                  <span className="text-amber-400 font-normal">{l.service_interest}</span>
                </div>
              </div>

              {/* 1-Tap Quick Action Row */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <ContactActionButtons
                  contactName={`${l.first_name} ${l.last_name || ''}`}
                  phone={l.phone || '+91 9876543210'}
                  email={l.email}
                  contactId={l.id}
                  serviceInterest={l.service_interest}
                  companyName={l.company_name}
                  onOpenMessageDrawer={handleOpenDrawer}
                  size="sm"
                />

                <button
                  onClick={() => setSelectedLead(l)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shrink-0"
                >
                  Notes & Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP LEADS TABLE (>= md screens) */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold font-mono border-b border-slate-800">
              <tr>
                <th className="p-4">Lead Code & Contact</th>
                <th className="p-4">Direct Communication</th>
                <th className="p-4">Service Interest</th>
                <th className="p-4">Source</th>
                <th className="p-4">Pipeline Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLeads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {l.lead_code || `LEAD-${l.id.substr(0, 6)}`}
                      </span>
                      {l.priority === 'HIGH' && (
                        <span className="text-[9px] font-bold uppercase text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 font-mono">
                          HIGH
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-white font-display text-sm mt-1">{l.first_name} {l.last_name}</div>
                    <div className="text-slate-400 text-[11px]">{l.email} • <span className="text-slate-300 font-semibold">{l.company_name || 'Individual'}</span></div>
                  </td>
                  <td className="p-4">
                    <ContactActionButtons
                      contactName={`${l.first_name} ${l.last_name || ''}`}
                      phone={l.phone || '+91 9876543210'}
                      email={l.email}
                      contactId={l.id}
                      serviceInterest={l.service_interest}
                      companyName={l.company_name}
                      onOpenMessageDrawer={handleOpenDrawer}
                      size="sm"
                    />
                  </td>
                  <td className="p-4 text-slate-200 font-medium">{l.service_interest}</td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">{l.source_name || 'Website'}</td>
                  <td className="p-4">
                    <select
                      value={l.status}
                      onChange={(e) => handleStatusChange(l.id, e.target.value as LeadStatus)}
                      className={`border rounded-lg px-2.5 py-1 text-[11px] font-bold ${getStatusBadgeStyle(l.status)}`}
                    >
                      <option value="NEW" className="bg-slate-900 text-white">NEW</option>
                      <option value="CONTACTED" className="bg-slate-900 text-white">CONTACTED</option>
                      <option value="QUALIFIED" className="bg-slate-900 text-white">QUALIFIED</option>
                      <option value="MEETING" className="bg-slate-900 text-white">MEETING</option>
                      <option value="PROPOSAL" className="bg-slate-900 text-white">PROPOSAL</option>
                      <option value="NEGOTIATION" className="bg-slate-900 text-white">NEGOTIATION</option>
                      <option value="WON" className="bg-slate-900 text-white">WON</option>
                      <option value="LOST" className="bg-slate-900 text-white">LOST</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedLead(l)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                    >
                      Details & Notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive Lead Detail & Timeline Modal / Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full sm:max-w-lg bg-slate-900 border-l border-slate-800 p-4 sm:p-6 flex flex-col h-full overflow-y-auto space-y-5 custom-scrollbar">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {selectedLead.lead_code || 'LEAD-000124'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white font-display mt-1">{selectedLead.first_name} {selectedLead.last_name}</h3>
                <p className="text-xs text-slate-400">{selectedLead.company_name} — {selectedLead.email}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white touch-target">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="text-slate-400 font-semibold">Direct Communication Triggers:</div>
                <ContactActionButtons
                  contactName={`${selectedLead.first_name} ${selectedLead.last_name || ''}`}
                  phone={selectedLead.phone || '+91 9876543210'}
                  email={selectedLead.email}
                  contactId={selectedLead.id}
                  serviceInterest={selectedLead.service_interest}
                  companyName={selectedLead.company_name}
                  onOpenMessageDrawer={handleOpenDrawer}
                  size="md"
                />
                <div className="text-xs space-y-1.5 pt-2 border-t border-slate-800 font-mono">
                  <div><span className="text-slate-400">Phone:</span> <span className="text-white font-medium">{selectedLead.phone || 'N/A'}</span></div>
                  <div><span className="text-slate-400">Source:</span> <span className="text-amber-400 font-medium">{selectedLead.source_name || 'Website'}</span></div>
                  <div><span className="text-slate-400">Service:</span> <span className="text-white font-medium">{selectedLead.service_interest}</span></div>
                  {selectedLead.message && (
                    <div><span className="text-slate-400">Message / Requirement:</span> <p className="text-slate-300 mt-1 italic font-sans">"{selectedLead.message}"</p></div>
                  )}
                </div>
              </div>

              {/* Add Sales Note Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Add Sales Note</label>
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record call summary, client budget or follow-up notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white mb-2 focus:border-amber-400 focus:outline-none"
                />
                <button
                  onClick={handleAddNote}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-400 text-black font-extrabold text-xs shadow-lg touch-target"
                >
                  Save Note to Timeline
                </button>
              </div>

              {/* Activity Timeline */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-display">Activity & Audit Timeline</h4>
                <div className="space-y-4 border-l-2 border-slate-800 pl-4">
                  {selectedLead.activities?.map((act) => (
                    <div key={act.id} className="relative">
                      <div className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="text-xs font-bold text-white">{act.title}</div>
                      <div className="text-[11px] text-slate-400">{act.details}</div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">{new Date(act.created_at).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL ADD LEAD MODAL */}
      {isAddModalOpen && (
        <AddLeadModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={(newLead) => {
            fetchLeads();
            setSelectedLead(newLead);
          }}
          onSelectExisting={(leadId) => {
            leadService.getLeadById(leadId).then(l => {
              if (l) setSelectedLead(l);
            });
          }}
        />
      )}

      {/* CSV IMPORT WIZARD MODAL */}
      {isImportModalOpen && (
        <CSVImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => fetchLeads()}
        />
      )}

      {/* COMMUNICATION DRAWER SLIDE-OVER */}
      <CommunicationDrawer
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState({ ...drawerState, isOpen: false })}
        contactName={drawerState.contactName}
        phone={drawerState.phone}
        email={drawerState.email}
        contactId={drawerState.contactId}
        initialChannel={drawerState.initialChannel}
        initialTab={drawerState.initialTab}
      />
    </div>
  );
};
