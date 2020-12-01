import { DbInterface } from '../typings/DbInterface';

export const createUsersWithHomeworks = async (db: DbInterface) => {
  await db.User.create(
    {
      currentCity: 'Miami',
      firstName: 'Franco',
      hasSocialAuthLogin: false,
      email: 'franco1@franco.com',
      password: 'testa12',
      setting: [
        {
          languageIso2: 'EN',
          defaultNotificationType: 'EMAIL',
        }
      ],
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
      include: [{ model: db.Homework, as: 'homeworks' }, { model: db.List, as: 'lists' }, { model: db.Setting, as: 'setting' }],
    },
  );

  await db.User.create(
    {
      currentCity: 'Miami',
      firstName: 'Franco',
      hasSocialAuthLogin: false,
      email: 'franco@franco.com',
      password: 'testa123',
      setting: [
        {
          languageIso2: 'EN',
          defaultNotificationType: 'EMAIL',
        }
      ],
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
      include: [{ model: db.Homework, as: 'homeworks' }, { model: db.List, as: 'lists' }, { model: db.Setting, as: 'setting' }],
    },
  );
};