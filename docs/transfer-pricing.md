# Transfer pricing

Transfer pricing lets you include your network operator's distribution tariff in price calculations and sensors.

## Groups and tiers

Transfer pricing is organised into **groups**, each containing one or more **tiers**. Only one group is active at a time — this lets you store multiple contracts (e.g. seasonal or time-of-use) and switch between them without re-entering data.

Each tier defines a price and a time schedule:

| Field | Description |
|---|---|
| Price | c/kWh, gross (VAT included) |
| Months active | Which months this tier applies |
| Weekdays active | Which days of the week |
| Start / end time | Hour range (start inclusive, end exclusive) |
| Priority | Lower number = evaluated first; first matching tier wins |

!!! tip
    Add a base rate tier with no time restrictions at the lowest priority as a catch-all. This ensures a transfer price is always matched.

## Effect on sensors and binary sensors

When a transfer group is active:

- `sensor.{name}_transfer_price` shows the current tier's price
- `sensor.{name}_total_price` = effective price + transfer price
- `sensor.{name}_control_factor_transfer` shows the current tier's normalized rank (0 = cheapest tier today, 1 = most expensive)
- The `price_acceptable` binary sensor can optionally include transfer price in its comparison (configured via **Max price includes transfer**)

## Example: Finnish Yleissiirto (flat rate)

*Yleissiirto* is a single-rate tariff with no time restrictions — the same price applies around the clock, every day of the year. It requires only one tier.

### Step-by-step setup

1. Go to **Settings → Devices & Services → Kilowahti → Configure → Transfer pricing**
2. Select **➕ Add group**, enter the name **Yleissiirto**, and confirm
3. Select **✎ Edit** next to Yleissiirto
4. Select **➕ Add tier** and fill in the single rate:

    | Field | Value |
    |---|---|
    | Tier name | Yleissiirto |
    | Price | *(your operator's rate, c/kWh incl. VAT)* |
    | Months active | *(all months)* |
    | Weekdays active | *(all days)* |
    | Start time | 0 |
    | End time | 24 |
    | Priority | 1 |

5. Select **← Back**, then **✓ Save & close**
6. To activate, open the group again and choose **Set as active group**

## Example: Finnish Aikasiirto (day/night tariff)

*Aikasiirto* is a two-rate tariff based on time of day: a higher day rate and a lower night rate. The boundary is typically 22:00–07:00, but check your operator's contract for the exact hours.

| Rate | When |
|---|---|
| Päivä (day) | 07:00–22:00, every day |
| Yö (night) | 22:00–07:00, every day |

As with Kausisiirto, define the more restricted rate first (day) and let the night rate act as a catch-all.

### Step-by-step setup

1. Go to **Settings → Devices & Services → Kilowahti → Configure → Transfer pricing**
2. Select **➕ Add group**, enter the name **Aikasiirto**, and confirm
3. Select **✎ Edit** next to Aikasiirto
4. Select **➕ Add tier** and fill in the day rate:

    | Field | Value |
    |---|---|
    | Tier name | Päivä |
    | Price | *(your operator's day rate, c/kWh incl. VAT)* |
    | Months active | *(all months)* |
    | Weekdays active | *(all days)* |
    | Start time | 7 |
    | End time | 22 |
    | Priority | 1 |

5. Select **➕ Add tier** again and fill in the night catch-all:

    | Field | Value |
    |---|---|
    | Tier name | Yö |
    | Price | *(your operator's night rate, c/kWh incl. VAT)* |
    | Months active | *(all months)* |
    | Weekdays active | *(all days)* |
    | Start time | 0 |
    | End time | 24 |
    | Priority | 2 |

6. Select **← Back**, then **✓ Save & close**
7. To activate, open the group again and choose **Set as active group**

The day tier (priority 1) matches between 07:00–22:00. Outside those hours the night tier (priority 2) catches everything.

## Example: Finnish Kausisiirto (seasonal tariff)

Finnish network operators commonly offer a *kausisiirto* (seasonal transfer) tariff with two rates:

| Rate | When |
|---|---|
| Talviarkipäivä (peak) | November–March, Mon–Sat, 06:00–22:00 (or 07:00–22:00) |
| Muu aika (off-peak) | Everything else (Apr–Oct, winter Sundays, nights) |

Because Kilowahti evaluates tiers in priority order and stops at the first match, you only need to define the peak rate explicitly — the off-peak tier acts as a catch-all with no time restrictions.

### Step-by-step setup

1. Go to **Settings → Devices & Services → Kilowahti → Configure → Transfer pricing**
2. Select **➕ Add group**, enter the name **Kausisiirto**, and confirm
3. Select **✎ Edit** next to Kausisiirto
4. Select **➕ Add tier** and fill in the peak rate:

    | Field | Value |
    |---|---|
    | Tier name | Talviarkipäivä |
    | Price | *(your operator's peak rate, c/kWh incl. VAT)* |
    | Months active | November, December, January, February, March |
    | Weekdays active | Monday, Tuesday, Wednesday, Thursday, Friday, Saturday |
    | Start time | 6 |
    | End time | 22 |
    | Priority | 1 |

5. Select **➕ Add tier** again and fill in the off-peak catch-all:

    | Field | Value |
    |---|---|
    | Tier name | Muu aika |
    | Price | *(your operator's off-peak rate, c/kWh incl. VAT)* |
    | Months active | *(all months)* |
    | Weekdays active | *(all days)* |
    | Start time | 0 |
    | End time | 24 |
    | Priority | 2 |

6. Select **← Back**, then **✓ Save & close**
7. To activate, open the group again and choose **Set as active group**

The peak tier (priority 1) matches first whenever it is November–March, a weekday (Mon–Sat), and between 06:00–22:00. All other times fall through to the off-peak tier (priority 2).

## Switching groups

Go to **Options → Transfer pricing**, select a group, and choose **Set as active group**.
