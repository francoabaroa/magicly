export default {
  Query: {
    homework: async (parent, { id }, { models }) => {
      if (!id) {
        return null;
      }
      return await models.Homework.findByPk(id);
    },
    homeworks: async (parent, args, { models }) => {
      return await models.Homework.findAll();
    }
  },
  Mutation: {
    createHomework: async (
      parent,
      {
        title,
        status,
        type,
        notificationType,
        keywords,
        cost,
        costCurrency,
        notes,
        executionDate,
        executor
      },
      { me, models }
    ) => {
      if (!title || !status || !type || notificationType) {
        // validation
        return null;
      }

      try {
        return await models.Homework.create({
          title,
          status,
          type,
          notificationType,
          keywords,
          cost,
          costCurrency,
          notes,
          executionDate,
          executor,
          userId: me.id,
        });
      } catch (error) {
        throw new Error(error);
      }
    },
    deleteHomework: async (parent, { id }, { models }) => {
      if (!id) {
        return null;
      }

      try {
        return await models.Homework.destroy({ where: { id } });
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Homework: {
    user: async (homework, args, { models }) => {
      if (!homework) {
        return null;
      }
      return await models.User.findByPk(homework.userId);
    },
  },
};