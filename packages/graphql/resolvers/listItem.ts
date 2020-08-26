import * as Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated } from './authorization';
import { ApolloError } from 'apollo-server';

//TODO: Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.
const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    listItem: async (parent, { id }, { models }) => {
      if (!id) {
        return null;
      }
      return await models.ListItem.findByPk(id);
    },
    listItems: async (parent, { cursor, limit = 100 }, { models, me }) => {
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

      const listItems = await models.ListItem.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });
      const hasNextPage = listItems.length > limit;
      const edges = hasNextPage ? listItems.slice(0, -1) : listItems;
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
    createListItem: combineResolvers(
      isAuthenticated,
      async (
        parent,
        {
          name,
          type,
          listType,
          notes,
        },
        { me, models }
      ) => {
        try {
          const list = await models.List.findOne({
            where: { type: listType, userId: me.id }
          });

          if (list === null) {
            throw new ApolloError('No list found.');
          }

          const listId = list && list.id ? list.id : null;

          if (listId === null) {
            throw new ApolloError('No list id.');
          }

          const listItem = await models.ListItem.create({
            name,
            type,
            notes,
            listId,
          });

          return listItem;
        } catch (error) {
          throw new ApolloError(error);
        }
      },
    ),
    deleteListItem: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models }) => {
        try {
          return await models.ListItem.destroy({ where: { id } });
        } catch (error) {
          throw new Error(error);
        }
      },
    ),
  },
  ListItem: {
    // TODO: listItemId
    list: async (listItem, args, { loaders, models }) => {
      return await models.List.findByPk(listItem.listId);
    },
  },
};