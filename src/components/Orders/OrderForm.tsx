
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

interface Order {
  id: string;
  orderId: string;
  valueRs: number;
  assignedRoute: string;
  deliveryTimestamp: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
}

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Order, 'id'>) => void;
  order?: Order;
}

export const OrderForm = ({ isOpen, onClose, onSubmit, order }: OrderFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Order, 'id'>>({
    defaultValues: order || {
      orderId: '',
      valueRs: 0,
      assignedRoute: '',
      deliveryTimestamp: '',
      status: 'pending'
    }
  });

  const onFormSubmit = (data: Omit<Order, 'id'>) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{order ? 'Edit Order' : 'Add New Order'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              {...register('orderId', { required: 'Order ID is required' })}
              placeholder="Enter order ID (e.g., ORD001)"
            />
            {errors.orderId && (
              <p className="text-sm text-destructive">{errors.orderId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="valueRs">Value (₹)</Label>
            <Input
              id="valueRs"
              type="number"
              step="0.01"
              min="0"
              {...register('valueRs', { 
                required: 'Order value is required',
                min: { value: 0, message: 'Value cannot be negative' }
              })}
              placeholder="0.00"
            />
            {errors.valueRs && (
              <p className="text-sm text-destructive">{errors.valueRs.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedRoute">Assigned Route</Label>
            <Input
              id="assignedRoute"
              {...register('assignedRoute', { required: 'Assigned route is required' })}
              placeholder="Enter route ID (e.g., R001)"
            />
            {errors.assignedRoute && (
              <p className="text-sm text-destructive">{errors.assignedRoute.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryTimestamp">Delivery Timestamp</Label>
            <Input
              id="deliveryTimestamp"
              type="datetime-local"
              {...register('deliveryTimestamp', { required: 'Delivery timestamp is required' })}
            />
            {errors.deliveryTimestamp && (
              <p className="text-sm text-destructive">{errors.deliveryTimestamp.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register('status', { required: 'Status is required' })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="pending">Pending</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {order ? 'Update Order' : 'Add Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
