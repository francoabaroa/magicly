import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { models, me }) => {
  return me ? skip : new ForbiddenError('Not authenticated as user.');
}

export const isHomeworkOwner = async (
  parent,
  { id },
  { models, me },
) => {
  const homework = await models.Homework.findByPk(id, { raw: true });

  if (homework.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }

  return skip;
};

export const isListOwner = async (
  parent,
  { id },
  { models, me },
) => {
  const question = await models.List.findByPk(id, { raw: true });

  if (question.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }

  return skip;
};

export const isQuestionOwner = async (
  parent,
  { id },
  { models, me },
) => {
  const question = await models.Question.findByPk(id, { raw: true });

  if (question.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }

  return skip;
};

export const isDocumentOwner = async (
  parent,
  { id },
  { models, me },
) => {
  const document = await models.Document.findByPk(id, { raw: true });

  if (document.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }

  return skip;
};
