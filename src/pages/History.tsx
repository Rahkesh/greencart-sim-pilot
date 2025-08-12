
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import SimulationHistory from '@/components/SimulationHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { Package, TrendingUp, Clock, Fuel, Users, Target, AlertTriangle, Gift } from 'lucide-react';
import { SimulationHistoryItem } from '@/hooks/useSimulationHistory';

const History = () => {
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationHistoryItem | null>(null);

  const handleSelectSimulation = (simulation: SimulationHistoryItem) => {
    setSelectedSimulation(simulation);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Simulation History</h1>
          <p className="text-muted-foreground">
            View and analyze past simulation results
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* History List */}
          <div className="lg:col-span-1">
            <SimulationHistory onSelectSimulation={handleSelectSimulation} />
          </div>

          {/* Selected Simulation Details */}
          <div className="lg:col-span-2">
            {selectedSimulation ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Simulation Details</CardTitle>
                    <CardDescription>
                      Results from {new Date(selectedSimulation.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Drivers:</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedSimulation.simulation_parameters.numberOfDrivers} drivers
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Start Time:</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedSimulation.simulation_parameters.routeStartTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Max Hours/Driver:</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedSimulation.simulation_parameters.maxHoursPerDriver} hours
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* KPI Results */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                  <StatsCard
                    title="Total Deliveries"
                    value={selectedSimulation.results.totalDeliveries.toString()}
                    change="+12.5%"
                    changeType="positive"
                    icon={Package}
                    variant="success"
                  />
                  <StatsCard
                    title="Overall Profit"
                    value={`₹${selectedSimulation.results.overallProfit.toLocaleString()}`}
                    change={selectedSimulation.results.overallProfit > 0 ? "+15.2%" : "-8.5%"}
                    changeType={selectedSimulation.results.overallProfit > 0 ? "positive" : "negative"}
                    icon={TrendingUp}
                    variant={selectedSimulation.results.overallProfit > 0 ? "success" : "warning"}
                  />
                  <StatsCard
                    title="Efficiency Score"
                    value={`${selectedSimulation.results.efficiencyScore}%`}
                    change={selectedSimulation.results.efficiencyScore > 80 ? "+5.2%" : "-3.1%"}
                    changeType={selectedSimulation.results.efficiencyScore > 80 ? "positive" : "negative"}
                    icon={Target}
                    variant={selectedSimulation.results.efficiencyScore > 80 ? "success" : "warning"}
                  />
                  <StatsCard
                    title="Driver Utilization"
                    value={`${selectedSimulation.results.driverUtilization}%`}
                    change={selectedSimulation.results.driverUtilization > 80 ? "+5.2%" : "-2.1%"}
                    changeType={selectedSimulation.results.driverUtilization > 80 ? "positive" : "negative"}
                    icon={Users}
                    variant="default"
                  />
                </div>

                {/* Financial Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                    <CardDescription>
                      Complete breakdown of simulation financial results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">Total Revenue</span>
                        <span className="text-sm font-bold text-green-600">₹{selectedSimulation.results.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm font-medium">Bonuses Earned</span>
                        <span className="text-sm font-bold text-green-600">+₹{selectedSimulation.results.totalBonuses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <span className="text-sm font-medium">Penalties Applied</span>
                        <span className="text-sm font-bold text-red-600">-₹{selectedSimulation.results.totalPenalties.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">Total Fuel Cost</span>
                        <span className="text-sm font-bold text-red-600">-₹{selectedSimulation.results.fuelCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg border border-success/20">
                        <span className="text-sm font-medium">Overall Profit</span>
                        <span className={`text-sm font-bold ${
                          selectedSimulation.results.overallProfit >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          ₹{selectedSimulation.results.overallProfit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a Simulation</h3>
                    <p className="text-muted-foreground">
                      Choose a simulation from the history to view detailed results
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default History;
