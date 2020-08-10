import users from '../mockData/mockUserData';
import homeworks from '../mockData/mockHomeworkData';

export default {
  Query: {
    homework: (parent, { id }) => {
      return homeworks[id];
    },
    homeworks: () => {
      return Object.values(homeworks);
    }
  },
  Mutation: {
    createHomework: (parent, { title, status, cost, executionDate, executor }, { me }) => {
      let id = 3;
      const homework = {
        id,
        userId: me.id,
        title,
        status,
        cost,
        executionDate,
        executor,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      homeworks[id] = homework;

      return homework;
    },
    deleteHomework: (parent, { id }) => {
      // TODO: delete comment in line below
      // const { [id]: homework, ...otherHomeworks } = homeworks;
      const homework = homeworks[id];

      if (!homework) {
        return false;
      }
      delete homeworks[id];

      return true;
    },
  },
  Homework: {
    user: homework => {
      return users[homework.userId];
    },
  },
};