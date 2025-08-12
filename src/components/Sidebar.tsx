
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Play, 
  Users, 
  Route, 
  Package, 
  Settings,
  History,
  Truck
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Simulation', href: '/simulation', icon: Play },
  { name: 'History', href: '/history', icon: History },
  { name: 'Drivers', href: '/drivers', icon: Users },
  { name: 'Routes', href: '/routes', icon: Route },
  { name: 'Orders', href: '/orders', icon: Package },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center space-x-2">
          <Truck className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">DeliveryOS</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
