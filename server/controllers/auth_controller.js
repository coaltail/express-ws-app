import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import User from '../schema/user_schema.js'
import jsonwebtoken from 'jsonwebtoken'
import { setTokenCookie, generateToken } from '../utils/auth_utils.js'

export async function authRegisterController (req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { posts, followers, following, createdAt, updatedAt, deletedAt, password, email, ...rest } = req.body

    // Check if the email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user with the hashed password
    const newUser = new User({
      ...rest,
      password: hashedPassword,
      email

    })

    // Save the user to the database
    await newUser.save()

    const token = generateToken(newUser)

    setTokenCookie(res, token)
    res.status(201).json({
      message: 'User registered successfully'
    })
  } catch (error) {
    res.status(500).json({
      Error: error
    })
  }
}

export async function authLoginController (req, res) {
  try {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() })
    }

    const { email, password } = req.body

    // Find the user in the database
    const user = await User.findOne({ email })

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' })
    }

    // Compare the hashed password with the password sent in the request
    const passwordMatch = await bcrypt.compare(password, user.password)

    // If passwords don't match, return error
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    // Passwords match, generate a token for the user
    const token = generateToken(user)

    setTokenCookie(res, token)

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username
      }
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

export async function authUserUpdateController (req, res) {
  try {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() })
    }

    const { ...data } = req.body
    const { id } = req.params

    // Update the user based on the id
    const updatedUser = await User.findByIdAndUpdate(id, { ...data }, { new: true })

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username
      }
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

export async function authUserDeleteController (req, res) {
  try {
    const { id } = req.params

    await User.findByIdAndDelete(id)

    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json(error)
  }
}

export async function authUserGetController (req, res) {
  try {
    const { id } = req.params

    // Get the user based on the id
    const user = await User.findById(id)

    res.status(200).json({ message: 'User retrieved successfully', user })
  } catch (error) {
    res.status(500).json(error)
  }
}

export async function authUserChangePasswordController (req, res) {
  try {
    const { email, password, newPassword } = req.body
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await user.updateOne({ password: hashedNewPassword })

    return res.status(200).json({ message: 'Password changed successfully' })
  } catch (error) {
    res.status(500).json({
      Error: error
    })
  }
}

export const tokenRefreshController = (req, res) => {
  console.log('Token refresh')
  res.cookie('test', 'test')
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ message: 'Authentication invalid' })
  }
  console.log(token)
  try {
    const { payload } = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
    const authToken = generateToken(payload)
    setTokenCookie(res, authToken)
    return res.status(200).json({ message: 'Token refreshed' })
  } catch (error) {
    return res.status(401).json({ message: 'Authentication invalid' })
  }
}

export const getToken = (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ message: 'Authentication invalid' })
  }
  try {
    jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
    return res.status(200).json({ token })
  } catch (error) {
    return res.status(401).json({ message: 'Authentication invalid' })
  }
}

export const logoutController = async (req, res) => {
  if (!req.cookies.token) {
    return res.status(401).json({ message: 'Authentication invalid' })
  }
  res.clearCookie('token')
  res.status(200).json({ message: 'Logout successful' })
}
