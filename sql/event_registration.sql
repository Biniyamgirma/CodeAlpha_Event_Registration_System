DROP TYPE IF EXISTS registration_status CASCADE;
DROP TYPE IF EXISTS session_type CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS sponsor_level CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS email_status CASCADE;

CREATE TYPE registration_status AS ENUM (
    'pending',
    'confirmed',
    'cancelled',
    'waitlisted',
    'checked_in'
);

CREATE TYPE session_type AS ENUM (
    'keynote',
    'workshop',
    'panel',
    'breakout',
    'networking',
    'meal',
    'other'
);

CREATE TYPE invoice_status AS ENUM (
    'draft',
    'sent',
    'paid',
    'overdue',
    'cancelled'
);

CREATE TYPE payment_method AS ENUM (
    'credit_card',
    'bank_transfer',
    'paypal',
    'check',
    'cash',
    'cbe',
    'telebirr',
    'other'
);

CREATE TYPE payment_status AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);

CREATE TYPE sponsor_level AS ENUM (
    'platinum',
    'gold',
    'silver',
    'bronze',
    'other'
);

CREATE TYPE notification_type AS ENUM (
    'event',
    'payment',
    'system',
    'promotional'
);

CREATE TYPE email_status AS ENUM (
    'sent',
    'delivered',
    'opened',
    'clicked',
    'bounced',
    'failed'
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image_url VARCHAR(255),
    bio TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ,
    role VARCHAR(50)
);

CREATE TABLE event_organizers (
    organizer_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    company_name VARCHAR(100),
    job_title VARCHAR(100),
    contact_phone VARCHAR(20) NOT NULL,
    company_address TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INTEGER REFERENCES event_categories(category_id) ON DELETE SET NULL
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    organizer_id INTEGER NOT NULL REFERENCES event_organizers(organizer_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    location VARCHAR(255),
    venue_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    google_map_link VARCHAR(255),
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    online_event_url VARCHAR(255),
    event_image_url VARCHAR(255),
    max_attendees INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    registration_start TIMESTAMPTZ,
    registration_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_category_mapping (
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES event_categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, category_id)
);

CREATE TABLE tickets (
    ticket_id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    available_from TIMESTAMPTZ,
    available_until TIMESTAMPTZ,
    max_available INTEGER,
    current_available INTEGER,
    includes_lunch BOOLEAN NOT NULL DEFAULT FALSE,
    includes_dinner BOOLEAN NOT NULL DEFAULT FALSE,
    includes_materials BOOLEAN NOT NULL DEFAULT FALSE,
    seat_no VARCHAR(20)
);

CREATE TABLE discount_codes (
    discount_code_id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    max_uses INTEGER,
    current_uses INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by INTEGER REFERENCES event_organizers(organizer_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
    CHECK (discount_value > 0)
);

CREATE TABLE event_discount_codes (
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    discount_code_id INTEGER NOT NULL REFERENCES discount_codes(discount_code_id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, discount_code_id)
);

CREATE TABLE registrations (
    registration_id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    ticket_id INTEGER NOT NULL REFERENCES tickets(ticket_id) ON DELETE RESTRICT,
    registration_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status registration_status NOT NULL DEFAULT 'confirmed',
    payment_status invoice_status NOT NULL DEFAULT 'unpaid',
    discount_code_id INTEGER REFERENCES discount_codes(discount_code_id) ON DELETE SET NULL,
    notes TEXT,
    checked_in_at TIMESTAMPTZ,
    accessibility_requirements TEXT,
    ticket_qr_code TEXT
);

CREATE TABLE registration_additional_attendees (
    attendee_id SERIAL PRIMARY KEY,
    registration_id INTEGER NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    accessibility_requirements TEXT,
    ticket_qr_code TEXT
);

CREATE TABLE event_sessions (
    session_id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    location VARCHAR(255),
    max_attendees INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    session_type session_type NOT NULL,
    CHECK (end_datetime > start_datetime)
);

CREATE TABLE session_speakers (
    speaker_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    organization VARCHAR(100),
    job_title VARCHAR(100),
    bio TEXT,
    profile_image_url VARCHAR(255),
    website_url VARCHAR(255),
    twitter_handle VARCHAR(50),
    linkedin_url VARCHAR(255),
    telegram_url VARCHAR(255)
);

CREATE TABLE session_speaker_mapping (
    session_id INTEGER NOT NULL REFERENCES event_sessions(session_id) ON DELETE CASCADE,
    speaker_id INTEGER NOT NULL REFERENCES session_speakers(speaker_id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    speaking_order INTEGER,
    PRIMARY KEY (session_id, speaker_id)
);

CREATE TABLE session_registrations (
    session_registration_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES event_sessions(session_id) ON DELETE CASCADE,
    registration_id INTEGER NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    attended BOOLEAN NOT NULL DEFAULT FALSE,
    feedback TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5 OR rating IS NULL),
    UNIQUE (session_id, registration_id)
);

CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    registration_id INTEGER NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    issue_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMPTZ NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status invoice_status NOT NULL DEFAULT 'draft',
    notes TEXT,
    payment_terms TEXT,
    CHECK (due_date >= issue_date)
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_method payment_method NOT NULL,
    transaction_id VARCHAR(255),
    status payment_status NOT NULL DEFAULT 'pending',
    processed_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    notes TEXT,
    CHECK (amount > 0)
);

CREATE TABLE event_sponsors (
    sponsor_id SERIAL PRIMARY KEY ,
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    sponsor_level sponsor_level NOT NULL,
    website_url VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE email_templates (
    template_id SERIAL PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_admins (
    admin_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (user_id)
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type notification_type NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    related_event_id INTEGER REFERENCES events(event_id) ON DELETE SET NULL,
    related_registration_id INTEGER REFERENCES registrations(registration_id) ON DELETE SET NULL
);

CREATE TABLE sent_emails (
    email_id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES email_templates(template_id) ON DELETE SET NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT,
    body_text TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status email_status NOT NULL DEFAULT 'sent',
    event_id INTEGER REFERENCES events(event_id) ON DELETE SET NULL,
    registration_id INTEGER REFERENCES registrations(registration_id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name ON users(last_name, first_name);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_dates ON events(start_datetime, end_datetime);
CREATE INDEX idx_events_location ON events(city, state, country);
CREATE INDEX idx_registrations_event_user ON registrations(event_id, user_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX idx_sessions_event ON event_sessions(event_id);
CREATE INDEX idx_sessions_dates ON event_sessions(start_datetime, end_datetime);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_status_date ON payments(status, payment_date);
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_invoices_registration ON invoices(registration_id);
CREATE INDEX idx_invoices_status ON invoices(status);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modified
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_events_modified
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_email_templates_modified
BEFORE UPDATE ON email_templates
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_event_organizers_modified
BEFORE UPDATE ON event_organizers
FOR EACH ROW EXECUTE FUNCTION update_modified_column();