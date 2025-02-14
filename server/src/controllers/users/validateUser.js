import UsersModel from '../../models/users.js';

const validateUser = async (req, res) => {
    try {
        // Podria ser id de usario o email...
        const { email } = req.body;
        await UsersModel.validateUser({ email });

        res.status(200).json({
            message: 'Usuario validado correctamente',
            email,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al validar usuario',
            details: error.message,
        });
    }
};

export default validateUser;
