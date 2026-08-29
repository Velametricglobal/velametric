// ============================================================================
// TYPE DEFINITIONS FOR DOCUMENT GENERATOR
// ============================================================================

export type DocumentTypeCode = 'INVOICE' | 'QUOTATION' | 'PO' | 'RECEIPT';

export interface UserCompanyProfile {
  id: string;
  user_id: string;
  company_name: string;
  business_type?: string;
  logo_url?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  website?: string;
  gstin?: string;
  pan?: string;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  upi_id?: string;
  authorized_signatory?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_type: 'FREE' | 'EXTENDED_STORAGE';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  price_per_month: number;
  next_billing_date?: string;
  payment_provider?: string;
  payment_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentType {
  id: string;
  code: DocumentTypeCode;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface DocumentTemplate {
  id: string;
  document_type_id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  html_template: string;
  is_premium: boolean;
  is_active: boolean;
  created_at: string;
}

// Represents an item in an invoice/quotation
export interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  hsn_sac?: string;
  discount_percentage?: number;
  tax_percentage?: number;
  total: number; // calculated: (qty * price) - discount + tax
}

// The JSON structure stored in generated_documents.document_data
export interface DocumentCustomization {
  font_family: string;
  font_weight: 'normal' | 'medium' | 'semibold' | 'bold';
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  header_layout: 'logo-left' | 'logo-center' | 'logo-right' | 'logo-info';
  logo_size: 'small' | 'medium' | 'large';
  show_qr: boolean;
  signature_url?: string;
}

export interface PaymentInformation {
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  ifsc_code?: string;
  branch?: string;
  upi_id?: string;
}

export interface BrandingPreset {
  id: string;
  user_id: string;
  name: string;
  is_default: boolean;
  customization: DocumentCustomization;
  created_at: string;
}

export interface DocumentDataPayload {
  company_details: Partial<UserCompanyProfile>;
  client_details: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    gstin?: string;
  };
  items: DocumentItem[];
  subtotal: number;
  total_tax: number;
  total_discount: number;
  grand_total: number;
  advance_paid?: number;
  balance_due?: number;
  notes?: string;
  terms?: string;
  issue_date: string;
  due_date?: string;
  customization: DocumentCustomization;
  payment_details: PaymentInformation;
}

export interface GeneratedDocument {
  id: string;
  user_id: string;
  document_type_code: DocumentTypeCode;
  template_id?: string;
  document_number: string;
  client_name?: string;
  total_amount: number;
  currency: string;
  document_data: DocumentDataPayload;
  pdf_url?: string;
  is_free_tier: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}
