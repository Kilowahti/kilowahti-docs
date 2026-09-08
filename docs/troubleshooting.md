# Troubleshooting

Symptoms first. If your problem is "how do I make it do X", see [How do I…?](how-do-i.md) instead.

## No prices at all

`spot_price` and everything derived from it read *unknown* or *unavailable*.

- **Right after setup, give it a moment.** Prices are fetched during setup; the entities appear before the first fetch completes.
- **Check the source.** `sensor.kilowahti_{name}_price_data_source` names the source currently serving you. If it is unavailable, no source answered.
- **Check outbound access.** Kilowahti needs HTTPS to `cdn.kilowahti.fi` and, as fallback, `api.spot-hinta.fi`. A restrictive DNS filter or firewall on the Home Assistant host will block both.
- **Look in the log.** Settings → System → Logs, filter for `kilowahti`. A failing source logs the reason it failed.

Kilowahti caches prices locally, so a temporary outage does not empty your sensors — you keep the day you already have.

## Tomorrow's prices are missing

This is normal for most of the day. The European day-ahead auction publishes results in the early afternoon; Kilowahti begins looking at 13:00 CET and keeps trying until they appear or 21:00 CET passes.

`binary_sensor.kilowahti_{name}_tomorrow_available` turns on when they arrive. Until then every `tomorrow_*` sensor reads *unknown*, and that is the intended value — not an error.

Some markets publish later than others; Italy is regularly among the last.

## Prices do not match my bill

Work through it in this order:

1. **VAT.** Market prices arrive without VAT; Kilowahti adds the rate you configured. Check it against your bill.
2. **Supplier margin.** If your contract adds a per-kWh commission, enter it — it is not in the market price.
3. **Grid fees.** `spot_price` never includes transfer. Compare your bill against `total_price` and make sure your [transfer tariff](transfer-pricing.md) is entered.
4. **Monthly fees.** Fixed monthly amounts, from either supplier or grid operator, are not per-kWh. Kilowahti spreads them into `monthly_fixed_cost_today`, separate from the per-kWh sensors.
5. **Electricity tax.** In some countries this is billed inside the transfer price rather than separately.

Everything you enter into Kilowahti is gross, VAT included. Everything from the market is net.

## An entity is missing entirely

Whole groups of entities only exist when enabled:

| Missing | Turn on |
|---|---|
| Export, spread, solar sensors | **Generation** in Advanced options |
| Battery charge/discharge sensors | A **battery capacity** greater than zero |
| Rolling 30/60/120-minute averages | **Show rolling averages** in Advanced options |
| Exchange rate sensor | Only exists for entries displaying a local, non-euro currency |
| `transfer_price`, `control_factor_transfer` | Exist always, but read *unknown* until a [transfer group](transfer-pricing.md) is configured |

New entities appear as soon as the option is saved; no restart needed.

## Rank stays at 1 all day

Expected on a fixed-price contract. Rank orders today's slots by the energy price you actually pay, and during a [fixed-price period](fixed-periods.md) every slot costs the same, so they all tie at 1. `rank_acceptable` stays on and "rank became acceptable" never fires.

If you still want to pick out the cheaper hours on such a day, use `total_price_rank`, which includes your transfer tariff, or the "price is lowest today" condition.

## The score sensor has no value

Scores need a meter. Attach an energy meter entity under **Configure → Score profiles → Edit: Total**, and make sure that entity has `state_class: total_increasing` — a plain power reading in watts will not work.

Scores accumulate through the day and finalise at midnight, so a freshly attached meter shows nothing until it has recorded some consumption.

## History graphs show a unit mismatch

Changing the display unit or display currency changes the unit of every price entity, and Home Assistant's long-term statistics do not convert what was already recorded. The old data keeps its old unit and the graph complains.

Pick your unit and currency at setup and leave them. If you must change afterwards, expect to clear the affected statistics.

## Editing a tier does not change anything

Fixed in `2026.9.0`. On earlier versions, edits to an existing transfer group or tier were not picked up until an unrelated event refreshed the sensors — a slot boundary, a fixed-period change, or midnight. Adding and removing groups always worked. Upgrade, or wait for the next slot.

## Charts stopped showing price arrays from history

The `today_prices` and `tomorrow_prices` attributes are deliberately excluded from the recorder, so they exist only in the current state, not in history. Cards that read the live attribute work normally; anything querying historical attribute values will not find them.

At 15-minute resolution these arrays previously exceeded Home Assistant's 16 KB limit on recorded attributes, which made the recorder discard the sensor's attributes wholesale and log a warning on every update.

## Still stuck

Open an [issue](https://github.com/Kilowahti/ha-kilowahti/issues) or a [discussion](https://github.com/Kilowahti/ha-kilowahti/discussions) on GitHub, or use the [feedback form](https://tally.so/r/QK05XY) if you would rather not have a GitHub account. Logs from Settings → System → Logs filtered to `kilowahti` help enormously.
