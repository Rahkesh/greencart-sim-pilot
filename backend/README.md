
# Delivery Optimization Backend

This directory contains the backend implementation using Supabase Edge Functions.

## Architecture

The backend is built using:
- **Supabase Edge Functions** - Serverless functions for API endpoints
- **PostgreSQL** - Database hosted on Supabase
- **TypeScript** - Type-safe backend development

## Available Endpoints

### POST /delivery-simulation
Runs delivery simulation with company rules and KPI calculations.

**Base URL**: `https://mprizxsrqmwstacyqerd.supabase.co/functions/v1/`

## Edge Functions

All backend logic is implemented as Supabase Edge Functions in the `functions/` directory:

- `delivery-simulation/` - Main simulation engine with company rules
- Database operations handled via Supabase client
- Authentication managed by Supabase Auth

## Deployment

Edge Functions are automatically deployed when code changes are pushed. Manual deployment:

```bash
supabase functions deploy delivery-simulation
```

## Environment Variables

Required secrets (configured in Supabase Dashboard):
- `SUPABASE_SERVICE_ROLE_KEY` - For admin operations
- `SUPABASE_URL` - Database connection
- `SUPABASE_ANON_KEY` - Public API access

## Database Schema

See `/supabase/migrations/` for complete database schema and migrations.

## API Documentation

Complete API documentation available in `/docs/api-documentation.yaml`
