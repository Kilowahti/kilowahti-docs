# Changelog

## 2026.3.0-alpha.6

- Add `total_price_rank` sensor — ranks current slot by total price (spot + transfer) among today's slots
- Add writable `price_threshold` and `rank_threshold` number entities — adjust thresholds from automations or dashboard without reopening configuration
- Transfer price and control factor transfer sensors now always visible; show unavailable when no transfer group is configured
- Fix `tomorrow_avg`, `tomorrow_min`, `tomorrow_max` to show unavailable when tomorrow's prices have not yet been fetched

---

## 2026.3.0-alpha.5

First public test release.
