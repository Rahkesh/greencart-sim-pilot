
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Route {
  id: string;
  routeId: string;
  distanceKm: number;
  trafficLevel: 'Low' | 'Medium' | 'High';
  baseTimeMinutes: number;
}

interface RouteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Route, 'id'>) => void;
  route?: Route;
}

export const RouteForm = ({ isOpen, onClose, onSubmit, route }: RouteFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Route, 'id'>>({
    defaultValues: route || {
      routeId: '',
      distanceKm: 0,
      trafficLevel: 'Low',
      baseTimeMinutes: 0
    }
  });

  const onFormSubmit = (data: Omit<Route, 'id'>) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{route ? 'Edit Route' : 'Add New Route'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="routeId">Route ID</Label>
            <Input
              id="routeId"
              {...register('routeId', { required: 'Route ID is required' })}
              placeholder="Enter route ID (e.g., R001)"
            />
            {errors.routeId && (
              <p className="text-sm text-destructive">{errors.routeId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="distanceKm">Distance (km)</Label>
            <Input
              id="distanceKm"
              type="number"
              step="0.1"
              min="0"
              {...register('distanceKm', { 
                required: 'Distance is required',
                min: { value: 0, message: 'Distance cannot be negative' }
              })}
              placeholder="0.0"
            />
            {errors.distanceKm && (
              <p className="text-sm text-destructive">{errors.distanceKm.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trafficLevel">Traffic Level</Label>
            <select
              id="trafficLevel"
              {...register('trafficLevel', { required: 'Traffic level is required' })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseTimeMinutes">Base Time (minutes)</Label>
            <Input
              id="baseTimeMinutes"
              type="number"
              min="1"
              {...register('baseTimeMinutes', { 
                required: 'Base time is required',
                min: { value: 1, message: 'Base time must be at least 1 minute' }
              })}
              placeholder="30"
            />
            {errors.baseTimeMinutes && (
              <p className="text-sm text-destructive">{errors.baseTimeMinutes.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {route ? 'Update Route' : 'Add Route'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
