# Constants

```python
from kilowahti.const import API_REGIONS, COUNTRY_PRESETS, UNIT_SNTPERKWH
# or via top-level namespace:
from kilowahti import COUNTRY_PRESETS
```

---

## API endpoints

| Constant | Value |
|----------|-------|
| `API_BASE_URL` | `"https://api.spot-hinta.fi"` |
| `API_ENDPOINT_TODAY` | `"/Today"` |
| `API_ENDPOINT_TOMORROW` | `"/DayForward"` |
| `API_ENDPOINT_BOTH` | `"/TodayAndDayForward"` |

---

## Display units

| Constant | Value |
|----------|-------|
| `UNIT_SNTPERKWH` | `"c/kWh"` |
| `UNIT_EUROKWH` | `"€/kWh"` |

---

## Control factor functions

| Constant | Value |
|----------|-------|
| `CONTROL_FACTOR_LINEAR` | `"linear"` |
| `CONTROL_FACTOR_SINUSOIDAL` | `"sinusoidal"` |

---

## Score formulas

| Constant | Value | Description |
|----------|-------|-------------|
| `SCORE_FORMULA_DEFAULT` | `"default"` | Scaled so random consumption ≈ 50 |
| `SCORE_FORMULA_RAW` | `"raw"` | Direct cheap-quartile percentage |

---

## API regions

`API_REGIONS` is a list of region codes accepted by the spot-hinta.fi API:

```
FI, EE, LT, LV,
DK1, DK2,
NO1, NO2, NO3, NO4, NO5,
SE1, SE2, SE3, SE4
```

---

## Country presets

`COUNTRY_PRESETS` maps country codes to `(vat_rate, electricity_tax_snt_per_kwh)` tuples. These are the default values pre-filled in the integration's configuration flow.

| Code | VAT rate | Electricity tax (c/kWh) |
|------|----------|-------------------------|
| `FI` | 25.5 % | 2.253 |
| `SE` | 25 % | 0.439 |
| `NO` | 25 % | 0.071 |
| `DK` | 25 % | 0.008 |
| `EE` | 22 % | 0.001 |
| `LV` | 22 % | 0.0 |
| `LT` | 22 % | 0.001 |
| `DE` | 19 % | 2.05 |
| `NL` | 21 % | 12.28 |
| `FR` | 20 % | 2.57 |
| `AT` | 20 % | 0.001 |
| `BE` | 21 % | 0.001 |
| `PT` | 23 % | 0.001 |
| `HR` | 25 % | 0.001 |
| `IE` | 23 % | 0.001 |
| `LU` | 17 % | 0.001 |
| `Custom` | 0 % | 0.0 |

!!! note
    The electricity tax values are informational only — they are not included in `spot_effective()` or any total price calculation in the current version.

```python
from kilowahti import COUNTRY_PRESETS
vat_rate, elec_tax = COUNTRY_PRESETS["FI"]  # (0.255, 2.253)
```
