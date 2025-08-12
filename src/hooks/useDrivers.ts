
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Driver {
  id: string;
  name: string;
  current_shift_hours: number;
  past_seven_day_hours: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure status field matches our interface
      const typedDrivers = (data || []).map(driver => ({
        ...driver,
        status: driver.status as 'active' | 'inactive'
      })) as Driver[];
      
      setDrivers(typedDrivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch drivers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async (driverData: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .insert([driverData])
        .select()
        .single();

      if (error) throw error;
      
      const typedDriver = {
        ...data,
        status: data.status as 'active' | 'inactive'
      } as Driver;
      
      setDrivers(prev => [typedDriver, ...prev]);
      toast({
        title: "Success",
        description: "Driver added successfully",
      });
    } catch (error) {
      console.error('Error adding driver:', error);
      toast({
        title: "Error",
        description: "Failed to add driver",
        variant: "destructive",
      });
    }
  };

  const updateDriver = async (id: string, driverData: Partial<Driver>) => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .update(driverData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const typedDriver = {
        ...data,
        status: data.status as 'active' | 'inactive'
      } as Driver;
      
      setDrivers(prev => prev.map(driver => driver.id === id ? typedDriver : driver));
      toast({
        title: "Success",
        description: "Driver updated successfully",
      });
    } catch (error) {
      console.error('Error updating driver:', error);
      toast({
        title: "Error",
        description: "Failed to update driver",
        variant: "destructive",
      });
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDrivers(prev => prev.filter(driver => driver.id !== id));
      toast({
        title: "Success",
        description: "Driver deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast({
        title: "Error",
        description: "Failed to delete driver",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return {
    drivers,
    loading,
    addDriver,
    updateDriver,
    deleteDriver,
    refetch: fetchDrivers
  };
};
