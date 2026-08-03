# Price sources

```python
from kilowahti.sources import PriceSource
from kilowahti.sources.kilowahti_cdn import KilowahtiCdnSource, KilowahtiCdnZoneNotFoundError
from kilowahti.sources.spot_hinta import SpotHintaSource, SpotHintaRateLimitError
```

---

## PriceSource (ABC)

Abstract base class for all price data sources. Implement this to add a new data backend.

```python
class PriceSource(ABC):
    async def fetch_today(
        self,
        session: aiohttp.ClientSession,
        region: str,
        resolution: PriceResolution,
    ) -> list[PriceSlot]: ...

    async def fetch_tomorrow(
        self,
        session: aiohttp.ClientSession,
        region: str,
        resolution: PriceResolution,
    ) -> list[PriceSlot] | None: ...
```

### Contract

| Method | Returns | Raises |
|--------|---------|--------|
| `fetch_today` | Slots sorted by `dt_utc` ascending | `aiohttp.ClientResponseError` on HTTP error |
| `fetch_tomorrow` | Slots or `None` if not yet published | `aiohttp.ClientResponseError` on HTTP error (except 404) |

The `session` parameter is an `aiohttp.ClientSession` managed by the caller. Sources are stateless; a new session can be passed on each call.

---

## KilowahtiCdnSource

Fetches prices from the first-party **Kilowahti CDN** (`cdn.kilowahti.fi`), which republishes [ENTSO-E Transparency Platform](https://transparency.entsoe.eu) day-ahead data as static JSON. No API key or account required. This is the primary source used by the Home Assistant integration.

```python
source = KilowahtiCdnSource()

async with aiohttp.ClientSession() as session:
    today = await source.fetch_today(session, region="FI", resolution=PriceResolution.MIN15)
    tomorrow = await source.fetch_tomorrow(session, region="FI", resolution=PriceResolution.MIN15)
    # tomorrow is None until the CDN publishes it (typically before ~13:00 CET)
```

A single `latest.json` per zone serves both today and tomorrow, so consecutive `fetch_today` / `fetch_tomorrow` calls within a 60-second cache window cost one HTTP request.

### API details

- Prices are published in **EUR/MWh**; `KilowahtiCdnSource` converts to **c/kWh** internally
- Slot counts vary on DST-transition days (23- or 25-hour local days) — no fixed per-day count is assumed

### Partial days

Some UTC+0/UTC+1 zones have a final local hour that belongs to the next CET-day auction. Such a day is published with `"partial": true` and served with whatever slots exist so far. Use `day_is_partial(session, region, offset_days=0)` to check whether a day is published but incomplete, and refetch later if needed.

```python
if await source.day_is_partial(session, region="PT", offset_days=0):
    ...  # today's trailing slots are not published yet
```

### Error handling

| HTTP status | Behaviour |
|-------------|-----------|
| 404 | Raises `KilowahtiCdnZoneNotFoundError` — permanent; the zone has no published data and will not resolve on retry |
| Other 4xx / 5xx | Raises `aiohttp.ClientResponseError` |

Malformed payloads (missing `days`/`timezone`, or a malformed slot entry) raise `ValueError`.

---

## SpotHintaSource

Fetches prices from the [spot-hinta.fi](https://spot-hinta.fi) REST API (no API key required). Used as the automatic fallback when the CDN is unavailable; covers Nordic and Baltic zones only.

```python
source = SpotHintaSource()

async with aiohttp.ClientSession() as session:
    today = await source.fetch_today(session, region="FI", resolution=PriceResolution.MIN15)
    tomorrow = await source.fetch_tomorrow(session, region="FI", resolution=PriceResolution.MIN15)
    # tomorrow is None if prices haven't been published yet (typically before ~13:00 CET)
```

### API details

- **Rate limit:** 1 request per minute per IP
- Prices are returned in **€/kWh**; `SpotHintaSource` converts to **c/kWh** internally

### Error handling

| HTTP status | Behaviour |
|-------------|-----------|
| 404 | `fetch_tomorrow` returns `None`; `fetch_today` raises |
| 429 | Raises `SpotHintaRateLimitError` with `retry_after` (seconds) |
| Other 4xx / 5xx | Raises `aiohttp.ClientResponseError` |

---

## SpotHintaRateLimitError

```python
class SpotHintaRateLimitError(aiohttp.ClientResponseError):
    retry_after: int  # seconds to wait before retrying
```

Raised when the API returns HTTP 429. The `retry_after` value is taken from the `Retry-After` response header (defaults to 60 seconds if the header is absent).

```python
try:
    slots = await source.fetch_today(session, region="FI", resolution=PriceResolution.MIN15)
except SpotHintaRateLimitError as e:
    print(f"Rate limited, retry in {e.retry_after}s")
```

---

## Implementing a custom source

```python
from kilowahti.sources import PriceSource
from kilowahti.models import PriceResolution, PriceSlot
import aiohttp

class MyCustomSource(PriceSource):
    async def fetch_today(
        self,
        session: aiohttp.ClientSession,
        region: str,
        resolution: PriceResolution,
    ) -> list[PriceSlot]:
        # fetch from your API and return sorted PriceSlot list
        ...

    async def fetch_tomorrow(
        self,
        session: aiohttp.ClientSession,
        region: str,
        resolution: PriceResolution,
    ) -> list[PriceSlot] | None:
        # return None if tomorrow's prices aren't available yet
        ...
```
