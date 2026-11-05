# Palvelut

Kaikki palvelut (service) on rekisteröity Home Assistantissa `kilowahti`-toimialueelle. Jokainen palvelu ottaa valinnaisen `config_entry_id`-kentän, jolla kerrotaan, mitä Kilowahti-esiintymää käytetään. Jos käytössä on vain yksi esiintymä (esim. Koti), kentän voi jättää pois. Useamman esiintymän kanssa kenttä on pakollinen: ilman sitä kutsu epäonnistuu validointivirheeseen, joten alla olevissa esimerkeissä kenttä on jätetty pois lyhyyden vuoksi, mutta usean esiintymän asennuksessa se täytyy lisätä.

Virheelliset kutsut (yhtään Kilowahti-esiintymää ei ole määritetty, tuntematon `config_entry_id` tai jakson tunnus, virheellinen tai päällekkäinen kiinteähintainen jakso) epäonnistuvat validointivirheellä, jonka Home Assistant näyttää käyttöliittymässä ja automaatioiden jäljityksissä. Jos automaatiosi käsittelee virheen, sen pitää siepata `ServiceValidationError`.

## Hintakyselyt

Kaikki hintakyselyt hyväksyvät `formatted`-parametrin (oletuksena `true`), joka pyöristää hinnat näyttötarkkuuteesi ja muuntaa ne valitsemaasi näyttöyksikköön. Kun arvo on `false`, hinnat palautetaan täydellä tarkkuudella näyttövaluuttasi pienemmässä yksikössä (`c/kWh`, `öre/kWh`, …).

---

### `kilowahti.get_active_prices`

Palauttaa kaikki tämän päivän ja huomisen hintajaksot (oletus) tai valitsemasi aikavälin hintajaksot. Jokaisella hintajaksolla on toteutuva hinta (spot-hinta, tai sopimushintasi kiinteähintaisen jakson aikana) ja kokonaishinta (toteutuva hinta + siirto).

```yaml
action: kilowahti.get_active_prices
data: {}
```

```yaml
action: kilowahti.get_active_prices
data:
  start: "2026-03-10T00:00:00"
  end: "2026-03-10T23:59:59"
  formatted: false
```

**Vastaus** (lyhennetty esimerkkiä varten, täydessä vastauksessa on yksi elementti aikavälin jokaista hintajaksoa kohden):
```json
{
  "unit": "c/kWh",
  "price_periods": [
    {
      "time": "2026-03-10T00:00:00+02:00",
      "price": 4.32,
      "total_price": 6.87,
      "rank": 3,
      "is_fixed": false
    },
    {
      "time": "2026-03-10T00:15:00+02:00",
      "price": 4.32,
      "total_price": 6.87,
      "rank": 3,
      "is_fixed": false
    },
    "..."
  ]
}
```

---

### `kilowahti.get_prices`

Palauttaa valitun aikavälin raa'at spot-hintajaksot. Hinnat ovat pelkkiä spot-hintoja (ALV ja marginaali lisättynä), kiinteähintaiset jaksot ja siirto eivät sisälly näihin hintoihin. Vastauksen jaksojen `time`-arvot ovat UTC-aikoja.

```yaml
action: kilowahti.get_prices
data:
  start: "2026-03-10T00:00:00"
  end: "2026-03-10T23:59:59"
```

---

### `kilowahti.cheapest_hours`

Etsii valitulta aikaväliltä kokonaishinnan (spot-hinta tai kiinteän jakson hinta, plus siirto) perusteella halvimman yhtenäisen, halutun pituisen ikkunan.

```yaml
action: kilowahti.cheapest_hours
data:
  start: "2026-03-10T18:00:00"
  end: "2026-03-11T08:00:00"
  hours: 3
  reverse: false  # valinnainen, oletus: false
```

!!! tip "Etsi myöhäisin aika `reverse`-parametrillä"
    Aseta `reverse: true`, jos haluat tasatilanteessa **myöhäisimmän** halvimman ikkunan (hyödyllinen esimerkiksi "lataa akkua halvemmalla ennen hinnan nousemista" -automaatioissa tai kun etsit yöaikaan viimeisintä kelvollista lämmitysjaksoa ennen hinnan nousemista aamulla). Oletusarvo `false` palauttaa aikaisimman mahdollisen ikkunan.

**Vastaus:**
```json
{
  "start": "2026-03-10T20:00:00+00:00",
  "end": "2026-03-10T22:45:00+00:00",
  "average_price": 3.21,
  "unit": "c/kWh",
  "price_periods": [...]
}
```

`start` ja `end` ovat UTC-aikoja. `end` on ikkunan viimeisen hintajakson alkuhetki, ei hetki, jolloin ikkuna päättyy: yllä viimeinen kahdestatoista 15 minuutin jaksosta alkaa klo 22:45 UTC ja päättyy klo 23:00. Myös `price_periods`-rivien `time`-arvot ovat UTC-aikoja.

