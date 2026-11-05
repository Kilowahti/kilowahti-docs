# Miten teen…?

Tämä sivu on oikotie muuhun dokumentaatioon. Sisältö on jaoteltu sen mukaan, mitä olet tekemässä, eikä sen mukaan, mihin integraation osaan asia kuuluu.

## Aloitus

| Haluan… | Katso |
|---|---|
| Asentaa Kilowahdin | [Asennus](installation.md) |
| Ottaa sen käyttöön ensimmäistä kertaa | [Ensimmäinen käyttöönotto](getting-started.md) |
| Ymmärtää termin, johon törmään jatkuvasti | [Sanasto](glossary.md) |
| Tietää, mitkä entiteetit oikeasti ovat tärkeitä | [Entiteetit → Aloita näistä](entities.md) |

## Laitteiden käyttö sähkön ollessa halpaa

| Haluan… | Katso |
|---|---|
| Kytkeä jotain päälle halpoina tunteina | [Laukaisimet ja ehdot](triggers-conditions.md), YAMLia ei tarvita |
| Muuttaa sitä, mikä lasketaan "halvaksi" | [Ensimmäinen käyttöönotto → Säädä kynnysarvoja myöhemmin](getting-started.md) |
| Säätää sitä kojelaudalta tai automaatiosta | `price_threshold`- ja `rank_threshold`-[numeroentiteetit](entities.md) |
| Säätää laitetta portaattomasti päälle ja pois kytkemisen sijaan | [Ohjauskerroin](control-factor.md) |
| Ajastaa laitteen halvimpaan tulevaan jaksoon | [`kilowahti.cheapest_hours`](services.md) |
| Kopioida valmiin, toimivan automaation | [Automaatioesimerkit](automations.md) |

## Hintojen saaminen vastaamaan sähkölaskua

| Haluan… | Katso |
|---|---|
| Lisätä verkkoyhtiöni siirtomaksut | [Siirtohinnat](transfer-pricing.md) |
| Käyttää aikasiirtoa (päivä/yö) tai kausisiirtoa | [Siirtohinnat → Esimerkit](transfer-pricing.md) |
| Kertoa Kilowahdille kiinteähintaisesta sopimuksestani | [Kiinteän hinnan jaksot](fixed-periods.md) |
| Korjata ALV:n, sähköveron tai myyjän marginaalin | [Asetukset → ALV ja sähkövero](configuration.md) |
| Näyttää hinnat paikallisessa valuutassani | [Asetukset → Näyttövaluutta](configuration.md) |
| Selvittää, miksi lukuni poikkeavat laskusta | [Vianmääritys](troubleshooting.md) |

## Kojelaudan rakentaminen

| Haluan… | Katso |
|---|---|
| Näyttää nykyisen hinnan ja tilan | [Ensimmäinen käyttöönotto → pieni kojelautakortti](getting-started.md) |
| Piirtää hintakäyrän tälle päivälle ja huomiselle | Ota hintataulukot käyttöön kohdassa [Asetukset → Lisäasetukset](configuration.md) |
| Nähdä, kuinka hyvin olen siirtänyt kulutustani | [Optimointipisteet](scores.md) |

## Aurinkosähkö, akku ja myynti

| Haluan… | Katso |
|---|---|
| Nähdä, mitä verkkoon myymäni sähkö on arvoista | Ota tuotanto käyttöön ja katso sitten [myyntianturit](entities.md) |
| Löytää parhaat tunnit myydä | [`kilowahti.best_export_hours`](services.md) |
| Ladata akkua halvalla sähköllä | [Automaatioesimerkit → akku](automations.md) |
| Suunnitella aurinkoennusteen mukaan | [`kilowahti.generation_schedule`](services.md) |

## Ongelmien korjaaminen

| Haluan… | Katso |
|---|---|
| Selvittää, miksi hinnat puuttuvat tai ovat vääriä | [Vianmääritys](troubleshooting.md) |
| Ymmärtää, miksi huomisen hinnat puuttuvat | [Vianmääritys → Huomisen hinnat puuttuvat](troubleshooting.md) |
| Selvittää, miksi entiteettiä ei ole olemassa | [Vianmääritys → Entiteetti puuttuu kokonaan](troubleshooting.md) |
| Ilmoittaa virheestä tai ehdottaa ominaisuutta | [GitHub](https://github.com/Kilowahti/ha-kilowahti/issues) tai [palautelomake](https://tally.so/r/QK05XY) |
