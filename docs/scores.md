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

## Formulas

Two scoring formulas are available per profile. You can select the formula when adding or editing a score profile.

### Default formula

```
raw = (Q1×3 + Q2×2 + Q3×1) / (Total×3) × 100
score = clamp((raw − 30) / 53.3 × 100, 0, 100)
```

| Scenario | Score |
|---|---|
| All consumption in Q1 | 100 |
| Equal split between Q1 and Q2 | 100 |
| Perfectly uniform across all quartiles | ~38 |
| All consumption in Q3 | ~6 |
| All consumption in Q4 | 0 |

Calibrated so that random, unoptimized consumption lands around **38**, not 50. This gives more room at the top end to reward deliberate shifting into cheap hours.

### Raw formula

```
score = clamp((Q1×3 + Q2×2 + Q3×1) / (Total×3) × 100, 0, 100)
```

| Scenario | Score |
|---|---|
| All consumption in Q1 | 100 |
| Equal split between Q1 and Q2 | 100 |
| Perfectly uniform across all quartiles | 50 |
| All consumption in Q3 | ~33 |
| All consumption in Q4 | 0 |

Uses a neutral baseline: perfectly uniform consumption scores exactly **50**. Easier to interpret at a glance — below 50 means worse than random, above 50 means better.

## Daily and monthly scores

- **Daily score** (`score_{profile}_daily`) — accumulates throughout the day as meter readings come in. Resets at midnight. Exposes a `previous` attribute with yesterday's completed score.
- **Monthly score** (`score_{profile}_monthly`) — average of completed daily scores for the current **calendar month** (not a rolling 30-day window). Updated each midnight. Exposes a `previous` attribute with the previous calendar month's final score.

Score sensors refresh at each price slot boundary (every 15 or 60 minutes depending on your resolution setting), not on every individual meter reading.

Daily scores are stored for 90 days. The last two completed calendar-month scores are stored separately and available via the `previous` attribute even after the 90-day history window has passed.

## Setting up score profiles

1. Go to **Settings → Devices & Services → Kilowahti → Configure → Score profiles**
2. Click **✎ Edit** next to the **Total** profile
3. Select **➕ Add meter(s)** and pick your main grid import meter
4. Select **⚙ Formula** to choose a scoring formula (Default or Raw)
5. Click **← Back**, then **✓ Save & close**

You can add additional profiles to track specific circuits or devices separately, each with its own formula.

!!! note
    The meter entity must have `state_class: total_increasing` — this is standard for energy meters in Home Assistant (e.g. `sensor.electricity_meter_energy`).
