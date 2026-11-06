---
title: "Price and rank sensors"
---

## Price sensors

All price sensors use the display unit you chose in the settings: the minor or major unit of your display currency, e.g. `c/kWh` or `€/kWh`, `öre/kWh` or `kr/kWh`.

| Entity | Description |
|---|---|
| **Spot price**<br>`sensor.kilowahti_{name}_spot_price` | <ul><li>Current slot's spot price including VAT</li><li>Attributes: `price_source`, plus `today_prices`/`tomorrow_prices` when price arrays are enabled</li></ul> |
| **Active price**<br>`sensor.kilowahti_{name}_active_price` | <ul><li>The energy price you pay: the spot price, or the contract price when a fixed period is active</li><li>Attributes: `source` (`spot`/`fixed`), `period_label`</li></ul> |
| **Transfer price**<br>`sensor.kilowahti_{name}_transfer_price` | <ul><li>Current transfer price, Unknown until transfer prices are configured</li><li>Attributes: `tariff` (active group and tier, e.g. "Kausisiirto, Muu aika"), plus `group` and `tier` separately</li></ul> |
| **Total price**<br>`sensor.kilowahti_{name}_total_price` | <ul><li>Total price, i.e. the active energy price + transfer price</li><li>Attributes: `today_prices`/`tomorrow_prices` when total price arrays are enabled in Advanced options</li></ul> |
| **Today spot average**<br>`sensor.kilowahti_{name}_today_spot_average` | Today's average spot price |
| **Today spot minimum**<br>`sensor.kilowahti_{name}_today_spot_minimum` | Today's lowest spot price |
| **Today spot maximum**<br>`sensor.kilowahti_{name}_today_spot_maximum` | Today's highest spot price |
| **Today total average**<br>`sensor.kilowahti_{name}_today_total_average` | Today's average total price (spot + transfer) |
| **Today total minimum**<br>`sensor.kilowahti_{name}_today_total_minimum` | Today's lowest total price |
| **Today total maximum**<br>`sensor.kilowahti_{name}_today_total_maximum` | Today's highest total price |
| **Tomorrow spot average**<br>`sensor.kilowahti_{name}_tomorrow_spot_average` | Tomorrow's average spot price, Unavailable until tomorrow's prices are fetched |
| **Tomorrow spot minimum**<br>`sensor.kilowahti_{name}_tomorrow_spot_minimum` | Tomorrow's lowest spot price; unavailable until tomorrow's prices are fetched |
| **Tomorrow spot maximum**<br>`sensor.kilowahti_{name}_tomorrow_spot_maximum` | Tomorrow's highest spot price; unavailable until tomorrow's prices are fetched |
| **Tomorrow total average**<br>`sensor.kilowahti_{name}_tomorrow_total_average` | Tomorrow's average total price; unavailable until tomorrow's prices are fetched (or based on fixed period if active) |
| **Tomorrow total minimum**<br>`sensor.kilowahti_{name}_tomorrow_total_minimum` | Tomorrow's lowest total price |
| **Tomorrow total maximum**<br>`sensor.kilowahti_{name}_tomorrow_total_maximum` | Tomorrow's highest total price |
| **Today average**<br>`sensor.kilowahti_{name}_today_average` | Today's average active price (spot, or the contract price during a fixed period) *(since 2026.8.0)* |
| **Today minimum**<br>`sensor.kilowahti_{name}_today_minimum` | Today's lowest active price *(since 2026.8.0)* |
| **Today maximum**<br>`sensor.kilowahti_{name}_today_maximum` | Today's highest active price *(since 2026.8.0)* |
| **Tomorrow average**<br>`sensor.kilowahti_{name}_tomorrow_average` | Tomorrow's average active price; unavailable until tomorrow's prices are fetched *(since 2026.8.0)* |
| **Tomorrow minimum**<br>`sensor.kilowahti_{name}_tomorrow_minimum` | Tomorrow's lowest active price *(since 2026.8.0)* |
| **Tomorrow maximum**<br>`sensor.kilowahti_{name}_tomorrow_maximum` | Tomorrow's highest active price *(since 2026.8.0)* |
| **Next hours average**<br>`sensor.kilowahti_{name}_next_hours_average` | Average active price over the next N hours (configurable) *(since 2026.8.0)* |
| **Spot next hours average**<br>`sensor.kilowahti_{name}_spot_next_hours_average` | Average spot price over the next N hours (configurable) *(since 2026.8.0)* |
| **Monthly fixed cost today**<br>`sensor.kilowahti_{name}_monthly_fixed_cost_today` | Today's share of the monthly fixed contract cost per day in your display currency, Unavailable if the monthly fee is not configured |

