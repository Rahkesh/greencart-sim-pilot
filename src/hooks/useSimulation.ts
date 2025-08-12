
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SimulationRequest {
  numberOfDrivers: number;
  routeStartTime: string;
  maxHoursPerDriver: number;
}

export interface KPIResults {
  totalDeliveries: number;
  totalRevenue: number;
  averageDeliveryTime: number;
  driverUtilization: number;
  onTimeDeliveryRate: number;
  fuelCost: number;
  costPerDelivery: number;
}

export const useSimulation = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<KPIResults | null>(null);
  const { toast } = useToast();

  const runSimulation = async (request: SimulationRequest) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('delivery-simulation', {
        body: request
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data.data);
      toast({
        title: "Success",
        description: "Simulation completed successfully",
      });

      return data.data;
    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to run simulation",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    results,
    runSimulation,
    clearResults: () => setResults(null)
  };
};
