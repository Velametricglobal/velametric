-- ============================================================================
-- VELAMETRIC GLOBAL ENTERPRISE BACKEND SCHEMA & PRODUCTION MIGRATION
-- PostgreSQL 15+ / Supabase Native Auth, RLS, Storage & Triggers
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. REUSABLE UTILITIES & TRIGGER FUNCTIONS
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 2. MULTI-TENANT COMPANIES & BRANDING DESIGN SYSTEM
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    legal_name TEXT,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    dark_logo_url TEXT,
    favicon_url TEXT,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    website TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    pincode TEXT,
    gst_number TEXT,
    pan_number TEXT,
    tagline TEXT,
    description TEXT,
    primary_color TEXT DEFAULT '#4f6bf6',
    secondary_color TEXT DEFAULT '#0f172a',
    accent_color TEXT DEFAULT '#f59e0b',
    font_family TEXT DEFAULT 'Outfit',
    currency TEXT DEFAULT 'INR',
    timezone TEXT DEFAULT 'Asia/Kolkata',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.company_branding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE UNIQUE NOT NULL,
    logo_url TEXT,
    dark_logo_url TEXT,
    favicon_url TEXT,
    primary_color TEXT DEFAULT '#4f6bf6',
    secondary_color TEXT DEFAULT '#0f172a',
    accent_color TEXT DEFAULT '#f59e0b',
    background_color TEXT DEFAULT '#090d16',
    text_color TEXT DEFAULT '#f8fafc',
    heading_font TEXT DEFAULT 'Outfit',
    body_font TEXT DEFAULT 'Plus Jakarta Sans',
    button_style TEXT DEFAULT 'gradient', -- gradient, solid, outline
    border_radius TEXT DEFAULT '12px',
    custom_css TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_company_branding_updated_at
BEFORE UPDATE ON public.company_branding
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Site Background Media & Audio Settings
CREATE TABLE IF NOT EXISTS public.site_media_settings (
    company_id UUID PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
    background_music_url TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    volume NUMERIC(3,2) DEFAULT 0.50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. PROFILES, ROLES & ROLE-BASED ACCESS CONTROL (RBAC)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- super_admin, admin, manager, sales, marketing, finance, crm_staff, content_manager, event_manager, document_manager, user
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    role TEXT REFERENCES public.roles(name) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    role TEXT REFERENCES public.roles(name) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, company_id, role)
);

-- Automatic Profile Creation Trigger on Auth.Users SignUp
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_comp_id UUID;
BEGIN
    SELECT id INTO default_comp_id FROM public.companies WHERE is_active = TRUE ORDER BY created_at ASC LIMIT 1;

    INSERT INTO public.profiles (id, email, full_name, avatar_url, company_id, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        default_comp_id,
        'user'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW();

    -- Create default user_role record
    INSERT INTO public.user_roles (user_id, company_id, role)
    VALUES (NEW.id, default_comp_id, 'user')
    ON CONFLICT DO NOTHING;

    -- Create initial storage_usage record
    INSERT INTO public.storage_usage (user_id, company_id, storage_used_bytes, storage_limit_bytes)
    VALUES (NEW.id, default_comp_id, 0, 104857600) -- 100MB default free tier
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RBAC & Multi-Tenant Helper Functions
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT company_id FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (role = required_role OR role = 'super_admin')
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 4. STORAGE USAGE & QUOTAS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.storage_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    storage_used_bytes BIGINT DEFAULT 0,
    storage_limit_bytes BIGINT DEFAULT 104857600, -- 100MB Default (5GB for Paid)
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, company_id)
);

CREATE TRIGGER set_storage_usage_updated_at
BEFORE UPDATE ON public.storage_usage
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 5. CRM, LEADS, FOLLOW-UPS & COMMUNICATION LOGS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    company_name TEXT,
    source TEXT DEFAULT 'Website',
    service_interest TEXT,
    status TEXT DEFAULT 'new', -- new, contacted, qualified, proposal, negotiation, won, lost, follow_up
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    notes TEXT,
    estimated_value NUMERIC(14,2) DEFAULT 0.00,
    next_followup_at TIMESTAMPTZ,
    last_contacted_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TRIGGER set_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.lead_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- call, whatsapp, email, sms, meeting, manual, automatic
    message TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending', -- pending, completed, skipped, cancelled
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    channel TEXT NOT NULL, -- whatsapp, call, email, sms, internal
    direction TEXT NOT NULL, -- inbound, outbound
    message TEXT NOT NULL,
    status TEXT DEFAULT 'sent', -- pending, sent, delivered, failed
    external_message_id TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    campaign_type TEXT NOT NULL, -- whatsapp, email, social, sms, promotion, event
    description TEXT,
    status TEXT DEFAULT 'draft', -- draft, scheduled, running, completed, paused
    scheduled_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.campaign_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, sent, delivered, opened, failed
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    error_message TEXT,
    PRIMARY KEY (campaign_id, lead_id)
);

