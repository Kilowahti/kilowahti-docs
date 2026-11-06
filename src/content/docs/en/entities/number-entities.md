---
title: "Number entities"
---

Number entities are writable settings that can be adjusted from a dashboard or from automations with the `number.set_value` action. Changes take effect immediately, and no restart or reconfiguration is needed.

| Entity | Range | Description |
|---|---|---|
| **Price threshold**<br>`number.kilowahti_{name}_price_threshold` | 0–500 in the minor unit (0–5 in the major one) | Price at or below which `price_acceptable` turns on. The setting's unit is the same as the display unit you chose. |
| **Rank threshold**<br>`number.kilowahti_{name}_rank_threshold` | 1–96 (or 1–24) | Rank at or below which `rank_acceptable` turns on. The upper bound depends on the selected price resolution. |

The initial values come from the **Thresholds & control** options. Changes made via these entities are persisted to the integration config, so they survive restarts and also update the values shown in the options flow.
