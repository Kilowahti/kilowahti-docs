# Kilowahti

**Kilowahti** (*kilowatti* + *vahti* — "the kilowatt sentinel") is a [Home Assistant](https://www.home-assistant.io) custom integration for Nordic and Baltic electricity spot price tracking.

It fetches day-ahead hourly or 15-minute spot prices from [spot-hinta.fi](https://spot-hinta.fi), applies your VAT and transfer pricing, and exposes a set of sensors and services you can use in automations, dashboards, and energy management scripts.

## Key features

- Day-ahead spot prices — no API key required
- 15-minute or 1-hour price resolution
- Transfer price tier groups with time-of-use schedules
- Fixed-price contract period management
- Price rank and rank quartile sensors
- Control factor sensors (0–1 and bipolar ±1) for smooth automation
- Optimization scores measuring how well your consumption is shifted to cheap hours
- Service calls for querying prices, finding cheapest windows, and managing contracts

## Supported regions

`FI`, `EE`, `LT`, `LV`, `DK1`, `DK2`, `NO1`, `NO2`, `NO3`, `NO4`, `NO5`, `SE1`, `SE2`, `SE3`, `SE4`

!!! note "Currency notice"
    Kilowahti currently supports only the official electricity market currency EUR. Conversions to DKK, NOK and SEK will become possible later.

## Quick start

1. [Install via HACS](installation.md)
2. Go to **Settings → Devices & Services → Add Integration → Kilowahti**
3. Complete the setup wizard
4. Use the sensors in your dashboards and automations

## Acknowledgments

Kilowahti would not exist without the prior work of **Teemu Mikkonen** and his [spotprices2ha](https://github.com/T3m3z/spotprices2ha) project. That copy-paste solution was the direct inspiration for this integration — it proved the concept, shaped the sensor design, and provided automation patterns that many Finnish HA users have relied on. Thank you, Teemu.

A special thanks also to the Finnish hobbyist behind [spot-hinta.fi](https://spot-hinta.fi) for building and maintaining an excellent, free, and easy-to-use electricity price API that makes projects like this possible.

## Credits

Kilowahti was created by Jessi Björk, building on the foundation of spotprices2ha to bring richer functionality to her home automation.
