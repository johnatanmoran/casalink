import getPool from '../../db/getPool.js';

const selectContractsByStatusModel = async ({
	userId,
	statusFilter,
	page,
	limit,
}) => {
	// Obtenemos el pool.
	const pool = await getPool();

	// Parámetros de paginación
	const offset = (page - 1) * limit;

	const [[{ total }]] = await pool.query(
		`SELECT COUNT(*) AS total FROM contracts WHERE tenantId = ? AND status IN (?)`,
		[userId, statusFilter]
	);

	console.log(
		await pool.query(
			`SELECT COUNT(*) AS total FROM contracts WHERE tenantId = ? AND status IN (?)`,
			[userId, statusFilter]
		)
	);

	// Consulta para obtener los contratos paginados
	const [contracts] = await pool.query(
		`
			SELECT * FROM contracts WHERE tenantId = ? AND status IN (?)
			ORDER BY createdAt DESC
			LIMIT ? OFFSET ?
			`,
		[userId, statusFilter, Number(limit), Number(offset)]
	);

	console.log('Total:', total);
	return { contracts, total: Number(total) };
};

export default selectContractsByStatusModel;
