---
title: "Numeroentiteetit"
---

Numeroentiteetit ovat kirjoitettavissa olevia asetuksia, joita voi säätää kojelaudalta tai automaatioista `number.set_value`-palvelulla. Muutokset tulevat voimaan heti, eikä uudelleenkäynnistystä tai uudelleenmääritystä tarvita.

| Entiteetti | Vaihteluväli | Kuvaus |
|---|---|---|
| **Hintaraja**<br>`number.kilowahti_{name}_price_threshold` | 0–500 pienemmässä yksikössä (0–5 suuremmassa) | Hinta, jossa tai jonka alapuolella `price_acceptable` kytkeytyy päälle. Asetuksen yksikkö on sama kuin valitsemasi näyttöyksikkö. |
| **Sijalukuraja**<br>`number.kilowahti_{name}_rank_threshold` | 1–96 (tai 1–24) | Sijaluku, jossa tai jonka alapuolella `rank_acceptable` kytkeytyy päälle. Yläraja riippuu valitusta hintaresoluutiosta. |

Alkuarvot tulevat **Kynnysarvot ja ohjaus** -asetuksista. Näiden entiteettien kautta tehdyt muutokset tallennetaan integraation asetuksiin, joten ne säilyvät uudelleenkäynnistysten yli ja päivittävät myös asetusnäkymässä näkyvät arvot.
