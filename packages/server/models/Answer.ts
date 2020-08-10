import * as Sequelize from 'sequelize';
import { AttachmentAttributes, AttachmentInstance } from './Attachment';
import { EmployeeAttributes, EmployeeInstance } from './Employee';
import { QuestionAttributes, QuestionInstance } from './Question';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface AnswerAttributes {
  id?: number;
  body: string;
  keywords?: string[] | null;
  createdAt?: Date;
  updatedAt?: Date;
  employee?: EmployeeAttributes | EmployeeAttributes['id'];
  question?: QuestionAttributes | QuestionAttributes['id'];
  attachments?: AttachmentAttributes[] | AttachmentAttributes['id'][];
};

export interface AnswerInstance extends Sequelize.Instance<AnswerAttributes>, AnswerAttributes {
  getEmployee: Sequelize.BelongsToGetAssociationMixin<EmployeeInstance>;
  setEmployee: Sequelize.BelongsToSetAssociationMixin<EmployeeInstance, EmployeeInstance['id']>;
  createEmployee: Sequelize.BelongsToCreateAssociationMixin<EmployeeAttributes, EmployeeInstance>;

  getQuestion: Sequelize.BelongsToGetAssociationMixin<QuestionInstance>;
  setQuestion: Sequelize.BelongsToSetAssociationMixin<QuestionInstance, QuestionInstance['id']>;
  createQuestion: Sequelize.BelongsToCreateAssociationMixin<QuestionAttributes, QuestionInstance>;

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

export const AnswerFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<AnswerInstance, AnswerAttributes> => {
  const attributes: SequelizeAttributes<AnswerAttributes> = {
    body: {
      type: DataTypes.TEXT,
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
  };

  const Answer = sequelize.define<AnswerInstance, AnswerAttributes>('answer', attributes);

  Answer.associate = models => {
    Answer.belongsTo(models.Employee);
    Answer.belongsTo(models.Question);
    Answer.hasMany(models.Attachment);
  };

  return Answer;
};