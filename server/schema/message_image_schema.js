import mongoose from 'mongoose'

const messageImageSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  filePath: {
    type: String,
    required: true
  }
})

const MessageImage = mongoose.model('MessageImage', messageImageSchema)

export default MessageImage
