import * as Sequelize from 'sequelize';
import { AnswerAttributes, AnswerInstance } from './Answer';
import { QuestionAttributes, QuestionInstance } from './Question';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface AttachmentAttributes {
  id?: number;
  name?: string | null;
  keywords?: string[] | null;
  bucketDocId: string;
  bucketName: string;
  bucketPath?: string | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  answer?: AnswerAttributes | AnswerAttributes['id'];
  question?: QuestionAttributes | QuestionAttributes['id'];
};

export interface AttachmentInstance extends Sequelize.Instance<AttachmentAttributes>, AttachmentAttributes {
  getAnswer: Sequelize.BelongsToGetAssociationMixin<AnswerInstance>;
  setAnswer: Sequelize.BelongsToSetAssociationMixin<AnswerInstance, AnswerInstance['id']>;
  createAnswer: Sequelize.BelongsToCreateAssociationMixin<AnswerAttributes, AnswerInstance>;

  getQuestion: Sequelize.BelongsToGetAssociationMixin<QuestionInstance>;
  setQuestion: Sequelize.BelongsToSetAssociationMixin<QuestionInstance, QuestionInstance['id']>;
  createQuestion: Sequelize.BelongsToCreateAssociationMixin<QuestionAttributes, QuestionInstance>;
};

export const AttachmentFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<AttachmentInstance, AttachmentAttributes> => {
  const attributes: SequelizeAttributes<AttachmentAttributes> = {
    name: {
      type: DataTypes.STRING,
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
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  };

  const Attachment = sequelize.define<AttachmentInstance, AttachmentAttributes>('attachment', attributes);

  Attachment.associate = models => {
    Attachment.belongsTo(models.Answer);
    Attachment.belongsTo(models.Question);
  };

  return Attachment;
};