import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Trash2, Clock, Plus, Zap, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DocumentService } from '../../services/documentService';
import { GeneratedDocument } from '../../types/document.types';

import { supabase } from '../../lib/supabase';

const MyDocuments: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        loadDocuments(user.id);
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const loadDocuments = async (uid: string) => {
    try {
      setLoading(true);
      const docs = await DocumentService.getUserDocuments(uid);
      setDocuments(docs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await DocumentService.deleteDocument(id);
      setDocuments(docs => docs.filter(d => d.id !== id));
    } catch (error) {
      alert('Failed to delete document');
    }
  };

  const getDaysRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text">Generated Documents</h1>
            <p className="text-muted">Manage your invoices, quotations, and POs.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/tools/document-generator/wizard')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" /> New Document
            </button>
            <button 
              onClick={() => navigate('/account/subscription')}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors shadow-glow"
            >
              <Zap className="w-4 h-4" /> Upgrade Storage
            </button>
          </div>
        </div>

        {/* Free Tier Warning (if they have expiring docs) */}
        {documents.some(d => d.is_free_tier) && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <h3 className="text-amber-500 font-bold">Free Tier Storage Notice</h3>
              <p className="text-amber-500/80 text-sm mt-1">
                You have documents on the 7-day free retention plan. They will be automatically deleted when they expire. 
                Upgrade to Extended Storage (₹250/mo) to keep them permanently.
              </p>
            </div>
          </div>
        )}

        {/* Documents Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-xl border border-border">
            <FileText className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-text mb-2">No Documents Yet</h3>
            <p className="text-muted mb-6">Create your first professional document in seconds.</p>
            <button 
              onClick={() => navigate('/tools/document-generator/wizard')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Start Generating
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <motion.div 
                key={doc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface border border-border rounded-xl p-5 hover:border-primary/50 transition-colors flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-md text-xs font-bold tracking-wider">
                    {doc.document_type_code}
                  </div>
                  {doc.is_free_tier && doc.expires_at && (
                    <div className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3" />
                      {getDaysRemaining(doc.expires_at)} days left
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-text truncate mb-1">
                  {doc.document_number}
                </h3>
                <p className="text-sm text-muted mb-4 truncate">
                  To: {doc.client_name || 'Unknown Client'}
                </p>
                
                <div className="text-2xl font-black text-text mb-6">
                  {doc.currency === 'INR' ? '₹' : doc.currency} {doc.total_amount.toLocaleString()}
                </div>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyDocuments;
