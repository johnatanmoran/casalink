import selectPropertyByIdModel from '../../models/owner/selectPropertyByIdModel.js';
//FALTA PROBAR CON DATOS DE PRUEBA
const propertyDetailsController = async (req, res, next) => {
	try {
		const { propertyId } = req.params;

		const property = await selectPropertyByIdModel(propertyId);

		res.send({
			status: 'ok',
			message: 'Detalles de la propiedad',
			data: {
				property,
			},
		});
	} catch (err) {
		next(err);
	}
};

export default propertyDetailsController;
