export const environment = {
  production: false,
  // Keep browser requests same-origin; Angular's dev-server proxy forwards
  // /api/v1 to the local FastAPI server and avoids a CORS preflight.
  apiUrl: '/api/v1',
};
