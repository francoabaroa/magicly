import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import nextApp from '@magicly/client';
import apolloServer from '@magicly/graphql';

const { PORT } = process.env;

async function main() {
  const app = express();
  app.use(cors());
  app.use(morgan('dev'));

  await bootstrapApolloServer(app);
  await bootstrapClientApp(app);

  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`[ server ] ready on port ${PORT}`);
  });
}

async function bootstrapClientApp(expressApp) {
  await nextApp.prepare();
  expressApp.get('*', nextApp.getRequestHandler());
}

async function bootstrapApolloServer(expressApp) {
  apolloServer.applyMiddleware({ app: expressApp });
}

main();