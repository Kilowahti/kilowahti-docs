// Verifies that the entities pages and translations/en.json list the same entities.
import { readdirSync, readFileSync } from 'node:fs';
import { readIntegrationFile } from './_integration-source.mjs';

const json = await readIntegrationFile('translations/en.json');

const expected = new Set(
	Object.entries(JSON.parse(json).entity).flatMap(([platform, items]) =>
		Object.keys(items).map((key) => `${platform}.kilowahti_{name}_${key.replace(/^score_/, "score_{profile}_")}`),
	),
);

const dir = new URL('../src/content/docs/en/entities/', import.meta.url);
const docs = readdirSync(dir)
	.map((f) => readFileSync(new URL(f, dir), 'utf8'))
	.join('\n');
const documented = new Set(
	docs.match(/\b(?:sensor|binary_sensor|number)\.kilowahti_\{name\}_[\w{}]+/g) ?? [],
);

const missing = [...expected].filter((id) => !documented.has(id));
const unknown = [...documented].filter((id) => !expected.has(id));

for (const id of missing) console.error(`not documented: ${id}`);
for (const id of unknown) console.error(`not in en.json:  ${id}`);
console.log(`${expected.size} entities in en.json, ${documented.size} in entities/`);
process.exit(missing.length || unknown.length ? 1 : 0);
