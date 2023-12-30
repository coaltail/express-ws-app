import Message from '../schema/message_schema.js'

export async function sendMessage (req, res) {
  try {
    const { messageSender, messageRecipient, body } = req.body
    const newMessage = new Message({
      messageSender,
      messageRecipient,
      body
    })
    await newMessage.save()
    res.status(200).json({ message: 'Message sent successfully' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export async function deleteMessage (req, res) {
  try {
    const { messageId } = req.body
    await Message.findByIdAndDelete(messageId)
    res.status(200).json({ message: 'Message deleted successfully' })
  } catch (error) {
    res.status(500).json({ error })
  }
}
