
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from '@/components/Dashboard/StatsCard';
import DeliveryChart from '@/components/Dashboard/DeliveryChart';
import FuelChart from '@/components/Dashboard/FuelChart';
import { Truck, Package, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Deliveries"
              value="2,350"
              description="+20.1% from last month"
              icon={Package}
            />
            <StatsCard
              title="Active Drivers"
              value="45"
              description="+2 from last week"
              icon={Truck}
            />
            <StatsCard
              title="Avg Delivery Time"
              value="32 min"
              description="-12% improvement"
              icon={Clock}
            />
            <StatsCard
              title="Fuel Saved"
              value="1,240L"
              description="+15% this month"
              icon={TrendingUp}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <DeliveryChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Fuel Consumption</CardTitle>
                <CardDescription>Monthly fuel usage trends</CardDescription>
              </CardHeader>
              <CardContent>
                <FuelChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Detailed performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Advanced analytics will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
