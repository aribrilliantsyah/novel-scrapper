'use strict'

const Response = require('@adonisjs/framework/src/Response')
const Env = use('Env')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class TokenAccess {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ session, request, response }, next) {
    if(request.headers() && request.headers().authorization != undefined && request.headers().authorization != ''){
      let authorization = request.headers().authorization
      let token_array = authorization.split(" ");
      
      if(token_array[0] != undefined && token_array[0] != "Bearer"){
        return response.status(422).json({
          'rc': 422,
          'rm': 'This is not a Bearer Token'
        })
      }

      // console.log(token_array[1])
      if(token_array[1] != undefined){
        console.log(token_array[1])
        let token_key = Env.get('TOKEN_KEY', 'uhArigantengBangetuWow')
        if(token_key != '' ){
          if(token_array[1] == token_key){
            await session.put('username', '')
            await next()
          } else {
            return response.status(404).json({
              'rc': 404,
              'rm': 'Token is not match'
            })
          }
        }else{
          return response.status(404).json({
            'rc': 404,
            'rm': 'Token isn`t already set'
          })
        }
      }else{
        return response.status(404).json({
          'rc': 404,
          'rm': 'Token is null'
        })
      }
    }else{
      return response.status(422).json({
        'rc': 422,
        'rm': 'Authorization is required header'
      })
    }

  }
}

module.exports = TokenAccess
