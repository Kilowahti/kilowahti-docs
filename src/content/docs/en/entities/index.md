---
title: "Entities"
---

All entities are grouped under a single **Kilowahti** device per configured instance. Entity names use the name you set during setup (e.g. `Home`).

## Start with these

This page is a comprehensive reference for all of Kilowahti, and you will probably never need most of it. In a basic setup you can get very far with just five entities:

Each entity is listed by the name Home Assistant shows (in the system language), with its fixed entity ID below it. Home Assistant often displays only the name, so search for it by name under **Settings → Devices & Services → Kilowahti**; the entity ID appears in the entity's settings.

| Entity | What it is for |
|---|---|
| **Total price**<br>`sensor.kilowahti_{name}_total_price` | <ul><li>**What a kilowatt-hour costs you right now, everything included.**</li><li>This number is useful, for example, in a dashboard card shown to users.</li></ul> |
| **Active price rank**<br>`sensor.kilowahti_{name}_price_rank` | <ul><li>**Where the current slot sits in the day's prices by energy price, smaller is better: 1 = cheapest.**</li><li>This number is the most useful in automations: for example, heating should not be controlled by an absolute price limit alone, because on an expensive day it could be blocked completely.</li></ul> |
| **Rank acceptable**<br>`binary_sensor.kilowahti_{name}_rank_acceptable` | `on` when the rank is lower than or equal to the threshold you set |
| **Rank threshold**<br>`number.kilowahti_{name}_rank_threshold` | <ul><li>**Sets the previous threshold.**</li><li>The value can be adjusted flexibly from a dashboard or an automation without opening Kilowahti's settings, and it also changes when you edit the settings.</li></ul> |
| **Tomorrow available**<br>`binary_sensor.kilowahti_{name}_tomorrow_available` | `on` when tomorrow's prices have arrived, usually in the afternoon |

In addition to these, everything below is available if you need it. Kilowahti offers several sensors, some of which can achieve the very same thing with a slightly different approach and originally for a different purpose. This means broader possibilities for the user: Kilowahti is meant to be as flexible a solution as possible for different needs around electricity prices and consumption optimization.

Some of the groups below only exist when you enable them: export and solar sensors require **generation** enabled in Advanced options, battery sensors require, in addition to that, setting a battery capacity, and the wider rolling averages can be switched on if you want them when the selected price resolution is 15 minutes.

New to Kilowahti? The [Getting started](/en/getting-started/) guide takes you through setting up the integration step by step from start to finish.

## Entity groups

The rest of the entities are split by purpose:

- [Price and rank sensors](/en/entities/price-and-rank/): current and daily prices, price rank, and control factor sensors
- [Binary sensors](/en/entities/binary-sensors/): on/off states
- [Optimization and diagnostic sensors](/en/entities/optimization-and-diagnostics/): score sensors and integration diagnostics
- [Rolling average, generation and battery sensors](/en/entities/optional-sensors/): optional sensors that exist only when the feature is enabled
- [Number entities](/en/entities/number-entities/): writable price and rank thresholds

## Entity IDs on your system

From `2026.11.0` Kilowahti pins its own entity IDs, so they are identical on every install no matter which language the interface is in — only the displayed names are translated. The names follow Home Assistant's system language (**Settings → System → General → Language**), not the language chosen in your user profile, and they are resolved when the integration loads, so after changing the system language reload the Kilowahti integration (**Settings → Devices & Services → Kilowahti → ⋮ → Reload**) or restart Home Assistant.

Installs created **before** `2026.11.0` keep the IDs Home Assistant generated back then, which came from the translated display name. Most are the same, but a few differ: `price_rank` was `rank`, `tomorrow_available` was `tomorrow_s_prices_available`, the `setting_*` diagnostics had no prefix, and a Finnish or German install got Finnish or German IDs throughout.

After upgrading, a repair under **Settings → System → Repairs** offers to rename them to the fixed IDs. Nothing changes until you confirm; the confirmation lists the automations, scripts, scenes and groups that use the entities (dashboards and templates are not checked), IDs you changed yourself are left alone, and the history of all IDs is kept. Any references to the old IDs, e.g. in automations or dashboard cards, must be updated by hand afterwards. If you skip the repair, check **Settings → Devices & Services → Kilowahti** to see your real IDs.
