# Laukaisimet ja ehdot

Kilowahdissa on omat laukaisimet ja ehdot automaatioille. Ne näkyvät Home Assistantin automaatioeditorissa sisäänrakennettujen rinnalla, joten voit tehdä sähkön hintaan reagoivan automaation valitsematta entiteettejä, kirjoittamatta malleja tai tietämättä, mikä anturi sisältää minkäkin tiedon.

Ne ovat helpoin tapa aloittaa ensimmäinen automaatio. [Automaatioesimerkit](automations.md) näyttävät samat ideat entiteeteistä rakennettuina, ja niitä tarvitset kaikkeen, mitä laukaisimet eivät kata.

## Näin lisäät laukaisimen käyttöliittymässä

1. **Asetukset → Automaatiot & tilanteet → Lisää automaatio → Luo uusi automaatio**
2. **Laukaisuehto** → hae laukaisimen nimellä, esim. `sijaluku`, `hinta` tai `halvim`
3. Valitse laukaisin ja lisää sitten toiminto

Ehdot toimivat samalla tavalla kohdassa **Lisää ehto**.

!!! note "Hae laukaisimen nimellä, älä sanalla `Kilowahti`"
    Valitsin hakee laukaisimien ja ehtojen nimistä käyttöliittymäsi kielellä. Haku sanalla `Kilowahti` löytää vain laitteen ja sen entiteetit, ei laukaisimia. Jos Kilowahti-esiintymiä on useita, lisää kohde kertomaan, mitä esiintymää laukaisin seuraa — katso alla.

Jos sinulla on useita Kilowahti-esiintymiä (yksi kutakin aluetta tai sijaintia kohden), laukaisimessa on **Lisää kohde** -painike (target) — valitse sillä kyseisen esiintymän laite. Kun esiintymiä on useita, laukaisin tai ehto ilman kohdetta ei tee mitään: laukaisin ei koskaan laukea eikä ehto koskaan täyty. Kun esiintymiä on vain yksi, kohteen voi jättää lisäämättä, jolloin esiintymää käytetään automaattisesti.

## Laukaisimet

| Laukaisin | Laukeaa, kun |
|---|---|
| Hinta muuttui hyväksyttäväksi | Nykyinen hinta laskee hintarajaan tai sen alle |
| Hinta ei ole enää hyväksyttävä | Nykyinen hinta nousee hintarajan yläpuolelle |
| Sijaluku muuttui hyväksyttäväksi | Nykyisen hintajakson sijaluku laskee sijalukurajaan tai sen alle |
| Sijaluku ei ole enää hyväksyttävä | Nykyisen hintajakson sijaluku nousee sijalukurajan yläpuolelle |
| Muuttui halvimmaksi jaksoksi | Nykyisestä hintajaksosta tulee päivän halvin kokonaishinnan mukaan |
| Kiinteä jakso alkoi | [Kiinteähintainen jakso](fixed-periods.md) tulee voimaan |
| Kiinteä jakso päättyi | Kiinteähintainen jakso päättyy |
| Huomisen hinnat saatavilla | Huomisen hinnat on haettu, yleensä iltapäivällä |

## Ehdot

| Ehto | Täyttyy, kun |
|---|---|
| Hinta on hyväksyttävä | Nykyinen hinta on hintarajassa tai sen alle |
| Sijaluku on hyväksyttävä | Nykyisen hintajakson sijaluku on sijalukurajassa tai sen alle |
| Hinta on vuorokauden halvin | Nykyinen hintajakso on päivän halvin kokonaishinnan mukaan |
| Kiinteä jakso voimassa | Kiinteähintainen jakso on parhaillaan voimassa |
| Huomisen hinnat saatavilla | Huomisen hinnat on haettu |

Ehto, jota ei voi arvioida — hintatietoja ei vielä ole, tai kohde ei vastaa mitään Kilowahti-esiintymää — ei täyty. Siihen sidotut automaatiot eivät yksinkertaisesti suoritu.

## Hyvä tietää

