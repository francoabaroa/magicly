import * as Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';
import { ApolloError } from 'apollo-server';

import { isAuthenticated, isListOwner } from './authorization';

//TODO: Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.
const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    setting: async (parent, { id }, { models }) => {
      if (!id) {
        return null;
      }
      return await models.Setting.findByPk(id);
    },
    settings: async (parent, { cursor, limit = 100 }, { models, me }) => {
      const cursorOptions = cursor
        ? {
          where: {
            createdAt: {
              [Sequelize.Op.lt]: fromCursorHash(cursor),
            },
            userId: me.id
          },
        }
        : {
          where: {
            userId: me.id
          }
        };

      const lists = await models.Setting.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });
      const hasNextPage = lists.length > limit;
      const edges = hasNextPage ? lists.slice(0, -1) : lists;
      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            // TODO: this is coming back undefined when cursor is being used
            edges[edges.length - 1].createdAt.toString(),
          ),
        },
      };
    }
  },
  Mutation: {
    updateSetting: combineResolvers(
      isAuthenticated,
      async (
        parent,
        {
          firstName,
          currentCity,
          email,
          languageIso2,
          defaultNotificationType
        },
        { me, models }
      ) => {
        try {
          const setting = await models.Setting.findOne({
            where: {
              userId: me.id,
            }
          });
          const user = await models.User.findByPk(me.id);

          if (setting) {
            setting.languageIso2 = languageIso2;
            setting.defaultNotificationType = defaultNotificationType;
            await setting.save();
          }

          if (user) {
            user.firstName = firstName;
            user.email = email;
            user.currentCity = currentCity;
            await user.save();
          }

          return {
            user: user,
            setting: setting
          }
        } catch (error) {
          throw new ApolloError(error);
        }
      },
    ),
  },
  Setting: {
    user: async (homework, args, { loaders }) => {
      return await loaders.user.load(homework.userId);
    },
  },
};