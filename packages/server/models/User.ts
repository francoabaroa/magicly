import bcrypt from 'bcrypt';
import * as Sequelize from 'sequelize';
import { DocumentAttributes, DocumentInstance } from './Document';
import { HomeworkAttributes, HomeworkInstance } from './Homework';
import { ListAttributes, ListInstance } from './List';
import { PlaidAccountAttributes, PlaidAccountInstance } from './PlaidAccount';
import { ProductAttributes, ProductInstance } from './Product';
import { ServiceAttributes, ServiceInstance } from './Service';
import { QuestionAttributes, QuestionInstance } from './Question';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

export interface UserAttributes {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  currentCity: string;
  hasSocialAuthLogin: boolean;
  socialAuthId?: string | null;
  preferredSocialAuth?: 'FACEBOOK' | 'GMAIL' | 'GOOGLE' | 'GITHUB' | 'TWITTER' | 'LINKEDIN' | null;
  email: string;
  salt?: string | null;
  password?: string | null;
  gender?: 'FEMALE' | 'MALE' | 'OTHER' | null;
  cellphone?: string | null;
  dob?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  documents?: DocumentAttributes[] | DocumentAttributes['id'][];
  homeworks?: HomeworkAttributes[] | HomeworkAttributes['id'][];
  lists?: ListAttributes[] | ListAttributes['id'][];
  products?: ProductAttributes[] | ProductAttributes['id'][];
  services?: ServiceAttributes[] | ServiceAttributes['id'][];
  questions?: QuestionAttributes[] | QuestionAttributes['id'][];
  plaidAccounts?: PlaidAccountAttributes[] | PlaidAccountAttributes['id'][];
};

export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
  /* Document */
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

  /* Homework */
  getHomeworks: Sequelize.HasManyGetAssociationsMixin<HomeworkInstance>;
  setHomeworks: Sequelize.HasManySetAssociationsMixin<HomeworkInstance, HomeworkInstance['id']>;
  addHomeworks: Sequelize.HasManyAddAssociationsMixin<HomeworkInstance, HomeworkInstance['id']>;
  addHomework: Sequelize.HasManyAddAssociationMixin<HomeworkInstance, HomeworkInstance['id']>;
  createHomework: Sequelize.HasManyCreateAssociationMixin<HomeworkAttributes, HomeworkInstance>;
  removeHomework: Sequelize.HasManyRemoveAssociationMixin<HomeworkInstance, HomeworkInstance['id']>;
  removeHomeworks: Sequelize.HasManyRemoveAssociationsMixin<HomeworkInstance, HomeworkInstance['id']>;
  hasHomework: Sequelize.HasManyHasAssociationMixin<HomeworkInstance, HomeworkInstance['id']>;
  hasHomeworks: Sequelize.HasManyHasAssociationsMixin<HomeworkInstance, HomeworkInstance['id']>;
  countHomeworks: Sequelize.HasManyCountAssociationsMixin;

  /* List */
  getLists: Sequelize.HasManyGetAssociationsMixin<ListInstance>;
  setLists: Sequelize.HasManySetAssociationsMixin<ListInstance, ListInstance['id']>;
  addLists: Sequelize.HasManyAddAssociationsMixin<ListInstance, ListInstance['id']>;
  addList: Sequelize.HasManyAddAssociationMixin<ListInstance, ListInstance['id']>;
  createList: Sequelize.HasManyCreateAssociationMixin<ListAttributes, ListInstance>;
  removeList: Sequelize.HasManyRemoveAssociationMixin<ListInstance, ListInstance['id']>;
  removeLists: Sequelize.HasManyRemoveAssociationsMixin<ListInstance, ListInstance['id']>;
  hasList: Sequelize.HasManyHasAssociationMixin<ListInstance, ListInstance['id']>;
  hasLists: Sequelize.HasManyHasAssociationsMixin<ListInstance, ListInstance['id']>;
  countLists: Sequelize.HasManyCountAssociationsMixin;

  /* PlaidAccount */
  getPlaidAccounts: Sequelize.HasManyGetAssociationsMixin<PlaidAccountInstance>;
  setPlaidAccounts: Sequelize.HasManySetAssociationsMixin<PlaidAccountInstance, PlaidAccountInstance['id']>;
  addPlaidAccounts: Sequelize.HasManyAddAssociationsMixin<PlaidAccountInstance, PlaidAccountInstance['id']>;
  addPlaidAccount: Sequelize.HasManyAddAssociationMixin<PlaidAccountInstance, PlaidAccountInstance['id']>;
  createPlaidAccount: Sequelize.HasManyCreateAssociationMixin<PlaidAccountAttributes, PlaidAccountInstance>;
  removePlaidAccount: Sequelize.HasManyRemoveAssociationMixin<PlaidAccountInstance, PlaidAccountInstance['id']>;
  removePlaidAccounts: Sequelize.HasManyRemoveAssociationsMixin<PlaidAccountInstance, PlaidAccountInstance['id']>;
  hasPlaidAccount: Sequelize.HasManyHasAssociationMixin<PlaidAccountInstance, PlaidAccountInstance['id']>;
  hasPlaidAccounts: Sequelize.HasManyHasAssociationsMixin<PlaidAccountInstance, PlaidAccountInstance['id']>;
  countPlaidAccounts: Sequelize.HasManyCountAssociationsMixin;

  /* Product */
  getProducts: Sequelize.HasManyGetAssociationsMixin<ProductInstance>;
  setProducts: Sequelize.HasManySetAssociationsMixin<ProductInstance, ProductInstance['id']>;
  addProducts: Sequelize.HasManyAddAssociationsMixin<ProductInstance, ProductInstance['id']>;
  addProduct: Sequelize.HasManyAddAssociationMixin<ProductInstance, ProductInstance['id']>;
  createProduct: Sequelize.HasManyCreateAssociationMixin<ProductAttributes, ProductInstance>;
  removeProduct: Sequelize.HasManyRemoveAssociationMixin<ProductInstance, ProductInstance['id']>;
  removeProducts: Sequelize.HasManyRemoveAssociationsMixin<ProductInstance, ProductInstance['id']>;
  hasProduct: Sequelize.HasManyHasAssociationMixin<ProductInstance, ProductInstance['id']>;
  hasProducts: Sequelize.HasManyHasAssociationsMixin<ProductInstance, ProductInstance['id']>;
  countProducts: Sequelize.HasManyCountAssociationsMixin;

  /* Service */
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

  /* Question */
  getQuestions: Sequelize.HasManyGetAssociationsMixin<QuestionInstance>;
  setQuestions: Sequelize.HasManySetAssociationsMixin<QuestionInstance, QuestionInstance['id']>;
  addQuestions: Sequelize.HasManyAddAssociationsMixin<QuestionInstance, QuestionInstance['id']>;
  addQuestion: Sequelize.HasManyAddAssociationMixin<QuestionInstance, QuestionInstance['id']>;
  createQuestion: Sequelize.HasManyCreateAssociationMixin<QuestionAttributes, QuestionInstance>;
  removeQuestion: Sequelize.HasManyRemoveAssociationMixin<QuestionInstance, QuestionInstance['id']>;
  removeQuestions: Sequelize.HasManyRemoveAssociationsMixin<QuestionInstance, QuestionInstance['id']>;
  hasQuestion: Sequelize.HasManyHasAssociationMixin<QuestionInstance, QuestionInstance['id']>;
  hasQuestions: Sequelize.HasManyHasAssociationsMixin<QuestionInstance, QuestionInstance['id']>;
  countQuestions: Sequelize.HasManyCountAssociationsMixin;
};

