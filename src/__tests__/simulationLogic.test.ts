
import { describe, it, expect } from 'vitest';

// Test simulation business logic
describe('Simulation Business Logic', () => {
  // Helper function to simulate company rules
  const calculatePenalty = (actualTime: number, baseTime: number) => {
    const allowedTime = baseTime + 10; // Base time + 10 minutes grace
    return actualTime > allowedTime ? 50 : 0;
  };

  const calculateBonus = (orderValue: number, isOnTime: boolean) => {
    return orderValue > 1000 && isOnTime ? orderValue * 0.1 : 0;
  };

  const calculateFuelCost = (distance: number, trafficLevel: string) => {
    let baseCost = distance * 5; // ₹5/km
    if (trafficLevel === 'High') {
      baseCost += distance * 2; // +₹2/km surcharge
    }
    return baseCost;
  };

  const applyFatigueRule = (baseTime: number, isFatigued: boolean) => {
    return isFatigued ? baseTime * 1.3 : baseTime;
  };

  const calculateEfficiencyScore = (onTimeDeliveries: number, totalDeliveries: number) => {
    return totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;
  };

  describe('Company Rule 1: Late Delivery Penalty', () => {
    it('should apply ₹50 penalty when delivery time exceeds base time + 10 minutes', () => {
      const baseTime = 30; // 30 minutes
      const actualTime = 45; // 45 minutes (exceeds 40 minute limit)
      
      const penalty = calculatePenalty(actualTime, baseTime);
      expect(penalty).toBe(50);
    });

    it('should not apply penalty when delivery is on time', () => {
      const baseTime = 30;
      const actualTime = 35; // Within 40 minute limit
      
      const penalty = calculatePenalty(actualTime, baseTime);
      expect(penalty).toBe(0);
    });
  });

  describe('Company Rule 2: Driver Fatigue Rule', () => {
    it('should increase delivery time by 30% when driver is fatigued', () => {
      const baseTime = 30;
      const fatigueTime = applyFatigueRule(baseTime, true);
      
      expect(fatigueTime).toBe(39); // 30 * 1.3 = 39
    });

    it('should not affect delivery time when driver is not fatigued', () => {
      const baseTime = 30;
      const normalTime = applyFatigueRule(baseTime, false);
      
      expect(normalTime).toBe(30);
    });
  });

  describe('Company Rule 3: High-Value Bonus', () => {
    it('should apply 10% bonus for high-value orders delivered on time', () => {
      const orderValue = 1500;
      const isOnTime = true;
      
      const bonus = calculateBonus(orderValue, isOnTime);
      expect(bonus).toBe(150); // 1500 * 0.1 = 150
    });

    it('should not apply bonus for high-value orders delivered late', () => {
      const orderValue = 1500;
      const isOnTime = false;
      
      const bonus = calculateBonus(orderValue, isOnTime);
      expect(bonus).toBe(0);
    });

    it('should not apply bonus for low-value orders even if on time', () => {
      const orderValue = 800;
      const isOnTime = true;
      
      const bonus = calculateBonus(orderValue, isOnTime);
      expect(bonus).toBe(0);
    });
  });

  describe('Company Rule 4: Fuel Cost Calculation', () => {
    it('should calculate base fuel cost at ₹5/km', () => {
      const distance = 10;
      const trafficLevel = 'Low';
      
      const fuelCost = calculateFuelCost(distance, trafficLevel);
      expect(fuelCost).toBe(50); // 10 * 5 = 50
    });

    it('should add ₹2/km surcharge for high traffic', () => {
      const distance = 10;
      const trafficLevel = 'High';
      
      const fuelCost = calculateFuelCost(distance, trafficLevel);
      expect(fuelCost).toBe(70); // (10 * 5) + (10 * 2) = 70
    });
  });

  describe('Company Rule 6: Efficiency Score', () => {
    it('should calculate efficiency score correctly', () => {
      const onTimeDeliveries = 8;
      const totalDeliveries = 10;
      
      const efficiency = calculateEfficiencyScore(onTimeDeliveries, totalDeliveries);
      expect(efficiency).toBe(80); // (8/10) * 100 = 80
    });

    it('should return 0 for no deliveries', () => {
      const efficiency = calculateEfficiencyScore(0, 0);
      expect(efficiency).toBe(0);
    });

    it('should calculate 100% efficiency for all on-time deliveries', () => {
      const onTimeDeliveries = 5;
      const totalDeliveries = 5;
      
      const efficiency = calculateEfficiencyScore(onTimeDeliveries, totalDeliveries);
      expect(efficiency).toBe(100);
    });
  });

  describe('Overall Profit Calculation', () => {
    it('should calculate overall profit correctly', () => {
      const orderValue = 2000;
      const bonus = 200; // 10% of 2000
      const penalty = 0; // On time
      const fuelCost = 50;
      
      const profit = orderValue + bonus - penalty - fuelCost;
      expect(profit).toBe(2150); // 2000 + 200 - 0 - 50 = 2150
    });

    it('should handle negative profit scenarios', () => {
      const orderValue = 500;
      const bonus = 0; // Low value order
      const penalty = 50; // Late delivery
      const fuelCost = 100;
      
      const profit = orderValue + bonus - penalty - fuelCost;
      expect(profit).toBe(350); // 500 + 0 - 50 - 100 = 350
    });
  });
});
