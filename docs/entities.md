# Entities

All entities are grouped under a single **Kilowahti** device per configured instance. Entity names use the name you set during setup (e.g. `Home`).

!!! note "Entity IDs on your system"
    From `2026.11.0` Kilowahti pins its own entity IDs, so they are identical on every install no matter which language the interface is in — only the displayed names are translated into the language selected in the user's profile settings.

    Installs created **before** `2026.11.0` keep the IDs Home Assistant generated back then, which came from the translated display name. Most are the same, but a few differ: `price_rank` was `rank`, `tomorrow_available` was `tomorrow_s_prices_available`, the `setting_*` diagnostics had no prefix, and a Finnish or German install got Finnish or German IDs throughout.

    After upgrading, a repair under **Settings → System → Repairs** offers to rename them to the fixed IDs. Nothing changes until you confirm; the confirmation lists the automations, scripts, scenes and groups that use the entities (dashboards and templates are not checked), IDs you changed yourself are left alone, and the history of all IDs is kept. Any references to the old IDs, e.g. in automations or dashboard cards, must be updated by hand afterwards. If you skip the repair, check **Settings → Devices & Services → Kilowahti** to see your real IDs.

## Start with these

This page is a comprehensive reference for all of Kilowahti, and you will probably never need most of it. In a basic setup you can get very far with just five entities:

| Entity | What it is for |
|---|---|
| `sensor.kilowahti_{name}_total_price` | <ul><li>**What a kilowatt-hour costs you right now, everything included.**</li><li>This number is useful, for example, in a dashboard card shown to users.</li></ul> |
| `sensor.kilowahti_{name}_price_rank` | <ul><li>**Where the current slot sits in the day's prices by energy price, smaller is better: 1 = cheapest.**</li><li>This number is the most useful in automations: for example, heating should not be controlled by an absolute price limit alone, because on an expensive day it could be blocked completely.</li></ul> |
| `binary_sensor.kilowahti_{name}_rank_acceptable` | `on` when the rank is lower than or equal to the threshold you set |
| `number.kilowahti_{name}_rank_threshold` | <ul><li>**Sets the previous threshold.**</li><li>The value can be adjusted flexibly from a dashboard or an automation without opening Kilowahti's settings, and it also changes when you edit the settings.</li></ul> |
| `binary_sensor.kilowahti_{name}_tomorrow_available` | `on` when tomorrow's prices have arrived, usually in the afternoon |

In addition to these, everything below is available if you need it. Kilowahti offers several sensors, some of which can achieve the very same thing with a slightly different approach and originally for a different purpose. This means broader possibilities for the user: Kilowahti is meant to be as flexible a solution as possible for different needs around electricity prices and consumption optimization.

Some of the groups below only exist when you enable them: export and solar sensors require **generation** enabled in Advanced options, battery sensors require, in addition to that, setting a battery capacity, and the wider rolling averages can be switched on if you want them when the selected price resolution is 15 minutes.

New to Kilowahti? The [Getting started](getting-started.md) guide takes you through setting up the integration step by step from start to finish.

## Sensors

### Price sensors

