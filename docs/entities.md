# Entities

All entities are grouped under a single **Kilowahti** device per configured instance. Entity names use the name you set during setup (e.g. `Home`).

## Sensors

### Price sensors

The display unit (`c/kWh` or `€/kWh`) is set during configuration and applies to all price sensors.

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_spot_price` | Current slot's spot price (VAT included) |
| `sensor.kilowahti_{name}_effective_price` | Spot price, or fixed price when a fixed period is active. Attributes: `source` (`spot`/`fixed`), `period_label` |
| `sensor.kilowahti_{name}_transfer_price` | Active transfer tier price. Hidden if no transfer groups are configured |
| `sensor.kilowahti_{name}_total_price` | Effective price + transfer price |
| `sensor.kilowahti_{name}_today_avg` | Today's average spot price |
| `sensor.kilowahti_{name}_today_min` | Today's lowest spot price |
| `sensor.kilowahti_{name}_today_max` | Today's highest spot price |
| `sensor.kilowahti_{name}_tomorrow_avg` | Tomorrow's average spot price (0 when unavailable) |
| `sensor.kilowahti_{name}_tomorrow_min` | Tomorrow's lowest spot price (0 when unavailable) |
| `sensor.kilowahti_{name}_tomorrow_max` | Tomorrow's highest spot price (0 when unavailable) |
| `sensor.kilowahti_{name}_next_hours_avg` | Average price over the next N hours (configurable) |

### Rank sensors

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_price_rank` | Current slot's rank among today's slots; 1 = cheapest |
| `sensor.kilowahti_{name}_price_quartile` | Price quartile 1–4; 1 = cheapest 25% of slots |

The maximum rank is 96 for 15-minute resolution or 24 for 1-hour resolution.

### Control factor sensors

| Entity | Range | Description |
|---|---|---|
| `sensor.kilowahti_{name}_control_factor_price` | 0–1 | Rank-based factor; 1.0 at cheapest rank, 0.0 at most expensive. Shape (linear/sinusoidal) and scaling are configurable |
| `sensor.kilowahti_{name}_control_factor_price_bipolar` | −1 to +1 | Bipolar version of the above; +1.0 at cheapest, −1.0 at most expensive |
| `sensor.kilowahti_{name}_control_factor_transfer` | 0–1 | Normalized transfer tier rank among today's unique transfer tiers; 0.0 = cheapest tier. Hidden if no transfer groups are configured |

### Score sensors

One pair of sensors per configured score profile:

| Entity | Description |
|---|---|
| `sensor.kilowahti_{name}_score_{profile}_today` | In-progress optimization score for today (0–100) |
| `sensor.kilowahti_{name}_score_{profile}_month` | Rolling average of completed daily scores this month (0–100) |

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

## Binary sensors

| Entity | Description |
|---|---|
| `binary_sensor.kilowahti_{name}_price_acceptable` | On when current price is at or below the configured threshold |
| `binary_sensor.kilowahti_{name}_rank_acceptable` | On when current rank is at or below the configured threshold |
| `binary_sensor.kilowahti_{name}_price_or_rank_acceptable` | On when either price or rank condition is met |
| `binary_sensor.kilowahti_{name}_fixed_period_active` | On when a fixed-price period is currently active |
| `binary_sensor.kilowahti_{name}_tomorrow_available` | On when tomorrow's prices have been fetched |
