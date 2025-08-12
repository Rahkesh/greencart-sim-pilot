
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SimulationRequest, KPIResults } from './useSimulation';

export interface SimulationHistoryItem {
  id: string;
  simulation_parameters: SimulationRequest;
  results: KPIResults;
  created_at: string;
  updated_at: string;
}

export const useSimulationHistory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch simulation history
  const {
    data: history = [],
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ['simulation-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('simulation_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching simulation history:', error);
        throw error;
      }

      // Type cast the data to our expected format with proper type conversion
      return (data || []).map(item => ({
        id: item.id,
        simulation_parameters: item.simulation_parameters as unknown as SimulationRequest,
        results: item.results as unknown as KPIResults,
        created_at: item.created_at,
        updated_at: item.updated_at
      })) as SimulationHistoryItem[];
    },
  });

  // Save simulation result
  const saveSimulationMutation = useMutation({
    mutationFn: async ({ parameters, results }: { parameters: SimulationRequest; results: KPIResults }) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('simulation_results')
        .insert({
          user_id: user.id,
          simulation_parameters: parameters as any,
          results: results as any,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving simulation result:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulation-history'] });
      toast({
        title: "Simulation Saved",
        description: "Simulation results have been saved to history.",
      });
    },
    onError: (error: any) => {
      console.error('Error saving simulation:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save simulation results. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete simulation result
  const deleteSimulationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('simulation_results')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting simulation result:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulation-history'] });
      toast({
        title: "Simulation Deleted",
        description: "Simulation result has been removed from history.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting simulation:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete simulation result. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    history,
    loading,
    error,
    saveSimulation: saveSimulationMutation.mutate,
    deleteSimulation: deleteSimulationMutation.mutate,
    isSaving: saveSimulationMutation.isPending,
    isDeleting: deleteSimulationMutation.isPending,
  };
};
