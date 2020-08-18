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

      const token = await createToken(user, process.env.JWT_KEY, '1800000');
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

    app.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`[ server ] ready on port ${PORT}`);
    });
  })
}

const context = async (req: Request) => {
  const token = req.cookies['jwt'] || '';
  try {
    return await jwt.verify(token, process.env.JWT_KEY)
  } catch (e) {
    throw new AuthenticationError(
      'Authentication token is invalid, please log in',
    )
  }
}

async function bootstrapClientApp(expressApp) {
  await nextApp.prepare();
  // protected routes
  expressApp.get(['/main'], async (req, res) => {
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