
import React from 'react';
import { Layout } from '@/components/Layout';

const Settings = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences and company rules
          </p>
        </div>
        
        <div className="rounded-xl bg-gradient-to-br from-secondary/5 to-muted/5 p-8 text-center border border-secondary/20">
          <h2 className="text-xl font-semibold mb-2">System Configuration</h2>
          <p className="text-muted-foreground">Coming soon - Company rules and system settings</p>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
