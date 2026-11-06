---
title: "Binary sensors"
---

All of these sensors except `price_or_rank_acceptable` have counterparts as [triggers and conditions](/en/triggers-conditions/), with which an automation may be easier to build.

| Entity | Description |
|---|---|
| **Price acceptable**<br>`binary_sensor.kilowahti_{name}_price_acceptable` | On when current price is at or below the configured threshold |
| **Rank acceptable**<br>`binary_sensor.kilowahti_{name}_rank_acceptable` | On when current rank is at or below the configured threshold |
| **Price or rank acceptable**<br>`binary_sensor.kilowahti_{name}_price_or_rank_acceptable` | On when **either** the price or the rank condition is met |
| **Fixed price period active**<br>`binary_sensor.kilowahti_{name}_fixed_price_period_active` | On when a fixed-price period is currently active |
| **Tomorrow available**<br>`binary_sensor.kilowahti_{name}_tomorrow_available` | On when tomorrow's prices are available |

The following binary sensors are available when **generation is enabled**:

| Entity | Description |
|---|---|
| **Export price acceptable**<br>`binary_sensor.kilowahti_{name}_export_price_acceptable` | On when current export price is at or above the configured export threshold |

The following are available when **generation is enabled** and **battery capacity > 0 kWh**:

| Entity | Description |
|---|---|
| **Charge from grid recommended**<br>`binary_sensor.kilowahti_{name}_charge_from_grid_recommended` | On when current slot is cheap and more expensive slots follow today |
| **Discharge to grid recommended**<br>`binary_sensor.kilowahti_{name}_discharge_to_grid_recommended` | On when current export price is in today's top quartile |
