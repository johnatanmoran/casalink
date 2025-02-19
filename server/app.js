import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import getPool from './src/db/getPool.js';
import jsonMiddleware from './src/middlewares/jsonMiddleware.js';
import usersRoutes from './src/routes/user/usersRoutes.js';
import requestsRoutes from './src/routes/owner/requestsRoutes.js';
import path from 'path';
import process from 'process';
import requestVisitRoutes from './src/routes/user/requestVisitRoutes.js';
import reviewsRoutes from './src/routes/reviews/reviewsRoutes.js';
import fileUploadRoute from './src/routes/owner/fileUploadRoute.js';
import propertiesRoutes from './src/routes/properties/propertiesRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(jsonMiddleware);
app.use(express.json());

// Middleware para servir archivos estáticos
app.use('/static', express.static(path.join(process.cwd(), 'public')));

// Rutas
app.use('/api', usersRoutes); // Rutas de usuarios
app.use('/api', requestsRoutes); // Rutas de solicitudes
app.use('/api/solicitudes', requestVisitRoutes); // Ruta para solicitar visita
app.use('/api/reviews', reviewsRoutes); // Rutas de valoraciones
app.use('/api', fileUploadRoute);
app.use('/api', propertiesRoutes);
/*// Ruta de prueba para recibir JSON
app.post('/api/test-json', (req, res) => {
	try {
		console.log('Body recibido:', req.body); // Ver el body en la terminal
		res.json({
			status: 'ok',
			receivedBody: req.body, // Retorna el body recibido
		});
	} catch (error) {
		res.status(400).json({ error: 'Error procesando JSON' });
	}
});*/

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/', async (req, res) => {
	try {
		const pool = await getPool();
		// Realizamos una consulta simple para obtener la hora actual desde MySQL.
		const [rows] = await pool.query('SELECT NOW() AS currentTime');
		res.json({
			message:
				'Servidor Express funcionando y conectado a la base de datos',
			currentTime: rows[0].currentTime,
		});
	} catch (error) {
		console.error('Error en la consulta:', error);
		res.status(500).json({
			error: 'Error en la consulta a la base de datos',
		});
	}
});

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
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
