/**
 * Security & Input Sanitization Utilities
 */

/**
 * Validates and sanitizes URLs to prevent XSS via javascript:, vbscript:, or data: URIs.
 * Returns safe URL or empty string/fallback if malicious.
 */
export const sanitizeUrl = (url: string | undefined | null, fallback: string = '#'): string => {
  if (!url) return fallback;
  const trimmed = url.trim();
  
  // Disallow backslash open redirect bypasses (CVE-2026-53669: \\evil.com)
  if (trimmed.startsWith('\\') || trimmed.includes('\\\\') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback;
  }

  // Disallow javascript:, vbscript:, data: protocols
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    (lower.startsWith('data:') && !lower.startsWith('data:image/'))
  ) {
    return fallback;
  }
  return trimmed;
};

/**
 * Strict internal route sanitizer to eliminate CWE-601 (Open Redirect in client routers).
 * Ensures paths supplied to navigate() or <Link> are strictly internal safe relative paths.
 */
export const sanitizeInternalPath = (path: string | undefined | null, fallback: string = '/'): string => {
  if (!path || typeof path !== 'string') return fallback;
  const trimmed = path.trim();

  // Reject external protocols, hostnames, protocol-relative '//', or backslash tricks
  if (
    trimmed.startsWith('//') ||
    trimmed.startsWith('/\\') ||
    trimmed.startsWith('\\') ||
    trimmed.includes('://') ||
    trimmed.toLowerCase().startsWith('javascript:') ||
    trimmed.toLowerCase().startsWith('data:')
  ) {
    return fallback;
  }

  // Must strictly start with a single '/'
  if (!trimmed.startsWith('/')) {
    return `/${trimmed}`;
  }

  return trimmed;
};

/**
 * Neutralizes CSV Formula Injection (Excel / Google Sheets macro attacks).
 * Any cell value starting with '=', '+', '-', '@', tab, or carriage return is prefixed with a single quote.
 */
export const sanitizeCsvField = (val: any): string => {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (['=', '+', '-', '@', '\t', '\r'].includes(str.charAt(0))) {
    return `'${str}`;
  }
  return str;
};

/**
 * HTML Entity encoder to prevent stored or reflected XSS
 */
export const escapeHtml = (unsafe: string): string => {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
