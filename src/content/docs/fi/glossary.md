---
title: "Sanasto"
---

Sanastossa selitetään muualla näissä ohjeissa käytetyt termit selkokielellä.

## Hinnat ja markkinat

**Hinta-alue** (myös *tarjousalue*)  
Alue, jolle sähkön hinta määräytyy. Suomessa on vain yksi hinta-alue, mutta se ei ole aina sama asia kuin maa: Ruotsissa alueita on neljä, Norjassa viisi ja Italiassa seitsemän, kun taas Saksalla ja Luxemburgilla on yhteinen alue. Alue mainitaan yleensä sähkölaskussa tai sähkönmyyjän tiedoissa. [Tuetut alueet](/fi/supported-regions/) -sivun taulukossa on lueteltu kaikki 43 aluetta.

**Hintajakso**  
Aikayksikkö, jolle hinnat määritetään: 15 minuuttia (96 kpl vuorokaudessa) tai 1 tunti (24 kpl vuorokaudessa) asetuksistasi riippuen. Hinta pysyy samana hintajakson sisällä ja voi muuttua aina jakson vaihtuessa.

**Hintaresoluutio**  
Käytettävän hintajakson pituus (15 minuuttia tai yksi tunti). Valitse sähköliittymäsi sopimuksen mittausvälin mukaan.

**Kiinteähintainen jakso**  
Ajanjakso, jonka aikana kiinteä sopimushinta korvaa pörssisähköhinnan. Katso [Kiinteän hinnan jaksot](/fi/fixed-periods/).

**Marginaali** (myös *palkkio*)  
Kilowattituntikohtainen summa, jonka sähkönmyyjäsi lisää spot-hinnan päälle. Syötetään verollisena, ALV mukaan lukien.

**Siirtohinta** (myös *siirtomaksu*, *verkkopalvelumaksu*, *sähkönsiirto*)  
Se hinta, jonka verkkoyhtiösi veloittaa sähkön toimittamisesta perille, erillään siitä, mitä maksat sähkönmyyjälle itse energiasta. Usein siirron osuus on kolmannes tai enemmän koko sähkönkulutuksen kustannuksista.

**Spot-hinta**  
Kilowahdissa hintajakson markkinahinta, johon on lisätty ALV ja sähkönmyyjän marginaali. Markkinahinta saapuu Kilowahtiin verottomana, `spot_price`-anturi näyttää sen käyttäjälle aina verollisena.

**Taso**  
Aikaan perustuva sääntö siirtohintojen [ryhmässä](/fi/transfer-pricing/): hinta per kWh ja tieto siitä, milloin se on voimassa (kuukaudet, viikonpäivät, tunnit). Prioriteetin mukaan ensimmäinen osuva taso voittaa.

**Verollinen / veroton**  
Verollinen hinta sisältää ALV:n, veroton ei. Kaikki Kilowahtiin syöttämäsi hinnat ovat verollisia. Kaikki markkinoilta tuleva on verotonta, ja ALV lisätään automaattisesti puolestasi.

**Vuorokausimarkkinan hinta** (engl. *day-ahead*)  
Tukkuhinta, joka määräytyy huutokaupassa päivää etukäteen, hintajaksoittain ja hinta-alueittain. Kotitalouksien kohdalla ”spot-hinnalla” tarkoitetaan juuri tätä: huomisen hinnat päätetään tänään alkuiltapäivällä, eivätkä ne muutu sen jälkeen.

## Muut Kilowahdin termit

**Bipolaarinen**  
Sama arvo sijoitettuna välille −1…+1 välin 0–1 sijaan. Käytä kun haluat etumerkillisen luvun, joka kertoo, onko hinta tavallista halvempi vai kalliimpi.

**Energiahinta** (myös *sähkön hinta*)  
Mitä maksat kilowattitunnilta itse sähköstä: pörssisähkösopimuksessa spot-hinta, kiinteähintaisen jakson aikana sopimushintasi. Ei sisällä siirtoa.

