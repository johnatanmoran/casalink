import getPool from '../db/getPool.js';

const UsersModel = () => {
    async function getUsers({ username = '', email = '', role = '' }) {
        const pool = await getPool();

        let query =
            'SELECT id, username, email, role FROM users WHERE username LIKE ? AND email LIKE ? AND role LIKE ?';

        const queryParams = [`%${username}%`, `%${email}%`, `%${role}%`];

        const [users] = await pool.query(query, queryParams);

        return users;
    }

    async function validateUser({ email = '' }) {
        const pool = await getPool();

        const query = `UPDATE users SET isEmailVerified = TRUE WHERE email LIKE ?`;

        await pool.query(query, [`%${email}%`]);
    }

    return {
        getUsers,
        validateUser,
    };
};

export default UsersModel;
