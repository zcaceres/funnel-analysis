# Funnel Analysis

A CLI tool for analyzing conversion funnels and calculating optimal customer acquisition costs.

## What it does

This tool helps you:
- Calculate customer lifetime value (LTV) from price and retention rate, or enter it directly
- Set maximum acquisition cost as a percentage of LTV
- Build multi-step conversion funnels
- Analyze funnel performance and costs at each step

## Installation

```bash
bun install
```

## Usage

```bash
bun start
```

Follow the interactive prompts to:
1. Input customer value (calculate LTV or enter directly)
2. Set your max acquisition budget
3. Build your funnel by adding steps and conversion rates
4. View the analysis results

## Example Output

```
┌─────────────────────────────────────────────────────────┐
│           CONVERSION FUNNEL ANALYSIS                   │
└─────────────────────────────────────────────────────────┘

💰 Customer LTV: $1200.00
🎯 Max Acquisition Cost: $360.00 (30% of LTV)

📊 FUNNEL BREAKDOWN:

1. Ad Click
   Conversion: 2.0%
   Value at this step: $360.00 (30.0% of LTV)
   → Max spend per action: $7.20
   ↓
2. Landing Page Visit
   Conversion: 15.0%
   Value at this step: $1800.00 (150.0% of LTV)
   → Max spend per action: $270.00
   ↓
3. Sign Up
   Conversion: 40.0%
   Value at this step: $1800.00 (150.0% of LTV)
   → Max spend per action: $720.00
   ↓
4. Purchase
   Conversion: 50.0%
   Value at this step: $1800.00 (150.0% of LTV)

─────────────────────────────────────────────────────────

📈 First Step Value: $360.00
✅ Within budget! You can spend up to $360.00 on the first step.
```

## Requirements

- [Bun](https://bun.sh) runtime
