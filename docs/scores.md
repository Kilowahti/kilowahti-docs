# Optimization scores

Kilowahti's optimization scores measure how well your electricity consumption is shifted to cheap hours. A score of 100 means your usage is concentrated in the cheapest slots; a score near 0 means you're consuming mostly during the most expensive hours.

## How it works

Each day is divided into four price-rank quartiles:

| Quartile | Rank range (15-min) | Rank range (1-hour) | Meaning |
|---|---|---|---|
| Q1 | 1–24 | 1–6 | Cheapest 25% of slots |
| Q2 | 25–48 | 7–12 | |
| Q3 | 49–72 | 13–18 | |
| Q4 | 73–96 | 19–24 | Most expensive 25% |

Kilowahti tracks energy consumption (from your linked meter entities) slot by slot and accumulates totals per quartile throughout the day.

## Formula

```
raw = (Q1×3 + Q2×2 + Q3×1) / (Total×3) × 100
score = clamp((raw − 30) / 53.3 × 100, 0, 100)
```

### What the numbers mean

| Scenario | Score |
|---|---|
| All consumption in Q1 | 100 |
| Equal split between Q1 and Q2 | 100 |
| Perfectly uniform across all quartiles | ~38 |
| All consumption in Q3 | ~6 |
| All consumption in Q4 | 0 |

The formula is calibrated so that random, unoptimized consumption lands around **38**, not 50. This gives more room at the top end to reward deliberate shifting into cheap hours.

## Daily and monthly scores

- **Today score** — updated in real time as consumption is recorded throughout the day. Resets at midnight.
- **Monthly score** — rolling average of completed daily scores for the current month. Updated each midnight.

Daily scores are stored for 90 days, so the monthly average covers all completed days since installation (up to 90).

## Setting up score profiles

1. Go to **Settings → Devices & Services → Kilowahti → Configure → Score profiles**
2. Click **✎ Edit** next to the **Total** profile
3. Select your main grid import meter (must have `state_class: total_increasing`)
4. Save

You can add additional profiles to track specific circuits or devices separately.

!!! note
    The meter entity must have `state_class: total_increasing` — this is standard for energy meters in Home Assistant (e.g. `sensor.electricity_meter_energy`).
