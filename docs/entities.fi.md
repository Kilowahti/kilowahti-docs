# Entiteetit

Kaikki entiteetit on koottu yhden **Kilowahti**-laitteen alle kutakin määritettyä esiintymää kohden. Entiteettien nimissä käytetään asennuksen aikana antamaasi nimeä (esim. `Home` tai `Koti`).

!!! note "Entiteettien tunnukset omassa järjestelmässäsi"
    Versiosta `2026.11.0` alkaen Kilowahti määrittää omien entiteettiensä tunnukset kiinteästi, joten ne ovat samat jokaisessa asennuksessa käyttöliittymän kielestä riippumatta. Vain näytettävät nimet käännetään käyttäjäprofiilin asetuksissa valitulle kielelle.

    **Ennen** versiota `2026.11.0` luoduissa asennuksissa säilyvät tunnukset, jotka Home Assistant tuolloin muodosti käännetystä näyttönimestä. Useimmat ovat samoja, mutta muutama poikkeaa: `price_rank` oli `rank`, `tomorrow_available` oli `tomorrow_s_prices_available`, `setting_*`-diagnostiikka-antureilla ei ollut etuliitettä, ja suomen- tai saksankielinen asennus sai suomen- tai saksankieliset tunnukset kauttaaltaan.

    Päivityksen jälkeen kohdassa **Asetukset → Järjestelmä → Korjaukset** on korjaus, joka tarjoutuu nimeämään tunnukset uudelleen kiinteisiin tunnuksiin. Mitään ei muuteta ennen kuin vahvistat. Vahvistusnäkymä luettelee automaatiot, skriptit, tilanteet ja ryhmät, jotka käyttävät entiteettejä (kojelautoja ja malleja ei tarkisteta). Itse muuttamiisi tunnuksiin ei kosketa, ja kaikkien tunnusten historia säilyy. Mahdolliset viittaukset vanhoihin tunnuksiin esim. automaatioissa tai kojelaudan korteissa on päivitettävä jälkikäteen käsin. Jos ohitat korjauksen, näet todelliset tunnuksesi kohdasta **Asetukset → Laitteet & palvelut → Kilowahti**.

## Aloita näistä

Tämä sivu on Kilowahdin kattava hakuteos, etkä luultavasti koskaan tarvitse suurta osaa siitä. Tyypillisessä peruskokoonpanossa pärjää hyvin pitkälle vain viidellä entiteetillä:

| Entiteetti | Mihin sitä käytetään |
|---|---|
| `sensor.kilowahti_{name}_total_price` | <ul><li>**Mitä kilowattitunti maksaa sinulle juuri nyt, kaikki kulut mukaan lukien.**</li><li>Tämä luku on hyödyllinen esimerkiksi kojelaudan kortissa käyttäjille näytettynä.</li></ul> |
| `sensor.kilowahti_{name}_price_rank` | <ul><li>**Mihin kohtaan nykyinen aikajakso sijoittuu energian hinnan osalta koko päivän hinnoissa, pienempi on parempi: 1 = halvin.**</li><li>Tästä luvusta on eniten hyötyä automaatioissa: esimerkiksi lämmitystä ei kannata ohjata vain absoluuttisella hintarajalla, koska se saattaisi kalliina päivänä estyä kokonaan.</li></ul> |
| `binary_sensor.kilowahti_{name}_rank_acceptable` | <ul><li>`Päällä` (`on`) silloin kun pelkän energian hinnan **sijaluku on pienempi tai yhtä suuri** kuin asettamasi kynnysarvo.</li></ul> |
| `number.kilowahti_{name}_rank_threshold` | <ul><li>**Asettaa edellisen kynnysarvon.**</li><li>Arvoa voi säätää joustavasti kojelaudalta tai automaatiosta avaamatta Kilowahdin asetuksia, muuttuu myös asetuksia muokkaamalla.</li></ul> |
| `binary_sensor.kilowahti_{name}_tomorrow_available` | <ul><li>`Päällä` (`on`) silloin kun **huomisen hinnat ovat saatavilla**, yleensä iltapäivällä.</li></ul> |

