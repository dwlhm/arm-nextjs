const { Sequelize } = require('sequelize')

let config = require('../config/sequelize.config')

let sequelize
require('dotenv').config()
console.log(config[process.env.NODE_ENV])
config = config[process.env.NODE_ENV] 

try {

	sequelize = new Sequelize(config.database, config.username, config.password,{
		dialect: config.dialect,
		storage: config.storage,
		dialectOptions: config.options
	})

} catch(err) {

	console.log("1"+err)

}

try {
	
	sequelize.authenticate();
  	console.log('Connection has been established successfully.');
} catch(err) {
	console.log(err)
}