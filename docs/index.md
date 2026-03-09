# Kilowahti

**Kilowahti** (*kilowatti* + *vahti* — "the kilowatt sentinel") is a [Home Assistant](https://www.home-assistant.io) custom integration for Nordic and Baltic electricity spot price tracking.

It fetches real-time hourly or 15-minute spot prices from [spot-hinta.fi](https://spot-hinta.fi), applies your VAT and transfer pricing, and exposes a set of sensors and services you can use in automations, dashboards, and energy management scripts.

## Key features

- Real-time spot prices — no API key required
- 15-minute or 1-hour price resolution
- Transfer price tier groups with time-of-use schedules
- Fixed-price contract period management
- Price rank and rank quartile sensors
- Control factor sensors (0–1 and bipolar ±1) for smooth automation
- Optimization scores measuring how well your consumption is shifted to cheap hours
- Service calls for querying prices, finding cheapest windows, and managing contracts

## Supported regions

`FI`, `EE`, `LT`, `LV`, `DK1`, `DK2`, `NO1`, `NO2`, `NO3`, `NO4`, `NO5`, `SE1`, `SE2`, `SE3`, `SE4`

## Quick start

1. [Install via HACS](installation.md)
2. Go to **Settings → Devices & Services → Add Integration → Kilowahti**
3. Complete the setup wizard
4. Use the sensors in your dashboards and automations
