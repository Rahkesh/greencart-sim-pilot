
import { describe, it, expect } from 'vitest';

// Test data validation and sanitization
describe('Data Validation', () => {
  describe('Driver Data Validation', () => {
    it('should validate driver information', () => {
      const validateDriver = (driver: any): { valid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (!driver.name || typeof driver.name !== 'string' || driver.name.trim().length < 2) {
          errors.push('Driver name must be at least 2 characters long');
        }

        if (!driver.phone || !/^\+?[\d\s\-\(\)]{10,}$/.test(driver.phone)) {
          errors.push('Valid phone number is required');
        }

        if (driver.past_seven_day_hours && (typeof driver.past_seven_day_hours !== 'number' || driver.past_seven_day_hours < 0 || driver.past_seven_day_hours > 168)) {
          errors.push('Past seven day hours must be between 0 and 168');
        }

        if (!['active', 'inactive', 'on-leave'].includes(driver.status)) {
          errors.push('Status must be active, inactive, or on-leave');
        }

        return {
          valid: errors.length === 0,
          errors
        };
      };

      // Valid driver
      const validDriver = {
        name: 'John Doe',
        phone: '+1234567890',
        past_seven_day_hours: 40,
        status: 'active'
      };

      expect(validateDriver(validDriver).valid).toBe(true);

      // Invalid driver
      const invalidDriver = {
        name: 'J',
        phone: '123',
        past_seven_day_hours: 200,
        status: 'unknown'
      };

      const result = validateDriver(invalidDriver);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(4);
    });
  });

  describe('Route Data Validation', () => {
    it('should validate route information', () => {
      const validateRoute = (route: any): { valid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (!route.route_name || typeof route.route_name !== 'string' || route.route_name.trim().length < 3) {
          errors.push('Route name must be at least 3 characters long');
        }

        if (!route.start_location || !route.end_location) {
          errors.push('Start and end locations are required');
        }

        if (route.distance_km && (typeof route.distance_km !== 'number' || route.distance_km <= 0)) {
          errors.push('Distance must be a positive number');
        }

        if (route.base_time_minutes && (typeof route.base_time_minutes !== 'number' || route.base_time_minutes <= 0)) {
          errors.push('Base time must be a positive number');
        }

        if (!['Low', 'Medium', 'High'].includes(route.traffic_level)) {
          errors.push('Traffic level must be Low, Medium, or High');
        }

        return {
          valid: errors.length === 0,
          errors
        };
      };

      // Valid route
      const validRoute = {
        route_name: 'Downtown Express',
        start_location: 'Warehouse A',
        end_location: 'Business District',
        distance_km: 15.5,
        base_time_minutes: 30,
        traffic_level: 'Medium'
      };

      expect(validateRoute(validRoute).valid).toBe(true);

      // Invalid route
      const invalidRoute = {
        route_name: 'AB',
        start_location: '',
        distance_km: -5,
        base_time_minutes: 0,
        traffic_level: 'Extreme'
      };

      const result = validateRoute(invalidRoute);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(5);
    });
  });

  describe('Order Data Validation', () => {
    it('should validate order information', () => {
      const validateOrder = (order: any): { valid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (!order.customer_name || typeof order.customer_name !== 'string' || order.customer_name.trim().length < 2) {
          errors.push('Customer name must be at least 2 characters long');
        }

        if (!order.delivery_address || typeof order.delivery_address !== 'string' || order.delivery_address.trim().length < 5) {
          errors.push('Delivery address must be at least 5 characters long');
        }

        if (order.value_rs && (typeof order.value_rs !== 'number' || order.value_rs <= 0)) {
          errors.push('Order value must be a positive number');
        }

        if (!['pending', 'in-transit', 'delivered', 'cancelled'].includes(order.status)) {
          errors.push('Status must be pending, in-transit, delivered, or cancelled');
        }

        if (order.priority && !['low', 'medium', 'high', 'urgent'].includes(order.priority)) {
          errors.push('Priority must be low, medium, high, or urgent');
        }

        return {
          valid: errors.length === 0,
          errors
        };
      };

      // Valid order
      const validOrder = {
        customer_name: 'Alice Smith',
        delivery_address: '123 Main Street, City',
        value_rs: 1250.50,
        status: 'pending',
        priority: 'high'
      };

      expect(validateOrder(validOrder).valid).toBe(true);

      // Invalid order
      const invalidOrder = {
        customer_name: 'A',
        delivery_address: '123',
        value_rs: -100,
        status: 'unknown',
        priority: 'extreme'
      };

      const result = validateOrder(invalidOrder);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(5);
    });
  });

  describe('Simulation Parameter Validation', () => {
    it('should validate simulation parameters', () => {
      const validateSimulationParams = (params: any): { valid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (!params.numberOfDrivers || !Number.isInteger(params.numberOfDrivers) || params.numberOfDrivers <= 0 || params.numberOfDrivers > 100) {
          errors.push('Number of drivers must be an integer between 1 and 100');
        }

        if (!params.routeStartTime || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(params.routeStartTime)) {
          errors.push('Route start time must be in HH:MM format');
        }

        if (!params.maxHoursPerDriver || typeof params.maxHoursPerDriver !== 'number' || params.maxHoursPerDriver <= 0 || params.maxHoursPerDriver > 24) {
          errors.push('Max hours per driver must be between 0.1 and 24');
        }

        return {
          valid: errors.length === 0,
          errors
        };
      };

      // Valid parameters
      const validParams = {
        numberOfDrivers: 5,
        routeStartTime: '09:00',
        maxHoursPerDriver: 8
      };

      expect(validateSimulationParams(validParams).valid).toBe(true);

      // Invalid parameters
      const invalidParams = {
        numberOfDrivers: 0,
        routeStartTime: '25:00',
        maxHoursPerDriver: 25
      };

      const result = validateSimulationParams(invalidParams);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(3);
    });
  });
});
