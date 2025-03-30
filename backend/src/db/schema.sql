-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user if not exists
INSERT INTO users (username, password, is_admin) 
VALUES ('admin', 'admin123', true)
ON CONFLICT (username) DO NOTHING;

-- Create survey_responses table if not exists
CREATE TABLE IF NOT EXISTS survey_responses (
    response_id SERIAL,
    user_id INTEGER REFERENCES users(id),
    demographic JSONB NOT NULL,
    health JSONB NOT NULL,
    financial JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (response_id),
    UNIQUE(user_id)
); 