
# Delivery Route Optimization & Simulation Platform

## Project Overview & Purpose

This application is a comprehensive delivery route optimization and simulation platform designed specifically for delivery management companies. It enables managers to simulate delivery operations, optimize routes, and analyze key performance indicators (KPIs) to make data-driven decisions for their delivery operations.

### Key Features
- **Real-time Delivery Simulation**: Run simulations with configurable parameters (number of drivers, route start times, max hours per driver)
- **Company Rules Engine**: Implements business rules for penalties, bonuses, fuel costs, and driver fatigue
- **KPI Analytics**: Track delivery performance, revenue, efficiency scores, and operational costs
- **Historical Analysis**: Save and review past simulation results with timestamps
- **Driver Management**: Manage driver profiles, availability, and performance metrics
- **Route Optimization**: Create and manage delivery routes with traffic considerations
- **Order Management**: Handle delivery orders with status tracking
- **Manager Authentication**: Secure access restricted to authorized managers only

## Tech Stack Used

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **shadcn/ui** - High-quality, accessible component library
- **React Router DOM** - Client-side routing
- **React Hook Form** - Performant form handling with validation
- **Zod** - TypeScript-first schema validation
- **TanStack Query** - Data fetching and state management
- **Recharts** - Chart library for data visualization
- **Lucide React** - Icon library

### Backend
- **Supabase Edge Functions** - Serverless backend with Deno runtime
- **TypeScript** - Type-safe backend development
- **Supabase Auth** - JWT-based authentication with role management
- **PostgreSQL** - Relational database with ACID compliance

### Database & Infrastructure
- **Supabase PostgreSQL** - Cloud-hosted database with real-time capabilities
- **Row Level Security (RLS)** - Database-level security policies
- **Edge Functions** - Serverless compute for business logic
- **Real-time subscriptions** - Live data updates

### Testing
- **Vitest** - Fast unit testing framework
- **jsdom** - DOM testing environment
- **@vitest/coverage-v8** - Code coverage reporting

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Git for version control
- Supabase account (for database and authentication)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd delivery-optimization-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   The application uses Supabase for backend services. Environment variables are configured through Supabase:
   - Supabase URL: `https://mprizxsrqmwstacyqerd.supabase.co`
   - Supabase Anon Key: Configured in `src/integrations/supabase/client.ts`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup (Supabase Edge Functions)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link to project**
   ```bash
   supabase link --project-ref mprizxsrqmwstacyqerd
   ```

4. **Deploy Edge Functions**
   ```bash
   supabase functions deploy delivery-simulation
   ```

## Environment Variables

