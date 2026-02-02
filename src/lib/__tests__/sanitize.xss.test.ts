/**
 * XSS Security Test Cases for Chat Messages
 * 
 * These tests verify that the XSS sanitization is working correctly.
 */

import { sanitizeString, sanitizeFields } from '@/lib/sanitize';

describe('XSS Protection Tests', () => {
  describe('sanitizeString', () => {
    it('should strip script tags', () => {
      const input = "<script>alert('xss')</script>";
      const result = sanitizeString(input);
      expect(result).toBe('');
    });

    it('should strip javascript: URLs', () => {
      const input = '<a href="javascript:alert(\'xss\')">click me</a>';
      const result = sanitizeString(input);
      expect(result).not.toContain('javascript:');
    });

    it('should strip event handlers', () => {
      const input = '<div onmouseover="alert(\'xss\')">hover me</div>';
      const result = sanitizeString(input);
      expect(result).not.toContain('onmouseover');
      expect(result).not.toContain('alert');
    });

    it('should keep plain text content', () => {
      const input = 'Hello, this is normal text!';
      const result = sanitizeString(input);
      expect(result).toBe('Hello, this is normal text!');
    });

    it('should strip HTML tags but keep content', () => {
      const input = '<b>Bold</b> and <i>italic</i> text';
      const result = sanitizeString(input);
      // DOMPurify with ALLOWED_TAGS: [] strips all tags but keeps content
      expect(result).toBe('Bold and italic text');
    });

    it('should handle img onerror XSS', () => {
      const input = '<img src=x onerror=alert("xss")>';
      const result = sanitizeString(input);
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('<img');
    });

    it('should handle SVG with embedded scripts', () => {
      const input = '<svg><script>alert("xss")</script></svg>';
      const result = sanitizeString(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should handle encoded payloads', () => {
      const input = '&lt;script&gt;alert("xss")&lt;/script&gt;';
      const result = sanitizeString(input);
      // HTML entities should be decoded and then sanitized
      expect(result).not.toContain('<script>');
    });

    it('should handle null and undefined', () => {
      expect(sanitizeString(null)).toBe(null);
      expect(sanitizeString(undefined)).toBe(undefined);
      expect(sanitizeString('')).toBe('');
    });
  });

  describe('sanitizeFields', () => {
    it('should sanitize specified fields in an object', () => {
      const input = {
        id: '123',
        content: '<script>alert("xss")</script>Hello',
        roomId: 'room-456',
      };
      const result = sanitizeFields(input, ['content']);
      expect(result.content).toBe('Hello');
      expect(result.id).toBe('123');
      expect(result.roomId).toBe('room-456');
    });

    it('should not modify non-string fields', () => {
      const input = {
        id: 123,
        count: 42,
        content: '<b>Bold</b>',
      };
      const result = sanitizeFields(input, ['content']);
      expect(result.id).toBe(123);
      expect(result.count).toBe(42);
      expect(result.content).toBe('Bold');
    });
  });

  describe('Chat Message XSS Prevention', () => {
    const maliciousPayloads = [
      { name: 'Basic script tag', payload: '<script>alert("xss")</script>' },
      { name: 'Image onerror', payload: '<img src=x onerror=alert("xss")>' },
      { name: 'SVG script', payload: '<svg onload=alert("xss")>' },
      { name: 'JavaScript protocol', payload: 'javascript:alert("xss")' },
      { name: 'Event handler', payload: '<div onmouseover=alert("xss")>x</div>' },
      { name: 'Encoded script', payload: '%3Cscript%3Ealert(%22xss%22)%3C/script%3E' },
      { name: 'Nested script', payload: '<<script>script>alert("xss")<</script>/script>' },
    ];

    maliciousPayloads.forEach(({ name, payload }) => {
      it(`should neutralize: ${name}`, () => {
        const result = sanitizeString(payload);
        // Result should not contain executable script indicators
        expect(result).not.toMatch(/<script/i);
        expect(result).not.toMatch(/javascript:/i);
        expect(result).not.toMatch(/on\w+=/i);
      });
    });
  });
});
