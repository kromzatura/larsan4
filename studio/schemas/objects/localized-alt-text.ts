import { defineType, defineField } from 'sanity';
import { Type as TypeIcon } from 'lucide-react';

// Gate 3 Activation: Localized alt text object.
// Phase 1 (Gate 3): Optional, warning-level guidance only.
// Phase 2 (Gate 4): Enforce required for new images.
// Phase 3 (Gate 5): Enforce required for all locales (migration complete).
export default defineType({
	name: 'localizedAltText',
	title: 'Localized Alt Text',
	type: 'object',
	icon: TypeIcon,
	description: 'Provide meaningful alternative text in each supported language. Leave locale empty only if truly decorative.',
	fields: [
		defineField({
			name: 'en',
			type: 'string',
			description: 'English alt text (3–140 chars ideally)',
			validation: (rule) => rule.min(3).warning('Short alt may be unhelpful'),
		}),
		defineField({
			name: 'nl',
			type: 'string',
			description: 'Dutch alt text',
		}),
	],
	preview: {
		select: { en: 'en', nl: 'nl' },
		prepare({ en, nl }) {
			return {
				title: en || nl || 'Localized Alt Text',
				subtitle: [en && 'EN', nl && 'NL'].filter(Boolean).join(' · ') || 'No values yet',
			};
		},
	},
});