Näiden lisäksi kaikki alla oleva on käytettävissä, jos sitä tarvitset. Kilowahti tarjoaa useita antureita joista osalla saa toteutettua aivan saman asian hieman eri lähestymistavalla ja alunperin eri tarkoitukseen, tämä tarkoittaa laajempia mahdollisuuksia käyttäjälle - Kilowahdin tarkoitus on olla mahdollisimman joustava ratkaisu erilaisiin tarpeisiin sähkön hintojen ja kulutuksen optimoinnin ympärillä.

Jotkin alla olevista ryhmistä ovat olemassa vain, kun otat ne käyttöön: myynti- ja aurinkoanturit edellyttävät, että **tuotanto** on otettu käyttöön lisäasetuksissa, akkuanturit edellyttävät edellisen lisäksi akun kapasiteetin asettamista, ja laajemmat liukuvat keskiarvot saa kytkettyä päälle niin halutessaan kun valittu hintaresoluutio on 15 minuuttia.

Onko Kilowahti sinulle täysin uusi tuttavuus? [Aloitusopas](getting-started.md) käy integraation käyttöönoton läpi vaiheittain alusta loppuun.

## Anturit

### Hinta-anturit

Kaikki hinta-anturit käyttävät asetuksissa valitsemaasi näyttöyksikköä, eli näyttövaluuttasi pienempää tai suurempaa yksikköä, esim. `c/kWh` tai `€/kWh`, `öre/kWh` tai `kr/kWh`.

| Entiteetti | Kuvaus |
|---|---|
| `sensor.kilowahti_{name}_spot_price` | <ul><li>Nykyisen aikajakson verollinen spot-hinta</li><li>Attribuutit: `price_source` sekä `today_prices`/`tomorrow_prices`, kun hintataulukot on otettu käyttöön</li></ul> |
| `sensor.kilowahti_{name}_active_price` | <ul><li>Näkyy nimellä **Toteutuva hinta**. Maksamasi energian hinta: spot-hinta tai sopimushinta, kun kiinteä hintajakso on voimassa</li><li>Attribuutit: `source` (`spot`/`fixed`), `period_label`</li></ul> |
| `sensor.kilowahti_{name}_transfer_price` | <ul><li>Voimassa oleva siirtohinta, tuntematon ennen kuin siirtohintoja on määritetty</li><li>Attribuutit: `tariff` (aktiivinen ryhmä ja taso, esim. "Kausisiirto, Muu aika") sekä erikseen `group` (ryhmä) ja `tier` (taso)</li></ul> |
| `sensor.kilowahti_{name}_total_price` | <ul><li>Kokonaishinta, eli energian toteutuva hinta + siirtohinta</li><li>Attribuutit: `today_prices`/`tomorrow_prices`, kun kokonaishintataulukot on otettu käyttöön lisäasetuksissa</li></ul> |
| `sensor.kilowahti_{name}_today_spot_average` | <ul><li>Tämän päivän spot-hinnan keskiarvo</li></ul> |
| `sensor.kilowahti_{name}_today_spot_minimum` | <ul><li>Tämän päivän matalin spot-hinta</li></ul> |
| `sensor.kilowahti_{name}_today_spot_maximum` | <ul><li>Tämän päivän korkein spot-hinta</li></ul> |
| `sensor.kilowahti_{name}_today_total_average` | <ul><li>Tämän päivän kokonaishinnan keskiarvo (spot + siirto)</li></ul> |
| `sensor.kilowahti_{name}_today_total_minimum` | <ul><li>Tämän päivän matalin kokonaishinta</li></ul> |
| `sensor.kilowahti_{name}_today_total_maximum` | <ul><li>Tämän päivän korkein kokonaishinta</li></ul> |
| `sensor.kilowahti_{name}_tomorrow_spot_average` | <ul><li>Huomisen spot-hinnan keskiarvo, ei saatavissa ennen kuin huomisen hinnat on haettu</li></ul> |
| `sensor.kilowahti_{name}_tomorrow_spot_minimum` | <ul><li>Huomisen matalin spot-hinta; Ei saatavissa ennen kuin huomisen hinnat on haettu</li></ul> |
| `sensor.kilowahti_{name}_tomorrow_spot_maximum` | <ul><li>Huomisen korkein spot-hinta; Ei saatavissa ennen kuin huomisen hinnat on haettu</li></ul> |
| `sensor.kilowahti_{name}_tomorrow_total_average` | <ul><li>Huomisen kokonaishinnan keskiarvo; Ei saatavissa ennen kuin huomisen hinnat on haettu (tai kiinteä hintajakso, jos sellainen on voimassa huomenna)</li></ul> |
| `sensor.kilowahti_{name}_tomorrow_total_minimum` | <ul><li>Huomisen alin kokonaishinta</li></ul> |
| `sensor.kilowahti_{name}_tomorrow_total_maximum` | <ul><li>Huomisen korkein kokonaishinta</li></ul> |
| `sensor.kilowahti_{name}_next_hours_average` | <ul><li>Spot-hinnan keskiarvo seuraavien N tunnin ajalta (määritettävissä)</li></ul> |
| `sensor.kilowahti_{name}_monthly_fixed_cost_today` | <ul><li>Tämän päivän osuus sopimuksen kiinteästä kuukausimaksusta päivää kohden näyttövaluutassasi, ei saatavissa, jos kuukausimaksua ei ole määritetty</li></ul> |

