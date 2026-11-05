import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Keep browser API traffic same-origin. The FastAPI service does not enable
// cross-origin requests, so the web server forwards requests and auth headers.
app.use('/api/v1', async (req, res, next) => {
  const apiOrigin = process.env['FARMERLINK_API_URL'] || 'http://localhost:8000';
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (!value || ['host', 'connection', 'content-length', 'transfer-encoding'].includes(name.toLowerCase())) continue;
    for (const entry of Array.isArray(value) ? value : [value]) headers.append(name, entry);
  }
  try {
    const response = await fetch(`${apiOrigin.replace(/\/$/, '')}${req.originalUrl}`, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req as any,
      ...(req.method === 'GET' || req.method === 'HEAD' ? {} : { duplex: 'half' as any }),
    });
    res.status(response.status);
    response.headers.forEach((value, name) => {
      if (!['connection', 'transfer-encoding', 'content-encoding', 'content-length'].includes(name.toLowerCase())) res.setHeader(name, value);
    });
    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    next(error);
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
