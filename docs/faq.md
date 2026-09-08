# FAQ

## Why are tomorrow's prices not showing?

Day-ahead prices are published per market in the early afternoon Central European Time (around 13:00 CET; some markets, such as Italy, publish later). Kilowahti starts polling automatically at 13:00 CET by default and retries once per minute until 21:00 CET or until prices appear (both hours are configurable in Advanced options). The `binary_sensor.kilowahti_{name}_tomorrow_s_prices_available` turns on when they arrive.

## How often does Kilowahti call the API?

Typically 2–3 times per day:

1. On HA startup (if the local cache is stale)
2. Once when tomorrow's prices become available (early afternoon CET)
3. At midnight rollover if the tomorrow cache was empty

Sensor value updates (rank, price, etc.) happen from the in-memory cache — no network calls.

## Can I use Kilowahti without a transfer price configured?

Yes. Transfer-related sensors (`transfer_price`, `control_factor_transfer`) show as **unavailable** when no transfer groups are configured. `total_price` then equals the active price.

## What does the control factor sensor do?

It turns the current price rank into a 0–1 number — 1.0 at the cheapest slot of the day, 0.0 at the most expensive — for automating devices that have a dial rather than a switch: heating setpoints, charging current, fan speed. There is a ±1 bipolar variant of each.

The [control factor guide](control-factor.md) covers which of the three factors to use, what the curve and scaling settings do, and how to put one into a template.

## My score sensors show no value — why?

Score sensors only produce a value once at least one meter reading has been recorded. Make sure you have linked an energy meter entity in **Configure → Score profiles → Edit: Total** and that the meter has `state_class: total_increasing`.

## Prices look wrong — are they VAT inclusive?

Spot prices from the API are always VAT-exclusive. Kilowahti applies VAT automatically using the rate you configured. Transfer tier and fixed period prices are entered gross (VAT included) and used as-is.

## Where do prices come from?

Kilowahti fetches prices through an automatic source chain — there is no source setting.
The primary source is the Kilowahti CDN, Kilowahti's own first-party service: it publishes
day-ahead prices for all supported regions from the ENTSO-E Transparency Platform (the
official European market data source) as static JSON through a European CDN (content delivery network). No account or
API key is needed, and no personal data is collected.

If the CDN cannot be reached, Kilowahti falls back to the free third-party API
spot-hinta.fi. Both serve the same day-ahead exchange prices, so sensor values are identical
either way. Note that spot-hinta.fi only covers the Nordic and Baltic zones; in other regions
the Kilowahti CDN is the only source, so there is no fallback (options are being looked at, promise).

The diagnostic sensor `price_data_source` shows which source is currently in use.

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
