# Ensimmäinen käyttöönotto

Tämä sivu käy läpi ensimmäisen käyttöönoton alusta loppuun: asennus, ohjatun asennuksen kysymykset, hintojen saapumisen tarkistus ja yksi automaatio. Käyttöönottoon menee noin kymmenen minuuttia, ja kaikki valinnaiset ominaisuudet ohitetaan. Voit helposti lisätä toiminnallisuuksia myöhemmin muokkaamalla asetuksia.

Jos haluat mieluummin tehdä asetukset itse ilman tämän sivun ohjeita, voit tutustua kaikkiin asetuksiin [Asetukset](configuration.md)-sivulla.

## Ennen kuin aloitat

Sinun tarvitsee tietää kaksi asiaa:

- **Hinta-alueesi.** Jos asennat Kilowahtia Suomessa, tämä on helppoa: Suomessa on vain yksi hinta-alue ja voit siirtyä suoraan seuraavaan kohtaan. Useissa muissa maissa se on alue, jonka mukaan sähkösi laskutetaan, ei pelkkä maa: esimerkiksi Ruotsissa alueita on neljä, Norjassa viisi ja Italiassa seitsemän. Kaikki alueet on lueteltu [tuettujen alueiden](supported-regions.md) sivulla. Ellet ole varma, alue mainitaan yleensä esimerkiksi sähkölaskussa tai sähkönmyyjän sivuilla.
- **Millainen sähkösopimuksesi on (pörssisähkö tai kiinteä hinta).** Kilowahti toimii kummankin kanssa. Aloita kuitenkin ensin alla olevalla spot-hinnan asetuksella, kiinteähintainen sopimus hoidetaan lisäämällä jälkikäteen [kiinteähintainen jakso](fixed-periods.md). (Vaikka kiinteä sopimus olisi voimassa toistaiseksi, Kilowahdissa se on silti "jakso".)

Et tarvitse API-avainta, käyttäjätiliä etkä muita integraatioita. Kilowahti syntyi osittain muun muassa siksi, että olemassa olevat integraatiot takkuilivat siirtymässä varttihinnoitteluun. Hinnat haetaan Kilowahtiin automaattisesti ja ne päivittyvät järjestelmääsi yleensä minuutissa-parissa niiden euroopanlaajuisen julkaisun jälkeen.

## 1. Asenna

Seuraa [Asennus](installation.md)-ohjetta.

Lyhyesti riippuen Home Assistantin versiosta:

- Home Assistant versio 2026.11 ja uudemmat:  
**Asetukset → Markkinapaikka** → hae **Kilowahti** → Asenna.
- Home Assistantin vanhemmissa versioissa:  
**HACS** → hae **Kilowahti** → Lataa → uudelleenkäynnistä Home Assistant.

## 2. Käy ohjattu asennus läpi

Ennen Home Assistantin versiota 2026.11 ohjattu asennus pitää käynnistää manuaalisesti: **Asetukset → Laitteet & palvelut → Lisää integraatio → Kilowahti**

Ohjatussa asennuksessa on kuusi vaihetta, tai seitsemän, jos alueesi laskuttaa paikallisessa valuutassa. Ensimmäisellä kerralla sinun tarvitsee päättää vain näistä:

