import express from 'express'
import { createChat, getChatMessages, updateChat, deleteChat } from '../controllers/chat_controller'
import { userIsAuthenticated } from '../middleware/user_middleware.js'
const router = express.Router()

router.use(userIsAuthenticated)

export default router
