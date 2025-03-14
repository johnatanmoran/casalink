import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

// eslint-disable-next-line react/prop-types
const SearchBar = ({ onSearchComplete, className = '' }) => {
	const navigate = useNavigate();
	const [filters, setFilters] = useState({
		locality: '',
		bedrooms: '',
		bathrooms: '',
	});

	const handleChange = (e) => {
		setFilters({ ...filters, [e.target.name]: e.target.value });
	};

	const handleSearch = (e) => {
		e.preventDefault();
		const query = new URLSearchParams(filters).toString();
		onSearchComplete ? onSearchComplete() : console.log('Nada que cerrar!');
		navigate(`/search?${query}`);
	};

	return (
		<>
			<form
				id="search-form"
				className={`bg-white flex items-center justify-between rounded-full px-0 py-0 w-full max-w-4xl shadow-md mx-auto ${className}`}
				onSubmit={handleSearch}
			>
				{/* Campo: Localidad (Ahora con más espacio) */}
				<input
					id="locality"
					name="locality"
					type="text"
					placeholder="📍 Localidad"
					className="py-3 px-4 outline-none flex-1 rounded-l-full"
					onChange={handleChange}
					value={filters.locality}
				/>

				{/* Contenedor de filtros en línea */}
				<div className="hidden md:flex items-center bg-gray-100 border-2 border-[#ffff] rounded-full gap-4">
					{/* Baños */}
					<div className="flex items-center gap-2 pl-2">
						{' '}
						{/* Espaciado a la izquierda */}
						<span className="text-gray-500 text-lg">🚽</span>
						<input
							id="bathrooms"
							name="bathrooms"
							type="number"
							min="0"
							placeholder="Baños"
							className="w-16 text-center bg-transparent outline-none placeholder-gray-500"
							onChange={handleChange}
							value={filters.bathrooms}
						/>
					</div>

					{/* Habitaciones */}
					<div className="flex items-center gap-2">
						<span className="text-gray-500 text-lg">🛏️</span>
						<input
							id="bedrooms"
							name="bedrooms"
							type="number"
							min="0"
							placeholder="Habitaciones"
							className="w-27 text-center bg-transparent outline-none placeholder-gray-500"
							onChange={handleChange}
							value={filters.bedrooms}
						/>
					</div>

					{/* Botón de búsqueda */}
					<button
						type="submit"
						className="p-4 bg-[#ff6666] text-white rounded-full hover:bg-[#E05555] transition duration-300"
					>
						<FaSearch className="w-5 h-5" />
					</button>
				</div>
			</form>
		</>
	);
};

export default SearchBar;
