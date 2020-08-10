import * as Sequelize from 'sequelize';
import { UserAttributes, UserInstance } from './User';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface ProductAttributes {
  id?: number;
  name: string;
  type: 'BEAUTY' | 'HEALTH' | 'TRANSPORTATION' | 'SPORT' | 'BOOK';
  keywords?: string[] | null;
  favorite?: boolean | null;
  ratingScore?: number | null;
  cost?: number | null;
  costCurrency?: 'USD' | 'MXN' | null;
  url?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserAttributes | UserAttributes['id'];
};

export interface ProductInstance extends Sequelize.Instance<ProductAttributes>, ProductAttributes {
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  setUser: Sequelize.BelongsToSetAssociationMixin<UserInstance, UserInstance['id']>;
  createUser: Sequelize.BelongsToCreateAssociationMixin<UserAttributes, UserInstance>;
};

export const ProductFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<ProductInstance, ProductAttributes> => {
  const attributes: SequelizeAttributes<ProductAttributes> = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // TODO: We need more product types. Make sure to update graphql
    type: {
      type: DataTypes.ENUM(
        'BEAUTY',
        'HEALTH',
        'TRANSPORTATION',
        'SPORT',
        'BOOK',
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

  const Product = sequelize.define<ProductInstance, ProductAttributes>('product', attributes);

  Product.associate = models => {
    Product.belongsTo(models.User);
  };

  return Product;
};