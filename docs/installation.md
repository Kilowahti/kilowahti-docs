# Installation

## Via HACS (recommended)

1. Open HACS in your Home Assistant instance
2. Go to **Integrations** → menu (⋮) → **Custom repositories**
3. Add `https://github.com/Kilowahti/ha-kilowahti` with category **Integration**
4. Search for **Kilowahti** and click **Download**
5. Restart Home Assistant
6. Go to **Settings → Devices & Services → Add Integration** and search for **Kilowahti**

## Manual installation

1. Download the latest release ZIP from [GitHub Releases](https://github.com/Kilowahti/ha-kilowahti/releases)
2. Extract `custom_components/kilowahti/` into your HA config directory
3. Restart Home Assistant
4. Add the integration via **Settings → Devices & Services**

## Requirements

- Home Assistant 2023.7 or newer
- Network access to `api.spot-hinta.fi`
