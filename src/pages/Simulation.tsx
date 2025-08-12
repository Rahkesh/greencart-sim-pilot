
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Play, Loader2 } from 'lucide-react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { Package, TrendingUp, Clock, Fuel, Users, Target } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';

const simulationSchema = z.object({
  numberOfDrivers: z.number().min(1, 'Must have at least 1 driver').max(50, 'Cannot exceed 50 drivers'),
  routeStartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  maxHoursPerDriver: z.number().min(1, 'Must be at least 1 hour').max(24, 'Cannot exceed 24 hours'),
});

type SimulationForm = z.infer<typeof simulationSchema>;

const Simulation = () => {
  const { loading, results, runSimulation, clearResults } = useSimulation();

  const form = useForm<SimulationForm>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      numberOfDrivers: 5,
      routeStartTime: '09:00',
      maxHoursPerDriver: 8,
    },
  });

  const onSubmit = async (data: SimulationForm) => {
    console.log('Running simulation with data:', data);
    
    try {
      await runSimulation({
        numberOfDrivers: data.numberOfDrivers,
        routeStartTime: data.routeStartTime,
        maxHoursPerDriver: data.maxHoursPerDriver,
      });
    } catch (error) {
      console.error('Simulation failed:', error);
      // Error handling is done in the useSimulation hook via toast
    }
  };

  const handleClearResults = () => {
    clearResults();
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
                    name="routeStartTime"
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
                    name="maxHoursPerDriver"
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

                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? (
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
                    {results && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleClearResults}
                        disabled={loading}
                      >
                        Clear Results
                      </Button>
                    )}
                  </div>
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
                    {form.watch('routeStartTime')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Max Hours/Day:</span>
                  <span className="text-sm text-muted-foreground">
                    {form.watch('maxHoursPerDriver')} hours
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Est. Total Hours:</span>
                  <span className="text-sm text-muted-foreground">
                    {(form.watch('numberOfDrivers') || 0) * (form.watch('maxHoursPerDriver') || 0)} hours
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatsCard
                title="Total Deliveries"
                value={results.totalDeliveries.toString()}
                change="+12.5%"
                changeType="positive"
                icon={Package}
                variant="success"
              />
              <StatsCard
                title="Total Revenue"
                value={`₹${results.totalRevenue.toLocaleString()}`}
                change="+8.3%"
                changeType="positive"
                icon={TrendingUp}
                variant="info"
              />
              <StatsCard
                title="Driver Utilization"
                value={`${results.driverUtilization}%`}
                change={results.driverUtilization > 80 ? "+5.2%" : "-2.1%"}
                changeType={results.driverUtilization > 80 ? "positive" : "negative"}
                icon={Users}
                variant="default"
              />
              <StatsCard
                title="Avg Delivery Time"
                value={`${results.averageDeliveryTime} min`}
                change="-3.5%"
                changeType="positive"
                icon={Clock}
                variant="warning"
              />
              <StatsCard
                title="On-Time Rate"
                value={`${results.onTimeDeliveryRate}%`}
                change={results.onTimeDeliveryRate > 90 ? "+2.1%" : "-1.8%"}
                changeType={results.onTimeDeliveryRate > 90 ? "positive" : "negative"}
                icon={Target}
                variant="success"
              />
              <StatsCard
                title="Total Fuel Cost"
                value={`₹${results.fuelCost.toLocaleString()}`}
                change="-4.2%"
                changeType="positive"
                icon={Fuel}
                variant="warning"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
                <CardDescription>
                  Breakdown of simulation results and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Performance Metrics</h4>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">Total Deliveries</span>
                        <span className="text-sm font-bold">{results.totalDeliveries}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">Average Delivery Time</span>
                        <span className="text-sm font-bold">{results.averageDeliveryTime} minutes</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">Driver Utilization</span>
                        <span className="text-sm font-bold">{results.driverUtilization}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">On-Time Delivery Rate</span>
                        <span className="text-sm font-bold">{results.onTimeDeliveryRate}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Financial Summary</h4>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">Total Revenue</span>
                        <span className="text-sm font-bold text-green-600">₹{results.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">Total Fuel Cost</span>
                        <span className="text-sm font-bold text-red-600">₹{results.fuelCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">Cost per Delivery</span>
                        <span className="text-sm font-bold">₹{results.costPerDelivery.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg border border-success/20">
                        <span className="text-sm font-medium">Net Profit</span>
                        <span className="text-sm font-bold text-success">₹{(results.totalRevenue - results.fuelCost).toLocaleString()}</span>
                      </div>
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
