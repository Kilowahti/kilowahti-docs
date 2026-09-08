# Fixed-price periods

Fixed-price periods let you define date ranges where a flat contract price replaces the spot price. This is useful if you have a fixed-price electricity contract for part of the year, or continuously if your entire contract is fixed-rate.

## How it works

When a fixed period is active:

- `sensor.kilowahti_{name}_effective_price` (**Active price**) returns the fixed price instead of the spot price
- `sensor.kilowahti_{name}_total_price` = fixed price + transfer price
- `binary_sensor.kilowahti_{name}_fixed_period_active` turns on
- The `price_acceptable` binary sensor compares against the fixed price
- `sensor.kilowahti_{name}_price_rank` reads 1 for every slot, and `control_factor_price` a constant 1.0 — with one price all day, no hour is better than another. `total_price_rank` still separates the hours if your transfer tariff has tiers

The spot price sensor continues to show the live spot price regardless, so you can still see what the market is doing.

## Managing periods

Periods can be managed via **Configure → Fixed-price periods** or using service calls.

!!! note
    Periods cannot overlap. The price is entered **gross (VAT included)** and used as-is.

### Via the UI

**Configure → Fixed-price periods → ➕ Add period**

### Via service calls

```yaml
# Add a period
service: kilowahti.add_fixed_period
data:
  label: "Q1 2026 fixation"
  start_date: "2026-01-01"
  end_date: "2026-03-31"
  price: 8.5

# List all periods (to get IDs)
service: kilowahti.list_fixed_periods
data: {}

# Remove a period
service: kilowahti.remove_fixed_period
data:
  period_id: "3f4a1b2c-..."
```
