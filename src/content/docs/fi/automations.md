---
title: "Automaatioesimerkit"
---

Näissä esimerkeissä `{name}` tarkoittaa nimeä, jonka annoit asennuksen aikana. Jos asettamasi nimi on `Koti`, korvaa entiteettitunnuksissa `{name}` tekstillä `koti`.

:::tip[Vasta aloittamassa?]
Kilowahdilla on omat [laukaisimet ja ehdot](/fi/triggers-conditions/), jotka voit valita suoraan automaatioeditorista, eikä entiteettitunnuksia tai YAMLia tarvita. Alla olevat esimerkit rakentavat saman toiminnan entiteettien avulla, ja sitä tarvitset siinä vaiheessa, kun tarpeesi menevät laukaisimien ja ehtojen tarjoamaa pidemmälle.
:::

---

## Käynnistä halpoina tunteina (sijalukuun perustuva)

Yksinkertaisin tapa: käytä `rank_acceptable`-binäärianturia automaation ehtona. Aseta hyväksyttävän sijaluvun raja Kilowahdin asetuksissa.

Sijaluku seuraa sitä energian hintaa, jonka oikeasti maksat. Pörssisähkösopimuksessa se on markkinahintojen järjestys. [Kiinteähintaisen jakson](/fi/fixed-periods/) aikana jokainen tunti maksaa saman verran, joten jokaisen hintajakson sijaluku on 1 ja `rank_acceptable` pysyy päällä koko päivän. Näin on tarkoituksella, koska halvempaa tuntia ei ole tulossa. Jos kuitenkin haluat ehdon, joka rajaa päivää kiinteälläkin sopimuksella, käytä `total_price_rank`-anturia, joka sisältää siirron: joko anturin numeerisella tilaehdolla tai sisäänrakennetulla ehdolla **Hinta on vuorokauden halvin** ja laukaisimella **Muuttui halvimmaksi jaksoksi**, jotka molemmat järjestävät hintajaksot kokonaishinnan mukaan.

```yaml
alias: Lämmitä vettä halpoina tunteina
triggers:
  - trigger: state
    entity_id: binary_sensor.kilowahti_{name}_rank_acceptable
    to: "on"
actions:
  - action: switch.turn_on
    target:
      entity_id: switch.water_heater
```

Laitteen pysäyttäminen, kun halpa jakso päättyy:

```yaml
alias: Pysäytä varaaja, kun tunnit eivät enää ole halpoja
triggers:
  - trigger: state
    entity_id: binary_sensor.kilowahti_{name}_rank_acceptable
    to: "off"
actions:
  - action: switch.turn_off
    target:
      entity_id: switch.water_heater
```

---

## Käynnistä, kun hinta alittaa hintarajan

Käytä `price_acceptable`-anturia, kun sinulle merkitsee absoluuttinen hinta eikä hinnan suhteellinen sijaluku. Aseta hintaraja Kilowahdin asetuksissa.

```yaml
alias: Sähköauton lataus, kun hinta on hyväksyttävä
triggers:
  - trigger: state
    entity_id: binary_sensor.kilowahti_{name}_price_acceptable
    to: "on"
actions:
  - action: switch.turn_on
    target:
      entity_id: switch.ev_charger
```

Voit myös yhdistää molemmat ehdot `price_or_rank_acceptable`-anturilla:

```yaml
triggers:
  - trigger: state
    entity_id: binary_sensor.kilowahti_{name}_price_or_rank_acceptable
    to: "on"
```

---

## Ajasta laite halvimpaan tulevaan aikaikkunaan

Etsi `kilowahti.cheapest_hours`-palvelulla halvin yhtenäinen jakso etukäteen ja ajasta laitteesi käynnistymään silloin. Tarvitset `input_datetime`-apurin. Luo se kohdassa **Asetukset → Laitteet & palvelut → Apurit → Luo apuri → Päivämäärä ja/tai kellonaika** (esim. `input_datetime.cheapest_window_start`).

**Automaatio 1 – Etsi aikaikkuna (suoritetaan päivittäin klo 17.00):**

```yaml
alias: Etsi halvin 3 tunnin ikkuna yön yli
triggers:
  - trigger: time
    at: "17:00:00"
actions:
  - action: kilowahti.cheapest_hours
    data:
      start: "{{ now().isoformat() }}"
      end: "{{ (now() + timedelta(hours=15)).isoformat() }}"  # 15 tuntia on aikaikkuna klo 17.00 → seuraavana aamuna klo 8.00
      hours: 3
    response_variable: result
  - action: input_datetime.set_datetime
    data:
      datetime: "{{ result['start'] | as_datetime | as_local }}"
    target:
      entity_id: input_datetime.cheapest_window_start
```

**Automaatio 2 – Käynnistä laite ajastettuna aikana:**

```yaml
alias: Käynnistä astianpesukone halvimpaan aikaan
triggers:
  - trigger: time
    at: input_datetime.cheapest_window_start
actions:
  - action: switch.turn_on
    target:
      entity_id: switch.dishwasher
```

---

## Portaaton ohjaus (termostaatti / ilmastointi)

Käytä `control_factor_price`-anturia asetusarvon säätämiseen sen sijaan, että kytkisit laitetta päälle ja pois. 1,0 = halvin hintajakso, 0,0 = kallein.

Tämä esimerkki säätää termostaatin asetusarvoa välillä 19 °C (kallis) ja 22 °C (halpa) 0,5 °C:n askelin:

```yaml
alias: Säädä termostaattia hinnan mukaan
triggers:
  - trigger: state
    entity_id: sensor.kilowahti_{name}_control_factor_price
actions:
  - action: climate.set_temperature
    data:
      temperature: >
        {{ (19 + (states('sensor.kilowahti_{name}_control_factor_price') | float(0)) * 3) | round(0, "half") }}
    target:
      entity_id: climate.living_room
```

