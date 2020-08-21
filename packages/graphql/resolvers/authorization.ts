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