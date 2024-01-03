import jwt from 'jsonwebtoken'

export const userIsAuthenticated = (req, res, next) => {
  const token = req.cookies.token
  console.log(token)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.json({ message: err })
    req.user = user
    next()
  })
}

export const isCorrectUser = (req, res, next) => {
  // Check if req.user and req.params are defined
  if (!req.user || !req.params) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }

  const userId = req.user.userId
  const { id } = req.params

  // Type check to ensure strict equality
  if (id !== userId) {
    return res.status(403).json({ error: 'Unauthorized: You do not have permission to perform this action.' })
  }

  // If the user is correct, proceed to the next middleware
  next()
}
