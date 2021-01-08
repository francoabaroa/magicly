import * as Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';
import { ApolloError } from 'apollo-server';

import { isAuthenticated, isAnswerOwner } from './authorization';

//TODO: Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.
const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {},
  Mutation: {
    createAnswer: combineResolvers(
      isAuthenticated,
      async (
        parent,
        {
          answerBody,
          questionStatus,
          questionId,
          isUserAnswer,
          userId,
          employeeId
        },
        { models }
      ) => {
        try {
          const question = await models.Question.findOne({where: {
            id: questionId,
            userId,
          }});

          if (question) {
            question.status = questionStatus;
            await question.save();
          }
          const answer = await models.Answer.create({
            body: answerBody,
            isUserAnswer,
            employeeId,
            questionId,
          });

          return answer;
        } catch (error) {
          throw new ApolloError(error);
        }
      },
    ),
    deleteAnswer: combineResolvers(
      isAuthenticated,
      isAnswerOwner,
      async (parent, { id }, { models }) => {
        try {
          return await models.Answer.destroy({ where: { id } });
        } catch (error) {
          throw new Error(error);
        }
      },
    ),
  },
  Answer: {
    attachments: async (answer, args, { models }) => {
      if (!answer) {
        return null;
      }
      return await models.Attachment.findAll({
        where: {
          answerId: answer.id,
        },
      });
    },
    employee: async (answer, args, { models }) => {
      if (!answer) {
        return null;
      }
      return await models.Employee.findOne({
        where: {
          id: answer.employeeId,
        },
      });
    },
    question: async (answer, args, { models }) => {
      if (!answer) {
        return null;
      }
      return await models.Question.findOne({
        where: {
          id: answer.questionId,
        },
      });
    },
  },
};