import React, { useEffect, useState } from 'react';
import { leadService } from '../../services/leadService';
import { crmService } from '../../services/crmService';
import { proposalInvoiceService } from '../../services/proposalInvoiceService';
import { Lead, Deal, FollowUpTask, Invoice } from '../../types/database.types';
import { Users, DollarSign, Clock, TrendingUp, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useCurrency } from '../../context/CurrencyContext';

export const Dashboard: React.FC = () => {
  const { formatAmount } = useCurrency();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpTask[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    leadService.getLeads().then(setLeads);
    crmService.getDeals().then(setDeals);
    crmService.getFollowUps().then(setFollowUps);
    proposalInvoiceService.getInvoices().then(setInvoices);
  }, []);

  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.total, 0);
  const pendingInvoices = invoices.filter(i => i.status !== 'PAID').reduce((sum, i) => sum + i.total, 0);
  const openDealsValue = deals.filter(d => d.status === 'OPEN').reduce((sum, d) => sum + d.value, 0);
  const pendingFollowUps = followUps.filter(f => f.status === 'PENDING');

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold text-white">Executive Control Dashboard</h2>
          <p className="text-slate-400 text-xs mt-1">Real-time telemetry across lead generation, CRM pipelines, follow-ups, and financial collections.</p>
        </div>
        <Link
          to="/admin/homepage-builder"
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-all shadow-lg shadow-brand-500/20"
        >
          Open Visual Builder
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Inquiries</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-black text-white">{leads.length}</div>
          <div className="text-[11px] text-emerald-400 mt-2 font-medium">↑ +14% vs last week</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase">Pipeline Value</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-white">{formatAmount(openDealsValue)}</div>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">{deals.length} active deals in pipeline</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase">Revenue Collected</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><DollarSign className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-white">{formatAmount(totalRevenue)}</div>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">{formatAmount(pendingInvoices)} pending receivables</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase">Pending Tasks</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><Clock className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-black text-white">{pendingFollowUps.length}</div>
          <div className="text-[11px] text-rose-400 mt-2 font-medium">Immediate action required</div>
        </div>
      </div>

      {/* Main Grid: Recent Leads & Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-white">Recent Website Inquiries</h3>
            <Link to="/admin/leads" className="text-xs font-semibold text-brand-400 hover:text-brand-300">View All Leads →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase bg-slate-950/60">
                <tr>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Budget</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">
                      {l.first_name} {l.last_name}
                      <span className="block text-[10px] text-slate-400 font-normal">{l.company_name}</span>
                    </td>
                    <td className="p-3 text-slate-300">{l.service_interest}</td>
                    <td className="p-3 text-slate-300">{l.budget_range}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        {l.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link to="/admin/leads" className="text-brand-400 hover:underline">Manage</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Due Follow-ups List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-6">Due Follow-ups</h3>
          <div className="space-y-4">
            {pendingFollowUps.map((task) => (
              <div key={task.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{task.lead_name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Overdue
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">{task.title}</p>
                <div className="text-[10px] text-slate-500">Assigned: {task.assigned_to || 'Sales Team'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
