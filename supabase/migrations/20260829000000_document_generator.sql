-- ============================================================================
-- DOCUMENT GENERATOR SCHEMA (Free Tool + Extended Storage)
-- ============================================================================

-- 1. USER COMPANY PROFILES
CREATE TABLE IF NOT EXISTS public.user_company_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    business_type TEXT,
    logo_url TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pin_code TEXT,
    website TEXT,
    gstin TEXT,
    pan TEXT,
    bank_name TEXT,
    account_number TEXT,
    ifsc_code TEXT,
    upi_id TEXT,
    authorized_signatory TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    plan_type TEXT DEFAULT 'FREE', -- FREE, EXTENDED_STORAGE
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, PAST_DUE, CANCELLED, EXPIRED
    price_per_month NUMERIC DEFAULT 0,
    next_billing_date TIMESTAMPTZ,
    payment_provider TEXT,
    payment_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCUMENT TYPES
CREATE TABLE IF NOT EXISTS public.document_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- INVOICE, QUOTATION, PO, RECEIPT
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DOCUMENT TEMPLATES
CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_type_id UUID REFERENCES public.document_types(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    html_template TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GENERATED DOCUMENTS
CREATE TABLE IF NOT EXISTS public.generated_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    document_type_code TEXT NOT NULL,
    template_id UUID REFERENCES public.document_templates(id),
    document_number TEXT NOT NULL,
    client_name TEXT,
    total_amount NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'INR',
    document_data JSONB NOT NULL, -- The full JSON payload used to generate the document
    pdf_url TEXT, -- Path in Supabase Storage
    is_free_tier BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RLS POLICIES
ALTER TABLE public.user_company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- Allow users to view and edit their own company profile
CREATE POLICY "Users can view own company profile" ON public.user_company_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own company profile" ON public.user_company_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own company profile" ON public.user_company_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Document types and templates are readable by everyone
CREATE POLICY "Document types are viewable by everyone" ON public.document_types FOR SELECT USING (true);
CREATE POLICY "Document templates are viewable by everyone" ON public.document_templates FOR SELECT USING (true);

-- Allow users to manage their own generated documents
CREATE POLICY "Users can view own documents" ON public.generated_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.generated_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON public.generated_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.generated_documents FOR DELETE USING (auth.uid() = user_id);

-- Initial Data for Document Types
INSERT INTO public.document_types (code, name, description) VALUES
('INVOICE', 'Invoice', 'Standard tax invoice for products and services.'),
('QUOTATION', 'Quotation', 'Price estimate and proposal for clients.'),
('PO', 'Purchase Order', 'Official request to a vendor for goods or services.'),
('RECEIPT', 'Payment Receipt', 'Acknowledgement of payment received.')
ON CONFLICT (code) DO NOTHING;

-- Note: Supabase Storage bucket 'generated-documents' should be created manually or via Storage API.
-- RLS for Storage Bucket:
-- CREATE POLICY "Users can manage own document files" ON storage.objects
-- FOR ALL USING (bucket_id = 'generated-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
