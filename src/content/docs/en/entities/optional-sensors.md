---
title: "Rolling average, generation and battery sensors"
---

## Rolling average sensors

**Available only with 15-minute price resolution.** Enable with the option **Show next 30min, 1h and 2h average prices** under **Configure → Advanced options**.

| Entity | Description |
|---|---|
| **Average price 30 min**<br>`sensor.kilowahti_{name}_average_price_30min` | Average total price for the current slot and the 30 minutes following it |
| **Average price 60 min**<br>`sensor.kilowahti_{name}_average_price_60min` | Average total price for the current slot and the 60 minutes following it |
| **Average price 120 min**<br>`sensor.kilowahti_{name}_average_price_120min` | Average total price for the current slot and the 120 minutes following it |

Note that the averages are calculated from the total price (energy + transfer). If no transfer prices are configured, the average equals the plain energy price average.

## Generation & export sensors

The sensors in this section are available when **Enable generation & export features** is selected under **Configure → Advanced options**.

| Entity | Description |
|---|---|
| **Export price**<br>`sensor.kilowahti_{name}_export_price` | Current slot's feed-in price (no VAT) |
| **Export today average**<br>`sensor.kilowahti_{name}_export_today_average` | Today's average export price |
| **Export today minimum**<br>`sensor.kilowahti_{name}_export_today_minimum` | Today's lowest export price |
| **Export today maximum**<br>`sensor.kilowahti_{name}_export_today_maximum` | Today's highest export price |
| **Export tomorrow average**<br>`sensor.kilowahti_{name}_export_tomorrow_average` | Tomorrow's average export price; unavailable until fetched |
| **Export tomorrow minimum**<br>`sensor.kilowahti_{name}_export_tomorrow_minimum` | Tomorrow's lowest export price |
| **Export tomorrow maximum**<br>`sensor.kilowahti_{name}_export_tomorrow_maximum` | Tomorrow's highest export price |
| **Import-export spread**<br>`sensor.kilowahti_{name}_import_export_spread` | Difference between current import (total) price and export price |
| **Self-consumption value**<br>`sensor.kilowahti_{name}_self_consumption_value` | Value of each kWh consumed from own generation (= avoided import cost) |
| **Next solar window average**<br>`sensor.kilowahti_{name}_next_solar_window_average` | Average export price for the next upcoming solar production window |
| **Arbitrage spread today**<br>`sensor.kilowahti_{name}_arbitrage_spread_today` | Spread between today's cheapest and most expensive total price slots |

## Battery sensors

The sensors in this section are available when **Enable generation & export features** is selected under **Configure → Advanced options** and, in addition, **battery capacity > 0 kWh** is set under **Configure → Generation & export**.

| Entity | Description |
|---|---|
| **Charge opportunity factor**<br>`sensor.kilowahti_{name}_charge_opportunity_factor` | How good right now is for grid charging (0.0 = worst, 1.0 = best). Always uses linear scaling — not affected by the control factor curve or scaling settings |
| **Battery charge recommendation**<br>`sensor.kilowahti_{name}_battery_charge_recommendation` | Categorical recommendation: `charge_from_grid`, `discharge`, or `hold` |
| **Optimal charge window start**<br>`sensor.kilowahti_{name}_optimal_charge_window_start` | Start of the cheapest window for a full battery charge cycle |
| **Optimal charge window end**<br>`sensor.kilowahti_{name}_optimal_charge_window_end` | End of the cheapest window for a full battery charge cycle |
