# Control factor

Most price automations are switches: run the water heater, or don't. The control factor is for the other kind — devices with a dial. Heating setpoints, EV charging current, fan speeds, battery charge power. Instead of asking "is it cheap enough", you get a number that says *how* cheap right now is, and you scale the dial by it.

## The idea

Kilowahti ranks every slot of the day by price. The control factor turns that rank into a number between 0 and 1:

- **1.0** — the cheapest slot of the day
- **0.0** — the most expensive
- anything between — proportionally in between

"Cheaper is higher" is deliberate: it makes the factor usable directly as a multiplier. Charging current becomes `max_current × factor`, no inversion needed.

Each factor also has a **bipolar** twin running from −1 to +1, for when you want a signed number: positive means cheaper than the middle of the day, negative means more expensive.

## Which one to use

Three factors, each ranking by a different price:

| Sensor | Ranks by | Use when |
|---|---|---|
| `control_factor_price` | Energy price only | Your grid fee is flat, or you only care about the market |
| `control_factor_total` | Energy plus transfer | You want the real cost per kWh — usually the right one |
| `control_factor_transfer` | Transfer tier only | You want to dodge grid peak tariffs specifically |

They all share one scale, and the configured curve and scaling apply to all three.

!!! note "On a fixed-price contract"
    During a [fixed-price period](fixed-periods.md) every hour costs the same, so `control_factor_price` sits at 1.0 all day — correct, since no hour is worse than another. `control_factor_total` still varies if your transfer tariff does.

## Curve and scaling

Two settings change how the rank is mapped onto the 0–1 range. Both live under **Thresholds & control** in the setup wizard and in Configure.

**Curve** — `linear` spreads the factor evenly across the day. `sinusoidal` is flat near the extremes and steep in the middle, so the cheapest few slots all score nearly 1.0, the most expensive few nearly 0.0, and the change happens across mid-range prices.

**Scaling** — an exponent from 1 to 3 applied to the result. Higher values push everything except the cheapest slots downward, making the factor behave more like a switch.

Values for a 24-slot day:

| Rank | Linear | Sinusoidal | Linear, scaling 2 | Sinusoidal, scaling 2 |
|---:|---:|---:|---:|---:|
| 1 | 1.00 | 1.00 | 1.00 | 1.00 |
| 3 | 0.91 | 0.98 | 0.83 | 0.96 |
| 6 | 0.78 | 0.89 | 0.61 | 0.79 |
| 9 | 0.65 | 0.73 | 0.43 | 0.53 |
| 12 | 0.52 | 0.53 | 0.27 | 0.29 |
| 15 | 0.39 | 0.33 | 0.15 | 0.11 |
| 18 | 0.26 | 0.16 | 0.07 | 0.03 |
| 21 | 0.13 | 0.04 | 0.02 | 0.00 |
| 24 | 0.00 | 0.00 | 0.00 | 0.00 |

Reading across: at rank 6 — a fairly cheap hour — linear says 0.78 while sinusoidal says 0.89, treating it as nearly as good as the best. At rank 18 they diverge the other way, 0.26 against 0.16. Add scaling 2 and rank 12, the middle of the day, drops from 0.52 to 0.27.

**Start with linear and scaling 1.** Move to sinusoidal if your automations fidget between adjacent ranks; raise the scaling if you want the response concentrated on genuinely cheap hours.

## Using it

The pattern is always the same: pick a range for your device, and place the factor inside it.

**Heating setpoint**, 19 °C when expensive, 22 °C when cheapest:

```yaml
{{ 19 + 3 * states('sensor.kilowahti_home_control_factor_total') | float(0) }}
```

Rank 1 gives 22.0 °C, rank 12 gives 20.6 °C, rank 24 gives 19.0 °C.

**EV charging current**, between 6 A and 16 A:

```yaml
{{ 6 + 10 * states('sensor.kilowahti_home_control_factor_total') | float(0) }}
```

16 A at the cheapest hour, 11.2 A mid-day, 6 A at the worst.

Both go in a `number.set_value` or `climate.set_temperature` action, triggered however you like — a time pattern every 15 minutes, or Kilowahti's own [triggers](triggers-conditions.md). [Automation examples](automations.md#proportional-control-thermostat-climate) has these written out in full.

Always guard with `| float(0)`: the factor is unavailable until the first prices arrive, and an unguarded template will throw on restart.

## When not to use it

The control factor answers "how cheap is now, relative to the rest of today". It says nothing about absolute price. On a day where every hour is expensive, the cheapest hour still scores 1.0. If your device should stay off when electricity is simply costly, gate it on the price threshold — `binary_sensor.kilowahti_{name}_price_acceptable` or the ["price is acceptable" condition](triggers-conditions.md) — and use the control factor only to modulate what happens after that gate opens.
