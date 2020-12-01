import { QueryInterface } from 'sequelize';

/**
 * function that sequelize-cli runs if you want to add this migration to your database
 * */
export async function up(sequelize) {
  // language=PostgreSQL
  sequelize.query(`
      CREATE TYPE preferredSocialAuthType AS ENUM ('FACEBOOK', 'GMAIL', 'GOOGLE', 'GITHUB', 'TWITTER', 'LINKEDIN');
      CREATE TYPE genderType AS ENUM ('FEMALE', 'MALE', 'OTHER');
      CREATE TABLE "Users" (
          "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
          "firstName" VARCHAR(30),
          "lastName" VARCHAR(30),
          "displayName" VARCHAR(30),
          "currentCity" VARCHAR(30) NOT NULL,
          "hasSocialAuthLogin" BOOLEAN,
          "socialAuthId" VARCHAR(30),
          "preferredSocialAuth" preferredSocialAuthType,
          "email" VARCHAR(30) NOT NULL,
          "salt" VARCHAR(255),
          "password" VARCHAR(55),
          "dob" DATE,
          "gender" genderType,
          "cellphone" VARCHAR(30),
          "createdAt" TIMESTAMP NOT NULL,
          "updatedAt" TIMESTAMP NOT NULL
      );
  `);
  // tslint:disable-next-line: no-console
  console.log('*Table profiles created!*');
}

/**
 * function that sequelize-cli runs if you want to remove this migration from your database
 * */
export async function down(query: QueryInterface) {
  try {
    return query.dropTable('Users');
  } catch (e) {
    return Promise.reject(e);
  }
}