Pörssihinnat haetaan joka päivä ja anturit päivittyvät hintajaksojen vaihtuessa vaikka käytössä olisikin kiinteä hintajakso. Kiinteän hintajakson voimassaolosta kertoo binäärianturi `fixed_price_period_active`, katso alempaa kohta [Binäärianturit](#binaarianturit).

### Sijalukuanturit

| Entiteetti | Kuvaus |
|---|---|
| `sensor.kilowahti_{name}_price_rank` | <ul><li>Nykyisen aikajakson sijaluku toteutuvan energiahinnan mukaan (kiinteän hintajakson hinta, kun sellainen on voimassa, muuten spot-hinta), ei sisällä siirtohintaa.</li><li>Normalisoitu: 1 = halvin, päivän hintajaksojen lukumäärä (slots_per_day) = kallein. Lue tarkemmin taulukon alta.</li></ul> |
| `sensor.kilowahti_{name}_total_price_rank` | <ul><li>Sama, mutta siirto sisältyy hintaan</li></ul> |
| `sensor.kilowahti_{name}_price_quartile` | <ul><li>Energiahinnan kvartiili 1–4 (johdettu `price_rank`-arvosta): 1&nbsp;=&nbsp;halvimmat 25&nbsp;% aikajaksoista päivän aikana</li></ul> |
| `sensor.kilowahti_{name}_total_price_quartile` | <ul><li>Kokonaishinnan kvartiili 1–4 (johdettu `total_price_rank`-arvosta): 1&nbsp;=&nbsp;halvimmat 25&nbsp;% aikajaksoista päivän aikana</li></ul> |

!!! note "Korkein mahdollinen sijaluku riippuu hintaresoluutiosta"
    Suurin sijaluku 15 minuutin resoluutiolla on **96**, ja tunnin resoluutiolla **24**.

Sijaluvut on normalisoitu hintatasoittain: samanhintaiset aikajaksot jakavat saman sijaluvun, ja päivän halvin hinta on aina 1 ja kallein on aina korkein mahdollinen sijaluku. Esimerkiksi jos varttimittausta käytettäessä koko päivän 96 jaksolla olisi vain kaksi eri hintaa, niistä halvempi saa sijaluvukseen&nbsp;1 ja kalliimpi&nbsp;96.

[Kiinteän hintajakson](fixed-periods.md) aikana jokainen aikajakso maksaa saman verran, joten pelkän energian `price_rank` on 1 koko päivän, koska päivän aikana ei ole odotettavissa sitä kalliimpaa jaksoa. Energian kiinteästä hintajaksosta huolimatta kokonaishinnan sijaluku `total_price_rank` saattaa kuitenkin vaihdella, jos siirtohinnat on määritelty ja päivän aikana aktiivisia eri siirtohintoja on enemmän kuin yksi.

### Ohjauskerroinanturit

Kaikilla kolmella kertoimella on sama asteikko: **1,0 = halvin, 0,0 = kallein**, ja kuhunkin sovelletaan määritettyä muotoa (lineaarinen/sinimuotoinen) ja skaalausta. Jokaisesta on bipolaarinen versio joka sijoittaa saman arvon välille −1…+1.

| Entiteetti | Vaihteluväli | Kuvaus |
|---|---|---|
| `sensor.kilowahti_{name}_control_factor_price` | 0–1 | Perustuu `price_rank`-arvoon: energian hinta ilman siirtoa. |
| `sensor.kilowahti_{name}_control_factor_price_bipolar` | −1…+1 | Yllä olevan bipolaarinen versio. |
| `sensor.kilowahti_{name}_control_factor_total` | 0–1 | Perustuu `total_price_rank`-arvoon: energia ja siirto yhdessä. |
| `sensor.kilowahti_{name}_control_factor_total_bipolar` | −1…+1 | Yllä olevan bipolaarinen versio. |
| `sensor.kilowahti_{name}_control_factor_transfer` | 0–1 | Perustuu siirtohinnan sijalukuun koko päivän siirtohintojen joukossa. Tuntematon ennen kuin siirtohintoja on määritetty. |
| `sensor.kilowahti_{name}_control_factor_transfer_bipolar` | −1…+1 | Yllä olevan bipolaarinen versio. Tuntematon ennen kuin siirtohintoja on määritetty. |

Siirron ohjauskerroin määräytyy päivän eri siirtohintojen (tyypillisesti korkeintaan kahden tai kolmen) joukossa, joten se muuttuu suuremmin askelin kuin hinnan ja kokonaishinnan kertoimet, jotka määräytyvät kaikkien aikajaksojen joukossa.

Siirtohinnan ryhmä, jossa on vain yksi sääntö, tai energian hinnan osalta kokonaan kiinteän hintajakson sisällä vietetty päivä antaa kyseiselle anturille vakioarvon 1 – minkään hintajakson suosimiseen tai välttämiseen ei ole syytä.

### Optimointianturit

Yksi anturipari kutakin määritettyä pisteprofiilia kohden, jossa `{profile}` on profiilin nimi (sisäänrakennetun profiilin nimi on `total` eli yhteissumma):

| Entiteetti | Kuvaus |
|---|---|
| `sensor.kilowahti_{name}_score_{profile}_daily` | <ul><li>Kuluvan päivän senhetkinen optimointipistemäärä (0–100).</li><li>Attribuutti: `previous` (eilinen valmis pistemäärä)</li></ul> |
| `sensor.kilowahti_{name}_score_{profile}_monthly` | <ul><li>Kuluvan kalenterikuukauden valmiiden päiväpistemäärien keskiarvo (0–100).</li><li>Attribuutti: `previous` (edellisen kuukauden lopullinen pistemäärä)</li></ul> |

Katso sivua [Optimointipisteet](scores.md) nähdäksesi tarkemmin kuinka pisteet lasketaan.

### Diagnostiikka-anturit

Useimmat diagnostiikka-anturit ovat oletuksena pois käytöstä. Jos haluat nähdä tarkemmin miksi tai miten Kilowahti toimii kullakin hetkellä, ota näitä antureita tarvittaessa käyttöön yksitellen entiteettirekisterissä.

| Entiteetti | Kuvaus |
|---|---|
| `sensor.kilowahti_{name}_setting_price_threshold` | Määritetty hintaraja (sama yksikkö kuin hinta-antureilla) |
| `sensor.kilowahti_{name}_setting_rank_threshold` | Määritetty hyväksyttävän sijaluvun raja |
| `sensor.kilowahti_{name}_setting_price_threshold_includes_transfer` | Sisältyykö siirtohinta hintarajan vertailuun |
| `sensor.kilowahti_{name}_setting_control_factor_shape` | Ohjauskertoimen muoto (`linear` tai `sinusoidal`) |
| `sensor.kilowahti_{name}_setting_forward_window` | Ennakkokeskiarvon ikkunan pituus (tunteina) |
| `sensor.kilowahti_{name}_setting_active_transfer_group` | Tällä hetkellä aktiivisen siirtohinnan ryhmän nimi (esim. Kausisiirto), tai Ei saatavissa |
| `sensor.kilowahti_{name}_setting_active_transfer_tier` | Tällä hetkellä aktiivisen siirtohinnan tason nimi (esim. Talviarkipäivä), tai Ei saatavissa |
| `sensor.kilowahti_{name}_setting_active_fixed_period` | Tällä hetkellä aktiivisen kiinteän hintajakson nimi, tai Ei saatavissa |
| `sensor.kilowahti_{name}_price_data_source` | Käytössä oleva hintalähde: `kilowahti_cdn` tai `spot_hinta` (oletuksena käytössä) |
| `sensor.kilowahti_{name}_exchange_rate` | Käytössä oleva päivittäinen vaihtokurssi EUR → paikallinen valuutta; olemassa vain, kun näyttövaluutaksi on valittu paikallinen valuutta (oletuksena käytössä) |

Lisäksi yksi diagnostiikka-anturi kutakin optimointiprofiilia kohden:

| Entiteetti | Kuvaus |
|---|---|
| `sensor.kilowahti_{name}_score_{profile}_formula` | Profiilissa käytössä oleva pisteytyskaava: `default` (oletus) tai `raw` (neutraali) |

## Numeroentiteetit

Numeroentiteetit ovat kirjoitettavissa olevia asetuksia, joita voi säätää kojelaudalta tai automaatioista `number.set_value`-palvelulla. Muutokset tulevat voimaan heti, eikä uudelleenkäynnistystä tai uudelleenmääritystä tarvita.

| Entiteetti | Vaihteluväli | Kuvaus |
|---|---|---|
| `number.kilowahti_{name}_price_threshold` | 0–500 pienemmässä yksikössä (0–5 suuremmassa) | Hinta, jossa tai jonka alapuolella `price_acceptable` kytkeytyy päälle. Asetuksen yksikkö on sama kuin valitsemasi näyttöyksikkö. |
| `number.kilowahti_{name}_rank_threshold` | 1–96 (tai 1–24) | Sijaluku, jossa tai jonka alapuolella `rank_acceptable` kytkeytyy päälle. Yläraja riippuu valitusta hintaresoluutiosta. |

Alkuarvot tulevat **Kynnysarvot ja ohjaus** -asetuksista. Näiden entiteettien kautta tehdyt muutokset tallennetaan integraation asetuksiin, joten ne säilyvät uudelleenkäynnistysten yli ja päivittävät myös asetusnäkymässä näkyvät arvot.

### Liukuvan keskiarvon anturit

**Käytettävissä vain 15 minuutin hintaresoluutiolla.**

Ota käyttöön valinnalla **Näytä seuraavan 30 min, 1h ja 2h keskihinnat** kohdassa **Määrittele → Lisäasetukset**.

| Entiteetti | Kuvaus |
|---|---|
| `sensor.kilowahti_{name}_average_price_30min` | Nykyisen aikajakson ja sitä seuraavien 30 minuutin kokonaishinnan keskiarvo |
| `sensor.kilowahti_{name}_average_price_60min` | Nykyisen aikajakson ja sitä seuraavien 60 minuutin kokonaishinnan keskiarvo |
| `sensor.kilowahti_{name}_average_price_120min` | Nykyisen aikajakson ja sitä seuraavien 120 minuutin kokonaishinnan keskiarvo |

Huomaa että keskiarvojen laskennassa käytetään kokonaishintaa (energia + siirto). Ellei siirtohintoja ole asetettu, keskiarvo vastaa pelkkää energian hinnan keskiarvoa.

### Tuotanto- ja myyntianturit

Tämän osion anturit ovat käytettävissä silloin, kun **Ota tuotanto- ja myyntiominaisuudet käyttöön** on valittu kohdassa **Määrittele → Lisäasetukset**.

| Entiteetti | Kuvaus |
|---|---|
| `sensor.kilowahti_{name}_export_price` | Nykyisen aikajakson myyntihinta verkkoon syötetylle sähkölle (ei ALV:tä) |
| `sensor.kilowahti_{name}_export_today_average` | Tämän päivän myyntihinnan keskiarvo |
| `sensor.kilowahti_{name}_export_today_minimum` | Tämän päivän alin myyntihinta |
| `sensor.kilowahti_{name}_export_today_maximum` | Tämän päivän korkein myyntihinta |
| `sensor.kilowahti_{name}_export_tomorrow_average` | Huomisen myyntihinnan keskiarvo; Ei saatavissa ennen kuin hinnat on haettu |
| `sensor.kilowahti_{name}_export_tomorrow_minimum` | Huomisen alin myyntihinta |
| `sensor.kilowahti_{name}_export_tomorrow_maximum` | Huomisen korkein myyntihinta |
| `sensor.kilowahti_{name}_import_export_spread` | Nykyisen ostohinnan (kokonaishinta) ja myyntihinnan erotus |
| `sensor.kilowahti_{name}_self_consumption_value` | Jokaisen omasta tuotannosta kulutetun kilowattitunnin arvo (= vältetty ostokustannus) |
| `sensor.kilowahti_{name}_next_solar_window_average` | Seuraavan tulevan aurinkotuotantoikkunan myyntihinnan keskiarvo |
| `sensor.kilowahti_{name}_arbitrage_spread_today` | Tämän päivän halvimman ja kalleimman kokonaishintaisen aikajakson välinen ero |

### Akkuanturit

Tämän osion anturit ovat käytettävissä silloin, kun **Ota tuotanto- ja myyntiominaisuudet käyttöön** on valittu kohdassa **Määrittele → Lisäasetukset** ja lisäksi kohdassa **Määrittele → Tuotanto ja myynti** on asetettu **akun kapasiteetti > 0 kWh**.

| Entiteetti | Kuvaus |
|---|---|
| `sensor.kilowahti_{name}_charge_opportunity_factor` | Kuinka hyvä hetki nyt on ladata verkosta (0,0 = huonoin, 1,0 = paras). Käyttää aina lineaarista skaalausta – ohjauskertoimen käyrä tai skaalausasetukset eivät vaikuta siihen |
| `sensor.kilowahti_{name}_battery_charge_recommendation` | Luokitteleva suositus: `charge_from_grid`, `discharge` tai `hold` |
| `sensor.kilowahti_{name}_optimal_charge_window_start` | Halvimman ikkunan alku akun täydelle latausjaksolle |
| `sensor.kilowahti_{name}_optimal_charge_window_end` | Halvimman ikkunan loppu akun täydelle latausjaksolle |

## Binäärianturit

Kaikilla näistä antureista lukuun ottamatta `price_or_rank_acceptable`-anturia on vastineensa [laukaisimina ja ehtoina](triggers-conditions.md), joiden avulla automaatio saattaa olla helpompi rakentaa.

| Entiteetti | Kuvaus |
|---|---|
| `binary_sensor.kilowahti_{name}_price_acceptable` | `Päällä` (`on`) silloin kun nykyinen hinta on määritetyssä raja-arvossa tai sen alle |
| `binary_sensor.kilowahti_{name}_rank_acceptable` | `Päällä` (`on`) silloin kun nykyinen sijaluku on määritetyssä raja-arvossa tai sen alle |
| `binary_sensor.kilowahti_{name}_price_or_rank_acceptable` | `Päällä` (`on`) silloin kun **joko hinta- tai sijalukuehto** täyttyy |
| `binary_sensor.kilowahti_{name}_fixed_price_period_active` | `Päällä` (`on`) silloin kun kiinteä hintajakso on voimassa |
| `binary_sensor.kilowahti_{name}_tomorrow_available` | `Päällä` (`on`) silloin kun huomisen hinnat on saatavilla |

Seuraavat binäärianturit ovat käytettävissä, kun **tuotanto on otettu käyttöön**:

| Entiteetti | Kuvaus |
|---|---|
| `binary_sensor.kilowahti_{name}_export_price_acceptable` | Päällä, kun nykyinen myyntihinta on määritetyssä myyntihinnan kynnysarvossa tai sen yläpuolella |

Seuraavat ovat käytettävissä, kun **tuotanto on otettu käyttöön** ja **akun kapasiteetti > 0 kWh**:

| Entiteetti | Kuvaus |
|---|---|
| `binary_sensor.kilowahti_{name}_charge_from_grid_recommended` | Päällä, kun nykyinen aikajakso on halpa ja päivän mittaan on tulossa kalliimpia aikajaksoja |
| `binary_sensor.kilowahti_{name}_discharge_to_grid_recommended` | Päällä, kun nykyinen myyntihinta on päivän ylimmässä kvartiilissa |