**Kokonaishinta**  
Energiahinta ja siirtohinta yhteensä. Tämä luku vastaa lähinnä laskuasi.

**Kvartiili**  
Sama ajatus kuin sijaluvussa karkeammin neljään luokkaan jaettuna, yleensä ilmoitetaan muodossa Q1-Q4. Q1 = päivän halvin neljännes, Q4 = kallein.

**Kynnysarvo**  
Oma määritelmäsi sille, mikä on ”tarpeeksi halpaa”. Kynnysarvoja on kaksi: hintaraja kilowattituntia kohti ja sijalukuraja sijana päivän hintajaksojen joukossa. Molemmat ohjaavat binääriantureita, laukaisimia ja ehtoja, ja molempia voi säätää arjessa suoraan kojelaudalta.

**Ohjauskerroin**  
Sijaluku ilmaistuna lukuna väliltä 0–1: halvin on 1,0 ja kallein 0,0. Tarkoitettu syötteeksi automaatioihin, joissa on säädin eikä pelkkä kytkin: latausvirta, lämmityksen asetusarvo, puhaltimen nopeus. Katso [Ohjauskerroin](/fi/control-factor/).

**Pistemäärä**  
Asteikolla 0–100 ilmaistu mitta sille, kuinka hyvin todellinen kulutuksesi kohdistui päivän halpoihin hintajaksoihin. Katso [Optimointipisteet](/fi/scores/).

**Sijaluku**  
Mihin kohtaan hintajakso sijoittuu saman päivän hintajaksojen joukossa halvimmasta alkaen. 1 on päivän halvin, kalleimman (halvimmasta eroavan) hinnan sijaluku on aina hintajaksojen määrä (hintaresoluutiosta riippuen 24 tai 96). Samanhintaiset hintajaksot jakavat saman sijaluvun, joten kiinteähintaisen jakson aikana jokaisen hintajakson energiahinnan sijaluku on 1. Kokonaishinnan sijalukuun vaikuttaa kiinteähintaisellakin jaksolla myös siirtohinta, joten se voi vaihdella vaikka energiahinta pysyisikin samana koko päivän.

**Tehostettu haku**  
Iltapäivän aikaikkuna, jonka aikana Kilowahti tarkistaa huomisen hintoja toistuvasti, kunnes ne ilmestyvät.

## Home Assistantin termit

**Binäärianturi**  
Entiteetti, jonka tila on aina joko `Päällä` (`on`) tai `Pois` (`off`), esimerkiksi ”hinta on juuri nyt hyväksyttävä”.

**Entiteetti**  
Yksi arvo Home Assistantissa, esim. `sensor.kilowahti_home_total_price`. Kilowahti luo niistä joukon jokaista määritettyä esiintymää kohden.

**Laukaisin / ehto**  
Laukaisin käynnistää automaation, kun jotain tapahtuu, ja ehto ratkaisee, voidaanko laukaistu automaatio suorittaa vai pysäytetäänkö se samantien. Kilowahti tarjoaa [omat laukaisimet ja ehdot](/fi/triggers-conditions/).

**Numeroentiteetti**  
Arvo, jonka voi lukemisen lisäksi myös *asettaa* käyttöliittymästä. Kilowahdin kynnysarvot ovat numeroentiteettejä, joten voit muuttaa niitä kojelaudalta kun olet lisännyt ne johonkin korttiin.

**Pitkän aikavälin tilastot**  
Pitkäikäiset tuntikohtaiset yhteenvedot, joita Home Assistant säilyttää numeerisista entiteeteistä. Tuntikohtaiset tilastot tallennetaan erillään raakahistoriasta, jota HA karsii ajan myötä.

**Tietokanta** (engl. *recorder*)  
Home Assistantin osa, joka kirjoittaa entiteettien arvot tietokantaan muodostaen niistä raakahistorian. Kilowahdin hintataulukot on tarkoituksella jätetty sen ulkopuolelle.