All price sensors use the display unit you chose in the settings: the minor or major unit of your display currency, e.g. `c/kWh` or `€/kWh`, `öre/kWh` or `kr/kWh`.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_spot_price` | <ul><li>Current slot's spot price including VAT</li><li>Attributes: `price_source`, plus `today_prices`/`tomorrow_prices` when price arrays are enabled</li></ul> |
| `sensor.kilowahti_{name}_active_price` | <ul><li>Shown as **Active price**. The energy price you pay: the spot price, or the contract price when a fixed period is active</li><li>Attributes: `source` (`spot`/`fixed`), `period_label`</li></ul> |
| `sensor.kilowahti_{name}_transfer_price` | <ul><li>Current transfer price, Unknown until transfer prices are configured</li><li>Attributes: `tariff` (active group and tier, e.g. "Kausisiirto, Muu aika"), plus `group` and `tier` separately</li></ul> |
| `sensor.kilowahti_{name}_total_price` | <ul><li>Total price, i.e. the active energy price + transfer price</li><li>Attributes: `today_prices`/`tomorrow_prices` when total price arrays are enabled in Advanced options</li></ul> |
| `sensor.kilowahti_{name}_today_spot_average` | <ul><li>Today's average spot price</li></ul> |
| `sensor.kilowahti_{name}_today_spot_minimum` | <ul><li>Today's lowest spot price</li></ul> |
| `sensor.kilowahti_{name}_today_spot_maximum` | <ul><li>Today's highest spot price</li></ul> |
| `sensor.kilowahti_{name}_today_total_average` | <ul><li>Today's average total price (spot + transfer)</li></ul> |
| `sensor.kilowahti_{name}_today_total_minimum` | <ul><li>Today's lowest total price</li></ul> |
| `sensor.kilowahti_{name}_today_total_maximum` | <ul><li>Today's highest total price</li></ul> |
| `sensor.kilowahti_{name}_tomorrow_spot_average` | <ul><li>Tomorrow's average spot price, Unavailable until tomorrow's prices are fetched</li></ul> |
| `sensor.kilowahti_{name}_tomorrow_spot_minimum` | Tomorrow's lowest spot price; unavailable until tomorrow's prices are fetched |
| `sensor.kilowahti_{name}_tomorrow_spot_maximum` | Tomorrow's highest spot price; unavailable until tomorrow's prices are fetched |
| `sensor.kilowahti_{name}_tomorrow_total_average` | Tomorrow's average total price; unavailable until tomorrow's prices are fetched (or based on fixed period if active) |
| `sensor.kilowahti_{name}_tomorrow_total_minimum` | <ul><li>Tomorrow's lowest total price</li></ul> |
| `sensor.kilowahti_{name}_tomorrow_total_maximum` | <ul><li>Tomorrow's highest total price</li></ul> |
| `sensor.kilowahti_{name}_next_hours_average` | <ul><li>Average spot price over the next N hours (configurable)</li></ul> |
| `sensor.kilowahti_{name}_monthly_fixed_cost_today` | <ul><li>Today's share of the monthly fixed contract cost per day in your display currency, Unavailable if the monthly fee is not configured</li></ul> |

Spot prices are fetched every day, and the sensors update when slots change even if a fixed-price period is in use. Whether a fixed-price period is active is shown by the binary sensor `fixed_price_period_active`, see [Binary sensors](#binary-sensors) below.

### Rank sensors

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_price_rank` | <ul><li>Current slot's rank by the energy price you actually pay (fixed-period price when one is active, otherwise spot price), transfer price not included.</li><li>Normalized: 1 = cheapest, the number of slots in the day (slots_per_day) = most expensive. Read more below the table.</li></ul> |
| `sensor.kilowahti_{name}_total_price_rank` | <ul><li>Same, but transfer is included in the price</li></ul> |
| `sensor.kilowahti_{name}_price_quartile` | <ul><li>Energy price quartile 1–4 (derived from `price_rank`): 1&nbsp;=&nbsp;cheapest 25&nbsp;% of the day's slots</li></ul> |
| `sensor.kilowahti_{name}_total_price_quartile` | <ul><li>Total price quartile 1–4 (derived from `total_price_rank`): 1&nbsp;=&nbsp;cheapest 25&nbsp;% of the day's slots</li></ul> |

!!! note "The highest possible rank depends on price resolution"
    The maximum rank is **96** with 15-minute resolution and **24** with 1-hour resolution.

Ranks are normalized by price level: slots with the same price share a rank, and the cheapest price of the day is always 1 and the most expensive is always the highest possible rank. For example, if on a 15-minute resolution day the 96 slots had only two different prices, the cheaper one gets rank 1 and the more expensive one 96.

During a [fixed-price period](fixed-periods.md) every slot costs the same, so the energy-only `price_rank` is 1 for the whole day, because no more expensive slot is expected during the day. Despite the fixed-price period for energy, the total price rank `total_price_rank` may still vary if transfer prices are defined and more than one different transfer price is active during the day.

### Control factor sensors

All three factors share one scale: **1.0 = cheapest, 0.0 = most expensive**, with the configured shape (linear/sinusoidal) and scaling applied to each. Each of them has a bipolar version that maps the same value onto −1…+1.

| Entity | Range | Description |
|---|---|---|
| `sensor.kilowahti_{name}_control_factor_price` | 0–1 | Based on `price_rank`: the energy price, without transfer. |
| `sensor.kilowahti_{name}_control_factor_price_bipolar` | −1 to +1 | Bipolar version of the above. |
| `sensor.kilowahti_{name}_control_factor_total` | 0–1 | Based on `total_price_rank`: energy and transfer together. |
| `sensor.kilowahti_{name}_control_factor_total_bipolar` | −1 to +1 | Bipolar version of the above. |
| `sensor.kilowahti_{name}_control_factor_transfer` | 0–1 | Based on the rank of the transfer price among the day's transfer prices. Unknown until transfer prices are configured. |
| `sensor.kilowahti_{name}_control_factor_transfer_bipolar` | −1 to +1 | Bipolar version of the above. Unknown until transfer prices are configured. |

The transfer control factor is based on the day's different transfer prices (typically at most two or three), so it moves in larger steps than the price and total price factors, which are based on all slots. A transfer price group with only one rule, or a day spent entirely inside a fixed-price period as far as energy is concerned, gives that sensor a constant value 1: there is no reason to prefer or avoid any slot.

### Optimization sensors

