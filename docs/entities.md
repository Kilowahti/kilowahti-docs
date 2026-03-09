# Entities

All entities are grouped under a single **Kilowahti** device per configured instance. Entity names use the name you set during setup (e.g. `Home`).

## Sensors

### Price sensors

| Entity | Unit | Description |
|---|---|---|
| `sensor.{name}_spot_price` | c/kWh | Current slot's spot price (VAT included) |
| `sensor.{name}_effective_price` | c/kWh | Spot price, or fixed price when a fixed period is active. Attributes: `source` (`spot`/`fixed`), `period_label` |
| `sensor.{name}_transfer_price` | c/kWh | Active transfer tier price. Hidden if no transfer groups are configured |
| `sensor.{name}_total_price` | c/kWh | Effective price + transfer price |
| `sensor.{name}_today_avg` | c/kWh | Today's average spot price |
| `sensor.{name}_today_min` | c/kWh | Today's lowest spot price |
| `sensor.{name}_today_max` | c/kWh | Today's highest spot price |
| `sensor.{name}_tomorrow_avg` | c/kWh | Tomorrow's average spot price (0 when unavailable) |
| `sensor.{name}_tomorrow_min` | c/kWh | Tomorrow's lowest spot price (0 when unavailable) |
| `sensor.{name}_tomorrow_max` | c/kWh | Tomorrow's highest spot price (0 when unavailable) |
| `sensor.{name}_next_hours_avg` | c/kWh | Average price over the next N hours (configurable) |

### Rank sensors

| Entity | Unit | Description |
|---|---|---|
| `sensor.{name}_price_rank` | — | Current slot's rank among today's slots; 1 = cheapest |
| `sensor.{name}_price_quartile` | — | Price quartile 1–4; 1 = cheapest 25% of slots |

The maximum rank is 96 for 15-minute resolution or 24 for 1-hour resolution.

### Control factor sensors

| Entity | Range | Description |
|---|---|---|
| `sensor.{name}_control_factor_price` | 0–1 | Normalized price factor; 1.0 when price is cheapest, 0.0 when most expensive |
| `sensor.{name}_control_factor_price_bipolar` | −1 to 1 | Bipolar version; positive = cheap, negative = expensive |
| `sensor.{name}_control_factor_transfer` | 0–1 | Normalized transfer price rank among today's unique transfer tiers. Hidden if no transfer groups are configured |

### Score sensors

One pair of sensors per configured score profile:

| Entity | Description |
|---|---|
| `sensor.{name}_score_{profile}_today` | In-progress optimization score for today (0–100) |
| `sensor.{name}_score_{profile}_month` | Rolling average of completed daily scores this month (0–100) |

See [Optimization scores](scores.md) for how scores are calculated.

## Binary sensors

| Entity | Description |
|---|---|
| `binary_sensor.{name}_price_acceptable` | On when current price is at or below the configured threshold |
| `binary_sensor.{name}_rank_acceptable` | On when current rank is at or below the configured threshold |
| `binary_sensor.{name}_price_or_rank_acceptable` | On when either price or rank condition is met |
| `binary_sensor.{name}_fixed_period_active` | On when a fixed-price period is currently active |
| `binary_sensor.{name}_tomorrow_available` | On when tomorrow's prices have been fetched |
