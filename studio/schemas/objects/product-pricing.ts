import { defineType, defineField } from 'sanity';
import { Coins } from 'lucide-react';

export default defineType({
	name: 'productPricing',
	title: 'Product Pricing',
	type: 'object',
	icon: Coins,
	description: 'Normalized pricing container with base currency and tiers.',
	groups: [
		{ name: 'config', title: 'Configuration', icon: Coins },
		{ name: 'tiers', title: 'Tiers', icon: Coins },
	],
	fields: [
		defineField({
			name: 'currency',
			type: 'string',
			group: 'config',
			options: {
				list: [
					{ title: 'EUR', value: 'EUR' },
					{ title: 'USD', value: 'USD' },
				],
				layout: 'radio',
			},
			initialValue: 'EUR',
			validation: (rule) => rule.required().error('Base currency required'),
			description: 'Select the base currency for numeric values.',
		}),
		defineField({
			name: 'tiers',
			type: 'array',
			group: 'tiers',
			of: [{ type: 'pricingTier' }],
			validation: (rule) => rule.min(1).error('At least one pricing tier required'),
			options: {
				insertMenu: {
					views: [
						{ name: 'list' },
						{ name: 'grid', previewImageUrl: () => '/sanity/preview/pricing-tier.jpg' },
					],
				},
			},
		}),
	],
	preview: {
		select: { currency: 'currency', tiers: 'tiers' },
		prepare({ currency, tiers }) {
			return {
				title: `Pricing (${currency || '—'})`,
				subtitle: Array.isArray(tiers) ? `${tiers.length} tier(s)` : 'No tiers',
			};
		},
	},
});
