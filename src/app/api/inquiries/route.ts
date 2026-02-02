import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createInquiry } from '@/lib/repo';
import { sanitizeFields } from '@/lib/sanitize';
import { errorResponse, jsonResponse } from '../utils';
import { getCurrentUser as getOptionalUser } from '@/lib/auth/server';

const bodySchema = z.object({
  propertyId: z.string().uuid(),
  message: z.string().min(1),
  contactEmail: z.string().email().nullable().optional(),
  contactPhone: z.string().min(5).max(20).nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getOptionalUser(request);

    const body = await request.json();
    const payload = bodySchema.parse(body);
    const sanitizedPayload = sanitizeFields(payload, ['message', 'contactEmail', 'contactPhone']);

    const inquiry = await createInquiry({
      userId: user?.id ?? null,
      propertyId: sanitizedPayload.propertyId,
      message: sanitizedPayload.message,
      contactEmail: sanitizedPayload.contactEmail ?? null,
      contactPhone: sanitizedPayload.contactPhone ?? null,
    });

    return jsonResponse(inquiry, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
