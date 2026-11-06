---
title: "Asetukset"
---

Ohjattu asennus käynnistyy, kun lisäät integraation ensimmäisen kerran. Kaikkia asetuksia voi myöhemmin muokata kohdassa **Asetukset → Laitteet & palvelut → Kilowahti → Asettamasi nimi → Määrittele (hammasratas-ikoni)**.

Tällä sivulla kuvataan jokainen asetusten kenttä. Ensimmäistä käyttöönottoa varten [Ensimmäinen käyttöönotto](/fi/getting-started/) käy läpi oleellisimmat asetukset sekä suositukset niihin ja kertoo, mitkä vaiheet voi alkuvaiheessa ohittaa.

## Määritysvaiheet

### 1. Perusasetukset

| Kenttä | Kuvaus |
|---|---|
| Nimi | Käytetään entiteettien nimissä, esim. `Home` → `sensor.kilowahti_home_spot_price`. |
| Hinta-alue | Sähkömarkkinoiden hinta-alue, Suomessa on vain yksi alue. (Lisätietoa sivulla [tuetut alueet](/fi/supported-regions/)) |
| Hintaresoluutio | 15 minuuttia (96 aikaväliä/vrk) tai 1 tunti (24 aikaväliä/vrk), valitse oikea valinta sähköverkkosopimuksesi mittausvälin mukaan. **Suomessa varttimittaus vaatii yleensä uuteen malliin vaihdetun sähkömittarin, mittarien vaihtoaikataulu riippuu paikallisesta verkkoyhtiöstä.** |
| Näyttöyksikkö | Näyttövaluutan ali- tai pääyksikkö kilowattituntia kohti, esim. euroalueella `c/kWh` tai `€/kWh`, Ruotsissa `öre/kWh` tai `kr/kWh`. **Suomessa käytetään yleensä asetusta `c/kWh`.**|

#### Hintatiedot

Hinnat haetaan automaattisesti, joten sen suhteen ei tarvitse määritellä asetuksissa mitään. Kilowahti hakee hinnat ensisijaisesti omasta palvelustaan (Kilowahti CDN, joka perustuu EU:n ENTSO-E Transparency Platformin tietoihin)
ja ongelmatilanteessa käyttää tarvittaessa varalla spot-hinta.fi:tä.

Diagnostiikka-anturi `price_data_source` näyttää, mikä lähde on kulloinkin käytössä.

#### Näyttövaluutta (vain euroalueen ulkopuoliset alueet)

Eurooppalaiset sähkömarkkinat käyttävät kaupankäynnissä valuuttana euroa, joten Kilowahdin käytettävissä olevat hintatiedot ovat aina euroina. Niillä hinta-alueilla, joilla asiakaslaskutus tapahtuu paikallisessa valuutassa, asetuksissa on yksi lisävaihe näyttövaluutan määrittämistä varten *(versiosta 2026.8.0)*:

| Kenttä | Kuvaus |
|---|---|
| Näyttövaluutta | `EUR` tai alueen paikallinen valuutta (esim. `SEK`) |
| Valuuttakurssien lähde | Automaattinen (EKP:n päivittäinen viitekurssi) tai manuaalinen |
| Manuaalinen vaihtokurssi (paikallinen valuutta euroa kohti) | Paikallisen valuutan määrä yhtä euroa kohti, tätä arvoa käytetään manuaalisessa tilassa sekä varalla, jos automaattinen kurssi ei ole saatavilla |

Spot-hinnat muunnetaan euroista paikalliseen valuuttaan päivittäisellä vaihtokurssilla, joka pysyy samana koko päivän, joten jakson hinta ei muutu päivän aikana vaikka valuuttakurssi heiluisikin.

Kaikki syöttämäsi hinnat (marginaali, siirtohinnat, kiinteähintaiset jaksot, kynnysarvot) ovat aina valitussa näyttövaluutassa, ja valinnan muuttaminen muuntaa syötetyt hinnat automaattisesti asetuksen mukaisella vaihtokurssilla. Vaihdettuasi näyttövaluuttaa tarkista syötetyt hinnat muunnoksessa tai pyöristyksessä mahdollisesti tapahtuneiden tahattomien muutosten varalta.

