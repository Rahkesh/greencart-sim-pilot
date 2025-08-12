
# Delivery Optimization Backend Server

Traditional Express.js backend server for the Delivery Optimization Platform.

## Deployment

This backend is deployed on Railway and provides REST API endpoints that complement the Supabase Edge Functions.

### Live Deployment
- **Backend Server**: Will be deployed to Railway
- **API Documentation**: Available at `/api/docs` endpoint

### Environment Variables Required
- `SUPABASE_URL`: https://mprizxsrqmwstacyqerd.supabase.co
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `PORT`: Server port (defaults to 3001)

### API Endpoints

#### Health & Documentation
- `GET /health` - Health check
- `GET /api/docs` - API documentation

#### Simulation
- `POST /api/delivery-simulation` - Run delivery simulation

#### Data Management
- `GET /api/drivers` - Get active drivers
- `POST /api/drivers` - Create new driver
- `GET /api/routes` - Get delivery routes
- `GET /api/orders` - Get delivery orders
- `GET /api/simulation-history` - Get simulation history

### Local Development

```bash
npm install
npm run dev
```

### Deployment to Railway

1. Connect this repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

## Architecture

This Express server acts as a bridge between the frontend and Supabase, providing:
- REST API endpoints
- Request validation
- Error handling
- CORS configuration
- Security headers
