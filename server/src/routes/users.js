import express from 'express';
import getUsers from '../controllers/users/getUsers.js';
import validateUser from '../controllers/users/validateUser.js';

const usersRouter = express.Router();

// Endpoint para obtener la lista de usuarios
usersRouter.get('/users', getUsers);
usersRouter.get('/user/validate/:email', validateUser);

export default usersRouter;
