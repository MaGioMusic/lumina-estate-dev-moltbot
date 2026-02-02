import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ListingStatus } from '@prisma/client';
import { createListing, listListings } from '@/lib/repo';
import { currencyTypeSchema, listingStatusSchema } from '@/types/models';
import { sanitizeFields } from '@/lib/sanitize';
import { errorResponse, jsonResponse, requireUser } from '../utils';
import { resolveActorContext } from '@/lib/auth/server';

const listQuerySchema = z.object({
  propertyId: z.string().uuid().optional(),
  status: listingStatusSchema.optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
  dateFrom: z.string().datetime({ offset: true }).optional(),
  dateTo: z.string().datetime({ offset: true }).optional(),
});

const createBodySchema = z.object({
  propertyId: z.string().uuid(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price'),
  currency: currencyTypeSchema,
  status: listingStatusSchema.optional(),
  expiryDate: z.string().datetime({ offset: true }).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const raw = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = listQuerySchema.safeParse(raw);
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

    const { propertyId, status, page, pageSize, dateFrom, dateTo } = parsed.data;
    const result = await listListings({
      propertyId,
      status: status as ListingStatus | undefined,
      page,
      pageSize,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });

    return jsonResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request, ['agent', 'admin']);
    const actor = await resolveActorContext(user);
    const body = await request.json();
    const payload = createBodySchema.parse(body);
    const sanitizedPayload = sanitizeFields(payload, ['notes']);

    const listing = await createListing(
      {
        propertyId: sanitizedPayload.propertyId,
        userId: user.id,
        agentId: actor.agentId ?? undefined,
        price: sanitizedPayload.price,
        currency: sanitizedPayload.currency,
        status: sanitizedPayload.status,
        expiryDate: sanitizedPayload.expiryDate ? new Date(sanitizedPayload.expiryDate) : null,
        notes: sanitizedPayload.notes ?? null,
      },
      actor,
    );

    return jsonResponse(listing, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
