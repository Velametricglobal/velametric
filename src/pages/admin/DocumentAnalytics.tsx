import React, { useState, useEffect } from 'react';
import { BarChart, Users, FileText, IndianRupee, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const DocumentAnalytics: React.FC = () => {
  const [stats, setStats] = useState({
    totalDocs: 0,
    freeUsers: 0,
    paidUsers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // In a real implementation, you would fetch these from a Supabase RPC or aggregating queries.
    const fetchStats = async () => {
      setStats({
        totalDocs: 1450,
        freeUsers: 850,
        paidUsers: 45,
        totalRevenue: 45 * 250 // ₹11,250
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">Document Generator Analytics Overview</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Real-time usage metrics and revenue tracking for the Public Document Generator tool.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase">Total Generated</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">{stats.totalDocs.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase">Free Users</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">{stats.freeUsers.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase">Paid Subscribers</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">{stats.paidUsers.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase">Monthly MRR</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">₹{stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Visual Analytics Chart Containers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl h-80 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm">
          <BarChart className="w-12 h-12 mb-3 opacity-40 text-brand-500" />
          <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Document Generation Volume (Last 30 Days)</p>
          <span className="text-xs text-slate-400 mt-1">Aggregated generation activity tracking</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl h-80 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm">
          <Activity className="w-12 h-12 mb-3 opacity-40 text-emerald-500" />
          <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Conversion Rate to Paid</p>
          <span className="text-xs text-slate-400 mt-1">5.3% Free-to-Paid upgrade ratio</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalytics;

