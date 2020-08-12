import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { ApolloServer } from 'apollo-server-express';
import apolloServerConfig from '@magicly/graphql';
import nextApp from '@magicly/client';

import { Request, Response } from 'express';
import { DbInterface } from './typings/DbInterface';
import { createModels } from './models/index';
import { HomeworkInstance } from './models/Homework';
import { UserInstance } from './models/User';

require('dotenv').config({ path: '../../.env' })

const { PORT } = process.env;
const sequelizeConfig = {
  'database': process.env.DATABASE_TEST || process.env.DATABASE,
  'username': process.env.DATABASE_USER,
  'password': process.env.DATABASE_PASSWORD,
  'params': {
    dialect: 'postgres',
    operatorsAliases: false
  }
};

async function main() {
  const app = express();
  app.use(cors());
  app.use(morgan('dev'));

  const db = createModels(sequelizeConfig);
  await bootstrapApolloServer(app, db);
  await bootstrapClientApp(app);

  const isTest = !!process.env.DATABASE_TEST;
  const isProduction = !!process.env.DATABASE_URL;
  // TODO: remove flag and update credentials for production
  db.sequelize.sync({ force: isTest || isProduction }).then(async () => {
    if (isTest || isProduction) {
      createUsersWithHomeworks(db);
    }

    app.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`[ server ] ready on port ${PORT}`);
    });
  })
}

async function bootstrapClientApp(expressApp) {
  await nextApp.prepare();
  expressApp.get('*', nextApp.getRequestHandler());
}

async function bootstrapApolloServer(expressApp, db: DbInterface) {
  apolloServerConfig.context = async () => ({
    models: db,
    me: await db.User.findByEmail('franco@franco.com'),
    secret: process.env.JWT_KEY,
  });

  const apolloServer = new ApolloServer(apolloServerConfig);
  apolloServer.applyMiddleware({ app: expressApp });
}

const createUsersWithHomeworks = async (db: DbInterface) => {
  await db.User.create(
    {
      currentCity: 'Miami',
      hasSocialAuthLogin: false,
      email: 'franco1@franco.com',
      password: 'testa12',
      homeworks: [
        {
          title: 'Fridge maintenance',
          status: 'PAST',
          type: 'MAINTENANCE',
          notificationType: 'SMS'
        }
      ],
    },
    {
      include: [{ model: db.Homework, as: 'homeworks' }],
    },
  );

  await db.User.create(
    {
      currentCity: 'Miami',
      hasSocialAuthLogin: false,
      email: 'franco@franco.com',
      password: 'testa123',
      homeworks: [
        {
          title: 'Hurricane debris cleanup',
          status: 'UPCOMING',
          type: 'CLEANING',
          notificationType: 'SMS'
        }
      ],
    },
    {
      include: [{ model: db.Homework, as: 'homeworks' }],
    },
  );
};

main();