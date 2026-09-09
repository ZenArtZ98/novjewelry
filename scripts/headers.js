export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    // React uses inline style attributes for the original animated properties.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'none'",
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export function cacheControl(pathname) {
  if (/^\/assets\/[^/]+-[\w-]{8,}\.(?:js|css)$/.test(pathname)) {
    return 'public, max-age=31536000, immutable';
  }
  if (/\.(?:webp|ttf|otf|svg|txt|xml|css)$/.test(pathname)) {
    return 'public, max-age=3600';
  }
  return 'no-cache';
}
