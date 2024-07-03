import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { getPayloadClient } from './get-payload';
import { nextApp, nextHandler } from './next-utils';
import { appRouter } from './trpc';
import { inferAsyncReturnType } from '@trpc/server';
import bodyParser from 'body-parser';
import { IncomingMessage } from 'http';
import { stripeWebhookHandler } from './stripeWebhookHandler';
import nextBuild from 'next/dist/build'; // nextjs utility function for build
import path from 'path';

const app = express();

const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

//tell typescript that to add req and res to client
//ExpressContext is used in to trpc initialization
export type ExpressContext = inferAsyncReturnType<typeof createContext>;
export type WebhookRequest = IncomingMessage & { rawBody: Buffer };

const start = async () => {
  //to receive message from stripe
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });
  app.post('/api/webhooks/stripe', webhookMiddleware, stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async() => {
      payload.logger.info('Next.js is building for production.');

      //@ts-expect-error. its ok.
      await nextBuild(path.join(__dirname, '../'));
      process.exit();
    });
    return;
  }


  //here appRouter is coming from trpc->index.ts=>appRouter
  // making api available in Nextjs api-endpoints from trpc
  app.use(
    '/api/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // Express pass to NextJS
  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info('Next.js started');

    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js app URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
