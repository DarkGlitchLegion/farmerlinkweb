# FarmerLink Web Admin

Responsive administrator portal for the FarmerLink API. The web app exposes administrator sign-in, dashboard analytics, account/resource management, notifications, and profile settings. It does not provide registration or non-admin dashboards.

## Run locally

Start the FastAPI service at `http://localhost:8000`, then run:

```bash
npm install
npm start
```

The Angular development server proxies `/api/v1` to `http://localhost:8000` using `proxy.conf.json`.

## API configuration

The browser API base URL is configured in `src/environments/environment.ts`; development builds replace it with `environment.development.ts`. Both default to same-origin `/api/v1`, which avoids browser CORS restrictions through the configured proxy.

For the production Node server, set `FARMERLINK_API_URL` to the API origin (for example `https://api.example.com`) and the server forwards same-origin `/api/v1` requests, including the bearer token, to that origin. The default is `http://localhost:8000`.

Build with `npm run build`; run the Angular checks with `npm test`.
