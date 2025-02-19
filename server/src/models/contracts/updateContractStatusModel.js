import getPool from '../../db/getPool';
import generateErrorUtil from '../../utils/generateErrorUtil';

const updateContractStatusModel = async (contractId, ownerId, status) => {
	const pool = getPool();

	// Verificar si el contrato pertenece al casero
	const [contract] = await pool.query(
		'SELECT * FROM contracts WHERE id = ? AND propertyId IN (SELECT id FROM properties WHERE ownerId = ?)',
		[contractId, ownerId]
	);

	if (contract.length === 0) {
		throw generateErrorUtil(
			'No tienes permiso para modificar este contrato',
			403
		);
	}

	// Verificar si el estado es válido
	const validStatuses = ['approved', 'rejected'];
	if (!validStatuses.includes(status)) {
		throw generateErrorUtil(
			'Estado inválido. Debe ser "approved" o "rejected".',
			400
		);
	}

	// Actualizar el estado del contrato
	await pool.query('UPDATE contracts SET status = ? WHERE id = ?', [
		status,
		contractId,
	]);

	return { contractId, status };
};

export default updateContractStatusModel;
