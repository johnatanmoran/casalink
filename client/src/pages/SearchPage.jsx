import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import noResultsImage from '../assets/images/casalink-oscar-garcia-buscando.png';
import noImage from '../assets/images/casalink-oscar-garcia-selfie.png';
import toast from 'react-hot-toast';

const { VITE_API_URL } = import.meta.env;

const SearchResults = () => {
	const [favoriteProperties, setFavoriteProperties] = useState(new Set());
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loadingFavorites, setLoadingFavorites] = useState(false);
	const [properties, setProperties] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [searchParams, setSearchParams] = useState({
		locality: '',
		bathrooms: '',
		bedrooms: '',
		minPrice: '',
		maxPrice: '',
		minOwnerRating: '',
		sortBy: 'createdAt',
		order: 'desc',
		limit: 12,
		page: 1,
		userId: null,
		status: 'available',
	});

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// 1. Cargar propiedades
				const params = new URLSearchParams(location.search);
				const propertiesResponse = await fetch(
					`${VITE_API_URL}/api/properties?${params.toString()}`,
					{ headers: { 'Content-Type': 'application/json' } }
				);
				const propertiesData = await propertiesResponse.json();

				setProperties(propertiesData.properties || []);
				setTotalPages(
					Math.ceil(
						(propertiesData.totalProperties || 0) /
							searchParams.limit
					)
				);

				// 2. Verificar autenticación y cargar favoritos
				const token = localStorage.getItem('token');
				const authStatus = !!token;
				setIsAuthenticated(authStatus);

				if (authStatus) {
					setLoadingFavorites(true);
					const favoritesResponse = await fetch(
						`${VITE_API_URL}/api/favs`,
						{
							headers: { Authorization: `${token}` },
						}
					);

					if (favoritesResponse.ok) {
						const favoritesData = await favoritesResponse.json();
						if (Array.isArray(favoritesData.data)) {
							// Verificación de seguridad
							setFavoriteProperties(
								new Set(
									favoritesData.data.map(
										(fav) => fav.propertyId
									)
								)
							);
						} else {
							console.error(
								'Formato de favoritos inválido:',
								favoritesData
							);
							setFavoriteProperties(new Set());
						}
					}
				}
			} catch (error) {
				console.error('Error:', error);
				toast.error('Error al cargar datos');
			} finally {
				setLoading(false);
				setLoadingFavorites(false);
			}
		};

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.search]);

	const toggleFavorite = async (propertyId, e) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isAuthenticated) {
			navigate('/login');
			return;
		}

		const token = localStorage.getItem('token');
		const newFavorites = new Set(favoriteProperties);
		const isFavorite = newFavorites.has(propertyId);

		// Actualización optimista
		if (isFavorite) {
			newFavorites.delete(propertyId);
			toast.error('Favorito eliminado');
		} else {
			newFavorites.add(propertyId);
			toast.success('Favorito agregado');
		}
		setFavoriteProperties(newFavorites);

		try {
			const response = await fetch(
				`${VITE_API_URL}/api/properties/fav/${propertyId}/`,
				{
					method: 'PATCH',
					headers: { Authorization: `${token}` },
				}
			);

			if (!response.ok) throw new Error('Error al actualizar favoritos');

			// Recargar favoritos para sincronización con el servidor
			const refreshResponse = await fetch(`${VITE_API_URL}/api/favs`, {
				headers: { Authorization: `${token}` },
			});
			const newData = await refreshResponse.json();
			setFavoriteProperties(
				new Set(newData.data.map((fav) => fav.propertyId))
			);
		} catch (error) {
			// Revertir cambios en caso de error
			setFavoriteProperties(new Set(favoriteProperties));
			toast.error(error.message);
		}
	};

	const formatPrice = (price) => {
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'EUR',
			maximumFractionDigits: price % 1 === 0 ? 0 : 2,
		}).format(price);
	};

	const goToPage = (newPage) => {
		if (newPage > 0 && newPage <= totalPages) {
			const query = new URLSearchParams({
				...searchParams,
				page: newPage,
			}).toString();
			navigate(`/search?${query}`);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		const query = new URLSearchParams(searchParams).toString();
		navigate(`/search?${query}`);
	};

	return (
		<section className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
			{/* Formulario de búsqueda */}

			<h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
				Resultados de Búsqueda
			</h1>

			{loading ? (
				<p className="text-center text-gray-600">Cargando...</p>
			) : properties.length > 0 ? (
				<div>
					{/* Paginación */}
					<nav className="flex justify-center items-center gap-4 my-6 container mx-auto">
						<button
							onClick={() => goToPage(searchParams.page - 1)}
							disabled={searchParams.page <= 1}
							className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
						>
							← Anterior
						</button>
						<span className="text-gray-800">
							Página {searchParams.page} de {totalPages}
						</span>
						<button
							onClick={() =>
								goToPage(parseInt(searchParams.page) + 1)
							}
							disabled={searchParams.page >= totalPages}
							className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
						>
							Siguiente →
						</button>
					</nav>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 container mx-auto">
						{properties.map((property) => (
							<div
								key={property.propertyId}
								className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform"
							>
								<a href={`/properties/${property.propertyId}`}>
									<div>
										<img
											src={
												property.mainImage
													? VITE_API_URL +
														'/static/uploads/images/' +
														property.mainImage
													: noImage
											}
											alt={property.propertyTitle}
											className="w-full aspect-square object-cover bg-[#e6dada]"
										/>

										{/* Botón de favoritos */}
										<button
											onClick={(e) =>
												toggleFavorite(
													property.propertyId,
													e
												)
											}
											className={`transition-colors ${
												favoriteProperties.has(
													property.propertyId
												)
													? 'text-[#ff6666] hover:text-red-500'
													: 'text-gray-100/50 hover:text-gray-300'
											} top-2 right-2 absolute size-8 ${loadingFavorites ? 'opacity-50 cursor-not-allowed' : ''}`}
											disabled={loadingFavorites}
										>
											<FaHeart className="w-full h-auto" />
										</button>
									</div>

									<div className="p-2 grid grid-cols-12 gap-2">
										<div className="col-span-2 p-2 flex flex-col gap-2 border-2 border-gray-300 rounded-lg w-full items-center h-fit content-center">
											<FaStar className="text-gray-300" />
											<p className="text-gray-300 text-center">
												{Math.floor(
													property.ownerInfo
														.averageRating
												)}
											</p>
										</div>
										<div className="col-span-8 flex flex-col">
											<h2 className="text-lg font-bold text-gray-900">
												{property.propertyTitle}
											</h2>
											<div className="flex flex-row items-center gap-2 text-sm">
												<span className="text-gray-600">
													{property.addressLocality}
												</span>
												<span className="text-gray-600 inline-block">
													{property.squareMeters}
													m²
												</span>
											</div>
										</div>
										<div className="col-span-2 flex flex-col h-full justify-between items-end">
											<div className="flex flex-row items-center gap-2 text-sm">
												<span className="text-gray-600 inline-block">
													🛏️
												</span>
												<span className="text-gray-600 inline-block">
													{property.bedrooms}
												</span>
											</div>
											<div className="flex flex-row items-center gap-2 text-sm">
												<span className="text-gray-600 flex-row items-center gap-2">
													🚽
												</span>
												<span className="text-gray-600 inline-block">
													{property.bathrooms}
												</span>
											</div>
											<p className="text-gray-600 text-lg font-bold">
												{formatPrice(property.price)}
											</p>
										</div>
									</div>
								</a>
							</div>
						))}
					</div>

					{/* Paginación */}
					<nav className="flex justify-center items-center gap-4 mt-6 container mx-auto">
						<button
							onClick={() => goToPage(searchParams.page - 1)}
							disabled={searchParams.page <= 1}
							className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
						>
							← Anterior
						</button>
						<span className="text-gray-800">
							Página {searchParams.page} de {totalPages}
						</span>
						<button
							onClick={() =>
								goToPage(parseInt(searchParams.page) + 1)
							}
							disabled={searchParams.page >= totalPages}
							className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
						>
							Siguiente →
						</button>
					</nav>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
					<img
						src={noResultsImage}
						alt="No results"
						className="w-64 h-auto"
					/>
					<p className="text-gray-600 text-xl mt-4">
						No se encontraron propiedades con estos filtros.
					</p>
				</div>
			)}
		</section>
	);
};

export default SearchResults;
