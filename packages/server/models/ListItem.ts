import * as Sequelize from 'sequelize';
import { ListAttributes, ListInstance } from './List';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface ListItemAttributes {
  id?: number;
  name: string;
  type: 'TODO' | 'MOVIE' | 'TV' | 'FOOD' | 'RESTAURANT' | 'MUSIC' | 'TRAVEL' | 'ACCOMODATION' | 'HOME' | 'FINANCE' | 'BOOK' | 'PODCAST' | 'PRODUCT' | 'SERVICE' | 'PERSONAL' | 'WORK' | 'FAMILY' | 'HEALTH' | 'SHOPPING' | 'GIFT' | 'OTHER';
  keywords?: string[] | null;
  notificationType?: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'CALL' | 'NONE';
  complete?: boolean | null;
  favorite?: boolean | null;
  quantity?: number | null;
  notes?: string | null;
  executionDate?: Date | null;
  executor?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  list?: ListAttributes | ListAttributes['id'];
};

export interface ListItemInstance extends Sequelize.Instance<ListItemAttributes>, ListItemAttributes {
  getList: Sequelize.BelongsToGetAssociationMixin<ListInstance>;
  setList: Sequelize.BelongsToSetAssociationMixin<ListInstance, ListInstance['id']>;
  createList: Sequelize.BelongsToCreateAssociationMixin<ListAttributes, ListInstance>;
};

export const ListItemFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<ListItemInstance, ListItemAttributes> => {
  const attributes: SequelizeAttributes<ListItemAttributes> = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.ENUM(
        'TODO',
        'MOVIE',
        'TV',
        'FOOD',
        'RESTAURANT',
        'MUSIC',
        'TRAVEL',
        'ACCOMODATION',
        'BOOK',
        'PODCAST',
        'HOME',
        'FINANCE',
        'PRODUCT',
        'SERVICE',
        'PERSONAL',
        'WORK',
        'FAMILY',
        'HEALTH',
        'SHOPPING',
        'GIFT',
        'OTHER'
      ),
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    keywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      unique: false,
      allowNull: true,
    },
    notificationType: {
      type: DataTypes.ENUM(
        'EMAIL',
        'SMS',
        'WHATSAPP',
        'CALL',
        'NONE'
      ),
      unique: false,
      allowNull: true,
    },
    complete: {
      type: DataTypes.BOOLEAN,
      unique: false,
      allowNull: true,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      unique: false,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    executionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    executor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  };

  const ListItem = sequelize.define<ListItemInstance, ListItemAttributes>('listItem', attributes);

  ListItem.associate = models => {
    ListItem.belongsTo(models.List);
  };

  return ListItem;
};