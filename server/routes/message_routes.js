import express from 'express'
import { sendMessage, deleteMessage } from '../controllers/message_controller.js'
import { userIsAuthenticated } from '../middleware/user_middleware.js'
import { checkIfChatExists, userCanDeleteMessage } from '../middleware/message_middleware.js'
const router = express.Router()
router.use(userIsAuthenticated, checkIfChatExists)
router.post('/', sendMessage)
router.delete('./:messageId', userCanDeleteMessage, deleteMessage)
export default router
