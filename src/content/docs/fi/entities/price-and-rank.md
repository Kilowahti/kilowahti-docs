---
title: "Hinta-, sijaluku- ja ohjauskerroinanturit"
---

## Hinta-anturit

Kaikki hinta-anturit käyttävät asetuksissa valitsemaasi näyttöyksikköä, eli näyttövaluuttasi pienempää tai suurempaa yksikköä, esim. `c/kWh` tai `€/kWh`, `öre/kWh` tai `kr/kWh`.

| Entiteetti | Kuvaus |
|---|---|
| **Spot-hinta**<br>`sensor.kilowahti_{name}_spot_price` | <ul><li>Nykyisen aikajakson verollinen spot-hinta</li><li>Attribuutit: `price_source` sekä `today_prices`/`tomorrow_prices`, kun hintataulukot on otettu käyttöön</li></ul> |
| **Toteutuva hinta**<br>`sensor.kilowahti_{name}_active_price` | <ul><li>Maksamasi energian hinta: spot-hinta tai sopimushinta, kun kiinteä hintajakso on voimassa</li><li>Attribuutit: `source` (`spot`/`fixed`), `period_label`</li></ul> |
| **Siirtohinta**<br>`sensor.kilowahti_{name}_transfer_price` | <ul><li>Voimassa oleva siirtohinta, tuntematon ennen kuin siirtohintoja on määritetty</li><li>Attribuutit: `tariff` (aktiivinen ryhmä ja taso, esim. "Kausisiirto, Muu aika") sekä erikseen `group` (ryhmä) ja `tier` (taso)</li></ul> |
| **Kokonaishinta**<br>`sensor.kilowahti_{name}_total_price` | <ul><li>Kokonaishinta, eli energian toteutuva hinta + siirtohinta</li><li>Attribuutit: `today_prices`/`tomorrow_prices`, kun kokonaishintataulukot on otettu käyttöön lisäasetuksissa</li></ul> |
| **Tänään spot-keskiarvo**<br>`sensor.kilowahti_{name}_today_spot_average` | Tämän päivän spot-hinnan keskiarvo |
| **Tänään spot-minimi**<br>`sensor.kilowahti_{name}_today_spot_minimum` | Tämän päivän matalin spot-hinta |
| **Tänään spot-maksimi**<br>`sensor.kilowahti_{name}_today_spot_maximum` | Tämän päivän korkein spot-hinta |
| **Tänään kokonaishinnan keskiarvo**<br>`sensor.kilowahti_{name}_today_total_average` | Tämän päivän kokonaishinnan keskiarvo (spot + siirto) |
| **Tänään kokonaishinnan minimi**<br>`sensor.kilowahti_{name}_today_total_minimum` | Tämän päivän matalin kokonaishinta |
| **Tänään kokonaishinnan maksimi**<br>`sensor.kilowahti_{name}_today_total_maximum` | Tämän päivän korkein kokonaishinta |
| **Huomenna spot-keskiarvo**<br>`sensor.kilowahti_{name}_tomorrow_spot_average` | Huomisen spot-hinnan keskiarvo, ei saatavissa ennen kuin huomisen hinnat on haettu |
| **Huomenna spot-minimi**<br>`sensor.kilowahti_{name}_tomorrow_spot_minimum` | Huomisen matalin spot-hinta; Ei saatavissa ennen kuin huomisen hinnat on haettu |
| **Huomenna spot-maksimi**<br>`sensor.kilowahti_{name}_tomorrow_spot_maximum` | Huomisen korkein spot-hinta; Ei saatavissa ennen kuin huomisen hinnat on haettu |
| **Huomenna kokonaishinnan keskiarvo**<br>`sensor.kilowahti_{name}_tomorrow_total_average` | Huomisen kokonaishinnan keskiarvo; Ei saatavissa ennen kuin huomisen hinnat on haettu (tai kiinteä hintajakso, jos sellainen on voimassa huomenna) |
| **Huomenna kokonaishinnan minimi**<br>`sensor.kilowahti_{name}_tomorrow_total_minimum` | Huomisen alin kokonaishinta |
| **Huomenna kokonaishinnan maksimi**<br>`sensor.kilowahti_{name}_tomorrow_total_maximum` | Huomisen korkein kokonaishinta |
| **Tänään keskiarvo**<br>`sensor.kilowahti_{name}_today_average` | Tämän päivän toteutuvan hinnan keskiarvo (spot, tai kiinteä hinta kiinteän hintajakson aikana) *(versiosta 2026.8.0)* |
| **Tänään minimi**<br>`sensor.kilowahti_{name}_today_minimum` | Tämän päivän alin toteutuva hinta *(versiosta 2026.8.0)* |
| **Tänään maksimi**<br>`sensor.kilowahti_{name}_today_maximum` | Tämän päivän korkein toteutuva hinta *(versiosta 2026.8.0)* |
| **Huomenna keskiarvo**<br>`sensor.kilowahti_{name}_tomorrow_average` | Huomisen toteutuvan hinnan keskiarvo; Ei saatavissa ennen kuin huomisen hinnat on haettu *(versiosta 2026.8.0)* |
| **Huomenna minimi**<br>`sensor.kilowahti_{name}_tomorrow_minimum` | Huomisen alin toteutuva hinta *(versiosta 2026.8.0)* |
| **Huomenna maksimi**<br>`sensor.kilowahti_{name}_tomorrow_maximum` | Huomisen korkein toteutuva hinta *(versiosta 2026.8.0)* |
| **Seuraavien tuntien keskiarvo**<br>`sensor.kilowahti_{name}_next_hours_average` | Toteutuvan hinnan keskiarvo seuraavien N tunnin ajalta (määritettävissä) *(versiosta 2026.8.0)* |
| **Spot seuraavien tuntien keskiarvo**<br>`sensor.kilowahti_{name}_spot_next_hours_average` | Spot-hinnan keskiarvo seuraavien N tunnin ajalta (määritettävissä) *(versiosta 2026.8.0)* |
| **Kiinteä kuukausikustannus tänään**<br>`sensor.kilowahti_{name}_monthly_fixed_cost_today` | Tämän päivän osuus sopimuksen kiinteästä kuukausimaksusta päivää kohden näyttövaluutassasi, ei saatavissa, jos kuukausimaksua ei ole määritetty |

