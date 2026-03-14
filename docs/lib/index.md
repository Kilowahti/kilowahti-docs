# kilowahti-py

**kilowahti-py** is the pure-Python library that powers the Kilowahti Home Assistant integration. It can be used independently in any Python project that needs to work with Nordic/Baltic electricity spot prices.

- **PyPI package name:** `kilowahti`
- **Requires:** Python ≥ 3.12, aiohttp ≥ 3.9
- **Source:** [github.com/Kilowahti/kilowahti-py](https://github.com/Kilowahti/kilowahti-py)

## Installation

```bash
pip install kilowahti
```

## What's in the library

| Module | Contents |
|--------|----------|
| [`kilowahti.models`](models.md) | Data classes: `PriceSlot`, `TransferGroup`, `FixedPeriod`, … |
| [`kilowahti.calc`](calc.md) | Pure calculation functions — pricing, ranking, scoring |
| [`kilowahti.sources`](sources.md) | `PriceSource` ABC and `SpotHintaSource` implementation |
| [`kilowahti.const`](const.md) | API URLs, region list, country presets, unit constants |

Everything public is also re-exported from the top-level `kilowahti` namespace:

```python
from kilowahti import PriceSlot, SpotHintaSource, spot_effective, COUNTRY_PRESETS
```

## Quick example

```python
import asyncio
import aiohttp
from kilowahti import SpotHintaSource, PriceResolution, spot_effective

async def main():
    source = SpotHintaSource()
    async with aiohttp.ClientSession() as session:
        slots = await source.fetch_today(session, region="FI", resolution=PriceResolution.HOUR)

    vat_rate = 0.255  # 25.5 % Finnish VAT
    for slot in slots:
        price = spot_effective(slot, vat_rate=vat_rate, commission=0.0)
        print(f"{slot.dt_utc.strftime('%H:%M')}  rank {slot.rank:2d}  {price:.2f} c/kWh")

asyncio.run(main())
```
