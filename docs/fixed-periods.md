# Fixed-price periods

Fixed-price periods let you define date ranges where a flat contract price replaces the spot price. This is useful if you have a fixed-price electricity contract for part of the year.

## How it works

When a fixed period is active:

- `sensor.kilowahti_{name}_effective_price` returns the fixed price instead of the spot price
- `sensor.kilowahti_{name}_total_price` = fixed price + transfer price
- `binary_sensor.kilowahti_{name}_fixed_period_active` turns on
- The `price_acceptable` binary sensor compares against the fixed price

The spot price sensor continues to show the live spot price regardless.

## Managing periods

Periods can be managed via **Options → Fixed-price periods** or using service calls.

!!! note
    Periods cannot overlap. The price is entered **gross (VAT included)** and used as-is.

### Via the UI

**Options → Fixed-price periods → ➕ Add period**

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
