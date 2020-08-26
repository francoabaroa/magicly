export const batchLists = async (keys, models) => {
  const lists = await models.List.findAll({
    where: {
      id: keys,
    },
  });
  return keys.map(key => lists.find(list => list.id === key));
};