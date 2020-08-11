// import bcrypt from 'bcrypt';

//   User.associate = models => {
//     //TODO: what needs to be here? what should be cascaded and what shouldnt?
//     User.hasMany(models.Message, { onDelete: 'CASCADE' });
//   };

//   User.findByLogin = async login => {
//     let user = await User.findOne({
//       where: { username: login },
//     });

//     if (!user) {
//       user = await User.findOne({
//         where: { email: login },
//       });
//     }

//     return user;
//   };

//   User.beforeCreate(async user => {
//     user.password = await user.generatePasswordHash();
//   });

//   User.prototype.generatePasswordHash = async function() {
//     const saltRounds = 10;
//     return await bcrypt.hash(this.password, saltRounds);
//   };

//   User.prototype.validatePassword = async function(password) {
//     return await bcrypt.compare(password, this.password);
//   };

//   return User;
// };

// export default user;

import * as Sequelize from 'sequelize';
import { DocumentAttributes, DocumentInstance } from './Document';
import { HomeworkAttributes, HomeworkInstance } from './Homework';
import { ListAttributes, ListInstance } from './List';
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

export const UserFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<UserInstance, UserAttributes> => {
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
    // TODO: WHAT IF THEY LOG IN WITH SOCIAL AUTH? THIS CAN BE EMPTY
    // TODO: validate { len: [6, 42] }
    password: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
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

  const User = sequelize.define<UserInstance, UserAttributes>('user', attributes);

  User.associate = models => {
    User.hasMany(models.Document, { onDelete: 'CASCADE' });
    User.hasMany(models.Homework, { as: 'homeworks' , onDelete: 'CASCADE' });
    User.hasMany(models.List, { onDelete: 'CASCADE' });
    User.hasMany(models.Product);
    User.hasMany(models.Service);
    User.hasMany(models.Question);
    User.hasOne(models.Setting);
  };

  return User;
};