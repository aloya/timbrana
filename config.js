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
  supabaseUrl: "YOUR_SUPABASE_URL",

  // Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",

  // Optional override. Default: `${supabaseUrl}/functions/v1/pilot-invitation-request`
  // functionUrl: "https://xxxxxxxx.supabase.co/functions/v1/pilot-invitation-request",

  functionName: "pilot-invitation-request",
  landingPageVersion: "website-v1",
};
