import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, currentCity } = user;
  const token = await jwt.sign({ id, email, currentCity }, secret, {
    expiresIn,
  });
  return token;
}

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
    signUp: async (
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
      { models, secret }
    ) => {
      try {
        const user = await models.User.create({
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
        return {
          token: createToken(user, secret, '30m')
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    signIn: async (
      parent,
      { email, password },
      { models, secret, me },
    ) => {
      const user = await models.User.findByEmail(email);

      if (!user) {
        throw new UserInputError(
          'No user found with these login credentials.',
        );
      }

      const isValid = await models.User.validatePassword(password, me.id);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '30m') };
    },
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