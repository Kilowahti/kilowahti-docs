# Transfer pricing

Transfer pricing lets you include your network operator's distribution tariff in price calculations and sensors.

## Groups and tiers

Transfer pricing is organised into **groups**, each containing one or more **tiers**. Only one group is active at a time — this lets you store multiple contracts (e.g. seasonal or time-of-use) and switch between them without re-entering data.

Each tier defines a price and a time schedule:

| Field | Description |
|---|---|
| Price | c/kWh, gross (VAT included) |
| Months active | Which months this tier applies |
| Weekdays active | Which days of the week |
| Start / end time | Hour range (start inclusive, end exclusive) |
| Priority | Lower number = evaluated first; first matching tier wins |

!!! tip
    Add a base rate tier with no time restrictions at the lowest priority as a catch-all. This ensures a transfer price is always matched.

## Effect on sensors and binary sensors

When a transfer group is active:

- `sensor.{name}_transfer_price` shows the current tier's price
- `sensor.{name}_total_price` = effective price + transfer price
- `sensor.{name}_control_factor_transfer` shows the current tier's normalized rank (0 = cheapest tier today, 1 = most expensive)
- The `price_acceptable` binary sensor can optionally include transfer price in its comparison (configured via **Max price includes transfer**)

## Switching groups

Go to **Options → Transfer pricing**, select a group, and choose **Set as active group**.
