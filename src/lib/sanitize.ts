import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes a string to prevent XSS attacks
 * Removes any HTML tags and malicious scripts
 */
export function sanitizeString(input: string | null | undefined): string | null | undefined {
  if (!input) return input;
  
  // Remove any HTML tags and scripts
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitizes an object recursively, cleaning all string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    const value = sanitized[key];
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value) as any;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : 
        typeof item === 'object' ? sanitizeObject(item) : 
        item
      ) as any;
    }
  }
  
  return sanitized;
}

/**
 * Sanitizes specific fields in an object
 */
export function sanitizeFields<T extends Record<string, any>>(
  obj: T, 
  fields: (keyof T)[]
): T {
  const sanitized = { ...obj };
  
  for (const field of fields) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeString(sanitized[field] as string) as any;
    }
  }
  
  return sanitized;
}
