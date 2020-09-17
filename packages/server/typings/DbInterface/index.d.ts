import * as Sequelize from 'sequelize';
import { AnswerAttributes, AnswerInstance } from '../../models/Answer';
import { AttachmentAttributes, AttachmentInstance } from '../../models/Attachment';
import { DocumentAttributes, DocumentInstance } from '../../models/Document';
import { EmployeeAttributes, EmployeeInstance } from '../../models/Employee';
import { HomeworkAttributes, HomeworkInstance } from '../../models/Homework';
import { ListAttributes, ListInstance } from '../../models/List';
import { ListItemAttributes, ListItemInstance } from '../../models/ListItem';
import { PlaidAccountAttributes, PlaidAccountInstance } from '../../models/PlaidAccount';
import { ProductAttributes, ProductInstance } from '../../models/Product';
import { QuestionAttributes, QuestionInstance } from '../../models/Question';
import { ServiceAttributes, ServiceInstance } from '../../models/Service';
import { SettingAttributes, SettingInstance } from '../../models/Setting';
import { UserModel } from '../../models/User';

export interface DbInterface {
  sequelize: Sequelize.Sequelize;
  Sequelize: Sequelize.SequelizeStatic;
  Answer: Sequelize.Model<AnswerInstance, AnswerAttributes>;
  Attachment: Sequelize.Model<AttachmentInstance, AttachmentAttributes>;
  Document: Sequelize.Model<DocumentInstance, DocumentAttributes>;
  Employee: Sequelize.Model<EmployeeInstance, EmployeeAttributes>;
  Homework: Sequelize.Model<HomeworkInstance, HomeworkAttributes>;
  List: Sequelize.Model<ListInstance, ListAttributes>;
  ListItem: Sequelize.Model<ListItemInstance, ListItemAttributes>;
  PlaidAccount: Sequelize.Model<PlaidAccountInstance, PlaidAccountAttributes>;
  Product: Sequelize.Model<ProductInstance, ProductAttributes>;
  Question: Sequelize.Model<QuestionInstance, QuestionAttributes>;
  Service: Sequelize.Model<ServiceInstance, ServiceAttributes>;
  Setting: Sequelize.Model<SettingInstance, SettingAttributes>;
  User: UserModel;
}