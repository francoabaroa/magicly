import * as Sequelize from 'sequelize';
import { AnswerAttributes, AnswerInstance } from './Answer';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface EmployeeAttributes {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  googleid?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  answers?: AnswerAttributes[] | AnswerAttributes['id'][];
};

export interface EmployeeInstance extends Sequelize.Instance<EmployeeAttributes>, EmployeeAttributes {
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
};

export const EmployeeFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<EmployeeInstance, EmployeeAttributes> => {
  const attributes: SequelizeAttributes<EmployeeAttributes> = {
    firstName: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
    displayName: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
    googleid: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
  };

  const Employee = sequelize.define<EmployeeInstance, EmployeeAttributes>('employee', attributes);

  Employee.associate = models => {
    Employee.hasMany(models.Answer);
  };

  return Employee;
};