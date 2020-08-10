import * as Sequelize from 'sequelize';
import { HomeworkAttributes, HomeworkInstance } from './Homework';
import { UserAttributes, UserInstance } from './User';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface DocumentAttributes {
  id?: number;
  name: string;
  type: 'IMAGE' | 'RECEIPT' | 'MANUAL' | 'WARRANTY' | 'TAX' | 'PROPERTY' | 'INSURANCE' | 'CERTIFICATE' | 'FAMILY' | 'EXPENSE' | 'INVESTMENT' | 'OTHER';
  tag?: 'HOME' | 'TRANSPORTATION' | 'FOOD' | 'UTILITY' | 'MEDICAL' | 'TRAVEL' | 'GIFT' | 'SERVICE' | 'PRODUCT' | 'RECREATION' | null;
  keywords?: string[] | null;
  bucketDocId: string;
  bucketName: string;
  bucketPath?: string | null;
  docValue?: number | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  homework?: HomeworkAttributes | HomeworkAttributes['id'] | null;
  user?: UserAttributes | UserAttributes['id'];
};

export interface DocumentInstance extends Sequelize.Instance<DocumentAttributes>, DocumentAttributes {
  getHomework: Sequelize.BelongsToGetAssociationMixin<HomeworkInstance>;
  setHomework: Sequelize.BelongsToSetAssociationMixin<HomeworkInstance, HomeworkInstance['id']>;
  createHomework: Sequelize.BelongsToCreateAssociationMixin<HomeworkAttributes, HomeworkInstance>;
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  setUser: Sequelize.BelongsToSetAssociationMixin<UserInstance, UserInstance['id']>;
  createUser: Sequelize.BelongsToCreateAssociationMixin<UserAttributes, UserInstance>;
};

export const DocumentFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<DocumentInstance, DocumentAttributes> => {
  const attributes: SequelizeAttributes<DocumentAttributes> = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.ENUM(
        'IMAGE',
        'RECEIPT',
        'MANUAL',
        'WARRANTY',
        'TAX',
        'PROPERTY',
        'INSURANCE',
        'CERTIFICATE',
        'FAMILY',
        'EXPENSE',
        'INVESTMENT',
        'OTHER',
      ),
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tag: {
      type: DataTypes.ENUM(
        'HOME',
        'TRANSPORTATION',
        'FOOD',
        'UTILITY',
        'MEDICAL',
        'TRAVEL',
        'GIFT',
        'SERVICE',
        'PRODUCT',
        'RECREATION',
      ),
      unique: false,
      allowNull: true,
    },
    keywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      unique: false,
      allowNull: true,
    },
    bucketDocId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bucketName: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bucketPath: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
    docValue: {
      type: DataTypes.DECIMAL(10,2),
      unique: false,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  };

  const Document = sequelize.define<DocumentInstance, DocumentAttributes>('document', attributes);

  Document.associate = models => {
    Document.belongsTo(models.User);
    Document.belongsTo(models.Homework);
  };

  return Document;
};