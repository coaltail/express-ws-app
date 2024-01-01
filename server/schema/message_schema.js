import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MessageImage'
  }],
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
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
