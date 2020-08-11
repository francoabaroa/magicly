import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { ApolloServer } from 'apollo-server-express';
import apolloServerConfig from '@magicly/graphql';
import nextApp from '@magicly/client';

import { Request, Response } from 'express';
import { createModels } from './models/index';
import { HomeworkInstance } from './models/Homework';
import { UserInstance } from './models/User';

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

  db.sequelize.sync({ force: isTest || isProduction }).then(async () => {
    if (isTest || isProduction) {
      db.User.create({
        currentCity: 'Miami',
        hasSocialAuthLogin: false,
        email: 'franco@franco.com',
      }).then(user => {
        console.log(user);
      }).catch(err => {
        console.error(err);
      });
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

async function bootstrapApolloServer(expressApp, db) {
  apolloServerConfig.context = {
    me: db.User.findByPk(1),
    models: db
  }
  const apolloServer = new ApolloServer(apolloServerConfig);
  apolloServer.applyMiddleware({ app: expressApp });
}

main();