---
title: "Optimization and diagnostic sensors"
---

## Optimization sensors

One pair of sensors per configured optimization profile, where `{profile}` is the profile's name (the built-in profile's name is `total`, i.e. the total sum):

| Entity | Description |
|---|---|
| **{profile} score (daily)**<br>`sensor.kilowahti_{name}_score_{profile}_daily` | <ul><li>Today's current optimization score (0–100).</li><li>Attribute: `previous` (yesterday's final score)</li></ul> |
| **{profile} score (monthly)**<br>`sensor.kilowahti_{name}_score_{profile}_monthly` | <ul><li>Average of the realized daily scores of the current calendar month (0–100).</li><li>Attribute: `previous` (previous month's final score)</li></ul> |

See the [Optimization scores](/en/scores/) page to see in more detail how the scores are calculated.

## Diagnostic sensors

Most diagnostic sensors are disabled by default. If you want to see in more detail why or how Kilowahti behaves at any given moment, enable these sensors individually in the entity registry as needed.

| Entity | Description |
|---|---|
| **Price threshold**<br>`sensor.kilowahti_{name}_setting_price_threshold` | Configured price threshold (same unit as price sensors) |
| **Acceptable rank**<br>`sensor.kilowahti_{name}_setting_rank_threshold` | Configured acceptable rank threshold |
| **Price threshold includes transfer**<br>`sensor.kilowahti_{name}_setting_price_threshold_includes_transfer` | Whether transfer price is included in the price threshold comparison |
| **Control factor shape**<br>`sensor.kilowahti_{name}_setting_control_factor_shape` | Control factor shape (`linear` or `sinusoidal`) |
| **Forward window**<br>`sensor.kilowahti_{name}_setting_forward_window` | Forward average window length (hours) |
| **Active transfer group**<br>`sensor.kilowahti_{name}_setting_active_transfer_group` | Label of the currently active transfer group, or unavailable |
| **Active transfer tier**<br>`sensor.kilowahti_{name}_setting_active_transfer_tier` | Label of the currently active transfer tier, or unavailable |
| **Active fixed period**<br>`sensor.kilowahti_{name}_setting_active_fixed_period` | Label of the currently active fixed-price period, or unavailable |
| **Price data source**<br>`sensor.kilowahti_{name}_price_data_source` | Price source currently in use: `kilowahti_cdn` or `spot_hinta` (enabled by default) *(since 2026.8.0)* |
| **Exchange rate**<br>`sensor.kilowahti_{name}_exchange_rate` | Daily EUR → local currency rate in use; only present when a local display currency is selected (enabled by default) *(since 2026.8.0)* |

One additional diagnostic sensor per optimization profile:

| Entity | Description |
|---|---|
| **{profile} score formula**<br>`sensor.kilowahti_{name}_score_{profile}_formula` | The scoring formula in use in the profile: `default` (default) or `raw` (neutral) |