!!! tip "Laitteiden ajastaminen halvimpaan aikaan"
    Kutsu tätä palvelua kerran päivässä sen jälkeen, kun huomisen hinnat ovat saapuneet, tallenna tulos `input_datetime`-apuriin ja käynnistä laitteesi sen perusteella. Kokonainen esimerkki löytyy sivulta [Automaatioesimerkit](automations.md) (laitteen ajastaminen halvimpaan tulevaan ikkunaan).

---

### `kilowahti.average_price`

Palauttaa valitun aikavälin hintatilastot spot-hinnasta, johon on lisätty ALV ja marginaali. Kiinteähintaiset jaksot ja siirto eivät sisälly hintoihin.

```yaml
action: kilowahti.average_price
data:
  start: "2026-03-10T00:00:00"
  end: "2026-03-10T23:59:59"
```

**Vastaus:**
```json
{
  "average_price": 5.14,
  "min_price": 1.23,
  "max_price": 12.87,
  "unit": "c/kWh",
  "slot_count": 96
}
```

---

## Tuotanto ja myynti

Nämä palvelut edellyttävät, että **tuotanto on otettu käyttöön** asetuksissa.

---

### `kilowahti.get_export_prices`

Palauttaa valitun aikavälin myyntihintajaksot määritetyn myyntihinnoittelutavan mukaan (spot-sidonnainen tai kiinteä hinta).

```yaml
action: kilowahti.get_export_prices
data:
  start: "2026-03-10T00:00:00"
  end: "2026-03-10T23:59:59"
```

**Vastaus:**
```json
{
  "unit": "c/kWh",
  "price_periods": [
    {
      "time": "2026-03-10T00:00:00+02:00",
      "export_price": 3.00
    }
  ]
}
```

---

### `kilowahti.best_export_hours`

Etsii valitulta aikaväliltä kannattavimman yhtenäisen ikkunan sähkön myymiseen verkkoon myyntihinnan perusteella.

```yaml
action: kilowahti.best_export_hours
data:
  start: "2026-03-10T08:00:00"
  end: "2026-03-10T20:00:00"
  hours: 2
```

**Vastaus:**
```json
{
  "start": "2026-03-10T12:00:00+00:00",
  "end": "2026-03-10T13:45:00+00:00",
  "average_export_price": 8.45,
  "unit": "c/kWh",
  "price_periods": [...]
}
```

`start` ja `end` ovat UTC-aikoja, ja `end` on ikkunan viimeisen hintajakson alkuhetki (yllä viimeinen kahdeksasta 15 minuutin jaksosta alkaa klo 13:45 UTC ja päättyy klo 14:00). `price_periods`-rivien `time`-arvot ovat paikallista aikaa.

---

### `kilowahti.generation_schedule`

Ottaa vastaan tuntikohtaisen aurinkotuotantoennusteen ja palauttaa suositellun toiminnon jokaiselle hintajaksolle.

```yaml
action: kilowahti.generation_schedule
data:
  forecast:
    - time: "2026-03-10T10:00:00"
      kwh: 2.5
    - time: "2026-03-10T11:00:00"
      kwh: 3.1
```

**Vastaus:**
```json
{
  "schedule": [
    {
      "time": "2026-03-10T10:00:00+02:00",
      "kwh": 2.5,
      "action": "self_consume",
      "export_price": 3.20,
      "self_consumption_value": 7.85
    }
  ]
}
```

Mahdolliset `action`-arvot: `export`, `self_consume` ja `idle`. Suositus on `export`, kun myyntihinta on vähintään yhtä suuri kuin oman käytön arvo (spot-hinta ja siirto), muuten `self_consume`, jos jaksolle on ennustettu tuotantoa, ja muuten `idle`.

---

## Kiinteähintaisten jaksojen hallinta

### `kilowahti.add_fixed_period`

Lisää kiinteähintaisen sopimusjakson. Jaksot eivät voi olla päällekkäisiä.

```yaml
action: kilowahti.add_fixed_period
data:
  label: "Talven kiinnitys"
  start_date: "2026-01-01"
  end_date: "2026-03-31"
  price: 8.5
```

!!! note "Syötä hinnat aina verollisina"
    `price` syötetään **verollisena (sis. ALV)**. Hintaa käytetään sellaisenaan, ALV:tä ei lisätä enää.

---

### `kilowahti.remove_fixed_period`

Poistaa kiinteähintaisen jakson sen tunnuksen perusteella (tunnuksen saat `list_fixed_periods`-palvelulla).

```yaml
action: kilowahti.remove_fixed_period
data:
  period_id: "3f4a1b2c-..."
```

---

### `kilowahti.list_fixed_periods`

Luettelee kaikki määritetyt kiinteähintaiset jaksot.

```yaml
action: kilowahti.list_fixed_periods
data: {}
```
