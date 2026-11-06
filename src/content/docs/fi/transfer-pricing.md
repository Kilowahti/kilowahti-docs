---
title: "Siirtohinnat"
---

Näin määrität Kilowahtiin verkkoyhtiösi siirtohinnat, jotta ne tulevat mukaan hintalaskelmiin ja antureihin.

## Ryhmät ja tasot

Siirtohinnat järjestetään **ryhmiin** jotka vastaavat verkkoyhtiöiden erilaisia siirtotuotteita, joista jokaisessa on yksi tai useampi **taso**, eli sääntö joka aktivoituu kun sen ehdot täyttyvät. Vain yksi ryhmä on kerrallaan aktiivinen, joten voit tallentaa useita sopimuksia (esim. kausisiirron tai aikasiirron) ja vaihtaa niiden välillä syöttämättä tietoja uudelleen. *(Muista kuitenkin aina tarkistaa että aiemmin syöttämäsi hinnat ovat edelleen ajantasalla.)*

Ryhmän asetuksissa on nimi (esim. Aikasiirto tai Yösiirto) ja kyseisen siirtotuotteen/sähköliittymän kuukausimaksu.

Jokaisella ryhmään kuuluvalla tasolla on sähkönsiirron hinta per kWh ja sen voimassaolon ehdot:

| Kenttä | Kuvaus |
|---|---|
| Hinta | Näyttöyksikössäsi, verollisena (sis. ALV) |
| Voimassaolokuukaudet | Minä kuukausina taso on voimassa |
| Voimassaoloviikonpäivät | Minä viikonpäivinä |
| Alkamistunti / Loppumistunti | Näillä asetetaan tuntiväli jolloin ehto täyttyy (alkamistunti mukaan lukien, loppumistunti pois lukien: 6-22 sisältää ajan 6:00-21:59) |
| Prioriteetti | Tasojen tarkistamisjärjestys, katso alta |

### Näin prioriteetti toimii

Tasot käydään läpi prioriteetin mukaan nousevassa järjestyksessä eli pienin ensin, ja **ensimmäinen osuva taso voittaa**. Pienempi luku prioriteettina tarkoittaa siis, että taso tarkistetaan *aiemmin* kuin suuremman: prioriteetti 1 voittaa prioriteetin 2.

Käytännössä kannattaa toimia näin: kuvaa rajatut hinnat tarkasti tasoilla joiden prioriteetit ovat pieniä lukuja, ja anna perushinnalle suurin luku, jolloin se tulee voimaan vain, kun mikään aikaisempi taso ei osunut.

:::tip[Lopeta aina kaiken kattavaan tasoon]
Älä rajaa perushintaa ajallisesti mitenkään (kaikki kuukaudet, kaikki viikonpäivät, tunnit 0–24) ja anna sille ryhmän suurin prioriteettiluku. Silloin se toimii varahintana pohjalla ja takaa, että vuoden jokaisella tunnilla on siirtohinta. Ilman sitä tunneilla, joihin mikään taso ei osu, ei ole siirtohintaa lainkaan.
:::

## Tasojen tarkastelu ja muokkaus

Avaa **Määrittele → Siirtohinnat** ja valitse ryhmä. Ryhmän näkymässä luetellaan kaikki sen tasot (hinta, kuukaudet, viikonpäivät, tuntiväli ja prioriteetti) siinä järjestyksessä, jossa ne käydään läpi.

Valinta **✎ Edit tier** avaa tason niin, että kaikki sen nykyiset arvot on valmiiksi täytetty. Muuta haluamiasi kenttiä ja tallenna vahvistamalla, tai poista taso valitsemalla **Poista tämä hinta**.

## Vaikutus antureihin ja binääriantureihin

Kun ryhmä on aktiivinen:

- **Siirtohinta** (`sensor.kilowahti_{name}_transfer_price`) näyttää voimassa olevan tason hinnan. Sen `tariff`-attribuutti kertoo käytössä olevan ryhmän ja tason, esim. `Kausisiirto, Muu aika`, ja ne ovat saatavilla myös irrallaan omissa attribuuteissa `group` ja `tier`
- **Kokonaishinta** (`sensor.kilowahti_{name}_total_price`) on toteutuva hinta ja siirtohinta yhteensä
- **Siirron ohjauskerroin** (`sensor.kilowahti_{name}_control_factor_transfer`) vertaa voimassa olevaa tasoa muihin tänään esiintyviin tasoihin: **1,0 = halvin taso, 0,0 = kallein**, samalla asteikolla kuin muut [ohjauskertoimet](/fi/control-factor/). Ryhmä, jossa käytössä on vain yksi taso, pysyy koko ajan arvossa 1,0. Anturista on myös bipolaarinen versio, joka vaihtelee välillä −1…+1
- **Kokonaishinnan sijaluku** (`sensor.kilowahti_{name}_total_price_rank`) ja `control_factor_total` ottavat siirtohinnan huomioon, pelkät `price_rank` ja `control_factor_price` eivät
- `price_acceptable`-binäärianturi voi halutessasi ottaa vertailuun mukaan myös siirtohinnan (asetus **Maksimihinta sisältää myös siirron**)

Ennen kuin yhtään ryhmää on määritetty, `transfer_price` ja `control_factor_transfer` näyttävät tilan *Tuntematon* eivätkä nollaa. Kilowahti ei teeskentele, että sähkönsiirto olisi ilmaista.

## Esimerkki: Yleissiirto (yksi hinta)

*Yleissiirto* on yksiaikainen siirtotuote ilman aikarajauksia: sama hinta on voimassa ympäri vuorokauden, vuoden jokaisena päivänä. Siihen tarvitaan vain yksi taso.

**Vaiheittaiset ohjeet**

1. Siirry kohtaan **Asetukset → Laitteet & palvelut → Kilowahti → Määrittele → Siirtohinnat**
2. Valitse **➕ Add group**, anna nimeksi **Yleissiirto**, syötä verkkoyhtiösi kuukausihinta, ja tallenna
3. Valitse luettelosta **⚙ Manage: Yleissiirto**
4. Valitse **➕ Add tier** ja täytä hinta:

    | Kenttä | Arvo |
    |---|---|
    | Tason nimi | Yleissiirto |
    | Hinta | *(verkkoyhtiösi hinta per kWh, sis. ALV)* |
    | Voimassaolokuukaudet | *(kaikki kuukaudet)* |
    | Voimassaoloviikonpäivät | *(kaikki päivät)* |
    | Alkamistunti | 0 |
    | Loppumistunti | 24 |
    | Prioriteetti | 1 |

5. Valitse **← Back** ja sitten **✓ Save & close**
6. Ota ryhmä käyttöön avaamalla se uudelleen ja valitsemalla **Set as active group**

## Esimerkki: Aikasiirto (päivä- ja yöhinta)

*Aikasiirto* on kaksiaikainen siirtotuote, jossa hinta riippuu vuorokaudenajasta: päivähinta on korkeampi ja yöhinta matalampi. Yöaika on tyypillisesti 22:00–07:00, mutta tarkista tarkat kellonajat verkkoyhtiösi sopimuksesta.

| Hinta | Voimassa |
|---|---|
| Päivä | 07:00–22:00, joka päivä |
| Yö | 22:00–07:00, joka päivä |

Koska Kilowahti käy tasot läpi prioriteetin mukaan nousevassa järjestyksessä ja pysähtyy ensimmäiseen osumaan, anna rajatummalle hinnalle (päivä, eli yksi yhtenäinen jakso saman vuorokauden aikana) pienempi luku ja anna yöhinnan toimia sen takana pohjatasona.

**Vaiheittaiset ohjeet**

1. Siirry kohtaan **Asetukset → Laitteet & palvelut → Kilowahti → Määrittele → Siirtohinnat**
2. Valitse **➕ Add group**, anna nimeksi **Aikasiirto**, syötä siirtotuotteen kuukausihinta, ja tallenna
3. Valitse luettelosta **⚙ Manage: Aikasiirto**
4. Valitse **➕ Add tier** ja täytä päivähinta:

    | Kenttä | Arvo |
    |---|---|
    | Tason nimi | Päivä |
    | Hinta | *(verkkoyhtiösi päivähinta per kWh, sis. ALV)* |
    | Voimassaolokuukaudet | *(kaikki kuukaudet)* |
    | Voimassaoloviikonpäivät | *(kaikki päivät)* |
    | Alkamistunti | 7 |
    | Loppumistunti | 22 |
    | Prioriteetti | 1 |

