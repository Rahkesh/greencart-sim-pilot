
-- Create drivers table
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  current_shift_hours DECIMAL(4,2) NOT NULL DEFAULT 0 CHECK (current_shift_hours >= 0 AND current_shift_hours <= 24),
  past_seven_day_hours DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (past_seven_day_hours >= 0 AND past_seven_day_hours <= 168),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create routes table
CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id TEXT NOT NULL UNIQUE,
  distance_km DECIMAL(6,2) NOT NULL CHECK (distance_km > 0),
  traffic_level TEXT NOT NULL CHECK (traffic_level IN ('Low', 'Medium', 'High')),
  base_time_minutes INTEGER NOT NULL CHECK (base_time_minutes > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  value_rs DECIMAL(10,2) NOT NULL CHECK (value_rs >= 0),
  assigned_route TEXT NOT NULL,
  delivery_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-transit', 'delivered', 'delayed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (assigned_route) REFERENCES public.routes(route_id) ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_drivers_status ON public.drivers(status);
CREATE INDEX idx_routes_route_id ON public.routes(route_id);
CREATE INDEX idx_orders_order_id ON public.orders(order_id);
CREATE INDEX idx_orders_assigned_route ON public.orders(assigned_route);
CREATE INDEX idx_orders_delivery_timestamp ON public.orders(delivery_timestamp);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Enable Row Level Security (RLS) - for future authentication if needed
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now (can be restricted later with authentication)
CREATE POLICY "Allow all operations on drivers" ON public.drivers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on routes" ON public.routes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON public.routes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
