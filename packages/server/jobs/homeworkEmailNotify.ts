require('dotenv').config()
import AWS = require('aws-sdk');
import nodemailer = require('nodemailer');
import moment = require('moment');
import logger = require('pino');
import * as Sequelize from 'sequelize';
import { createModels } from '../models/index';

AWS.config.update({
  accessKeyId: process.env.SES_ACCESS_KEY,
  secretAccessKey: process.env.SES_SECRET_KEY,
  region: process.env.SES_REGION,
});

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: '2010-12-01'
  })
});

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

const db = createModels(
  sequelizeConfig,
  isProduction
);

const getCapitalizedString = (name: string) => {
  const lowerCaseTitle = name.toLowerCase();
  if (typeof lowerCaseTitle !== 'string') return ''
  return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
};

const sendIndividualEmail = async (homework) => {
  let uppercaseType = getCapitalizedString(homework.type);
  let subject = uppercaseType + ': ' + homework.title;
  let text = 'You have a home work due today: ' + homework.title;
  let user = await db.User.findByPk(homework.userId);

  return new Promise((resolve, reject) => {
    transporter.sendMail({
      from: 'magicly@sincero.tech',
      to: user.email,
      subject,
      text,
      html: `<p> You have a home work due today: <span style="font-weight:bold">${homework.title}</span> <p> Thanks and have a great day! </p> <p>The Magicly Team</p> <span style="font-size:12px; font-style: italic;">This mailbox is not monitored in real-time. If you reply back to this email, please give us some time to go through your response and get back to you.</span> </p>`
    }, (err, info) => {
      if (err) {
        let child = logger().child({ function: 'sendIndividualEmail', objectId: homework.id });
        child.warn('SEND_INDIVIDUAL_ERROR');
        reject(err);
      }
      if (info) {
        resolve(homework);
      }
    });
  })
};

const getHomeworks = async () => {
  const Op = Sequelize.Op;
  const homeworks = await db.Homework.findAll({
    where: {
      status: 'UPCOMING',
      notificationType: 'EMAIL',
      executionDate: {
        [Op.eq]: moment().format('YYYY-MM-DD'),
      },
    }
  })
  return homeworks;
};

const sendEmails = async (homeworks) => {
  const records = homeworks.map(result => result.dataValues);
  const emailedRecords = [];

  for (const record of records) {
    const individualEmail = await sendIndividualEmail(record);
    if (individualEmail && individualEmail['id']) {
      emailedRecords.push(individualEmail);
    }
  }

  const homeworkIds = emailedRecords.map(homework => homework['id']);
  return homeworkIds;
};

const markEmailsAsSent = async (returnedHomeworkIds) => {
  if (returnedHomeworkIds.length === 0) {
    return false;
  }

  let marked = await db.Homework.update(
    { notificationType: 'NONE' },
    { where: { id: returnedHomeworkIds }
  });
  return marked.length > 0;
};

const findAndSendHomeworkEmails = async () => {
  try {
    await db.sequelize.authenticate();
    let child = logger().child({ function: 'findAndSendEmailsBeforeGetHomeworks', isProduction, dirname: __dirname });
    child.warn('FIND_AND_SEND_EMAILS_CONTINUE');
    console.log('Connection has been established successfully.', isProduction, __dirname);
    const homeworks = await getHomeworks();
    const returnedHomeworkIds = await sendEmails(homeworks);
    const done = await markEmailsAsSent(returnedHomeworkIds);
    return done;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

};

findAndSendHomeworkEmails().then(result => {
  console.log('Result: ', result);
}).catch(error => {
  let child = logger().child({ function: 'findAndSendHomeworkEmails', error});
  child.warn('FIND_AND_SEND_EMAILS_ERROR');
});