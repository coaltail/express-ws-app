export const userIsAuthorized = (Model, getIdFromRequest) => async (req, res, next) => {
  try {
    const id = getIdFromRequest(req)
    const resource = await Model.findById(id)
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' })
    }
    if (resource.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'User not authorized' })
    }
    req.model = resource
    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export default userIsAuthorized
