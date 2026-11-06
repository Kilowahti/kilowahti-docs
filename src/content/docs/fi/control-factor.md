---
title: "Ohjauskerroin"
---

Useimmat hintaan perustuvat automaatiot ovat on-off-kytkimiä: lämminvesivaraaja joko lämmittää tai ei.

Ohjauskerroin on sellaisia laitteita varten, joita säädetään portaattomasti: lämmityksen termostaatin tavoitelämpötila, sähköauton latausvirta, puhaltimen nopeus, tai pörssisähkön hinnasta kertovan älylampun värisävy tai kirkkaus. Sen sijaan että kysyttäisiin "onko nyt tarpeeksi halpaa", saat luvun, joka kertoo suhteellisesti *kuinka* halpaa juuri nyt on, ja voit säätää laitetta sen mukaan.

## Perusajatus

Kilowahti asettaa päivän jokaisen hintajakson järjestykseen hinnan mukaan. Ohjauskerroin muuttaa tämän sijaluvun luvuksi väliltä 0–1:

- **1,0** — päivän halvin hintajakso
- **0,0** — päivän kallein
- kaikki siltä väliltä — suhteessa niiden väliin

"Halvempi on suurempi" on tarkoituksellista: näin kerrointa voi käyttää suoraan kertolaskussa. Latausvirta on `max_current × factor`, eikä mitään tarvitse kääntää.

Jokaisella kertoimella on myös **bipolaarinen** pari, joka vaihtelee välillä −1…+1, jos haluat etumerkillisen luvun: positiivinen tarkoittaa päivän keskitasoa halvempaa, negatiivinen kalliimpaa.

## Mitä ohjauskerrointa kannattaa käyttää

Kertoimia on kolme, ja kukin järjestää hintajaksot eri hinnan mukaan:

| Anturi | Järjestää hinnan mukaan | Käytä kun |
|---|---|---|
| `control_factor_price` | Pelkkä energian hinta | Siirtohintasi on kiinteä, tai sinua kiinnostaa vain pörssihinta |
| `control_factor_total` | Energia ja siirto yhdessä | Haluat todellisen hinnan kilowattitunnilta — yleensä oikea valinta |
| `control_factor_transfer` | Pelkkä siirtohinnan taso | Haluat nimenomaan välttää siirron kalliimpia aikoja |

Kaikilla on sama asteikko, ja asetettu käyrä ja skaalaus koskevat kaikkia kolmea.

:::note[Kiinteähintaisella sopimuksella]
[Kiinteähintaisen jakson](/fi/fixed-periods/) aikana jokainen tunti maksaa saman verran, joten `control_factor_price` pysyy arvossa 1,0 koko päivän. Se on oikein, sillä mikään tunti ei ole toista kalliimpi. Kokonaishinnan `control_factor_total` vaihtelee silti, jos siirtohintasi vaihtelee päivän aikana.
:::

## Käyrä ja skaalaus

Kaksi asetusta vaikuttaa siihen, miten sijaluku sijoitetaan välille 0–1. Molemmat löytyvät kohdasta **Kynnysarvot ja ohjaus** sekä ohjatussa asennuksessa että Määrittele-näkymässä.

**Käyrä** — `linear` jakaa kertoimen tasaisesti koko päivälle. `sinusoidal` on loiva ääripäissä ja jyrkkä keskellä, joten muutamat halvimmat hintajaksot saavat kaikki lähes arvon 1,0, muutamat kalleimmat lähes 0,0, ja muutos tapahtuu keskihintaisten jaksojen kohdalla.

**Skaalaus** — eksponentti 1–3, jota sovelletaan tulokseen. Suuremmat arvot painavat kaikkea muuta paitsi halvimpia hintajaksoja alaspäin, jolloin kerroin toimii enemmän kytkimen tavoin.

Arvot päivälle, jossa on 24 hintajaksoa:

