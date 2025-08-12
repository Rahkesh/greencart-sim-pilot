
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SimulationRequest {
  numberOfDrivers: number;
  routeStartTime: string; // HH:MM format
  maxHoursPerDriver: number;
}

interface KPIResults {
  totalDeliveries: number;
  totalRevenue: number;
  averageDeliveryTime: number;
  driverUtilization: number;
  onTimeDeliveryRate: number;
  fuelCost: number;
  costPerDelivery: number;
  totalPenalties: number;
  totalBonuses: number;
  overallProfit: number;
  efficiencyScore: number;
}

interface DriverState {
  id: string;
  name: string;
  hoursWorked: number;
  isFatigued: boolean;
  deliveries: number;
}

interface DeliveryResult {
  orderId: string;
  actualDeliveryTime: number;
  isOnTime: boolean;
  penalty: number;
  bonus: number;
  fuelCost: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('=== Delivery Simulation Function Started ===');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error',
          code: 'MISSING_CONFIG',
          details: 'Required environment variables are not set'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body with error handling
    let body: SimulationRequest;
    try {
      const requestText = await req.text();
      console.log('Raw request body:', requestText);
      
      if (!requestText) {
        throw new Error('Empty request body');
      }
      
      body = JSON.parse(requestText);
      console.log('Parsed request body:', body);
    } catch (error) {
      console.error('JSON parsing error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON format in request body',
          code: 'INVALID_JSON',
          details: 'Request body must be valid JSON'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validate input parameters
    const validationError = validateInput(body);
    if (validationError) {
      console.error('Validation error:', validationError);
      return new Response(
        JSON.stringify({ 
          error: validationError.message,
          code: validationError.code,
          field: validationError.field
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Fetching data from database...');

    // Fetch data from database with error handling
    const [driversResult, routesResult, ordersResult] = await Promise.all([
      supabase.from('drivers').select('*').eq('status', 'active'),
      supabase.from('routes').select('*'),
      supabase.from('orders').select('*').in('status', ['pending', 'in-transit'])
    ]);

    console.log('Database fetch results:', {
      drivers: driversResult.data?.length || 0,
      routes: routesResult.data?.length || 0,
      orders: ordersResult.data?.length || 0,
      driversError: driversResult.error,
      routesError: routesResult.error,
      ordersError: ordersResult.error
    });

    if (driversResult.error) {
      console.error('Database error (drivers):', driversResult.error);
      throw new Error(`Failed to fetch drivers: ${driversResult.error.message}`);
    }
    if (routesResult.error) {
      console.error('Database error (routes):', routesResult.error);
      throw new Error(`Failed to fetch routes: ${routesResult.error.message}`);
    }
    if (ordersResult.error) {
      console.error('Database error (orders):', ordersResult.error);
      throw new Error(`Failed to fetch orders: ${ordersResult.error.message}`);
    }

    const drivers = driversResult.data || [];
    const routes = routesResult.data || [];
    const orders = ordersResult.data || [];

    // If no data available, create mock data for simulation
    if (drivers.length === 0 || routes.length === 0 || orders.length === 0) {
      console.log('No data found, creating mock simulation data...');
      const mockData = createMockSimulationData(body);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: mockData,
          metadata: {
            simulationTimestamp: new Date().toISOString(),
            totalDriversAvailable: body.numberOfDrivers,
            totalRoutesProcessed: 5,
            totalOrdersProcessed: 20,
            note: 'Simulation run with mock data as no database records were found'
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if we have enough active drivers
    if (drivers.length < body.numberOfDrivers) {
      console.log(`Insufficient drivers: requested ${body.numberOfDrivers}, available ${drivers.length}`);
      return new Response(
        JSON.stringify({ 
          error: `Insufficient active drivers available`,
          code: 'INSUFFICIENT_DRIVERS',
          details: `Requested: ${body.numberOfDrivers}, Available: ${drivers.length}`,
          availableDrivers: drivers.length,
          requestedDrivers: body.numberOfDrivers
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Starting simulation with ${body.numberOfDrivers} drivers, ${routes.length} routes, ${orders.length} orders`);

    // Run simulation with company rules
    const kpiResults = runSimulationWithCompanyRules(body, drivers, routes, orders);

    console.log('Simulation completed successfully:', kpiResults);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: kpiResults,
        metadata: {
          simulationTimestamp: new Date().toISOString(),
          totalDriversAvailable: drivers.length,
          totalRoutesProcessed: routes.length,
          totalOrdersProcessed: orders.length
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Simulation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during simulation',
        code: 'SIMULATION_ERROR',
        details: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function createMockSimulationData(request: SimulationRequest): KPIResults {
  console.log('Creating mock simulation data for:', request);
  
  // Generate realistic mock data based on the simulation parameters
  const totalDeliveries = Math.floor(request.numberOfDrivers * request.maxHoursPerDriver * 1.5);
  const onTimeRate = 85 + Math.random() * 10; // 85-95%
  const totalRevenue = totalDeliveries * (800 + Math.random() * 400); // ₹800-1200 per delivery
  const fuelCost = totalDeliveries * (150 + Math.random() * 100); // ₹150-250 per delivery
  const totalPenalties = totalDeliveries * (1 - onTimeRate / 100) * 50; // ₹50 per late delivery
  const totalBonuses = totalDeliveries * (onTimeRate / 100) * 0.3 * 100; // 30% high-value orders with ₹100 bonus
  
  return {
    totalDeliveries,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageDeliveryTime: Math.round(30 + Math.random() * 20), // 30-50 minutes
    driverUtilization: Math.round((75 + Math.random() * 20) * 100) / 100, // 75-95%
    onTimeDeliveryRate: Math.round(onTimeRate * 100) / 100,
    fuelCost: Math.round(fuelCost * 100) / 100,
    costPerDelivery: Math.round((fuelCost / totalDeliveries) * 100) / 100,
    totalPenalties: Math.round(totalPenalties * 100) / 100,
    totalBonuses: Math.round(totalBonuses * 100) / 100,
    overallProfit: Math.round((totalRevenue + totalBonuses - totalPenalties - fuelCost) * 100) / 100,
    efficiencyScore: Math.round(onTimeRate * 100) / 100
  };
}

function validateInput(body: any): { message: string; code: string; field: string } | null {
  // Check if body exists
  if (!body || typeof body !== 'object') {
    return {
      message: 'Request body is required and must be an object',
      code: 'MISSING_BODY',
      field: 'body'
    };
  }

  // Validate numberOfDrivers
  if (!body.numberOfDrivers) {
    return {
      message: 'Number of drivers is required',
      code: 'MISSING_FIELD',
      field: 'numberOfDrivers'
    };
  }

  if (typeof body.numberOfDrivers !== 'number' || !Number.isInteger(body.numberOfDrivers)) {
    return {
      message: 'Number of drivers must be an integer',
      code: 'INVALID_TYPE',
      field: 'numberOfDrivers'
    };
  }

  if (body.numberOfDrivers <= 0) {
    return {
      message: 'Number of drivers must be greater than 0',
      code: 'INVALID_RANGE',
      field: 'numberOfDrivers'
    };
  }

  if (body.numberOfDrivers > 100) {
    return {
      message: 'Number of drivers cannot exceed 100',
      code: 'INVALID_RANGE',
      field: 'numberOfDrivers'
    };
  }

  // Validate routeStartTime
  if (!body.routeStartTime) {
    return {
      message: 'Route start time is required',
      code: 'MISSING_FIELD',
      field: 'routeStartTime'
    };
  }

  if (typeof body.routeStartTime !== 'string') {
    return {
      message: 'Route start time must be a string',
      code: 'INVALID_TYPE',
      field: 'routeStartTime'
    };
  }

  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(body.routeStartTime)) {
    return {
      message: 'Route start time must be in HH:MM format (24-hour)',
      code: 'INVALID_FORMAT',
      field: 'routeStartTime'
    };
  }

  // Validate maxHoursPerDriver
  if (!body.maxHoursPerDriver) {
    return {
      message: 'Max hours per driver is required',
      code: 'MISSING_FIELD',
      field: 'maxHoursPerDriver'
    };
  }

  if (typeof body.maxHoursPerDriver !== 'number') {
    return {
      message: 'Max hours per driver must be a number',
      code: 'INVALID_TYPE',
      field: 'maxHoursPerDriver'
    };
  }

  if (body.maxHoursPerDriver <= 0) {
    return {
      message: 'Max hours per driver must be greater than 0',
      code: 'INVALID_RANGE',
      field: 'maxHoursPerDriver'
    };
  }

  if (body.maxHoursPerDriver > 24) {
    return {
      message: 'Max hours per driver cannot exceed 24 hours',
      code: 'INVALID_RANGE',
      field: 'maxHoursPerDriver'
    };
  }

  return null;
}

function runSimulationWithCompanyRules(
  request: SimulationRequest, 
  drivers: any[], 
  routes: any[], 
  orders: any[]
): KPIResults {
  console.log('Running simulation with company rules');

  // Select drivers for simulation (prioritize those with fewer hours)
  const selectedDrivers: DriverState[] = drivers
    .sort((a, b) => (a.past_seven_day_hours || 0) - (b.past_seven_day_hours || 0))
    .slice(0, request.numberOfDrivers)
    .map(driver => ({
      id: driver.id,
      name: driver.name,
      hoursWorked: 0,
      isFatigued: (driver.past_seven_day_hours || 0) > 56, // Fatigued if worked >8h/day average over 7 days
      deliveries: 0
    }));

  console.log(`Selected ${selectedDrivers.length} drivers for simulation`);

  // Group orders by route for efficiency
  const ordersByRoute = orders.reduce((acc, order) => {
    const routeId = order.assigned_route || order.route_id || 'default';
    if (!acc[routeId]) acc[routeId] = [];
    acc[routeId].push(order);
    return acc;
  }, {});

  let deliveryResults: DeliveryResult[] = [];
  let totalDriverHours = 0;

  // Simulate each driver's deliveries
  selectedDrivers.forEach((driver, index) => {
    console.log(`Processing driver ${driver.name} (${driver.id})`);
    
    // Assign routes to drivers in round-robin fashion
    const assignedRoutes = routes.filter((_, routeIndex) => 
      routeIndex % selectedDrivers.length === index
    );

    assignedRoutes.forEach(route => {
      const routeId = route.route_id || route.id;
      const routeOrders = ordersByRoute[routeId] || [];
      
      routeOrders.forEach(order => {
        if (driver.hoursWorked < request.maxHoursPerDriver) {
          const deliveryResult = simulateDelivery(order, route, driver);
          
          if (deliveryResult) {
            deliveryResults.push(deliveryResult);
            driver.hoursWorked += deliveryResult.actualDeliveryTime / 60; // Convert minutes to hours
            driver.deliveries++;
            
            // Apply fatigue rule for next day (8+ hours)
            if (driver.hoursWorked > 8) {
              driver.isFatigued = true;
            }
          }
        }
      });
    });

    totalDriverHours += driver.hoursWorked;
    console.log(`Driver ${driver.name} worked ${driver.hoursWorked.toFixed(2)} hours with ${driver.deliveries} deliveries`);
  });

  // Calculate KPIs based on delivery results
  const kpis = calculateKPIs(deliveryResults, selectedDrivers, request, orders);
  
  console.log('Simulation completed with KPIs:', kpis);
  return kpis;
}

function simulateDelivery(order: any, route: any, driver: DriverState): DeliveryResult | null {
  // Calculate base delivery time
  const trafficMultipliers = { 'Low': 1.0, 'Medium': 1.3, 'High': 1.7 };
  const trafficLevel = route.traffic_level || 'Medium';
  const trafficMultiplier = trafficMultipliers[trafficLevel] || 1.0;
  let baseDeliveryTime = (route.base_time_minutes || 30) * trafficMultiplier;

  // Apply fatigue rule: 30% slower if driver is fatigued
  if (driver.isFatigued) {
    baseDeliveryTime *= 1.3;
  }

  const actualDeliveryTime = baseDeliveryTime;

  // Calculate fuel cost (Company Rule 4)
  const distance = route.distance_km || 10;
  let fuelCost = distance * 5; // Base ₹5/km
  if (trafficLevel === 'High') {
    fuelCost += distance * 2; // +₹2/km surcharge for high traffic
  }

  // Determine if delivery is on time (Company Rule 1)
  const allowedTime = (route.base_time_minutes || 30) + 10; // Base time + 10 minutes grace
  const isOnTime = actualDeliveryTime <= allowedTime;

  // Calculate penalty (Company Rule 1)
  const penalty = isOnTime ? 0 : 50; // ₹50 penalty for late delivery

  // Calculate bonus (Company Rule 3)
  const orderValue = order.value_rs || order.total_amount || 800;
  const isHighValue = orderValue > 1000;
  const bonus = (isHighValue && isOnTime) ? orderValue * 0.1 : 0; // 10% bonus

  return {
    orderId: order.id,
    actualDeliveryTime,
    isOnTime,
    penalty,
    bonus,
    fuelCost
  };
}

function calculateKPIs(
  deliveryResults: DeliveryResult[], 
  drivers: DriverState[], 
  request: SimulationRequest,
  orders: any[]
): KPIResults {
  const totalDeliveries = deliveryResults.length;
  const onTimeDeliveries = deliveryResults.filter(d => d.isOnTime).length;
  
  // Basic metrics
  const totalRevenue = deliveryResults.reduce((sum, delivery) => {
    const order = orders.find(o => o.id === delivery.orderId);
    const orderValue = order ? (order.value_rs || order.total_amount || 800) : 800;
    return sum + orderValue;
  }, 0);

  const averageDeliveryTime = totalDeliveries > 0 
    ? deliveryResults.reduce((sum, d) => sum + d.actualDeliveryTime, 0) / totalDeliveries 
    : 0;

  const totalDriverHours = drivers.reduce((sum, d) => sum + d.hoursWorked, 0);
  const maxPossibleHours = drivers.length * request.maxHoursPerDriver;
  const driverUtilization = maxPossibleHours > 0 ? (totalDriverHours / maxPossibleHours) * 100 : 0;

  const onTimeDeliveryRate = totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;

  // Company-specific metrics
  const totalPenalties = deliveryResults.reduce((sum, d) => sum + d.penalty, 0);
  const totalBonuses = deliveryResults.reduce((sum, d) => sum + d.bonus, 0);
  const totalFuelCost = deliveryResults.reduce((sum, d) => sum + d.fuelCost, 0);

  // Overall Profit (Company Rule 5)
  const overallProfit = totalRevenue + totalBonuses - totalPenalties - totalFuelCost;

  // Efficiency Score (Company Rule 6)
  const efficiencyScore = onTimeDeliveryRate;

  const costPerDelivery = totalDeliveries > 0 ? totalFuelCost / totalDeliveries : 0;

  return {
    totalDeliveries,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageDeliveryTime: Math.round(averageDeliveryTime),
    driverUtilization: Math.round(driverUtilization * 100) / 100,
    onTimeDeliveryRate: Math.round(onTimeDeliveryRate * 100) / 100,
    fuelCost: Math.round(totalFuelCost * 100) / 100,
    costPerDelivery: Math.round(costPerDelivery * 100) / 100,
    totalPenalties: Math.round(totalPenalties * 100) / 100,
    totalBonuses: Math.round(totalBonuses * 100) / 100,
    overallProfit: Math.round(overallProfit * 100) / 100,
    efficiencyScore: Math.round(efficiencyScore * 100) / 100
  };
}
