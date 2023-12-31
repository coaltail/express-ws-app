import express from 'express'
import { userIsAuthenticated, isCorrectUser } from '../middleware/user_middleware.js'
import { postCreateController, postLikeController, postDeleteController, postUpdateController, postsGetController, singlePostGetController } from '../controllers/post_controller.js'
const router = express.Router()

router.use(userIsAuthenticated)
router.get('/:id', postsGetController) // View all of the posts that belong to a user
router.post('/create', postCreateController)
router.delete('/delete/:id', isCorrectUser, postDeleteController)
router.patch('/update/:id', isCorrectUser, postUpdateController)
router.get('/:id', singlePostGetController)
router.patch('/like', postLikeController)

export default router
