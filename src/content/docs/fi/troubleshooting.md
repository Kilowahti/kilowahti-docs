---
title: "Vianmääritys"
---

Tällä sivulla lähdetään liikkeelle oireista. Jos ongelmasi on muotoa "miten saan Kilowahdin tekemään&nbsp;X:n", katso mielummin sivua [Miten teen…?](/fi/how-do-i/).

## Ei lainkaan hintoja

Jos `spot_price` ja kaikki siitä johdetut entiteetit näyttävät tilaa *Tuntematon* tai *Ei saatavissa*:

- **Heti asennuksen jälkeen anna Kilowahdille pieni hetki aikaa.** Hinnat haetaan asennuksen aikana, mutta entiteetit ilmestyvät jo ennen kuin ensimmäinen haku on valmis.
- **Tarkista hintalähde.** **Hintatietojen lähde** (`sensor.kilowahti_{name}_price_data_source`) kertoo, mikä lähde sinulle kulloinkin hintoja tarjoaa. Jos anturin tila on *Ei saatavissa*, mikään lähde ei vastannut.
- **Tarkista ulospäin lähtevät yhteydet.** Kilowahti tarvitsee HTTPS-yhteyden osoitteeseen `cdn.kilowahti.fi` ja varalla osoitteeseen `api.spot-hinta.fi`. Home Assistant -laitteen tiukka DNS-suodatin tai palomuuri saattaa estää molemmat.
- **Katso lokia.** Asetukset → Järjestelmä → Lokit, suodata hakusanalla `kilowahti`. Epäonnistunut lähde kirjaa lokiin syyn jonka vuoksi haku epäonnistui.

Kilowahti tallentaa hinnat välimuistiin paikallisesti, joten tilapäinen katkos ei tyhjennä antureitasi: jo haetun päivän hinnat säilyvät.

## Korjauksiin ilmestyy "Käytössä varahintalähde"

