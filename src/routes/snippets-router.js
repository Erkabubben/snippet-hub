/**
 * Routes to a user's Snippets collection (RESTful).
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @author Mats Loock
 * @version 1.0.0
 */

import express from 'express'
import { SnippetsController } from '../controllers/snippets-controller.js'
import { Authorize } from './authorize.js'

/* The mergeParams: true option adds the route's specific userid to req.params */
export const router = express.Router({ mergeParams: true })

const controller = new SnippetsController()
const authorize = new Authorize() // The Authorize class is used for access control.

// Map HTTP verbs and route paths to controller actions.
router.get('/new', authorize.specificUser, controller.new)
router.post('/create', authorize.specificUser, controller.create)
router.get('/:snippetid/remove', authorize.specificUser, controller.remove)
router.post('/:snippetid/delete', authorize.specificUser, controller.delete)
router.get('/:snippetid/edit', authorize.specificUser, controller.edit)
router.post('/:snippetid/update', authorize.specificUser, controller.update)
router.get('/:snippetid', controller.show)
