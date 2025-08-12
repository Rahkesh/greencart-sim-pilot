
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSimulationHistory } from '@/hooks/useSimulationHistory';
import { Calendar, Trash2, Eye, Users, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SimulationHistoryProps {
  onSelectSimulation?: (simulation: any) => void;
}

const SimulationHistory: React.FC<SimulationHistoryProps> = ({ onSelectSimulation }) => {
  const { history, loading, deleteSimulation, isDeleting } = useSimulationHistory();
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteSimulation(id);
  };

  const handleViewDetails = (simulation: any) => {
    setSelectedSimulation(simulation.id);
    if (onSelectSimulation) {
      onSelectSimulation(simulation);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Loading simulation history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No simulation history found</p>
            <p className="text-sm text-muted-foreground">Run your first simulation to see results here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Simulation History</h3>
        <p className="text-sm text-muted-foreground">
          View and manage past simulation results
        </p>
      </div>

      <div className="space-y-4">
        {history.map((simulation) => (
          <Card key={simulation.id} className={`transition-all ${
            selectedSimulation === simulation.id ? 'ring-2 ring-primary' : ''
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-sm">
                    {format(new Date(simulation.created_at), 'MMM dd, yyyy • HH:mm')}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(simulation)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Simulation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this simulation result? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(simulation.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Drivers</p>
                    <p className="text-sm font-medium">{simulation.simulation_parameters.numberOfDrivers}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Start Time</p>
                    <p className="text-sm font-medium">{simulation.simulation_parameters.routeStartTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Deliveries</p>
                    <p className="text-sm font-medium">{simulation.results.totalDeliveries}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={simulation.results.overallProfit > 0 ? "default" : "destructive"}>
                    ₹{simulation.results.overallProfit.toLocaleString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimulationHistory;
