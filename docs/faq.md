# FAQ

## Why are tomorrow's prices not showing?

Day-ahead prices are published by the exchange around 14:00–15:00 EET (13:00–14:00 CET). Kilowahti starts polling automatically at 14:00 local time by default and retries once per minute until 21:00 or until prices appear. The `binary_sensor.kilowahti_{name}_tomorrow_available` turns on when they arrive.

## How often does Kilowahti call the API?

Typically 2–3 times per day:

1. On HA startup (if the local cache is stale)
2. Once when tomorrow's prices become available (~14:00–15:00 EET)
3. At midnight rollover if the tomorrow cache was empty

Sensor value updates (rank, price, etc.) happen from the in-memory cache — no network calls.

## Can I use Kilowahti without a transfer price configured?

Yes. Transfer-related sensors (`transfer_price`, `control_factor_transfer`) show as **unavailable** when no transfer groups are configured. `total_price` will equal `effective_price`.

## What does the control factor sensor do?

It provides a smooth 0–1 value you can feed directly into automations or scripts to modulate device power or setpoints based on price. 1.0 = cheapest slot, 0.0 = most expensive. Use `control_factor_price_bipolar` for a ±1 version.

## My score sensors show no value — why?

Score sensors only produce a value once at least one meter reading has been recorded. Make sure you have linked an energy meter entity in **Options → Score profiles → Edit: Total** and that the meter has `state_class: total_increasing`.

## Prices look wrong — are they VAT inclusive?

Spot prices from the API are always VAT-exclusive. Kilowahti applies VAT automatically using the rate you configured. Transfer tier and fixed period prices are entered gross (VAT included) and used as-is.

## What happens if the API is unavailable?

Kilowahti continues serving data from its local cache. As long as the cache holds valid slots for the current day, all sensors update normally — no network call is needed for each update. If the cache is empty or stale and a fetch fails, price sensors will become unavailable. It is worth testing your automations to ensure they behave safely (fail-closed) when sensors are unavailable.

## Can I have multiple Kilowahti instances?

Yes — add the integration multiple times with different names and regions. Service calls that don't specify `config_entry_id` work automatically when only one instance is configured.
