# Changelog

## 2026.3.0-beta.2 — 2026-03-15

- Fix `today_total_avg/min/max` to use effective price (respects fixed-price periods) instead of raw spot price
- Fix `tomorrow_total_avg/min/max` to populate from fixed-price period when spot prices not yet available

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
