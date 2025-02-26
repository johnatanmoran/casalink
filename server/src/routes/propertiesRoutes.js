import express from 'express';

// Middlewares
import propertyExistsMiddleware from '../middlewares/propertyExistsMiddleware.js';
import authUserMiddleware from '../middlewares/authUserMiddleware.js';
import checkPropertyOwnerOrAdmin from '../middlewares/checkPropertyOwnerOrAdmin.js';
import { fileUploadMiddleware } from '../middlewares/fileUploadMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

// Controladores
import propertyDetailsController from '../controllers/properties/propertyDetailsController.js';
import propertyController from '../controllers/properties/propertyController.js';
import fileUploadController from '../controllers/properties/fileUploadController.js';
import propertyStatusController from '../controllers/properties/propertyStatusController.js';
import getPropertiesController from '../controllers/properties/getPropertiesController.js';
import updatePropertyController from '../controllers/properties/updatePropertyController.js';

// Validadores Joi
import { propertySchema, updatePropertySchema } from '../utils/validators.js';

const router = express.Router();

// 09 Listado de propiedades ✅
router.get('/properties', getPropertiesController);

// 10 Creación de nueva propiedad ✅ (Con validación)
router.post(
	'/properties',
	authUserMiddleware,
	validateRequest(propertySchema),
	propertyController
);

// 11 Detalle de una propiedad ✅
router.get(
	'/properties/:propertyId',
	propertyExistsMiddleware,
	propertyDetailsController
);

// 12 Cambio de estado de propiedad (disponible / no disponible) ✅
router.patch(
	'/properties/:propertyId',
	authUserMiddleware,
	propertyExistsMiddleware,
	checkPropertyOwnerOrAdmin,
	propertyStatusController
);

// 13 Modificar una propiedad (solo dueño o admin) ✅ (Con validación)
router.put(
	'/properties/:propertyId',
	authUserMiddleware,
	propertyExistsMiddleware,
	checkPropertyOwnerOrAdmin,
	validateRequest(updatePropertySchema),
	updatePropertyController
);

// 14 Ruta para subir imágenes y videos asociados a una propiedad ✅
router.post(
	'/upload-files/:propertyId',
	fileUploadMiddleware,
	fileUploadController
);

export default router;
