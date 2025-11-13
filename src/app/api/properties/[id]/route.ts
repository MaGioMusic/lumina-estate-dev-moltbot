import { NextRequest } from 'next/server';
import { getPropertyDetail } from '@/lib/repo';
import { jsonResponse, errorResponse } from '../../utils';

interface Params {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const detail = await getPropertyDetail(params.id);
    if (!detail) {
      return jsonResponse(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Property not found',
          },
        },
        { status: 404 }
      );
    }

    return jsonResponse(detail);
  } catch (error) {
    return errorResponse(error);
  }
}
