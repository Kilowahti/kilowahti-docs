# Services

All services are registered under the `kilowahti` domain. When only one Kilowahti instance is configured, `config_entry_id` can be omitted.

## Price query services

All price query services accept a `formatted` parameter (default `true`). When `false`, prices are returned as raw `c/kWh` at full precision regardless of your display unit setting.

---

### `kilowahti.get_active_prices`

Returns all price slots for today and tomorrow (default), or a custom time range.

```yaml
service: kilowahti.get_active_prices
data: {}
```

```yaml
service: kilowahti.get_active_prices
data:
  start: "2026-03-10T00:00:00"
  end: "2026-03-10T23:59:59"
  formatted: false
```

**Response:**
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
    }
  ]
}
```

---

### `kilowahti.get_prices`

Returns raw spot price slots for a time range.

```yaml
service: kilowahti.get_prices
data:
  start: "2026-03-10T00:00:00"
  end: "2026-03-10T23:59:59"
```

---

### `kilowahti.cheapest_hours`

Finds the cheapest consecutive window of a given length within a time range.

```yaml
service: kilowahti.cheapest_hours
data:
  start: "2026-03-10T18:00:00"
  end: "2026-03-11T08:00:00"
  hours: 3
```

**Response:**
```json
{
  "start": "2026-03-10T22:00:00+02:00",
  "end": "2026-03-11T00:45:00+02:00",
  "average_price": 3.21,
  "unit": "c/kWh",
  "price_periods": [...]
}
```

!!! tip "Scheduling appliances at the cheapest time"
    Call this service once per day (e.g. at 17:00 after tomorrow's prices arrive), store the result in an `input_datetime` helper, and trigger your automation at that time.

    ```yaml
    alias: Find cheapest 3-hour window overnight
    trigger:
      - platform: time
        at: "17:00:00"
    action:
      - action:kilowahti.cheapest_hours
        data:
          start: "{{ now().isoformat() }}"
          end: "{{ (now() + timedelta(hours=15)).isoformat() }}"
          hours: 3
        response_variable: result
      - action:input_datetime.set_datetime
        data:
          timestamp: "{{ result['start'] }}"
        target:
          entity_id: input_datetime.cheapest_window_start
    ```

    Then use a separate automation triggered by `input_datetime.cheapest_window_start` to turn on your appliance.

---

### `kilowahti.average_price`

Returns aggregate price statistics for a time range.

```yaml
service: kilowahti.average_price
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

## Generation & export services

These services require **generation to be enabled** in configuration.

---

### `kilowahti.get_export_prices`

Returns export price slots for a time range.

```yaml
service: kilowahti.get_export_prices
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

Finds the most profitable consecutive window for grid export within a time range.

```yaml
service: kilowahti.best_export_hours
data:
  start: "2026-03-10T08:00:00"
  end: "2026-03-10T20:00:00"
  hours: 2
```

**Response:**
```json
{
  "start": "2026-03-10T14:00:00+02:00",
  "end": "2026-03-10T16:00:00+02:00",
  "average_export_price": 8.45,
  "unit": "c/kWh",
  "price_periods": [...]
}
```

---

### `kilowahti.best_charge_hours`

Finds the cheapest consecutive window for grid charging a battery within a time range.

```yaml
service: kilowahti.best_charge_hours
data:
  start: "2026-03-10T00:00:00"
  end: "2026-03-10T23:59:59"
  hours: 2
```

**Response:**
```json
{
  "start": "2026-03-10T03:00:00+02:00",
  "end": "2026-03-10T05:00:00+02:00",
  "average_price": 2.10,
  "unit": "c/kWh",
  "price_periods": [...]
}
```

---

### `kilowahti.generation_schedule`

Takes an hourly solar generation forecast and returns a recommended action for each slot.

```yaml
service: kilowahti.generation_schedule
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

Possible `action` values: `self_consume`, `export`, `charge_battery`.

---

## Fixed-period management services

### `kilowahti.add_fixed_period`

Adds a fixed-price contract period. Periods cannot overlap.

```yaml
service: kilowahti.add_fixed_period
data:
  label: "Winter fixation"
  start_date: "2026-01-01"
  end_date: "2026-03-31"
  price: 8.5
```

!!! note
    `price` is entered **gross (VAT included)**. It is used as-is — no VAT is added.

---

### `kilowahti.remove_fixed_period`

Removes a fixed-price period by its ID (returned by `list_fixed_periods`).

```yaml
service: kilowahti.remove_fixed_period
data:
  period_id: "3f4a1b2c-..."
```

---

### `kilowahti.list_fixed_periods`

Lists all configured fixed-price periods.

```yaml
service: kilowahti.list_fixed_periods
data: {}
```
