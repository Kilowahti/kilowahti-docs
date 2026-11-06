---
title: "Miten teen…?"
---

Tämä sivu on oikotie muuhun dokumentaatioon. Sisältö on jaoteltu sen mukaan, mitä olet tekemässä, eikä sen mukaan, mihin integraation osaan asia kuuluu.

## Aloitus

| Haluan… | Katso |
|---|---|
| Asentaa Kilowahdin | [Asennus](/fi/installation/) |
| Ottaa sen käyttöön ensimmäistä kertaa | [Ensimmäinen käyttöönotto](/fi/getting-started/) |
| Ymmärtää termin, johon törmään jatkuvasti | [Sanasto](/fi/glossary/) |
| Tietää, mitkä entiteetit oikeasti ovat tärkeitä | [Entiteetit → Aloita näistä](/fi/entities/) |

## Laitteiden käyttö sähkön ollessa halpaa

| Haluan… | Katso |
|---|---|
| Kytkeä jotain päälle halpoina tunteina | [Laukaisimet ja ehdot](/fi/triggers-conditions/), YAMLia ei tarvita |
| Muuttaa sitä, mikä lasketaan "halvaksi" | [Ensimmäinen käyttöönotto → Säädä kynnysarvoja myöhemmin](/fi/getting-started/) |
| Säätää sitä kojelaudalta tai automaatiosta | `price_threshold`- ja `rank_threshold`-[numeroentiteetit](/fi/entities/number-entities/) |
| Säätää laitetta portaattomasti päälle ja pois kytkemisen sijaan | [Ohjauskerroin](/fi/control-factor/) |
| Ajastaa laitteen halvimpaan tulevaan jaksoon | [`kilowahti.cheapest_hours`](/fi/services/) |
| Kopioida valmiin, toimivan automaation | [Automaatioesimerkit](/fi/automations/) |

## Hintojen saaminen vastaamaan sähkölaskua

| Haluan… | Katso |
|---|---|
| Lisätä verkkoyhtiöni siirtomaksut | [Siirtohinnat](/fi/transfer-pricing/) |
| Käyttää aikasiirtoa (päivä/yö) tai kausisiirtoa | [Siirtohinnat → Esimerkit](/fi/transfer-pricing/) |
| Kertoa Kilowahdille kiinteähintaisesta sopimuksestani | [Kiinteän hinnan jaksot](/fi/fixed-periods/) |
| Korjata ALV:n, sähköveron tai myyjän marginaalin | [Asetukset → ALV ja sähkövero](/fi/configuration/) |
| Näyttää hinnat paikallisessa valuutassani | [Asetukset → Näyttövaluutta](/fi/configuration/) |
| Selvittää, miksi lukuni poikkeavat laskusta | [Vianmääritys](/fi/troubleshooting/) |

## Kojelaudan rakentaminen

| Haluan… | Katso |
|---|---|
| Näyttää nykyisen hinnan ja tilan | [Ensimmäinen käyttöönotto → pieni kojelautakortti](/fi/getting-started/) |
| Piirtää hintakäyrän tälle päivälle ja huomiselle | Ota hintataulukot käyttöön kohdassa [Asetukset → Lisäasetukset](/fi/configuration/) |
| Nähdä, kuinka hyvin olen siirtänyt kulutustani | [Optimointipisteet](/fi/scores/) |

## Aurinkosähkö, akku ja myynti

| Haluan… | Katso |
|---|---|
| Nähdä, mitä verkkoon myymäni sähkö on arvoista | Ota tuotanto käyttöön ja katso sitten [myyntianturit](/fi/entities/optional-sensors/#tuotanto--ja-myyntianturit) |
| Löytää parhaat tunnit myydä | [`kilowahti.best_export_hours`](/fi/services/) |
| Ladata akkua halvalla sähköllä | [Automaatioesimerkit → akku](/fi/automations/) |
| Suunnitella aurinkoennusteen mukaan | [`kilowahti.generation_schedule`](/fi/services/) |

## Ongelmien korjaaminen

| Haluan… | Katso |
|---|---|
| Selvittää, miksi hinnat puuttuvat tai ovat vääriä | [Vianmääritys](/fi/troubleshooting/) |
| Ymmärtää, miksi huomisen hinnat puuttuvat | [Vianmääritys → Huomisen hinnat puuttuvat](/fi/troubleshooting/) |
| Selvittää, miksi entiteettiä ei ole olemassa | [Vianmääritys → Entiteetti puuttuu kokonaan](/fi/troubleshooting/) |
| Ilmoittaa virheestä tai ehdottaa ominaisuutta | [GitHub](https://github.com/Kilowahti/ha-kilowahti/issues) tai [palautelomake](https://tally.so/r/QK05XY) |
