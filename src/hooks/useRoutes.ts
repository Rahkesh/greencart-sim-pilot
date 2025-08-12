
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Route {
  id: string;
  route_id: string;
  distance_km: number;
  traffic_level: 'Low' | 'Medium' | 'High';
  base_time_minutes: number;
  created_at: string;
  updated_at: string;
}

export const useRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoutes(data || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch routes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addRoute = async (routeData: Omit<Route, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .insert([routeData])
        .select()
        .single();

      if (error) throw error;
      setRoutes(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Route added successfully",
      });
    } catch (error) {
      console.error('Error adding route:', error);
      toast({
        title: "Error",
        description: "Failed to add route",
        variant: "destructive",
      });
    }
  };

  const updateRoute = async (id: string, routeData: Partial<Route>) => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .update(routeData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRoutes(prev => prev.map(route => route.id === id ? data : route));
      toast({
        title: "Success",
        description: "Route updated successfully",
      });
    } catch (error) {
      console.error('Error updating route:', error);
      toast({
        title: "Error",
        description: "Failed to update route",
        variant: "destructive",
      });
    }
  };

  const deleteRoute = async (id: string) => {
    try {
      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRoutes(prev => prev.filter(route => route.id !== id));
      toast({
        title: "Success",
        description: "Route deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting route:', error);
      toast({
        title: "Error",
        description: "Failed to delete route",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return {
    routes,
    loading,
    addRoute,
    updateRoute,
    deleteRoute,
    refetch: fetchRoutes
  };
};
