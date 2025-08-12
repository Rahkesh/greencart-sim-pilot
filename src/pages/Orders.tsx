
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OrderForm } from '@/components/Orders/OrderForm';
import { Plus, Edit, Trash2, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  orderId: string;
  valueRs: number;
  assignedRoute: string;
  deliveryTimestamp: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderId: 'ORD001',
      valueRs: 1250.00,
      assignedRoute: 'R001',
      deliveryTimestamp: '2025-01-15T14:30:00',
      status: 'delivered'
    },
    {
      id: '2',
      orderId: 'ORD002',
      valueRs: 850.50,
      assignedRoute: 'R002',
      deliveryTimestamp: '2025-01-15T16:00:00',
      status: 'in-transit'
    },
    {
      id: '3',
      orderId: 'ORD003',
      valueRs: 2100.75,
      assignedRoute: 'R003',
      deliveryTimestamp: '2025-01-15T18:45:00',
      status: 'pending'
    },
    {
      id: '4',
      orderId: 'ORD004',
      valueRs: 675.25,
      assignedRoute: 'R001',
      deliveryTimestamp: '2025-01-15T12:15:00',
      status: 'delayed'
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>();

  const handleAddOrder = (orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString()
    };
    setOrders([...orders, newOrder]);
  };

  const handleEditOrder = (orderData: Omit<Order, 'id'>) => {
    if (editingOrder) {
      setOrders(orders.map(order => 
        order.id === editingOrder.id 
          ? { ...orderData, id: editingOrder.id }
          : order
      ));
      setEditingOrder(undefined);
    }
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  const openEditForm = (order: Order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingOrder(undefined);
  };

  const totalValue = orders.reduce((sum, o) => sum + o.valueRs, 0);
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const delayedOrders = orders.filter(o => o.status === 'delayed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning';
      case 'in-transit': return 'bg-info/10 text-info';
      case 'delivered': return 'bg-success/10 text-success';
      case 'delayed': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'in-transit': return <Package className="h-3 w-3" />;
      case 'delivered': return <CheckCircle className="h-3 w-3" />;
      case 'delayed': return <AlertCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
            <p className="text-muted-foreground">
              Track and manage delivery orders across all routes
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Order
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{deliveredOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delayed</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{delayedOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Value (₹)</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Delivery Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>₹{order.valueRs.toFixed(2)}</TableCell>
                    <TableCell>{order.assignedRoute}</TableCell>
                    <TableCell>{formatDate(order.deliveryTimestamp)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditForm(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <OrderForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={editingOrder ? handleEditOrder : handleAddOrder}
          order={editingOrder}
        />
      </div>
    </Layout>
  );
};

export default Orders;
