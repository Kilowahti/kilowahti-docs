# Installation

## Via the Marketplace (Home Assistant 2026.11 and newer)

From Home Assistant 2026.11, **HACS** is built into Home Assistant as the Marketplace. Kilowahti is available there.

1. Open **Settings → Marketplace** (accept the community-content notice on first use)
2. Search for **Kilowahti** and click **Install**
3. Complete the setup wizard that starts automatically. A first install needs no restart; however, with later version updates Home Assistant has to be restarted, as before with HACS.

## Via HACS (Home Assistant 2026.10 and older)

Kilowahti is available directly in the [HACS](https://hacs.xyz/) default repository.

1. Open **HACS** in your Home Assistant instance
2. Search for **Kilowahti** and click **Download**
3. Restart Home Assistant
4. Enable Kilowahti like this: **Settings → Devices & Services → Add Integration** and find **Kilowahti** from the list

## Manual installation (advanced users only)

1. Download the latest release ZIP (`kilowahti.zip`) from [GitHub Releases](https://github.com/Kilowahti/ha-kilowahti/releases)
2. Extract the contents of the file into `custom_components/kilowahti/` in your HA config directory
3. Restart Home Assistant
4. Add the integration via **Settings → Devices & Services**

## Requirements

- **Home Assistant version 2026.7 or newer.** The triggers and conditions Kilowahti provides use APIs introduced in that version.
- **Outbound HTTPS access** to `cdn.kilowahti.fi` (primary price source) and `api.spot-hinta.fi` (automatic fallback)
