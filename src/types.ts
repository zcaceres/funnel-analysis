export interface FunnelStep {
  name: string;
  conversionRate: number; // as decimal (0.03 = 3%)
}

export interface CustomerValue {
  price: number;
  retentionRate?: number; // as decimal (0.8 = 80%)
  ltv: number;
}

export interface FunnelConfig {
  customerValue: CustomerValue;
  maxAcquisitionPercent: number; // as decimal (0.3 = 30%)
  steps: FunnelStep[];
}

export interface StepAnalysis {
  name: string;
  conversionRate: number;
  dollarValue: number;
  percentOfLTV: number;
}

export interface FunnelAnalysisResult {
  steps: StepAnalysis[];
  maxAcquisitionCost: number;
  firstStepValue: number;
  isWithinBudget: boolean;
}
