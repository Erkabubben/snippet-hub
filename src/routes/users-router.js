/**
 * Users routes.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import express from 'express'
import { CrudSnippetsController } from '../controllers/crud-snippets-controller.js'
import { UsersController } from '../controllers/users-controller.js'

export const router = express.Router()

const controller = new UsersController()

// Map HTTP verbs and route paths to controller actions.

router.get('/new', controller.new)
router.post('/create', controller.create)
router.get('/:id', controller.show)
