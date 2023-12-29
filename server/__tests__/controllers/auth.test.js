import { authRegisterController, authLoginController, authUserUpdateController, authUserGetController, authUserDeleteController } from '../../controllers/auth_controller.js'
import User from '../../schema/user_schema.js'
import { jest, it, describe, expect } from '@jest/globals'
import jwt from 'jsonwebtoken'
import { userIsAuthenticated, isCorrectUser } from '../../middleware/user_middleware.js'
import bcrypt from 'bcrypt'
jest.mock('../../schema/user_schema.js', () => jest.fn())

const request = {
  body: {
    name: 'test',
    email: 'coaltail222@gmail.com',
    password: 'password',
    username: 'luka123'
  },
  params:
  {
    id: '123456789'
  }
}
const mockUser = {
  _id: '123456789',
  name: 'test',
  email: 'coaltail222@gmail.com',
  password: 'password',
  username: 'luka123',
  createdAt: '2021-08-08',
  updatedAt: '2021-08-08'
}
const response = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
}

describe('Testing auth register controller...', () => {
  it('should create a new user and return a token if user does not exist.', async () => {
    // Mock the User.findOne method to return null, indicating that the user does not exist
    User.findOne = jest.fn().mockResolvedValueOnce(null)

    // Mock the bcrypt.hash method to return a hashed password
    bcrypt.hash = jest.fn().mockResolvedValueOnce('hashedPassword')

    // Mock the User.save method to return the newly created user

    User.prototype.save = jest.fn().mockResolvedValueOnce({
      mockUser
    })

    // Mock the jwt.sign method to return a token
    jwt.sign = jest.fn().mockReturnValueOnce('token')

    // Call the authRegisterController function
    await authRegisterController(request, response)

    // Verify that the response status is 201
    expect(response.status).toHaveBeenCalledWith(201)

    // Verify that the response json method is called with the expected data
    expect(response.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
      token: 'token'
    })
  })

  it('should return an error if the user already exists', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      _id: '123456789',
      name: 'test',
      email: 'coaltail222@gmail.com'
    })
    await authRegisterController(request, response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'User already exists'
    })
  })
  it('should return an error if there is an issue with the database', async () => {
    // Mock an error by rejecting the Promise in User.findOne
    User.findOne = jest.fn().mockRejectedValueOnce(new Error('Database error'))

    await authRegisterController(request, response)

    // Verify that the response status is 500
    expect(response.status).toHaveBeenCalledWith(500)

    // Verify that the response json method is called with the expected error message
    expect(response.json).toHaveBeenCalledWith({
      Error: Error('Database error')
    })
  })
})

describe('Testing login controller', () => {
  it('Should return 400 when there is a password mismatch', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser)
    bcrypt.compare = jest.fn().mockResolvedValueOnce(false) // Simulate password mismatch
    await authLoginController(request, response)

    expect(User.findOne).toHaveBeenCalledWith({ email: request.body.email })
    expect(bcrypt.compare).toHaveBeenCalledWith(request.body.password, mockUser.password)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Invalid email or password'
    })
  })

  it('should return 400 when the user does not exist', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(null)
    await authLoginController(request, response)

    expect(User.findOne).toHaveBeenCalledWith({ email: request.body.email })
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'User does not exist'
    })
  })

  it('should return 200 when the user is logged in', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(mockUser)
    bcrypt.compare = jest.fn().mockResolvedValueOnce(true)
    jwt.sign = jest.fn().mockReturnValueOnce('token')
    await authLoginController(request, response)

    expect(User.findOne).toHaveBeenCalledWith({ email: request.body.email })
    expect(bcrypt.compare).toHaveBeenCalledWith(request.body.password, mockUser.password)
    expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser._id }, process.env.TOKEN_SECRET, { expiresIn: '2h' })
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Login successful',
      user: {
        id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        username: mockUser.username
      },
      token: 'token'
    })
  })

  it('should return 500 for caught errors', async () => {
    // Mock an error
    const mockError = new Error('Some error')
    User.findOne = jest.fn().mockRejectedValueOnce(mockError)

    await authLoginController(request, response)

    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith(mockError)
  })
})

describe('Testing user update controller', () => {
  it('should return 200 when user is updated', async () => {
    const updatedUser =
    {
      _id: '123456789',
      name: 'New Name',
      email: 'coaltail222@gmail.com',
      password: 'newPassword',
      username: 'New Username',
      createdAt: '2021-08-08',
      updatedAt: '2021-08-08'
    }
    User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser)
    await authUserUpdateController(request, response)
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(request.params.id, request.body, { new: true })
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username
      }
    })
  })
  it('Should return 500 if there is an error', async () => {
    const mockError = new Error('Some error')
    User.findByIdAndUpdate = jest.fn().mockRejectedValueOnce(mockError)
    await authUserUpdateController(request, response)
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith(mockError)
  })
})
describe('Testing user get controller', () => {
  it('should return 200 with the user data when user is found', async () => {
    const mockUser = {
      _id: '123456789',
      name: 'test',
      email: 'coaltail222@gmail.com',
      password: 'password',
      username: 'luka123',
      createdAt: '2021-08-08',
      updatedAt: '2021-08-08'
    }
    User.findById = jest.fn().mockResolvedValueOnce(mockUser)
    const req = {
      params: {
        id: '123456789'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await authUserGetController(req, res)
    expect(User.findById).toHaveBeenCalledWith(req.params.id)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User retrieved successfully',
      user: mockUser
    })
  })

  it('should return 500 with the error message when there is an error', async () => {
    const mockError = new Error('Some error')
    User.findById = jest.fn().mockRejectedValueOnce(mockError)
    const req = {
      params: {
        id: '123456789'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await authUserGetController(req, res)
    expect(User.findById).toHaveBeenCalledWith(req.params.id)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(mockError)
  })
})

describe('Testing user delete controller', () => {
  it('should return 200 with "User deleted successfully" message when user is authorized and deletion is successful', async () => {
    const req = {
      params: {
        id: '123456789'
      },
      user: {
        userId: '123456789' // Same user ID
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    User.findByIdAndDelete = jest.fn().mockResolvedValueOnce()
    await authUserDeleteController(req, res)
    expect(User.findByIdAndDelete).toHaveBeenCalledWith(req.params.id)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' })
  })

  it('should return 500 with the error message when there is an error during deletion', async () => {
    const mockError = new Error('Some error')
    User.findByIdAndDelete = jest.fn().mockRejectedValueOnce(mockError)
    await authUserDeleteController(request, response)
    expect(User.findByIdAndDelete).toHaveBeenCalledWith(request.params.id)
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith(mockError)
  })
})
describe('Testing password change controller', () => { })
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
