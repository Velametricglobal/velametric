import React, { useState, useEffect } from 'react';
import { MessageCircle, Mail, Phone, Clock, Search, Filter, Plus, CheckCircle2, ShieldAlert, Sparkles, Send, FileText, Zap, ShieldCheck } from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { CommunicationActivity, MessageTemplate, WhatsAppTemplate, CommunicationChannel } from '../../types/database.types';

export const CommunicationCenterAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TIMELINE' | 'TEMPLATES' | 'AUTOMATIONS' | 'CONSENT'>('TIMELINE');
  const [activities, setActivities] = useState<CommunicationActivity[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [waTemplates, setWaTemplates] = useState<WhatsAppTemplate[]>([]);
  const [channelFilter, setChannelFilter] = useState<string>('ALL');

  useEffect(() => {
    communicationService.getActivities().then(setActivities);
    communicationService.getTemplates().then(setTemplates);
    communicationService.getWhatsAppTemplates().then(setWaTemplates);
  }, []);

  const filteredActivities = activities.filter(act => {
    if (channelFilter === 'ALL') return true;
    return act.channel === channelFilter;
  });

  return (
    <div className="space-y-8 text-xs text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <MessageCircle className="w-3.5 h-3.5" /> Omnichannel Communication Hub
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-2 font-display uppercase">
            Communication Center & Messaging Engine
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage WhatsApp Business, Email, SMS, call logs, templates, automation rules, and consent preferences.
          </p>
        </div>

        {/* TAB SELECTOR */}
        <div className="flex flex-wrap gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'TIMELINE' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Communication History ({activities.length})
          </button>
          <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'TEMPLATES' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Message Templates
          </button>
          <button
            onClick={() => setActiveTab('AUTOMATIONS')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'AUTOMATIONS' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Automation Sequences
          </button>
          <button
            onClick={() => setActiveTab('CONSENT')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'CONSENT' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Opt-in & Consent
          </button>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Messages Sent Today <MessageCircle className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">142</div>
          <div className="text-[11px] text-emerald-400 font-medium">98.2% Delivery Rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Active WhatsApp Templates <FileText className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-brand-400 font-display">8</div>
          <div className="text-[11px] text-slate-400 font-medium">Meta Approved</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Automated Sequences <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-display">5</div>
          <div className="text-[11px] text-slate-400 font-medium">Live Triggers Active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Marketing Opt-In Rate <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 font-display">94.8%</div>
          <div className="text-[11px] text-slate-400 font-medium">GDPR & TRAI Compliant</div>
        </div>
      </div>

      {/* TAB 1: COMMUNICATION TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white font-display">Communication Timeline & History</h2>

            <div className="flex items-center gap-2">
              {['ALL', 'WHATSAPP', 'EMAIL', 'SMS', 'CALL'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannelFilter(ch)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    channelFilter === ch ? 'bg-brand-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredActivities.map((act) => (
              <div key={act.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono border ${
                      act.channel === 'WHATSAPP' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      act.channel === 'CALL' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      'bg-brand-500/20 text-brand-300 border-brand-500/30'
                    }`}>
                      {act.channel}
                    </span>
                    <span className="font-bold text-white">{act.contact_name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({act.recipient_phone_email})</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 rounded text-slate-400 border border-slate-800">
                      {act.mode}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">
                    {act.message_body}
                  </p>

                  {act.reel_title && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px]">
                      🎬 Attached Reel: {act.reel_title}
                    </div>
                  )}
                </div>

                <div className="text-right space-y-1 shrink-0">
                  <div className="text-[11px] text-slate-400">{new Date(act.created_at).toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Sender: {act.sender_name}</div>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ✓ {act.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MESSAGE & WHATSAPP TEMPLATES */}
      {activeTab === 'TEMPLATES' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-white font-display">WhatsApp Official Meta Business Templates</h2>
                <p className="text-slate-400 text-xs">Manage pre-approved WhatsApp Business API message templates.</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create WhatsApp Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {waTemplates.map(wa => (
                <div key={wa.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-amber-400">{wa.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                      ● {wa.approval_status}
                    </span>
                  </div>
                  {wa.header_text && <div className="font-bold text-white text-xs">{wa.header_text}</div>}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 text-xs font-mono leading-relaxed">
                    {wa.body_text}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Variables: {wa.variables.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUTOMATION SEQUENCES */}
      {activeTab === 'AUTOMATIONS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white font-display">Automated Follow-up Sequences & Rules</h2>
              <p className="text-slate-400 text-xs">Configure automated trigger-based communication workflows.</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Rule
            </button>
          </div>

          <div className="space-y-4">
            {[
              { trigger: 'WHEN: New Website Enquiry Received', action: 'THEN: Send Immediate WhatsApp Welcome Template', wait: 'WAIT: 1 Day', follow: 'THEN: Create Follow-up Task for Sales Agent' },
              { trigger: 'WHEN: Event Registration Confirmed', action: 'THEN: Send WhatsApp Pass QR Code', wait: 'WAIT: 3 Days Before Event', follow: 'THEN: Send Venue Reminder Notification' }
            ].map((rule, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2 font-mono">
                <div className="text-amber-400 font-bold">{rule.trigger}</div>
                <div className="text-white">{rule.action}</div>
                <div className="text-slate-400">{rule.wait}</div>
                <div className="text-emerald-400">{rule.follow}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONSENT & PREFERENCES */}
      {activeTab === 'CONSENT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white font-display">Marketing Consent & Opt-In Preferences</h2>
          <p className="text-slate-400 text-xs">Ensure strict compliance by respecting recipient opt-out choices.</p>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold">✓ Automated Opt-Out Filter Active</div>
            <p className="text-slate-400 text-xs">
              Contacts who reply STOP or disable WhatsApp/Email opt-in are automatically excluded from bulk marketing campaigns.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
