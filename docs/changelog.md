# Changelog

## 2026.3.0-beta.3 — 2026-03-16

### ⚠️ BREAKING CHANGES ⚠️

- Six sensors have been renamed to clarify they reflect spot prices only:

  | Old name | New name |
  |---|---|
  | `today_avg` | `today_spot_avg` |
  | `today_min` | `today_spot_min` |
  | `today_max` | `today_spot_max` |
  | `tomorrow_avg` | `tomorrow_spot_avg` |
  | `tomorrow_min` | `tomorrow_spot_min` |
  | `tomorrow_max` | `tomorrow_spot_max` |

  Update any automations or dashboard cards referencing the old entity IDs.

### New shiny things

- Add generation & export support for users with solar panels and/or home batteries: export pricing sensors, battery charge/discharge optimization sensors and binary sensors, and related services
- Add rolling average price sensors (30/60/120 min ahead) — opt-in, 15-min resolution only
- Add monthly fixed cost configuration: electricity contract base fee and per-transfer-group fee, shown as a daily cost sensor

### Maintenance

- Fix `tomorrow_total_avg/min/max` showing Unknown when a fixed-price period covered tomorrow
- Fix optimization score sensors showing `0.0` instead of Unknown when no meter is configured
- Fix fixed-price period price field pre-filled with `0.001` in the UI

---

## 2026.3.0-beta.2 — 2026-03-15

- Fix `today_total_avg/min/max` to use effective price (respects fixed-price periods) instead of raw spot price
- Fix `tomorrow_total_avg/min/max` to always use fixed price when fixed-price period is active, regardless of whether spot prices have been fetched

---

## 2026.3.0-beta.1 — 2026-03-14

- First beta release
- Add `today_total_avg`, `today_total_min`, `today_total_max` — today's total price (spot + transfer) statistics
- Add `tomorrow_total_avg`, `tomorrow_total_min`, `tomorrow_total_max` — tomorrow's total price statistics (unavailable until prices fetched)
- Migrate core price logic to kilowahti-py library
- Add integration test suite (32 tests)

---

## 2026.3.0-alpha.6 — 2026-03-11

- Add `total_price_rank` sensor — ranks current slot by total price (spot + transfer) among today's slots
- Add writable `price_threshold` and `rank_threshold` number entities — adjust thresholds from automations or dashboard without reopening configuration
- Transfer price and control factor transfer sensors now always visible; show unavailable when no transfer group is configured
- Fix `tomorrow_avg`, `tomorrow_min`, `tomorrow_max` to show unavailable when tomorrow's prices have not yet been fetched

---

## 2026.3.0-alpha.5 — 2026-03-10

First public test release.
