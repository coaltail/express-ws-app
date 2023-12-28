import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import User from '../schema/user_schema.js'
import jsonwebtoken from 'jsonwebtoken'

export async function authRegisterController (req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, ...rest } = req.body

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
      email,
      password: hashedPassword
    })

    // Save the user to the database
    await newUser.save()

    // Generate a token for the user
    const token = jsonwebtoken.sign(
      { userId: newUser._id },
      process.env.TOKEN_SECRET,
      { expiresIn: '1h' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token
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
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Compare the hashed password with the password sent in the request
    const passwordMatch = await bcrypt.compare(password, user.password)

    // If passwords don't match, return error
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Passwords match, generate a token for the user
    const token = jsonwebtoken.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '2h' })

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username
      },
      token
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

    // Check if the user can update
    if (req.user.userId !== id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    // Update the user based on the id
    const updatedUser = await User.findByIdAndUpdate(id, { ...data }, { new: true })

    res.status(200).json({ message: 'User updated successfully', user: updatedUser })
  } catch (error) {
    res.status(500).json(error)
  }
}

export async function authUserDeleteController (req, res) {
  try {
    const { id } = req.params

    // Check if the user can delete
    if (req.user.userId !== id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    // Delete the user based on the id
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
  } catch (error) {
    res.status(500).json({
      Error: error
    })
  }
}
