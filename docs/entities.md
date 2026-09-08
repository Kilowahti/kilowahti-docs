# Entities

All entities are grouped under a single **Kilowahti** device per configured instance. Entity names use the name you set during setup (e.g. `Home`).

!!! note "Entity IDs on your system"
    Home Assistant builds each entity ID from the device name and the entity's display name at the moment it is first created, so the IDs below assume a fresh install in English. If you set up Kilowahti in another language, renamed an entity, or renamed the device, your IDs will differ — check **Settings → Devices & Services → Kilowahti** for the real ones.

## Start with these

This page is a complete reference, and most of it you will never need. A typical setup uses five entities:

| Entity | What it is for |
|---|---|
| `sensor.kilowahti_{name}_total_price` | What a kWh costs you right now, everything included. The number to put on a dashboard |
| `sensor.kilowahti_{name}_rank` | Where this slot sits in today's prices; 1 = cheapest. The number to automate on |
| `binary_sensor.kilowahti_{name}_rank_acceptable` | `on` while the price rank is at or below your threshold |
| `number.kilowahti_{name}_rank_threshold` | Sets that threshold, adjustable from a dashboard without reopening setup |
| `binary_sensor.kilowahti_{name}_tomorrow_s_prices_available` | `on` once tomorrow's prices have arrived, usually mid-afternoon |

Everything below is there when you need it. Whole groups only exist when you turn them on: export and solar sensors require **generation** enabled in Advanced options, battery sensors require a battery capacity, and rolling averages are off by default.

New to the integration? [Getting started](getting-started.md) sets these up end to end.

## Sensors

### Price sensors

All price sensors use the display unit you chose during configuration — the minor or major unit of your display currency, e.g. `c/kWh` or `€/kWh`, `öre/kWh` or `kr/kWh`.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_spot_price` | Current slot's spot price (VAT included). Attributes: `price_source`, plus `today_prices`/`tomorrow_prices` when price arrays are enabled |
| `sensor.kilowahti_{name}_active_price` | Shown as **Active price**. The energy price you pay: spot, or your contract rate when a fixed period is active. Attributes: `source` (`spot`/`fixed`), `period_label` |
| `sensor.kilowahti_{name}_transfer_price` | Active transfer tier price; unavailable until a transfer group is configured. Attributes: `tariff` (active group and tier, e.g. `Kausisiirto, Muu aika`), plus `group` and `tier` separately |
| `sensor.kilowahti_{name}_total_price` | Active price + transfer price. Attributes: `today_prices`/`tomorrow_prices` when total price arrays are enabled |
| `sensor.kilowahti_{name}_today_spot_average` | Today's average spot price |
| `sensor.kilowahti_{name}_today_spot_minimum` | Today's lowest spot price |
| `sensor.kilowahti_{name}_today_spot_maximum` | Today's highest spot price |
| `sensor.kilowahti_{name}_today_total_average` | Today's average total price (spot + transfer) |
| `sensor.kilowahti_{name}_today_total_minimum` | Today's lowest total price |
| `sensor.kilowahti_{name}_today_total_maximum` | Today's highest total price |
| `sensor.kilowahti_{name}_tomorrow_spot_average` | Tomorrow's average spot price; unavailable until tomorrow's prices are fetched |
| `sensor.kilowahti_{name}_tomorrow_spot_minimum` | Tomorrow's lowest spot price; unavailable until tomorrow's prices are fetched |
| `sensor.kilowahti_{name}_tomorrow_spot_maximum` | Tomorrow's highest spot price; unavailable until tomorrow's prices are fetched |
| `sensor.kilowahti_{name}_tomorrow_total_average` | Tomorrow's average total price; unavailable until tomorrow's prices are fetched (or based on fixed period if active) |
| `sensor.kilowahti_{name}_tomorrow_total_minimum` | Tomorrow's lowest total price |
| `sensor.kilowahti_{name}_tomorrow_total_maximum` | Tomorrow's highest total price |
| `sensor.kilowahti_{name}_next_hours_average` | Average spot price over the next N hours (configurable) |
| `sensor.kilowahti_{name}_monthly_fixed_cost_today` | Today's share of the monthly fixed contract cost, per day in your display currency; unavailable when not configured |

### Rank sensors

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_rank` | Current slot's rank by the energy price you actually pay (fixed-period rate when one is active, otherwise spot); transfer excluded. Normalized: 1 = cheapest, slots_per_day = most expensive |
| `sensor.kilowahti_{name}_total_price_rank` | Same, with transfer included in the price |
| `sensor.kilowahti_{name}_price_quartile` | Energy price quartile 1–4 (derived from the `rank` sensor); 1 = cheapest 25% of slots |
| `sensor.kilowahti_{name}_total_price_quartile` | Total price quartile 1–4 (derived from total_price_rank); 1 = cheapest 25% of slots |

