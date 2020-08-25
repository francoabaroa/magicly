import * as Sequelize from 'sequelize';
import { ListItemAttributes, ListItemInstance } from './ListItem';
import { UserAttributes, UserInstance } from './User';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface ListAttributes {
  id?: number;
  name?: string | null;
  type: 'WATCH' | 'LATER' | 'TODO' | 'ANTI' | 'RECOMMENDATION' | 'GROCERY' | 'SHOPPING' | 'PRODUCT' | 'SERVICE';
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserAttributes | UserAttributes['id'];
  listItems?: ListItemAttributes[] | ListItemAttributes['id'][];
};

export interface ListInstance extends Sequelize.Instance<ListAttributes>, ListAttributes {
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  setUser: Sequelize.BelongsToSetAssociationMixin<UserInstance, UserInstance['id']>;
  createUser: Sequelize.BelongsToCreateAssociationMixin<UserAttributes, UserInstance>;
  getListItems: Sequelize.HasManyGetAssociationsMixin<ListItemInstance>;
  setListItems: Sequelize.HasManySetAssociationsMixin<ListItemInstance, ListItemInstance['id']>;
  addListItems: Sequelize.HasManyAddAssociationsMixin<ListItemInstance, ListItemInstance['id']>;
  addListItem: Sequelize.HasManyAddAssociationMixin<ListItemInstance, ListItemInstance['id']>;
  createListItem: Sequelize.HasManyCreateAssociationMixin<ListItemAttributes, ListItemInstance>;
  removeListItem: Sequelize.HasManyRemoveAssociationMixin<ListItemInstance, ListItemInstance['id']>;
  removeListItems: Sequelize.HasManyRemoveAssociationsMixin<ListItemInstance, ListItemInstance['id']>;
  hasListItem: Sequelize.HasManyHasAssociationMixin<ListItemInstance, ListItemInstance['id']>;
  hasListItems: Sequelize.HasManyHasAssociationsMixin<ListItemInstance, ListItemInstance['id']>;
  countListItems: Sequelize.HasManyCountAssociationsMixin;
};

export const ListFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<ListInstance, ListAttributes> => {
  const attributes: SequelizeAttributes<ListAttributes> = {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(
        'WATCH',
        'LATER',
        'TODO',
        'ANTI',
        'RECOMMENDATION',
        'GROCERY',
        'SHOPPING',
        'PRODUCT',
        'SERVICE'
      ),
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  };

  const List = sequelize.define<ListInstance, ListAttributes>('list', attributes);

  List.associate = models => {
    List.belongsTo(models.User);
    List.hasMany(models.ListItem, { as: 'listItems', onDelete: 'CASCADE' });
  };

  return List;
};