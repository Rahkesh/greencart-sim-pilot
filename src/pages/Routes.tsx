
import React from 'react';
import { Layout } from '@/components/Layout';

const Routes = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Route Management</h1>
          <p className="text-muted-foreground">
            Optimize delivery routes and manage traffic conditions
          </p>
        </div>
        
        <div className="rounded-xl bg-gradient-to-br from-info/5 to-primary/5 p-8 text-center border border-info/20">
          <h2 className="text-xl font-semibold mb-2">Route Optimizer</h2>
          <p className="text-muted-foreground">Coming soon - Advanced route planning and optimization</p>
        </div>
      </div>
    </Layout>
  );
};

export default Routes;
