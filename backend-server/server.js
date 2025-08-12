
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL || 'https://mprizxsrqmwstacyqerd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://greencart-sim-pilot-git-main-rahkeshs-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Delivery Optimization Backend Server'
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Delivery Optimization API',
    version: '1.0.0',
    description: 'Backend API for Delivery Optimization Platform',
    endpoints: {
      'GET /health': 'Health check endpoint',
      'POST /api/delivery-simulation': 'Run delivery simulation',
      'GET /api/drivers': 'Get active drivers',
      'POST /api/drivers': 'Create new driver',
      'GET /api/routes': 'Get delivery routes',
      'POST /api/routes': 'Create new route',
      'GET /api/orders': 'Get delivery orders',
      'POST /api/orders': 'Create new order',
      'GET /api/simulation-history': 'Get simulation history'
    },
    documentation: 'https://greencart-sim-pilot-git-main-rahkeshs-projects.vercel.app'
  });
});

// Delivery simulation endpoint
app.post('/api/delivery-simulation', async (req, res) => {
  try {
    const { numberOfDrivers, routeStartTime, maxHoursPerDriver } = req.body;

    // Validate input
    if (!numberOfDrivers || !routeStartTime || !maxHoursPerDriver) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['numberOfDrivers', 'routeStartTime', 'maxHoursPerDriver']
      });
    }

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('delivery-simulation', {
      body: { numberOfDrivers, routeStartTime, maxHoursPerDriver }
    });

    if (error) {
      console.error('Simulation error:', error);
      return res.status(500).json({
        error: 'Simulation failed',
        details: error.message
      });
    }

    res.json({
      success: true,
      data: data.data,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'unknown'
      }
    });
  } catch (error) {
    console.error('Delivery simulation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Drivers endpoints
app.get('/api/drivers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      error: 'Failed to fetch drivers',
      message: error.message
    });
  }
});

app.post('/api/drivers', async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        error: 'Name and phone are required'
      });
    }

    const { data, error } = await supabase
      .from('drivers')
      .insert([{ name, phone, status: 'active' }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Create driver error:', error);
    res.status(500).json({
      error: 'Failed to create driver',
      message: error.message
    });
  }
});

// Routes endpoints
app.get('/api/routes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*');

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({
      error: 'Failed to fetch routes',
      message: error.message
    });
  }
});

// Orders endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
});

// Simulation history endpoint
app.get('/api/simulation-history', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header required'
      });
    }

    // Extract user from JWT (simplified for demo)
    const { data, error } = await supabase
      .from('simulation_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Get simulation history error:', error);
    res.status(500).json({
      error: 'Failed to fetch simulation history',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /api/docs',
      'POST /api/delivery-simulation',
      'GET /api/drivers',
      'GET /api/routes',
      'GET /api/orders',
      'GET /api/simulation-history'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Delivery Optimization Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
});

module.exports = app;
