# Configuration

The setup wizard runs when you first add the integration. All settings are also editable later via **Settings → Devices & Services → Kilowahti → Configure**.

## Setup steps

### 1. Basic settings

| Field | Description |
|---|---|
| Name | Used in entity names, e.g. `Home` → `sensor.kilowahti_home_spot_price` |
| Price region | Your electricity market area (see [supported regions](index.md#supported-regions)) |
| Price resolution | 15 minutes (96 slots/day) or 1 hour (24 slots/day) — match your contract's metering interval |
| Display unit | Minor or major currency unit per kWh, e.g. `c/kWh` or `€/kWh` (labels follow the display currency) |

#### Price data

Prices are fetched automatically — there is nothing to configure. Kilowahti tries its own
first-party service first (`cdn.kilowahti.fi`, backed by the ENTSO-E Transparency Platform)
and falls back to spot-hinta.fi when needed. The diagnostic sensor
`price_data_source` shows which source is currently in use.

#### Display currency (non-EUR regions)

For regions that bill in a local currency, the wizard shows an extra step:

| Field | Description |
|---|---|
| Display currency | `EUR` or the region's local currency (e.g. `SEK`) |
| Exchange rate source | Automatic (daily ECB reference rate) or manual |
| Manual exchange rate | Local currency per EUR; used in manual mode and as fallback when the automatic rate is unavailable |

Spot prices are converted from EUR with a daily exchange rate that stays frozen for the whole
day, so a slot's price never changes after you have seen it. All prices you enter (commission,
transfer tiers, fixed periods, thresholds) are in the selected display currency, and switching
currency converts your entered prices automatically. Serbia (`RS`) and North Macedonia (`MK`)
are not covered by the ECB reference rates — those regions use a manual rate only.

!!! warning "Long-term statistics"
    Changing the display currency changes the unit of every price entity. Home Assistant's
    long-term statistics do not convert old data — statistics recorded in the previous unit
    will show a unit mismatch. If you rely on long-term statistics, pick the currency once
    at setup and stick with it.

### 2. VAT & electricity tax

Pre-filled from your region's defaults. Adjust if your contract differs. You can also enter your electricity contract's monthly fixed fee here — it will be spread across days and shown as a daily cost sensor.

!!! note
    All prices you enter elsewhere (transfer tiers, fixed periods) are always **gross (VAT included)**. Spot prices from the API are always VAT-exclusive — Kilowahti applies VAT automatically.

### 3. Transfer pricing

Set up your network operator's transfer price tiers. Tiers are time-based rules evaluated in priority order — the first match wins.

You can skip this step and configure transfer pricing later via Configure. See [Transfer pricing](transfer-pricing.md) for details.

### 4. Thresholds & control

| Field | Description |
|---|---|
| Control max price | Price at or below this turns on the `price_acceptable` binary sensor |
| Max price includes transfer | Whether the price threshold compares against total price (effective price + transfer) or effective price only |
| Control max rank | Rank at or below this turns on the `rank_acceptable` binary sensor |
| Forward average window | Hours ahead used for the `next_hours_avg` sensor (1–24, in 0.25 h steps) |
| Control factor curve | Shape of the 0–1 control factor curve: Linear or Sinusoidal (see [FAQ](faq.md#what-is-the-difference-between-linear-and-sinusoidal-control-factor-curves)) |
| Control factor scaling | Exponent applied to amplify extremes (1–3) |

!!! tip
    Price and rank thresholds can also be adjusted dynamically without reopening Configure — use the `number.kilowahti_{name}_price_threshold` and `number.kilowahti_{name}_rank_threshold` entities from the dashboard or an automation.

### 5. Optimization scores

A permanent **Total** profile is created automatically. You can link your main energy meter to it later via **Configure → Score profiles → Edit: Total**.

Additional profiles can be added (e.g. per-device or per-circuit meters).

### 6. Sensor display

| Field | Description |
|---|---|
| Expose price arrays as attributes | Writes `today_prices` and `tomorrow_prices` arrays to the `spot_price` sensor attributes — useful for graphing cards (e.g. Apex Charts) but increases DB size |
| High precision mode | Shows more decimal places on price sensors |

## Updating settings

All settings except the initial region and name are editable at any time via **Configure** without restarting Home Assistant.

!!! warning
    Changing the **display unit** after sensors have recorded data will cause unit mismatches in history graphs. You may need to clear sensor history or update dashboard cards manually.
