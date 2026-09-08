# How do I…?

A shortcut into the rest of the documentation, organised by what you are trying to do rather than by what part of the integration it belongs to.

## Get started

| I want to… | Go to |
|---|---|
| Install Kilowahti | [Installation](installation.md) |
| Set it up for the first time | [First setup](getting-started.md) |
| Understand a term I keep seeing | [Glossary](glossary.md) |
| Know which entities actually matter | [Entities → Start with these](entities.md#start-with-these) |

## Run things when electricity is cheap

| I want to… | Go to |
|---|---|
| Switch something on during cheap hours | [Triggers and conditions](triggers-conditions.md) — no YAML needed |
| Change what counts as "cheap" | [First setup → Tune the thresholds](getting-started.md#5-tune-the-thresholds-later) |
| Adjust that from a dashboard or automation | The `price_threshold` and `rank_threshold` [number entities](entities.md#number-entities) |
| Scale a device instead of switching it | [Control factor](control-factor.md) |
| Schedule an appliance for the cheapest block ahead | [`kilowahti.cheapest_hours`](services.md#kilowahticheapest_hours) |
| Copy a working automation | [Automation examples](automations.md) |

## Make the prices match my bill

| I want to… | Go to |
|---|---|
| Add my grid operator's fees | [Transfer pricing](transfer-pricing.md) |
| Handle a day/night or seasonal tariff | [Transfer pricing → Examples](transfer-pricing.md#example-finnish-aikasiirto-daynight-tariff) |
| Tell Kilowahti about my fixed-price contract | [Fixed-price periods](fixed-periods.md) |
| Correct VAT, tax, or supplier margin | [Configuration → VAT & electricity tax](configuration.md#2-vat-electricity-tax) |
| Show prices in my local currency | [Configuration → Display currency](configuration.md#display-currency-non-eur-regions) |
| Find out why my numbers differ from the bill | [Troubleshooting](troubleshooting.md#prices-do-not-match-my-bill) |

## Build a dashboard

| I want to… | Go to |
|---|---|
| Show current price and status | [First setup → a minimal card](getting-started.md#5-tune-the-thresholds-later) |
| Draw a price curve for today and tomorrow | Enable price arrays in [Configuration → Sensor display](configuration.md#6-sensor-display) |
| See how well I shifted my consumption | [Optimization scores](scores.md) |

## Solar, battery, export

| I want to… | Go to |
|---|---|
| See what my exported electricity is worth | Enable generation, then [export sensors](entities.md) |
| Find the best hours to sell | [`kilowahti.best_export_hours`](services.md#kilowahtibest_export_hours) |
| Charge a battery on cheap electricity | [Automation examples → battery](automations.md#charge-and-discharge-a-battery-by-quartile) |
| Plan around a solar forecast | [`kilowahti.generation_schedule`](services.md#kilowahtigeneration_schedule) |

## Fix something

| I want to… | Go to |
|---|---|
| Work out why prices are missing or wrong | [Troubleshooting](troubleshooting.md) |
| Understand why tomorrow is empty | [Troubleshooting → Tomorrow's prices are missing](troubleshooting.md#tomorrows-prices-are-missing) |
| Find out why an entity does not exist | [Troubleshooting → An entity is missing entirely](troubleshooting.md#an-entity-is-missing-entirely) |
| Report a bug or ask for a feature | [GitHub](https://github.com/Kilowahti/ha-kilowahti/issues) or the [feedback form](https://tally.so/r/QK05XY) |
