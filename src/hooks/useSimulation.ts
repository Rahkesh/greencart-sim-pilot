
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
  totalPenalties: number;
  totalBonuses: number;
  overallProfit: number;
  efficiencyScore: number;
}

export const useSimulation = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<KPIResults | null>(null);
  const { toast } = useToast();

  const runSimulation = async (request: SimulationRequest) => {
    setLoading(true);
    try {
      console.log('Invoking simulation with request:', request);
      
      const { data, error } = await supabase.functions.invoke('delivery-simulation', {
        body: request
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Simulation response:', data);

      if (data.error) {
        // Handle structured error responses from backend
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}`
          : data.error;
        
        throw new Error(errorMessage);
      }

      setResults(data.data);
      toast({
        title: "Simulation Completed",
        description: `Successfully processed ${data.data.totalDeliveries} deliveries with ${data.data.efficiencyScore}% efficiency`,
      });

      return data.data;
    } catch (error) {
      console.error('Simulation error:', error);
      
      // Enhanced error handling with specific messages
      let errorMessage = 'Failed to run simulation';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast({
        title: "Simulation Failed",
        description: errorMessage,
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