The maximum rank is 96 for 15-minute resolution or 24 for 1-hour resolution.

Ranks are tier-normalized: slots sharing a price share a rank, and the cheapest price of the day is always 1 while the most expensive is always the maximum. During a [fixed-price period](fixed-periods.md) every slot costs the same, so `rank` reads 1 all day — there is no cheaper hour to wait for.

### Control factor sensors

All three factors share one scale: **1.0 = cheapest, 0.0 = most expensive**, with the configured shape (linear/sinusoidal) and scaling applied to each. Each bipolar variant maps the same value onto −1 to +1.

| Entity | Range | Description |
|---|---|---|
| `sensor.kilowahti_{name}_control_factor_price` | 0–1 | From the `rank` sensor: the energy price you pay, transfer excluded |
| `sensor.kilowahti_{name}_control_factor_price_bipolar` | −1 to +1 | Bipolar version of the above |
| `sensor.kilowahti_{name}_control_factor_total` | 0–1 | From `total_price_rank`: energy plus transfer |
| `sensor.kilowahti_{name}_control_factor_total_bipolar` | −1 to +1 | Bipolar version of the above |
| `sensor.kilowahti_{name}_control_factor_transfer` | 0–1 | From the transfer tier rank among today's distinct tiers. Unavailable until a transfer group is configured |
| `sensor.kilowahti_{name}_control_factor_transfer_bipolar` | −1 to +1 | Bipolar version of the above |

The transfer factor ranks among the day's distinct tiers (typically two or three), so it moves in larger steps than the price and total factors, which rank among all slots. A group with a single tier, or a day spent inside a fixed-price period, gives a constant 1.0 — nothing that hour to prefer or avoid.

### Score sensors

One pair of sensors per configured score profile, where `{profile}` is the profile's label (the built-in one is `total`):

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_{profile}_score_daily` | In-progress optimization score for today (0–100). Attribute: `previous` (yesterday's completed score) |
| `sensor.kilowahti_{name}_{profile}_score_monthly` | Average of completed daily scores for the current calendar month (0–100). Attribute: `previous` (previous month's final score) |

See [Optimization scores](scores.md) for how scores are calculated.

### Diagnostic sensors

Disabled by default. Enable individually in the entity registry if needed.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_price_threshold` | Configured price threshold (same unit as price sensors) |
| `sensor.kilowahti_{name}_acceptable_rank` | Configured acceptable rank threshold |
| `sensor.kilowahti_{name}_price_threshold_includes_transfer` | Whether transfer price is included in the price threshold comparison |
| `sensor.kilowahti_{name}_control_factor_shape` | Control factor shape (`linear` or `sinusoidal`) |
| `sensor.kilowahti_{name}_forward_window` | Forward average window length (hours) |
| `sensor.kilowahti_{name}_active_transfer_group` | Label of the currently active transfer group, or unavailable |
| `sensor.kilowahti_{name}_active_transfer_tier` | Label of the currently active transfer tier, or unavailable |
| `sensor.kilowahti_{name}_active_fixed_period` | Label of the currently active fixed-price period, or unavailable |
| `sensor.kilowahti_{name}_price_data_source` | Price source currently in use: `kilowahti_cdn` or `spot_hinta` (enabled by default) |
| `sensor.kilowahti_{name}_exchange_rate` | Daily EUR → local currency rate in use; only present when a local display currency is selected (enabled by default) |

