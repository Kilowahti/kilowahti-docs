# Installation

## Via the Marketplace (Home Assistant 2026.11 and newer)

From Home Assistant 2026.11, HACS is built into Home Assistant as the Marketplace. Kilowahti is available there from the same default catalog.

1. Open **Settings → Marketplace** (accept the community-content notice on first use)
2. Search for **Kilowahti** and click **Install**
3. Complete the setup wizard that opens. No restart is needed for a first install; updates still require one.

## Via HACS (Home Assistant 2026.10 and older)

Kilowahti is available in the [HACS](https://hacs.xyz/) default repository.

1. Open HACS in your Home Assistant instance
2. Search for **Kilowahti** and click **Download**
3. Restart Home Assistant
4. Go to **Settings → Devices & Services → Add Integration** and search for **Kilowahti**

## Manual installation

1. Download the latest release ZIP from [GitHub Releases](https://github.com/Kilowahti/ha-kilowahti/releases)
2. Extract `custom_components/kilowahti/` into your HA config directory
3. Restart Home Assistant
4. Add the integration via **Settings → Devices & Services**

## Requirements

- Home Assistant 2026.7 or newer — the triggers and conditions Kilowahti provides use platform APIs introduced in that release
- Outbound HTTPS access to `cdn.kilowahti.fi` (primary price source) and `api.spot-hinta.fi` (automatic fallback)
