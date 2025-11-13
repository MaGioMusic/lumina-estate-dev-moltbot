import { NextRequest } from 'next/server';
import { z } from 'zod';
import { listProperties } from '@/lib/repo';
import { jsonResponse, errorResponse } from '../utils';
import { propertyTypeSchema, transactionTypeSchema } from '@/types/models';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(60).optional(),
  search: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  propertyType: propertyTypeSchema.optional(),
  transactionType: transactionTypeSchema.optional(),
  priceMin: z.coerce.number().nonnegative().optional(),
  priceMax: z.coerce.number().nonnegative().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  amenities: z.string().optional(),
  sort: z.enum(['createdAt', 'price', 'views']).optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const raw = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = querySchema.safeParse(raw);
    if (!parsed.success) {
      return jsonResponse(
        {
          error: {
            code: 'BAD_REQUEST',
            message: 'Invalid query parameters',
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const params = parsed.data;
    const amenities = params.amenities ? params.amenities.split(',').map(item => item.trim()).filter(Boolean) : undefined;

    const result = await listProperties({
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
      city: params.city,
      district: params.district,
      propertyType: params.propertyType,
      transactionType: params.transactionType,
      priceMin: params.priceMin,
      priceMax: params.priceMax,
      bedrooms: params.bedrooms,
      bathrooms: params.bathrooms,
      amenities,
      sort: params.sort,
      sortDir: params.sortDir,
    });

    return jsonResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}
