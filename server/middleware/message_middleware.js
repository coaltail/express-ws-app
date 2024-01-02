import Chat from '../schema/chat_schema.js'
import Message from '../schema/message_schema.js'
const checkIfChatExists = async (req, res, next) => {
  const chatId = req.params.chatId
  const chat = await Chat.findById(chatId)
  if (!chat) return res.status(404).json({ message: 'Chat not found' })

  next()
}
const userCanDeleteMessage = async (req, res, next) => {
  const msgId = req.body.messageId
  const userId = req.user.userId

  const message = await Message.findById(msgId)

  if (!message) return res.status(404).json({ message: 'Message not found' })

  if (message.senderId !== userId) return res.status(401).json({ message: 'Unauthorized' })

  next()
}

export { checkIfChatExists, userCanDeleteMessage }
