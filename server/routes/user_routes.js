import express from 'express'
import { authRegisterController, logoutController, getToken, authLoginController, authUserUpdateController, authUserGetController, authUserDeleteController, tokenRefreshController } from '../controllers/auth_controller.js'
import { validateRegistration, validateLogin } from '../validation/auth_validation.js'
import { userIsAuthenticated, isCorrectUser } from '../middleware/user_middleware.js'
const router = express.Router()

router.get('/token', getToken)

router.post('/register', validateRegistration, authRegisterController)

router.post('/login', validateLogin, authLoginController)

router.post('/logout', logoutController)

router.put('/update/:id', userIsAuthenticated, isCorrectUser, authUserUpdateController)

router.get('/:id', userIsAuthenticated, isCorrectUser, authUserGetController)

router.delete('/delete/:id', userIsAuthenticated, isCorrectUser, authUserDeleteController)

router.patch('/password', userIsAuthenticated, isCorrectUser, authUserUpdateController)

router.post('/refresh', userIsAuthenticated, tokenRefreshController)

export default router
