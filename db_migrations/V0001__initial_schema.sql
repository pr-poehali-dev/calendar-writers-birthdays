-- Таблица писателей
CREATE TABLE writers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    info TEXT,
    image_url TEXT,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 31),
    tags TEXT[], -- массив тегов: поэт, прозаик, драматург и т.д.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_writers_date ON writers(month, day);
CREATE INDEX idx_writers_name ON writers(name);
CREATE INDEX idx_writers_tags ON writers USING GIN(tags);

-- Таблица подписок на напоминания
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    verification_token VARCHAR(255),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_email ON subscriptions(email);
CREATE INDEX idx_subscriptions_active ON subscriptions(is_active, verified);
