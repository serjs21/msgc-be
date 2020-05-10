const config = require('./config.json');

module.exports = {
  development: {
    client: 'pg',
    connection: config,
    migrations: {
      directory: __dirname + '/migrations'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/migrations'
    }
  }
};