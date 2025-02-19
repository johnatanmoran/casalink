import express from 'express';
import usersController from '../../controllers/user/usersController.js';
import propertyDetailsController from '../../controllers/owner/propertyDetailsController.js';
import propertyExistsMiddleware from '../../middlewares/propertyExistsMiddleware.js';
const router = express.Router();

// Listado de propiedades
router.get('/properties');
// Creación de nueva propiedad
router.post('/properties');
// Detalle de una propiedad
router.get(
	'/properties/:propertyId',
	propertyExistsMiddleware,
	propertyDetailsController
);
// Cambio de estado de propiedad (disponible / no disponible)
router.patch('/properties/:id');
// Modificar una propiedad (dueño o admin) [EXTRA]
router.put('/properties/:id');

export default router;