**Laukaisimet laukeavat muutoksesta, eivät sen kestäessä.** "Hinta muuttui hyväksyttäväksi" laukeaa kerran, sillä hetkellä kun hinta laskee hintarajaasi. Se ei laukea uudelleen jokaisella hintajaksolla niin kauan kuin hinta pysyy matalana. Jos haluat toimia tilan perusteella, joka on *jo* voimassa, käytä ehtoa tai vastaavaa binäärianturia.

**Uudelleenkäynnistys tai uudelleenlataus ei laukaise niitä.** Jokainen laukaisin lukee tilanteen käynnistyessään ja pitää sitä lähtötasonaan, joten automaatioiden uudelleenlataus kesken halvan tunnin ei aiheuta aiheetonta suoritusta.

**Raja-arvot päivittyvät heti.** Hinta- ja sijalukuraja tulevat asetuksistasi, ja kumpikin on saatavilla myös `number`-entiteettinä, jota voit muuttaa kojelaudalta tai automaatiosta. Kun muutat raja-arvoa, laukaisimet käyttävät uutta arvoa saman tien — uudelleenlatausta ei tarvita.

**Hintaan sisältyy siirto vain, jos niin valitset.** Hintarajaa verrataan oletuksena energian hintaan, tai energian ja siirron summaan, kun *Maksimihinta sisältää myös siirron* on valittu asetuksissa.

**"Halvin jakso" sisältää aina siirron.** "Muuttui halvimmaksi jaksoksi" ja "Hinta on vuorokauden halvin" asettavat jaksot järjestykseen maksamasi kokonaishinnan, eli energian ja siirron summan, mukaan. Jos päivän halvin kokonaishinta on useammalla hintajaksolla, ne kaikki lasketaan halvimmiksi.

**Kiinteähintaisella sopimuksella sijaluku ei enää erottele.** Sijaluku perustuu energian hintaan, jonka todellisuudessa maksat. Kiinteähintaisen jakson aikana jokainen tunti maksaa saman verran, joten jokaisen hintajakson sijaluku on 1, "Sijaluku on hyväksyttävä" täyttyy aina ja "Sijaluku muuttui hyväksyttäväksi" ei laukea koskaan — halvempaa tuntia ei ole, johon siirtyä. Käytä ehtoa "Hinta on vuorokauden halvin" tai laukaisinta "Muuttui halvimmaksi jaksoksi", jos haluat silti hyödyntää tällaisen päivän halvimman siirtohinnan tunnit.

## YAML-muodossa

Käyttöliittymä on helpompi tapa, mutta samat laukaisimet ja ehdot voi kirjoittaa myös käsin:

```yaml
alias: Lämmitä vesi, kun hinta laskee
triggers:
  - trigger: kilowahti.price_became_acceptable
conditions:
  - condition: kilowahti.tomorrow_available
actions:
  - action: switch.turn_on
    target:
      entity_id: switch.water_heater
```

Kun Kilowahti-esiintymiä on useampi kuin yksi, kerro mitä niistä tarkoitat:

```yaml
triggers:
  - trigger: kilowahti.rank_became_acceptable
    target:
      device_id: 0123456789abcdef0123456789abcdef
```

Laukaisimien avaimet ovat muotoa `kilowahti.` ja perään laukaisimen englanninkielinen nimi snake_case-muodossa: `price_became_acceptable`, `price_no_longer_acceptable`, `rank_became_acceptable`, `rank_no_longer_acceptable`, `became_cheapest_slot`, `fixed_period_started`, `fixed_period_ended`, `tomorrow_prices_available`. Ehtojen avaimet noudattavat samaa kaavaa: `price_is_acceptable`, `rank_is_acceptable`, `price_is_lowest_today`, `fixed_period_active`, `tomorrow_available`.

## Milloin binäärianturit ovat parempi valinta

[Binäärianturit](entities.md#binaarianturit) kattavat samat asiat tiloina tapahtumien sijaan, minkä vuoksi ne ovat parempi valinta, kun haluat:

- nähdä nykyisen tilanteen kojelaudalla tai sen historian kaaviossa
- yhdistää useita ehtoja samaan malliin
- käynnistää automaation tilasta, joka on jo voimassa, odottamatta seuraavaa muutosta
