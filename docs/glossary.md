# Glossary

Terms used throughout these docs, in plain language.

## Prices and the market

**Bidding zone** (also *price area*, *price region*) — the area your electricity price is set for. Not the same as a country: Sweden has four zones, Norway five, Italy seven, while Germany and Luxembourg share one. Your bill or supplier names yours. The [supported regions](index.md#supported-regions) table lists all 43.

**Day-ahead price** — the wholesale price set one day in advance in an auction, per slot, per bidding zone. This is what "spot price" means in a household context: tomorrow's prices are decided in the early afternoon today and do not change afterwards.

**Spot price** — in Kilowahti, the market price for a slot with your VAT and supplier commission applied. The raw market price arrives excluding VAT; the `spot_price` sensor shows it including.

**Slot** — the unit of time prices are set for: 15 minutes (96 per day) or 1 hour (24 per day), depending on your configuration. Prices are constant within a slot and can jump at every boundary.

**Resolution** — whether you are working in 15-minute or 1-hour slots. Match your contract's metering interval.

**Commission** (also *margin*) — the per-kWh amount your supplier adds on top of the market price. Entered gross, VAT included.

**Transfer price** (also *grid fee*, *network fee*, *distribution*) — what your grid operator charges to deliver the electricity, separate from what you pay your supplier for the energy itself. Often a third or more of the total bill.

**Tier** — one time-based rule inside a transfer price [group](transfer-pricing.md): a price plus when it applies (months, weekdays, hours). The first matching tier by priority wins.

**Fixed-price period** — a date range where your contract price replaces the market price. See [fixed-price periods](fixed-periods.md).

**Gross / net** — gross means VAT included, net means excluding. Everything you type into Kilowahti is gross; everything arriving from the market is net, and VAT is applied for you.

## Kilowahti's own terms

**Energy price** — what you pay per kWh for the electricity itself: the spot price on a spot contract, your contract rate during a fixed-price period. Transfer excluded.

**Total price** — energy price plus transfer price. The number that matches your bill.

**Rank** — where the current slot sits among today's slots, ordered cheapest first. 1 is the cheapest of the day; the maximum is the number of slots (24 or 96). Slots that cost the same share a rank, so during a fixed-price period every slot ranks 1.

**Quartile** — the same idea coarsened to four buckets. 1 = cheapest quarter of the day, 4 = most expensive.

**Control factor** — the rank expressed as a number between 0 and 1, with 1.0 at the cheapest and 0.0 at the dearest. Made for feeding into automations that have a dial rather than a switch: charging current, heating setpoint, fan speed. See the [control factor guide](control-factor.md).

**Bipolar** — the same value mapped onto −1 to +1 instead of 0 to 1, for cases where you want a signed "cheaper or dearer than usual" number.

**Threshold** — your definition of "cheap enough". There are two: a price threshold in currency per kWh, and a rank threshold as a position in the day. Both drive binary sensors, triggers, and conditions, and both are adjustable at runtime from a dashboard.

**Score** — a 0–100 measure of how well your actual consumption landed on the cheap slots of the day. See [optimization scores](scores.md).

**Eager polling** — the afternoon window in which Kilowahti keeps checking for tomorrow's prices until they appear.

## Home Assistant terms

**Entity** — one value in Home Assistant, e.g. `sensor.kilowahti_home_total_price`. Kilowahti creates a set of them per configured region.

**Binary sensor** — an entity that is only ever `on` or `off`, such as "the price is acceptable right now".

**Number entity** — a value you can *set* from the interface, not just read. Kilowahti's thresholds are number entities so that you can change them from a dashboard.

**Trigger / condition** — a trigger starts an automation when something happens; a condition decides whether it may continue. Kilowahti provides [its own of both](triggers-conditions.md).

**Recorder** — the component that writes entity history to the database. Kilowahti's price arrays are deliberately kept out of it.

**Long-term statistics** — the long-lived hourly summaries Home Assistant keeps for numeric entities, separate from the raw history it prunes.
