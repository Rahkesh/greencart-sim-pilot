
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
import { DriverForm } from '@/components/Drivers/DriverForm';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  currentShiftHours: number;
  pastSevenDayHours: number;
  status: 'active' | 'inactive';
}

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'John Smith',
      currentShiftHours: 6.5,
      pastSevenDayHours: 45.5,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      currentShiftHours: 8.0,
      pastSevenDayHours: 52.0,
      status: 'active'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      currentShiftHours: 0,
      pastSevenDayHours: 38.5,
      status: 'inactive'
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>();

  const handleAddDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: Date.now().toString()
    };
    setDrivers([...drivers, newDriver]);
  };

  const handleEditDriver = (driverData: Omit<Driver, 'id'>) => {
    if (editingDriver) {
      setDrivers(drivers.map(driver => 
        driver.id === editingDriver.id 
          ? { ...driverData, id: editingDriver.id }
          : driver
      ));
      setEditingDriver(undefined);
    }
  };

  const handleDeleteDriver = (id: string) => {
    setDrivers(drivers.filter(driver => driver.id !== id));
  };

  const openEditForm = (driver: Driver) => {
    setEditingDriver(driver);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingDriver(undefined);
  };

  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const totalHours = drivers.reduce((sum, d) => sum + d.currentShiftHours, 0);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Driver Management</h1>
            <p className="text-muted-foreground">
              Manage your delivery team and track performance
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Driver
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drivers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
              <Users className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{activeDrivers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Active Hours</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            </CardContent>
          </Card>
        </div>

        {/* Drivers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Drivers List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Current Shift Hours</TableHead>
                  <TableHead>Past 7-Day Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>{driver.currentShiftHours}h</TableCell>
                    <TableCell>{driver.pastSevenDayHours}h</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        driver.status === 'active' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {driver.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditForm(driver)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDriver(driver.id)}
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

        <DriverForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={editingDriver ? handleEditDriver : handleAddDriver}
          driver={editingDriver}
        />
      </div>
    </Layout>
  );
};

export default Drivers;
