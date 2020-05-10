const config = require('./../knexfile.js');
const knex = require('knex')(config.development)

const bookshelf = require('bookshelf')(knex)

const Email = bookshelf.model('Email', {
  tableName: 'emails'
});

module.exports = Email;