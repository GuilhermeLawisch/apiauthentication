import { Router } from 'express'
import { ProjectController } from './app/controllers/projectController';
import { UserController } from "./app/controllers/UserController";
import { AuthMiddleware } from "./app/middlewares/auth";

const router = Router()

const authMiddleware = new AuthMiddleware()
const userController = new UserController()
const projectController = new ProjectController()

// utilizando em todas as rotas
// router.use(authMiddleware.verification)

// utilizando apenas em uma rota
router.get('/', authMiddleware.verification, projectController.index)

// Auththenticate
router.post('/register', userController.register)
router.post('/authenticate', userController.authenticate)
router.post('/forgot_password', userController.forgot_password)
router.post('/reset_password', userController.reset_password)

// Projects
router.get('/projects', authMiddleware.verification, projectController.list)
router.get('/projects/:id', authMiddleware.verification, projectController.show)
router.post('/projects', authMiddleware.verification, projectController.create)
router.put('/projects/:id', authMiddleware.verification, projectController.update)
router.delete('/projects/:id', authMiddleware.verification, projectController.delete)

export { router }
