---
title: "Liukuvan keskiarvon, tuotanto- ja akkuanturit"
---

## Liukuvan keskiarvon anturit

**Käytettävissä vain 15 minuutin hintaresoluutiolla.**

Ota käyttöön valinnalla **Näytä seuraavan 30 min, 1h ja 2h keskihinnat** kohdassa **Määrittele → Lisäasetukset**.

| Entiteetti | Kuvaus |
|---|---|
| **Keskihinta 30 min**<br>`sensor.kilowahti_{name}_average_price_30min` | Nykyisen aikajakson ja sitä seuraavien 30 minuutin kokonaishinnan keskiarvo |
| **Keskihinta 60 min**<br>`sensor.kilowahti_{name}_average_price_60min` | Nykyisen aikajakson ja sitä seuraavien 60 minuutin kokonaishinnan keskiarvo |
| **Keskihinta 120 min**<br>`sensor.kilowahti_{name}_average_price_120min` | Nykyisen aikajakson ja sitä seuraavien 120 minuutin kokonaishinnan keskiarvo |

Huomaa että keskiarvojen laskennassa käytetään kokonaishintaa (energia + siirto). Ellei siirtohintoja ole asetettu, keskiarvo vastaa pelkkää energian hinnan keskiarvoa.

## Tuotanto- ja myyntianturit

Tämän osion anturit ovat käytettävissä silloin, kun **Ota tuotanto- ja myyntiominaisuudet käyttöön** on valittu kohdassa **Määrittele → Lisäasetukset**.

| Entiteetti | Kuvaus |
|---|---|
| **Myyntihinta**<br>`sensor.kilowahti_{name}_export_price` | Nykyisen aikajakson myyntihinta verkkoon syötetylle sähkölle (ei ALV:tä) |
| **Tänään myyntihinnan keskiarvo**<br>`sensor.kilowahti_{name}_export_today_average` | Tämän päivän myyntihinnan keskiarvo |
| **Tänään myyntihinnan minimi**<br>`sensor.kilowahti_{name}_export_today_minimum` | Tämän päivän alin myyntihinta |
| **Tänään myyntihinnan maksimi**<br>`sensor.kilowahti_{name}_export_today_maximum` | Tämän päivän korkein myyntihinta |
| **Huomenna myyntihinnan keskiarvo**<br>`sensor.kilowahti_{name}_export_tomorrow_average` | Huomisen myyntihinnan keskiarvo; Ei saatavissa ennen kuin hinnat on haettu |
| **Huomenna myyntihinnan minimi**<br>`sensor.kilowahti_{name}_export_tomorrow_minimum` | Huomisen alin myyntihinta |
| **Huomenna myyntihinnan maksimi**<br>`sensor.kilowahti_{name}_export_tomorrow_maximum` | Huomisen korkein myyntihinta |
| **Osto-myyntiero**<br>`sensor.kilowahti_{name}_import_export_spread` | Nykyisen ostohinnan (kokonaishinta) ja myyntihinnan erotus |
| **Omakulutuksen arvo**<br>`sensor.kilowahti_{name}_self_consumption_value` | Jokaisen omasta tuotannosta kulutetun kilowattitunnin arvo (= vältetty ostokustannus) |
| **Seuraavan aurinkoikkunan keskiarvo**<br>`sensor.kilowahti_{name}_next_solar_window_average` | Seuraavan tulevan aurinkotuotantoikkunan myyntihinnan keskiarvo |
| **Arbitraasiero tänään**<br>`sensor.kilowahti_{name}_arbitrage_spread_today` | Tämän päivän halvimman ja kalleimman kokonaishintaisen aikajakson välinen ero |

## Akkuanturit

Tämän osion anturit ovat käytettävissä silloin, kun **Ota tuotanto- ja myyntiominaisuudet käyttöön** on valittu kohdassa **Määrittele → Lisäasetukset** ja lisäksi kohdassa **Määrittele → Tuotanto ja myynti** on asetettu **akun kapasiteetti > 0 kWh**.

| Entiteetti | Kuvaus |
|---|---|
| **Latausmahdollisuuskerroin**<br>`sensor.kilowahti_{name}_charge_opportunity_factor` | Kuinka hyvä hetki nyt on ladata verkosta (0,0 = huonoin, 1,0 = paras). Käyttää aina lineaarista skaalausta – ohjauskertoimen käyrä tai skaalausasetukset eivät vaikuta siihen |
| **Akun lataussuositus**<br>`sensor.kilowahti_{name}_battery_charge_recommendation` | Luokitteleva suositus: `charge_from_grid`, `discharge` tai `hold` |
| **Optimaalisen latausikkunan alku**<br>`sensor.kilowahti_{name}_optimal_charge_window_start` | Halvimman ikkunan alku akun täydelle latausjaksolle |
| **Optimaalisen latausikkunan loppu**<br>`sensor.kilowahti_{name}_optimal_charge_window_end` | Halvimman ikkunan loppu akun täydelle latausjaksolle |
