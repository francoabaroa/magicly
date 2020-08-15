import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';

import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import apolloServerConfig from '@magicly/graphql';
import nextApp from '@magicly/client';

import { Request, Response } from 'express';
import { DbInterface } from './typings/DbInterface';
import { createModels } from './models/index';
import loaders from './loaders';
import { HomeworkInstance } from './models/Homework';
import { UserInstance } from './models/User';

require('dotenv').config({ path: '../../.env' })

const PORT = process.env.PORT || '3000';
const isTest = !!process.env.DATABASE_TEST;
const isProduction = !!process.env.DATABASE_URL;
let sequelizeConfig = {};

if (process.env.DATABASE_URL) {
  sequelizeConfig = {
    'database': process.env.DATABASE_URL,
    'params': {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: true,
      ssl: true,
      operatorsAliases: false
    },
  };
} else {
  sequelizeConfig = {
    // TODO: update database for development and test
    'database': process.env.DATABASE_TEST || process.env.DATABASE,
    'username': process.env.DATABASE_USER,
    'password': process.env.DATABASE_PASSWORD,
    'params': {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: true,
      operatorsAliases: false
    }
  };
}

async function main() {
  const app = express();
  app.use(cors());
  app.use(morgan('dev'));

  const db = createModels(
    sequelizeConfig,
    isProduction
  );

  await bootstrapApolloServer(app, db);
  await bootstrapClientApp(app);

  // TODO: remove flag and update credentials for production BEFORE LAUNCH
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
  apolloServerConfig.context = async ({ req }) => {
    const me = await getMe(req);
    return {
      models: db,
      me,
      secret: process.env.JWT_KEY,
      loaders: {
        user: new DataLoader(keys =>
          loaders.user.batchUsers(keys, db),
        ),
      },
    };
  };
  const apolloServer = new ApolloServer(apolloServerConfig);
  apolloServer.applyMiddleware({ app: expressApp });
}

const getMe = async (req: Request) => {
  // TODO: update any type
  const token: any = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.JWT_KEY);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

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