const Sequelize = require("sequelize");
const config = require("./config")();

const sequelize = new Sequelize(config.DATABASE_DB, config.DATABASE_USER, config.DATABASE_PASSWORD, {
    host: config.DATABASE_HOST,
    native: true,
    ssl: true,
    dialect: 'postgres'
});

// Models
const Favorites = sequelize.define('favorites', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false,
        index: true
    },
    city_id: {
        type: Sequelize.INTEGER
    },
}, {
    freezeTableName: true,
    timestamps: false
});

sequelize.sync();
console.log("All models were synchronized successfully.");

module.exports = Favorites
