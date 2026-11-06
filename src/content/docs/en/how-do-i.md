---
title: "How do I…?"
---

A shortcut into the rest of the documentation, organised by what you are trying to do rather than by what part of the integration it belongs to.

## Get started

| I want to… | Go to |
|---|---|
| Install Kilowahti | [Installation](/en/installation/) |
| Set it up for the first time | [First setup](/en/getting-started/) |
| Understand a term I keep seeing | [Glossary](/en/glossary/) |
| Know which entities actually matter | [Entities → Start with these](/en/entities/#start-with-these) |

## Run things when electricity is cheap

| I want to… | Go to |
|---|---|
| Switch something on during cheap hours | [Triggers and conditions](/en/triggers-conditions/) — no YAML needed |
| Change what counts as "cheap" | [First setup → Tune the thresholds](/en/getting-started/#5-tune-the-thresholds-later) |
| Adjust that from a dashboard or automation | The `price_threshold` and `rank_threshold` [number entities](/en/entities/number-entities/) |
| Scale a device instead of switching it | [Control factor](/en/control-factor/) |
| Schedule an appliance for the cheapest block ahead | [`kilowahti.cheapest_hours`](/en/services/#kilowahticheapest_hours) |
| Copy a working automation | [Automation examples](/en/automations/) |

## Make the prices match my bill

| I want to… | Go to |
|---|---|
| Add my grid operator's fees | [Transfer pricing](/en/transfer-pricing/) |
| Handle a day/night or seasonal tariff | [Transfer pricing → Examples](/en/transfer-pricing/#example-finnish-aikasiirto-daynight-tariff) |
| Tell Kilowahti about my fixed-price contract | [Fixed-price periods](/en/fixed-periods/) |
| Correct VAT, tax, or supplier margin | [Configuration → VAT & electricity tax](/en/configuration/#2-vat--electricity-tax) |
| Show prices in my local currency | [Configuration → Display currency](/en/configuration/#display-currency-non-eur-regions-only) |
| Find out why my numbers differ from the bill | [Troubleshooting](/en/troubleshooting/#prices-do-not-match-my-bill) |

## Build a dashboard

| I want to… | Go to |
|---|---|
| Show current price and status | [First setup → a minimal card](/en/getting-started/#5-tune-the-thresholds-later) |
| Draw a price curve for today and tomorrow | Enable price arrays in [Configuration → Advanced options](/en/configuration/#6-advanced-options) |
| See how well I shifted my consumption | [Optimization scores](/en/scores/) |

## Solar, battery, export

| I want to… | Go to |
|---|---|
| See what my exported electricity is worth | Enable generation, then [export sensors](/en/entities/optional-sensors/#generation--export-sensors) |
| Find the best hours to sell | [`kilowahti.best_export_hours`](/en/services/#kilowahtibest_export_hours) |
| Charge a battery on cheap electricity | [Automation examples → battery](/en/automations/#charge-and-discharge-a-battery-by-quartile) |
| Plan around a solar forecast | [`kilowahti.generation_schedule`](/en/services/#kilowahtigeneration_schedule) |

## Fix something

| I want to… | Go to |
|---|---|
| Work out why prices are missing or wrong | [Troubleshooting](/en/troubleshooting/) |
| Understand why tomorrow is empty | [Troubleshooting → Tomorrow's prices are missing](/en/troubleshooting/#tomorrows-prices-are-missing) |
| Find out why an entity does not exist | [Troubleshooting → An entity is missing entirely](/en/troubleshooting/#an-entity-is-missing-entirely) |
| Report a bug or ask for a feature | [GitHub](https://github.com/Kilowahti/ha-kilowahti/issues) or the [feedback form](https://tally.so/r/QK05XY) |
