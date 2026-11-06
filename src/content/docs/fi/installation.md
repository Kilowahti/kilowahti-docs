---
title: "Asennus"
---

## Markkinapaikan kautta (Home Assistant 2026.11 ja uudemmat)

Home Assistant 2026.11:stä alkaen **HACS** on sisäänrakennettu Home Assistantiin nimellä Markkinapaikka, Kilowahti löytyy sieltä.

1. Avaa **Asetukset → Markkinapaikka** (hyväksy yhteisön sisältöä koskeva ilmoitus ensimmäisellä käyttökerralla).
2. Hae **Kilowahti** ja napsauta **Asenna**.
3. Käy läpi automaattisesti alkava ohjattu asennus.

Ensimmäinen asennus ei vaadi uudelleenkäynnistystä, myöhemmin versiopäivitysten yhteydessä Home Assistant täytyy kuitenkin uudelleenkäynnistää kuten aiemminkin HACSin kanssa.

## HACSin kautta (Home Assistant 2026.10 ja vanhemmat)

Kilowahti löytyy suoraan [HACSin](https://hacs.xyz/) oletushakemistosta.

1. Avaa **HACS** Home Assistantissasi.
2. Hae **Kilowahti** ja napsauta **Lataa**.
3. Käynnistä Home Assistant uudelleen.
4. Ota Kilowahti käyttöön näin: **Asetukset → Laitteet & palvelut → Lisää integraatio** ja hae listasta **Kilowahti**.

## Manuaalinen asennus (vain edistyneille käyttäjille)

1. Lataa uusimman julkaisun ZIP-tiedosto (kilowahti.zip) [GitHub Releases](https://github.com/Kilowahti/ha-kilowahti/releases) -sivulta
2. Pura tiedoston sisältö `custom_components/kilowahti/` HA:n asetushakemistoon
3. Käynnistä Home Assistant uudelleen
4. Lisää integraatio kohdassa **Asetukset → Laitteet & palvelut**

## Vaatimukset

- **Home Assistant versio 2026.7 tai uudempi.** Kilowahdin laukaisimet ja ehdot käyttävät kyseisessä versiossa esiteltyjä rajapintoja.
- **Lähtevä HTTPS-yhteys** osoitteisiin `cdn.kilowahti.fi` (ensisijainen hintalähde) ja `api.spot-hinta.fi` (automaattinen varalähde)