One pair of sensors per configured optimization profile, where `{profile}` is the profile's name (the built-in profile's name is `total`, i.e. the total sum):

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_score_{profile}_daily` | <ul><li>Today's current optimization score (0–100).</li><li>Attribute: `previous` (yesterday's final score)</li></ul> |
| `sensor.kilowahti_{name}_score_{profile}_monthly` | <ul><li>Average of the realized daily scores of the current calendar month (0–100).</li><li>Attribute: `previous` (previous month's final score)</li></ul> |

See the [Optimization scores](scores.md) page to see in more detail how the scores are calculated.

### Diagnostic sensors

Most diagnostic sensors are disabled by default. If you want to see in more detail why or how Kilowahti behaves at any given moment, enable these sensors individually in the entity registry as needed.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_setting_price_threshold` | Configured price threshold (same unit as price sensors) |
| `sensor.kilowahti_{name}_setting_rank_threshold` | Configured acceptable rank threshold |
| `sensor.kilowahti_{name}_setting_price_threshold_includes_transfer` | Whether transfer price is included in the price threshold comparison |
| `sensor.kilowahti_{name}_setting_control_factor_shape` | Control factor shape (`linear` or `sinusoidal`) |
| `sensor.kilowahti_{name}_setting_forward_window` | Forward average window length (hours) |
| `sensor.kilowahti_{name}_setting_active_transfer_group` | Label of the currently active transfer group, or unavailable |
| `sensor.kilowahti_{name}_setting_active_transfer_tier` | Label of the currently active transfer tier, or unavailable |
| `sensor.kilowahti_{name}_setting_active_fixed_period` | Label of the currently active fixed-price period, or unavailable |
| `sensor.kilowahti_{name}_price_data_source` | Price source currently in use: `kilowahti_cdn` or `spot_hinta` (enabled by default) |
| `sensor.kilowahti_{name}_exchange_rate` | Daily EUR → local currency rate in use; only present when a local display currency is selected (enabled by default) |

One additional diagnostic sensor per optimization profile:

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_score_{profile}_formula` | The scoring formula in use in the profile: `default` (default) or `raw` (neutral) |

## Number entities

Number entities are writable settings that can be adjusted from a dashboard or from automations with the `number.set_value` action. Changes take effect immediately, and no restart or reconfiguration is needed.

| Entity | Range | Description |
|---|---|---|
| `number.kilowahti_{name}_price_threshold` | 0–500 in the minor unit (0–5 in the major one) | Price at or below which `price_acceptable` turns on. The setting's unit is the same as the display unit you chose. |
| `number.kilowahti_{name}_rank_threshold` | 1–96 (or 1–24) | Rank at or below which `rank_acceptable` turns on. The upper bound depends on the selected price resolution. |

The initial values come from the **Thresholds & control** options. Changes made via these entities are persisted to the integration config, so they survive restarts and also update the values shown in the options flow.

### Rolling average sensors

**Available only with 15-minute price resolution.** Enable with the option **Show next 30min, 1h and 2h average prices** under **Configure → Advanced options**.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_average_price_30min` | Average total price for the current slot and the 30 minutes following it |
| `sensor.kilowahti_{name}_average_price_60min` | Average total price for the current slot and the 60 minutes following it |
| `sensor.kilowahti_{name}_average_price_120min` | Average total price for the current slot and the 120 minutes following it |

Note that the averages are calculated from the total price (energy + transfer). If no transfer prices are configured, the average equals the plain energy price average.

### Generation & export sensors

The sensors in this section are available when **Enable generation & export features** is selected under **Configure → Advanced options**.

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

The sensors in this section are available when **Enable generation & export features** is selected under **Configure → Advanced options** and, in addition, **battery capacity > 0 kWh** is set under **Configure → Generation & export**.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_charge_opportunity_factor` | How good right now is for grid charging (0.0 = worst, 1.0 = best). Always uses linear scaling — not affected by the control factor curve or scaling settings |
| `sensor.kilowahti_{name}_battery_charge_recommendation` | Categorical recommendation: `charge_from_grid`, `discharge`, or `hold` |
| `sensor.kilowahti_{name}_optimal_charge_window_start` | Start of the cheapest window for a full battery charge cycle |
| `sensor.kilowahti_{name}_optimal_charge_window_end` | End of the cheapest window for a full battery charge cycle |

## Binary sensors

All of these sensors except `price_or_rank_acceptable` have counterparts as [triggers and conditions](triggers-conditions.md), with which an automation may be easier to build.

| Entity | Description |
|---|---|
| `binary_sensor.kilowahti_{name}_price_acceptable` | On when current price is at or below the configured threshold |
| `binary_sensor.kilowahti_{name}_rank_acceptable` | On when current rank is at or below the configured threshold |
| `binary_sensor.kilowahti_{name}_price_or_rank_acceptable` | On when **either** the price or the rank condition is met |
| `binary_sensor.kilowahti_{name}_fixed_price_period_active` | On when a fixed-price period is currently active |
| `binary_sensor.kilowahti_{name}_tomorrow_available` | On when tomorrow's prices are available |

The following binary sensors are available when **generation is enabled**:

| Entity | Description |
|---|---|
| `binary_sensor.kilowahti_{name}_export_price_acceptable` | On when current export price is at or above the configured export threshold |

The following are available when **generation is enabled** and **battery capacity > 0 kWh**:

| Entity | Description |
|---|---|
| `binary_sensor.kilowahti_{name}_charge_from_grid_recommended` | On when current slot is cheap and more expensive slots follow today |
| `binary_sensor.kilowahti_{name}_discharge_to_grid_recommended` | On when current export price is in today's top quartile |
