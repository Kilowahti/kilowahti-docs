# Automation examples

These examples use `{name}` as a placeholder for the name you set during configuration. If your name is `Home`, replace `{name}` with `home` in entity IDs.

---

## Run during cheap hours (rank-based)

The simplest approach: use the `rank_acceptable` binary sensor to gate an automation. Set your acceptable rank threshold in the Kilowahti options.

```yaml
alias: Run dishwasher during cheap hours
trigger:
  - platform: state
    entity_id: binary_sensor.kilowahti_{name}_rank_acceptable
    to: "on"
action:
  - service: switch.turn_on
    target:
      entity_id: switch.dishwasher
trigger_variables: {}
```

To stop the device when the window ends:

```yaml
alias: Stop dishwasher when hours no longer cheap
trigger:
  - platform: state
    entity_id: binary_sensor.kilowahti_{name}_rank_acceptable
    to: "off"
action:
  - service: switch.turn_off
    target:
      entity_id: switch.dishwasher
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
  - service: switch.turn_on
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

**Step 1 — Find the window (runs daily at 17:00):**

```yaml
alias: Find cheapest 3-hour overnight window
trigger:
  - platform: time
    at: "17:00:00"
action:
  - service: kilowahti.cheapest_hours
    data:
      start: "{{ now().isoformat() }}"
      end: "{{ (now() + timedelta(hours=15)).isoformat() }}"
      hours: 3
    response_variable: result
  - service: input_datetime.set_datetime
    data:
      timestamp: "{{ result['start'] }}"
    target:
      entity_id: input_datetime.cheapest_window_start
```

**Step 2 — Start the appliance at the scheduled time:**

```yaml
alias: Start dishwasher at cheapest window
trigger:
  - platform: time
    at: input_datetime.cheapest_window_start
action:
  - service: switch.turn_on
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
  - service: climate.set_temperature
    data:
      temperature: >
        {{ 19 + (states('sensor.kilowahti_{name}_control_factor_price') | float) * 3 }}
    target:
      entity_id: climate.living_room
```

For a ±1 bipolar input (e.g. to feed a PID controller), use `sensor.kilowahti_{name}_control_factor_price_bipolar` instead.

!!! note
    The control factor shape (linear or sinusoidal) and scaling exponent are configurable in Kilowahti options. Sinusoidal gives a gentler response near the extremes.
