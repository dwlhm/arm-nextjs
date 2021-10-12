module.exports = {
  "development": {
    "username": "postgres",
    "password": "katasandi",
    "database": "arm_db_dev",
    "dialect" : "postgres",
    "options" : {
                  logging: (...msg) => console.log(msg)
                }
  },
  "test": {
    "username": "postgres",
    "password": "katasandi",
    "database": "arm_db",
    "dialect" : "postgres"
  },
  "production": {
    "username": "postgres",
    "password": "katasandi",
    "database": "arm_db",
    "dialect" : "postgres",
    "options" : {
                  logging: (...msg) => console.log(msg)
                }
  }
}