import { it, jest, describe, expect } from '@jest/globals'
import { sendMessage, deleteMessage } from '../../controllers/message_controller.js'
import Message from '../../schema/message_schema.js'

jest.mock('../../schema/message_schema.js')

describe('Testing send message controller', () => {
  it('Should return 500 if an error occurs', async () => {
    const req = {
      body: {
        recipientId: '123456789',
        senderId: '987654321',
        body: 'Hello world',
        chat: '542'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    jest.spyOn(Message.prototype, 'save').mockRejectedValueOnce(new Error('Error'))
    await sendMessage(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: new Error('Error') })
  })
  it('should retrun 200 if message is sent successfully', async () => {
    const req = {
      body: {
        recipientId: '123456789',
        senderId: '987654321',
        body: 'Hello world',
        chat: '542'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    jest.spyOn(Message.prototype, 'save').mockResolvedValueOnce()
    await sendMessage(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Message sent successfully' })
  })
})

describe('Testing message delete controller', () => {
  it('should return 500 if an error occurs', async () => {
    const req = {
      body: {
        messageId: '123456789'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    jest.spyOn(Message, 'findByIdAndDelete').mockRejectedValueOnce(new Error('Error'))
    await deleteMessage(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: new Error('Error') })
  })
  it('should return 200 if message is deleted successfully', async () => {
    const req = {
      body: {
        messageId: '123456789'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    jest.spyOn(Message, 'findByIdAndDelete').mockResolvedValueOnce()
    await deleteMessage(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Message deleted successfully' })
  })
})
