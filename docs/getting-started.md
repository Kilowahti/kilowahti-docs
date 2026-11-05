# Getting started

This page walks through a first setup end to end: install, answer the wizard, check that prices arrived, and build one automation. Setup takes about ten minutes, and every optional feature is skipped. You can easily add features later by editing the settings.

If you would rather go through the settings yourself without the instructions on this page, you can read about all of them on the [Configuration](configuration.md) page.

## Before you start

You need to know two things:

- **Your bidding zone.** In many countries this is the area your electricity is billed in, not just the country: for example Sweden has four, Norway five, Italy seven. All the zones are listed on the [supported regions](supported-regions.md) page. If you are unsure, the zone is usually named on your electricity bill or on your supplier's website.
- **What kind of electricity contract you have (spot or fixed price).** Kilowahti works with both. Start with the spot setup below anyway, and handle a fixed-price contract by adding a [fixed-price period](fixed-periods.md) afterwards. (Even if a fixed contract is valid indefinitely, in Kilowahti it is still a "period".)

You do **not** need an API key, an account, or any other integration. Kilowahti started partly because the existing integrations struggled with the switch to 15-minute pricing. Prices are always fetched into Kilowahti automatically, and usually reach your system within a minute or two of their Europe-wide publication.

## 1. Install

Follow the [Installation](installation.md) instructions. In short, depending on your Home Assistant version:

- Home Assistant version 2026.11 and newer:  
  **Settings → Marketplace** → search **Kilowahti** → Install.
- Older Home Assistant versions:  
  **HACS** → search **Kilowahti** → Download → restart Home Assistant.

## 2. Run the wizard

Before Home Assistant version 2026.11 the setup wizard has to be started manually: **Settings → Devices & Services → Add Integration → Kilowahti**

The wizard has six steps, or seven if your region bills in a local currency. For a first setup, you only need to decide these:

| Step | What to do first time |
|---|---|
| **Basic settings** | <ul><li>Enter a short name (e.g. `Home`) — the chosen name becomes part of every entity ID.</li><li>Pick your bidding zone.</li><li>Leave resolution at 15 minutes unless your contract still bills hourly.</li></ul> |
| **Currency** | <ul><li>**This step is only shown outside the eurozone.**</li><li>Pick your local currency and leave the exchange rate on automatic.</li></ul> |
| **VAT & electricity tax** | <ul><li>Taxes are pre-filled based on the selected bidding zone and normally do not need changing at this stage.</li><li>A margin defined in a spot contract is entered in the **Commission** field.</li></ul> |
| **Transfer pricing** | <ul><li>**Skip it for now.**</li><li>Transfer prices can be added later, and the basic functionality does not suffer if none are set.</li></ul> |
| **Thresholds & control** | <ul><li>Accept the defaults at this stage.</li></ul> |
| **Optimization scores** | <ul><li>**Skip it for now.**</li><li>A `Total` profile is created automatically, and a meter can be attached to it later.</li></ul> |
| **Advanced options** | <ul><li>Leave everything off.</li></ul> |

That's it, Kilowahti's entities appear right after setup.

!!! tip "About the default thresholds"
    The defaults Kilowahti uses are meant as a starting point for your own settings, and are not a real recommendation. The default price threshold is 20 c/kWh and the rank threshold 24. With 15-minute prices a rank threshold of 24 means "the cheapest 24 of today's 96 slots", i.e. a total of the cheapest six hours of the day (24 × 15 min = 360 min = 6 h). Both can be adjusted later from a dashboard, see [step 5](#5-tune-the-thresholds-later).

## 3. Check that it worked

Go to **Settings → Devices & Services → Kilowahti** and open the instance the integration created, under the name you set (e.g. `Kilowahti Home`). All of Kilowahti's entities live there. Look for these:

| Entity | What you should see |
|---|---|
| `sensor.kilowahti_{name}_spot_price` | The market price for right now |
| `sensor.kilowahti_{name}_total_price` | What you actually pay per kWh, VAT and grid fees included |
| `sensor.kilowahti_{name}_price_rank` | Where this slot ranks in today's prices — 1 is the cheapest of the day |
| `binary_sensor.kilowahti_{name}_rank_acceptable` | `on` when the current slot is at or below your rank threshold |
| `sensor.kilowahti_{name}_price_data_source` | Which price source is being used |

Replace `{name}` with the name you entered, lowercased, e.g. `sensor.kilowahti_home_price_data_source`.

**Tomorrow's prices may not be visible yet, and that is normal.** The European electricity market publishes the prices in the early afternoon, but the exact time varies. Kilowahti starts fetching prices at 13:00 Central European Time and gets them from its own content delivery network (CDN) with very little delay after publication. Until the updated prices have been received, every `tomorrow_*` sensor reads *Unknown*.

## 4. Build your first automation

An example of an easy and simple automation: when the price is among the lowest of the current day, turn on a smart light, heat water, charge a car, or run a dishwasher.

1. **Settings → Automations & scenes → Add automation → Create new automation**
2. **Add trigger** → search `rank` → select **Rank became acceptable**
3. **Add action** → here choose any action you want to switch on
4. Save

Your automation is ready. It runs whenever the slot changes (every 15 or 60 minutes) and the slot that has started falls in the cheapest part of the day, as defined by the rank threshold.

If you want to switch the device off again automatically, you can make a second automation with the **Rank no longer acceptable** trigger.

[Triggers and conditions](triggers-conditions.md) lists all the triggers and conditions you can use to start an automation. If the triggers alone are not enough for your needs, [Automation examples](automations.md) shows more versatile implementations.

## 5. Tune the thresholds later

You do not need to reopen the setup wizard to change how aggressive your automations are. Two entities control it, and both can be added to a dashboard to make them editable:

- `number.kilowahti_{name}_price_threshold`
- `number.kilowahti_{name}_rank_threshold`

When you adjust their values, every binary sensor, trigger and condition based on them follows immediately.

A minimal dashboard card to see the essentials together:

```yaml
type: entities
title: Electricity
entities:
  - entity: sensor.kilowahti_{name}_total_price
  - entity: sensor.kilowahti_{name}_price_rank
  - entity: binary_sensor.kilowahti_{name}_rank_acceptable
  - entity: number.kilowahti_{name}_rank_threshold
```

## Where to go next

As your needs grow, have a look at these. The order does not matter, nothing depends on the others:

- **[Transfer pricing](transfer-pricing.md)**  
  Enter your grid operator's transfer prices into Kilowahti so `total_price` reflects your real cost. Worth doing; grid fees are often a third of the bill.
- **[Fixed-price periods](fixed-periods.md)**  
  If you have a fixed-price contract, or a price locked in on a spot contract, tell Kilowahti its price and validity period. Price sensors switch to your contract price for those days.
- **[Optimization scores](scores.md)**  
  Point Kilowahti to the entity in Home Assistant of an energy meter that measures all your consumption (e.g. a HomeWizard P1 plugged into the HAN port of a newer electricity meter, or a Shelly installed by an electrician), and get a daily/monthly score of 0–100 that tells how well your consumption was directed to cheap hours.
- **[Entities](entities.md)**  
  Full list of Kilowahti's entities, including export, battery and solar sensors that appear once the feature has been enabled in Advanced options.
- **[Frequently asked questions (FAQ)](faq.md)**  
  Answers to questions on your mind, such as why tomorrow's prices are missing, why your prices differ from your bills, what the control factor is for, and many more.