CREATE TABLE IF NOT EXISTS public.promotional_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    media_type TEXT NOT NULL, -- video, image, reel
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lead_imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    filename TEXT NOT NULL,
    total_rows INT DEFAULT 0,
    successful_rows INT DEFAULT 0,
    failed_rows INT DEFAULT 0,
    status TEXT DEFAULT 'completed', -- processing, completed, failed
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. SERVICES CMS & PACKAGES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, slug)
);

CREATE TRIGGER set_service_categories_updated_at
BEFORE UPDATE ON public.service_categories
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    icon TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, slug)
);

CREATE TRIGGER set_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- Startup, Enterprise, Organization
    slug TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'INR',
    billing_period TEXT DEFAULT 'one_time', -- one_time, monthly, yearly
    features JSONB DEFAULT '[]'::jsonb,
    is_contact_for_quote BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_service_packages_updated_at
BEFORE UPDATE ON public.service_packages
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 7. PORTFOLIO, CASE STUDIES & INDEPENDENT TESTIMONIALS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    category TEXT,
    short_description TEXT,
    description TEXT,
    client_name TEXT,
    industry TEXT,
    featured_image TEXT,
    website_url TEXT,
    project_url TEXT,
    completion_date DATE,
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, slug)
);

CREATE TRIGGER set_portfolio_projects_updated_at
BEFORE UPDATE ON public.portfolio_projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.portfolio_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE NOT NULL,
    media_type TEXT NOT NULL, -- image, video, document
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    title TEXT,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE UNIQUE NOT NULL,
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    strategy TEXT,
    results TEXT NOT NULL,
    metrics JSONB DEFAULT '[]'::jsonb,
    testimonial TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_case_studies_updated_at
BEFORE UPDATE ON public.case_studies
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Separate Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    company_name TEXT,
    designation TEXT,
    photo_url TEXT,
    rating INT DEFAULT 5,
    text TEXT NOT NULL,
    video_url TEXT,
    thumbnail_url TEXT,
    is_video BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 8. EVENTS & REGISTRATIONS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    event_date DATE NOT NULL,
    start_time TEXT,
    end_time TEXT,
    venue TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    cover_image TEXT,
    background_video_url TEXT,
    ticket_url TEXT,
    registration_url TEXT,
    status TEXT DEFAULT 'upcoming', -- upcoming, ongoing, completed, cancelled
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, slug)
);

CREATE TRIGGER set_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.event_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    media_type TEXT NOT NULL, -- image, video, poster, reel
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    title TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT,
    registration_status TEXT DEFAULT 'confirmed', -- confirmed, waitlist, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. WEBSITE CMS & PAGE BUILDER
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    page_type TEXT DEFAULT 'standard', -- standard, landing, legal
    content TEXT,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, slug)
);

