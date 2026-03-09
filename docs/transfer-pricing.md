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
