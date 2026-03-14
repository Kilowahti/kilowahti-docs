# Calculations

All functions in `kilowahti.calc` are pure (no I/O, no state). They take explicit parameters and return values.

```python
from kilowahti import calc
# or import individually:
from kilowahti.calc import spot_effective, cheapest_window, compute_score
```

---

## Price functions

### `spot_effective`

```python
def spot_effective(slot: PriceSlot, vat_rate: float, commission: float) -> float
```

Apply VAT to the raw spot price and add the (gross) commission.

```
result = slot.price_no_tax × (1 + vat_rate) + commission
```

| Parameter | Description |
|-----------|-------------|
| `slot` | The price slot |
| `vat_rate` | Decimal fraction, e.g. `0.255` for 25.5 % |
| `commission` | Gross retailer margin in c/kWh (already VAT-inclusive) |

```python
# 3.0 c/kWh spot, 25.5% VAT, 0.35 c/kWh commission → 4.115 c/kWh
price = spot_effective(slot, vat_rate=0.255, commission=0.35)
```

---

### `effective_prices`

```python
def effective_prices(slots: list[PriceSlot], vat_rate: float, commission: float) -> list[float]
```

Convenience wrapper — returns `spot_effective` for every slot in the list.

---

### `total_price`

```python
def total_price(effective: float, transfer: float | None) -> float
```

Combines the effective energy price and transfer price. If `transfer` is `None`, treated as `0.0`.

---

### `slots_in_range`

```python
def slots_in_range(all_slots: list[PriceSlot], start: datetime, end: datetime) -> list[PriceSlot]
```

Filter slots to those whose `dt_utc` falls in `[start, end)`. Both timezone-aware and naive datetimes are accepted; naive datetimes are assumed UTC.

---

### `cheapest_window`

```python
def cheapest_window(
    slots: list[PriceSlot],
    slots_needed: int,
    vat_rate: float,
    commission: float,
) -> tuple[list[PriceSlot], float] | None
```

Find the consecutive block of `slots_needed` slots with the **lowest average effective price**.

Returns `(window_slots, avg_price)` or `None` if `slots_needed > len(slots)`.

```python
# Find the cheapest 2-hour window in the day
result = cheapest_window(today_slots, slots_needed=2, vat_rate=0.255, commission=0.0)
if result:
    window, avg = result
    print(f"Cheapest 2h starts at {window[0].dt_utc}, avg {avg:.2f} c/kWh")
```

---

## Ranking functions

### `total_price_rank`

```python
def total_price_rank(
    current: PriceSlot,
    today_slots: list[PriceSlot],
    vat_rate: float,
    commission: float,
    group: TransferGroup | None,
    as_local_fn: Callable[[datetime], datetime],
) -> int | None
```

Rank of `current` by total price (spot + transfer) among all of today's slots. `1` = cheapest. Uses competition ranking — tied slots share the lowest rank.

Returns `None` if `today_slots` is empty or `current` is not found in it.

`as_local_fn` is a callable that converts a UTC `datetime` to the local timezone (used to look up the correct transfer tier). Pass `lambda dt: dt` in tests or when UTC == local.

---

### `rank_to_bucket`

```python
def rank_to_bucket(rank: int, slots_per_day: int) -> str  # "q1" | "q2" | "q3" | "q4"
```

Maps a rank to a price quartile bucket. `"q1"` is the cheapest quartile.

| Rank range | Bucket |
|-----------|--------|
| 1 – slots_per_day/4 | `"q1"` |
| slots_per_day/4+1 – slots_per_day/2 | `"q2"` |
| slots_per_day/2+1 – 3×slots_per_day/4 | `"q3"` |
| 3×slots_per_day/4+1 – slots_per_day | `"q4"` |

---

### `price_quartile`

```python
def price_quartile(rank: int, slots_per_day: int) -> int  # 1..4
```

Same as `rank_to_bucket` but returns an integer (1–4).

---

## Transfer functions

### `transfer_price_for_slot`

```python
def transfer_price_for_slot(
    slot: PriceSlot,
    group: TransferGroup | None,
    as_local_fn: Callable[[datetime], datetime],
) -> float | None
```

Returns the transfer price (c/kWh) for the slot's time according to `group`, or `None` if no group is configured.

---

### `transfer_rank_info`

```python
def transfer_rank_info(
    group: TransferGroup | None,
    now_local: datetime,
) -> tuple[int, int] | None
```

Returns `(rank, tier_count)` where `rank` is the current transfer tier's rank among all unique transfer prices active today, and `tier_count` is the total number of distinct prices. `1` = cheapest tier. Returns `None` if no group or no matching tier.

---

### `normalize_transfer_rank`

```python
def normalize_transfer_rank(rank: int, total: int) -> float
```

Normalises transfer rank to `[0.0, 1.0]`. `0.0` = cheapest, `1.0` = most expensive. When `total == 1`, always returns `0.0`.

---

## Control factor functions

### `control_factor`

```python
def control_factor(rank: int, slots_per_day: int, function: str, scaling: float) -> float
```

Compute a normalized control factor in `[0.0, 1.0]` based on price rank:

- `1.0` = cheapest slot (rank 1)
- `0.0` = most expensive slot (rank = slots_per_day)

| Parameter | Description |
|-----------|-------------|
| `rank` | Current slot's price rank |
| `slots_per_day` | 24 (HOUR) or 96 (MIN15) |
| `function` | `"linear"` or `"sinusoidal"` |
| `scaling` | Exponent applied after the curve; `1.0` = no scaling |

```python
from kilowahti.const import CONTROL_FACTOR_SINUSOIDAL
cf = control_factor(rank=1, slots_per_day=24, function=CONTROL_FACTOR_SINUSOIDAL, scaling=1.0)
# → 1.0
```

---

### `control_factor_bipolar`

```python
def control_factor_bipolar(cf: float) -> float
```

Converts a `[0, 1]` control factor to bipolar `[-1, +1]`:

```
result = 2 × cf − 1
```

---

## Score functions

### `compute_score`

```python
def compute_score(bucket_data: dict[str, float], formula: str = "default") -> float
```

Compute an optimization score (0–100) from quartile energy consumption data.

`bucket_data` maps bucket names (`"q1"` … `"q4"`) to kWh consumed in each quartile.

| Formula | Behaviour |
|---------|-----------|
| `"default"` | Scales raw score so that random consumption ≈ 50 |
| `"raw"` | Direct percentage of consumption in cheap quartiles |

```python
# All consumption in the cheapest quartile
score = compute_score({"q1": 10.0, "q2": 0.0, "q3": 0.0, "q4": 0.0})
# → 100.0
```

---

## Fixed period functions

### `fixed_period_for_date`

```python
def fixed_period_for_date(periods: list[FixedPeriod], d: date) -> FixedPeriod | None
```

Returns the first `FixedPeriod` whose `start_date <= d <= end_date`, or `None`.
