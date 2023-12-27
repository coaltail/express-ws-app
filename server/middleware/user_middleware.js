export const checkUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Get the user ID from the request parameters or body
  const userId = req.params.userId || req.body.userId

  // Compare the logged-in user ID with the requested user ID
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  next()
}
