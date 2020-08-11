export default {
  Query: {
    me: async (parent, args, { models, me }) => {
      return await models.User.findByPk(me.id);
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findByPk(id);
    },
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    },
  },
  Mutation: {},
  User: {
    homeworks: async (user, args, { models }) => {
      return await models.Homework.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },
};