CREATE TRIGGER set_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
    section_type TEXT NOT NULL, -- hero, hero_3d, rich_text, video, services, portfolio, case_study, testimonial, contact, enquiry, pricing, events, cta, faq, custom
    title TEXT,
    subtitle TEXT,
    content JSONB DEFAULT '{}'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb,
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_page_sections_updated_at
BEFORE UPDATE ON public.page_sections
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Public Contact / Inquiries Form
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    source TEXT DEFAULT 'Contact Page',
    status TEXT DEFAULT 'new', -- new, contacted, qualified, converted, closed, spam
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_inquiries_updated_at
BEFORE UPDATE ON public.inquiries
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 10. DOCUMENT GENERATOR & TEMPLATES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- INVOICE, QUOTATION, PO, RECEIPT, ESTIMATE
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type_id UUID REFERENCES public.document_types(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    html_template TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_company_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TRIGGER set_user_company_profiles_updated_at
BEFORE UPDATE ON public.user_company_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL, -- invoice, quotation, purchase_order, receipt, estimate
    document_number TEXT NOT NULL,
    status TEXT DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    client_address TEXT,
    subtotal NUMERIC(14,2) DEFAULT 0.00,
    discount NUMERIC(14,2) DEFAULT 0.00,
    tax NUMERIC(14,2) DEFAULT 0.00,
    total NUMERIC(14,2) DEFAULT 0.00,
    advance_paid NUMERIC(14,2) DEFAULT 0.00,
    balance_due NUMERIC(14,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'INR',
    notes TEXT,
    terms TEXT,
    logo_url TEXT,
    font_family TEXT DEFAULT 'Inter',
    primary_color TEXT DEFAULT '#4f6bf6',
    secondary_color TEXT DEFAULT '#0f172a',
    template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL,
    preview_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_free_tier BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Alias view/table for frontend compatibility
CREATE TABLE IF NOT EXISTS public.generated_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    document_type_code TEXT NOT NULL,
    template_id UUID REFERENCES public.document_templates(id),
    document_number TEXT NOT NULL,
    client_name TEXT,
    total_amount NUMERIC(14,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'INR',
    document_data JSONB NOT NULL,
    pdf_url TEXT,
    is_free_tier BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_generated_documents_updated_at
BEFORE UPDATE ON public.generated_documents
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.document_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    quantity NUMERIC(10,2) DEFAULT 1,
    unit TEXT DEFAULT 'pcs',
    unit_price NUMERIC(14,2) DEFAULT 0.00,
    discount NUMERIC(14,2) DEFAULT 0.00,
    tax NUMERIC(14,2) DEFAULT 0.00,
    total NUMERIC(14,2) DEFAULT 0.00,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.document_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT DEFAULT 'pdf',
    version INT DEFAULT 1,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. SUBSCRIPTIONS, ₹250 PLAN & PAYMENTS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    billing_period TEXT DEFAULT 'monthly', -- monthly, yearly
    storage_days INT DEFAULT 3650, -- 10 years / permanent
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active', -- trialing, active, past_due, cancelled, expired
    provider TEXT DEFAULT 'Razorpay', -- Razorpay, Cashfree, Stripe
    provider_subscription_id TEXT,
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TRIGGER set_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    provider TEXT NOT NULL, -- Razorpay, Cashfree, Manual
    transaction_id TEXT UNIQUE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'paid', -- pending, paid, failed, refunded
    payment_method TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. AUDIT LOGGING & NOTIFICATIONS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, EXPORT, PUBLISH
    entity_type TEXT NOT NULL, -- lead, document, payment, company, role
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 13. AUTOMATIC DOCUMENT RETENTION CLEANUP FUNCTION
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.clean_expired_documents()
RETURNS INT AS $$
DECLARE
    deleted_count INT;
BEGIN
    DELETE FROM public.generated_documents 
    WHERE is_free_tier = TRUE 
    AND expires_at IS NOT NULL 
    AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ----------------------------------------------------------------------------
-- 14. PERFORMANCE INDEXES
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_company ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_leads_company_status ON public.leads(company_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_followup ON public.leads(next_followup_at);
CREATE INDEX IF NOT EXISTS idx_followups_scheduled ON public.lead_followups(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_comm_logs_lead ON public.communication_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_services_company ON public.services(company_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_company ON public.portfolio_projects(company_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_documents_user ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_expires ON public.documents(expires_at);
CREATE INDEX IF NOT EXISTS idx_gen_docs_user ON public.generated_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at);

-- ----------------------------------------------------------------------------
-- 15. ROW LEVEL SECURITY (RLS) POLICIES — 100% COVERAGE
-- ----------------------------------------------------------------------------

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_media_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotional_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public Read Companies" ON public.companies FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public Read Branding" ON public.company_branding FOR SELECT USING (true);
CREATE POLICY "Public Read Site Media" ON public.site_media_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Service Categories" ON public.service_categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public Read Service Packages" ON public.service_packages FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public Read Portfolio" ON public.portfolio_projects FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public Read Portfolio Media" ON public.portfolio_media FOR SELECT USING (true);
CREATE POLICY "Public Read Case Studies" ON public.case_studies FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public Read Event Media" ON public.event_media FOR SELECT USING (true);
CREATE POLICY "Public Read Pages" ON public.pages FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public Read Page Sections" ON public.page_sections FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "Public Read Document Types" ON public.document_types FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public Read Document Templates" ON public.document_templates FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public Read Subscription Plans" ON public.subscription_plans FOR SELECT USING (is_active = TRUE);

-- PUBLIC INSERT POLICIES (Contact, Leads, Registrations)
CREATE POLICY "Public Insert Leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Event Registrations" ON public.event_registrations FOR INSERT WITH CHECK (true);

-- USER PROFILE & TENANT ISOLATION POLICIES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.has_role('admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own company profile" ON public.user_company_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own company profile" ON public.user_company_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id OR public.has_role('admin'));
CREATE POLICY "Users can manage own documents" ON public.documents FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own generated documents" ON public.generated_documents FOR SELECT USING (auth.uid() = user_id OR public.has_role('admin'));
CREATE POLICY "Users can manage own generated documents" ON public.generated_documents FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own document items" ON public.document_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.documents WHERE documents.id = document_items.document_id AND (documents.user_id = auth.uid() OR public.has_role('admin')))
);
CREATE POLICY "Users can manage own document items" ON public.document_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.documents WHERE documents.id = document_items.document_id AND documents.user_id = auth.uid())
);

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id OR public.has_role('admin'));
CREATE POLICY "Users can view own user_subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id OR public.has_role('admin'));
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id OR public.has_role('admin'));
CREATE POLICY "Users can view own storage" ON public.storage_usage FOR SELECT USING (auth.uid() = user_id OR public.has_role('admin'));
CREATE POLICY "Users can view own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ADMIN & STAFF TENANT POLICIES (CRM, CMS, Campaigns, Audit)
CREATE POLICY "Staff Manage Leads" ON public.leads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff Manage Followups" ON public.lead_followups FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff Manage Communication" ON public.communication_logs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff Manage Campaigns" ON public.campaigns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff Manage Campaign Recipients" ON public.campaign_recipients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff Manage Promotional Media" ON public.promotional_media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff Manage Lead Imports" ON public.lead_imports FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Services" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Service Categories" ON public.service_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Service Packages" ON public.service_packages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Portfolio" ON public.portfolio_projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Portfolio Media" ON public.portfolio_media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Case Studies" ON public.case_studies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Events" ON public.events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Event Media" ON public.event_media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Event Registrations" ON public.event_registrations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Pages" ON public.pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Page Sections" ON public.page_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Inquiries" ON public.inquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Manage Companies" ON public.companies FOR ALL USING (public.has_role('admin'));
CREATE POLICY "Admin Manage Company Branding" ON public.company_branding FOR ALL USING (public.has_role('admin'));
CREATE POLICY "Admin Manage Site Media" ON public.site_media_settings FOR ALL USING (public.has_role('admin'));
CREATE POLICY "Admin Manage Audit Logs" ON public.audit_logs FOR SELECT USING (public.has_role('admin'));

-- ----------------------------------------------------------------------------
-- 16. SEED ESSENTIAL ROLES, SUBSCRIPTION PLANS & DOCUMENT TYPES
-- ----------------------------------------------------------------------------

INSERT INTO public.roles (name, description) VALUES
('super_admin', 'Full system control across all tenants'),
('admin', 'Company Administrator'),
('manager', 'Branch/Operations Manager'),
('sales', 'Sales Executive & Lead Manager'),
('marketing', 'Marketing & Campaign Manager'),
('finance', 'Financial Consultant & Invoices'),
('crm_staff', 'CRM Support & Communication Staff'),
('content_manager', 'Website & CMS Content Editor'),
('event_manager', 'Event Coordinator'),
('document_manager', 'Document Generator Operations'),
('user', 'Standard Public Platform User')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.subscription_plans (name, description, price, currency, billing_period, storage_days, features) VALUES
(
    'Extended Storage & Customization',
    'Full branding presets, saved templates, Google Fonts, and permanent document storage.',
    250.00,
    'INR',
    'monthly',
    3650,
    '["extended_storage", "saved_branding_presets", "logo_library", "google_fonts", "multiple_templates", "priority_support"]'::jsonb
)
ON CONFLICT DO NOTHING;

INSERT INTO public.document_types (code, name, description) VALUES
('INVOICE', 'Tax Invoice', 'Official tax invoice with GST, discounts, and payment terms.'),
('QUOTATION', 'Quotation / Estimate', 'Professional quotation and proposal for clients.'),
('PO', 'Purchase Order', 'Official purchase order for vendors and procurement.'),
('RECEIPT', 'Payment Receipt', 'Formal payment acknowledgement receipt.'),
('ESTIMATE', 'Work Estimate', 'Preliminary work estimate and pricing projection.')
ON CONFLICT (code) DO NOTHING;

-- Seed Default Company
INSERT INTO public.companies (name, legal_name, slug, email, phone, website, tagline, description, primary_color, secondary_color, accent_color, font_family)
VALUES (
    'Velametric Global',
    'Velametric Global Private Limited',
    'velametric-global',
    'contact@velametric.com',
    '+91 98765 43210',
    'https://velametric.com',
    'Empowering Businesses with Cutting-Edge Digital & Financial Solutions',
    'Velametric Global is a premier provider of Web & App Development, Digital Marketing, Media PR, Event Management, and Financial Consultancy.',
    '#4f6bf6',
    '#0f172a',
    '#f59e0b',
    'Outfit'
)
ON CONFLICT (slug) DO NOTHING;
