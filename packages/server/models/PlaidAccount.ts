import * as Sequelize from 'sequelize';
import { UserAttributes, UserInstance } from './User';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface PlaidAccountAttributes {
  id?: number;
  accessToken: string;
  itemId: string;
  institutionId: string;
  institutionName?: string | null;
  accountName?: string | null;
  accountType?: string | null;
  accountSubtype?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserAttributes | UserAttributes['id'];
};

export interface PlaidAccountInstance extends Sequelize.Instance<PlaidAccountAttributes>, PlaidAccountAttributes {
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  setUser: Sequelize.BelongsToSetAssociationMixin<UserInstance, UserInstance['id']>;
  createUser: Sequelize.BelongsToCreateAssociationMixin<UserAttributes, UserInstance>;
};

export const PlaidAccountFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<PlaidAccountInstance, PlaidAccountAttributes> => {
  const attributes: SequelizeAttributes<PlaidAccountAttributes> = {
    accessToken: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    itemId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    institutionId: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    institutionName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountSubtype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  };

  const PlaidAccount = sequelize.define<PlaidAccountInstance, PlaidAccountAttributes>('plaidAccount', attributes);

  PlaidAccount.associate = models => {
    PlaidAccount.belongsTo(models.User);
  };

  return PlaidAccount;
};