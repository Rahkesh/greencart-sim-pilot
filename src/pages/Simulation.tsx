
import React from 'react';
import { Layout } from '@/components/Layout';

const Simulation = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Simulation</h1>
          <p className="text-muted-foreground">
            Test different scenarios and optimize delivery operations
          </p>
        </div>
        
        <div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center border border-primary/20">
          <h2 className="text-xl font-semibold mb-2">Simulation Engine</h2>
          <p className="text-muted-foreground">Coming soon - Run delivery simulations with custom parameters</p>
        </div>
      </div>
    </Layout>
  );
};

export default Simulation;
