'use strict';
import Sequelize from 'sequelize';
import Config from '../../config/config';

const MysqlConfig = Config.database.mysql;

const DBConnection = new Sequelize(MysqlConfig.database, MysqlConfig.username, MysqlConfig.password, {
    operatorsAliases: false,
    host: MysqlConfig.host,
    dialect: MysqlConfig.dialect,
    define: {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
        // don't delete database entries but set the newly added attribute deletedAt
        // to the current date (when deletion was done). paranoid will only work if
        // timestamps are enabled
        paranoid: false,
        // don't use camelcase for automatically added attributes but underscore style
        // so updatedAt will be updated_at
        underscored: true,
        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true
    },
    // disable logging; default: console.log
    logging: false,
    pool: {
        max:    MysqlConfig.poolConfig.max,
        min:    MysqlConfig.poolConfig.min,
        idle:   MysqlConfig.poolConfig.idle
    }
});

module.exports = DBConnection;

