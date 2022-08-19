import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import Loader from "../components/Loader";
import { createOrder } from "../reducers/orderReducers";
import { emptyCart } from "../reducers/cartReducers";

const addDecimals = (num) => {
	return (Math.round(num * 100) / 100).toFixed(2);
};

const PlaceOrderScreen = () => {
	const [sdkReady, setSdkReady] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { cartItems, shippingAddress, paymentMethod } = useSelector((store) => store.cart);

	// Calculate prices
	const itemsPrice = addDecimals(cartItems.reduce((acc, curr) => (acc += Number(curr.qty) * curr.price), 0));
	const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 15);
	const taxPrice = addDecimals(Number((0.1 * itemsPrice).toFixed(2)));
	const totalPrice = addDecimals(Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice));

	const {
		success: successOrderCreate,
		error: errorOrderCreate,
		order: createdOrder,
	} = useSelector((store) => store.order);
	const { isLoading, error: errorPay } = useSelector((store) => store.payOrder);

	useEffect(() => {
		const getPayPalClientId = async () => {
			// Get paypal client id key
			const { data: paypalClientId } = await axios.get("/api/config/paypal");

			// create script tag for paypal sdk
			const script = document.createElement("script");
			script.type = "text/javascript";
			script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}`;
			script.async = true;
			script.onload = () => setSdkReady(true);
			document.body.appendChild(script);
		};

		if (!window.paypal) {
			getPayPalClientId();
		} else {
			setSdkReady(true);
		}
	}, []);

	useEffect(() => {
		if (successOrderCreate) {
			navigate(`/order/${createdOrder._id}`);
		}
	}, [successOrderCreate, navigate, createdOrder]);

	const handlePlaceOrder = async (paymentResult) => {
		dispatch(
			createOrder({
				shippingAddress,
				paymentMethod,
				itemsPrice,
				shippingPrice,
				taxPrice,
				totalPrice,
				paymentResult,
				orderItems: cartItems,
			})
		);

		// vider le panier ici et local storage ici
		dispatch(emptyCart());
	};

	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			{errorOrderCreate && <Message variant="danger">{errorOrderCreate}</Message>}
			{errorPay && <Message variant="danger">{errorPay}</Message>}
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong className="fw-bold">Address:</strong> {shippingAddress.address}, {shippingAddress.city},{" "}
								{shippingAddress.postalCode}, {shippingAddress.country}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payement Method</h2>
							<p>
								<strong className="fw-bold">Method:</strong> {paymentMethod}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Order Resume</h2>
							{cartItems.length === 0 ? (
								<Message>Your cart is empty</Message>
							) : (
								<ListGroup variant="flush">
									{cartItems.map((item, idx) => (
										<ListGroup.Item key={idx}>
											<Row>
												<Col xs={3} lg={2}>
													<Image src={item.image} alt={item.name} fluid rounded />
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>{item.name}</Link>
												</Col>
												<Col xs={4} md={4}>
													{item.qty} x ${item.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>{shippingPrice > 0 ? "$" + shippingPrice : "Free"}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<div className="d-grid">
									{isLoading || !sdkReady ? (
										<Loader />
									) : (
										<PayPalButton amount={totalPrice} onSuccess={handlePlaceOrder} />
									)}
								</div>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default PlaceOrderScreen;
