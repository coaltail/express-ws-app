import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deletedAt: Date,
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active'
  },
  type: {
    type: String,
    enum: ['private', 'group'],
    default: 'private',
    required: true
  }
})

const Chat = mongoose.model('Chat', chatSchema)

export default Chat
