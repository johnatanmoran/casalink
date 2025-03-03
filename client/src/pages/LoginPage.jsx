import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const LoginPage = () => {
	const { authUser, authLoginState } = useContext(AuthContext);

	const [formValues, setFormValues] = useState({
		email: '',
		password: '',
	});

	const [loading, setLoading] = useState(false);

	// Función genérica para manejar cambios en los inputs del formulario.
	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormValues({
			...formValues,
			[name]: value,
		});
	};

	// Función que maneja el envío del formulario.
	// Función que maneja el envío del formulario.
	const handleLoginUser = async (e) => {
		try {
			e.preventDefault();
			setLoading(true);

			const res = await fetch(`${VITE_API_URL}/api/users/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formValues),
			});

			const body = await res.json();

			if (body.status === 'error') {
				throw new Error(body.message);
			}

			// Guardar el token en localStorage además del estado global
			localStorage.setItem('token', body.data.token);
			authLoginState(body.data.token);

			toast.success('Login exitoso');
		} catch (err) {
			toast.error(err.message, { id: 'loginPage' });
		} finally {
			setLoading(false);
		}
	};

	// Si ya estamos logueados, redirigir a la página principal
	if (authUser) {
		return <Navigate to="/" />;
	}

	return (
		<main>
			<h2>Página de login</h2>

			<form onSubmit={handleLoginUser}>
				<label htmlFor="email">Email:</label>
				<input
					type="email"
					id="email"
					name="email"
					autoComplete="email"
					value={formValues.email}
					onChange={handleChange}
					autoFocus
					required
				/>

				<label htmlFor="password">Contraseña:</label>
				<input
					type="password"
					id="password"
					name="password"
					autoComplete="new-password"
					value={formValues.password}
					onChange={handleChange}
					required
				/>

				<button disabled={loading}>Loguearse</button>
			</form>
		</main>
	);
};

export default LoginPage;
