import { defineType, defineField } from 'sanity';
import { Layers } from 'lucide-react';

export default defineType({
	name: 'pricingTier',
	title: 'Pricing Tier',
	type: 'object',
	icon: Layers,
	description: 'Represents a single purchasable plan / package tier.',
	groups: [
		{ name: 'meta', title: 'Meta', icon: Layers },
		{ name: 'amounts', title: 'Amounts', icon: Layers },
		{ name: 'features', title: 'Features', icon: Layers },
	],
	fieldsets: [
		{ name: 'durations', title: 'Duration Prices', options: { columns: 2 } },
	],
	fields: [
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'title' },
			validation: (rule) => rule.required().error('Tier slug required for referencing'),
			group: 'meta',
		}),
		defineField({
			name: 'title',
			type: 'string',
			validation: (rule) => rule.required().error('Tier title required'),
			group: 'meta',
		}),
		defineField({
			name: 'description',
			type: 'text',
			rows: 3,
			description: 'Short marketing description',
			group: 'meta',
			validation: (rule) => rule.max(240).warning('Keep concise (< 240 chars).'),
		}),
		defineField({
			name: 'monthly',
			title: 'Monthly Price',
			type: 'number',
			fieldset: 'durations',
			group: 'amounts',
			validation: (rule) => rule.min(0).warning('Negative price unlikely'),
		}),
		defineField({
			name: 'yearly',
			title: 'Yearly Price',
			type: 'number',
			fieldset: 'durations',
			group: 'amounts',
			validation: (rule) => rule.min(0),
		}),
		defineField({
			name: 'features',
			type: 'array',
			group: 'features',
			of: [
				defineField({
					name: 'feature',
					type: 'string',
				}),
			],
			validation: (rule) => rule.min(1).warning('A tier with no features may be unclear.'),
		}),
	],
	preview: {
		select: { title: 'title', monthly: 'monthly', yearly: 'yearly' },
		prepare({ title, monthly, yearly }) {
			let subtitle = '';
			if (monthly != null) subtitle += `Monthly: ${monthly}`;
			if (yearly != null) subtitle += (subtitle ? ' · ' : '') + `Yearly: ${yearly}`;
			return {
				title: title || 'Pricing Tier',
				subtitle: subtitle || 'No prices set',
			};
		},
	},
});
