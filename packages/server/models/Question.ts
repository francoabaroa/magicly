import * as Sequelize from 'sequelize';
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
  // TODO: need space for answer here
};

export interface QuestionInstance extends Sequelize.Instance<QuestionAttributes>, QuestionAttributes {
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  setUser: Sequelize.BelongsToSetAssociationMixin<UserInstance, UserInstance['id']>;
  createUser: Sequelize.BelongsToCreateAssociationMixin<UserAttributes, UserInstance>;
  // need methods for getting answer
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
    Question.hasOne(models.Answer);
  };

  return Question;
};