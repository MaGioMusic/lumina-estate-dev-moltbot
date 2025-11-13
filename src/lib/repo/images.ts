import type { Image } from '@/types/models';
import { prisma } from '@/lib/prisma';
import { NotFoundError } from './errors';
import { mapImage } from './mappers';

export async function listImages(propertyId: string): Promise<Image[]> {
  const records = await prisma.image.findMany({
    where: { propertyId },
    orderBy: { sortOrder: 'asc' },
  });
  return records.map(mapImage);
}

export interface CreateImageInput {
  propertyId: string;
  url: string;
  alt?: string | null;
  sortOrder?: number;
}

export async function createImage(input: CreateImageInput): Promise<Image> {
  const property = await prisma.property.findUnique({ where: { id: input.propertyId }, select: { id: true } });
  if (!property) throw new NotFoundError('Property not found');

  const record = await prisma.image.create({
    data: {
      propertyId: input.propertyId,
      url: input.url,
      alt: input.alt ?? null,
      sortOrder: input.sortOrder ?? 0,
    },
  });
  return mapImage(record);
}

export interface UpdateImageInput {
  alt?: string | null;
  sortOrder?: number;
}

export async function updateImage(id: string, updates: UpdateImageInput): Promise<Image> {
  const record = await prisma.image.update({
    where: { id },
    data: {
      alt: updates.alt ?? null,
      sortOrder: updates.sortOrder ?? undefined,
    },
  });
  return mapImage(record);
}

export async function deleteImage(id: string): Promise<void> {
  const exists = await prisma.image.findUnique({ where: { id } });
  if (!exists) throw new NotFoundError('Image not found');
  await prisma.image.delete({ where: { id } });
}
