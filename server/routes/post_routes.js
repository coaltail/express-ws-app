import express from 'express'
import { postCreateController, postDeleteController, postUpdateController, postsGetController, singlePostGetController } from '../controllers/post_controller.js'
const router = express.Router()

router.post('/', postsGetController)
router.post('/create', postCreateController)
router.post('/delete/:id', postDeleteController)
router.post('/update/:id', postUpdateController)
router.post('/:id', singlePostGetController)
