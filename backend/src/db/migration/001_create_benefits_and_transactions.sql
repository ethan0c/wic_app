-- WIC Benefits Table
-- Stores monthly benefit allocations for each WIC card
CREATE TABLE IF NOT EXISTS wic_benefits (
    id SERIAL PRIMARY KEY,
    wic_card_number VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL, -- dairy, grains, protein, fruits, vegetables
    total_amount DECIMAL(10, 2) NOT NULL, -- Total allocated for the month
    remaining_amount DECIMAL(10, 2) NOT NULL, -- Amount remaining
    unit VARCHAR(20) NOT NULL, -- gallons, oz, dollars, lbs, dozen, etc.
    month_period VARCHAR(7) NOT NULL, -- Format: YYYY-MM (e.g., 2025-11)
    start_date DATE NOT NULL, -- First day of the month
    expires_at DATE NOT NULL, -- Last day of the month
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_card_category_month UNIQUE (wic_card_number, category, month_period)
);

-- Index for faster queries by card number
CREATE INDEX idx_benefits_card_number ON wic_benefits(wic_card_number);
CREATE INDEX idx_benefits_month_period ON wic_benefits(month_period);
CREATE INDEX idx_benefits_expires_at ON wic_benefits(expires_at);

-- WIC Transactions Table
-- Stores all purchase transactions made with WIC benefits
CREATE TABLE IF NOT EXISTS wic_transactions (
    id SERIAL PRIMARY KEY,
    wic_card_number VARCHAR(50) NOT NULL,
    store_id INTEGER, -- Reference to wic_stores table if exists
    store_name VARCHAR(255),
    transaction_type VARCHAR(50) DEFAULT 'purchase', -- purchase, refund, adjustment
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES wic_stores(id) ON DELETE SET NULL
);

-- Transaction Items Table
-- Stores individual items in each transaction
CREATE TABLE IF NOT EXISTS wic_transaction_items (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER NOT NULL,
    benefit_id INTEGER, -- Links to which benefit was used
    product_name VARCHAR(255) NOT NULL,
    product_upc VARCHAR(50),
    category VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit VARCHAR(20),
    amount_used DECIMAL(10, 2) NOT NULL, -- Amount deducted from benefit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES wic_transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (benefit_id) REFERENCES wic_benefits(id) ON DELETE SET NULL
);

-- Index for faster transaction queries
CREATE INDEX idx_transactions_card_number ON wic_transactions(wic_card_number);
CREATE INDEX idx_transactions_date ON wic_transactions(transaction_date);
CREATE INDEX idx_transaction_items_transaction_id ON wic_transaction_items(transaction_id);
CREATE INDEX idx_transaction_items_benefit_id ON wic_transaction_items(benefit_id);

-- Comments for documentation
COMMENT ON TABLE wic_benefits IS 'Stores monthly WIC benefit allocations for each card';
COMMENT ON TABLE wic_transactions IS 'Stores WIC purchase transactions';
COMMENT ON TABLE wic_transaction_items IS 'Stores individual items purchased in each transaction';
