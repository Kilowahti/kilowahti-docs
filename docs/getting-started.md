# Getting started

This page walks through a first setup end to end: install, answer the wizard, check that prices arrived, and build one automation. It takes about ten minutes, and skips every optional feature — you can add those later without redoing anything.

If you want the full reference for a field, [Configuration](configuration.md) documents every step in detail.

## Before you start

You need two things:

- **Your bidding zone.** This is the price area your electricity is billed in, not your country — Sweden has four, Norway five, Italy seven. The [supported regions](index.md#supported-regions) table lists them all. If you are unsure, your electricity bill or supplier's price page will name it.
- **Whether you are on a spot contract or a fixed price.** Kilowahti works for both. Start with the spot setup below either way; fixed-price contracts are handled by adding a [fixed-price period](fixed-periods.md) afterwards.

You do **not** need an API key, an account, or any other integration. Prices are fetched automatically.

## 1. Install

Follow [Installation](installation.md) — in short: HACS → search **Kilowahti** → Download → restart Home Assistant.

## 2. Run the wizard

**Settings → Devices & Services → Add Integration → Kilowahti**

The wizard has six steps, or seven if your region bills in a local currency. For a first setup, this is all you need to decide:

| Step | What to do first time |
|---|---|
| **Basic settings** | Enter a short name (e.g. `Home`) — it becomes part of every entity ID. Pick your region. Leave resolution at 15 minutes unless your contract bills hourly. |
| **Currency** *(non-euro regions only)* | Pick your local currency and leave the exchange rate on automatic. |
| **VAT & electricity tax** | Pre-filled for your region. Change it only if your contract differs. If your supplier charges a margin per kWh, enter it as the commission. |
| **Transfer pricing** | **Skip it.** Grid fees can be added later, and everything works without them. |
| **Thresholds & control** | Accept the defaults. |
| **Optimization scores** | **Skip it.** A `Total` profile is created automatically; you can attach a meter later. |
| **Sensor display** | Leave everything off. |

That's it — entities appear immediately.

!!! tip "About the default thresholds"
    The defaults are a starting point, not a recommendation: price threshold 20 c/kWh, rank threshold 24. At 15-minute resolution a rank threshold of 24 means "the cheapest 24 of today's 96 slots", i.e. the cheapest six hours of the day. Both are adjustable later from a dashboard — see [step 5](#5-tune-the-thresholds-later).

## 3. Check that it worked

Go to **Settings → Devices & Services → Kilowahti** and open the device it created. All of Kilowahti's entities live there. Look for these:

| Entity | What you should see |
|---|---|
| `sensor.kilowahti_{name}_spot_price` | The market price for right now |
| `sensor.kilowahti_{name}_total_price` | What you actually pay per kWh, VAT and grid fees included |
| `sensor.kilowahti_{name}_rank` | Where this slot ranks in today's prices — 1 is the cheapest of the day |
| `binary_sensor.kilowahti_{name}_rank_acceptable` | `on` when the current slot is at or below your rank threshold |
| `sensor.kilowahti_{name}_price_data_source` | Which price source is being used |

Replace `{name}` with the name you entered, lowercased.

**If tomorrow's prices are not there yet, that is normal.** The European day-ahead market publishes them in the early afternoon; Kilowahti starts looking at 13:00 CET and picks them up when they appear. Until then, every `tomorrow_*` sensor reads *unknown*.

## 4. Build your first automation

The quickest useful automation: heat water, charge a car, or run a dishwasher when the price is low.

1. **Settings → Automations & scenes → Create automation → Create new automation**
2. **Add trigger** → search `Kilowahti` → **Rank became acceptable**
3. **Add action** → whatever you want switched on
4. Save

That is a complete automation. It fires when the current slot enters the cheapest part of the day, as you defined it with the rank threshold.

To switch the device off again, add a second automation with the **Rank no longer acceptable** trigger.

[Triggers and conditions](triggers-conditions.md) lists everything else you can trigger on. [Automation examples](automations.md) shows richer patterns once you outgrow these.

## 5. Tune the thresholds later

You do not need to reopen the setup wizard to change how aggressive your automations are. Two entities control it, and both can go on a dashboard:

- `number.kilowahti_{name}_price_threshold`
- `number.kilowahti_{name}_rank_threshold`

Drag them, and every threshold-based binary sensor, trigger and condition follows immediately.

A minimal dashboard card to see the essentials together:

```yaml
type: entities
title: Electricity
entities:
  - entity: sensor.kilowahti_{name}_total_price
  - entity: sensor.kilowahti_{name}_rank
  - entity: binary_sensor.kilowahti_{name}_rank_acceptable
  - entity: number.kilowahti_{name}_rank_threshold
```

## Where to go next

Add these when you need them — in any order, nothing depends on the others:

- **[Transfer pricing](transfer-pricing.md)** — enter your grid operator's tariff so `total_price` reflects your real cost. Worth doing; grid fees are often a third of the bill.
- **[Fixed-price periods](fixed-periods.md)** — if you are on a fixed contract, tell Kilowahti the rate and dates. Price sensors switch to your contract price for those days.
- **[Optimization scores](scores.md)** — attach an energy meter and get a daily 0–100 score for how well your consumption landed on cheap hours.
- **[Entities](entities.md)** — the full list, including export, battery and solar sensors that appear once enabled in Advanced options.
- **[FAQ](faq.md)** — why tomorrow is missing, why your prices differ from your bill, and what the control factor is for.
