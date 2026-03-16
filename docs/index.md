<h1 markdown="1">
![Kilowahti](assets/logo.png#only-light){ style="max-width: 400px; width: 100%;" }
![Kilowahti](assets/dark_logo.png#only-dark){ style="max-width: 400px; width: 100%;" }
</h1>

**Kilowahti** (*kilowatti* + *vahti* — "the kilowatt sentinel") is a [Home Assistant](https://www.home-assistant.io) custom integration for Nordic/Baltic electricity cost awareness and optimization — whether you are on a spot contract or a fixed rate.

It fetches day-ahead hourly or 15-minute spot prices from [spot-hinta.fi](https://spot-hinta.fi), applies your VAT and transfer pricing, and exposes sensors, binary sensors, and services you can use in automations, dashboards, and energy management scripts.

## Key features

**Pricing**

- Day-ahead spot prices — no API key required, 15-minute or 1-hour resolution
- Transfer price tier groups with time-of-use schedules and monthly fixed fees
- Fixed-price contract period management — spot prices automatically replaced when a fixed period is active
- Monthly electricity contract base fee spread as a daily cost sensor

**Control**

- Price rank, rank quartile, and total price rank sensors
- Control factor sensors (0–1 and bipolar ±1) for proportional automation
- Writable price and rank threshold number entities — adjust limits from the dashboard or automations without reopening configuration
- Optimization scores measuring how well consumption is shifted to cheap hours
- Rolling average sensors for the next 30/60/120 minutes (15-minute resolution)

**Generation & export** *(optional, enable in Advanced options)*

- Export price sensors and daily statistics
- Import/export spread and self-consumption value sensors
- Best export window and best charge window services
- Solar generation schedule service

**Battery optimization** *(optional, requires battery capacity configured)*

- Charge opportunity factor and categorical charge recommendation sensors
- Optimal charge window start/end sensors
- `charge_from_grid_recommended` and `discharge_to_grid_recommended` binary sensors

**Services**

- Query prices and export prices for any time range
- Find cheapest consecutive windows for scheduling appliances
- Manage fixed-price periods via service calls

## Supported regions

`FI`, `EE`, `LT`, `LV`, `DK1`, `DK2`, `NO1`, `NO2`, `NO3`, `NO4`, `NO5`, `SE1`, `SE2`, `SE3`, `SE4`

!!! note "Currency notice"
    Kilowahti currently supports only the official electricity market currency EUR. Conversions to DKK, NOK and SEK will become possible later.

## Quick start

1. [Install via HACS](installation.md)
2. Go to **Settings → Devices & Services → Add Integration → Kilowahti**
3. Complete the setup wizard
4. Use the sensors in your dashboards and automations

## Feedback

Have ideas, found a bug, or just want to share how you're using Kilowahti? We'd love to hear from you — no GitHub account needed.

[Share your feedback →](https://tally.so/r/QK05XY){ .md-button }

## Acknowledgments

Kilowahti would not exist without the prior work of **Teemu Mikkonen** and his [spotprices2ha](https://github.com/T3m3z/spotprices2ha) project. That copy-paste solution was the direct inspiration for this integration — it proved the concept, shaped the sensor design, and provided automation patterns that many Finnish HA users have relied on. Thank you, Teemu.

A special thanks also to the Finnish hobbyist behind [spot-hinta.fi](https://spot-hinta.fi) for building and maintaining an excellent, free, and easy-to-use electricity price API that makes projects like this possible.

## Credits

Kilowahti was created by Jessi Björk, building on the foundation of spotprices2ha to bring richer functionality to her home automation.
