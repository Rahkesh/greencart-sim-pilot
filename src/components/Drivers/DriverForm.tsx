import React, { useEffect } from 'react';
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
import { Driver } from '@/hooks/useDrivers';

interface DriverFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => void;
  driver?: Driver;
}

export const DriverForm = ({ isOpen, onClose, onSubmit, driver }: DriverFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Driver, 'id' | 'created_at' | 'updated_at'>>({
    defaultValues: {
      name: '',
      current_shift_hours: 0,
      past_seven_day_hours: 0,
      status: 'active'
    }
  });

  useEffect(() => {
    if (driver) {
      reset({
        name: driver.name,
        current_shift_hours: driver.current_shift_hours,
        past_seven_day_hours: driver.past_seven_day_hours,
        status: driver.status
      });
    } else {
      reset({
        name: '',
        current_shift_hours: 0,
        past_seven_day_hours: 0,
        status: 'active'
      });
    }
  }, [driver, reset]);

  const onFormSubmit = (data: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{driver ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Driver Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Driver name is required' })}
              placeholder="Enter driver name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_shift_hours">Current Shift Hours</Label>
            <Input
              id="current_shift_hours"
              type="number"
              step="0.1"
              min="0"
              max="24"
              {...register('current_shift_hours', { 
                required: 'Current shift hours is required',
                min: { value: 0, message: 'Hours cannot be negative' },
                max: { value: 24, message: 'Hours cannot exceed 24' }
              })}
              placeholder="0.0"
            />
            {errors.current_shift_hours && (
              <p className="text-sm text-destructive">{errors.current_shift_hours.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="past_seven_day_hours">Past 7-Day Work Hours</Label>
            <Input
              id="past_seven_day_hours"
              type="number"
              step="0.1"
              min="0"
              max="168"
              {...register('past_seven_day_hours', { 
                required: 'Past 7-day hours is required',
                min: { value: 0, message: 'Hours cannot be negative' },
                max: { value: 168, message: 'Hours cannot exceed 168 (7 * 24)' }
              })}
              placeholder="0.0"
            />
            {errors.past_seven_day_hours && (
              <p className="text-sm text-destructive">{errors.past_seven_day_hours.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register('status', { required: 'Status is required' })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {driver ? 'Update Driver' : 'Add Driver'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
