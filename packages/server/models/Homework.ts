import * as Sequelize from 'sequelize';
import { DocumentAttributes, DocumentInstance } from './Document';
import { ServiceAttributes, ServiceInstance } from './Service';
import { UserAttributes, UserInstance } from './User';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface HomeworkAttributes {
  id?: number;
  title: string;
  type: 'MAINTENANCE' | 'REPAIR' | 'INSTALLATION' | 'CLEANING' | 'OTHER';
  keywords?: string[] | null;
  status: 'UPCOMING' | 'PAST';
  notificationType: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'CALL';
  cost?: number | null;
  costCurrency?: 'USD' | 'MXN' | null;
  notes?: string | null;
  executionDate?: Date | null;
  executor?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserAttributes | UserAttributes['id'];
  documents?: DocumentAttributes[] | DocumentAttributes['id'][];
  services?: ServiceAttributes[] | ServiceAttributes['id'][];
};

export interface HomeworkInstance extends Sequelize.Instance<HomeworkAttributes>, HomeworkAttributes {
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  setUser: Sequelize.BelongsToSetAssociationMixin<UserInstance, UserInstance['id']>;
  createUser: Sequelize.BelongsToCreateAssociationMixin<UserAttributes, UserInstance>;

  getDocuments: Sequelize.HasManyGetAssociationsMixin<DocumentInstance>;
  setDocuments: Sequelize.HasManySetAssociationsMixin<DocumentInstance, DocumentInstance['id']>;
  addDocuments: Sequelize.HasManyAddAssociationsMixin<DocumentInstance, DocumentInstance['id']>;
  addDocument: Sequelize.HasManyAddAssociationMixin<DocumentInstance, DocumentInstance['id']>;
  createDocument: Sequelize.HasManyCreateAssociationMixin<DocumentAttributes, DocumentInstance>;
  removeDocument: Sequelize.HasManyRemoveAssociationMixin<DocumentInstance, DocumentInstance['id']>;
  removeDocuments: Sequelize.HasManyRemoveAssociationsMixin<DocumentInstance, DocumentInstance['id']>;
  hasDocument: Sequelize.HasManyHasAssociationMixin<DocumentInstance, DocumentInstance['id']>;
  hasDocuments: Sequelize.HasManyHasAssociationsMixin<DocumentInstance, DocumentInstance['id']>;
  countDocuments: Sequelize.HasManyCountAssociationsMixin;

  getServices: Sequelize.HasManyGetAssociationsMixin<ServiceInstance>;
  setServices: Sequelize.HasManySetAssociationsMixin<ServiceInstance, ServiceInstance['id']>;
  addServices: Sequelize.HasManyAddAssociationsMixin<ServiceInstance, ServiceInstance['id']>;
  addService: Sequelize.HasManyAddAssociationMixin<ServiceInstance, ServiceInstance['id']>;
  createService: Sequelize.HasManyCreateAssociationMixin<ServiceAttributes, ServiceInstance>;
  removeService: Sequelize.HasManyRemoveAssociationMixin<ServiceInstance, ServiceInstance['id']>;
  removeServices: Sequelize.HasManyRemoveAssociationsMixin<ServiceInstance, ServiceInstance['id']>;
  hasService: Sequelize.HasManyHasAssociationMixin<ServiceInstance, ServiceInstance['id']>;
  hasServices: Sequelize.HasManyHasAssociationsMixin<ServiceInstance, ServiceInstance['id']>;
  countServices: Sequelize.HasManyCountAssociationsMixin;
};

export const HomeworkFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<HomeworkInstance, HomeworkAttributes> => {
  const attributes: SequelizeAttributes<HomeworkAttributes> = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.ENUM(
        'MAINTENANCE',
        'REPAIR',
        'INSTALLATION',
        'CLEANING',
        'OTHER',
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
    status: {
      type: DataTypes.ENUM(
        'UPCOMING',
        'PAST',
      ),
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    notificationType: {
      type: DataTypes.ENUM(
        'EMAIL',
        'SMS',
        'WHATSAPP',
        'CALL',
      ),
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
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

  const Homework = sequelize.define<HomeworkInstance, HomeworkAttributes>('homework', attributes);

  Homework.associate = models => {
    Homework.belongsTo(models.User);
    Homework.hasMany(models.Document);
    Homework.hasMany(models.Service);
  };

  return Homework;
};