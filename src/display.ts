import type { FunnelAnalysisResult } from './types.js';

export function displayFunnelAnalysis(result: FunnelAnalysisResult, ltv: number): void {
  console.log('\n┌─────────────────────────────────────────────────────────┐');
  console.log('│           CONVERSION FUNNEL ANALYSIS                   │');
  console.log('└─────────────────────────────────────────────────────────┘\n');

  console.log(`💰 Customer LTV: $${ltv.toFixed(2)}`);
  console.log(`🎯 Max Acquisition Cost: $${result.maxAcquisitionCost.toFixed(2)} (${((result.maxAcquisitionCost / ltv) * 100).toFixed(0)}% of LTV)\n`);

  console.log('📊 FUNNEL BREAKDOWN:\n');

  result.steps.forEach((step, index) => {
    const isLast = index === result.steps.length - 1;
    const arrow = isLast ? '' : '   ↓';

    console.log(`${index + 1}. ${step.name}`);
    console.log(`   Conversion: ${(step.conversionRate * 100).toFixed(1)}%`);
    console.log(`   Value at this step: $${step.dollarValue.toFixed(2)} (${step.percentOfLTV.toFixed(1)}% of LTV)`);

    if (!isLast) {
      const nextStepValue = step.dollarValue * step.conversionRate;
      console.log(`   → Max spend per action: $${nextStepValue.toFixed(2)}`);
      console.log(arrow);
    }
  });

  console.log('\n' + '─'.repeat(57) + '\n');

  console.log(`📈 First Step Value: $${result.firstStepValue.toFixed(2)}`);

  if (result.isWithinBudget) {
    console.log(`✅ Within budget! You can spend up to $${result.firstStepValue.toFixed(2)} on the first step.`);
  } else {
    const overage = result.firstStepValue - result.maxAcquisitionCost;
    console.log(`⚠️  Over budget by $${overage.toFixed(2)}. Improve conversion rates or increase LTV.`);
  }

  console.log('');
}
