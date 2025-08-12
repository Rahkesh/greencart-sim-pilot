
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Play, Loader2 } from 'lucide-react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { Package, TrendingUp, Clock, Fuel } from 'lucide-react';

const simulationSchema = z.object({
  numberOfDrivers: z.number().min(1, 'Must have at least 1 driver').max(50, 'Cannot exceed 50 drivers'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  maxHoursPerDay: z.number().min(1, 'Must be at least 1 hour').max(24, 'Cannot exceed 24 hours'),
});

type SimulationForm = z.infer<typeof simulationSchema>;

interface SimulationResults {
  totalProfit: number;
  efficiencyScore: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  totalFuelCost: number;
  totalDeliveries: number;
}

const Simulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimulationResults | null>(null);

  const form = useForm<SimulationForm>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      numberOfDrivers: 5,
      startTime: '09:00',
      maxHoursPerDay: 8,
    },
  });

  const onSubmit = async (data: SimulationForm) => {
    setIsRunning(true);
    console.log('Running simulation with data:', data);
    
    try {
      // TODO: Replace with actual API call to backend
      // const response = await fetch('/api/simulation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // const results = await response.json();
      
      // Mock simulation delay and results for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results based on form inputs
      const mockResults: SimulationResults = {
        totalProfit: Math.round((data.numberOfDrivers * data.maxHoursPerDay * 150) + Math.random() * 1000),
        efficiencyScore: Math.round(75 + Math.random() * 20),
        onTimeDeliveries: Math.round(data.numberOfDrivers * data.maxHoursPerDay * 0.8),
        lateDeliveries: Math.round(data.numberOfDrivers * data.maxHoursPerDay * 0.2),
        totalFuelCost: Math.round(data.numberOfDrivers * data.maxHoursPerDay * 45),
        totalDeliveries: Math.round(data.numberOfDrivers * data.maxHoursPerDay),
      };
      
      setResults(mockResults);
    } catch (error) {
      console.error('Simulation failed:', error);
      // TODO: Add error handling/toast notification
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Simulation</h1>
          <p className="text-muted-foreground">
            Configure simulation parameters and analyze delivery operations performance
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Simulation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Simulation Parameters</CardTitle>
              <CardDescription>
                Set the parameters for your delivery simulation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="numberOfDrivers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Available Drivers</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter number of drivers"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route Start Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            placeholder="HH:MM"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxHoursPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Hours per Driver per Day</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.5"
                            placeholder="Enter max hours"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isRunning}
                    size="lg"
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Running Simulation...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Simulation
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Current Parameters Display */}
          <Card>
            <CardHeader>
              <CardTitle>Current Configuration</CardTitle>
              <CardDescription>
                Review your simulation settings before running
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Drivers:</span>
                  <span className="text-sm text-muted-foreground">
                    {form.watch('numberOfDrivers')} drivers
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Start Time:</span>
                  <span className="text-sm text-muted-foreground">
                    {form.watch('startTime')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Max Hours/Day:</span>
                  <span className="text-sm text-muted-foreground">
                    {form.watch('maxHoursPerDay')} hours
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Est. Total Hours:</span>
                  <span className="text-sm text-muted-foreground">
                    {(form.watch('numberOfDrivers') || 0) * (form.watch('maxHoursPerDay') || 0)} hours
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simulation Results */}
        {results && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Simulation Results</h2>
              <p className="text-muted-foreground">
                KPI analysis based on your simulation parameters
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Profit"
                value={`₹${results.totalProfit.toLocaleString()}`}
                change="+12.5%"
                changeType="positive"
                icon={TrendingUp}
                variant="success"
              />
              <StatsCard
                title="Efficiency Score"
                value={`${results.efficiencyScore}%`}
                change="+5.2%"
                changeType="positive"
                icon={Package}
                variant="info"
              />
              <StatsCard
                title="On-Time Deliveries"
                value={`${results.onTimeDeliveries}/${results.totalDeliveries}`}
                change={`${Math.round((results.onTimeDeliveries / results.totalDeliveries) * 100)}%`}
                changeType="positive"
                icon={Clock}
                variant="default"
              />
              <StatsCard
                title="Total Fuel Cost"
                value={`₹${results.totalFuelCost.toLocaleString()}`}
                change="-8.1%"
                changeType="positive"
                icon={Fuel}
                variant="warning"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
                <CardDescription>
                  Breakdown of simulation results and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Delivery Performance</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Total Deliveries: {results.totalDeliveries}</p>
                      <p>• On-Time: {results.onTimeDeliveries} ({Math.round((results.onTimeDeliveries / results.totalDeliveries) * 100)}%)</p>
                      <p>• Late: {results.lateDeliveries} ({Math.round((results.lateDeliveries / results.totalDeliveries) * 100)}%)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Financial Summary</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Total Revenue: ₹{(results.totalProfit + results.totalFuelCost).toLocaleString()}</p>
                      <p>• Fuel Costs: ₹{results.totalFuelCost.toLocaleString()}</p>
                      <p>• Net Profit: ₹{results.totalProfit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Simulation;
