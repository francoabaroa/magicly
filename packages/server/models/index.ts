import Sequelize from 'sequelize';
import { DbInterface } from '../typings/DbInterface';
import { AnswerFactory } from './Answer';
import { AttachmentFactory } from './Attachment';
import { DocumentFactory } from './Document';
import { EmployeeFactory } from './Employee';
import { HomeworkFactory } from './Homework';
import { ListFactory } from './List';
import { ListItemFactory } from './ListItem';
import { PlaidAccountFactory } from './PlaidAccount';
import { ProductFactory } from './Product';
import { QuestionFactory } from './Question';
import { ServiceFactory } from './Service';
import { SettingFactory } from './Setting';
import { UserFactory } from './User';

export const createModels = (sequelizeConfig: any, isProduction: boolean): DbInterface => {
  const { database, username, password, params } = sequelizeConfig;
  let sequelize = new Sequelize(database, username, password, params);
  if (isProduction) {
    sequelize = new Sequelize(database, params);
  }

  const db: DbInterface = {
    sequelize,
    Sequelize,
    Answer: AnswerFactory(sequelize, Sequelize),
    Attachment: AttachmentFactory(sequelize, Sequelize),
    Document: DocumentFactory(sequelize, Sequelize),
    Employee: EmployeeFactory(sequelize, Sequelize),
    Homework: HomeworkFactory(sequelize, Sequelize),
    List: ListFactory(sequelize, Sequelize),
    ListItem: ListItemFactory(sequelize, Sequelize),
    PlaidAccount: PlaidAccountFactory(sequelize, Sequelize),
    Product: ProductFactory(sequelize, Sequelize),
    Question: QuestionFactory(sequelize, Sequelize),
    Service: ServiceFactory(sequelize, Sequelize),
    Setting: SettingFactory(sequelize, Sequelize),
    User: UserFactory(sequelize, Sequelize)
  };

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};