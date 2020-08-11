export default {
  Query: {
    homework: async (parent, { id }, { models }) => {
      return await models.Homework.findByPk(id);
    },
    homeworks: async (parent, args, { models }) => {
      return await models.Homework.findAll();
    }
  },
  Mutation: {
    createHomework: async (parent, { title, status, type, notificationType }, { me, models }) => {
      return await models.Homework.create({
        title,
        status,
        type,
        notificationType,
        userId: me.id,
      });
    },
    deleteHomework: async (parent, { id }, { models }) => {
      return await models.Homework.destroy({ where: { id } });
    },
  },
  Homework: {
    user: async (homework, args, { models }) => {
      return await models.User.findByPk(homework.userId);
    },
  },
};