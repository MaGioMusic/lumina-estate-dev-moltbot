import { z } from 'zod';

// Core listing types used by the property listing wizard

export const priceSchema = z
  .number({ required_error: 'Price is required' })
  .min(0, 'Price must be positive')
  .max(1_000_000_000, 'Price is too large');

export const step1DetailsSchema = z.object({
  price: priceSchema,
  streetAddress: z
    .string({ required_error: 'Street address is required' })
    .min(3, 'Enter a valid address')
    .max(200, 'Address too long'),
  unit: z.string().max(50).optional().or(z.literal('')),
  city: z.string({ required_error: 'City is required' }).min(1),
  state: z.string({ required_error: 'State is required' }).min(1),
  // Accept international postal codes: 3–10 chars, digits/letters/space/-
  zip: z
    .string({ required_error: 'ZIP is required' })
    .regex(/^[A-Za-z0-9\-\s]{3,10}$/i, 'Enter a valid ZIP or postal code'),
});

export type Step1Details = z.infer<typeof step1DetailsSchema>;

export interface ListingDraft {
  step1?: Step1Details;
  // Future steps will be added incrementally
}

export const emptyStep1Details: Step1Details = {
  price: 0,
  streetAddress: '',
  unit: '',
  city: '',
  state: '',
  zip: '',
};


