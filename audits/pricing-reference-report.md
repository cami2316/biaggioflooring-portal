# Pricing Reference Report

Date: 2026-03-03

## Summary
This report lists all pricing constants currently used by the estimate calculator. Update this list whenever pricing changes are required.

## Base Rates (per sqft)
- Floor (ceramic): 4.2
- Floor (porcelain): 4.5
- Floor (marble): 6.0
- Wall (ceramic): 10.0
- Wall (porcelain): 12.0
- Wall (marble): 15.0
- Backsplash (ceramic): 16.0
- Backsplash (porcelain): 17.0
- Backsplash (marble): 20.0
- Shower floor with compacted pan: 35.0
- Shower wall (ceramic): 10.0
- Shower wall (porcelain): 12.0
- Shower wall (marble): 15.0

## Layout Multipliers (added to base rate)
- Diagonal: +0.75
- Herringbone: +1.5
 - All others: +1.5

## Extras
- Demolition (per sqft): 1.75
- Cement board (per sqft): 3.0
- Niche (per unit): 300.0
- Bench (per unit): 150.0
- Window (per unit): 100.0

## Range Logic
- Base total = sum of (sqft * adjusted base rate)
- Extras total = sum of extras
- Labor range:
  - Min = total
  - Max = total * 1.18

## Source
- Pricing constants: lib/pricing.ts
