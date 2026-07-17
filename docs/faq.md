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

The convention of "cheaper = higher value" makes it natural to use as a multiplier for scaling setpoints, charging currents, etc. See [Automation guides → Proportional control](automations.md#proportional-control-thermostat-climate) for a thermostat example.

## What is the difference between linear and sinusoidal control factor curves?

Both curves map your current price rank to a 0–1 control factor value, but they distribute sensitivity differently across the price range.

**Linear** is a straight-line mapping: if you have 24 hourly slots, each rank step changes the factor by exactly the same amount (roughly 0.04). The cheapest slot gets 1.0, the most expensive gets 0.0, and everything in between is evenly spaced. This is the simplest option and works well when you want proportional response across the entire price range.

**Sinusoidal** uses a sine curve that is steeper in the middle and flatter near the extremes. In practice this means:

- When prices are very cheap (high factor) or very expensive (low factor), small rank changes barely move the factor — the curve is nearly flat at the top and bottom.
- Around mid-range prices, the factor changes more rapidly for each rank step.

This is useful when you want your automations to react strongly to whether prices are "roughly average" versus "clearly cheap or expensive", but not overreact to minor differences among the cheapest or most expensive slots.

**The scaling exponent** (1–3) amplifies the effect of either curve. At 1.0 the curve behaves as described above. Higher values push mid-range values closer to 0, making the factor more "binary" — it stays near 1.0 only for the cheapest slots and drops off more steeply. This is independent of the curve shape: you can combine sinusoidal with a higher exponent for an even more aggressive response.

For most users, **linear with scaling 1.0** is a good starting point. Switch to sinusoidal if you find your automations are toggling too frequently between adjacent price ranks.

## My score sensors show no value — why?

Score sensors only produce a value once at least one meter reading has been recorded. Make sure you have linked an energy meter entity in **Options → Score profiles → Edit: Total** and that the meter has `state_class: total_increasing`.

## Prices look wrong — are they VAT inclusive?

Spot prices from the API are always VAT-exclusive. Kilowahti applies VAT automatically using the rate you configured. Transfer tier and fixed period prices are entered gross (VAT included) and used as-is.

## Where do prices come from?

Kilowahti fetches prices through an automatic source chain — there is no source setting.
The primary source is `cdn.kilowahti.fi`, Kilowahti's own first-party service: it publishes
day-ahead prices for all supported regions from the ENTSO-E Transparency Platform (the
official European market data source) as static JSON through a European CDN. No account or
API key is needed, and no personal data is collected. If the CDN cannot be reached,
Kilowahti falls back to the free third-party API spot-hinta.fi. Both serve the same
day-ahead exchange prices, so sensor values are identical either way. The diagnostic sensor
`price_data_source` shows which source is currently in use.

## What happens if the price sources are unavailable?

Kilowahti continues serving data from its local cache. As long as the cache holds valid slots for the current day, all sensors update normally — no network call is needed for each update. If the cache is empty or stale and every source in the chain fails, price sensors will become unavailable. It is worth testing your automations to ensure they behave safely (fail-closed) when sensors are unavailable.

## How does local currency display work?

Regions outside the eurozone can show all prices in the local billing currency (see
[Configuration](configuration.md#display-currency-non-eur-regions)). The market always
trades in EUR; Kilowahti converts with a daily exchange rate — the ECB reference rate by
default, or a manual rate you enter. The rate is frozen for the whole day, so already
published slot prices never shift mid-day. Switching between EUR and local currency
converts your entered prices (commission, transfer tiers, fixed periods, thresholds)
automatically. Note that Home Assistant long-term statistics recorded before a currency
switch keep their old unit and are not converted.

## Can I have multiple Kilowahti instances?

Yes — add the integration multiple times with different names and regions. Service calls that don't specify `config_entry_id` work automatically when only one instance is configured.