| Sijaluku | Lineaarinen | Sinimuotoinen | Lineaarinen, skaalaus 2 | Sinimuotoinen, skaalaus 2 |
|---:|---:|---:|---:|---:|
| 1 | 1,00 | 1,00 | 1,00 | 1,00 |
| 3 | 0,91 | 0,98 | 0,83 | 0,96 |
| 6 | 0,78 | 0,89 | 0,61 | 0,79 |
| 9 | 0,65 | 0,73 | 0,43 | 0,53 |
| 12 | 0,52 | 0,53 | 0,27 | 0,29 |
| 15 | 0,39 | 0,33 | 0,15 | 0,11 |
| 18 | 0,26 | 0,16 | 0,07 | 0,03 |
| 21 | 0,13 | 0,04 | 0,02 | 0,00 |
| 24 | 0,00 | 0,00 | 0,00 | 0,00 |

Riveittäin luettuna: sijaluvulla 6, eli melko halvalla tunnilla, lineaarinen antaa 0,78 ja sinimuotoinen 0,89, eli sinimuotoinen pitää sitä lähes yhtä hyvänä kuin parasta. Sijaluvulla 18 ne eroavat toiseen suuntaan, 0,26 ja 0,16. Skaalauksella 2 sijaluku 12, päivän puoliväli, putoaa arvosta 0,52 arvoon 0,27.

**Aloita lineaarisella käyrällä ja skaalauksella 1.** Vaihda sinimuotoiseen, jos automaatiosi poukkoilevat vierekkäisten sijalukujen välillä; nosta skaalausta, jos haluat ohjauksen keskittyvän todella halpoihin tunteihin.

## Ohjauskertoimen käyttö

Periaate on aina sama: valitse laitteellesi haluttu säätöalue ja sijoita kerroin sen sisälle.

Esimerkki **Lämmityksen tavoitelämpötila**, 19 °C kun on kallista, 22 °C kun on halvinta:

```yaml
{{ 19 + 3 * states('sensor.kilowahti_home_control_factor_total') | float(0) }}
```

Sijaluku 1 antaa 22,0 °C, sijaluku 12 antaa 20,6 °C ja sijaluku 24 antaa 19,0 °C.

Esimerkki **Sähköauton latausvirta** 6 A:n ja 16 A:n välillä:

```yaml
{{ 6 + 10 * states('sensor.kilowahti_home_control_factor_total') | float(0) }}
```

16 A halvimpana tuntina, 11,2 A päivän puolivälissä, 6 A kalleimpana.

Kumpikin sijoitetaan `number.set_value`- tai `climate.set_temperature`-toimintoon, jonka voit laukaista haluamallasi tavalla: Aikamalli-laukaisimella 15 minuutin välein tai Kilowahdin omilla [laukaisimilla](/fi/triggers-conditions/). [Automaatioesimerkit](/fi/automations/)-sivulla nämä on kirjoitettu kokonaisuudessaan.

:::note[Suojaa template puuttuvia arvoja vastaan asettamalla oletusarvo]
Käytä aina suojausta lisäämällä template-määrittelyyn `| float(0)`, joka muuttaa templaten tuloksen desimaaliluvuksi, tai ongelmatapauksessa asettaa arvoksi nollan. Ohjauskerroinanturi on tilassa *Ei saatavissa* kunnes ensimmäiset hinnat saapuvat, ja suojaamaton template aiheuttaa virheen uudelleenkäynnistyksen yhteydessä.
:::

## Milloin ohjauskerrointa ei kannata käyttää

Ohjauskerroin vastaa kysymykseen "kuinka halpaa nyt on verrattuna muuhun päivään". Absoluuttisesta hinnasta se ei kerro mitään. Päivänä, jona jokainen tunti on kallis, halvin tunti saa silti arvon 1,0. Jos laitteesi pitää ehdottomasti pysyä pois päältä silloin, kun sähkö on yksinkertaisesti kallista, rajaa toiminta ensin hintarajalla — **Hinta on hyväksyttävä** (`binary_sensor.kilowahti_{name}_price_acceptable`) tai [ehto "Hinta on hyväksyttävä"](/fi/triggers-conditions/) — ja käytä ohjauskerrointa vain säätämään sitä, mitä tapahtuu, kun tämä ehto on täyttynyt.
