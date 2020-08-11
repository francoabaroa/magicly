export default {
  Query: {
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      return await models.User.findByPk(me.id);
    },
    user: async (parent, { id }, { models }) => {
      if (!id) {
        return null;
      }
      return await models.User.findByPk(id);
    },
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    },
  },
  Mutation: {
    createUser: async (
      parent,
      {
        email,
        currentCity,
        hasSocialAuthLogin,
        firstName,
        lastName,
        displayName,
        socialAuthId,
        preferredSocialAuth,
        salt,
        password,
        gender,
        cellphone,
        dob
      },
      { models }
    ) => {
      try {
        return await models.User.create({
          email,
          currentCity,
          hasSocialAuthLogin,
          firstName,
          lastName,
          displayName,
          socialAuthId,
          preferredSocialAuth,
          salt,
          password,
          gender,
          cellphone,
          dob
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  User: {
    homeworks: async (user, args, { models }) => {
      if (!user) {
        return null;
      }
      return await models.Homework.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },
};