'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  Route.get('test', 'NovelController.test')
  Route.get('/', 'NovelController.read')
  Route.get('/:novel_slug/:tl_type/:chapter_slug', 'ChapterController.detail')
}).prefix('novel').middleware(['token'])

Route.group(() => {
  Route.get('/', 'ChapterController.read')
}).prefix('chapter').middleware(['token'])

