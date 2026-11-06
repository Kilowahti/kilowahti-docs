// Reads files of the integration: $KILOWAHTI_INTEGRATION, the sibling ha-kilowahti checkout, or GitHub main.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const REMOTE = 'https://raw.githubusercontent.com/Kilowahti/ha-kilowahti/main/custom_components/kilowahti/';
const sibling = fileURLToPath(new URL('../../ha-kilowahti/custom_components/kilowahti/', import.meta.url));
const local = process.env.KILOWAHTI_INTEGRATION ?? sibling;

export async function readIntegrationFile(path) {
	if (existsSync(local + path)) return readFileSync(local + path, 'utf8');
	const response = await fetch(REMOTE + path);
	if (!response.ok) throw new Error(`${REMOTE + path}: ${response.status}`);
	return response.text();
}
