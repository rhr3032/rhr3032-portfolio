import {
  AngularNodeAppEngine,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  const angularApp = new AngularNodeAppEngine();

  // Serve static assets with long-lived cache
  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
      redirect: false,
    })
  );

  // All other routes handled by Angular SSR
  server.use('/**', async (req, res, next) => {
    try {
      const response = await angularApp.handle(req);
      if (response) {
        await writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  });

  return server;
}

function run(): void {
  const port = Number(process.env['PORT'] || 4000);
  app().listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

if (isMainModule(import.meta.url)) {
  run();
}
