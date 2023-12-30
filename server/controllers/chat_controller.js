import Chat from '../models/chat_model'

export async function CreateChat (req, res) {
  const { user1, user2 } = req.body
  const newChat = new Chat({
    user1,
    user2
  })
  await newChat.save()
  res.status(200).json({ message: 'Chat created successfully' })
}

export async function GetChatMessages (req, res) {
  const { chatId } = req.params
  const chat = await Chat.findById(chatId)
  const messages = chat.messages
  res.status(200).json({ messages })
}
