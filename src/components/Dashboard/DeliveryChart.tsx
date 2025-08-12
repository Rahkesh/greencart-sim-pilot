
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', onTime: 45, late: 5 },
  { name: 'Tue', onTime: 52, late: 3 },
  { name: 'Wed', onTime: 48, late: 7 },
  { name: 'Thu', onTime: 61, late: 4 },
  { name: 'Fri', onTime: 55, late: 8 },
  { name: 'Sat', onTime: 67, late: 2 },
  { name: 'Sun', onTime: 43, late: 6 },
];

export const DeliveryChart = () => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Delivery Performance
          <span className="ml-auto text-sm font-normal text-muted-foreground">Last 7 days</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="onTime" fill="hsl(var(--chart-1))" name="On Time" radius={[4, 4, 0, 0]} />
              <Bar dataKey="late" fill="hsl(var(--chart-2))" name="Late" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
