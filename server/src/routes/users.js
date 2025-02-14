import express from 'express';
import UsersController from '../controllers/users.js';

const usersRouter = express.Router();

// Endpoint para obtener la lista de usuarios
usersRouter.get('/users', UsersController.getUsers);

// Endpoint para la validación de usuario
usersRouter.get('/user/validate/:email', UsersController.validateUser);

export default usersRouter;
