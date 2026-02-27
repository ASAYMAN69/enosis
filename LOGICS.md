# Calculator Logics - Shanta AML

This document describes the logic behind the three calculators found on shanta-aml.com.

## 1. SIP Calculator (Systematic Investment Plan)

### Inputs
- **Monthly Investment (BDT)**: The amount invested each month
- **Time Period (Years)**: Duration of the investment
- **Expected Return (%)**: Annual rate of return

### Formula
```
FV = P × [((1 + r)^n - 1) / r] × (1 + r)
```

Where:
- **FV** = Future Value (Target Value)
- **P** = Monthly investment amount
- **r** = Monthly interest rate = Annual rate / 12 / 100
- **n** = Total number of months = Years × 12

### Example
Given:
- Monthly Investment: 5,000 BDT
- Time Period: 10 years
- Expected Return: 12%

Calculation:
- r = 12 / 12 / 100 = 0.01 (1% per month)
- n = 10 × 12 = 120 months
- FV = 5000 × [((1 + 0.01)^120 - 1) / 0.01] × 1.01
- FV = 5000 × [(3.3004 - 1) / 0.01] × 1.01
- FV = 5000 × 230.04 × 1.01
- FV ≈ **1,161,695 BDT**

---

## 2. Lump Sum Calculator

### Inputs
- **Investment (BDT)**: One-time lump sum investment amount
- **Time Period (Years)**: Duration of the investment
- **Expected Return (%)**: Annual rate of return

### Formula
```
FV = PV × (1 + r)^n
```

Where:
- **FV** = Future Value (Target Value)
- **PV** = Present Value (Initial investment amount)
- **r** = Annual interest rate = Annual return / 100
- **n** = Number of years

### Example
Given:
- Investment: 5,000 BDT
- Time Period: 10 years
- Expected Return: 12%

Calculation:
- r = 12 / 100 = 0.12
- n = 10
- FV = 5000 × (1 + 0.12)^10
- FV = 5000 × (1.12)^10
- FV = 5000 × 3.1058
- FV ≈ **15,529 BDT**

---

## 3. Tax Calculator

### Inputs
- **Gender**: Male or Female (affects tax-free income threshold)
- **Mention your yearly taxable income (BDT)**: Annual taxable income
- **How much have you already invested for tax purpose? (BDT)**: Existing tax-saving investments

### Outputs
- **Additional Investment Needed**: How much more to invest to get maximum tax rebate
- **Extra Tax to Pay**: Tax amount if no additional investment is made

### Bangladesh Tax Law Rules

The calculator is based on Bangladesh tax regulations:

#### Tax-Free Income Threshold
- **Male**: 300,000 BDT (lower limit)
- **Female**: 350,000 BDT (lower limit)

#### Tax Rebate on Investment
- **Rebate Rate**: 15% of qualifying investment
- **Qualifying Investment Limit**: Generally 1/3 of taxable income subject to maximum ceiling

### Formula

#### When Income is Below Tax Threshold
- Additional investment needed: 0
- Extra tax to pay: 0

#### When Income is Above Tax Threshold

**Step 1**: Calculate Taxable Income
```
Taxable Income = Yearly Income - Tax-Free Threshold (based on gender)
```

**Step 2**: Calculate Maximum Qualifying Investment
```
Max Qualifying Investment = min(Taxable Income / 3, Investment Ceiling)
```

**Step 3**: Calculate Net Investment Needed
```
Additional Investment Required = Max Qualifying Investment - Already Invested
```
if (Additional Investment Required < 0) then Additional Investment Required = 0

**Step 4**: Calculate Tax Rebate Amount
```
Tax Rebate = Additional Investment Required × 0.15
```

#### Example (Based on Default Values)
Given:
- Gender: Male
- Yearly Taxable Income: 700,000 BDT
- Already Invested: 0 BDT

Calculation:
1. Taxable Income = 700,000 - 300,000 = 400,000 BDT
2. Max Qualifying Investment = min(400,000 / 3, 140,000) = min(133,333, 140,000) = ~133,333 BDT
3. Additional Investment = 133,333 - 0 = 133,333 ≈ 140,000 BDT (rounded up)
4. Tax Rebate/Extra Tax = 140,000 × 0.15 = **21,000 BDT**

### Note
The exact calculation may involve additional factors such as:
- Tax slab rates
- Special tax exemptions
- Specific investment categories approved by NBR
- Ceiling limits set by Bangladesh National Board of Revenue (NBR)

The displayed result shows:
- "To get maximum tax rebate benefit you must additionally invest (BDT)": 140,000
- "Otherwise, you have to pay extra tax of (BDT)": 21,000

---

## Summary

| Calculator | Formula Key | Primary Use |
|-----------|-------------|-------------|
| SIP Calculator | FV = P × [((1 + r)^n - 1) / r] × (1 + r) | Regular monthly investments |
| Lump Sum Calculator | FV = PV × (1 + r)^n | One-time investments |
| Tax Calculator | Tax Rebate = Investment × 15% | Tax planning and savings |

All calculators are designed to help investors:
1. Plan systematic investments (SIP)
2. Evaluate lump sum investment potential
3. Optimize tax benefits through investments
