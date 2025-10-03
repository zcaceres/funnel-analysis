import type { FunnelConfig, FunnelAnalysisResult, StepAnalysis } from './types.js';

export function calculateLTV(price: number, retentionRate: number): number {
  // LTV = price / (1 - retention rate)
  return price / (1 - retentionRate);
}

export function analyzeFunnel(config: FunnelConfig): FunnelAnalysisResult {
  const { customerValue, maxAcquisitionPercent, steps } = config;
  const ltv = customerValue.ltv;

  // Calculate max acquisition cost
  const maxAcquisitionCost = ltv * maxAcquisitionPercent;

  // Work backwards through the funnel
  const stepAnalysis: StepAnalysis[] = [];
  let currentValue = ltv;

  // Reverse steps to go from close to first touch
  for (let i = steps.length - 1; i >= 0; i--) {
    const step = steps[i];

    stepAnalysis.unshift({
      name: step.name,
      conversionRate: step.conversionRate,
      dollarValue: currentValue,
      percentOfLTV: (currentValue / ltv) * 100
    });

    // Calculate value at previous step
    // Previous step value = current value * conversion rate
    if (i > 0) {
      currentValue = currentValue * step.conversionRate;
    }
  }

  const firstStepValue = stepAnalysis[0].dollarValue * steps[0].conversionRate;
  const isWithinBudget = firstStepValue <= maxAcquisitionCost;

  return {
    steps: stepAnalysis,
    maxAcquisitionCost,
    firstStepValue,
    isWithinBudget
  };
}
