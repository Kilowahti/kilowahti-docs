// Writes src/data/services.json from the integration's services.yaml.
// With --check, only verifies that the committed file is current.
import { readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'yaml';
import { readIntegrationFile } from './_integration-source.mjs';

const target = new URL('../src/data/services.json', import.meta.url);

function describeType(selector) {
	const [kind, options] = Object.entries(selector ?? {})[0] ?? ['text'];
	const range =
		kind === 'number' && options?.min !== undefined
			? `${options.min}–${options.max}${options.unit_of_measurement ? ` ${options.unit_of_measurement}` : ''}`
			: undefined;
	return { type: kind, ...(range && { range }) };
}

const services = parse(await readIntegrationFile('services.yaml'));
const data = Object.fromEntries(
	Object.entries(services).map(([service, { fields = {} }]) => [
		service,
		Object.entries(fields)
			.filter(([field]) => field !== 'config_entry_id')
			.map(([field, f]) => ({
				field,
				required: f.required ?? false,
				default: f.default ?? null,
				...describeType(f.selector),
				description: String(f.description ?? '').replace(/\s+/g, ' ').trim(),
			})),
	]),
);
const output = JSON.stringify(data, null, '\t') + '\n';

if (process.argv.includes('--check')) {
	if (readFileSync(target, 'utf8') !== output) {
		console.error('src/data/services.json is out of date: run npm run sync:services');
		process.exit(1);
	}
	console.log(`${Object.keys(data).length} services, src/data/services.json is current`);
} else {
	writeFileSync(target, output);
	console.log(`wrote ${Object.keys(data).length} services`);
}
