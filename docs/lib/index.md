# kilowahti-py

**kilowahti-py** is the pure-Python library that powers the Kilowahti Home Assistant integration. It can be used independently in any Python project that needs to work with European electricity spot prices.

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
| [`kilowahti.sources`](sources.md) | `PriceSource` ABC with `KilowahtiCdnSource` and `SpotHintaSource` implementations |
| [`kilowahti.const`](const.md) | API URLs, region list, country presets, unit constants |

Models, calculation functions, and constants are re-exported from the top-level `kilowahti` namespace; the price source classes live under `kilowahti.sources`:

```python
from kilowahti import PriceSlot, spot_effective, COUNTRY_PRESETS
from kilowahti.sources.kilowahti_cdn import KilowahtiCdnSource
```

## Quick example

```python
import asyncio
import aiohttp
from kilowahti import PriceResolution, spot_effective
from kilowahti.sources.kilowahti_cdn import KilowahtiCdnSource

async def main():
    source = KilowahtiCdnSource()
    async with aiohttp.ClientSession() as session:
        slots = await source.fetch_today(session, region="FI", resolution=PriceResolution.MIN15)

    vat_rate = 0.255  # 25.5 % Finnish VAT
    for slot in slots:
        price = spot_effective(slot, vat_rate=vat_rate, commission=0.0)
        print(f"{slot.dt_utc.strftime('%H:%M')}  rank {slot.rank:2d}  {price:.2f} c/kWh")

asyncio.run(main())
```
