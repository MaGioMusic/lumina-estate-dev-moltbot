import { NextRequest } from 'next/server';
import { z } from 'zod';
import { appointmentTypeSchema } from '@/types/models';
import { createAppointment } from '@/lib/repo';
import { sanitizeFields } from '@/lib/sanitize';
import { errorResponse, jsonResponse, requireUser } from '../utils';

const bodySchema = z.object({
  propertyId: z.string().uuid(),
  scheduledDate: z.string().datetime({ offset: true }),
  type: appointmentTypeSchema.default('viewing'),
  notes: z.string().nullable().optional(),
  meetingLocation: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request, ['client', 'agent', 'investor', 'admin']);
    const body = await request.json();
    const payload = bodySchema.parse(body);
    const sanitizedPayload = sanitizeFields(payload, ['notes', 'meetingLocation']);

    const appointment = await createAppointment({
      userId: user.id,
      propertyId: sanitizedPayload.propertyId,
      scheduledDate: new Date(sanitizedPayload.scheduledDate),
      type: sanitizedPayload.type,
      notes: sanitizedPayload.notes ?? null,
      meetingLocation: sanitizedPayload.meetingLocation ?? null,
    });

    return jsonResponse(appointment, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