Pörssihinnat haetaan joka päivä ja anturit päivittyvät hintajaksojen vaihtuessa vaikka käytössä olisikin kiinteä hintajakso. Kiinteän hintajakson voimassaolosta kertoo binäärianturi `fixed_price_period_active`, katso alempaa kohta [Binäärianturit](/fi/entities/binary-sensors/).

## Sijalukuanturit

| Entiteetti | Kuvaus |
|---|---|
| **Toteutuvan hinnan sijaluku**<br>`sensor.kilowahti_{name}_price_rank` | <ul><li>Nykyisen aikajakson sijaluku toteutuvan energiahinnan mukaan (kiinteän hintajakson hinta, kun sellainen on voimassa, muuten spot-hinta), ei sisällä siirtohintaa.</li><li>Normalisoitu: 1 = halvin, päivän hintajaksojen lukumäärä (slots_per_day) = kallein. Lue tarkemmin taulukon alta.</li></ul> |
| **Kokonaishinnan sijaluku**<br>`sensor.kilowahti_{name}_total_price_rank` | Sama, mutta siirto sisältyy hintaan |
| **Hintakvartiili**<br>`sensor.kilowahti_{name}_price_quartile` | Energiahinnan kvartiili 1–4 (johdettu `price_rank`-arvosta): 1&nbsp;=&nbsp;halvimmat 25&nbsp;% aikajaksoista päivän aikana |
| **Kokonaishinnan kvartiili**<br>`sensor.kilowahti_{name}_total_price_quartile` | Kokonaishinnan kvartiili 1–4 (johdettu `total_price_rank`-arvosta): 1&nbsp;=&nbsp;halvimmat 25&nbsp;% aikajaksoista päivän aikana |

