---
title: "Binäärianturit"
---

Kaikilla näistä antureista lukuun ottamatta `price_or_rank_acceptable`-anturia on vastineensa [laukaisimina ja ehtoina](/fi/triggers-conditions/), joiden avulla automaatio saattaa olla helpompi rakentaa.

| Entiteetti | Kuvaus |
|---|---|
| **Hinta on hyväksyttävä**<br>`binary_sensor.kilowahti_{name}_price_acceptable` | `Päällä` (`on`) silloin kun nykyinen hinta on määritetyssä raja-arvossa tai sen alle |
| **Sijaluku on hyväksyttävä**<br>`binary_sensor.kilowahti_{name}_rank_acceptable` | `Päällä` (`on`) silloin kun nykyinen sijaluku on määritetyssä raja-arvossa tai sen alle |
| **Hinta tai sijaluku on hyväksyttävä**<br>`binary_sensor.kilowahti_{name}_price_or_rank_acceptable` | `Päällä` (`on`) silloin kun **joko hinta- tai sijalukuehto** täyttyy |
| **Kiinteä hintajakso on aktiivinen**<br>`binary_sensor.kilowahti_{name}_fixed_price_period_active` | `Päällä` (`on`) silloin kun kiinteä hintajakso on voimassa |
| **Huomisen hinnat saatavilla**<br>`binary_sensor.kilowahti_{name}_tomorrow_available` | `Päällä` (`on`) silloin kun huomisen hinnat on saatavilla |

Seuraavat binäärianturit ovat käytettävissä, kun **tuotanto on otettu käyttöön**:

| Entiteetti | Kuvaus |
|---|---|
| **Myyntihinta hyväksyttävä**<br>`binary_sensor.kilowahti_{name}_export_price_acceptable` | Päällä, kun nykyinen myyntihinta on määritetyssä myyntihinnan kynnysarvossa tai sen yläpuolella |

Seuraavat ovat käytettävissä, kun **tuotanto on otettu käyttöön** ja **akun kapasiteetti > 0 kWh**:

| Entiteetti | Kuvaus |
|---|---|
| **Verkosta lataaminen suositeltavaa**<br>`binary_sensor.kilowahti_{name}_charge_from_grid_recommended` | Päällä, kun nykyinen aikajakso on halpa ja päivän mittaan on tulossa kalliimpia aikajaksoja |
| **Verkkoon myyminen suositeltavaa**<br>`binary_sensor.kilowahti_{name}_discharge_to_grid_recommended` | Päällä, kun nykyinen myyntihinta on päivän ylimmässä kvartiilissa |