*Serbia (`RS`) ja Pohjois-Makedonia (`MK`) eivät kuulu Euroopan Keskuspankin (EKP) viitekurssien piiriin, näillä alueilla voi käyttää ainoastaan manuaalisesti asetettua vaihtokurssia.*

:::caution[Pitkän aikavälin tilastot]
Näyttövaluutan vaihtaminen muuttaa jokaisen hintaentiteetin yksikön. Home Assistantin pitkän aikavälin tilastot eivät muunna vanhoja tietoja tietokannassa — aiemmalla yksiköllä tallennetuissa tilastoissa näkyy yksikköristiriita. Jos käytät pitkän aikavälin tilastoja ja haluat välttää ongelmia, valitse valuutta kerralla oikein asennuksen yhteydessä, äläkä muuta sitä jälkeenpäin.
:::

### 2. ALV ja sähkövero

Kentät täytetään valmiiksi valitun alueen oletusarvoilla, eikä niitä yleensä tarvitse muuttaa.

Voit myös syöttää tähän sähkösopimuksesi kiinteän kuukausimaksun, jolloin se jaetaan kuukauden päiville ja näytetään päiväkohtaisena kustannusanturina jota voi käyttää arvioidun päiväkohtaisen kustannuksen laskemisessa.

:::note[Syötetyt hinnat ovat verollisia]
Kaikki muualla asetuksissa syöttämäsi hinnat (siirtohinnat, kiinteähintaiset jaksot) ovat aina **verollisia (sis. ALV)**. Rajapintojen kautta julkaistut sähkömarkkinoiden spot-hinnat ovat aina verottomia, mutta Kilowahti lisää ALV:n hintoihin automaattisesti, joten näet antureissa ja palveluissa aina verollisen hinnan.
:::

### 3. Siirtohinnat

Määritä verkkoyhtiösi siirtohinnat. Kilowahdissa siirtohinnat muodostuvat yhdestä tai useammasta aikaan (kuukausi, viikonpäivä, ja/tai kellonaika) perustuvasta säännöstä. Säännöt käydään läpi prioriteettijärjestyksessä, ensimmäinen osuma ratkaisee.

Voit ohittaa tämän vaiheen ja määrittää siirtohinnat myöhemmin kohdassa **Määrittele**.

Lisätietoja siirtohinnoista ja niiden säännöistä on sivulla [Siirtohinnat](/fi/transfer-pricing/).

### 4. Kynnysarvot ja ohjaus

| Kenttä | Kuvaus |
|---|---|
| Ohjauksen maksimihinta | Kun hinta pienempi tai yhtä suuri kuin tämä asetus, `price_acceptable`-binäärianturi kytkeytyy päälle |
| Maksimihinta sisältää myös siirron | Verrataanko hintarajaa kokonaishintaan (aktiivinen hinta + siirto) vai pelkkään aktiiviseen hintaan |
| Ohjauksen maksimisijaluku | Kun sijaluku on pienempi tai yhtä suuri kuin tämä luku, `rank_acceptable`-binäärianturi kytkeytyy päälle |
| Tulevan keskiarvoikkunan pituus (tuntia) | Kuinka monta tuntia eteenpäin `next_hours_average`-anturi laskee (1–24, 0,25 tunnin välein) |
| Ohjauskertoimen käyrä | 0–1 -ohjauskertoimen käyrän muoto: Linear tai Sinusoidal (katso [Ohjauskerroin](/fi/control-factor/)) |
| Ohjauskertoimen skaalaus (arvo 1–3) | Eksponentti, joka korostaa ääriarvoja (katso linkki edellisessä) |

:::tip
Hinta- ja sijalukurajaa voi säätää myös avaamatta Määrittele-näkymää uudelleen. Käytä siihen kojelaudalla tai automaatiossa entiteettejä **Hintaraja** (`number.kilowahti_{name}_price_threshold`) ja **Sijalukuraja** (`number.kilowahti_{name}_rank_threshold`).
:::

### 5. Optimointipisteet

Pysyvä **Total**-profiili luodaan automaattisesti. Voit liittää Home Assistantiin kytketyn energiamittarisi myöhemmin Kilowahtiin kohdassa **Määrittele → Pisteprofiilit → Edit: Total**.

