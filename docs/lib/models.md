# Models

```python
from kilowahti.models import (
    PriceResolution,
    PriceSlot,
    TransferTier,
    TransferGroup,
    FixedPeriod,
    ScoreProfile,
)
```

---

## PriceResolution

```python
class PriceResolution(IntEnum):
    MIN15 = 15   # 15-minute slots — 96 per day
    HOUR  = 60   # Hourly slots    — 24 per day
```

### Properties

| Name | Type | Description |
|------|------|-------------|
| `slots_per_day` | `int` | `96` for MIN15, `24` for HOUR |

---

## PriceSlot

A single price interval returned by the API.

```python
@dataclass
class PriceSlot:
    dt_utc:       datetime  # UTC start time of the slot
    price_no_tax: float     # c/kWh, excl. VAT
    rank:         int       # 1 = cheapest; max = slots_per_day
```

!!! note "Units"
    `price_no_tax` is always stored internally as **c/kWh** (centimes per kWh), regardless of the API returning €/kWh.

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `to_dict()` | `dict` | Serialise to JSON-safe dict |
| `from_dict(data)` | `PriceSlot` | Deserialise; naive datetimes are assumed UTC |

---

## TransferTier

One pricing tier within a transfer group.

```python
@dataclass
class TransferTier:
    label:      str        # Human-readable name, e.g. "Day"
    price:      float      # c/kWh, gross (VAT included)
    months:     list[int]  # Active months (1–12)
    weekdays:   list[int]  # Active weekdays (0=Mon … 6=Sun)
    hour_start: int        # First active hour (0–23, inclusive)
    hour_end:   int        # Last active hour (1–24, exclusive)
    priority:   int        # Lower = evaluated first; first match wins
```

### Methods

#### `matches(month, weekday, hour) → bool`

Returns `True` when the given time falls within this tier's schedule:

```
month in self.months
and weekday in self.weekdays
and self.hour_start <= hour < self.hour_end
```

---

## TransferGroup

A named collection of `TransferTier` objects representing one electricity transfer contract.

```python
@dataclass
class TransferGroup:
    id:     str
    label:  str
    active: bool
    tiers:  list[TransferTier]
```

### Methods

#### `price_at(month, weekday, hour) → float | None`

Returns the price of the **first matching tier** (sorted by `priority`), or `None` if no tier matches.

```python
group = TransferGroup(id="g1", label="Caruna", active=True, tiers=[day_tier, night_tier])
price = group.price_at(month=3, weekday=0, hour=14)  # Monday afternoon
```

---

## FixedPeriod

Overrides spot pricing with a fixed flat rate for a date range.

```python
@dataclass
class FixedPeriod:
    id:         str    # UUID
    label:      str
    start_date: date   # inclusive
    end_date:   date   # inclusive
    price:      float  # c/kWh, gross (VAT included)
```

### Methods

#### `is_active_on(d: date) → bool`

Returns `True` if `start_date <= d <= end_date`.

---

## ScoreProfile

Defines a consumption score profile that tracks how efficiently energy was consumed across price quartiles.

```python
@dataclass
class ScoreProfile:
    id:      str
    label:   str
    meters:  list[str]  # Home Assistant entity IDs to track
    formula: str        # "default" or "raw"
```

See [Optimization scores](../scores.md) for how scores are calculated.
