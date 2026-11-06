---
title: "Usein kysyttyä"
---

## Miksi huomisen hinnat eivät näy?

Seuraavan päivän hinnat julkaistaan iltapäivällä, yleensä hieman yli klo 13:00 CET (klo 14:00 Suomen aikaa), ja Kilowahti hakee ne automaattisesti. Siihen asti `tomorrow_*`-anturit näyttävät tilaa *Tuntematon*, mikä on odotettua. Tarkemmin ja mitä tarkistaa, jos hinnat eivät saavu lainkaan: [Huomisen hinnat puuttuvat](/fi/troubleshooting/#huomisen-hinnat-puuttuvat).

## Kuinka usein Kilowahti kutsuu hintalähdettä?

Kilowahti kutsuu hintalähdettä (Kilowahti CDN tai varalla spot-hinta.fi) harvoin, ja kutsut ovat pieniä. Tavallisena päivänä:

1. Home Assistantin käynnistyessä, jos paikallinen välimuisti on vanhentunut
2. Tehostetun haun ikkunan alusta (oletuksena klo 13:00 CET) kerran minuutissa, kunnes huomisen hinnat on julkaistu, yleensä enintään 15 minuutin ajan. Ensimmäinen onnistunut haku päättää päivän pollauksen
3. Keskiyön vaihteessa, vain jos huomisen välimuisti oli tyhjä

Muuta valuuttaa kuin euroa käyttävillä alueilla haetaan lisäksi EKP:n vaihtokurssi kerran päivässä. Anturien arvot (sijaluku, hinta jne.) päivittyvät muistissa olevasta välimuistista, joten verkkokutsuja ei tarvita.

## Voiko Kilowahtia käyttää ilman siirtohintaa?

Kyllä. Siirtoon liittyvät anturit (`transfer_price`, `control_factor_transfer`) näkyvät tilassa **Tuntematon**, kun siirtoryhmiä ei ole määritetty. `total_price` on tällöin sama kuin aktiivinen hinta.

## Mitä ohjauskerroinanturi tekee?

Se muuntaa nykyisen hinnan sijaluvun luvuksi välillä 0–1 — vuorokauden halvimmalla jaksolla 1,0, kalleimmalla 0,0 — sellaisten laitteiden automatisointiin, joita säädetään portaattomasti eikä pelkästään päälle ja pois: lämmityksen asetusarvot, latausvirta, puhaltimen nopeus. Jokaisesta ohjauskertoimesta on myös ±1-asteikolla toimiva bipolaarinen versio.

[Ohjauskerroinopas](/fi/control-factor/) kertoo, mitä kolmesta kertoimesta kannattaa käyttää, mitä käyrä- ja skaalausasetukset tekevät ja miten kertoimen saa käyttöön Template-lausekkeessa.

## Pisteanturini eivät näytä arvoa, miksi?

Pisteanturit saavat arvon vasta, kun energiamittari on liitetty ja se on ehtinyt mitata kulutusta. Tarvittavat asetukset: [Optimointianturilla ei ole arvoa](/fi/troubleshooting/#optimointianturilla-ei-ole-arvoa).

## Hinnat näyttävät väärältä — sisältävätkö ne ALV:n?

API:n spot-hinnat ovat aina verottomia. Kilowahti lisää ALV:n automaattisesti määrittämäsi verokannan mukaan. Siirtohinnat ja kiinteähintaisten jaksojen hinnat syötetään Kilowahdin asetuksiin verollisina (sis. ALV) ja käytetään sellaisenaan. Jos hinnat eroavat silti laskustasi, katso [Hinnat eivät vastaa sähkölaskuani](/fi/troubleshooting/#hinnat-eivät-vastaa-sähkölaskuani).

## Mistä hinnat tulevat?

Kilowahti hakee hinnat automaattisen lähdeketjun kautta — lähdettä ei valita asetuksista.
Ensisijainen lähde on Kilowahti CDN, Kilowahtin oma palvelu: se julkaisee
kaikkien tuettujen alueiden seuraavan päivän hinnat ENTSO-E Transparency Platformilta (Euroopan
virallinen markkinatietojen lähde) staattisena JSON-datana eurooppalaisen sisällönjakeluverkon (CDN) kautta. Tiliä tai
API-avainta ei tarvita, eikä henkilötietoja kerätä.

Jos CDN:ään ei saada yhteyttä, Kilowahti siirtyy käyttämään ilmaista kolmannen osapuolen API:a
spot-hinta.fi. Molemmat tarjoavat samat pörssin seuraavan päivän hinnat, joten anturien arvot ovat samat
kummassakin tapauksessa. Huomaa, että spot-hinta.fi kattaa vain Pohjoismaiden ja Baltian hinta-alueet; muilla alueilla
Kilowahti CDN on ainoa lähde, joten varalähdettä ei ole (vaihtoehtoja selvitetään, lupaan sen).

Diagnostiikka-anturi `price_data_source` näyttää, mikä lähde on kulloinkin käytössä.

## Mitä tapahtuu, jos hintalähteet eivät ole käytettävissä?

Kilowahti jatkaa tietojen tarjoamista paikallisesta välimuistista. Niin kauan kuin välimuistissa on kelvolliset jaksot kuluvalle päivälle, kaikki anturit päivittyvät normaalisti — päivitykset eivät vaadi verkkokutsua. Jos välimuisti on tyhjä tai vanhentunut eikä yksikään ketjun lähteistä vastaa, hinta-anturit muuttuvat tilaan **Ei saatavissa**. Automaatiot kannattaa testata, jotta ne toimivat turvallisesti (fail-closed), kun anturit eivät ole käytettävissä. Mitä tarkistaa, kun hintoja ei tule lainkaan: [Ei lainkaan hintoja](/fi/troubleshooting/#ei-lainkaan-hintoja).

## Miten paikallisen valuutan näyttäminen toimii?

Euroalueen ulkopuolisilla alueilla kaikki hinnat voi näyttää paikallisessa laskutusvaluutassa (katso
[Asetukset](/fi/configuration/)). Sähkömarkkinoilla kaupankäynti tapahtuu aina euroissa, Kilowahti muuntaa hinnat päivittäisellä vaihtokurssilla. Oletuksena käytetään
EKP:n viitekurssia, tai vaihtoehtoisesti itse syöttämääsi manuaalista kurssia. Kurssi pysyy samana koko päivän, joten jo
julkaistujen jaksojen hinnat eivät muutu kesken päivän. Vaihtaminen euron ja paikallisen valuutan välillä
muuntaa syöttämäsi hinnat (marginaali, siirtohinnat, kiinteähintaiset jaksot, kynnysarvot)
automaattisesti. Huomaa, että ennen valuutan vaihtoa tallennetut Home Assistantin pitkän aikavälin tilastot
säilyttävät vanhan yksikkönsä, eikä niitä muunneta.

## Voiko Kilowahti-esiintymiä olla useita, esimerkiksi jos mökkini on toisella hinta-alueella?

Kyllä - lisää Kilowahti-integraatioon lisää esiintymiä eri nimillä ja alueilla (**Asetukset → Laitteet & palvelut → Kilowahti → Lisää esiintymä**). Palvelukutsut, joissa ei ole määritetty `config_entry_id`-arvoa, toimivat automaattisesti, kun määritettynä on vain yksi esiintymä.
