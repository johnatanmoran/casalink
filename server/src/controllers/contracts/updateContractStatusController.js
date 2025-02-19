import updateContractStatusModel from '../../models/contracts/updateContractStatusModel';

const updateContractStatusController = async (req, res, next) => {
	try {
		const { contractId } = req.params; // ID del contrato
		const { status } = req.body; // Estado que quiere asignar el casero
		const ownerId = req.user.id; // ID del casero autenticado

		// Actualizar el estado del contrato
		const updatedContract = await updateContractStatusModel(
			contractId,
			ownerId,
			status
		);

		res.status(200).json({
			status: 'ok',
			message: `Contrato actualizado a ${status}`,
			data: updatedContract,
		});
	} catch (error) {
		next(error);
	}
};

export default updateContractStatusController;
