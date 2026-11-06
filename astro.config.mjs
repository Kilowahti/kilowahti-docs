// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// Pages that lived at the site root before the manual moved under /en/.
const LEGACY_PATHS = [
	'/automations/',
	'/changelog/',
	'/configuration/',
	'/control-factor/',
	'/entities/',
	'/faq/',
	'/fixed-periods/',
	'/getting-started/',
	'/glossary/',
	'/how-do-i/',
	'/installation/',
	'/lib/',
	'/lib/calc/',
	'/lib/const/',
	'/lib/models/',
	'/lib/sources/',
	'/scores/',
	'/services/',
	'/supported-regions/',
	'/transfer-pricing/',
	'/triggers-conditions/',
	'/troubleshooting/',
];

export default defineConfig({
	site: 'https://docs.kilowahti.fi',
	redirects: {
		'/': '/en/',
		...Object.fromEntries(LEGACY_PATHS.map((path) => [path, `/en${path}`])),
	},
	// Keep straight quotes and hyphens as written in the source.
	markdown: { processor: satteri({ features: { smartPunctuation: false } }) },
	integrations: [
		starlight({
			title: 'Kilowahti',
			description:
				'Home Assistant integration for European electricity spot pricing and cost optimization',
			logo: {
				light: './src/assets/logo.png',
				dark: './src/assets/dark_logo.png',
				alt: 'Kilowahti',
				replacesTitle: true,
			},
			favicon: '/favicon.png',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Kilowahti/ha-kilowahti' },
			],
			// Lets long entity IDs in table cells wrap after "_" and "." instead of mid-word.
			head: [
				{
					tag: 'script',
					content:
						"document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('.sl-markdown-content td code').forEach((c)=>{c.innerHTML=c.innerHTML.replace(/([_.])/g,'$1<wbr>')}))",
				},
			],
			customCss: ['./src/styles/custom.css'],
			lastUpdated: true,
			plugins: [starlightLinksValidator()],
			defaultLocale: 'en',
			locales: {
				en: { label: 'English', lang: 'en' },
				fi: { label: 'Suomi', lang: 'fi' },
			},
			sidebar: [
				{ slug: 'index', label: 'Home', translations: { fi: 'Etusivu' } },
				{
					label: 'Getting started',
					translations: { fi: 'Aloitus' },
					items: [
						{ slug: 'installation', label: 'Installation', translations: { fi: 'Asennus' } },
						{ slug: 'getting-started', label: 'First setup', translations: { fi: 'Ensimmäinen käyttöönotto' } },
						{ slug: 'configuration', label: 'Configuration', translations: { fi: 'Asetukset' } },
					],
				},
				{
					label: 'Reference',
					translations: { fi: 'Viitteet' },
					items: [
						{
							label: 'Entities',
							collapsed: true,
							translations: { fi: 'Entiteetit' },
							items: [
								{ slug: 'entities', label: 'Overview', translations: { fi: 'Yleiskatsaus' } },
								{ slug: 'entities/price-and-rank' },
								{ slug: 'entities/binary-sensors' },
								{ slug: 'entities/optimization-and-diagnostics' },
								{ slug: 'entities/optional-sensors' },
								{ slug: 'entities/number-entities' },
							],
						},
						{ slug: 'services', label: 'Services', translations: { fi: 'Palvelut' } },
						{ slug: 'supported-regions', label: 'Supported regions', translations: { fi: 'Tuetut alueet' } },
					],
				},
				{
					label: 'Guides',
					translations: { fi: 'Oppaat' },
					items: [
						{ slug: 'how-do-i', label: 'How do I…?', translations: { fi: 'Miten teen…?' } },
						{ slug: 'triggers-conditions', label: 'Triggers and conditions', translations: { fi: 'Laukaisimet ja ehdot' } },
						{ slug: 'automations', label: 'Automation examples', translations: { fi: 'Automaatioesimerkit' } },
						{ slug: 'control-factor', label: 'Control factor', translations: { fi: 'Ohjauskerroin' } },
						{ slug: 'scores', label: 'Optimization scores', translations: { fi: 'Optimointipisteet' } },
						{ slug: 'transfer-pricing', label: 'Transfer pricing', translations: { fi: 'Siirtohinnat' } },
						{ slug: 'fixed-periods', label: 'Fixed-price periods', translations: { fi: 'Kiinteän hinnan jaksot' } },
					],
				},
				{
					label: 'Help',
					translations: { fi: 'Ohje' },
					items: [
						{ slug: 'troubleshooting', label: 'Troubleshooting', translations: { fi: 'Vianmääritys' } },
						{ slug: 'glossary', label: 'Glossary', translations: { fi: 'Sanasto' } },
					],
				},
				{ slug: 'faq', label: 'FAQ', translations: { fi: 'UKK' } },
				{ slug: 'changelog', label: 'Changelog', translations: { fi: 'Changelog (EN)' } },
				{
					label: 'Library',
					translations: { fi: 'Library (EN)' },
					collapsed: true,
					items: [
						{ slug: 'lib', label: 'Overview' },
						{ slug: 'lib/models', label: 'Models' },
						{ slug: 'lib/calc', label: 'Calculations' },
						{ slug: 'lib/sources', label: 'Price sources' },
						{ slug: 'lib/const', label: 'Constants' },
					],
				},
			],
		}),
	],
});
