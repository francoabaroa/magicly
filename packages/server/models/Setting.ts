import * as Sequelize from 'sequelize';
import { UserAttributes, UserInstance } from './User';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface SettingAttributes {
  id?: number;
  languageIso2: 'EN' | 'ES';
  defaultNotificationType: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'CALL';
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserAttributes | UserAttributes['id'];
};

export interface SettingInstance extends Sequelize.Instance<SettingAttributes>, SettingAttributes {
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  setUser: Sequelize.BelongsToSetAssociationMixin<UserInstance, UserInstance['id']>;
  createUser: Sequelize.BelongsToCreateAssociationMixin<UserAttributes, UserInstance>;
};

export const SettingFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<SettingInstance, SettingAttributes> => {
  const attributes: SequelizeAttributes<SettingAttributes> = {
    languageIso2: {
      type: DataTypes.ENUM(
        'EN',
        'ES',
      ),
      allowNull: false,
      defaultValue: 'EN',
      validate: {
        notEmpty: true,
      },
    },
    defaultNotificationType: {
      type: DataTypes.ENUM(
        'EMAIL',
        'SMS',
        'WHATSAPP',
        'CALL',
        'NONE'
      ),
      unique: false,
      defaultValue: 'NONE',
      allowNull: false,
    },
  };

  const Setting = sequelize.define<SettingInstance, SettingAttributes>('setting', attributes);

  Setting.associate = models => {
    Setting.belongsTo(models.User);
  };

  return Setting;
};