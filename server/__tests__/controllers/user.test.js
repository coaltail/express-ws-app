import { authRegisterController } from '../../controllers/auth_controller.js'
import User from '../../schema/user_schema.js'

import { jest, it, describe, expect } from '@jest/globals'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
jest.mock('../../schema/user_schema.js', () => jest.fn())

const request = {
  body: {
    name: 'test',
    email: 'coaltail222@gmail.com',
    password: 'password',
    username: 'luka123'
  }
}

const response = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
}

describe('Testing auth register controller...', () => {
  it('should create a new user and return a token', async () => {
    // Mock the User.findOne method to return null, indicating that the user does not exist
    User.findOne = jest.fn().mockResolvedValueOnce(null)
    const mockUser = {
      _id: '123456789',
      name: 'test',
      email: 'coaltail222@gmail.com',
      password: 'password',
      username: 'luka123',
      createdAt: '2021-08-08',
      updatedAt: '2021-08-08'
    }

    // Mock the bcrypt.hash method to return a hashed password
    bcrypt.hash = jest.fn().mockResolvedValueOnce('hashedPassword')

    // Mock the User.save method to return the newly created user

    User.prototype.save = jest.fn().mockResolvedValueOnce({
      mockUser
    })

    // Mock the jsonwebtoken.sign method to return a token
    jsonwebtoken.sign = jest.fn().mockReturnValueOnce('token')

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
