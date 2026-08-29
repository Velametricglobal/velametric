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
    // Here we'll mock some data for the dashboard.
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
    <>
      <div className="p-6 space-y-6">
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-text">Analytics Overview</h2>
            <p className="text-muted">Metrics for the Public Document Generator tool.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted font-bold tracking-wider uppercase">Total Generated</p>
              <h3 className="text-2xl font-black text-text">{stats.totalDocs.toLocaleString()}</h3>
            </div>
          </div>
          
          <div className="bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted font-bold tracking-wider uppercase">Free Users</p>
              <h3 className="text-2xl font-black text-text">{stats.freeUsers.toLocaleString()}</h3>
            </div>
          </div>
          
          <div className="bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted font-bold tracking-wider uppercase">Paid Subscribers</p>
              <h3 className="text-2xl font-black text-text">{stats.paidUsers.toLocaleString()}</h3>
            </div>
          </div>
          
          <div className="bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted font-bold tracking-wider uppercase">Monthly MRR</p>
              <h3 className="text-2xl font-black text-text">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Placeholder for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-surface border border-border p-6 rounded-xl h-96 flex flex-col items-center justify-center text-muted">
            <BarChart className="w-12 h-12 mb-4 opacity-50" />
            <p>Document Generation Volume (Last 30 Days)</p>
          </div>
          <div className="bg-surface border border-border p-6 rounded-xl h-96 flex flex-col items-center justify-center text-muted">
            <Activity className="w-12 h-12 mb-4 opacity-50" />
            <p>Conversion Rate to Paid</p>
          </div>
        </div>

      </div>
    </>
  );
};

export default DocumentAnalytics;