Spot prices are fetched every day, and the sensors update when slots change even if a fixed-price period is in use. Whether a fixed-price period is active is shown by the binary sensor `fixed_price_period_active`, see [Binary sensors](/en/entities/binary-sensors/) below.

## Rank sensors

| Entity | Description |
|---|---|
| **Active price rank**<br>`sensor.kilowahti_{name}_price_rank` | <ul><li>Current slot's rank by the energy price you actually pay (fixed-period price when one is active, otherwise spot price), transfer price not included.</li><li>Normalized: 1 = cheapest, the number of slots in the day (slots_per_day) = most expensive. Read more below the table.</li></ul> |
| **Total price rank**<br>`sensor.kilowahti_{name}_total_price_rank` | Same, but transfer is included in the price |
| **Price quartile**<br>`sensor.kilowahti_{name}_price_quartile` | Energy price quartile 1–4 (derived from `price_rank`): 1&nbsp;=&nbsp;cheapest 25&nbsp;% of the day's slots |
| **Total price quartile**<br>`sensor.kilowahti_{name}_total_price_quartile` | Total price quartile 1–4 (derived from `total_price_rank`): 1&nbsp;=&nbsp;cheapest 25&nbsp;% of the day's slots |

:::note[The highest possible rank depends on price resolution]
The maximum rank is **96** with 15-minute resolution and **24** with 1-hour resolution.
:::

Ranks are normalized by price level: slots with the same price share a rank, and the cheapest price of the day is always 1 and the most expensive is always the highest possible rank. For example, if on a 15-minute resolution day the 96 slots had only two different prices, the cheaper one gets rank 1 and the more expensive one 96.

During a [fixed-price period](/en/fixed-periods/) every slot costs the same, so the energy-only `price_rank` is 1 for the whole day, because no more expensive slot is expected during the day. Despite the fixed-price period for energy, the total price rank `total_price_rank` may still vary if transfer prices are defined and more than one different transfer price is active during the day.

## Control factor sensors

All three factors share one scale: **1.0 = cheapest, 0.0 = most expensive**, with the configured shape (linear/sinusoidal) and scaling applied to each. Each of them has a bipolar version that maps the same value onto −1…+1.

| Entity | Range | Description |
|---|---|---|
| **Control factor price**<br>`sensor.kilowahti_{name}_control_factor_price` | 0–1 | Based on `price_rank`: the energy price, without transfer. |
| **Control factor price (bipolar)**<br>`sensor.kilowahti_{name}_control_factor_price_bipolar` | −1 to +1 | Bipolar version of the above. |
| **Control factor total**<br>`sensor.kilowahti_{name}_control_factor_total` | 0–1 | Based on `total_price_rank`: energy and transfer together. *(since 2026.9.0)* |
| **Control factor total (bipolar)**<br>`sensor.kilowahti_{name}_control_factor_total_bipolar` | −1 to +1 | Bipolar version of the above. *(since 2026.9.0)* |
| **Control factor transfer**<br>`sensor.kilowahti_{name}_control_factor_transfer` | 0–1 | Based on the rank of the transfer price among the day's transfer prices. Unknown until transfer prices are configured. |
| **Control factor transfer (bipolar)**<br>`sensor.kilowahti_{name}_control_factor_transfer_bipolar` | −1 to +1 | Bipolar version of the above. Unknown until transfer prices are configured. *(since 2026.9.0)* |

The transfer control factor is based on the day's different transfer prices (typically at most two or three), so it moves in larger steps than the price and total price factors, which are based on all slots. A transfer price group with only one rule, or a day spent entirely inside a fixed-price period as far as energy is concerned, gives that sensor a constant value 1: there is no reason to prefer or avoid any slot.
