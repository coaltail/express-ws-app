import express from 'express'
import { userIsAuthenticated } from '../middleware/user_middleware.js'
import { postCreateController, postLikeController, postDeleteController, postUpdateController, postsGetController, singlePostGetController } from '../controllers/post_controller.js'
import userIsAuthorized from '../middleware/auth_middleware.js'
const router = express.Router()
const userIsAuthorizedForPost = userIsAuthorized('Post', req => req.params.id)
router.use(userIsAuthenticated)
router.get('/:id', singlePostGetController)
router.get('/:id', postsGetController) // View all of the posts that belong to a user
router.post('/create', postCreateController)
router.delete('/delete/:id', userIsAuthorizedForPost, postDeleteController)
router.patch('/update/:id', userIsAuthorizedForPost, postUpdateController)
router.patch('/:id/like', postLikeController)

export default router
