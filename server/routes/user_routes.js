import express from 'express'
import { authRegisterController, authLoginController, authUserUpdateController, authUserGetController, authUserDeleteController } from '../controllers/auth_controller.js'
import { validateRegistration, validateLogin } from '../validation/auth_validation.js'
import { userIsAuthenticated, isCorrectUser } from '../middleware/user_middleware.js'
const router = express.Router()

router.post('/register', validateRegistration, authRegisterController)

router.post('/login', validateLogin, authLoginController)

router.put('/update/:id', userIsAuthenticated, isCorrectUser, authUserUpdateController)

router.get('/:id', userIsAuthenticated, isCorrectUser, authUserGetController)

router.delete('/delete/:id', userIsAuthenticated, isCorrectUser, authUserDeleteController)

router.patch('/password', userIsAuthenticated, isCorrectUser, authUserUpdateController)
export default router
