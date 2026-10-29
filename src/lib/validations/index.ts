import { z } from 'zod';

// --- Phone Validation ---
const ethiopianPhoneRegex = /^(\+251|0)(9|7)\d{8}$/;

const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(ethiopianPhoneRegex, 'Enter a valid Ethiopian phone number (e.g., +251912345678 or 0912345678)');

// --- Password Validation ---
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// --- Auth Schemas ---

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be at most 100 characters'),
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

// --- Top-Up Schema ---

export const topUpSchema = z.object({
  amount: z
    .number()
    .int('Amount must be a whole number')
    .min(100, 'Minimum top-up is 1.00 ETB') // 100 = 1.00 ETB
    .max(10_000_000, 'Maximum top-up is 100,000.00 ETB'),
  payment_method: z.enum(
    ['TELEBIRR', 'CBE_BIRR', 'COMMERCIAL_BANK', 'AWASH_BANK', 'ABYSSINIA_BANK']
  ),
  transaction_id: z
    .string()
    .min(1, 'Transaction ID is required')
    .max(100, 'Transaction ID must be at most 100 characters'),
  additional_information: z
    .string()
    .max(500, 'Additional information must be at most 500 characters')
    .nullable()
    .optional(),
});
export type TopUpInput = z.infer<typeof topUpSchema>;

// --- Bid Schema ---

export const bidSchema = z.object({
  bidding_item_id: z.string().uuid('Invalid bidding item'),
  bid_amount: z
    .number()
    .int('Bid amount must be a whole number in minor units')
    .min(1, 'Bid amount must be greater than 0'),
  idempotency_key: z.string().uuid('Invalid idempotency key'),
});
export type BidInput = z.infer<typeof bidSchema>;

// --- Category Schema ---

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be at most 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(120, 'Slug must be at most 120 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .nullable()
    .optional(),
  image_path: z.string().nullable().optional(),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});
export type CategoryInput = z.infer<typeof categorySchema>;

// --- Bidding Item Schema ---

export const biddingItemSchema = z
  .object({
    category_id: z.string().uuid('Please select a category'),
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must be at most 200 characters'),
    slug: z
      .string()
      .min(3, 'Slug must be at least 3 characters')
      .max(220, 'Slug must be at most 220 characters')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(5000, 'Description must be at most 5000 characters'),
    short_description: z
      .string()
      .max(300, 'Short description must be at most 300 characters')
      .nullable()
      .optional(),
    bidding_mode: z.enum(['HIGHEST_BID', 'LOWEST_UNIQUE_BID']),
    starting_price: z
      .number()
      .int('Starting price must be in minor units')
      .min(0, 'Starting price cannot be negative'),
    bid_increment: z
      .number()
      .int('Bid increment must be in minor units')
      .min(1, 'Bid increment must be at least 1 minor unit')
      .default(100),
    bid_cost: z
      .number()
      .int('Bid cost must be in minor units')
      .min(0, 'Bid cost cannot be negative')
      .default(0),
    minimum_bid: z
      .number()
      .int('Minimum bid must be in minor units')
      .min(1, 'Minimum bid must be at least 1 minor unit')
      .nullable()
      .optional(),
    maximum_bid: z
      .number()
      .int('Maximum bid must be in minor units')
      .min(1, 'Maximum bid must be at least 1 minor unit')
      .nullable()
      .optional(),
    max_bids_per_user: z
      .number()
      .int()
      .min(1, 'Must be at least 1')
      .nullable()
      .optional(),
    start_time: z.string().datetime('Start time must be a valid ISO date string'),
    end_time: z.string().datetime('End time must be a valid ISO date string'),
    terms_and_conditions: z.string().nullable().optional(),
    is_featured: z.boolean().default(false),
  })
  .refine(
    (data) => new Date(data.end_time) > new Date(data.start_time),
    {
      message: 'End time must be after start time',
      path: ['end_time'],
    }
  );
export type BiddingItemInput = z.infer<typeof biddingItemSchema>;

// --- Profile Update Schema ---

export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  avatar_url: z.string().url('Invalid avatar URL').nullable().optional(),
});
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// --- FAQ Schema ---

export const faqSchema = z.object({
  question: z
    .string()
    .min(5, 'Question must be at least 5 characters')
    .max(300, 'Question must be at most 300 characters'),
  answer: z
    .string()
    .min(10, 'Answer must be at least 10 characters')
    .max(2000, 'Answer must be at most 2000 characters'),
  category: z
    .string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be at most 50 characters')
    .default('General'),
  display_order: z.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
});
export type FAQInput = z.infer<typeof faqSchema>;
