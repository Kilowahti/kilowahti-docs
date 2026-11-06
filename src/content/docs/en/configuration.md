---
title: "Configuration"
---

The setup wizard starts when you first add the integration. All settings can be edited later via **Settings → Devices & Services → Kilowahti → [the name you set] → Configure (gear icon)**.

This page documents every field of the settings. For a first setup, [First setup](/en/getting-started/) goes through the most essential settings and recommendations for them, and tells you which steps you can skip at the start.

## Setup steps

### 1. Basic settings

| Field | Description |
|---|---|
| Name | Used in entity names, e.g. `Home` → `sensor.kilowahti_home_spot_price`. |
| Price region | Your electricity market bidding zone (more information on the [supported regions](/en/supported-regions/) page) |
| Price resolution | 15 minutes (96 slots/day) or 1 hour (24 slots/day), choose the right one according to the metering interval of your electricity contract |
| Display unit | Minor or major unit of your display currency, per kWh, e.g. `c/kWh` or `€/kWh` in the eurozone, `öre/kWh` or `kr/kWh` in Sweden |

#### Price data

Prices are fetched automatically, so there is nothing to configure in the settings for that. Kilowahti fetches prices primarily from its own service (the Kilowahti CDN, based on data from the EU's ENTSO-E Transparency Platform) and in case of problems uses spot-hinta.fi as a fallback. The diagnostic sensor `price_data_source` shows which source is currently in use.

#### Display currency (non-EUR regions only)

European electricity markets trade in euros, so the price data available to Kilowahti is always in euros. For the bidding zones where customers are billed in a local currency, the settings have one extra step for choosing the display currency *(since 2026.8.0)*:

| Field | Description |
|---|---|
| Display currency | `EUR` or the region's local currency (e.g. `SEK`) |
| Exchange rate source | Automatic (daily ECB reference rate) or manual |
| Manual exchange rate | Amount of local currency per one EUR; this value is used in manual mode and as fallback when the automatic rate is unavailable |

Spot prices are converted from EUR with a daily exchange rate that stays frozen for the whole
day, so a slot's price does not change during the day even if the exchange rate fluctuates. All prices you enter (commission,
transfer tiers, fixed periods, thresholds) are always in the selected display currency, and changing the currency converts the entered prices automatically using the exchange rate in the settings. After changing the display currency, check your entered prices for unintended changes caused by conversion or rounding.

*Serbia (`RS`) and North Macedonia (`MK`) are not covered by the European Central Bank (ECB) reference rates, so those regions can only use a manually set exchange rate.*

:::caution[Long-term statistics]
Changing the display currency changes the unit of every price entity. Home Assistant's
long-term statistics do not convert old data in the database. Statistics recorded in the previous unit
will show a unit mismatch. If you use long-term statistics and want to avoid problems, pick the currency once
correctly at setup and do not change it afterwards.
:::

### 2. VAT & electricity tax

The fields are pre-filled with the defaults of the selected region, and they usually do not need changing.

You can also enter your electricity contract's monthly fixed fee here, in which case it is spread across the days of the month and shown as a daily cost sensor that can be used to calculate an estimated daily cost.

:::note[Entered prices include VAT]
All prices you enter elsewhere in the settings (transfer tiers, fixed periods) are always **gross (VAT included)**. Spot prices published through the market APIs are always VAT-exclusive, but Kilowahti adds VAT to the prices automatically, so sensors and services always show VAT-inclusive prices.
:::

### 3. Transfer pricing

Set up your network operator's transfer prices. In Kilowahti a transfer price is formed from one or more rules based on time (month, weekday and/or time of day). The rules are evaluated in priority order, and the first match wins.

You can skip this step and set up transfer prices later under **Configure**.

See [Transfer pricing](/en/transfer-pricing/) for more information about transfer prices and their rules.

### 4. Thresholds & control

| Field | Description |
|---|---|
| Control max price | When the price is lower than or equal to this setting, the `price_acceptable` binary sensor turns on |
| Max price includes transfer | Whether the price threshold compares against the total price (active price + transfer) or the active price alone |
| Control max rank | When the rank is lower than or equal to this number, the `rank_acceptable` binary sensor turns on |
| Forward average window | Hours ahead used for the `next_hours_average` sensor (1–24, in 0.25 h steps) |
| Control factor curve | Shape of the 0–1 control factor curve: Linear or Sinusoidal (see [Control factor → Curve and scaling](/en/control-factor/#curve-and-scaling)) |
| Control factor scaling (value 1–3) | Exponent applied to amplify extremes (see the link in the previous row) |

:::tip
Price and rank thresholds can also be adjusted without reopening the Configure view. Use the **Price threshold** (`number.kilowahti_{name}_price_threshold`) and **Rank threshold** (`number.kilowahti_{name}_rank_threshold`) entities from the dashboard or an automation.
:::

### 5. Optimization scores

A permanent **Total** profile is created automatically. You can link your energy meter connected to Home Assistant to it later in Kilowahti via **Configure → Score profiles → Edit: Total**.

Additional profiles can be added (e.g. per-device or per-circuit meters). An extra profile can, for example, track how well the price optimization of a water heater or other heating device is doing.

### 6. Advanced options

| Field | Description |
|---|---|
| Expose spot price arrays as attributes | Writes `today_prices` and `tomorrow_prices` arrays to the `spot_price` sensor attributes. This is useful for graphing cards (e.g. Apex Charts) |
| Expose total price arrays as attributes | Same as above, but for the `total_price` sensor, with each entry broken down into `energy` and `transfer` *(since 2026.9.0)* |
| High precision mode | Shows more decimal places on price sensors and price arrays. Only needed in special cases; most setups do not need it |

#### Price array attributes

Both toggles are off by default. Values are rounded to the display precision (by default two decimals, or five in high precision mode; both have two more decimals if the display unit is `€/kWh`).

The arrays are not stored in the database, so they do not grow it and are not shown in history. They describe the current and next day, and are read only from the sensor's live state.

`spot_price` entries:

```yaml
today_prices:
  - time: "2026-09-07T14:00:00+03:00"
    price: 12.34
    rank: 7
```

`total_price` entries add the breakdown, where `price` is the sum of the two rounded parts and `rank` is the total-price rank within that day (1 = cheapest). `transfer` is `0.0` when no transfer prices are configured:

```yaml
today_prices:
  - time: "2026-09-07T14:00:00+03:00"
    energy: 8.90
    transfer: 3.44
    price: 12.34
    rank: 7
```

The attribute `tomorrow_prices` appears once tomorrow's prices have been fetched. The exception is `total_price` during a [fixed-price period](/en/fixed-periods/) that also covers tomorrow: the prices of such periods are already known, so the array is always published when the day changes, without waiting for the spot prices.

## Updating settings

All settings except the initial region can be changed at any time under **Configure** (gear icon) without restarting Home Assistant.

To rename an instance, open **Settings → Devices & Services → Kilowahti**, open the entry's menu and select **Reconfigure**. The entry's title and unique ID follow the new name and all other settings stay as they are. If the new name is already used by another Kilowahti entry in your system, it is rejected. Renaming does not change the IDs of existing entities. *(since 2026.11.0)*

:::caution[Avoid changing the display unit after setup]
Changing the **display unit** after sensors have already recorded data may cause unit mismatches in history graphs. You may need to delete the sensors' history or update dashboard cards manually.
:::