One additional diagnostic sensor per score profile:

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_{profile}_score_formula` | Scoring formula in use for this profile (`default` or `raw`) |

## Number entities

Writable settings that can be adjusted from the dashboard or from automations using `number.set_value`. Changes take effect immediately — no restart or reconfiguration needed.

| Entity | Range | Description |
|---|---|---|
| `number.kilowahti_{name}_price_threshold` | 0–500 in the minor unit (0–5 in the major one) | Price at or below which `price_acceptable` turns on. Follows your display unit |
| `number.kilowahti_{name}_rank_threshold` | 1–96 (or 1–24) | Rank at or below which `rank_acceptable` turns on. Upper bound matches your price resolution |

The initial values come from the **Thresholds & control** options. Changes made via these entities are persisted to the integration config, so they survive restarts and also update the values shown in the options flow.

### Rolling average sensors

Available only when using 15-minute price resolution. Enable via **Show next 30min, 1h and 2h average prices** in **Configure → Advanced options**.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_average_price_30_min` | Average total price for the current slot and the next 30 minutes |
| `sensor.kilowahti_{name}_average_price_60_min` | Average total price for the current slot and the next 60 minutes |
| `sensor.kilowahti_{name}_average_price_120_min` | Average total price for the current slot and the next 120 minutes |

### Generation & export sensors

Available when **Enable generation & export features** is turned on in **Configure → Advanced options**.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_export_price` | Current slot's feed-in price (no VAT) |
| `sensor.kilowahti_{name}_export_today_average` | Today's average export price |
| `sensor.kilowahti_{name}_export_today_minimum` | Today's lowest export price |
| `sensor.kilowahti_{name}_export_today_maximum` | Today's highest export price |
| `sensor.kilowahti_{name}_export_tomorrow_average` | Tomorrow's average export price; unavailable until fetched |
| `sensor.kilowahti_{name}_export_tomorrow_minimum` | Tomorrow's lowest export price |
| `sensor.kilowahti_{name}_export_tomorrow_maximum` | Tomorrow's highest export price |
| `sensor.kilowahti_{name}_import_export_spread` | Difference between current import (total) price and export price |
| `sensor.kilowahti_{name}_self_consumption_value` | Value of each kWh consumed from own generation (= avoided import cost) |
| `sensor.kilowahti_{name}_next_solar_window_average` | Average export price for the next upcoming solar production window |
| `sensor.kilowahti_{name}_arbitrage_spread_today` | Spread between today's cheapest and most expensive total price slots |

### Battery sensors

Available when generation is enabled (Advanced options) and **battery capacity > 0** is set in **Configure → Generation & export**.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_charge_opportunity_factor` | How good right now is for grid charging (0.0 = worst, 1.0 = best). Always uses linear scaling — not affected by the control factor curve or scaling settings |
| `sensor.kilowahti_{name}_battery_charge_recommendation` | Categorical recommendation: `charge_from_grid`, `discharge_to_grid`, or `idle` |
| `sensor.kilowahti_{name}_optimal_charge_window_start` | Start of the cheapest window for a full battery charge cycle |
| `sensor.kilowahti_{name}_optimal_charge_window_end` | End of the cheapest window for a full battery charge cycle |

## Binary sensors

All of these except `price_or_rank_acceptable` have counterparts as [triggers and conditions](triggers-conditions.md), which are usually easier to build an automation from.

| Entity | Description |
|---|---|
| `binary_sensor.kilowahti_{name}_price_acceptable` | On when current price is at or below the configured threshold |
| `binary_sensor.kilowahti_{name}_rank_acceptable` | On when current rank is at or below the configured threshold |
| `binary_sensor.kilowahti_{name}_price_or_rank_acceptable` | On when either price or rank condition is met |
| `binary_sensor.kilowahti_{name}_fixed_price_period_active` | On when a fixed-price period is currently active |
| `binary_sensor.kilowahti_{name}_tomorrow_s_prices_available` | On when tomorrow's prices have been fetched |

The following binary sensors are available when **generation is enabled**:

| Entity | Description |
|---|---|
| `binary_sensor.kilowahti_{name}_export_price_acceptable` | On when current export price is at or above the configured export threshold |

The following are available when **generation is enabled** and **battery capacity > 0**:

| Entity | Description |
|---|---|
| `binary_sensor.kilowahti_{name}_charge_from_grid_recommended` | On when current slot is cheap and more expensive slots follow today |
| `binary_sensor.kilowahti_{name}_discharge_to_grid_recommended` | On when current export price is in today's top quartile |
