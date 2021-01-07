import * as Sequelize from 'sequelize';
import { AnswerAttributes, AnswerInstance } from './Answer';
import { AttachmentAttributes, AttachmentInstance } from './Attachment';
import { UserAttributes, UserInstance } from './User';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface QuestionAttributes {
  id?: number;
  body: string;
  type: 'TECH' | 'HOME' | 'FINANCE' | 'SCAM' | 'SERVICE' | 'PRODUCT' | 'APP';
  keywords?: string[] | null;
  status: 'PENDING' | 'SOLVED' | 'UNSOLVED' | 'CANCELLED';
  notificationType: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'CALL' | 'NONE';
  urgent?: boolean | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserAttributes | UserAttributes['id'];
  answers?: AnswerAttributes[] | AnswerAttributes['id'][];
  attachments?: AttachmentAttributes[] | AttachmentAttributes['id'][] | null;
};

export interface QuestionInstance extends Sequelize.Instance<QuestionAttributes>, QuestionAttributes {
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  setUser: Sequelize.BelongsToSetAssociationMixin<UserInstance, UserInstance['id']>;
  createUser: Sequelize.BelongsToCreateAssociationMixin<UserAttributes, UserInstance>;

  /* Answer */
  getAnswers: Sequelize.HasManyGetAssociationsMixin<AnswerInstance>;
  setAnswers: Sequelize.HasManySetAssociationsMixin<AnswerInstance, AnswerInstance['id']>;
  addAnswers: Sequelize.HasManyAddAssociationsMixin<AnswerInstance, AnswerInstance['id']>;
  addAnswer: Sequelize.HasManyAddAssociationMixin<AnswerInstance, AnswerInstance['id']>;
  createAnswer: Sequelize.HasManyCreateAssociationMixin<AnswerAttributes, AnswerInstance>;
  removeAnswer: Sequelize.HasManyRemoveAssociationMixin<AnswerInstance, AnswerInstance['id']>;
  removeAnswers: Sequelize.HasManyRemoveAssociationsMixin<AnswerInstance, AnswerInstance['id']>;
  hasAnswer: Sequelize.HasManyHasAssociationMixin<AnswerInstance, AnswerInstance['id']>;
  hasAnswers: Sequelize.HasManyHasAssociationsMixin<AnswerInstance, AnswerInstance['id']>;
  countAnswers: Sequelize.HasManyCountAssociationsMixin;

  getAttachments: Sequelize.HasManyGetAssociationsMixin<AttachmentInstance>;
  setAttachments: Sequelize.HasManySetAssociationsMixin<AttachmentInstance, AttachmentInstance['id']>;
  addAttachments: Sequelize.HasManyAddAssociationsMixin<AttachmentInstance, AttachmentInstance['id']>;
  addAttachment: Sequelize.HasManyAddAssociationMixin<AttachmentInstance, AttachmentInstance['id']>;
  createAttachment: Sequelize.HasManyCreateAssociationMixin<AttachmentAttributes, AttachmentInstance>;
  removeAttachment: Sequelize.HasManyRemoveAssociationMixin<AttachmentInstance, AttachmentInstance['id']>;
  removeAttachments: Sequelize.HasManyRemoveAssociationsMixin<AttachmentInstance, AttachmentInstance['id']>;
  hasAttachment: Sequelize.HasManyHasAssociationMixin<AttachmentInstance, AttachmentInstance['id']>;
  hasAttachments: Sequelize.HasManyHasAssociationsMixin<AttachmentInstance, AttachmentInstance['id']>;
  countAttachments: Sequelize.HasManyCountAssociationsMixin;
};

export const QuestionFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<QuestionInstance, QuestionAttributes> => {
  const attributes: SequelizeAttributes<QuestionAttributes> = {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.ENUM(
        'TECH',
        'HOME',
        'FINANCE',
        'SCAM',
        'SERVICE',
        'PRODUCT',
        'APP',
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
        'PENDING',
        'SOLVED',
        'UNSOLVED',
        'CANCELLED',
      ),
      defaultValue: 'PENDING',
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
        'NONE'
      ),
      defaultValue: 'NONE',
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    urgent: {
      type: DataTypes.BOOLEAN,
      unique: false,
      allowNull: true,
    },
  };

  const Question = sequelize.define<QuestionInstance, QuestionAttributes>('question', attributes);

  Question.associate = models => {
    Question.belongsTo(models.User);
    Question.hasMany(models.Answer, { as: 'answers', onDelete: 'CASCADE' });
    Question.hasMany(models.Attachment, { as: 'attachments', onDelete: 'CASCADE' });
  };

  return Question;
};