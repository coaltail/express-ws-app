import Chat from '../models/chat_model'

export async function createChat (req, res) {
  const { user1, user2, type } = req.body
  const existingChat = await Chat.findOne({ participants: [user1, user2], type })
  if (existingChat) return res.status(400).json({ message: 'Chat already exists' })
  const newChat = new Chat({
    participants: [user1, user2],
    type
  })
  await newChat.save()
  res.status(200).json({ message: 'Chat created successfully' })
}

export async function getChatMessages (req, res) {
  const { chatId } = req.params
  const chat = await Chat.findById(chatId)
  if (!chat) return res.status(404).json({ message: 'Chat not found' })
  const messages = chat.messages
  res.status(200).json({ messages })
}

export async function updateChat (req, res) {
  const { chatId } = req.params
  const { participants, type } = req.body
  const updatedChat = await Chat.findByIdAndUpdate(chatId, { participants, type }, { new: true })
  res.status(200).json({ message: 'Chat updated successfully', chat: updatedChat })
}

export async function deleteChat (req, res) {
  const { chatId } = req.params
  await Chat.findByIdAndDelete(chatId)
  res.status(200).json({ message: 'Chat deleted successfully' })
}