Lisäprofiileja voi luoda tarpeen mukaan esim. laite- tai ryhmäkohtaisille mittareille. Lisäprofiililla voi siis esimerkiksi tarkkailla lämminvesivaraajan tai muun lämmityslaitteen hintaoptimoinnin tulosta.

### 6. Lisäasetukset

| Kenttä | Kuvaus |
|---|---|
| Näytä spot-hintataulukot anturin attribuutteina | Kirjoittaa `today_prices`- ja `tomorrow_prices`-taulukot `spot_price`-anturin attribuutteihin. Tämä toiminto on hyödyllinen graafikorteille (esim. Apex Charts) |
| Näytä kokonaishintataulukot anturin attribuutteina | Sama kuin edellä, mutta `total_price`-anturille; jokainen rivi on eritelty osiin `energy` ja `transfer` *(versiosta 2026.9.0)* |
| Suuri tarkkuus | Näyttää hinta-antureissa ja hintataulukoissa enemmän desimaaleja. Tätä asetusta voidaan tarvita joissain erikoistapauksissa, mutta sen asettaminen ei yleensä ole tarpeen. |

#### Hintataulukoiden attribuutit

Molemmat valinnat ovat oletuksena pois päältä. Arvot pyöristetään näyttötarkkuuteen (oletuksena kaksi desimaalia, suuren tarkkuuden tilassa viisi desimaalia; molemmissa on kaksi desimaalia enemmän, jos näyttöyksikkö on `€/kWh`).

Taulukoita ei tallenneta tietokantaan, joten ne eivät kasvata sitä eivätkä näy historiassa. Ne kuvaavat kuluvaa ja seuraavaa päivää, ja ne luetaan vain anturin reaaliaikaisesta tilasta.

`spot_price`-rivit:

```yaml
today_prices:
  - time: "2026-09-07T14:00:00+03:00"
    price: 12.34
    rank: 7
```

`total_price`-riveillä on lisäksi erittely: `price` on kahden pyöristetyn osan summa ja `rank` kokonaishinnan sijaluku kyseisen päivän sisällä (1 = halvin). `transfer` on `0.0`, jos siirtohintoja ei ole määritetty:

```yaml
today_prices:
  - time: "2026-09-07T14:00:00+03:00"
    energy: 8.90
    transfer: 3.44
    price: 12.34
    rank: 7
```

Attribuutti `tomorrow_prices` ilmestyy, kun huomisen hinnat on haettu. Poikkeus on `total_price` sellaisen [kiinteähintaisen jakson](/fi/fixed-periods/) aikana, joka kattaa myös huomisen: jaksojen hinnat ovat jo tiedossa, joten taulukko julkaistaan aina vuorokauden vaihtuessa spot-hintoja odottamatta.

## Asetusten muuttaminen

Kaikkia asetuksia alkuperäistä aluetta lukuun ottamatta voi muuttaa milloin tahansa kohdassa **Määrittele** (hammasratas-ikoni) ilman Home Assistantin uudelleenkäynnistystä.

Nimetäksesi esiintymän uudelleen avaa **Asetukset → Laitteet & palvelut → Kilowahti**, avaa esiintymän valikko ja valitse **Uudelleenmääritä**. Esiintymän otsikko ja yksilöllinen tunnus päivittyvät uuden nimen mukaisiksi, ja kaikki muut asetukset säilyvät ennallaan. Jos uusi nimi on järjestelmässäsi jo jonkin toisen Kilowahti-esiintymän käytössä, sitä ei hyväksytä. Uudelleennimeäminen ei muuta olemassaolevien entiteettien tunnuksia. *(versiosta 2026.11.0)*

:::caution[Vältä näyttöyksikön vaihtamista asennuksen jälkeen]
**Näyttöyksikön** (Suomessa `c/kWh` tai `€/kWh`) vaihtaminen sen jälkeen, kun anturit ovat jo tallentaneet tietoja, voi aiheuttaa yksikköristiriitoja historiakaavioissa. Saatat joutua poistamaan anturien historian tai päivittämään kojelaudan kortit käsin.
:::
