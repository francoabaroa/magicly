import * as Sequelize from 'sequelize';
import { HomeworkAttributes, HomeworkInstance } from './Homework';
import { UserAttributes, UserInstance } from './User';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface ServiceAttributes {
  id?: number;
  name: string;
  type: 'HOME' | 'PERSONAL';
  keywords?: string[] | null;
  favorite?: boolean | null;
  ratingScore?: number | null;
  email?: string | null;
  phone?: string | null;
  description?: string | null;
  cost?: number | null;
  costCurrency?: 'USD' | 'MXN' | null;
  url?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserAttributes | UserAttributes['id'];
  homework?: HomeworkAttributes | HomeworkAttributes['id'];
};

export interface ServiceInstance extends Sequelize.Instance<ServiceAttributes>, ServiceAttributes {
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  setUser: Sequelize.BelongsToSetAssociationMixin<UserInstance, UserInstance['id']>;
  createUser: Sequelize.BelongsToCreateAssociationMixin<UserAttributes, UserInstance>;
  getHomework: Sequelize.BelongsToGetAssociationMixin<HomeworkInstance>;
  setHomework: Sequelize.BelongsToSetAssociationMixin<HomeworkInstance, HomeworkInstance['id']>;
  createHomework: Sequelize.BelongsToCreateAssociationMixin<HomeworkAttributes, HomeworkInstance>;
};

export const ServiceFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<ServiceInstance, ServiceAttributes> => {
  const attributes: SequelizeAttributes<ServiceAttributes> = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // TODO: We need more Service types. Make sure to update graphql
    type: {
      type: DataTypes.ENUM(
        'HOME',
        'PERSONAL',
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
    favorite: {
      type: DataTypes.BOOLEAN,
      unique: false,
      allowNull: true,
    },
    ratingScore: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cost: {
      type: DataTypes.DECIMAL(10,2),
      unique: false,
      allowNull: true,
    },
    costCurrency: {
      type: DataTypes.ENUM(
        'USD',
        'MXN',
      ),
      unique: false,
      allowNull: true,
    },
    // TODO: update graphql
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  };

  const Service = sequelize.define<ServiceInstance, ServiceAttributes>('service', attributes);

  Service.associate = models => {
    Service.belongsTo(models.User);
    Service.belongsTo(models.Homework);
  };

  return Service;
};