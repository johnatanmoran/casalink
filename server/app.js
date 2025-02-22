// componentes
import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'path';
import process from 'process';

// middlewares
import jsonMiddleware from './src/middlewares/jsonMiddleware.js';

// rutas
import usersRoutes from './src/routes/usersRoutes.js';
import propertiesRoutes from './src/routes/propertiesRoutes.js';
import contractsRoutes from './src/routes/contractsRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

// variables
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(jsonMiddleware);
app.use(express.json());
app.use('/static', express.static(path.join(process.cwd(), 'public'))); // Middleware para servir archivos estáticos

// Rutas
app.use('/api', usersRoutes); // Rutas de usuarios
app.use('/api', propertiesRoutes); // Rutas de propiedades
app.use('/api', contractsRoutes); // Rutas de contratos
app.use('/api', adminRoutes); // Rutas de admin

// Middleware de gestión de errores
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.httpStatus || 500).send({
		status: 'error',
		message: err.message,
	});
});

// Iniciar servidor
app.listen(PORT, () => {
	console.log(
		`Servidor de CasaLink API corriendo en http://localhost:${PORT} 🚀\n`
	);
});

export default app;