| Vaihe | Mitä tehdä ensimmäisellä kerralla |
|---|---|
| **Perusasetukset** | <ul><li>Anna lyhyt nimi (esim. `Home` tai `Koti`) — valitusta nimestä tulee osa jokaista entiteettitunnusta.</li><li>Valitse hinta-alue.</li><li>Jätä resoluutioksi 15 minuuttia, ellei sopimuksesi käytä edelleenkin tuntipohjaista laskutusta.</li></ul> |
| **Valuutta** | <ul><li>**Tämä vaihe näytetään ainoastaan euroalueen ulkopuolella.**</li><li>Valitse paikallinen valuuttasi ja jätä vaihtokurssi automaattiseksi.</li></ul> |
| **ALV ja sähkövero** | <ul><li>Verot on esitäytetty valitun hinta-alueen perusteella eikä niitä normaalisti tarvitse muokata tässä vaiheessa.</li><li>Pörssisähkösopimuksessa määritelty marginaali syötetään kenttään **Marginaali**.</li></ul> |
| **Siirtohinnat** | <ul><li>**Ohita tässä vaiheessa.**</li><li>Siirtohinnat voi lisätä myöhemmin, perustoiminnallisuus ei kärsi vaikka siirtohintoja ei ole asetettu.</li></ul> |
| **Kynnysarvot ja ohjaus** | <ul><li>Hyväksy oletusarvot tässä vaiheessa.</li></ul> |
| **Optimointipisteet** | <ul><li>**Ohita tässä vaiheessa.**</li><li>`Total`-profiili luodaan automaattisesti ja mahdollisen mittauksen voi liittää siihen myöhemmin.</li></ul> |
| **Lisäasetukset** | <ul><li>Jätä kaikki pois päältä.</li></ul> |

Siinäpä se, Kilowahdin entiteetit ilmestyvät asennuksen jälkeen heti käyttöösi.

