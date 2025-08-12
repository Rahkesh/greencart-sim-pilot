
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
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body: SimulationRequest = await req.json();
    
    // Validate input parameters
    const validationError = validateInput(body);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Fetch data from database
    const [driversResult, routesResult, ordersResult] = await Promise.all([
      supabase.from('drivers').select('*').eq('status', 'active'),
      supabase.from('routes').select('*'),
      supabase.from('orders').select('*').in('status', ['pending', 'in-transit'])
    ]);

    if (driversResult.error) throw driversResult.error;
    if (routesResult.error) throw routesResult.error;
    if (ordersResult.error) throw ordersResult.error;

    const drivers = driversResult.data || [];
    const routes = routesResult.data || [];
    const orders = ordersResult.data || [];

    // Check if we have enough active drivers
    if (drivers.length < body.numberOfDrivers) {
      return new Response(
        JSON.stringify({ 
          error: `Not enough active drivers available. Requested: ${body.numberOfDrivers}, Available: ${drivers.length}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Run simulation
    const kpiResults = runSimulation(body, drivers, routes, orders);

    return new Response(
      JSON.stringify({ success: true, data: kpiResults }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Simulation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function validateInput(body: SimulationRequest): string | null {
  if (!body.numberOfDrivers || body.numberOfDrivers <= 0) {
    return 'Number of drivers must be a positive integer';
  }

  if (!body.routeStartTime || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(body.routeStartTime)) {
    return 'Route start time must be in HH:MM format (24-hour)';
  }

  if (!body.maxHoursPerDriver || body.maxHoursPerDriver <= 0 || body.maxHoursPerDriver > 24) {
    return 'Max hours per driver must be between 1 and 24';
  }

  return null;
}

function runSimulation(
  request: SimulationRequest, 
  drivers: any[], 
  routes: any[], 
  orders: any[]
): KPIResults {
  // Select drivers for simulation (prioritize those with fewer hours)
  const selectedDrivers = drivers
    .sort((a, b) => a.past_seven_day_hours - b.past_seven_day_hours)
    .slice(0, request.numberOfDrivers);

  // Calculate traffic multipliers
  const trafficMultipliers = { 'Low': 1.0, 'Medium': 1.3, 'High': 1.7 };
  
  // Simulate delivery allocation and calculate KPIs
  let totalDeliveries = 0;
  let totalRevenue = 0;
  let totalDeliveryTime = 0;
  let totalDriverHours = 0;
  let onTimeDeliveries = 0;
  let totalDistance = 0;

  // Group orders by route for efficiency
  const ordersByRoute = orders.reduce((acc, order) => {
    if (!acc[order.assigned_route]) acc[order.assigned_route] = [];
    acc[order.assigned_route].push(order);
    return acc;
  }, {});

  // Simulate each driver's deliveries
  selectedDrivers.forEach((driver, index) => {
    let driverHours = 0;
    let driverDeliveries = 0;

    // Assign routes to drivers in round-robin fashion
    const assignedRoutes = routes.filter((_, routeIndex) => 
      routeIndex % selectedDrivers.length === index
    );

    assignedRoutes.forEach(route => {
      const routeOrders = ordersByRoute[route.route_id] || [];
      const trafficMultiplier = trafficMultipliers[route.traffic_level];
      const routeTimeHours = (route.base_time_minutes * trafficMultiplier) / 60;

      routeOrders.forEach(order => {
        if (driverHours + routeTimeHours <= request.maxHoursPerDriver) {
          totalDeliveries++;
          driverDeliveries++;
          totalRevenue += order.value_rs;
          totalDeliveryTime += routeTimeHours;
          driverHours += routeTimeHours;
          totalDistance += route.distance_km;

          // Check if delivery is on time (simplified logic)
          const expectedDeliveryTime = new Date(order.delivery_timestamp);
          const actualDeliveryTime = new Date(expectedDeliveryTime.getTime() + (routeTimeHours * 60 * 60 * 1000));
          if (actualDeliveryTime <= expectedDeliveryTime) {
            onTimeDeliveries++;
          }
        }
      });
    });

    totalDriverHours += driverHours;
  });

  // Calculate fuel cost (₹10 per km)
  const fuelCostPerKm = 10;
  const fuelCost = totalDistance * fuelCostPerKm;

  // Calculate KPIs
  const averageDeliveryTime = totalDeliveries > 0 ? (totalDeliveryTime / totalDeliveries) * 60 : 0; // in minutes
  const driverUtilization = (totalDriverHours / (selectedDrivers.length * request.maxHoursPerDriver)) * 100;
  const onTimeDeliveryRate = totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;
  const costPerDelivery = totalDeliveries > 0 ? fuelCost / totalDeliveries : 0;

  return {
    totalDeliveries,
    totalRevenue,
    averageDeliveryTime: Math.round(averageDeliveryTime),
    driverUtilization: Math.round(driverUtilization * 100) / 100,
    onTimeDeliveryRate: Math.round(onTimeDeliveryRate * 100) / 100,
    fuelCost: Math.round(fuelCost * 100) / 100,
    costPerDelivery: Math.round(costPerDelivery * 100) / 100
  };
}
