
import React from 'react';
import { Layout } from '@/components/Layout';

const Orders = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">
            Track and manage delivery orders across all routes
          </p>
        </div>
        
        <div className="rounded-xl bg-gradient-to-br from-warning/5 to-accent/5 p-8 text-center border border-warning/20">
          <h2 className="text-xl font-semibold mb-2">Order Tracking</h2>
          <p className="text-muted-foreground">Coming soon - Real-time order tracking and management</p>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
