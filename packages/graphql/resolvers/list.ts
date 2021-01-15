import * as Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';
import { ApolloError } from 'apollo-server';

import { isAuthenticated, isListOwner } from './authorization';

//TODO: Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.
const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

// query lists {
//   lists(limit: 2) {
//     edges {
//       id
//       name
//     }
//     pageInfo {
//       endCursor
//     }
//   }
// }

export default {
  Query: {
    list: async (parent, { id }, { models }) => {
      if (!id) {
        return null;
      }
      return await models.List.findByPk(id);
    },
    lists: async (parent, { listTypes, cursor, limit = 100 }, { models, me }) => {
      const cursorOptions = cursor
        ? {
          where: {
            createdAt: {
              [Sequelize.Op.lt]: fromCursorHash(cursor),
            },
            userId: me.id,
            type: {
              [Sequelize.Op.in]: listTypes
            }
          },
        }
        : {
          where: {
            userId: me.id,
            type: {
              [Sequelize.Op.in]: listTypes
            }
          }
        };


      const lists = await models.List.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });
      const hasNextPage = lists.length > limit;
      const edges = hasNextPage ? lists.slice(0, -1) : lists;
      const endCursor = edges.length > 0 ? toCursorHash(
        // TODO: this is coming back undefined when cursor is being used
        edges[edges.length - 1].createdAt.toString(),
      ) : null;
      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: endCursor,
        },
      };
    }
  },
  Mutation: {
    createList: combineResolvers(
      isAuthenticated,
      async (
        parent,
        {
          name,
          type,
        },
        { me, models }
      ) => {
        try {
          const list = await models.List.create({
            name,
            type,
            userId: me.id,
          });
          return list;
        } catch (error) {
          throw new ApolloError(error);
        }
      },
    ),
    deleteList: combineResolvers(
      isAuthenticated,
      isListOwner,
      async (parent, { id }, { models }) => {
        try {
          return await models.List.destroy({ where: { id } });
        } catch (error) {
          throw new Error(error);
        }
      },
    ),
  },
  List: {
    user: async (list, args, { loaders, models }) => {
      // return await models.User.findByPk(list.userId);
      return await loaders.user.load(list.userId);
    },
    listItems: async (list, args, { models }) => {
      if (!list) {
        return null;
      }
      return await models.ListItem.findAll({
        where: {
          listId: list.id,
        },
      });
    },
  },
};