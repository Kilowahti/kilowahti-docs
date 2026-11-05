# Services

All services are registered under the `kilowahti` domain. Every service takes an optional `config_entry_id` field that says which Kilowahti instance to use. When only one instance is configured it can be omitted. With several instances it is required: a call without it fails with a validation error, so the examples below leave it out for brevity but need it added in a multi-instance setup.

Invalid calls (no Kilowahti entry configured, unknown `config_entry_id` or period id, an invalid or overlapping fixed period) fail with a validation error that Home Assistant shows in the UI and in automation traces. Automations that catch the error should catch `ServiceValidationError`.

## Price queries

All price queries accept a `formatted` parameter (default `true`), which rounds prices to your display precision and converts them to your display unit. When `false`, prices come back at full precision in the minor unit of your display currency (`c/kWh`, `öre/kWh`, …).

---

### `kilowahti.get_active_prices`

Returns all price slots for today and tomorrow (default), or a custom time range. Each slot includes the active price (spot, or your contract rate during a fixed-price period) and the total price (active price + transfer).

```yaml
action: kilowahti.get_active_prices
data: {}
```

```yaml
action: kilowahti.get_active_prices
data:
  start: "2026-03-10T00:00:00"
  end: "2026-03-10T23:59:59"
  formatted: false
```

**Response** (shortened for the example; the full response has one element for each slot in the time range):
```json
{
  "unit": "c/kWh",
  "price_periods": [
    {
      "time": "2026-03-10T00:00:00+02:00",
      "price": 4.32,
      "total_price": 6.87,
      "rank": 3,
      "is_fixed": false
    },
    {
      "time": "2026-03-10T00:15:00+02:00",
      "price": 4.32,
      "total_price": 6.87,
      "rank": 3,
      "is_fixed": false
    },
    "..."
  ]
}
```

---

### `kilowahti.get_prices`

Returns raw spot price slots for a time range. Prices are spot-only (with VAT and commission applied) — fixed-price periods and transfer are not included in these prices. The `time` of each slot in the response is in UTC.

```yaml
action: kilowahti.get_prices
data:
  start: "2026-03-10T00:00:00"
  end: "2026-03-10T23:59:59"
```

---

### `kilowahti.cheapest_hours`

Within a time range, based on total price (spot or fixed-period rate plus transfer), finds the cheapest consecutive window of the desired length.

```yaml
action: kilowahti.cheapest_hours
data:
  start: "2026-03-10T18:00:00"
  end: "2026-03-11T08:00:00"
  hours: 3
  reverse: false  # optional, default: false
```

!!! tip "Find the latest window with `reverse`"
    Set `reverse: true` to return the **latest** cheapest window when there are ties (useful for "charge the battery at a lower price before prices rise" automations, or when searching at night for the latest valid heating window before prices rise in the morning). Default `false` returns the earliest possible window.

**Response:**
```json
{
  "start": "2026-03-10T20:00:00+00:00",
  "end": "2026-03-10T22:45:00+00:00",
  "average_price": 3.21,
  "unit": "c/kWh",
  "price_periods": [...]
}
```

`start` and `end` are in UTC. `end` is the start time of the window's last slot, not the moment the window finishes: above, the last of the twelve 15-minute slots starts at 22:45 UTC and ends at 23:00. The `time` values in `price_periods` are UTC too.

!!! tip "Scheduling appliances at the cheapest time"
    Call this service once per day after tomorrow's prices arrive, store the result in an `input_datetime` helper, and trigger your appliance from that. See [Automation examples → Schedule appliance at cheapest upcoming window](automations.md#schedule-appliance-at-cheapest-upcoming-window) for a complete example.

---

### `kilowahti.average_price`

Returns aggregate price statistics for a time range, using the spot price with VAT and commission applied. Fixed-price periods and transfer are not included in these prices.

```yaml
action: kilowahti.average_price
data:
  start: "2026-03-10T00:00:00"
  end: "2026-03-10T23:59:59"
```

**Response:**
```json
{
  "average_price": 5.14,
  "min_price": 1.23,
  "max_price": 12.87,
  "unit": "c/kWh",
  "slot_count": 96
}
```

---

## Generation & export

These services require **generation to be enabled** in configuration.

---

### `kilowahti.get_export_prices`

Returns export price slots for a time range, using the configured export pricing mode (spot-linked or fixed rate).

```yaml
action: kilowahti.get_export_prices
data:
  start: "2026-03-10T00:00:00"
  end: "2026-03-10T23:59:59"
```

**Response:**
```json
{
  "unit": "c/kWh",
  "price_periods": [
    {
      "time": "2026-03-10T00:00:00+02:00",
      "export_price": 3.00
    }
  ]
}
```

---

### `kilowahti.best_export_hours`

Finds the most profitable consecutive window for grid export within a time range, using export price.

```yaml
action: kilowahti.best_export_hours
data:
  start: "2026-03-10T08:00:00"
  end: "2026-03-10T20:00:00"
  hours: 2
```

**Response:**
```json
{
  "start": "2026-03-10T12:00:00+00:00",
  "end": "2026-03-10T13:45:00+00:00",
  "average_export_price": 8.45,
  "unit": "c/kWh",
  "price_periods": [...]
}
```

`start` and `end` are in UTC, and `end` is the start time of the window's last slot (above, the last of eight 15-minute slots starts at 13:45 UTC and ends at 14:00). The `time` values in `price_periods` are in local time.

---

### `kilowahti.generation_schedule`

Takes an hourly solar generation forecast and returns a recommended action for each slot.

```yaml
action: kilowahti.generation_schedule
data:
  forecast:
    - time: "2026-03-10T10:00:00"
      kwh: 2.5
    - time: "2026-03-10T11:00:00"
      kwh: 3.1
```

**Response:**
```json
{
  "schedule": [
    {
      "time": "2026-03-10T10:00:00+02:00",
      "kwh": 2.5,
      "action": "self_consume",
      "export_price": 3.20,
      "self_consumption_value": 7.85
    }
  ]
}
```

Possible `action` values: `export`, `self_consume` and `idle`. The recommendation is `export` when the export price is at least as high as the self-consumption value (spot price plus transfer), otherwise `self_consume` if the slot has forecast generation, otherwise `idle`.

---

## Fixed-period management

### `kilowahti.add_fixed_period`

Adds a fixed-price contract period. Periods cannot overlap.

```yaml
action: kilowahti.add_fixed_period
data:
  label: "Winter fixation"
  start_date: "2026-01-01"
  end_date: "2026-03-31"
  price: 8.5
```

!!! note "Always enter prices including VAT"
    `price` is entered **gross (VAT included)**. It is used as-is, and VAT is not added on top.

---

### `kilowahti.remove_fixed_period`

Removes a fixed-price period by its ID (returned by `list_fixed_periods`).

```yaml
action: kilowahti.remove_fixed_period
data:
  period_id: "3f4a1b2c-..."
```

---

### `kilowahti.list_fixed_periods`

Lists all configured fixed-price periods.

```yaml
action: kilowahti.list_fixed_periods
data: {}
```
