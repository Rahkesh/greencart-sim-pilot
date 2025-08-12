
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RouteForm } from '@/components/Routes/RouteForm';
import { Plus, Edit, Trash2, MapPin, Clock, TrendingUp } from 'lucide-react';

interface Route {
  id: string;
  routeId: string;
  distanceKm: number;
  trafficLevel: 'Low' | 'Medium' | 'High';
  baseTimeMinutes: number;
}

const Routes = () => {
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: '1',
      routeId: 'R001',
      distanceKm: 12.5,
      trafficLevel: 'Medium',
      baseTimeMinutes: 35
    },
    {
      id: '2',
      routeId: 'R002',
      distanceKm: 8.2,
      trafficLevel: 'Low',
      baseTimeMinutes: 25
    },
    {
      id: '3',
      routeId: 'R003',
      distanceKm: 15.8,
      trafficLevel: 'High',
      baseTimeMinutes: 50
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | undefined>();

  const handleAddRoute = (routeData: Omit<Route, 'id'>) => {
    const newRoute: Route = {
      ...routeData,
      id: Date.now().toString()
    };
    setRoutes([...routes, newRoute]);
  };

  const handleEditRoute = (routeData: Omit<Route, 'id'>) => {
    if (editingRoute) {
      setRoutes(routes.map(route => 
        route.id === editingRoute.id 
          ? { ...routeData, id: editingRoute.id }
          : route
      ));
      setEditingRoute(undefined);
    }
  };

  const handleDeleteRoute = (id: string) => {
    setRoutes(routes.filter(route => route.id !== id));
  };

  const openEditForm = (route: Route) => {
    setEditingRoute(route);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRoute(undefined);
  };

  const totalDistance = routes.reduce((sum, r) => sum + r.distanceKm, 0);
  const avgTime = routes.reduce((sum, r) => sum + r.baseTimeMinutes, 0) / routes.length || 0;
  const highTrafficRoutes = routes.filter(r => r.trafficLevel === 'High').length;

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-success/10 text-success';
      case 'Medium': return 'bg-warning/10 text-warning';
      case 'High': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Route Management</h1>
            <p className="text-muted-foreground">
              Optimize delivery routes and manage traffic conditions
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Route
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{routes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDistance.toFixed(1)} km</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Base Time</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgTime.toFixed(0)} min</div>
            </CardContent>
          </Card>
        </div>

        {/* Routes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Routes List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route ID</TableHead>
                  <TableHead>Distance (km)</TableHead>
                  <TableHead>Traffic Level</TableHead>
                  <TableHead>Base Time (min)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.routeId}</TableCell>
                    <TableCell>{route.distanceKm} km</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTrafficColor(route.trafficLevel)}`}>
                        {route.trafficLevel}
                      </span>
                    </TableCell>
                    <TableCell>{route.baseTimeMinutes} min</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditForm(route)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRoute(route.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <RouteForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={editingRoute ? handleEditRoute : handleAddRoute}
          route={editingRoute}
        />
      </div>
    </Layout>
  );
};

export default Routes;
