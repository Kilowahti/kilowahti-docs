---
title: "Entiteetit"
---

Kaikki entiteetit on koottu yhden **Kilowahti**-laitteen alle kutakin määritettyä esiintymää kohden. Entiteettien nimissä käytetään asennuksen aikana antamaasi nimeä (esim. `Home` tai `Koti`).

## Aloita näistä

Tämä sivu on Kilowahdin kattava hakuteos, etkä luultavasti koskaan tarvitse suurta osaa siitä. Tyypillisessä peruskokoonpanossa pärjää hyvin pitkälle vain viidellä entiteetillä:

Jokainen entiteetti on listattu nimellä, jonka Home Assistant näyttää (järjestelmäkielellä), ja sen alla on kiinteä entiteettitunnus. Home Assistant näyttää usein vain nimen, joten etsi entiteettiä nimellä kohdasta **Asetukset → Laitteet & palvelut → Kilowahti**; tunnus näkyy entiteetin asetuksissa.

| Entiteetti | Mihin sitä käytetään |
|---|---|
| **Kokonaishinta**<br>`sensor.kilowahti_{name}_total_price` | <ul><li>**Mitä kilowattitunti maksaa sinulle juuri nyt, kaikki kulut mukaan lukien.**</li><li>Tämä luku on hyödyllinen esimerkiksi kojelaudan kortissa käyttäjille näytettynä.</li></ul> |
| **Toteutuvan hinnan sijaluku**<br>`sensor.kilowahti_{name}_price_rank` | <ul><li>**Mihin kohtaan nykyinen aikajakso sijoittuu energian hinnan osalta koko päivän hinnoissa, pienempi on parempi: 1 = halvin.**</li><li>Tästä luvusta on eniten hyötyä automaatioissa: esimerkiksi lämmitystä ei kannata ohjata vain absoluuttisella hintarajalla, koska se saattaisi kalliina päivänä estyä kokonaan.</li></ul> |
| **Sijaluku on hyväksyttävä**<br>`binary_sensor.kilowahti_{name}_rank_acceptable` | `Päällä` (`on`) silloin kun pelkän energian hinnan **sijaluku on pienempi tai yhtä suuri** kuin asettamasi kynnysarvo. |
| **Sijalukuraja**<br>`number.kilowahti_{name}_rank_threshold` | <ul><li>**Asettaa edellisen kynnysarvon.**</li><li>Arvoa voi säätää joustavasti kojelaudalta tai automaatiosta avaamatta Kilowahdin asetuksia, muuttuu myös asetuksia muokkaamalla.</li></ul> |
| **Huomisen hinnat saatavilla**<br>`binary_sensor.kilowahti_{name}_tomorrow_available` | `Päällä` (`on`) silloin kun **huomisen hinnat ovat saatavilla**, yleensä iltapäivällä. |

Näiden lisäksi kaikki alla oleva on käytettävissä, jos sitä tarvitset. Kilowahti tarjoaa useita antureita joista osalla saa toteutettua aivan saman asian hieman eri lähestymistavalla ja alunperin eri tarkoitukseen, tämä tarkoittaa laajempia mahdollisuuksia käyttäjälle - Kilowahdin tarkoitus on olla mahdollisimman joustava ratkaisu erilaisiin tarpeisiin sähkön hintojen ja kulutuksen optimoinnin ympärillä.

Jotkin alla olevista ryhmistä ovat olemassa vain, kun otat ne käyttöön: myynti- ja aurinkoanturit edellyttävät, että **tuotanto** on otettu käyttöön lisäasetuksissa, akkuanturit edellyttävät edellisen lisäksi akun kapasiteetin asettamista, ja laajemmat liukuvat keskiarvot saa kytkettyä päälle niin halutessaan kun valittu hintaresoluutio on 15 minuuttia.

Onko Kilowahti sinulle täysin uusi tuttavuus? [Aloitusopas](/fi/getting-started/) käy integraation käyttöönoton läpi vaiheittain alusta loppuun.

## Entiteettiryhmät

Muut entiteetit on jaettu käyttötarkoituksen mukaan:

- [Hinta-, sijaluku- ja ohjauskerroinanturit](/fi/entities/price-and-rank/): nykyiset ja päivän hinnat, sijaluvut ja ohjauskerroinanturit
- [Binäärianturit](/fi/entities/binary-sensors/): päällä/pois-tilat
- [Optimointi- ja diagnostiikka-anturit](/fi/entities/optimization-and-diagnostics/): pisteytysanturit ja integraation diagnostiikka
- [Liukuvan keskiarvon, tuotanto- ja akkuanturit](/fi/entities/optional-sensors/): valinnaiset anturit, jotka ovat olemassa vain kun ominaisuus on käytössä
- [Numeroentiteetit](/fi/entities/number-entities/): kirjoitettavat hinta- ja sijalukurajat

## Entiteettien tunnukset omassa järjestelmässäsi

Versiosta `2026.11.0` alkaen Kilowahti määrittää omien entiteettiensä tunnukset kiinteästi, joten ne ovat samat jokaisessa asennuksessa käyttöliittymän kielestä riippumatta. Vain näytettävät nimet käännetään. Nimet seuraavat Home Assistantin järjestelmäkieltä (**Asetukset → Järjestelmä → Yleiset → Kieli**), eivät käyttäjäprofiilissa valittua kieltä, ja ne muodostetaan integraation latautuessa, joten järjestelmäkielen vaihtamisen jälkeen lataa Kilowahti-integraatio uudelleen (**Asetukset → Laitteet & palvelut → Kilowahti → ⋮ → Lataa uudelleen**) tai uudelleenkäynnistä Home Assistant.

**Ennen** versiota `2026.11.0` luoduissa asennuksissa säilyvät tunnukset, jotka Home Assistant tuolloin muodosti käännetystä näyttönimestä. Useimmat ovat samoja, mutta muutama poikkeaa: `price_rank` oli `rank`, `tomorrow_available` oli `tomorrow_s_prices_available`, `setting_*`-diagnostiikka-antureilla ei ollut etuliitettä, ja suomen- tai saksankielinen asennus sai suomen- tai saksankieliset tunnukset kauttaaltaan.

Päivityksen jälkeen kohdassa **Asetukset → Järjestelmä → Korjaukset** on korjaus, joka tarjoutuu nimeämään tunnukset uudelleen kiinteisiin tunnuksiin. Mitään ei muuteta ennen kuin vahvistat. Vahvistusnäkymä luettelee automaatiot, skriptit, tilanteet ja ryhmät, jotka käyttävät entiteettejä (kojelautoja ja malleja ei tarkisteta). Itse muuttamiisi tunnuksiin ei kosketa, ja kaikkien tunnusten historia säilyy. Mahdolliset viittaukset vanhoihin tunnuksiin esim. automaatioissa tai kojelaudan korteissa on päivitettävä jälkikäteen käsin. Jos ohitat korjauksen, näet todelliset tunnuksesi kohdasta **Asetukset → Laitteet & palvelut → Kilowahti**.
