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

const sendIndividualEmail = async (listItem) => {
  let subject = listItem.name;
  let text = 'You have an item due today: ' + listItem.name;
  let list  = await db.List.findByPk(listItem.listId);
  let user = await db.User.findByPk(list['userId']);

  // TODO: check where the list came from so you can tell the user!!
  return new Promise((resolve, reject) => {
    transporter.sendMail({
      from: 'magicly@sincero.tech',
      to: user.email,
      subject,
      text,
      html: `<p> You have an item due today: <span style="font-weight:bold">${listItem.name}</span> <p> Thanks and have a great day! </p> <p>The Magicly Team</p> <span style="font-size:12px; font-style: italic;">This mailbox is not monitored in real-time. If you reply back to this email, please give us some time to go through your response and get back to you.</span> </p>`
    }, (err, info) => {
      if (err) {
        let child = logger().child({ function: 'sendIndividualEmail', objectId: listItem.id });
        child.warn('SEND_INDIVIDUAL_ERROR');
        reject(err);
      }
      if (info) {
        resolve(listItem);
      }
    });
  })
};

const getListItems = async () => {
  const Op = Sequelize.Op;
  const listItems = await db.ListItem.findAll({
    attributes: ['id', 'name', 'listId'] ,
    where: {
      notificationType: 'EMAIL',
      executionDate: {
        [Op.eq]: moment().format('YYYY-MM-DD'),
      },
    }
  });
  return listItems;
};

const sendEmails = async (listItems) => {
  const records = listItems.map(result => result.dataValues);
  const emailedRecords = [];

  for (const record of records) {
    const individualEmail = await sendIndividualEmail(record);
    if (individualEmail && individualEmail['id']) {
      emailedRecords.push(individualEmail);
    }
  }

  const listItemIds = emailedRecords.map(listItem => listItem['id']);
  return listItemIds;
};

const markEmailsAsSent = async (returnedListItemIds) => {
  if (returnedListItemIds.length === 0) {
    return false;
  }

  let marked = await db.ListItem.update(
    { notificationType: 'NONE' },
    {
      where: { id: returnedListItemIds }
    });
  return marked.length > 0;
};

const findAndSendListItemEmails = async () => {
  try {
    await db.sequelize.authenticate();
    let child = logger().child({ function: 'findAndSendEmailsBeforeGetListItems', isProduction, dirname: __dirname });
    child.warn('FIND_AND_SEND_EMAILS_CONTINUE');
    console.log('Connection has been established successfully.', isProduction, __dirname);
    const listItems = await getListItems();
    const returnedListItemIds = await sendEmails(listItems);
    const done = await markEmailsAsSent(returnedListItemIds);
    return done;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

};

findAndSendListItemEmails().then(result => {
  console.log('Result: ', result);
}).catch(error => {
  let child = logger().child({ function: 'findAndSendListItemEmails', error });
  child.warn('FIND_AND_SEND_EMAILS_ERROR');
});