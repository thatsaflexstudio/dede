-- Run once in your Neon SQL Editor. Safe to rerun; no data is deleted.
CREATE TABLE IF NOT EXISTS dedes_settings (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS dedes_orders (
 id text PRIMARY KEY, token_hash text NOT NULL, idempotency_key text NOT NULL UNIQUE,
 data jsonb NOT NULL, status text NOT NULL DEFAULT 'received', driver text NOT NULL DEFAULT '', created_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS dedes_orders_created ON dedes_orders(created_at DESC);
CREATE TABLE IF NOT EXISTS dedes_signups (email text PRIMARY KEY, created_at bigint NOT NULL);
CREATE TABLE IF NOT EXISTS dedes_rate_limits (id text PRIMARY KEY, count integer NOT NULL, expires_at bigint NOT NULL);
CREATE INDEX IF NOT EXISTS dedes_rate_expiry ON dedes_rate_limits(expires_at);
