import * as Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';
import { ApolloError } from 'apollo-server';

import { isAuthenticated, isQuestionOwner } from './authorization';

//TODO: Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.
const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    question: async (parent, { id }, { models }) => {
      if (!id) {
        return null;
      }
      return await models.Question.findByPk(id);
    },
    questions: async (parent, { cursor, limit = 100 }, { models, me }) => {
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

      const questions = await models.Question.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });
      const hasNextPage = questions.length > limit;
      const edges = hasNextPage ? questions.slice(0, -1) : questions;
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
    createQuestion: combineResolvers(
      isAuthenticated,
      async (
        parent,
        {
          body,
          type,
          urgent,
          notificationType
        },
        { me, models }
      ) => {
        try {
          const question = await models.Question.create({
            body,
            type,
            urgent,
            notificationType,
            userId: me.id,
          });
          return question;
        } catch (error) {
          throw new ApolloError(error);
        }
      },
    ),
    deleteQuestion: combineResolvers(
      isAuthenticated,
      isQuestionOwner,
      async (parent, { id }, { models }) => {
        try {
          return await models.Question.destroy({ where: { id } });
        } catch (error) {
          throw new Error(error);
        }
      },
    ),
  },
  Question: {
    user: async (question, args, { loaders, models }) => {
      return await loaders.user.load(question.userId);
    },
    answers: async (question, args, { models }) => {
      if (!question) {
        return null;
      }
      return await models.Answer.findAll({
        where: {
          questionId: question.id,
        },
      });
    },
    attachments: async (question, args, { models }) => {
      if (!question) {
        return null;
      }
      return await models.Attachment.findAll({
        where: {
          questionId: question.id,
        },
      });
    },
  },
};