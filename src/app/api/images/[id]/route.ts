import { NextRequest } from 'next/server';
import { z } from 'zod';
import { deleteImage, updateImage } from '@/lib/repo';
import { errorResponse, jsonResponse, requireUser } from '../../utils';

const updateBodySchema = z.object({
  alt: z.string().nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

interface Params {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    requireUser(request, ['agent', 'admin']);
    const body = await request.json();
    const payload = updateBodySchema.parse(body);
    const image = await updateImage(params.id, payload);
    return jsonResponse(image);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    requireUser(request, ['agent', 'admin']);
    await deleteImage(params.id);
    return jsonResponse(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
