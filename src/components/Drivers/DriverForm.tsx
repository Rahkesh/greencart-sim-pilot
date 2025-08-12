
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

interface Driver {
  id: string;
  name: string;
  currentShiftHours: number;
  pastSevenDayHours: number;
  status: 'active' | 'inactive';
}

interface DriverFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Driver, 'id'>) => void;
  driver?: Driver;
}

export const DriverForm = ({ isOpen, onClose, onSubmit, driver }: DriverFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Driver, 'id'>>({
    defaultValues: driver || {
      name: '',
      currentShiftHours: 0,
      pastSevenDayHours: 0,
      status: 'active'
    }
  });

  const onFormSubmit = (data: Omit<Driver, 'id'>) => {
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
            <Label htmlFor="currentShiftHours">Current Shift Hours</Label>
            <Input
              id="currentShiftHours"
              type="number"
              step="0.1"
              min="0"
              max="24"
              {...register('currentShiftHours', { 
                required: 'Current shift hours is required',
                min: { value: 0, message: 'Hours cannot be negative' },
                max: { value: 24, message: 'Hours cannot exceed 24' }
              })}
              placeholder="0.0"
            />
            {errors.currentShiftHours && (
              <p className="text-sm text-destructive">{errors.currentShiftHours.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pastSevenDayHours">Past 7-Day Work Hours</Label>
            <Input
              id="pastSevenDayHours"
              type="number"
              step="0.1"
              min="0"
              max="168"
              {...register('pastSevenDayHours', { 
                required: 'Past 7-day hours is required',
                min: { value: 0, message: 'Hours cannot be negative' },
                max: { value: 168, message: 'Hours cannot exceed 168 (7 * 24)' }
              })}
              placeholder="0.0"
            />
            {errors.pastSevenDayHours && (
              <p className="text-sm text-destructive">{errors.pastSevenDayHours.message}</p>
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
