import * as Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated, isHomeworkOwner } from './authorization';

//TODO: Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.
const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    homework: async (parent, { id }, { models }) => {
      if (!id) {
        return null;
      }
      return await models.Homework.findByPk(id);
    },
    homeworks: async (parent, { cursor, limit = 100 }, { models, me }) => {
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

      const homeworks = await models.Homework.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });
      const hasNextPage = homeworks.length > limit;
      const edges = hasNextPage ? homeworks.slice(0, -1) : homeworks;
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
    createHomework: combineResolvers(
      isAuthenticated,
      async (
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
        try {
          const homework = await models.Homework.create({
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
          return homework;
        } catch (error) {
          throw new Error(error);
        }
      },
    ),
    deleteHomework: combineResolvers(
      isAuthenticated,
      isHomeworkOwner,
      async (parent, { id }, { models }) => {
        try {
          return await models.Homework.destroy({ where: { id } });
        } catch (error) {
          throw new Error(error);
        }
      },
    ),
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