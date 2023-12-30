import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  messageSender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  messageRecipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MessageImage'
  }],
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deletedAt: Date,
  status: {
    type: String,
    enum: ['seen', 'sent', 'deleted'],
    default: 'active'
  }
})

const Message = mongoose.model('Message', messageSchema)

export default Message
