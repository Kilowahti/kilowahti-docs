# Triggers and conditions

Kilowahti ships its own automation triggers and conditions. They appear in the Home Assistant automation editor alongside the built-in ones, so you can build a price-aware automation without picking entities, writing templates, or knowing which sensor holds which number.

They are the easiest starting point for a first automation. The [automation examples](automations.md) show the same ideas built from entities instead, which is what you need for anything the triggers do not cover.

## Adding one in the UI

1. **Settings → Automations & scenes → Create automation → Create new automation**
2. **Add trigger** → type `Kilowahti` in the search box
3. Pick a trigger, then add your action

Conditions work the same way under **Add condition**.

If you have several Kilowahti entries set up (one per region or site), the trigger has a **target** field — point it at that entry's device. With a single entry you can leave the target empty and it will be used automatically.

## Triggers

| Trigger | Fires when |
|---|---|
| Price became acceptable | The current price drops to or below your price threshold |
| Price no longer acceptable | The current price rises above your price threshold |
| Rank became acceptable | The current slot's rank drops to or below your rank threshold |
| Rank no longer acceptable | The current slot's rank rises above your rank threshold |
| Became cheapest slot | The current slot becomes the cheapest of the day by total price |
| Fixed period started | A [fixed-price period](fixed-periods.md) becomes active |
| Fixed period ended | A fixed-price period stops being active |
| Tomorrow's prices available | Tomorrow's prices have been fetched, usually in the afternoon |

## Conditions

| Condition | Passes when |
|---|---|
| Price is acceptable | The current price is at or below your price threshold |
| Rank is acceptable | The current slot's rank is at or below your rank threshold |
| Price is lowest today | The current slot is the cheapest of the day by total price |
| Fixed period active | A fixed-price period is currently active |
| Tomorrow's prices available | Tomorrow's prices have been fetched |

A condition that cannot be evaluated — no price data yet, or a target that matches no Kilowahti entry — does not pass. Automations gated on it simply do not run.

## Things worth knowing

**Triggers fire on the change, not while it lasts.** "Price became acceptable" fires once, at the moment the price crosses your threshold. It does not fire again every slot while the price stays low. To act on a state that is *already* true, use a condition, or the matching binary sensor.

**Restarting or reloading does not fire them.** Each trigger reads the current situation when it starts and treats that as its baseline, so reloading automations in the middle of a cheap hour does not produce a spurious run.

**Thresholds are live.** The price and rank thresholds come from your configuration, and both are also exposed as `number` entities you can change from a dashboard or an automation. Change a threshold and the triggers use the new value immediately — no reload.

**Price includes transfer only if you asked for it.** The price threshold compares against the energy price by default, or energy plus transfer when *Price threshold includes transfer* is enabled in the options.

**"Cheapest slot" always includes transfer.** "Became cheapest slot" and "Price is lowest today" rank by the total price you pay, energy plus transfer. On a day where several slots share the cheapest total price, all of them count as cheapest.

**On a fixed-price contract, rank stops discriminating.** Rank follows the energy price you actually pay. During a fixed-price period every hour costs the same, so every slot ranks 1, "Rank is acceptable" always passes, and "Rank became acceptable" never fires — there is no cheaper hour to move to. Use "Price is lowest today" or "Became cheapest slot" if you still want the transfer-cheap hours on such a day.

## In YAML

The UI is the easier route, but the same triggers and conditions can be written by hand:

```yaml
alias: Heat water when the price drops
triggers:
  - trigger: kilowahti.price_became_acceptable
conditions:
  - condition: kilowahti.tomorrow_available
actions:
  - action: switch.turn_on
    target:
      entity_id: switch.water_heater
```

With more than one Kilowahti entry, name the one you mean:

```yaml
triggers:
  - trigger: kilowahti.rank_became_acceptable
    target:
      device_id: 0123456789abcdef0123456789abcdef
```

Trigger keys are `kilowahti.` followed by the name in snake_case: `price_became_acceptable`, `price_no_longer_acceptable`, `rank_became_acceptable`, `rank_no_longer_acceptable`, `became_cheapest_slot`, `fixed_period_started`, `fixed_period_ended`, `tomorrow_prices_available`. Condition keys follow the same pattern: `price_is_acceptable`, `rank_is_acceptable`, `price_is_lowest_today`, `fixed_period_active`, `tomorrow_available`.

## When to use the binary sensors instead

The [binary sensors](entities.md#binary-sensors) cover the same ground as states rather than events, which makes them the better choice when you want to:

- see the current situation on a dashboard, or its history in a graph
- combine several conditions in one template
- start an automation from a state that is already true, without waiting for the next change
