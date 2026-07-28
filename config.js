/**
 * Public frontend config for the Timbrana invitation form.
 *
 * Copy this file to config.js and fill in the values below.
 *
 * WHERE KEYS BELONG
 * -----------------
 * supabaseUrl      → Project Settings → API → Project URL
 * supabaseAnonKey  → Project Settings → API → anon / public key
 *
 * NEVER put SUPABASE_SERVICE_ROLE_KEY in this file, invite.html,
 * invite.js, or any other frontend asset. The service role stays
 * in Supabase Edge Function secrets only.
 *
 * PRODUCTION DOMAIN
 * -----------------
 * CORS for the Edge Function is configured separately via the
 * ALLOWED_ORIGINS secret (see website/README.md). Add:
 *   https://YOUR-PRODUCTION-TIMBRANA-DOMAIN
 * there — not in this file.
 */
window.TIMBRANA_INVITE_CONFIG = {
  // Example: "https://xxxxxxxx.supabase.co"
  supabaseUrl: "https://rgbmtkvxmyuennmdtgla.supabase.co",

  // Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnYm10a3Z4bXl1ZW5ubWR0Z2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjYyNzMsImV4cCI6MjA1MTUwMjI3M30.pUcFXKmPrAI3ZpF4tt5j-w94-kqR8rOa2u8nSjBsEB8",

  // Optional override. Default: `${supabaseUrl}/functions/v1/pilot-invitation-request`
  // functionUrl: "https://xxxxxxxx.supabase.co/functions/v1/pilot-invitation-request",

  functionName: "pilot-invitation-request",
  landingPageVersion: "website-v1",
};
