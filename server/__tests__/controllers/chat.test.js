import { it, describe, expect, jest } from '@jest/globals'
import Chat from '../../schema/chat_schema.js'
import Message from '../../schema/message_schema.js'
import { deleteChat, updateChat, getChatMessages, getUserChats, createChat } from '../../controllers/chat_controller'

jest.mock('../../schema/chat_schema.js')
jest.mock('../../schema/message_schema.js')

describe('Testing create chat controller', () => {
  it('should return 400 if there are less than 2 particiapnts', async () => {
    const req = {
      body: {
        participants: ['123']
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await createChat(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Please provide at least 2 users' })
  })
})
