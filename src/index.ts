#!/usr/bin/env bun
import * as clack from '@clack/prompts';
import { calculateLTV, analyzeFunnel } from './calculator.js';
import { displayFunnelAnalysis } from './display.js';
import type { FunnelStep, CustomerValue, FunnelConfig } from './types.js';

async function main() {
  console.clear();

  clack.intro('🎯 Conversion Funnel Analyzer');

  // Get LTV information
  const ltvMethod = await clack.select({
    message: 'How would you like to specify customer value?',
    options: [
      { value: 'calculate', label: 'Calculate from price & retention rate' },
      { value: 'direct', label: 'Enter LTV directly' }
    ]
  });

  if (clack.isCancel(ltvMethod)) {
    clack.cancel('Operation cancelled');
    process.exit(0);
  }

  let customerValue: CustomerValue;

  if (ltvMethod === 'calculate') {
    const price = await clack.text({
      message: 'What is the customer price? (e.g., 100)',
      validate: (value) => {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) return 'Please enter a valid positive number';
      }
    });

    if (clack.isCancel(price)) {
      clack.cancel('Operation cancelled');
      process.exit(0);
    }

    const retentionRate = await clack.text({
      message: 'What is the retention rate? (e.g., 80 for 80%)',
      validate: (value) => {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0 || num >= 100) return 'Please enter a number between 0 and 100';
      }
    });

    if (clack.isCancel(retentionRate)) {
      clack.cancel('Operation cancelled');
      process.exit(0);
    }

    const priceNum = parseFloat(price as string);
    const retentionNum = parseFloat(retentionRate as string) / 100;
    const ltv = calculateLTV(priceNum, retentionNum);

    customerValue = {
      price: priceNum,
      retentionRate: retentionNum,
      ltv
    };

    clack.note(`LTV calculated: $${ltv.toFixed(2)}`, 'Customer Lifetime Value');
  } else {
    const ltv = await clack.text({
      message: 'What is the customer LTV? (e.g., 1000)',
      validate: (value) => {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) return 'Please enter a valid positive number';
      }
    });

    if (clack.isCancel(ltv)) {
      clack.cancel('Operation cancelled');
      process.exit(0);
    }

    customerValue = {
      price: parseFloat(ltv as string),
      ltv: parseFloat(ltv as string)
    };
  }

  // Get max acquisition percentage
  const maxAcquisition = await clack.text({
    message: 'Maximum % of LTV to spend on acquisition? (default: 30)',
    placeholder: '30',
    defaultValue: '30'
  });

  if (clack.isCancel(maxAcquisition)) {
    clack.cancel('Operation cancelled');
    process.exit(0);
  }

  const maxAcquisitionPercent = parseFloat((maxAcquisition as string) || '30') / 100;

  // Build funnel steps
  clack.note('Now let\'s build your funnel. Add steps from first touch to close.', 'Build Funnel');

  const steps: FunnelStep[] = [];
  let addingSteps = true;

  while (addingSteps) {
    const stepName = await clack.text({
      message: `Step ${steps.length + 1} name: (e.g., "Cold Email", "Demo Call")`,
      validate: (value) => {
        if (!value || value.trim().length === 0) return 'Please enter a step name';
      }
    });

    if (clack.isCancel(stepName)) {
      clack.cancel('Operation cancelled');
      process.exit(0);
    }

    const conversionRate = await clack.text({
      message: `Conversion rate for "${stepName}"? (e.g., 3 for 3%)`,
      validate: (value) => {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0 || num > 100) return 'Please enter a number between 0 and 100';
      }
    });

    if (clack.isCancel(conversionRate)) {
      clack.cancel('Operation cancelled');
      process.exit(0);
    }

    steps.push({
      name: stepName as string,
      conversionRate: parseFloat(conversionRate as string) / 100
    });

    const continueAdding = await clack.confirm({
      message: 'Add another step?'
    });

    if (clack.isCancel(continueAdding)) {
      clack.cancel('Operation cancelled');
      process.exit(0);
    }

    addingSteps = continueAdding as boolean;
  }

  // Analyze funnel
  const config: FunnelConfig = {
    customerValue,
    maxAcquisitionPercent,
    steps
  };

  const s = clack.spinner();
  s.start('Analyzing funnel...');
  await new Promise(resolve => setTimeout(resolve, 500)); // Dramatic pause 😄
  const result = analyzeFunnel(config);
  s.stop('Analysis complete!');

  // Display results
  displayFunnelAnalysis(result, customerValue.ltv);

  // Ask to run again
  const runAgain = await clack.confirm({
    message: 'Run another analysis?'
  });

  if (clack.isCancel(runAgain) || !runAgain) {
    clack.outro('Thanks for using Funnel Analyzer! 👋');
    process.exit(0);
  } else {
    await main();
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
