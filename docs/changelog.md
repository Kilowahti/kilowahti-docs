# Changelog

## Version 2026.8.0 (TBD)

- Europe-wide: 43 bidding zones across 30 countries, with per-region VAT and unit presets
- Automatic price source chain: first-party Kilowahti CDN (ENTSO-E data) with spot-hinta.fi fallback; `price_data_source` diagnostic sensor shows the active source
- Local currency display for non-eurozone regions (SEK, NOK, DKK, CHF, PLN, CZK, HUF, RON, RSD, MKD): daily ECB or manual exchange rate, frozen per day; switching currency converts entered prices automatically; `exchange_rate` diagnostic sensor
- Automation triggers (8) and conditions (5): price/rank acceptability edges, cheapest slot, fixed period start/end, tomorrow's prices available
- Effective price statistics sensors (`today_avg/min/max`, `tomorrow_avg/min/max`) and `spot_next_hours_avg`
- Config flow label clarified: "Control factor function" → "Control factor curve"

## Version 2026.6.0 (2026-06-25)

- Kilowahti is now in the HACS default repository — no custom repository URL needed
- HACS country filter updated to include all supported price regions: DK, EE, FI, LT, LV, NO, SE

## Version 2026.5.0 (2026-05-05)

### Fixes

- Monthly score no longer shows NaN at the start of a new month — uses the current quartile midpoint as a placeholder when no consumption is recorded, includes today's in-progress score in the monthly average, and falls back to the previous month's finalised score when the current month is empty
- Optimization score accumulation now ranks slots by true total price (fixed-period rate or spot + transfer) instead of spot-only API rank — primarily affects fixed-price contract users
- `cheapest_hours` service now uses total price (fixed-period or spot + transfer) for window selection — was previously spot-only

### New

- `total_price_quartile` sensor (1–4)
- `cheapest_hours` accepts `reverse: true` parameter to return the latest cheapest window on ties

### Changed

- `total_price_rank` is now normalized: 1 = cheapest, slots_per_day = most expensive (regardless of unique tier count)

### Removed

- `best_charge_hours` service — consolidated into `cheapest_hours` (use `cheapest_hours` with `reverse: true` for the equivalent)

## Version 2026.3.0 (2026-03-16)

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

## Version 2026.3.0-beta.2 (2026-03-15)

- Fix `today_total_avg/min/max` to use effective price (respects fixed-price periods) instead of raw spot price
- Fix `tomorrow_total_avg/min/max` to always use fixed price when fixed-price period is active, regardless of whether spot prices have been fetched

---

## Version 2026.3.0-beta.1 (2026-03-14)

- First beta release
- Add `today_total_avg`, `today_total_min`, `today_total_max` — today's total price (spot + transfer) statistics
- Add `tomorrow_total_avg`, `tomorrow_total_min`, `tomorrow_total_max` — tomorrow's total price statistics (unavailable until prices fetched)
- Migrate core price logic to kilowahti-py library
- Add integration test suite (32 tests)

---

## Version 2026.3.0-alpha.6 (2026-03-11)

- Add `total_price_rank` sensor — ranks current slot by total price (spot + transfer) among today's slots
- Add writable `price_threshold` and `rank_threshold` number entities — adjust thresholds from automations or dashboard without reopening configuration
- Transfer price and control factor transfer sensors now always visible; show unavailable when no transfer group is configured
- Fix `tomorrow_avg`, `tomorrow_min`, `tomorrow_max` to show unavailable when tomorrow's prices have not yet been fetched

---

## Version 2026.3.0-alpha.5 (2026-03-10)

First public test release.
