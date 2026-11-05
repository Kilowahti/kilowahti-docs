# Troubleshooting

Symptoms first. If your problem is "how do I make Kilowahti do X", see [How do I…?](how-do-i.md) instead.

## No prices at all

If `spot_price` and everything derived from it read *unknown* or *unavailable*:

- **Right after setup, give Kilowahti a moment.** Prices are fetched during setup; the entities appear before the first fetch completes.
- **Check the source.** `sensor.kilowahti_{name}_price_data_source` names the source currently serving you. If it is unavailable, no source answered.
- **Check outbound access.** Kilowahti needs HTTPS to `cdn.kilowahti.fi` and, as fallback, `api.spot-hinta.fi`. A restrictive DNS filter or firewall on the Home Assistant host may block both.
- **Look in the log.** Settings → System → Logs, filter for `kilowahti`. A failing source logs the reason why it failed.

Kilowahti caches prices locally, so a temporary outage does not empty your sensors — you keep the day you already have.

## A "Using a fallback price source" repair appears

Kilowahti has served your region from a secondary price source for over 24 hours, which usually means the primary source is having an outage. Prices stay correct; the repair clears itself once the primary source answers again, and no action is needed. If it persists for days, check outbound access as described under [No prices at all](#no-prices-at-all) and look for the failure reason in the log.

## Tomorrow's prices are missing

This is normal for most of the day. The European electricity market's day-ahead auction publishes results in the early afternoon, but the exact time varies. Kilowahti begins looking at 13:00 CET and keeps trying until they appear or 21:00 CET passes. Most of the time the prices have been fetched into Home Assistant by 13:15 CET.

`binary_sensor.kilowahti_{name}_tomorrow_available` turns on when they arrive. Until then every `tomorrow_*` sensor reads *unknown*, and that is the intended value — not an error.

Some price areas publish later than others, for example Italy is regularly among the last.

## Prices do not match my bill

Work through it in this order:

1. **VAT**  
   Market prices arrive without VAT, and Kilowahti adds the rate you configured. Check it against your bill.
2. **Supplier margin**  
   If your contract adds a per-kWh commission, enter it in the settings, because it is not in the market price.
3. **Transfer prices**  
   The energy price sensor `spot_price` never includes transfer. Compare your bill against `total_price` and make sure your [transfer prices](transfer-pricing.md) are saved in the settings.
4. **Monthly fees**  
   Fixed monthly amounts, from either supplier or grid operator, do not depend on consumption, i.e. are not per-kWh. Kilowahti spreads them into `monthly_fixed_cost_today`, separate from the per-kWh sensors.
5. **Electricity tax**  
   In some countries this is billed inside the transfer price rather than separately.

Everything you enter into Kilowahti is gross, VAT included. Everything published directly on the electricity market is net, and Kilowahti adds the taxes automatically.

## An entity is missing entirely

Some groups of entities only exist when enabled in the settings:

| Missing | Turn on |
|---|---|
| Export, spread, solar sensors | **Enable generation & export features** in Advanced options |
| Battery charge/discharge sensors | In addition to the above, set a **battery capacity** greater than zero |
| Rolling 30/60/120-minute averages | **Show next 30min, 1h and 2h average prices** in Advanced options, when the price resolution is 15 minutes |
| Exchange rate sensor | Not available unless a local currency outside the eurozone is in use |
| `transfer_price`, `control_factor_transfer` | Exist always, but read *unknown* until [transfer prices](transfer-pricing.md) are configured |

New entities appear as soon as the option is saved; no restart needed.

## Rank stays at 1 all day

Normal on a fixed-price contract. Rank orders today's slots by the energy price you actually pay, and during a [fixed-price period](fixed-periods.md) every slot costs the same, so they all tie at 1. `rank_acceptable` then stays on all the time, and the "Rank became acceptable" trigger never fires.

If you still want to pick out the cheaper hours on such a day, use `total_price_rank`, which includes the transfer price, or the "price is lowest today" condition.

## The score sensor has no value

Optimization scores need an energy meter to work. First make sure the energy meter entity has `state_class: total_increasing` and is attached in Kilowahti's settings under **Configure → Score profiles → Edit: Total**.

The optimization score accumulates through the day and is finalised at midnight, so a freshly attached meter shows nothing until it has measured consumption for a while.

!!! tip "From a power sensor to an energy sensor with a helper"
    A plain power reading in watts will not work, but if no better energy measurement is available, you can manually add a helper that turns the momentary power into consumption in kilowatt-hours, and Kilowahti can use that.

## History graphs show a unit mismatch

Changing the display unit or display currency changes the unit of every price entity, and Home Assistant's long-term statistics do not convert what was already recorded. The old data keeps its old unit and the graph complains.

Preferably pick your unit and currency once at setup and keep them unchanged. If you must change them afterwards, expect to clear the statistics of the affected sensors.

## Editing a tier does not change anything

Fixed in Kilowahti version `2026.9.0`. On earlier versions, edits to an existing transfer group or tier were not picked up until an unrelated event refreshed the sensors, such as a slot boundary, a fixed-period change, or midnight. Adding and removing groups always worked. Update Kilowahti to the new version.

## Charts stopped showing price arrays from history

The `today_prices` and `tomorrow_prices` attributes are deliberately excluded from the recorder, so they exist only in the current state, not in history. Cards that read the live attribute work normally; anything querying historical attribute values will not find them.

When moving to 15-minute pricing these arrays exceeded Home Assistant's 16 KB limit on recorded attributes, which made the recorder discard the sensor's attributes wholesale and log a warning on every update of the sensor.

## Still stuck

Open an [issue](https://github.com/Kilowahti/ha-kilowahti/issues) or a [discussion](https://github.com/Kilowahti/ha-kilowahti/discussions) on GitHub, or, if you would rather not create a GitHub account, use the [feedback form](https://tally.so/r/QK05XY). Logs from **Settings → System → Logs** filtered to `kilowahti` help enormously in solving the problem.
