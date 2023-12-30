import express from 'express'
import { sendMessage } from '../controllers/message_controller.js'
const router = express.Router()
router.post('/', sendMessage)

export default router
