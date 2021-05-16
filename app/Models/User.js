'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

const Database = use('Database')
const bcrypt = require('bcrypt');

class User extends Model {

}

module.exports = User
