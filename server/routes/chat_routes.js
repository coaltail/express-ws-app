import express from 'express'
import { createChat, getChatMessages, updateChat, deleteChat } from '../controllers/chat_controller.js'
import { userIsAuthenticated } from '../middleware/user_middleware.js'
const router = express.Router()

router.use(userIsAuthenticated)
router.post('/', createChat)
router.get('/:chatId/messages', getChatMessages)
router.put('/:chatId', updateChat)
router.delete('/:chatId', deleteChat)
export default router
