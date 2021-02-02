import * as Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';
import { ApolloError } from 'apollo-server';

import { isAuthenticated, isDocumentOwner } from './authorization';

//TODO: Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.
const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    getDocumentAndUrl: combineResolvers(
      isAuthenticated,
      isDocumentOwner,
      async (parent, { id }, { me, models, getS3Url }) => {
        try {
          const document = await models.Document.findByPk(id);
          const url = await getS3Url(me.id, me.email, document.bucketDocId);
          return { url: url, document: document }
        } catch (error) {
          throw new Error(error);
        }
      },
    ),
    document: async (parent, { id }, { models }) => {
      if (!id) {
        return null;
      }
      return await models.Document.findByPk(id);
    },
    documents: async (parent, { docTypes, cursor, limit = 100 }, { models, me }) => {
      const cursorOptions = cursor
        ? {
          where: {
            createdAt: {
              [Sequelize.Op.lt]: fromCursorHash(cursor),
            },
            userId: me.id,
            type: {
              [Sequelize.Op.in]: docTypes
            }
          },
        }
        : {
          where: {
            userId: me.id,
            type: {
              [Sequelize.Op.in]: docTypes
            }
          }
        };

      const documents = await models.Document.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      //TODO: add this protection for hasNextPage and edges and endCursor in other resolvers
      const hasNextPage = documents && documents.length > limit;
      const edges = hasNextPage ? documents.slice(0, -1) : documents;
      const endCursor = edges && edges.length > 0 ? toCursorHash(
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
    addDocument: combineResolvers(
      isAuthenticated,
      async (
        parent,
        { file, name, type, keywords, notes, homeworkId, docValue },
        { singleUpload, me, models, bucketName, environment }
      ) => {
        try {
          const uploadedFile = await singleUpload(file, me);
          let document = {};
          if (uploadedFile && uploadedFile.filename) {
            document = await models.Document.create({
              name,
              type,
              bucketDocId: uploadedFile.filename,
              bucketName,
              bucketPath: bucketName + '/' + me.id + '_' + environment,
              keywords,
              notes,
              docValue,
              userId: me.id,
              homeworkId: homeworkId ? homeworkId : null,
            });
          }

          // TODO: need to return document ?
          return uploadedFile;
        } catch (error) {
          throw new ApolloError(error);
        }
      },
    ),
    deleteDocument: combineResolvers(
      isAuthenticated,
      isDocumentOwner,
      async (parent, { id }, { me, models, deleteS3File }) => {
        try {
          const document = await models.Document.findByPk(id);
          if (!document) {
            throw new Error('Document does not exist');
          }
          const deletedInfo =
            await deleteS3File(
              me.id,
              me.email, document.bucketDocId
            );

          if (Object.keys(deletedInfo).length > 0) {
            throw new Error('Document not deleted correctly?');
          }

          return await models.Document.destroy({ where: { id } });
        } catch (error) {
          throw new Error(error);
        }
      },
    ),
  },
  Document: {
    user: async (document, args, { loaders, models }) => {
      return await loaders.user.load(document.userId);
    },
    homework: async (document, args, { loaders, models }) => {
      return await models.Homework.findOne({ where: { id: document.homeworkId } });
    },
  },
};