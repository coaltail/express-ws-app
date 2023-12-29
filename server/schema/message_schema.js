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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deletedAt: Date

})

const Message = mongoose.model('Message', messageSchema)

export default Message
