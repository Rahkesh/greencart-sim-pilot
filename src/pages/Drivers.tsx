
import React from 'react';
import { Layout } from '@/components/Layout';

const Drivers = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Driver Management</h1>
          <p className="text-muted-foreground">
            Manage your delivery team and track performance
          </p>
        </div>
        
        <div className="rounded-xl bg-gradient-to-br from-success/5 to-primary/5 p-8 text-center border border-success/20">
          <h2 className="text-xl font-semibold mb-2">Driver Database</h2>
          <p className="text-muted-foreground">Coming soon - Complete CRUD operations for drivers</p>
        </div>
      </div>
    </Layout>
  );
};

export default Drivers;
