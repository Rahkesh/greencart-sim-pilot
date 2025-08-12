
# GreenCart Delivery Optimization System

## Project Overview

GreenCart Delivery Optimization System is a comprehensive web application designed to optimize delivery routes, manage drivers, track orders, and provide real-time analytics for delivery operations. The system helps businesses reduce fuel consumption, improve delivery efficiency, and enhance customer satisfaction through intelligent route planning and simulation capabilities.

## 🎯 Purpose

- **Route Optimization**: Calculate the most efficient delivery routes to minimize travel time and fuel consumption
- **Driver Management**: Track driver performance, availability, and assign optimal routes
- **Order Tracking**: Real-time order status updates and delivery monitoring
- **Performance Analytics**: Comprehensive dashboards showing KPIs, fuel savings, and delivery metrics
- **Simulation Engine**: Test different delivery scenarios before implementation

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Query (TanStack Query)** - Data fetching and state management
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Recharts** - Data visualization and charts
- **Shadcn/UI** - Modern UI component library
- **Lucide React** - Icon library
- **Vite** - Fast build tool and dev server

### Backend & Infrastructure
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database (hosted on Supabase)
- **Supabase Edge Functions** - Serverless functions for API endpoints
- **TypeScript** - Server-side logic
- **Supabase Auth** - Authentication and authorization
- **Real-time subscriptions** - Live data updates

### Development & Deployment
- **Vercel** - Frontend hosting and deployment
- **Supabase Cloud** - Backend and database hosting
- **GitHub** - Version control and CI/CD
- **ESLint** - Code linting
- **Vitest** - Unit testing framework

## 📁 Project Structure

```
delivery-optimization/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── integrations/   # External service integrations
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Backend API and database
│   ├── functions/          # Supabase Edge Functions
│   ├── supabase/           # Database configuration
│   ├── docs/              # API documentation
│   └── package.json        # Backend dependencies
├── docs/                   # Project documentation
└── README.md              # This file
```

## 🚀 Live Deployment

- **Frontend**: https://greencart-sim-pilot-git-main-rahkeshs-projects.vercel.app
- **Backend API**: https://mprizxsrqmwstacyqerd.supabase.co/functions/v1/
- **Database**: PostgreSQL on Supabase Cloud
- **API Documentation**: Available in `/backend/docs/api-spec.yaml`

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- Git
- Supabase account (for backend services)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd delivery-optimization/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables in `.env.local`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

3. **Login to Supabase**
   ```bash
   supabase login
   ```

4. **Link to your project**
   ```bash
   supabase link --project-ref your_project_ref
   ```

5. **Deploy functions**
   ```bash
   supabase functions deploy
   ```

## 🔐 Environment Variables

### Frontend (.env.local)
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (Supabase Dashboard)
```
DATABASE_URL=automatically_configured_by_supabase
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🚀 Deployment Instructions

### Frontend Deployment (Vercel)

1. **Connect GitHub repository to Vercel**
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `frontend`
3. **Set environment variables** in Vercel dashboard
4. **Deploy**: Automatic deployment on every push to main branch

### Backend Deployment (Supabase)

1. **Database**: Automatically managed by Supabase Cloud
2. **Edge Functions**: Deploy using Supabase CLI
   ```bash
   supabase functions deploy delivery-simulation
   ```
3. **Authentication**: Configured through Supabase dashboard

## 📚 API Documentation

### Base URL
```
https://mprizxsrqmwstacyqerd.supabase.co/functions/v1
```

### Endpoints

#### 1. Delivery Simulation
**POST** `/delivery-simulation`

Optimizes delivery routes and calculates performance metrics.

**Request Body:**
```json
{
  "drivers": [
    {
      "id": "driver-1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "vehicle_type": "van",
      "max_capacity": 100,
      "availability": "available"
    }
  ],
  "orders": [
    {
      "id": "order-1",
      "customer_name": "Alice Smith",
      "customer_phone": "+1987654321",
      "delivery_address": "123 Main St, City, State",
      "items": [
        {
          "name": "Product A",
          "quantity": 2,
          "weight": 5.5
        }
      ],
      "priority": "high",
      "time_window": "09:00-17:00"
    }
  ],
  "routes": [
    {
      "id": "route-1",
      "name": "Downtown Route",
      "waypoints": [
        {
          "address": "123 Main St",
          "latitude": 40.7128,
          "longitude": -74.0060
        }
      ],
      "estimated_duration": 120,
      "distance_km": 15.5
    }
  ]
}
```

**Response:**
```json
{
  "optimizedRoutes": [
    {
      "driverId": "driver-1",
      "orders": ["order-1"],
      "estimatedDuration": 120,
      "estimatedDistance": 15.5,
      "fuelConsumption": 2.1
    }
  ],
  "totalDistance": 15.5,
  "totalDuration": 120,
  "fuelSaved": 1.2,
  "efficiencyGain": 15.5
}
```

### Database Schema

#### Tables
- **drivers**: Driver information and availability
- **orders**: Customer orders and delivery details
- **routes**: Route definitions and waypoints
- **simulation_history**: Historical simulation results

### Authentication

All API endpoints require authentication using Supabase Auth. Include the session token in the Authorization header:

```
Authorization: Bearer <session_token>
```

### Error Handling

API returns standard HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test          # Run unit tests
npm run test:coverage # Run tests with coverage
npm run test:watch   # Run tests in watch mode
```

### API Testing
Use the provided Postman collection or test endpoints directly:
```bash
curl -X POST https://mprizxsrqmwstacyqerd.supabase.co/functions/v1/delivery-simulation \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d @sample-request.json
```

## 📖 Additional Documentation

- **API Specification**: See `/backend/docs/api-spec.yaml` for OpenAPI specification
- **Component Documentation**: Individual component docs in `/frontend/src/components/`
- **Database Schema**: Check Supabase dashboard for complete schema

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
