import Chat from '../schema/chat_schema.js'

export async function createChat (req, res) {
  try {
    const { participants, type } = req.body
    if (participants.length < 2) return res.status(400).json({ message: 'Please provide at least 2 users' })
    const existingChat = await Chat.findOne({ participants, type })
    if (existingChat) return res.status(400).json({ message: 'Chat already exists' })
    const newChat = new Chat({
      participants,
      type
    })
    await newChat.save()
    res.status(200).json({ message: 'Chat created successfully' })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export async function getChatMessages (req, res) {
  try {
    const { chatId } = req.params
    const chat = await Chat.findById(chatId)
    if (!chat) return res.status(404).json({ message: 'Chat not found' })
    const messages = chat.messages
    res.status(200).json({ messages })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export async function updateChat (req, res) {
  try {
    const { chatId } = req.params
    const { participants, type } = req.body
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { participants, type }, { new: true })
    res.status(200).json({ message: 'Chat updated successfully', chat: updatedChat })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export async function deleteChat (req, res) {
  try {
    const { chatId } = req.params
    await Chat.findByIdAndDelete(chatId)
    res.status(200).json({ message: 'Chat deleted successfully' })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.userId
    console.log(userId)
    const chats = await Chat.find({ participants: userId }).populate('participants', '_id name username email').select('-messages') // select everything except messages
    if (chats.length === 0) return res.status(404).json({ message: 'No chats found' })
    return res.status(200).json({ chats })
  } catch (err) {
    return res.status(500).json({ err })
  }
}
