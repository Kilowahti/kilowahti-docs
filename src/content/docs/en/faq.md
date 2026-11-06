---
title: "FAQ"
---

## Why are tomorrow's prices not showing?

Day-ahead prices are published in the early afternoon, usually a little after 13:00 CET, and Kilowahti fetches them automatically. Until then the `tomorrow_*` sensors read *unknown*, which is expected. For the details, and what to check if they never arrive, see [Tomorrow's prices are missing](/en/troubleshooting/#tomorrows-prices-are-missing).

## How often does Kilowahti call the price source?

Kilowahti calls the price source (the Kilowahti CDN, or spot-hinta.fi as a fallback) rarely, and the calls are small. On a normal day:

1. On HA startup, if the local cache is stale
2. From the start of the eager-polling window (13:00 CET by default) once a minute until tomorrow's prices are published, usually no more than 15 minutes. The first successful fetch ends the polling for the day
3. At midnight rollover, only if the tomorrow cache was empty

Regions with a non-euro currency also fetch the ECB exchange rate once a day. Sensor value updates (rank, price, etc.) come from the in-memory cache, with no network calls.

## Can I use Kilowahti without a transfer price configured?

Yes. Transfer-related sensors (`transfer_price`, `control_factor_transfer`) show as **Unknown** when no transfer groups are configured. `total_price` then equals the active price.

## What does the control factor sensor do?

It turns the current price rank into a 0–1 number — 1.0 at the cheapest slot of the day, 0.0 at the most expensive — for automating devices that have a dial rather than a switch: heating setpoints, charging current, fan speed. Each control factor also has a bipolar variant on a ±1 scale.

The [control factor guide](/en/control-factor/) covers which of the three factors to use, what the curve and scaling settings do, and how to put one into a template.

## My score sensors show no value, why?

Score sensors only produce a value once an energy meter is linked and has recorded consumption. See [The score sensor has no value](/en/troubleshooting/#the-score-sensor-has-no-value) for the setup it needs.

## Prices look wrong — are they VAT inclusive?

Spot prices from the API are always VAT-exclusive. Kilowahti applies VAT automatically using the rate you configured. Transfer prices and fixed-period prices are entered gross (VAT included) in Kilowahti's settings and used as-is. If your prices still differ from your bill, see [Prices do not match my bill](/en/troubleshooting/#prices-do-not-match-my-bill).

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

Kilowahti continues serving data from its local cache. As long as the cache holds valid slots for the current day, all sensors update normally — no network call is needed for each update. If the cache is empty or stale and every source in the chain fails, price sensors will become unavailable. It is worth testing your automations to ensure they behave safely (fail-closed) when sensors are unavailable. If no prices arrive at all, see [No prices at all](/en/troubleshooting/#no-prices-at-all) for what to check.

## How does local currency display work?

Regions outside the eurozone can show all prices in the local billing currency (see
[Configuration](/en/configuration/#display-currency-non-eur-regions-only)). Electricity market trading always happens in EUR, and Kilowahti converts prices with a daily exchange rate. By default the ECB reference rate is used, or alternatively a manual rate you enter. The rate is frozen for the whole day, so already
published slot prices never shift mid-day. Switching between EUR and local currency
converts your entered prices (commission, transfer tiers, fixed periods, thresholds)
automatically. Note that Home Assistant long-term statistics recorded before a currency
switch keep their old unit and are not converted.

## Can I have multiple Kilowahti instances?

Yes. Add more entries to the Kilowahti integration with different names and regions (**Settings → Devices & Services → Kilowahti → Add entry**). Service calls that don't specify `config_entry_id` work automatically when only one instance is configured.
