---
title: "Optimointipisteet"
---

Kilowahdin optimointipisteet kertovat, kuinka hyvin sähkönkulutusta on kohdistettu halvoille jaksoille. Pistemäärä 100 tarkoittaa, että kulutus on keskittynyt halvimpiin hintajaksoihin. Lähellä nollaa oleva pistemäärä tarkoittaa, että kulutus ajoittuu pääosin kalleimmille ajoille.

## Miten se toimii

Jokainen päivä jaetaan neljään kvartiiliin hintajakson sijaluvun (riippuu valitusta hintaresoluutiosta) mukaan:

| Kvartiili | Sijaluvut (15 min) | Sijaluvut (1 h) | Merkitys |
|---|---|---|---|
| Q1 | 1–24 | 1–6 | Halvimmat 25 % hintajaksoista |
| Q2 | 25–48 | 7–12 | |
| Q3 | 49–72 | 13–18 | |
| Q4 | 73–96 | 19–24 | Kalleimmat 25 % |

Kilowahti seuraa energiankulutusta (profiiliin liitetyistä mittarientiteeteistä) hintajakso kerrallaan ja laskee kulutuksen yhteen kvartiileittain päivän mittaan.

## Kaavat

Kullekin profiilille on valittavissa kaksi pisteytyskaavaa. Molemmat kaavat näyttävät täyttä 100 pisteen tulosta jos kaikki kulutus on ensimmäisessä kvartiilissa, mutta oletuskaavalla se on helpompi saavuttaa. Voit valita käytettävän laskukaavan, kun lisäät tai muokkaat profiilia.

### Oletuskaava (Default)

```
raw = (Q1×3 + Q2×2 + Q3×1) / (Total×3) × 100
score = clamp((raw − 30) / 53.3 × 100, 0, 100)
```

| Tilanne | Pistemäärä |
|---|---|
| Kaikki kulutus Q1:ssä | 100 |
| Kulutus jaettu tasan Q1:n ja Q2:n kesken | 100 |
| Täysin tasainen kaikissa kvartiileissa | ~38 |
| Kaikki kulutus Q3:ssa | ~6 |
| Kaikki kulutus Q4:ssä | 0 |

Kaava on painotettu siten että satunnainen, optimoimaton kulutus saa keskiarvoisen 50 pisteen sijaan noin **38** pistettä. Näin asteikon yläpäähän jää enemmän tilaa palkita tietoisesta kulutuksen siirtämisestä halvoille hintajaksoille. Toisaalta täysiin pisteisiin riittää että kaikki kulutus on päivän halvemmalla puoliskolla, ja vähintään puolet siitä on ensimmäisessä kvartiilissa. Jotta tuloksen saa tällä kaavalla asteikon paremmalle puolelle, eli yli 50 pisteen, täytyy kulutusta saada ohjattua päivän kalleimmilta jaksoilta halvemmille - siksi tämä on Kilowahdin oletuskaava.

### Neutraali kaava (Raw)

```
score = clamp((Q1×3 + Q2×2 + Q3×1) / (Total×3) × 100, 0, 100)
```

| Tilanne | Pistemäärä |
|---|---|
| Kaikki kulutus Q1:ssä | 100 |
| Kulutus jaettu tasan Q1:n ja Q2:n kesken | ~83 |
| Täysin tasainen kaikissa kvartiileissa | 50 |
| Kaikki kulutus Q3:ssa | ~33 |
| Kaikki kulutus Q4:ssä | 0 |

Käyttää neutraalia lähtötasoa: täysin tasainen kulutus saa tasan **50** pistettä. Tätä on helpompi tulkita yhdellä silmäyksellä: alle 50 on satunnaista huonompi, yli 50 parempi. Toisaalta tätä kaavaa käyttäen optimoimattomaankin kulutukseen on helpompi tyytyä ja muutokset kulutuksessa aikaansaavat pienempiä muutoksia tulokseen, eli optimoidessa muuttavat tulosta vähemmän "paremmaksi".

## Päivä- ja kuukausipisteet

- **Päiväpistemäärä** (`score_{profile}_daily`) muuttuu päivän mittaan sitä mukaa kuin hintajakso vaihtuu. Nollautuu keskiyöllä. Attribuutti `previous` kertoo eilisen päivän lopullisen pistemäärän.
- **Kuukausipistemäärä** (`score_{profile}_monthly`) on kuluvan **kalenterikuukauden** toteutuneiden päiväpistemäärien keskiarvo (ei siis liukuva 30 päivän ikkuna). Päivittyy joka keskiyö. Attribuutti `previous` kertoo edellisen kalenterikuukauden lopullisen pistemäärän.

Optimointianturit päivittyvät jokaisen hintajakson vaihtuessa (15 tai 60 minuutin välein hintaresoluution mukaan), eivät jokaisen yksittäisen mittarilukeman kohdalla.

Päiväpistemäärät säilytetään 90 päivän ajan. Kahden viimeisimmän valmiin kalenterikuukauden pistemäärät säilytetään erikseen, ja ne ovat saatavilla `previous`-attribuutin kautta myös 90 päivän historian jälkeen.

## Pisteprofiilien määrittäminen

1. Siirry kohtaan **Asetukset → Laitteet & palvelut → Kilowahti → Määrittele → Pisteprofiilit**
2. Valitse **✎ Edit** **Total**-profiilin kohdalta
3. Valitse **➕ Add meter(s)** ja valitse pääasiallinen verkosta ostetun sähkön mittari
4. Valitse **⚙ Formula** ja valitse pisteytyskaava (Default tai Raw)
5. Valitse **← Back** ja sen jälkeen **✓ Save & close**

Voit lisätä myös muita profiileja, jos seuraat yksittäisiä virtapiirejä tai laitteita omilla energiamittareillaan. Jokaisessa profiilissa voi valita käytettävän laskukaavan erikseen.

:::note[Mittarin entiteetin on oltava arvoltaan kasvava]
Energiamittarin entiteetillä on oltava `state_class: total_increasing`. Tämä on Home Assistantin energiamittareilla vakio (esim. `sensor.electricity_meter_energy`).
:::
