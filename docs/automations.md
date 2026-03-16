# Automation examples

These examples use `{name}` as a placeholder for the name you set during configuration. If your name is `Home`, replace `{name}` with `home` in entity IDs.

---

## Run during cheap hours (rank-based)

The simplest approach: use the `rank_acceptable` binary sensor to gate an automation. Set your acceptable rank threshold in the Kilowahti options.

```yaml
alias: Heat water during cheap hours
trigger:
  - platform: state
    entity_id: binary_sensor.kilowahti_{name}_rank_acceptable
    to: "on"
action:
  - action:switch.turn_on
    target:
      entity_id: switch.water_heater
trigger_variables: {}
```

To stop the device when the window ends:

```yaml
alias: Stop water heater when hours no longer cheap
trigger:
  - platform: state
    entity_id: binary_sensor.kilowahti_{name}_rank_acceptable
    to: "off"
action:
  - action:switch.turn_off
    target:
      entity_id: switch.water_heater
```

---

## Run when price is below threshold

Use `price_acceptable` when you care about the absolute price rather than relative rank. Set your threshold in Kilowahti options.

```yaml
alias: EV charging when price is acceptable
trigger:
  - platform: state
    entity_id: binary_sensor.kilowahti_{name}_price_acceptable
    to: "on"
action:
  - action:switch.turn_on
    target:
      entity_id: switch.ev_charger
```

You can also combine both conditions using `price_or_rank_acceptable`:

```yaml
trigger:
  - platform: state
    entity_id: binary_sensor.kilowahti_{name}_price_or_rank_acceptable
    to: "on"
```

---

## Schedule appliance at cheapest upcoming window

Use the `kilowahti.cheapest_hours` service to find the cheapest consecutive block ahead of time and schedule your appliance to start then. Requires an `input_datetime` helper (e.g. `input_datetime.cheapest_window_start`).

**Automation 1 — Find the window (runs daily at 17:00):**

```yaml
alias: Find cheapest 3-hour overnight window
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

**Automation 2 — Start the appliance at the scheduled time:**

```yaml
alias: Start dishwasher at cheapest window
trigger:
  - platform: time
    at: input_datetime.cheapest_window_start
action:
  - action:switch.turn_on
    target:
      entity_id: switch.dishwasher
```

---

## Proportional control (thermostat / climate)

Use `control_factor_price` to modulate a setpoint rather than switching on/off. 1.0 = cheapest slot, 0.0 = most expensive.

This example adjusts a thermostat setpoint between 19 °C (expensive) and 22 °C (cheap):

```yaml
alias: Adjust thermostat by price
trigger:
  - platform: state
    entity_id: sensor.kilowahti_{name}_control_factor_price
action:
  - action:climate.set_temperature
    data:
      temperature: >
        {{ 19 + (states('sensor.kilowahti_{name}_control_factor_price') | float) * 3 }}
    target:
      entity_id: climate.living_room
```

For a ±1 bipolar input (e.g. to feed a PID controller), use `sensor.kilowahti_{name}_control_factor_price_bipolar` instead.

!!! note
    The control factor shape (linear or sinusoidal) and scaling exponent are configurable in Kilowahti options. Sinusoidal gives a gentler response near the extremes.

---

## Scale EV charging current by price

Rather than switching an EV charger on or off, use `control_factor_price` to continuously scale the charging current between a minimum and maximum. 1.0 = cheapest slot (full current), 0.0 = most expensive slot (minimum current).

This example scales between 6 A and 16 A:

```yaml
alias: Scale EV charging current by price
trigger:
  - platform: state
    entity_id: sensor.kilowahti_{name}_control_factor_price
action:
  - action:number.set_value
    target:
      entity_id: number.ev_charger_current
    data:
      value: >
        {{ (6 + (states('sensor.kilowahti_{name}_control_factor_price') | float) * 10) | round(0) | int }}
```

Adjust `6` (minimum) and `16` (maximum) to your charger's supported range. Check your charger's integration documentation for the correct entity and accepted values.

---

## Charge and discharge a battery by quartile

Use `price_quartile` to drive a home battery: charge in the cheapest 25% of slots (Q1), discharge in the most expensive 25% (Q4), and leave it on automatic otherwise.

```yaml
alias: Battery charge/discharge by price quartile
trigger:
  - platform: state
    entity_id: sensor.kilowahti_{name}_price_quartile
action:
  - choose:
      - conditions:
          - condition: state
            entity_id: sensor.kilowahti_{name}_price_quartile
            state: "1"
        sequence:
          - action:select.select_option
            target:
              entity_id: select.battery_mode
            data:
              option: charge
      - conditions:
          - condition: state
            entity_id: sensor.kilowahti_{name}_price_quartile
            state: "4"
        sequence:
          - action:select.select_option
            target:
              entity_id: select.battery_mode
            data:
              option: discharge
    default:
      - action:select.select_option
        target:
          entity_id: select.battery_mode
        data:
          option: auto
```

Replace `select.battery_mode` and the option values with the entities and modes your battery integration exposes.

---

## Notify when tomorrow's prices are available

Tomorrow's prices are published by the exchange around 14:00–15:00 EET. Trigger on `tomorrow_available` turning on to send a push notification with the day's price range.

```yaml
alias: Notify when tomorrow's prices arrive
trigger:
  - platform: state
    entity_id: binary_sensor.kilowahti_{name}_tomorrow_available
    to: "on"
action:
  - action:notify.mobile_app_your_phone
    data:
      title: "Tomorrow's electricity prices"
      message: >
        Min {{ states('sensor.kilowahti_{name}_tomorrow_spot_min') }},
        avg {{ states('sensor.kilowahti_{name}_tomorrow_spot_avg') }},
        max {{ states('sensor.kilowahti_{name}_tomorrow_spot_max') }}
        {{ state_attr('sensor.kilowahti_{name}_tomorrow_spot_min', 'unit_of_measurement') }}
```

Replace `notify.mobile_app_your_phone` with your notification service.

---

## Alert when spot price exceeds today's average

Send a notification whenever the current slot price rises above today's average — useful as an early warning to delay discretionary loads.

```yaml
alias: Alert when price exceeds today's average
trigger:
  - platform: template
    value_template: >
      {{ states('sensor.kilowahti_{name}_spot_price') | float(0) >
         states('sensor.kilowahti_{name}_today_spot_avg') | float(0) }}
action:
  - action:notify.mobile_app_your_phone
    data:
      message: >
        Electricity price {{ states('sensor.kilowahti_{name}_spot_price') }}
        is above today's average {{ states('sensor.kilowahti_{name}_today_spot_avg') }}
        {{ state_attr('sensor.kilowahti_{name}_spot_price', 'unit_of_measurement') }}.
```

