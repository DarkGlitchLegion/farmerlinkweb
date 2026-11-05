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

The browser uses same-origin `/api/v1` by default. Set `window.FARMERLINK_CONFIG = { apiUrl: 'https://api.example.com/api/v1' }` before the Angular bundle loads to call a different API directly; that API must allow the web origin through CORS.

For the production Node server, set `FARMERLINK_API_URL` to the API origin (for example `https://api.example.com`) and the server forwards same-origin `/api/v1` requests, including the bearer token, to that origin. The default is `http://localhost:8000`.

Build with `npm run build`; run the Angular checks with `npm test`.
