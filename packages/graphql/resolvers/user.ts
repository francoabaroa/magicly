import users from '../mockData/mockUserData';

export default {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
    user: (parent, { id }) => {
      return users[id];
    },
    users: () => {
      return Object.values(users);
    },
  },
  Mutation: {},
  User: {
    firstName: user => {
      return user.firstName;
    },
  },
};