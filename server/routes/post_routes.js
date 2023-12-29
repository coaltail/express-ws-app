import express from 'express'
import { userIsAuthenticated, isCorrectUser } from '../middleware/user_middleware.js'
import { postCreateController, postLikeController, postDeleteController, postUpdateController, postsGetController, singlePostGetController } from '../controllers/post_controller.js'
const router = express.Router()

router.get('/:id', userIsAuthenticated, postsGetController) // View all of the posts that belong to a user
router.post('/create', userIsAuthenticated, postCreateController)
router.delete('/delete/:id', userIsAuthenticated, isCorrectUser, postDeleteController)
router.patch('/update/:id', userIsAuthenticated, isCorrectUser, postUpdateController)
router.get('/:id', userIsAuthenticated, singlePostGetController)
router.patch('/like', userIsAuthenticated, postLikeController)

export default router
