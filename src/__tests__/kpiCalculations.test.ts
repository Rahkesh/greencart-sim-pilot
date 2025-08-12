
import { describe, it, expect } from 'vitest';

// Test KPI calculation logic
describe('KPI Calculations', () => {
  describe('Revenue Calculations', () => {
    it('should calculate total revenue correctly', () => {
      const orders = [
        { value: 1000, bonus: 100, penalty: 0 },
        { value: 800, bonus: 0, penalty: 50 },
        { value: 1500, bonus: 150, penalty: 0 }
      ];

      const totalRevenue = orders.reduce((sum, order) => sum + order.value, 0);
      const totalBonuses = orders.reduce((sum, order) => sum + order.bonus, 0);
      const totalPenalties = orders.reduce((sum, order) => sum + order.penalty, 0);

      expect(totalRevenue).toBe(3300);
      expect(totalBonuses).toBe(250);
      expect(totalPenalties).toBe(50);
    });

    it('should calculate profit margins correctly', () => {
      const revenue = 10000;
      const bonuses = 500;
      const penalties = 200;
      const fuelCost = 2000;
      
      const grossRevenue = revenue + bonuses;
      const totalCosts = penalties + fuelCost;
      const profit = grossRevenue - totalCosts;
      const profitMargin = (profit / grossRevenue) * 100;

      expect(grossRevenue).toBe(10500);
      expect(totalCosts).toBe(2200);
      expect(profit).toBe(8300);
      expect(Math.round(profitMargin * 100) / 100).toBe(79.05);
    });
  });

  describe('Driver Utilization Metrics', () => {
    it('should calculate driver utilization percentage', () => {
      const drivers = [
        { hoursWorked: 8, maxHours: 8 },
        { hoursWorked: 6.5, maxHours: 8 },
        { hoursWorked: 7.2, maxHours: 8 }
      ];

      const totalHoursWorked = drivers.reduce((sum, d) => sum + d.hoursWorked, 0);
      const totalMaxHours = drivers.reduce((sum, d) => sum + d.maxHours, 0);
      const utilization = (totalHoursWorked / totalMaxHours) * 100;

      expect(totalHoursWorked).toBe(21.7);
      expect(totalMaxHours).toBe(24);
      expect(Math.round(utilization * 100) / 100).toBe(90.42);
    });

    it('should handle zero max hours scenario', () => {
      const calculateUtilization = (worked: number, max: number): number => {
        return max > 0 ? (worked / max) * 100 : 0;
      };

      expect(calculateUtilization(0, 0)).toBe(0);
      expect(calculateUtilization(5, 0)).toBe(0);
      expect(calculateUtilization(8, 8)).toBe(100);
    });
  });

  describe('Delivery Performance Metrics', () => {
    it('should calculate on-time delivery rate', () => {
      const deliveries = [
        { isOnTime: true },
        { isOnTime: true },
        { isOnTime: false },
        { isOnTime: true },
        { isOnTime: true }
      ];

      const onTimeCount = deliveries.filter(d => d.isOnTime).length;
      const onTimeRate = (onTimeCount / deliveries.length) * 100;

      expect(onTimeCount).toBe(4);
      expect(onTimeRate).toBe(80);
    });

    it('should calculate average delivery time', () => {
      const deliveryTimes = [25, 35, 42, 28, 38, 45, 32]; // minutes

      const totalTime = deliveryTimes.reduce((sum, time) => sum + time, 0);
      const averageTime = totalTime / deliveryTimes.length;

      expect(totalTime).toBe(245);
      expect(Math.round(averageTime)).toBe(35);
    });

    it('should handle empty delivery arrays', () => {
      const calculateAverage = (times: number[]): number => {
        return times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0;
      };

      expect(calculateAverage([])).toBe(0);
      expect(calculateAverage([30])).toBe(30);
      expect(calculateAverage([20, 40])).toBe(30);
    });
  });

  describe('Cost Analysis', () => {
    it('should calculate cost per delivery', () => {
      const totalFuelCost = 5000;
      const totalDeliveries = 25;
      const costPerDelivery = totalFuelCost / totalDeliveries;

      expect(costPerDelivery).toBe(200);
    });

    it('should calculate fuel efficiency metrics', () => {
      const deliveries = [
        { distance: 10, fuelCost: 70 }, // High traffic
        { distance: 8, fuelCost: 40 },  // Low traffic
        { distance: 12, fuelCost: 84 }  // High traffic
      ];

      const totalDistance = deliveries.reduce((sum, d) => sum + d.distance, 0);
      const totalFuelCost = deliveries.reduce((sum, d) => sum + d.fuelCost, 0);
      const fuelEfficiency = totalFuelCost / totalDistance; // Cost per km

      expect(totalDistance).toBe(30);
      expect(totalFuelCost).toBe(194);
      expect(Math.round(fuelEfficiency * 100) / 100).toBe(6.47);
    });
  });

  describe('Efficiency Score Calculations', () => {
    it('should calculate weighted efficiency score', () => {
      const metrics = {
        onTimeRate: 85,      // Weight: 40%
        utilization: 90,     // Weight: 30%
        profitMargin: 75,    // Weight: 20%
        fuelEfficiency: 80   // Weight: 10%
      };

      const weights = {
        onTimeRate: 0.4,
        utilization: 0.3,
        profitMargin: 0.2,
        fuelEfficiency: 0.1
      };

      const weightedScore = 
        metrics.onTimeRate * weights.onTimeRate +
        metrics.utilization * weights.utilization +
        metrics.profitMargin * weights.profitMargin +
        metrics.fuelEfficiency * weights.fuelEfficiency;

      expect(Math.round(weightedScore * 100) / 100).toBe(83.5);
    });

    it('should handle perfect efficiency scenario', () => {
      const perfectMetrics = {
        onTimeRate: 100,
        utilization: 100,
        profitMargin: 100,
        fuelEfficiency: 100
      };

      const efficiencyScore = Object.values(perfectMetrics).reduce((sum, val) => sum + val, 0) / 4;
      expect(efficiencyScore).toBe(100);
    });
  });
});
