---
title: "Glossary"
---

The glossary explains in plain language the terms used elsewhere in these docs.

## Prices and the market

**Bidding zone** (also *price area*, *price region*)  
The area your electricity price is set for. Not the same as a country: Sweden has four zones, Norway five, Italy seven, while Germany and Luxembourg share one. Your bill or your supplier's information usually names yours. The [supported regions](/en/supported-regions/) page lists all 43 zones.

**Day-ahead price**  
The wholesale price set one day in advance in an auction, per slot, per bidding zone. This is what "spot price" means in a household context: tomorrow's prices are decided in the early afternoon today and do not change afterwards.

**Spot price**  
In Kilowahti, the market price for a slot with your VAT and supplier commission applied. The raw market price arrives in Kilowahti excluding VAT; the `spot_price` sensor always shows it to you including VAT.

**Slot**  
The unit of time prices are set for: 15 minutes (96 per day) or 1 hour (24 per day), depending on your configuration. Prices are constant within a slot and can change whenever the slot changes.

**Resolution**  
The length of the slot you use: 15 minutes or one hour. Choose according to the metering interval of your electricity contract.

**Commission** (also *margin*)  
The per-kWh amount your supplier adds on top of the spot price. Entered gross, VAT included.

**Transfer price** (also *grid fee*, *network fee*, *distribution*)  
The price your grid operator charges for delivering the electricity to you, separate from what you pay your supplier for the energy itself. Often a third or more of the total electricity cost.

**Tier**  
A time-based rule inside a transfer price [group](/en/transfer-pricing/): a price per kWh plus when it applies (months, weekdays, hours). The first matching tier by priority wins.

**Fixed-price period**  
A time period during which a fixed contract price replaces the spot price. See [fixed-price periods](/en/fixed-periods/).

**Gross / net**  
Gross means VAT included, net means excluding. Everything you type into Kilowahti is gross; everything arriving from the market is net, and VAT is added for you automatically.

## Other Kilowahti terms

**Energy price** (also *electricity price*)  
What you pay per kWh for the electricity itself: the spot price on a spot contract, your contract rate during a fixed-price period. Transfer excluded.

**Total price**  
Energy price plus transfer price. The number that most closely matches your bill.

**Rank**  
Where the current slot sits among the same day's slots, starting from the cheapest. 1 is the cheapest of the day; the rank of the most expensive price is always the number of slots (24 or 96, depending on resolution). Slots that cost the same share a rank, so during a fixed-price period the energy price rank of every slot is 1. The total price rank is still affected by the transfer price during a fixed-price period, so it can vary even if the energy price stays the same all day.

**Quartile**  
The same idea in four coarser buckets, usually written Q1-Q4. Q1 = cheapest quarter of the day, Q4 = most expensive.

**Control factor**  
The rank expressed as a number between 0 and 1, with 1.0 at the cheapest and 0.0 at the most expensive. Made for feeding into automations that have a dial rather than a switch: charging current, heating setpoint, fan speed. See the [control factor guide](/en/control-factor/).

**Bipolar**  
The same value on a −1 to +1 scale instead of 0 to 1. Use it when you want a signed number that tells whether the price is cheaper or more expensive than usual.

**Threshold**  
Your definition of "cheap enough". There are two: a price threshold in currency per kWh, and a rank threshold as a position in the day. Both drive binary sensors, triggers, and conditions, and both can be adjusted straight from a dashboard in everyday use.

**Score**  
A 0–100 measure of how well your actual consumption was directed to the day's cheap slots. See [optimization scores](/en/scores/).

**Eager polling**  
The afternoon time window in which Kilowahti keeps checking for tomorrow's prices until they appear.

## Home Assistant terms

**Entity**  
One value in Home Assistant, e.g. `sensor.kilowahti_home_total_price`. Kilowahti creates a set of them for each configured entry.

**Binary sensor**  
An entity whose state is always either `on` or `off`, for example "the price is acceptable right now".

**Number entity**  
A value you can *set* from the interface as well as read. Kilowahti's thresholds are number entities, so you can change them from a dashboard once you have added them to a card.

**Trigger / condition**  
A trigger starts an automation when something happens, and a condition decides whether the triggered automation may run or is stopped right away. Kilowahti provides [its own of both](/en/triggers-conditions/).

**Recorder**  
The part of Home Assistant that writes entity values to the database, forming their raw history. Kilowahti's price arrays are deliberately kept out of it.

**Long-term statistics**  
The long-lived hourly summaries Home Assistant keeps for numeric entities. Hourly statistics are stored separately from the raw history, which Home Assistant prunes over time.