5. Valitse uudelleen **➕ Add tier** ja täytä kaiken kattava yöhinta:

    | Kenttä | Arvo |
    |---|---|
    | Tason nimi | Yö |
    | Hinta | *(verkkoyhtiösi yöhinta per kWh, sis. ALV)* |
    | Voimassaolokuukaudet | *(kaikki kuukaudet)* |
    | Voimassaoloviikonpäivät | *(kaikki päivät)* |
    | Alkamistunti | 0 |
    | Loppumistunti | 24 |
    | Prioriteetti | 2 |

    Alkamistunti 0 ja loppumistunti 24 tarkoittavat, että taso kattaa koko vuorokauden. Kaiken kattavalle tasolle tämä on tarkoituksellista. Suuremman prioriteettilukunsa ansiosta siihen päädytään vain, kun mikään aiempi taso ei osunut.

6. Valitse **← Back** ja sitten **✓ Save & close**
7. Ota ryhmä käyttöön avaamalla se uudelleen ja valitsemalla **Set as active group**

Päivätaso (prioriteetti 1) osuu klo 07:00–22:00. Näiden tuntien ulkopuolella yötaso (prioriteetti 2) kattaa kaiken muun.

## Esimerkki: Kausisiirto (kausihinnoittelu)

Suomalaiset verkkoyhtiöt tarjoavat yleisesti *kausisiirto*-tuotetta, jossa on kaksi hintaa:

| Hinta | Voimassa |
|---|---|
| Talviarkipäivä | marraskuu–maaliskuu, ma–la, 06:00–22:00 (tai 07:00–22:00) |
| Muu aika | Kaikki muu aika (huhti–lokakuu, talven sunnuntait, yöt) |

Prioriteetit toimivat samoin kuin yllä Aikasiirrossa: talviarkipäivän hinta kuvataan tarkasti prioriteetilla 1, ja muun ajan taso kattaa kaiken muun prioriteetilla 2.

**Vaiheittaiset ohjeet**

1. Siirry kohtaan **Asetukset → Laitteet & palvelut → Kilowahti → Määrittele → Siirtohinnat**
2. Valitse **➕ Add group**, anna nimeksi **Kausisiirto**, syötä siirtotuotteen kuukausihinta, ja tallenna
3. Valitse luettelosta **⚙ Manage: Kausisiirto**
4. Valitse **➕ Add tier** ja täytä talviarkipäivän hinta:

    | Kenttä | Arvo |
    |---|---|
    | Tason nimi | Talviarkipäivä |
    | Hinta | *(verkkoyhtiösi talviarkipäivän hinta per kWh, sis. ALV)* |
    | Voimassaolokuukaudet | November, December, January, February, March |
    | Voimassaoloviikonpäivät | Monday, Tuesday, Wednesday, Thursday, Friday, Saturday |
    | Alkamistunti | 6 |
    | Loppumistunti | 22 |
    | Prioriteetti | 1 |

5. Valitse uudelleen **➕ Add tier** ja täytä kaiken kattava muun ajan hinta:

    | Kenttä | Arvo |
    |---|---|
    | Tason nimi | Muu aika |
    | Hinta | *(verkkoyhtiösi muun ajan hinta per kWh, sis. ALV)* |
    | Voimassaolokuukaudet | *(kaikki kuukaudet)* |
    | Voimassaoloviikonpäivät | *(kaikki päivät)* |
    | Alkamistunti | 0 |
    | Loppumistunti | 24 |
    | Prioriteetti | 2 |

    Alkamistunti 0 ja loppumistunti 24 tarkoittavat, että taso kattaa koko vuorokauden. Kaiken kattavalle tasolle tämä on tarkoituksellista. Suuremman prioriteettilukunsa ansiosta siihen päädytään vain, kun mikään aiempi taso ei osunut.

6. Valitse **← Back** ja sitten **✓ Save & close**
7. Ota ryhmä käyttöön avaamalla se uudelleen ja valitsemalla **Set as active group**

Talviarkipäivän taso (prioriteetti 1) osuu ensimmäisenä aina, kun on marras–maaliskuu, arkipäivä (ma–la) ja kello on 06:00–22:00. Kaikki muut ajat päätyvät muun ajan tasolle (prioriteetti 2).

## Ryhmän vaihtaminen

Siirry kohtaan **Määrittele → Siirtohinnat**, valitse ryhmä ja valitse **Set as active group**. Vain yksi ryhmä on kerrallaan aktiivinen, ja vaihto tulee voimaan heti: uudelleenkäynnistystä tai uudelleenlatausta ei tarvita.

Myös aktiivisen ryhmän tasoihin tehdyt muutokset tulevat voimaan heti.