### Required Environment Variables (Supabase Secrets)
```env
# Supabase Configuration (automatically configured)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Edge Function Secrets (configured via Supabase Dashboard)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Local Development
For local development, create a `.env.local` file:
```env
# Not required - using direct Supabase integration
# All environment variables are managed through Supabase
```

## Deployment Instructions

### Frontend Deployment (Vercel/Netlify)

#### Vercel Deployment
1. **Connect GitHub repository to Vercel**
2. **Configure build settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables:**
   - No additional environment variables needed (using direct Supabase URLs)

4. **Deploy:**
   - Automatic deployment on push to main branch

#### Netlify Deployment
1. **Connect GitHub repository to Netlify**
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

### Backend Deployment (Supabase Edge Functions)

Backend is automatically deployed via Supabase Edge Functions:

1. **Database Setup:**
   - PostgreSQL database hosted on Supabase
   - Automatic migrations and schema management
   - Row Level Security policies enforced

2. **Edge Functions:**
   - Deployed via Supabase CLI
   - Serverless compute with global edge locations
   - Automatic scaling and CORS handling

3. **Authentication:**
   - JWT-based authentication via Supabase Auth
   - Role-based access control (manager role required)
   - Password hashing handled automatically

### Database (Supabase PostgreSQL)

Database is cloud-hosted and managed by Supabase:
- **Host:** PostgreSQL on Supabase infrastructure
- **Backups:** Automatic daily backups
- **Security:** TLS encryption, RLS policies
- **Monitoring:** Built-in metrics and logging

## API Documentation

### Base URL
```
https://mprizxsrqmwstacyqerd.supabase.co/functions/v1
```

### Authentication
All API requests require authentication via Supabase JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Endpoints

#### POST /delivery-simulation
Runs a delivery simulation with specified parameters.

**Request Body:**
```json
{
  "numberOfDrivers": 5,
  "routeStartTime": "09:00",
  "maxHoursPerDriver": 8
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "totalDeliveries": 45,
    "totalRevenue": 38250.00,
    "averageDeliveryTime": 35,
    "driverUtilization": 87.50,
    "onTimeDeliveryRate": 91.11,
    "fuelCost": 8775.00,
    "costPerDelivery": 195.00,
    "totalPenalties": 200.00,
    "totalBonuses": 1350.00,
    "overallProfit": 30625.00,
    "efficiencyScore": 91.11
  },
  "metadata": {
    "simulationTimestamp": "2024-01-15T10:30:00.000Z",
    "totalDriversAvailable": 5,
    "totalRoutesProcessed": 8,
    "totalOrdersProcessed": 45
  }
}
```

**Response (Error - 400):**
```json
{
  "error": "Validation error message",
  "code": "INVALID_RANGE",
  "field": "numberOfDrivers"
}
```

**Request Validation:**
- `numberOfDrivers`: Integer, 1-100
- `routeStartTime`: String, HH:MM format (24-hour)
- `maxHoursPerDriver`: Number, 0.1-24

#### Database Tables (Supabase API)

**GET /rest/v1/drivers**
Retrieve active drivers
- Authentication required
- RLS policies enforce user access

**GET /rest/v1/routes**
Retrieve delivery routes
- Authentication required
- Includes traffic level and distance data

**GET /rest/v1/orders**
Retrieve delivery orders
- Authentication required
- Status: pending, in-transit, completed

**GET /rest/v1/simulation_results**
Retrieve simulation history
- Authentication required
- User-specific results only

### Company Business Rules Implemented

1. **Late Delivery Penalty (Rule 1)**
   - ₹50 penalty when delivery exceeds base time + 10 minutes grace period

2. **Driver Fatigue Rule (Rule 2)**
   - 30% slower delivery time when driver worked >8 hours average over 7 days

3. **High-Value Bonus (Rule 3)**
   - 10% bonus for orders >₹1000 delivered on time

4. **Fuel Cost Calculation (Rule 4)**
   - Base: ₹5/km
   - High traffic surcharge: +₹2/km

5. **Overall Profit (Rule 5)**
   - Total Revenue + Bonuses - Penalties - Fuel Costs

6. **Efficiency Score (Rule 6)**
   - Percentage of on-time deliveries

## Testing

### Unit Tests
The application includes comprehensive unit tests covering:

1. **Authentication validation** (`src/__tests__/authValidation.test.ts`)
   - Email format validation
   - Password strength requirements
   - Manager role verification

2. **Simulation business logic** (`src/__tests__/simulationLogic.test.ts`)
   - Company rule implementations
   - Penalty calculations
   - Bonus calculations
   - Fuel cost calculations
   - Efficiency scoring

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- Business logic: 100% coverage
- Authentication flows: 100% coverage
- Company rules implementation: 100% coverage

## Live Deployment Links

### Frontend
- **Production URL:** [To be deployed on Vercel/Netlify]
- **Staging URL:** [Supabase staging domain]

### Backend
- **API Base URL:** `https://mprizxsrqmwstacyqerd.supabase.co/functions/v1`
- **Database:** `https://mprizxsrqmwstacyqerd.supabase.co`
- **Auth:** `https://mprizxsrqmwstacyqerd.supabase.co/auth/v1`

### Database
- **Provider:** Supabase PostgreSQL
- **Host:** Cloud-hosted on Supabase infrastructure
- **Backups:** Automatic daily backups with point-in-time recovery

## Project Structure

```
delivery-optimization-platform/
├── src/
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── integrations/      # Supabase integration
│   ├── __tests__/         # Unit tests
│   └── lib/               # Utility functions
├── supabase/
│   ├── functions/         # Edge functions
│   └── migrations/        # Database migrations
├── public/                # Static assets
└── docs/                  # Additional documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software for delivery management operations.

## Support

For technical support or questions about the delivery optimization platform, please contact the development team.
