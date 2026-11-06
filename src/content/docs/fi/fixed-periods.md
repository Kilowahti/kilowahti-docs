---
title: "Kiinteän hinnan jaksot"
---

Kiinteähintaisilla jaksoilla voit määrittää ajanjaksoja, joiden aikana spot-hinnan tilalla käytetään kiinteää sopimushintaa. Tämä on hyödyllistä, jos sinulla on kiinteähintainen sähkösopimus tai kiinnitetty hinta pörssisähkösopimuksessa osan vuodesta, tai jatkuvasti, jos koko sopimuksesi on kiinteähintainen.

## Miten se toimii

Kun kiinteähintainen jakso on voimassa:

- **Toteutuva hinta** (`sensor.kilowahti_{name}_active_price`) näyttää kiinteän hinnan spot-hinnan sijaan
- **Kokonaishinta** (`sensor.kilowahti_{name}_total_price`) = kiinteä hinta + siirtohinta
- **Kiinteä hintajakso on aktiivinen** (`binary_sensor.kilowahti_{name}_fixed_price_period_active`) on `Päällä` (`on`)
- `price_acceptable`-binäärianturi vertaa hintarajaa kiinteään hintaan
- **Toteutuvan hinnan sijaluku** (`sensor.kilowahti_{name}_price_rank`) on 1 jokaisella hintajaksolla ja `control_factor_price` pysyy arvossa 1,0 — kun koko päivän hinta on sama, mikään tunti ei ole toista parempi. `total_price_rank` erottelee tunnit silti, jos siirtohinnoissasi on useampi taso

Spot-hinta-anturi näyttää joka tapauksessa edelleen ajantasaisen spot-hinnan, joten näet yhä, mitä markkinoilla tapahtuu.

## Jaksojen hallinta

Jaksoja voi hallita kohdassa **Määrittele → Kiinteähintaiset jaksot / kiinteät sopimukset** tai palvelukutsuilla.

:::note
Jaksot eivät voi olla päällekkäisiä. Hinta syötetään **verollisena (sis. ALV)** ja sitä käytetään sellaisenaan.
:::

### Käyttöliittymässä

**Määrittele → Kiinteähintaiset jaksot / kiinteät sopimukset → ➕ Add period**

### Palvelukutsuilla

```yaml
# Lisää jakso
action: kilowahti.add_fixed_period
data:
  label: "Q1 2026 kiinnitys"
  start_date: "2026-01-01"
  end_date: "2026-03-31"
  price: 8.5

# Listaa kaikki jaksot (tunnusten selvittämiseksi)
action: kilowahti.list_fixed_periods
data: {}

# Poista jakso
action: kilowahti.remove_fixed_period
data:
  period_id: "3f4a1b2c-..."
```
