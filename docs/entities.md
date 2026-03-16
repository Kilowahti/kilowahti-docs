# Entities

All entities are grouped under a single **Kilowahti** device per configured instance. Entity names use the name you set during setup (e.g. `Home`).

## Sensors

### Price sensors

The display unit (`c/kWh` or `€/kWh`) is set during configuration and applies to all price sensors.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_spot_price` | Current slot's spot price (VAT included) |
| `sensor.kilowahti_{name}_effective_price` | Spot price, or fixed price when a fixed period is active. Attributes: `source` (`spot`/`fixed`), `period_label` |
| `sensor.kilowahti_{name}_transfer_price` | Active transfer tier price; unavailable until a transfer group is configured |
| `sensor.kilowahti_{name}_total_price` | Effective price + transfer price |
| `sensor.kilowahti_{name}_today_spot_avg` | Today's average spot price |
| `sensor.kilowahti_{name}_today_spot_min` | Today's lowest spot price |
| `sensor.kilowahti_{name}_today_spot_max` | Today's highest spot price |
| `sensor.kilowahti_{name}_today_total_avg` | Today's average total price (spot + transfer) |
| `sensor.kilowahti_{name}_today_total_min` | Today's lowest total price |
| `sensor.kilowahti_{name}_today_total_max` | Today's highest total price |
| `sensor.kilowahti_{name}_tomorrow_spot_avg` | Tomorrow's average spot price; unavailable until tomorrow's prices are fetched |
| `sensor.kilowahti_{name}_tomorrow_spot_min` | Tomorrow's lowest spot price; unavailable until tomorrow's prices are fetched |
| `sensor.kilowahti_{name}_tomorrow_spot_max` | Tomorrow's highest spot price; unavailable until tomorrow's prices are fetched |
| `sensor.kilowahti_{name}_tomorrow_total_avg` | Tomorrow's average total price; unavailable until tomorrow's prices are fetched (or based on fixed period if active) |
| `sensor.kilowahti_{name}_tomorrow_total_min` | Tomorrow's lowest total price |
| `sensor.kilowahti_{name}_tomorrow_total_max` | Tomorrow's highest total price |
| `sensor.kilowahti_{name}_next_hours_avg` | Average spot price over the next N hours (configurable) |
| `sensor.kilowahti_{name}_monthly_fixed_cost_today` | Today's share of the monthly fixed contract cost (€/day); unavailable when not configured |

### Rank sensors

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_price_rank` | Current slot's rank by spot price among today's slots; 1 = cheapest |
| `sensor.kilowahti_{name}_total_price_rank` | Current slot's rank by total price (spot + transfer) among today's slots; 1 = cheapest |
| `sensor.kilowahti_{name}_price_quartile` | Price quartile 1–4; 1 = cheapest 25% of slots |

The maximum rank is 96 for 15-minute resolution or 24 for 1-hour resolution.

### Control factor sensors

| Entity | Range | Description |
|---|---|---|
| `sensor.kilowahti_{name}_control_factor_price` | 0–1 | Rank-based factor; 1.0 at cheapest rank, 0.0 at most expensive. Shape (linear/sinusoidal) and scaling are configurable |
| `sensor.kilowahti_{name}_control_factor_price_bipolar` | −1 to +1 | Bipolar version of the above; +1.0 at cheapest, −1.0 at most expensive |
| `sensor.kilowahti_{name}_control_factor_transfer` | 0–1 | Normalized transfer tier rank among today's unique transfer tiers; 0.0 = cheapest tier. Unavailable until a transfer group is configured |

### Score sensors

One pair of sensors per configured score profile:

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_score_{profile}_daily` | In-progress optimization score for today (0–100). Attribute: `previous` (yesterday's completed score) |
| `sensor.kilowahti_{name}_score_{profile}_monthly` | Average of completed daily scores for the current calendar month (0–100). Attribute: `previous` (previous month's final score) |

See [Optimization scores](scores.md) for how scores are calculated.

### Diagnostic sensors

Disabled by default. Enable individually in the entity registry if needed.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_setting_max_price` | Configured price threshold (same unit as price sensors) |
| `sensor.kilowahti_{name}_setting_acceptable_rank` | Configured acceptable rank threshold |
| `sensor.kilowahti_{name}_setting_price_threshold_includes_transfer` | Whether transfer price is included in the price threshold comparison |
| `sensor.kilowahti_{name}_setting_control_factor_function` | Control factor shape (`linear` or `sinusoidal`) |
| `sensor.kilowahti_{name}_setting_forward_window` | Forward average window length (hours) |
| `sensor.kilowahti_{name}_setting_active_transfer_group` | Label of the currently active transfer group, or unavailable |
| `sensor.kilowahti_{name}_setting_active_transfer_tier` | Label of the currently active transfer tier, or unavailable |
| `sensor.kilowahti_{name}_setting_active_fixed_period` | Label of the currently active fixed-price period, or unavailable |

