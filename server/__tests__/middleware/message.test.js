import { it, jest, describe, expect } from '@jest/globals'
import { checkIfChatExists, userCanDeleteMessage } from '../../middleware/message_middleware.js'
import Message from '../../schema/message_schema.js'
import Chat from '../../schema/chat_schema.js'
jest.mock('../../schema/message_schema.js', () => jest.fn())
describe('Testing middleware for checking if chat exists', () => {
  it('Should return 404 if chat does not exist', async () => {
    const req = {
      params: {
        chatId: '123'
      }
    }
    const res = {
      status: jest.fn(() => res),
      json: jest.fn()
    }
    Chat.findById = jest.fn().mockResolvedValueOnce(null)
    const next = jest.fn()
    await checkIfChatExists(req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Chat not found' })
  })
  it('should call next if chat exists', async () => {
    const req = {
      params: {
        chatId: '123'
      }
    }
    const res = {
      status: jest.fn(() => res),
      json: jest.fn()
    }
    Chat.findById = jest.fn().mockResolvedValueOnce({ chatId: '123' })
    const next = jest.fn()
    await checkIfChatExists(req, res, next)
    expect(next).toHaveBeenCalled()
  }
  )
})

describe('Testing middleware for checking if user can delete message', () => {
  it('should return 404 if the message does not exist', async () => {
    const req = {
      body: {
        messageId: '123'
      },
      user: {
        userId: '123'
      }
    }
    const res = {
      status: jest.fn(() => res),
      json: jest.fn()
    }
    Message.findById = jest.fn().mockResolvedValueOnce(null)
    const next = jest.fn()
    await userCanDeleteMessage(req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Message not found' })
  })
  it('should return 401 if the user is not authorized to delete the message', async () => {
    const req = {
      body: {
        messageId: '123'
      },
      user: {
        userId: '123'
      }
    }
    const res = {
      status: jest.fn(() => res),
      json: jest.fn()
    }
    const mockMessage = Message({
      senderId: '456'
    })
    Message.findById = jest.fn().mockResolvedValueOnce(mockMessage)
    const next = jest.fn()
    await userCanDeleteMessage(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
  })
  it('should call next if the user is authorized to delete the message', async () => {
    const req = {
      body: {
        messageId: '123'
      },
      user: {
        userId: '456'
      }
    }
    const res = {
      status: jest.fn(() => res),
      json: jest.fn()
    }
    const mockMessage = { senderId: '456' }
    const next = jest.fn()
    Message.findById = jest.fn().mockResolvedValueOnce(mockMessage)
    await userCanDeleteMessage(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