:::note[Korkein mahdollinen sijaluku riippuu hintaresoluutiosta]
Suurin sijaluku 15 minuutin resoluutiolla on **96**, ja tunnin resoluutiolla **24**.
:::

Sijaluvut on normalisoitu hintatasoittain: samanhintaiset aikajaksot jakavat saman sijaluvun, ja päivän halvin hinta on aina 1 ja kallein on aina korkein mahdollinen sijaluku. Esimerkiksi jos varttimittausta käytettäessä koko päivän 96 jaksolla olisi vain kaksi eri hintaa, niistä halvempi saa sijaluvukseen&nbsp;1 ja kalliimpi&nbsp;96.

[Kiinteän hintajakson](/fi/fixed-periods/) aikana jokainen aikajakso maksaa saman verran, joten pelkän energian `price_rank` on 1 koko päivän, koska päivän aikana ei ole odotettavissa sitä kalliimpaa jaksoa. Energian kiinteästä hintajaksosta huolimatta kokonaishinnan sijaluku `total_price_rank` saattaa kuitenkin vaihdella, jos siirtohinnat on määritelty ja päivän aikana aktiivisia eri siirtohintoja on enemmän kuin yksi.

## Ohjauskerroinanturit

Kaikilla kolmella kertoimella on sama asteikko: **1,0 = halvin, 0,0 = kallein**, ja kuhunkin sovelletaan määritettyä muotoa (lineaarinen/sinimuotoinen) ja skaalausta. Jokaisesta on bipolaarinen versio joka sijoittaa saman arvon välille −1…+1.

| Entiteetti | Vaihteluväli | Kuvaus |
|---|---|---|
| **Hinnan ohjauskerroin**<br>`sensor.kilowahti_{name}_control_factor_price` | 0–1 | Perustuu `price_rank`-arvoon: energian hinta ilman siirtoa. |
| **Hinnan ohjauskerroin (bipolaarinen)**<br>`sensor.kilowahti_{name}_control_factor_price_bipolar` | −1…+1 | Yllä olevan bipolaarinen versio. |
| **Kokonaishinnan ohjauskerroin**<br>`sensor.kilowahti_{name}_control_factor_total` | 0–1 | Perustuu `total_price_rank`-arvoon: energia ja siirto yhdessä. *(versiosta 2026.9.0)* |
| **Kokonaishinnan ohjauskerroin (bipolaarinen)**<br>`sensor.kilowahti_{name}_control_factor_total_bipolar` | −1…+1 | Yllä olevan bipolaarinen versio. *(versiosta 2026.9.0)* |
| **Siirron ohjauskerroin**<br>`sensor.kilowahti_{name}_control_factor_transfer` | 0–1 | Perustuu siirtohinnan sijalukuun koko päivän siirtohintojen joukossa. Tuntematon ennen kuin siirtohintoja on määritetty. |
| **Siirron ohjauskerroin (bipolaarinen)**<br>`sensor.kilowahti_{name}_control_factor_transfer_bipolar` | −1…+1 | Yllä olevan bipolaarinen versio. Tuntematon ennen kuin siirtohintoja on määritetty. *(versiosta 2026.9.0)* |

Siirron ohjauskerroin määräytyy päivän eri siirtohintojen (tyypillisesti korkeintaan kahden tai kolmen) joukossa, joten se muuttuu suuremmin askelin kuin hinnan ja kokonaishinnan kertoimet, jotka määräytyvät kaikkien aikajaksojen joukossa.

Siirtohinnan ryhmä, jossa on vain yksi sääntö, tai energian hinnan osalta kokonaan kiinteän hintajakson sisällä vietetty päivä antaa kyseiselle anturille vakioarvon 1 – minkään hintajakson suosimiseen tai välttämiseen ei ole syytä.