Jos tarvitset ±1-välillä toimivan bipolaarisen syötteen (esim. PID-säätimelle), käytä sen sijaan anturia **Hinnan ohjauskerroin (bipolaarinen)** (`sensor.kilowahti_{name}_control_factor_price_bipolar`).

:::note
Ohjauskertoimen käyrän muodon (lineaarinen tai sinimuotoinen) ja skaalauseksponentin voi määrittää Kilowahdin asetuksissa. Sinimuotoinen käyrä reagoi pehmeämmin ääripäiden lähellä.
:::

:::tip
Home Assistantissa on paranneltu versio Jinjan `round`-suodattimesta. Siihen kuuluu myös yllä käytetty `"half"`-menetelmä, joka pyöristää lähimpään 0,5:een. Katso [Home Assistantin `round`-dokumentaatio](https://www.home-assistant.io/template-functions/round/).
:::

---

## Säädä sähköauton latausvirtaa hinnan mukaan

Sen sijaan, että kytkisit sähköauton laturia päälle ja pois, voit `control_factor_price`-anturilla säätää latausvirtaa portaattomasti minimin ja maksimin välillä. 1,0 = halvin hintajakso (täysi virta), 0,0 = kallein hintajakso (minimivirta).

Tämä esimerkki säätää virtaa välillä 6 A ja 16 A 1 A:n askelin:

```yaml
alias: Säädä sähköauton latausvirtaa hinnan mukaan
triggers:
  - trigger: state
    entity_id: sensor.kilowahti_{name}_control_factor_price
actions:
  - action: number.set_value
    target:
      entity_id: number.ev_charger_current
    data:
      value: >
        {{ (6 + (states('sensor.kilowahti_{name}_control_factor_price') | float(0)) * 10) | round(0) | int }}
```

Muuta arvot `6` (minimivirta) ja `10` (vaihteluväli: maksimi miinus minimi) laturisi tukemalle alueelle. Tarkista oikea entiteetti ja sallitut arvot laturisi integraation dokumentaatiosta.

---

## Lataa ja pura akkua kvartiilin mukaan

Ohjaa kotiakkua `price_quartile`-anturilla: lataa halvimpien 25&nbsp;%:n hintajaksojen aikana (Q1), pura kalleimpien 25&nbsp;%:n aikana (Q4) ja jätä muulloin automaattitilaan.

```yaml
alias: Akun lataus ja purku hintakvartiilin mukaan
triggers:
  - trigger: state
    entity_id: sensor.kilowahti_{name}_price_quartile
actions:
  - choose:
      - conditions:
          - condition: state
            entity_id: sensor.kilowahti_{name}_price_quartile
            state: "1"
        sequence:
          - action: select.select_option
            target:
              entity_id: select.battery_mode
            data:
              option: charge
      - conditions:
          - condition: state
            entity_id: sensor.kilowahti_{name}_price_quartile
            state: "4"
        sequence:
          - action: select.select_option
            target:
              entity_id: select.battery_mode
            data:
              option: discharge
    default:
      - action: select.select_option
        target:
          entity_id: select.battery_mode
        data:
          option: auto
```

Korvaa `select.battery_mode` ja valinnat niillä entiteeteillä ja tiloilla, joita akkusi integraatio tarjoaa.

---

## Ilmoita, kun huomisen hinnat ovat saatavilla

Huomisen hinnat julkaistaan alkuiltapäivällä (noin klo 13.00 Keski-Euroopan aikaa, joillakin markkinoilla myöhemmin). Käytä laukaisimena huomisen hintojen saatavuutta kertovan binäärianturin kytkeytymistä päälle, ja lähetä push-ilmoitus päivän hintahaarukasta.

```yaml
alias: Ilmoita, kun huomisen hinnat saapuvat
triggers:
  - trigger: state
    entity_id: binary_sensor.kilowahti_{name}_tomorrow_available
    to: "on"
actions:
  - action: notify.mobile_app_your_phone
    data:
      title: "Huomisen sähkön hinnat"
      message: >
        Halvin {{ states('sensor.kilowahti_{name}_tomorrow_spot_minimum') }},
        keskiarvo {{ states('sensor.kilowahti_{name}_tomorrow_spot_average') }},
        kallein {{ states('sensor.kilowahti_{name}_tomorrow_spot_maximum') }}
        {{ state_attr('sensor.kilowahti_{name}_tomorrow_spot_minimum', 'unit_of_measurement') }}
```

Korvaa `notify.mobile_app_your_phone` omalla ilmoituspalvelullasi.

---

## Hälytä, kun spot-hinta ylittää päivän keskiarvon

Lähetä ilmoitus aina, kun nykyisen hintajakson hinta nousee tämän päivän keskiarvon yläpuolelle. Tästä on hyötyä ennakkovaroituksena, jotta voit siirtää ei-kiireellistä kulutusta myöhemmäksi.

```yaml
alias: Hälytä, kun hinta ylittää päivän keskiarvon
triggers:
  - trigger: template
    value_template: >
      {{ states('sensor.kilowahti_{name}_spot_price') | float(0) >
         states('sensor.kilowahti_{name}_today_spot_average') | float(0) }}
actions:
  - action: notify.mobile_app_your_phone
    data:
      message: >
        Sähkön hinta {{ states('sensor.kilowahti_{name}_spot_price') }}
        on yli tämän päivän keskiarvon {{ states('sensor.kilowahti_{name}_today_spot_average') }}
        {{ state_attr('sensor.kilowahti_{name}_spot_price', 'unit_of_measurement') }}.
```
