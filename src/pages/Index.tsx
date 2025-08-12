
import React from 'react';
import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { DeliveryChart } from '@/components/Dashboard/DeliveryChart';
import { FuelChart } from '@/components/Dashboard/FuelChart';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Target,
  Truck,
  Users,
  MapPin
} from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to GreenCart Logistics management system
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Profit"
            value="₹84,250"
            change="+12.5%"
            changeType="positive"
            icon={DollarSign}
            variant="success"
          />
          <StatsCard
            title="Efficiency Score"
            value="87.4%"
            change="+2.1%"
            changeType="positive"
            icon={Target}
            variant="info"
          />
          <StatsCard
            title="Active Drivers"
            value="24"
            change="+3"
            changeType="positive"
            icon={Users}
            variant="default"
          />
          <StatsCard
            title="Delivery Time"
            value="28 min"
            change="-5 min"
            changeType="positive"
            icon={Clock}
            variant="warning"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-6 border border-primary/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Deliveries Today</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 p-6 border border-accent/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Routes</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-gradient-to-br from-success/10 to-success/5 p-6 border border-success/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">94.2%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <DeliveryChart />
          <FuelChart />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
