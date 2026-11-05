# Transfer pricing

This is how you set up your network operator's transfer prices in Kilowahti so that they are included in price calculations and sensors.

## Groups and tiers

Transfer pricing is organised into **groups** that correspond to the different transfer products of network operators, each containing one or more **tiers** — a tier is a rule that activates when its conditions are met. Only one group is active at a time — this lets you store multiple contracts (e.g. seasonal or time-of-use) and switch between them without re-entering data. *(Remember to always check that the prices you entered earlier are still up to date.)*

A group has a name (e.g. Aikasiirto or Yösiirto) and the monthly fee of that transfer product or connection.

Each tier in a group has a transfer price per kWh and the conditions for when it applies:

| Field | Description |
|---|---|
| Price | In your display unit, gross (VAT included) |
| Months active | Which months this tier applies |
| Weekdays active | Which days of the week |
| Start / end time | Sets the hour range during which the condition is met (start inclusive, end exclusive: 6–22 covers 6:00–21:59) |
| Priority | The order in which tiers are checked — see below |

### How priority works

Tiers are checked in ascending priority order, i.e. the smallest number first, and **the first one that matches wins**. A smaller priority number therefore means a tier is checked *earlier* than a larger one, so priority 1 beats priority 2.

The practical pattern is: describe your restricted rates explicitly with tiers that have small priority numbers, and give the fallback rate the largest number so that it only applies when no earlier tier matched.

!!! tip "Always end with a catch-all"
    Give your base rate no time restrictions — all months, all weekdays, hours 0 to 24 — and the highest priority number in the group. It then acts as a fallback at the bottom, guaranteeing that every hour of the year has a transfer price. Without one, hours matching no tier have no transfer price at all.

## Viewing and editing tiers

Open **Configure → Transfer pricing** and select a group. The group screen lists every tier it holds — price, months, weekdays, hour range, and priority — in evaluation order.

Selecting **✎ Edit tier** opens the tier with all of its current values filled in. Change any field and confirm to save, or tick **Remove this tier** to delete it.

## Effect on sensors and binary sensors

When a transfer group is active:

- `sensor.kilowahti_{name}_transfer_price` shows the current tier's price. Its `tariff` attribute names the group and tier in use, e.g. `Kausisiirto, Muu aika`, and both are also available in their own attributes, `group` and `tier`
- `sensor.kilowahti_{name}_total_price` becomes the active price plus the transfer price
- `sensor.kilowahti_{name}_control_factor_transfer` rates the current tier against the other tiers occurring today: **1.0 = cheapest tier, 0.0 = most expensive**, on the same scale as the other [control factors](control-factor.md). A group with only one tier in play sits at a constant 1.0. There is a bipolar variant running from −1 to +1
- `sensor.kilowahti_{name}_total_price_rank` and `control_factor_total` take the transfer price into account; the plain `price_rank` and `control_factor_price` do not
- The `price_acceptable` binary sensor can optionally include the transfer price in its comparison (configured via **Max price includes transfer**)

Until a transfer group is configured, `transfer_price` and `control_factor_transfer` read *unknown* rather than zero — Kilowahti does not pretend the grid is free.

## Example: Finnish Yleissiirto (flat rate)

*Yleissiirto* is a single-rate tariff with no time restrictions — the same price applies around the clock, every day of the year. It requires only one tier.

**Step-by-step setup**

1. Go to **Settings → Devices & Services → Kilowahti → Configure → Transfer pricing**
2. Select **➕ Add group**, enter the name **Yleissiirto**, enter your operator's monthly fee, and save
3. Select **⚙ Manage: Yleissiirto** from the list
4. Select **➕ Add tier** and fill in the single rate:

    | Field | Value |
    |---|---|
    | Tier name | Yleissiirto |
    | Price | *(your operator's rate per kWh, incl. VAT)* |
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

Because Kilowahti evaluates tiers in ascending priority order and stops at the first match, give the more restricted rate (day, i.e. one continuous period within the same day) the smaller number and let the night rate act as the base tier behind it.

**Step-by-step setup**

1. Go to **Settings → Devices & Services → Kilowahti → Configure → Transfer pricing**
2. Select **➕ Add group**, enter the name **Aikasiirto**, enter the transfer product's monthly fee, and save
3. Select **⚙ Manage: Aikasiirto** from the list
4. Select **➕ Add tier** and fill in the day rate:

    | Field | Value |
    |---|---|
    | Tier name | Päivä |
    | Price | *(your operator's day rate per kWh, incl. VAT)* |
    | Months active | *(all months)* |
    | Weekdays active | *(all days)* |
    | Start time | 7 |
    | End time | 22 |
    | Priority | 1 |

5. Select **➕ Add tier** again and fill in the night catch-all:

    | Field | Value |
    |---|---|
    | Tier name | Yö |
    | Price | *(your operator's night rate per kWh, incl. VAT)* |
    | Months active | *(all months)* |
    | Weekdays active | *(all days)* |
    | Start time | 0 |
    | End time | 24 |
    | Priority | 2 |

    Start 0 and end 24 means the tier covers the full day — this is intentional for a catch-all. Its larger priority number means it is only reached when no earlier tier matched.

6. Select **← Back**, then **✓ Save & close**
7. To activate, open the group again and choose **Set as active group**

The day tier (priority 1) matches between 07:00–22:00. Outside those hours the night tier (priority 2) catches everything.

## Example: Finnish Kausisiirto (seasonal tariff)

Finnish network operators commonly offer a *kausisiirto* (seasonal transfer) tariff with two rates:

| Rate | When |
|---|---|
| Talviarkipäivä (peak) | November–March, Mon–Sat, 06:00–22:00 (or 07:00–22:00) |
| Muu aika (off-peak) | Everything else (Apr–Oct, winter Sundays, nights) |

Same priority approach as Aikasiirto above — the peak rate is described explicitly with priority 1, and the off-peak tier catches everything else with priority 2.

**Step-by-step setup**

1. Go to **Settings → Devices & Services → Kilowahti → Configure → Transfer pricing**
2. Select **➕ Add group**, enter the name **Kausisiirto**, enter the transfer product's monthly fee, and save
3. Select **⚙ Manage: Kausisiirto** from the list
4. Select **➕ Add tier** and fill in the peak rate:

    | Field | Value |
    |---|---|
    | Tier name | Talviarkipäivä |
    | Price | *(your operator's peak rate per kWh, incl. VAT)* |
    | Months active | November, December, January, February, March |
    | Weekdays active | Monday, Tuesday, Wednesday, Thursday, Friday, Saturday |
    | Start time | 6 |
    | End time | 22 |
    | Priority | 1 |

5. Select **➕ Add tier** again and fill in the off-peak catch-all:

    | Field | Value |
    |---|---|
    | Tier name | Muu aika |
    | Price | *(your operator's off-peak rate per kWh, incl. VAT)* |
    | Months active | *(all months)* |
    | Weekdays active | *(all days)* |
    | Start time | 0 |
    | End time | 24 |
    | Priority | 2 |

    Start 0 and end 24 means the tier covers the full day — this is intentional for a catch-all. Its larger priority number means it is only reached when no earlier tier matched.

6. Select **← Back**, then **✓ Save & close**
7. To activate, open the group again and choose **Set as active group**

The peak tier (priority 1) matches first whenever it is November–March, a weekday (Mon–Sat), and between 06:00–22:00. All other times fall through to the off-peak tier (priority 2).

## Switching groups

Go to **Configure → Transfer pricing**, select a group, and choose **Set as active group**. Only one group is active at a time, and switching takes effect immediately — no restart, no reload.

Edits to the active group's tiers also apply immediately.
