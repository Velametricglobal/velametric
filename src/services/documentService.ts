import { supabase } from '../lib/supabase';
import { 
  GeneratedDocument, 
  DocumentTemplate, 
  UserCompanyProfile, 
  DocumentTypeCode,
  DocumentDataPayload
} from '../types/document.types';

export const DocumentService = {
  // ------------------------------------------------------------------------
  // COMPANY PROFILE
  // ------------------------------------------------------------------------
  async getCompanyProfile(userId: string): Promise<UserCompanyProfile | null> {
    const { data, error } = await supabase
      .from('user_company_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching company profile:', error);
      throw error;
    }
    return data;
  },

  async upsertCompanyProfile(profile: Partial<UserCompanyProfile>): Promise<UserCompanyProfile> {
    const { data, error } = await supabase
      .from('user_company_profiles')
      .upsert(profile, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Error upserting company profile:', error);
      throw error;
    }
    return data;
  },

  // ------------------------------------------------------------------------
  // TEMPLATES
  // ------------------------------------------------------------------------
  async getTemplates(typeCode?: DocumentTypeCode): Promise<DocumentTemplate[]> {
    let query = supabase
      .from('document_templates')
      .select('*, document_types!inner(code)')
      .eq('is_active', true);

    if (typeCode) {
      query = query.eq('document_types.code', typeCode);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
    return data as any[];
  },

  // ------------------------------------------------------------------------
  // GENERATED DOCUMENTS
  // ------------------------------------------------------------------------
  async saveDocument(doc: Partial<GeneratedDocument>): Promise<GeneratedDocument> {
    // If it's a free tier document, set expiry to 7 days from now
    if (doc.is_free_tier !== false) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      doc.expires_at = expiresAt.toISOString();
      doc.is_free_tier = true;
    }

    const { data, error } = await supabase
      .from('generated_documents')
      .insert([doc])
      .select()
      .single();

    if (error) {
      console.error('Error saving document:', error);
      throw error;
    }
    return data;
  },

  async getUserDocuments(userId: string): Promise<GeneratedDocument[]> {
    const { data, error } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user documents:', error);
      throw error;
    }
    return data;
  },

  async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('generated_documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // ------------------------------------------------------------------------
  // STORAGE
  // ------------------------------------------------------------------------
  async uploadDocumentPDF(userId: string, file: Blob, fileName: string): Promise<string> {
    const filePath = `${userId}/${fileName}`;
    const { data, error } = await supabase.storage
      .from('generated-documents')
      .upload(filePath, file, { upsert: true, contentType: 'application/pdf' });

    if (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
    return data.path;
  },

  async getDocumentSignedUrl(path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('generated-documents')
      .createSignedUrl(path, 60 * 60); // 1 hour

    if (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
    return data.signedUrl;
  },
  
  // ------------------------------------------------------------------------
  // UTILITIES
  // ------------------------------------------------------------------------
  generateDocumentNumber(typeCode: string): string {
    const prefix = typeCode.substring(0, 3).toUpperCase();
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${year}${month}-${random}`;
  },
  
  calculateDocumentTotals(payload: DocumentDataPayload): DocumentDataPayload {
    let subtotal = 0;
    let total_tax = 0;
    let total_discount = 0;

    const items = payload.items.map(item => {
      const lineTotal = item.quantity * item.unit_price;
      const discount = item.discount_percentage ? (lineTotal * item.discount_percentage / 100) : 0;
      const taxableAmount = lineTotal - discount;
      const tax = item.tax_percentage ? (taxableAmount * item.tax_percentage / 100) : 0;
      
      subtotal += lineTotal;
      total_discount += discount;
      total_tax += tax;

      return {
        ...item,
        total: taxableAmount + tax
      };
    });

    const grand_total = subtotal - total_discount + total_tax;
    const advance_paid = payload.advance_paid || 0;
    const balance_due = Math.max(0, grand_total - advance_paid);

    return {
      ...payload,
      items,
      subtotal,
      total_tax,
      total_discount,
      grand_total,
      advance_paid,
      balance_due
    };
  }
};