One additional diagnostic sensor per score profile:

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_score_{profile}_formula` | Scoring formula in use for this profile (`default` or `raw`) |

## Number entities

Writable settings that can be adjusted from the dashboard or from automations using `number.set_value`. Changes take effect immediately — no restart or reconfiguration needed.

| Entity | Range | Description |
|---|---|---|
| `number.kilowahti_{name}_price_threshold` | 0–500 c/kWh (or 0–5 €/kWh) | Price at or below which `price_acceptable` turns on. Matches your configured display unit |
| `number.kilowahti_{name}_rank_threshold` | 1–96 (or 1–24) | Rank at or below which `rank_acceptable` turns on. Upper bound matches your price resolution |

The initial values come from the **Thresholds & control** options. Changes made via these entities are persisted to the integration config, so they survive restarts and also update the values shown in the options flow.

### Rolling average sensors

Available only when using 15-minute price resolution. Enable via **Show rolling averages** in **Configure → Advanced options**.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_current_30min_avg` | Average total price for the current slot and the next 30 minutes |
| `sensor.kilowahti_{name}_current_60min_avg` | Average total price for the current slot and the next 60 minutes |
| `sensor.kilowahti_{name}_current_120min_avg` | Average total price for the current slot and the next 120 minutes |

### Generation & export sensors

Available when **Enable generation & export features** is turned on in **Configure → Advanced options**.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_export_price` | Current slot's feed-in price (no VAT) |
| `sensor.kilowahti_{name}_export_today_avg` | Today's average export price |
| `sensor.kilowahti_{name}_export_today_min` | Today's lowest export price |
| `sensor.kilowahti_{name}_export_today_max` | Today's highest export price |
| `sensor.kilowahti_{name}_export_tomorrow_avg` | Tomorrow's average export price; unavailable until fetched |
| `sensor.kilowahti_{name}_export_tomorrow_min` | Tomorrow's lowest export price |
| `sensor.kilowahti_{name}_export_tomorrow_max` | Tomorrow's highest export price |
| `sensor.kilowahti_{name}_import_export_spread` | Difference between current import (total) price and export price |
| `sensor.kilowahti_{name}_self_consumption_value` | Value of each kWh consumed from own generation (= avoided import cost) |
| `sensor.kilowahti_{name}_next_solar_window_avg` | Average export price for the next upcoming solar production window |
| `sensor.kilowahti_{name}_arbitrage_spread_today` | Spread between today's cheapest and most expensive total price slots |

### Battery sensors

Available when generation is enabled (Advanced options) and **battery capacity > 0** is set in **Configure → Generation & export**.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_charge_opportunity_factor` | How good right now is for grid charging (0.0 = worst, 1.0 = best) |
| `sensor.kilowahti_{name}_battery_charge_recommendation` | Categorical recommendation: `charge_from_grid`, `discharge_to_grid`, or `idle` |
| `sensor.kilowahti_{name}_optimal_charge_window_start` | Start of the cheapest window for a full battery charge cycle |
| `sensor.kilowahti_{name}_optimal_charge_window_end` | End of the cheapest window for a full battery charge cycle |

## Binary sensors

| Entity | Description |
|---|---|
| `binary_sensor.kilowahti_{name}_price_acceptable` | On when current price is at or below the configured threshold |
| `binary_sensor.kilowahti_{name}_rank_acceptable` | On when current rank is at or below the configured threshold |
| `binary_sensor.kilowahti_{name}_price_or_rank_acceptable` | On when either price or rank condition is met |
| `binary_sensor.kilowahti_{name}_fixed_period_active` | On when a fixed-price period is currently active |
| `binary_sensor.kilowahti_{name}_tomorrow_available` | On when tomorrow's prices have been fetched |

The following binary sensors are available when **generation is enabled**:

| Entity | Description |
|---|---|
| `binary_sensor.kilowahti_{name}_export_price_acceptable` | On when current export price is at or above the configured export threshold |

The following are available when **generation is enabled** and **battery capacity > 0**:

| Entity | Description |
|---|---|
| `binary_sensor.kilowahti_{name}_charge_from_grid_recommended` | On when current slot is cheap and more expensive slots follow today |
| `binary_sensor.kilowahti_{name}_discharge_to_grid_recommended` | On when current export price is in today's top quartile |