export interface UserModel extends Sequelize.Model<UserInstance, UserAttributes> {
  //TODO: Franco update type any to correct
  findByEmail: (email: string) => Promise<UserInstance>;
  generatePasswordHash: (password: string) => Promise<any>;
  validatePassword: (password: string, userId: number) => Promise<any>;
};

export const UserFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): UserModel => {
  const attributes: SequelizeAttributes<UserAttributes> = {
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
    currentCity: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    hasSocialAuthLogin: {
      type: DataTypes.BOOLEAN,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    socialAuthId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    preferredSocialAuth: {
      type: DataTypes.ENUM(
        'FACEBOOK',
        'GMAIL',
        'GOOGLE',
        'GITHUB',
        'TWITTER',
        'LINKEDIN'
      ),
      unique: false,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    salt: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [7, 42],
      },
    },
    gender: {
      type: DataTypes.ENUM(
        'FEMALE',
        'MALE',
        'OTHER',
      ),
      unique: false,
      allowNull: true,
    },
    cellphone: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      unique: false,
      allowNull: true,
    },
  };

  const User: UserModel = sequelize.define<UserInstance, UserAttributes>('user', attributes) as UserModel;

  // source: https://github.com/ahmerb/typescript-sequelize-example/issues/2
  User.findByEmail = async (email: string) => {
    const user = await User.findOne({
      where: { email }
    });
    return user;
  };

  User.beforeCreate(async (user: UserInstance) => {
    user.password = await User.generatePasswordHash(user.password);
  });

  User.generatePasswordHash = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  User.validatePassword = async function (password: string, userId: number) {
    const user = await User.findByPk(userId);
    return await bcrypt.compare(password, user.password);
  };

  User.associate = models => {
    User.hasMany(models.Document, { onDelete: 'CASCADE' });
    User.hasMany(models.Homework, { as: 'homeworks' , onDelete: 'CASCADE' });
    User.hasMany(models.List, { as: 'lists', onDelete: 'CASCADE' });
    User.hasMany(models.Product);
    User.hasMany(models.PlaidAccount, { as: 'plaidAccounts', onDelete: 'CASCADE' });
    User.hasMany(models.Service);
    User.hasMany(models.Question);
    User.hasOne(models.Setting);
  };

  return User;
};