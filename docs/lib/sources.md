# Price sources

```python
from kilowahti.sources import PriceSource
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

## SpotHintaSource

Fetches prices from the [spot-hinta.fi](https://spot-hinta.fi) REST API (no API key required).

```python
source = SpotHintaSource()

async with aiohttp.ClientSession() as session:
    today = await source.fetch_today(session, region="FI", resolution=PriceResolution.HOUR)
    tomorrow = await source.fetch_tomorrow(session, region="FI", resolution=PriceResolution.HOUR)
    # tomorrow is None if prices haven't been published yet (typically before ~13:00 local)
```

### API details

- **Base URL:** `https://api.spot-hinta.fi`
- **Today:** `GET /Today?region=FI&priceResolution=60`
- **Tomorrow:** `GET /DayForward?region=FI&priceResolution=60`
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
    slots = await source.fetch_today(session, region="FI", resolution=PriceResolution.HOUR)
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
