import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';


import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UpdateProductPage from './pages/UpdateProductPage';
import RentalRequestsPage from './pages/RentalRequestsPage';
import CreateRent from "./pages/CreateRent"; 
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import ContractDetailPage from './pages/ContractDetailPage';
import ProfilePage from './pages/ProfilePage';

import './index.css';

const App = () => {
	return (
		<>
			<div className="flex min-h-screen flex-col">
				<Header />

				<Routes>
					{/* Rutas Públicas */}
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/about" element={<AboutPage />} />
					<Route path="/contact" element={<ContactPage />} />
					<Route path="/help" element={<HelpPage />} />
					<Route path="/contracts/:contractId" element={<ContractDetailPage />} /> {/* ✅ Nueva ruta */}
					<Route path="/profile/:userId" element={<ProfilePage/>}/>

					{/* Rutas de Gestión */}
					<Route
            path="/create-rent" 
            element={<CreateRent />} />

					<Route
						path="/properties/:id/update"
						element={<UpdateProductPage />}
					/>

					<Route
						path="/rental-requests"
						element={<RentalRequestsPage />}
					/>
				</Routes>

				<Footer />
			</div>
		</>
	);
};


export default App;
