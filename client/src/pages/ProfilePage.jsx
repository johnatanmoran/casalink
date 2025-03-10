import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';
import AvatarIconProfile from '../components/AvatarIconProfile';
import Review from '../components/Review';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const { VITE_API_URL } = import.meta.env;

const ProfilePage = () => {
	const { userId } = useParams();
	const { authUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const token = authUser?.token || localStorage.getItem('token'); // Obtener token
	const [userReviews, setUserReviews] = useState([]);
	const [userInfo, setUserInfo] = useState({});
	const [usernotFound, setUserNotFound] = useState(false);
	const [loading, setLoading] = useState(true);
	const [userProperties, setUserProperties] = useState([]);

	console.log('userId recibido desde useParams():', userId);

	// Redirigir al usuario al login si no está autenticado
	useEffect(() => {
		if (!authUser) {
			navigate('/login');
		}
	}, [authUser, navigate]); // Esto evita el error de hooks condicionales

	// Validar el token y actualizarlo si es necesario
	useEffect(() => {
		let storedToken = localStorage.getItem('token');

		if (!authUser && !storedToken) {
			toast.error('Tu sesión ha expirado, inicia sesión nuevamente.');
			navigate('/login');
		}

		if (!token && storedToken) {
			console.log('Actualizando token desde localStorage');
			setUserProperties(storedToken);
		}
	}, [authUser, token, navigate]);

	useEffect(() => {
		const getUserReviews = async () => {
			try {
				const res = await fetch(
					`${VITE_API_URL}/api/users/${userId}/reviews`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (!res.ok) {
					throw new Error('Error al obtener los datos del usuario');
				}
				const body = await res.json();
				console.log('datos recibidos', body);

				if (!body.data || !body.data.userRatingInfo) {
					setUserNotFound(true);
				} else {
					setUserReviews(body.data.userRatingInfo.reviews);
					setUserInfo(body.data.userRatingInfo.userDetails);
				}
			} catch (error) {
				console.error(error);
				toast.error('Error al obtener los datos del usuario');
				setUserNotFound(true);
			} finally {
				setLoading(false);
			}
		};

		if (token) {
			getUserReviews();
		}
	}, [userId, token]);

	// Obtener propiedades del usuario
	useEffect(() => {
		const fetchUserProperties = async () => {
			try {
				console.log('Solicitando propiedades para userId:', userId);

				const res = await fetch(
					`${VITE_API_URL}/api/users/${userId}/properties`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				// Manejar caso donde el usuario no tiene propiedades (evitar lanzar error)
				if (!res.ok) {
					if (res.status === 404) {
						console.warn(
							`No se encontraron propiedades para el usuario ${userId}`
						);
						setUserProperties([]); // Asignar un array vacío
						return;
					}
					throw new Error('Error al obtener propiedades del usuario');
				}

				const data = await res.json();
				console.log('Propiedades del usuario:', data.properties);

				// Si la API devuelve un array vacío, asignarlo correctamente
				if (data.properties.length === 0) {
					console.warn(
						` Usuario ${userId} no tiene propiedades registradas.`
					);
					setUserProperties([]);
				} else {
					setUserProperties(data.properties);
				}
			} catch (error) {
				console.error('Error al obtener propiedades:', error.message);
				toast.error('Error al obtener las propiedades');
				setUserProperties([]); // Evita que quede `undefined`
			}
		};

		if (token) {
			fetchUserProperties();
		}
	}, [userId, token]);

	return (
		<main className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">
				<h2 className="text-2xl font-semibold text-gray-700 text-center mb-8">
					Mi perfil
				</h2>

				{usernotFound ? (
					<p>El usuario no existe</p>
				) : (
					<>
						<section id="profile-info-section" className="m-4">
							<div
								id="profile-info-container"
								className="flex-col justify-evenly items-center w-full"
							>
								<div className="flex justify-center items-center gap-4 w-auto h-auto mb-6">
									{authUser?.avatarUrl ? (
										<div className="relative overflow-clip w-30 h-30 bg-[#fffff] rounded-full cursor-pointer">
											<img
												src={`${VITE_API_URL}/static/uploads/avatars/${authUser.avatarUrl}`}
												alt="avatar"
												className="w-full h-full object-cover rounded-full"
											/>
										</div>
									) : (
										<AvatarIconProfile />
									)}
									<h2 className="font-bold text-gray-700">
										{userInfo.fullName}
									</h2>

									{/* BOTÓN PARA Modificar el perfil */}
									<div className="flex justify-center ml-4">
										<button
											onClick={() =>
												navigate('/profile/edit')
											}
											className="py-3 px-4 text-white font-bold rounded-full cursor-pointer transition duration-300 bg-[#ff6666] hover:bg-[#E05555]"
											style={{
												width: 'auto',
												minWidth: '200px',
												maxWidth: '300px',
											}}
										>
											Editar perfil
										</button>
									</div>
								</div>

								<div className="flex gap-6 items-center justify-center">
									{userReviews.length > 0 && (
										<>
											<div className="flex-col justify-center border-2 border-[#eeeeee] border-opacity-100 rounded-xl p-1.5 transition duration-300 bg-white hover:bg-[#eeeeee]">
												<div className="flex justify-center">
													<FontAwesomeIcon
														icon={faStar}
														fixedWidth
														className="text-yellow-500"
													/>
												</div>
												<p className="text-center text-xs pt-1 pb-0.5 font-bold">
													Promedio
												</p>
												<p className="text-center font-bold ">
													{userInfo.averageRating}
												</p>
											</div>
										</>
									)}
									{userInfo.bio && (
										<div className="flex items-center justify-center border-2 border-[#eeeeee] border-opacity-100 rounded-xl p-2">
											<p>{userInfo.bio}</p>
										</div>
									)}
								</div>
							</div>
						</section>

						{/* BOTÓN PARA IR A SOLICITUDES DE ALQUILER */}
						<div className="flex justify-center mt-6">
							<button
								onClick={() => navigate('/rental-requests')}
								className="py-3 px-4 text-white font-bold rounded-full cursor-pointer transition duration-300 bg-[#ff6666] hover:bg-[#E05555]"
								style={{
									width: 'auto',
									minWidth: '200px',
									maxWidth: '300px',
								}}
							>
								Ver Solicitudes de Alquiler
							</button>
						</div>

						{/* BOTÓN PARA EDITAR PROPIEDADES */}
						<div className="flex justify-center mt-6">
							<button
								onClick={() =>
									navigate(`/properties/user/${userId}`)
								}
								className="py-3 px-4 text-white font-bold rounded-full cursor-pointer transition duration-300 bg-[#ff6666] hover:bg-[#E05555]"
								style={{
									width: 'auto',
									minWidth: '200px',
									maxWidth: '300px',
								}}
							>
								Editar Propiedades
							</button>
						</div>

						{loading ? (
							<p>Cargando...</p>
						) : userReviews.length > 0 ? (
							<section
								id="profile-reviews-section"
								className="m-8 flex-grow"
							>
								<h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
									Mis valoraciones
								</h2>
								{userReviews.map((review) => (
									<Review
										key={review.id}
										score={review.rating}
										nameReviewer={review.reviewerName}
										avatar={review.reviewerAvatar || 'null'}
										reviewText={review.comment}
									/>
								))}
							</section>
						) : (
							<p className="text-center p-4">
								No hay reseñas disponibles para este usuario
							</p>
						)}
					</>
				)}
			</div>
		</main>
	);
};

export default ProfilePage;
