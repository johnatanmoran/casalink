import UsersModel from '../models/users.js';

const UsersController = () => {
    async function getUsers(req, res) {
        try {
            const { username, email, role } = req.query; // Tomamos los filtros desde la URL
            const users = await UsersModel.getUsers({ username, email, role });

            res.status(200).json({
                message: 'Lista de usuarios obtenida correctamente',
                users,
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener la lista de usuarios',
                details: error.message,
            });
        }
    }

    async function validateUser(req, res) {
        try {
            // Podria ser id de usario o email...
            const { email } = req.query;
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
    }

    return {
        getUsers,
        validateUser,
    };
};

export default UsersController;