Kilowahti on hakenut alueesi hinnat toissijaisesta hintalähteestä yli 24 tunnin ajan, mikä tarkoittaa yleensä, että ensisijaisessa lähteessä on katkos. Hinnat ovat silti oikein, ja korjausilmoitus poistuu itsestään, kun ensisijainen lähde vastaa taas. Sinun ei tarvitse tehdä mitään. Jos tilanne jatkuu päiväkausia, tarkista ulospäin lähtevät yhteydet kohdan [Ei lainkaan hintoja](#ei-lainkaan-hintoja) mukaisesti ja etsi epäonnistumisen syy lokista. *(versiosta 2026.11.0)*

## Huomisen hinnat puuttuvat

Tämä on normaalia suurimman osan päivästä. Eurooppalainen sähkömarkkinan huutokauppa julkaisee tulokset alkuiltapäivällä, mutta tarkka aika vaihtelee. Kilowahti alkaa hakea hintoja klo 13:00 Keski-Euroopan aikaa, CET (klo 14:00 Suomen aikaa) ja yrittää kerran minuutissa, kunnes ne ilmestyvät tai kello ylittää 21:00 CET (klo 22:00 Suomen aikaa). Molemmat kellonajat voi muuttaa Lisäasetuksissa. Useimmiten hinnat ovat Kilowahdin hakemana Home Assistantissa klo 13:15 CET (klo 14:15 Suomen aikaa) mennessä.

**Huomisen hinnat saatavilla** (`binary_sensor.kilowahti_{name}_tomorrow_available`) kytkeytyy päälle, kun hinnat saapuvat. Siihen asti jokainen `tomorrow_*`-anturi näyttää tilaa *Tuntematon*, ja se on tarkoituksellinen arvo, ei virhe.

Jotkin hinta-alueet julkaisevat hintansa muita myöhemmin, esimerkiksi Italia on säännöllisesti viimeisten joukossa.

## Hinnat eivät vastaa sähkölaskuani

Käy asiat läpi tässä järjestyksessä:

1. **ALV**  
   Markkinahinnat tulevat ilman ALV:tä, ja Kilowahti lisää niihin asettamasi verokannan. Vertaa sitä laskuusi.
2. **Sähkönmyyjän marginaali**  
   Jos sopimukseesi kuuluu kilowattituntikohtainen marginaali, syötä se asetuksiin, sillä se ei sisälly markkinahintaan.
3. **Siirtohinnat**  
   Energian hinnan anturi `spot_price` ei koskaan sisällä siirtoa. Vertaa laskuasi `total_price`-anturiin ja varmista, että [siirtohinnat](/fi/transfer-pricing/) on tallennettu asetuksiin.
4. **Kuukausimaksut**  
   Kiinteät kuukausimaksut, olivat ne sitten sähkönmyyjän tai verkkoyhtiön, eivät riipu kulutuksesta, eli eivät ole kilowattituntikohtaisia. Kilowahti jakaa ne `monthly_fixed_cost_today`-anturiin erilleen kilowattituntikohtaisista antureista.
5. **Sähkövero**  
   Joissain maissa sähkövero laskutetaan osana siirtohintaa eikä erikseen.

Kaikki Kilowahtiin syöttämäsi hinnat ovat verollisia (sis. ALV). Kaikki suoraan sähkömarkkinoilla ilmoitetut hinnat ovat verottomia, Kilowahti lisää verot automaattisesti.

## Entiteetti puuttuu kokonaan

Jotkin entiteettiryhmät ovat olemassa vain, kun ne on otettu käyttöön asetuksissa:

| Puuttuu | Ota käyttöön |
|---|---|
| Myynti-, hintaero- ja aurinkoanturit | **Ota tuotanto- ja myyntiominaisuudet käyttöön** lisäasetuksissa |
| Akun lataus- ja purkuanturit | Edellisen lisäksi aseta **Akun kapasiteetti** suuremmaksi kuin nolla |
| Liukuvat 30/60/120 minuutin keskiarvot | **Näytä seuraavan 30 min, 1h ja 2h keskihinnat** lisäasetuksissa kun hintaresoluutio on 15 minuuttia |
| Vaihtokurssianturi | Ei käytössä ellei euroalueen ulkopuolella käytössä ole paikallinen valuutta |
| `transfer_price`, `control_factor_transfer` | Ovat aina olemassa, mutta näyttävät tilaa *Tuntematon*, kunnes [siirtohinta](/fi/transfer-pricing/) on määritetty |

Uudet entiteetit ilmestyvät heti, kun asetus on tallennettu, eikä uudelleenkäynnistystä tarvita.

## Sijaluku on koko päivän 1

Tämä on normaalia kiinteähintaisella sopimuksella. Sijaluku järjestää päivän hintajaksot sen energian hinnan mukaan, jonka oikeasti maksat, ja [kiinteähintaisen jakson](/fi/fixed-periods/) aikana jokainen hintajakso maksaa saman verran, joten ne kaikki jakavat sijaluvun 1. Tällöin `rank_acceptable` pysyy aina päällä, eikä laukaisin "Sijaluku muuttui hyväksyttäväksi" laukea koskaan.

Jos haluat silti poimia tällaisena päivänä edullisemmat tunnit, käytä `total_price_rank`-anturia, joka sisältää siirtohinnan, tai ehtoa "Hinta on vuorokauden halvin".

## Optimointianturilla ei ole arvoa

Optimoinnin pistemäärät tarvitsevat energiamittarin toimiakseen. Varmista ensin, että energiamittarin entiteetillä on `state_class: total_increasing` ja se on liitetty Kilowahdin asetuksissa kohdassa **Määrittele → Pisteprofiilit → Edit: Total**.

Optimoinnin pistemäärä kertyy päivän mittaan ja valmistuu keskiyöllä, joten juuri liitetty mittari ei näytä mitään ennen kuin se on ehtinyt mitata kulutusta jonkin aikaa.

:::tip[Tehoanturista energia-anturiksi apurilla]
Pelkkä wattimääräinen tehon lukema ei toimi, mutta ellei parempaa energiamittausta ole saatavilla, voit manuaalisesti lisätä apurin joka tallentaa hetkittäisen tehon kulutukseksi kilowattitunteina ja jota Kilowahti voi käyttää.
:::

## Historiakaavioissa näkyy yksikköristiriita

Näyttöyksikön tai näyttövaluutan vaihtaminen muuttaa jokaisen hintaentiteetin yksikön, eivätkä Home Assistantin pitkän aikavälin tilastot muunna jo tallennettuja tietoja. Vanhat tiedot säilyttävät vanhan yksikkönsä, ja kaavio ilmoittaa ristiriidasta.

Mieluiten valitse yksikkö ja valuutta kerran asennuksen yhteydessä ja pidä ne muuttumattomina. Jos sinun on pakko vaihtaa niitä jälkikäteen, varaudu tyhjentämään kyseisten anturien tilastot.

## Siirtohinnan tason muokkaaminen ei muuta mitään

Korjattu Kilowahdin versiossa `2026.9.0`. Aiemmissa versioissa olemassa olevan siirtohinnan ryhmän tai tason muutokset tulivat voimaan vasta, kun jokin muu tapahtuma päivitti anturit, näitä tapahtumia olivat hintajakson vaihtuminen, kiinteähintaisen jakson muutos tai keskiyö. Ryhmien lisääminen ja poistaminen toimi aina. Päivitä siis Kilowahti uuteen versioon.

## Kaaviot eivät enää näytä hintataulukoita historiasta

Attribuutteja `today_prices` ja `tomorrow_prices` ei tarkoituksella tallenneta tietokantaan, joten ne ovat olemassa vain nykyisessä tilassa eivätkä historiassa. Kortit, jotka lukevat reaaliaikaista attribuuttia, toimivat normaalisti, mutta mikään attribuuttien historiatietoja hakeva ei löydä niitä.

Varttihintoihin siirryttäessä nämä taulukot ylittivät kooltaan Home Assistantin 16 kt:n rajan tallennettaville attribuuteille, jolloin Home Assistant jätti anturin kaikki attribuutit tallentamatta tietokantaan ja kirjasi varoituksen lokiin jokaisella anturin päivityksellä.

## Jos mikään ei auta

Avaa GitHubissa [issue](https://github.com/Kilowahti/ha-kilowahti/issues) tai [keskustelu](https://github.com/Kilowahti/ha-kilowahti/discussions), tai ellet halua luoda GitHub-tiliä, käytä [palautelomaketta](https://tally.so/r/QK05XY). Lokit kohdasta **Asetukset → Järjestelmä → Lokit** `kilowahti`-hakusanalla suodatettuina auttavat valtavasti ongelman selvittämistä.
