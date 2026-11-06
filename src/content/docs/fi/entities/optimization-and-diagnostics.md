---
title: "Optimointi- ja diagnostiikka-anturit"
---

## Optimointianturit

Yksi anturipari kutakin määritettyä pisteprofiilia kohden, jossa `{profile}` on profiilin nimi (sisäänrakennetun profiilin nimi on `total` eli yhteissumma):

| Entiteetti | Kuvaus |
|---|---|
| **{profile} pistemäärä (päivittäin)**<br>`sensor.kilowahti_{name}_score_{profile}_daily` | <ul><li>Kuluvan päivän senhetkinen optimointipistemäärä (0–100).</li><li>Attribuutti: `previous` (eilinen valmis pistemäärä)</li></ul> |
| **{profile} pistemäärä (kuukausittain)**<br>`sensor.kilowahti_{name}_score_{profile}_monthly` | <ul><li>Kuluvan kalenterikuukauden valmiiden päiväpistemäärien keskiarvo (0–100).</li><li>Attribuutti: `previous` (edellisen kuukauden lopullinen pistemäärä)</li></ul> |

Katso sivua [Optimointipisteet](/fi/scores/) nähdäksesi tarkemmin kuinka pisteet lasketaan.

## Diagnostiikka-anturit

Useimmat diagnostiikka-anturit ovat oletuksena pois käytöstä. Jos haluat nähdä tarkemmin miksi tai miten Kilowahti toimii kullakin hetkellä, ota näitä antureita tarvittaessa käyttöön yksitellen entiteettirekisterissä.

| Entiteetti | Kuvaus |
|---|---|
| **Hintaraja**<br>`sensor.kilowahti_{name}_setting_price_threshold` | Määritetty hintaraja (sama yksikkö kuin hinta-antureilla) |
| **Hyväksyttävä sijaluku**<br>`sensor.kilowahti_{name}_setting_rank_threshold` | Määritetty hyväksyttävän sijaluvun raja |
| **Hintaraja sisältää siirron**<br>`sensor.kilowahti_{name}_setting_price_threshold_includes_transfer` | Sisältyykö siirtohinta hintarajan vertailuun |
| **Ohjausfunktion muoto**<br>`sensor.kilowahti_{name}_setting_control_factor_shape` | Ohjauskertoimen muoto (`linear` tai `sinusoidal`) |
| **Ennakkoikkuna**<br>`sensor.kilowahti_{name}_setting_forward_window` | Ennakkokeskiarvon ikkunan pituus (tunteina) |
| **Aktiivinen siirtoryhmä**<br>`sensor.kilowahti_{name}_setting_active_transfer_group` | Tällä hetkellä aktiivisen siirtohinnan ryhmän nimi (esim. Kausisiirto), tai Ei saatavissa |
| **Aktiivinen siirtotaso**<br>`sensor.kilowahti_{name}_setting_active_transfer_tier` | Tällä hetkellä aktiivisen siirtohinnan tason nimi (esim. Talviarkipäivä), tai Ei saatavissa |
| **Aktiivinen kiinteä jakso**<br>`sensor.kilowahti_{name}_setting_active_fixed_period` | Tällä hetkellä aktiivisen kiinteän hintajakson nimi, tai Ei saatavissa |
| **Hintatietojen lähde**<br>`sensor.kilowahti_{name}_price_data_source` | Käytössä oleva hintalähde: `kilowahti_cdn` tai `spot_hinta` (oletuksena käytössä) *(versiosta 2026.8.0)* |
| **Vaihtokurssi**<br>`sensor.kilowahti_{name}_exchange_rate` | Käytössä oleva päivittäinen vaihtokurssi EUR → paikallinen valuutta; olemassa vain, kun näyttövaluutaksi on valittu paikallinen valuutta (oletuksena käytössä) *(versiosta 2026.8.0)* |

Lisäksi yksi diagnostiikka-anturi kutakin optimointiprofiilia kohden:

| Entiteetti | Kuvaus |
|---|---|
| **{profile} pisteytyskaava**<br>`sensor.kilowahti_{name}_score_{profile}_formula` | Profiilissa käytössä oleva pisteytyskaava: `default` (oletus) tai `raw` (neutraali) |
