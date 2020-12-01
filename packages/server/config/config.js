require('dotenv').config();
module.exports = {
"development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_TEST || process.env.DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "operatorsAliases": false
},
"test": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_TEST || process.env.DATABASE,
    "host": "127.0.0.1",
    "dialect": "postgres",
    "operatorsAliases": false
},
"production": {
    "username": "postgres",
    "password": null,
    "database": process.env.DATABASE_URL,
    "host": "127.0.0.1",
    "dialect": "postgres",
    "operatorsAliases": false
}
};