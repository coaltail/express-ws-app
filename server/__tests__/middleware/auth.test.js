import jwt from 'jsonwebtoken'
import { it, describe, expect, jest } from '@jest/globals'
import { userIsAuthenticated, isCorrectUser } from '../../middleware/user_middleware'

describe('Testing authentication middleware', () => {
  describe('Testing userIsAuthenticated middleware', () => {
    it('should return 401 status code if no token is provided', () => {
      const req = {
        headers: {
          authorization: null
        }
      }
      const res = {
        sendStatus: jest.fn()
      }
      const next = jest.fn()

      userIsAuthenticated(req, res, next)

      expect(res.sendStatus).toHaveBeenCalledWith(401)
      expect(next).not.toHaveBeenCalled()
    })

    it('should verify the token and call next if token is provided', () => {
      const token = 'valid_token'
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      const res = {
        json: jest.fn()
      }
      const next = jest.fn()

      jwt.verify = jest.fn((token, secret, callback) => {
        callback(null, { userId: '123456789' })
      })

      userIsAuthenticated(req, res, next)

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.TOKEN_SECRET, expect.any(Function))
      expect(req.user).toEqual({ userId: '123456789' })
      expect(next).toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })

    it('should return an error message if token verification fails', () => {
      const token = 'invalid_token'
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      const res = {
        json: jest.fn()
      }
      const next = jest.fn()

      jwt.verify = jest.fn((token, secret, callback) => {
        callback(new Error('Invalid token'))
      })

      userIsAuthenticated(req, res, next)

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.TOKEN_SECRET, expect.any(Function))
      expect(req.user).toBeUndefined()
      expect(next).not.toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({ message: Error('Invalid token') })
    })
  })
  describe('Testing isCorrectUser middleware', () => {
    it('should return 500 if req.user or req.params is undefined', () => {
      const req = {
        user: undefined,
        params: undefined
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const next = jest.fn()

      isCorrectUser(req, res, next)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
      expect(next).not.toHaveBeenCalled()
    })
    it('should return 403 if the user is not the correct user', () => {
      const req = {
        user: {
          userId: '123456789'
        },
        params: {
          id: '987654321'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const next = jest.fn()

      isCorrectUser(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: You do not have permission to perform this action.' })
      expect(next).not.toHaveBeenCalled()
    })
    it('should call next if the user is the correct user', () => {
      const req = {
        user: {
          userId: '123456789'
        },
        params: {
          id: '123456789'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const next = jest.fn()

      isCorrectUser(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })
})
