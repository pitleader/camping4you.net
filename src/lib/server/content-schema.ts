/**
 * Runtime validation for the operator-editable `content.json`. The save action
 * validates against this before committing, so a malformed edit can never reach
 * the repo. Mirrors `EditableContent` in `$lib/content/site.ts`.
 *
 * Copy-truth: a price is either a non-empty string or `null` — an empty input
 * becomes `null` ("Call for rates"), never an invented value.
 */
import { z } from 'zod';

const price = z
	.string()
	.trim()
	.transform((s) => (s.length ? s : null))
	.nullable();

const rate = z.object({
	name: z.string().trim().min(1),
	price,
	note: z.string().trim()
});

const ruleSection = z.object({
	heading: z.string().trim().min(1),
	rules: z.array(z.string().trim().min(1))
});

const openingHours = z.object({
	days: z.array(z.string()),
	opens: z.string().regex(/^\d{2}:\d{2}$/),
	closes: z.string().regex(/^\d{2}:\d{2}$/)
});

export const contentSchema = z.object({
	tagline: z.string().trim().min(1),
	description: z.string().trim().min(1),
	email: z.string().trim().email(),
	reviewUrl: z.union([z.string().trim().url(), z.literal('')]),
	phone: z.object({
		display: z.string().trim().min(1),
		href: z.string().trim().min(1)
	}),
	address: z.object({
		street: z.string().trim().min(1),
		city: z.string().trim().min(1),
		region: z.string().trim().min(1),
		regionCode: z.string().trim().length(2),
		postalCode: z.string().trim().min(1),
		country: z.string().trim().min(1)
	}),
	hours: z.object({
		display: z.string().trim().min(1),
		specification: z.array(openingHours)
	}),
	rates: z.object({
		categories: z.array(rate),
		extras: z.array(rate)
	}),
	rules: z.object({
		checkIn: z.string().trim().min(1),
		checkOut: z.string().trim().min(1),
		quietHours: z.string().trim().min(1),
		speedLimit: z.string().trim().min(1),
		sections: z.array(ruleSection)
	}),
	sms: z.object({
		effectiveDate: z.string().trim().min(1),
		intro: z.string().trim().min(1),
		samples: z.array(z.object({ label: z.string().trim().min(1), body: z.string().trim().min(1) })),
		details: z.array(z.string().trim().min(1))
	}),
	legal: z.object({ effectiveDate: z.string().trim().min(1) })
});

export type EditableContentParsed = z.infer<typeof contentSchema>;
