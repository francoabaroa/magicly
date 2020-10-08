import * as Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';
import { ApolloError } from 'apollo-server';

import { isAuthenticated, isServiceOwner } from './authorization';

//TODO: Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.
const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    service: async (parent, { id }, { models }) => {
      if (!id) {
        return null;
      }
      return await models.Service.findByPk(id);
    },
    services: async (parent, { cursor, limit = 100 }, { models, me }) => {
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

      const services = await models.Service.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });
      const hasNextPage = services.length > limit;
      const edges = hasNextPage ? services.slice(0, -1) : services;
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
    saveService: combineResolvers(
      isAuthenticated,
      async (
        parent,
        {
          name,
          type,
          favorite,
          url,
          description
        },
        { me, models }
      ) => {
        try {
          const existingService = await models.Service.findOne({
            where: {
              name,
              type,
              url,
              userId: me.id,
            }
          });
          if (existingService) {
            existingService.favorite = favorite;
            await existingService.save();
            return existingService;
          } else {
            const newService = await models.Service.create({
              name,
              type,
              favorite,
              url,
              description,
              userId: me.id,
            });
            return newService;
          }
        } catch (error) {
          throw new ApolloError(error);
        }
      },
    ),
    deleteService: combineResolvers(
      isAuthenticated,
      isServiceOwner,
      async (parent, { id }, { models }) => {
        try {
          return await models.Service.destroy({ where: { id } });
        } catch (error) {
          throw new Error(error);
        }
      },
    ),
    favoriteService: combineResolvers(
      isAuthenticated,
      isServiceOwner,
      async (parent, { id, favorite }, { models }) => {
        try {
          const service = await models.Service.findOne({ where: { id } });
          if (!service) {
            throw Error(`Service not updated correctly. id: ${id}`);
          }
          service.favorite = favorite;
          await service.save();
          return service;
        } catch (error) {
          throw new Error(error);
        }
      },
    ),
  },
  Service: {
    user: async (service, args, { loaders, models }) => {
      return await loaders.user.load(service.userId);
    },
  },
};