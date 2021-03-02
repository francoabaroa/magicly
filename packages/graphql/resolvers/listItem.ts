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
    listItems: async (parent, { listType, excludeComplete, cursor, limit = 100 }, { models, me }) => {
      let list = await models.List.findOne({
        where: { type: listType, userId: me.id }
      });

      if (list === null) {
        list = await models.List.create({
          name: listType.toLowerCase(),
          type: listType,
          userId: me.id
        });
      }

      const listId = list && list.id ? list.id : null;

      if (listId === null) {
        throw new ApolloError('No list id.');
      }

      const cursorOptions = cursor
        ? {
          where: {
            createdAt: {
              [Sequelize.Op.lt]: fromCursorHash(cursor),
            },
            listId: listId
          },
        }
        : {
          where: {
            listId: listId,
          }
        };

      if (excludeComplete) {
        cursorOptions.where['complete'] = !excludeComplete;
      }

      const listItems = await models.ListItem.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = listItems.length > limit;
      const edges = hasNextPage ? listItems.slice(0, -1) : listItems;
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
    },
    recentRecommendations: async (parent, { listType = 'RECOMMENDATION', excludeComplete = false, cursor, limit = 5 }, { models, me }) => {
      let list = await models.List.findOne({
        where: { type: 'RECOMMENDATION', userId: me.id }
      });

      if (list === null) {
        list = await models.List.create({
          name: 'RECOMMENDATION'.toLowerCase(),
          type: 'RECOMMENDATION',
          userId: me.id
        });
      }

      const listId = list && list.id ? list.id : null;

      if (listId === null) {
        throw new ApolloError('No list id.');
      }

      const cursorOptions = cursor
        ? {
          where: {
            createdAt: {
              [Sequelize.Op.lt]: fromCursorHash(cursor),
            },
            listId: listId
          },
        }
        : {
          where: {
            listId: listId,
          }
        };

      if (excludeComplete) {
        cursorOptions.where['complete'] = !excludeComplete;
      }

      const listItems = await models.ListItem.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = listItems.length > limit;
      const edges = hasNextPage ? listItems.slice(0, -1) : listItems;
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
    },
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
          executionDate,
          notificationType
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
            complete: false,
            executionDate,
            notificationType
          });

          return listItem;
        } catch (error) {
          throw new ApolloError(error);
        }
      },
    ),
    completeListItem: combineResolvers(
      isAuthenticated,
      async (parent, { id, complete }, { me, models }) => {
        try {
          const listItem = await models.ListItem.findByPk(id);

          if (!listItem) {
            throw new ApolloError('No existing list item found.');
          }

          if (listItem) {
            listItem.complete = complete;
            await listItem.save();
          }
          return listItem;
        } catch (error) {
          throw new Error(error);
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
    list: async (listItem, args, { loaders, models }) => {
      return await loaders.list.load(listItem.listId);
    },
  },
};