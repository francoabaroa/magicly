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
import { APP_CONFIG, PROTECTED_ROUTES } from './constants/strings';
import moment from 'moment';

import { HANDY_SERVICES } from './data/handyServices';

import { AWSS3Uploader } from './lib/uploaders/s3';
import plaid from 'plaid';

require('dotenv').config({ path: '../../.env' });

const PORT = process.env.PORT || '3000';
const isTest = !!process.env.DATABASE_TEST;
const isProduction = !!process.env.DATABASE_URL;
let sequelizeConfig = {};

const s3Uploader = new AWSS3Uploader({
  region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  destinationBucketName: process.env.AWS_BUCKET
});

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

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.sandbox,
  options: {}
});

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
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const db = createModels(
    sequelizeConfig,
    isProduction
  );

  const updateServices = async (clientUserId, services) => {
    let updatedServices = {};
    for (let property in services) {
      for (let i = 0; i < services[property].length; i++) {
        const updatedService = await db.Service.findOne({
          where: {
            name: services[property][i].title,
            type: 'HOME',
            url: services[property][i].url,
            userId: clientUserId,
          }
        });

        if (!updatedServices[property]) {
          updatedServices[property] = [];
        }

        let individualService = {
          title: services[property][i].title,
          url: services[property][i].url,
          category: services[property][i].category,
          description: services[property][i].description,
          favorited: services[property][i].favorited,
        };

        if (updatedService && services[property][i].title === updatedService.name) {
          individualService.favorited = updatedService.favorite;
        }

        updatedServices[property].push(individualService)
      }
    }
    return updatedServices;
  };

  await bootstrapApolloServer(app, db);

  // TODO: remove flag and update credentials for production BEFORE LAUNCH
  db.sequelize.sync({ force: isTest || isProduction }).then(async () => {
    if (isTest || isProduction) {
      createUsersWithHomeworks(db);
    }

    app.get("/home/servicesList", async function (request, response, next) {
      const me: any = await context(request);
      let clientUserId;
      if (me && me.id) {
        clientUserId = me.id;
      } else {
        response.redirect(301, '/');
      }
      let services = await updateServices(clientUserId, HANDY_SERVICES);
      let hasSavedServices = false;
      let service = await db.Service.findOne({ where: { userId: me.id }});

      if (service) hasSavedServices = true;
      response.json({ services, hasSavedServices });
    });

    app.get("/finance/hasPlaidAccounts", async function (request, response, next) {
      const me: any = await context(request);
      let clientUserId;
      if (me && me.id) {
        clientUserId = me.id;
      } else {
        return;
      }

      const plaidAccount = await db.PlaidAccount.findOne({ where: { userId: clientUserId } });
      const hasPlaidAccounts = plaidAccount ? true : false;
      response.json({ hasPlaidAccounts });
    });

    app.get("/finance/transactionsList", async function (request, response, next) {
      const me: any = await context(request);
      const lastXDays = request.query.lastXDays ? request.query.lastXDays : 90;
      let clientUserId;
      if (me && me.id) {
        clientUserId = me.id;
      } else {
        return;
      }

      // TODO: eventually we need a findAll
      const plaidAccount = await db.PlaidAccount.findOne({ where: { userId: clientUserId } });
      if (plaidAccount === null) {
        response.redirect(301, '/finance');
      }

      let startDate = moment()
        .subtract(lastXDays.toString(), "days")
        .format("YYYY-MM-DD");
      let endDate = moment().format("YYYY-MM-DD");

      // TODO: need to get access_token from user record
      client.getTransactions(
        plaidAccount.accessToken,
        startDate,
        endDate,
        {
          count: 250,
          offset: 0
        },
        function (error, transactionsResponse) {
          response.json({ transactions: transactionsResponse });
        }
      );
    });

    // TODO: where should I place this?
    await bootstrapClientApp(app);

    // Create a link_token to initialize Link
    app.post('/create_link_token', async function (request, response, next) {
      // Grab the client_user_id by searching for the current user in your database
      const user: any = await context(request);
      let clientUserId;
      if (user && user.id) {
        clientUserId = user.id;
      } else {
        return;
      }
      // Create the link_token with all of your configurations
      client.createLinkToken({
        user: {
          client_user_id: clientUserId.toString(),
        },
        client_name: APP_CONFIG.appName,
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
        webhook: 'https://sample.webhook.com',
      }, function (error, linkTokenResponse) {
        // Pass the result to your client-side app to initialize Link
        response.json({ link_token: linkTokenResponse.link_token });
      });
    });

    // Accept the public_token sent from Link
    app.post('/get_access_token', async function (request, response, next) {
      const me: any = await context(request);
      const public_token = request.body.public_token;
      const institution = request.body.metadata.institution;
      const { name, institution_id } = institution;

      client.exchangePublicToken(public_token, async function (error, publicTokenResponse) {
        if (error != null) {
          console.log('Could not exchange public_token!' + '\n' + error);
          return response.json({ error: 'ERROR: Could not exchange public_token' });
        }

        let plaidAccount = null;
        if (me && me.id) {
          // TODO: need to check if account already exists for user with INSTITUTION ID
          const user = await db.User.findByPk(me.id);
          plaidAccount = await db.PlaidAccount.create({
            accessToken: publicTokenResponse.access_token,
            itemId: publicTokenResponse.item_id,
            institutionId: institution_id,
            institutionName: name,
            user: me.id,
          });
          plaidAccount.setUser(user);
        }

        response.redirect(301, '/finance/dashboard');
      });
    });

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
      bucketName: process.env.AWS_BUCKET,
      getS3Url: s3Uploader.getPresignedUrl.bind(s3Uploader),
      secret: process.env.JWT_KEY,
      singleUpload: s3Uploader.singleFileUploadResolver.bind(s3Uploader),
      multipleUpload: s3Uploader.multipleUploadsResolver.bind(s3Uploader),
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