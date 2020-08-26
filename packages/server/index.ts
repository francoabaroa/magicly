import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';

import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import apolloServerConfig from '@magicly/graphql';
import nextApp from '@magicly/client';

import { Request } from 'express';
import { DbInterface } from './typings/DbInterface';
import { createModels } from './models/index';
import loaders from './loaders';
import { PROTECTED_ROUTES } from './constants/strings';

require('dotenv').config({ path: '../../.env' })

const PORT = process.env.PORT || '3000';
const isTest = !!process.env.DATABASE_TEST;
const isProduction = !!process.env.DATABASE_URL;
let sequelizeConfig = {};

// TODO: if user lands on HTTP, important to redirect to HTTPS. Form submissions should only happen via HTTPS

if (process.env.DATABASE_URL) {
  sequelizeConfig = {
    'database': process.env.DATABASE_URL,
    'params': {
      dialect: 'postgres',
      protocol: 'postgres',
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
      operatorsAliases: false
    }
  };
}

const createToken = async (user, secret, expiresIn) => {
  const { id, email, currentCity } = user;
  const token = await jwt.sign({ id, email, currentCity }, secret, {
    expiresIn,
  });
  return token;
};

async function main() {
  const app = express();
  const corsOptions = {
    // TODO: I believe it is the same origin!!
    origin: 'http://localhost:3000', //change with your own client URL
    credentials: true
  }
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(express.urlencoded({ extended: true }));

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

    app.post('/signup', async (req, res) => {
      const { email, password, currentCity, hasSocialAuthLogin } = req.body
      const user = await db.User.create(
          {
          email,
          currentCity,
          password,
          hasSocialAuthLogin,
          lists: [
            {
              name: 'todo',
              type: 'TODO',
            },
            {
              name: 'later',
              type: 'LATER',
            },
            {
              name: 'watch',
              type: 'WATCH',
            },
            {
              name: 'anti',
              type: 'ANTI',
            },
            {
              name: 'recommendation',
              type: 'RECOMMENDATION',
            },
          ],
        },
        {
          include: [{ model: db.List, as: 'lists' }],
        }
      );

      if (!user) {
        res.status(404).send({
          success: false,
          message: `Could not create account: ${email}`,
        });
        return;
      }

      const token = await createToken(user, process.env.JWT_KEY, '1d');
      res.cookie('jwt', token, {
        httpOnly: true,
        // TODO: turn these options on for PROD
        //secure: true, //on HTTPS
        //domain: 'example.com', //set your domain
      });

      res.send({
        success: true
      });
    });

    app.post('/signin', async (req, res) => {
      const { email, password } = req.body
      const user = await db.User.findByEmail(email);

      if (!user) {
        res.status(404).send({
          success: false,
          message: `Could not find account: ${email}`,
        });
        return;
      }

      const match = await db.User.validatePassword(password, user.id);
      if (!match) {
        res.status(401).send({
          success: false,
          message: 'Incorrect credentials',
        });
        return;
      }

      const token = await createToken(user, process.env.JWT_KEY, '1d');
      res.cookie('jwt', token, {
        httpOnly: true,
        // TODO: turn these options on for PROD
        //secure: true, //on HTTPS
        //domain: 'example.com', //set your domain
      });

      res.send({
        success: true
      });
    });

    app.post('/signout', async (req, res) => {
      res.clearCookie('jwt');
      res.clearCookie('signedin');
      res.redirect(301, '/signin');
    });

    app.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`[ server ] ready on port ${PORT}`);
    });
  })
}

const context = async (req: Request) => {
  const token = req.cookies['jwt'] || '';
  if (token) {
    try {
      return await jwt.verify(token, process.env.JWT_KEY)
    } catch (e) {
      throw new AuthenticationError(
        'Authentication token is invalid, please log in',
      )
    }
  }
}

async function bootstrapClientApp(expressApp) {
  await nextApp.prepare();
  // protected routes
  // TODO: add other protected routes
  expressApp.get(PROTECTED_ROUTES, async (req, res) => {
    const handle = nextApp.getRequestHandler();
    try {
      const me = await context(req);
      if (me) {
        handle(req, res);
      } else {
        res.clearCookie('jwt');
        res.clearCookie('signedin');
        res.redirect(301, '/signin');
      }
    } catch (e) {
      res.clearCookie('jwt');
      res.clearCookie('signedin');
      res.redirect(301, '/signin');
      console.error(e);
    }
  });
  expressApp.get(['/', '/signin'], async (req, res) => {
    const handle = nextApp.getRequestHandler();
    try {
      const me = await context(req);
      if (me) {
        res.redirect(301, '/main');
      } else {
        handle(req, res);
      }
    } catch (e) {
      // TODO: remove or leave this?
      res.clearCookie('jwt');
      res.clearCookie('signedin');
      res.redirect(301, '/signin');
      console.error(e);
    }
  });
  expressApp.get('*', nextApp.getRequestHandler());
}

async function bootstrapApolloServer(expressApp, db: DbInterface) {
  apolloServerConfig.context = async ({ req }) => {
    const me = await context(req);
    return {
      models: db,
      me,
      secret: process.env.JWT_KEY,
      loaders: {
        user: new DataLoader(keys =>
          loaders.user.batchUsers(keys, db),
        ),
        list: new DataLoader(keys =>
          loaders.list.batchLists(keys, db),
        ),
      },
    };
  };
  const apolloServer = new ApolloServer(apolloServerConfig);
  apolloServer.applyMiddleware({ app: expressApp, cors: false });
}

const createUsersWithHomeworks = async (db: DbInterface) => {
  await db.User.create(
    {
      currentCity: 'Miami',
      hasSocialAuthLogin: false,
      email: 'franco1@franco.com',
      password: 'testa12',
      lists: [
        {
          name: 'Recommendation',
          type: 'RECOMMENDATION',
        },
      ],
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
      include: [{ model: db.Homework, as: 'homeworks' }, { model: db.List, as: 'lists' }],
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
          notificationType: 'SMS',
          executionDate: new Date(),
          executor: 'Francisco',
          cost: 150,
          costCurrency: 'USD',
          notes: 'Hurricane irma left a huge mess.'
        },
        {
          title: 'Fridge coolant replacement',
          status: 'PAST',
          type: 'MAINTENANCE',
          notificationType: 'SMS',
          executionDate: new Date(),
          executor: 'Edward',
          cost: 75,
          costCurrency: 'USD',
          notes: 'Last time we did this was 5 years ago in 2015.'
        }
      ],
      lists: [
        {
          name: 'todo',
          type: 'TODO',
        },
        {
          name: 'later',
          type: 'LATER',
        },
        {
          name: 'watch',
          type: 'WATCH',
        },
        {
          name: 'anti',
          type: 'ANTI',
        },
        {
          name: 'recommendation',
          type: 'RECOMMENDATION',
        },
      ],
    },
    {
      include: [{ model: db.Homework, as: 'homeworks' }, { model: db.List, as: 'lists' }],
    },
  );
};



main();