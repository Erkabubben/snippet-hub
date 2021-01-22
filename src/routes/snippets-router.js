/**
 * Pure numbers routes.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import express from 'express'
import { SnippetsController } from '../controllers/snippets-controller.js'

export const router = express.Router()

const controller = new SnippetsController()

// Map HTTP verbs and route paths to controller actions.
router.get('/new', controller.new)
router.post('/create', controller.create)

