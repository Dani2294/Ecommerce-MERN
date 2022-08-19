import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderDetailsScreen from "./screens/OrderDetailsScreen";
import UserListScreen from "./screens/Admin/UserListScreen";
import ProductListScreen from "./screens/Admin/ProductListScreen";
import ProductEditScreen from "./screens/Admin/ProductEditScreen";
import OrderListScreen from "./screens/Admin/OrdertListScreen";

function App() {
	return (
		<Router>
			<Header />
			<main className="py-3">
				<Container>
					<Routes>
						<Route path="/" element={<HomeScreen />}>
							<Route path="" element={<HomeScreen />} />
							{/* <Route path="search/:keyword" element={<HomeScreen />} /> */}
							{/* <Route path="page/:page" element={<HomeScreen />} /> */}
						</Route>
						<Route path="/register" element={<RegisterScreen />} />
						<Route path="/login" element={<LoginScreen />} />
						<Route path="/profile" element={<ProfileScreen />} />
						<Route path="/product/:id" element={<ProductScreen />} />
						<Route path="/cart">
							<Route path="" element={<CartScreen />} />
							<Route path=":id" element={<CartScreen />} />
						</Route>
						<Route path="/shipping" element={<ShippingScreen />} />
						<Route path="/payment" element={<PaymentScreen />} />
						<Route path="/placeorder" element={<PlaceOrderScreen />} />
						<Route path="/order">
							<Route path=":id" element={<OrderDetailsScreen />} />
						</Route>
						<Route path="/admin/userlist" element={<UserListScreen />} />
						<Route path="/admin/productlist" element={<ProductListScreen />} />
						<Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
						<Route path="/admin/orderlist" element={<OrderListScreen />} />
					</Routes>
				</Container>
			</main>
			<Footer />
		</Router>
	);
}

export default App;