!!! tip "Oletuskynnysarvoista"
    Kilowahdin käyttämät oletusarvot on tarkoitettu lähtökohdaksi omille asetuksille, ne eivät ole varsinainen suositus. Oletuksena hintarajana on 20 c/kWh ja sijalukuraja 24. Varttihinnoittelussa sijalukuraja 24 tarkoittaa ”päivän 96 hintajaksosta 24 halvinta”, eli yhteensä vuorokauden kuutta halvinta tuntia (24 * 15 min = 360 min = 6 h). Molempia voi säätää myöhemmin kojelaudalta, katso [vaihe 5](#5-saada-kynnysarvoja-myohemmin).

## 3. Tarkista, että kaikki toimii

Siirry kohtaan **Asetukset → Laitteet & palvelut → Kilowahti** ja avaa integraation luoma esiintymä asettamasi nimen alta (esim. `Kilowahti Home` tai `Kilowahti Koti`). Kaikki Kilowahdin entiteetit löytyvät sieltä. Etsi nämä:

| Entiteetti | Mitä sinun pitäisi nähdä |
|---|---|
| `sensor.kilowahti_{name}_spot_price` | Tämänhetkinen markkinahinta |
| `sensor.kilowahti_{name}_total_price` | Mitä todellisuudessa maksat kilowattitunnilta, ALV ja verkkomaksut mukaan lukien |
| `sensor.kilowahti_{name}_price_rank` | Monenneksi halvin tämä hintajakso on tämän päivän hinnoissa — 1 on päivän halvin |
| `binary_sensor.kilowahti_{name}_rank_acceptable` | `on`, kun nykyisen hintajakson sijaluku on sijalukurajassa tai sen alle |
| `sensor.kilowahti_{name}_price_data_source` | Mitä hintalähdettä käytetään |

Korvaa `{name}` antamallasi nimellä pienillä kirjaimilla, esim. `sensor.kilowahti_koti_price_data_source`.

**Huomisen hinnat eivät välttämättä ole vielä näkyvissä, se on normaalia.**

Eurooppalainen pörssisähkömarkkina julkaisee hinnat alkuiltapäivällä, mutta tarkka aika vaihtelee. Kilowahti alkaa hakea hintoja klo 13:00 Keski-Euroopan aikaa (klo 14:00 Suomen aikaa) ja saa ne omasta sisällönjakeluverkostaan (CDN) hyvin pienellä viiveellä julkaisun jälkeen. Kunnes päivitetyt hinnat on saatu, jokainen `tomorrow_*`-anturi näyttää tilan *Tuntematon*.

## 4. Tee ensimmäinen automaatio

Esimerkki helposta ja yksinkertaisesta automaatiosta: Kun hinta on kuluvan vuorokauden matalimpia, sytytä älyvalo, lämmitä vettä, lataa autoa, tai käynnistä astianpesukone.

1. **Asetukset → Automaatiot & tilanteet → Lisää automaatio → Luo uusi automaatio**
2. **Laukaisuehto** → hae `sijaluku` → valitse **Sijaluku muuttui hyväksyttäväksi**
3. **Lisää toiminto** → tässä valitse mikä tahansa toiminto, jonka haluat kytkeä päälle
4. Tallenna

Automaatiosi on valmis. Se suoritetaan aina, kun hintajakso vaihtuu (15 min tai 60 min välein) ja alkanut jakso osuu päivän halvimpaan osaan sijalukurajan määrittämällä tavalla.

Jos haluat automaattisesti kytkeä laitteen taas pois päältä, voit tehdä toisen automaation laukaisimella **Sijaluku ei ole enää hyväksyttävä**.

[Laukaisimet ja ehdot](triggers-conditions.md) luettelee kaikki laukaisimet ja ehdot, joilla automaation voi laukaista. Jos pelkät laukaisimet eivät riitä tarpeisiisi, [Automaatioesimerkit](automations.md) esittelee monipuolisempia toteutuksia.

## 5. Säädä kynnysarvoja myöhemmin

Ohjattua asennusta ei tarvitse avata uudelleen, kun haluat muuttaa automaatioidesi herkkyyttä. Niitä ohjaa kaksi entiteettiä, ja molemmat voi lisätä muokattavaksi kojelaudalle:

- `number.kilowahti_{name}_price_threshold`
- `number.kilowahti_{name}_rank_threshold`

Kun säädät näiden arvoja, kaikki niihin perustuvat binäärianturit, laukaisimet ja ehdot seuraavat heti perässä.

Pieni kojelautakortti, jossa olennaiset näkyvät yhdessä:

```yaml
type: entities
title: Sähkö
entities:
  - entity: sensor.kilowahti_{name}_total_price
  - entity: sensor.kilowahti_{name}_price_rank
  - entity: binary_sensor.kilowahti_{name}_rank_acceptable
  - entity: number.kilowahti_{name}_rank_threshold
```

## Mitä seuraavaksi

Kun tarpeesi kasvavat, tutustu näihin. Järjestyksellä ei ole merkitystä, mikään ei riipu muista:

- **[Siirtohinnat](transfer-pricing.md)**  
Syötä Kilowahtiin verkkoyhtiösi siirtohinnasto, niin `total_price` vastaa todellista kustannustasi. Kannattaa tehdä; verkkomaksut ovat usein kolmannes laskusta.
- **[Kiinteähintaiset jaksot](fixed-periods.md)**  
Jos sinulla on kiinteähintainen sähkösopimus tai pörssisähkön kiinnitys, kerro Kilowahdille sen hinta ja voimassaoloaika. Hinta-anturit vaihtavat noiksi päiviksi sopimushintaasi.
- **[Optimointipisteet](scores.md)**  
Osoita Kilowahdille kaikkea kulutusta mittaavan energiamittarin (esim. uuden sähkömittarin HAN-liitäntään kytketty HomeWizard P1 tai vastaava, tai vaikkapa sähköasentajan asentama Shelly) entiteetti Home Assistantissa, ja saat päivittäin/kuukausittain pistetuloksen 0–100, joka kertoo kuinka hyvin kulutuksesi kohdistui halpoihin tunteihin.
- **[Entiteetit](entities.md)**  
Täysi luettelo Kilowahdin entiteeteistä, mukaan lukien myynti-, akku- ja aurinkoanturit, jotka ilmestyvät, kun toiminnallisuus on otettu käyttöön Lisäasetuksista.
- **[Usein kysytyt kysymykset (UKK)](faq.md)**  
Vastauksia mieltä askarruttaviin kysymyksiin, kuten miksi huomisen hinnat puuttuvat, miksi hintasi poikkeavat sähkölasku(i)stasi, mihin ohjauskerrointa käytetään, ja moneen muuhun.
