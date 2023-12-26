import express from 'express'
import bcrypt from 'bcrypt'
import User from '../schema/user_schema.js'
import { validationResult } from 'express-validator'
import validateRegistration from '../validation/auth_validation.js'
const router = express.Router()

// Create a new user
router.post('/register', validateRegistration, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  console.log(req.body)
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

    res.status(201).json({ message: 'User registered successfully', user: newUser })
  } catch (error) {
    res.status(500).json(error)
  }
})

export default router
