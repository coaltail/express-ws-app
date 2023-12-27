import express from 'express'
import bcrypt from 'bcrypt'
import User from '../schema/user_schema.js'
import { validationResult } from 'express-validator'
import jsonwebtoken from 'jsonwebtoken'
import { validateRegistration, validateLogin } from '../validation/auth_validation.js'
const router = express.Router()

// Create a new user
router.post('/register', validateRegistration, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { password, ...rest } = req.body
    console.log(rest)

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user with the hashed password
    const newUser = new User({
      ...rest,
      password: hashedPassword
    })

    // Save the user to the database
    await newUser.save()

    // Generate a token for the user
    const token = jsonwebtoken.sign({ userId: newUser._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' })

    res.status(201).json({ message: 'User registered successfully', user: newUser, token })
  } catch (error) {
    res.status(500).json(error)
  }
})

// Login user
router.post('/login', validateLogin, async (req, res) => {
  const errs = validationResult(req)
  if (!errs.isEmpty()) {
    return res.status(400).json({ errors: errs.array() })
  }
  try {
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

    res.status(200).json({ message: 'Login successful', user, token })
  } catch (error) {
    res.status(500).json(error)
  }
})

// Update user
export default router
