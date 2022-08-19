import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { deliverOrder, getOrderDetails } from "../reducers/orderReducers";

const addDecimals = (num) => {
	return (Math.round(num * 100) / 100).toFixed(2);
};

const OrderDetailsScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { userInfo } = useSelector((store) => store.user);

	const { id: orderID } = useParams();
	const { orderDetails, isLoading, error } = useSelector((store) => store.orderDetails);
	const {
		success: successDelivered,
		isLoading: deliveredLoading,
		error: deliveredError,
	} = useSelector((store) => store.orderDelivered);

	const itemsPrice = addDecimals(
		orderDetails?.orderItems?.reduce((acc, curr) => (acc += Number(curr.qty) * curr.price), 0)
	);

	useEffect(() => {
		if (!userInfo) {
			navigate("/login");
		}

		if (!orderDetails || orderDetails._id !== orderID) {
			dispatch(getOrderDetails(orderID));
		}
	}, [dispatch, orderID, orderDetails, navigate, userInfo]);

	useEffect(() => {
		if (successDelivered) {
			dispatch(getOrderDetails(orderID));
		}
	}, [successDelivered, dispatch, orderID]);

	const handleDelivered = () => {
		dispatch(deliverOrder(orderID));
	};

	return isLoading ? (
		<Loader />
	) : error ? (
		<Message variant="danger">{error}</Message>
	) : (
		<>
			{userInfo && userInfo.isAdmin && (
				<Link to="/admin/orderlist" className="btn btn-light my-3">
					Go Back
				</Link>
			)}
			<h1>Order {orderDetails._id}</h1>
			{deliveredError && <Message variant="danger">{deliveredError}</Message>}
			{deliveredLoading && <Loader />}
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong className="fw-bold">Name:</strong> {orderDetails.user.name}
							</p>
							<p>
								<strong className="fw-bold">Email:</strong>{" "}
								<a href={`mailto:${orderDetails.user.email}`}>{orderDetails.user.email}</a>
							</p>
							<p>
								<strong className="fw-bold">Address:</strong> {orderDetails.shippingAddress.address},{" "}
								{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode},{" "}
								{orderDetails.shippingAddress.country}
							</p>
							{orderDetails.isDelivered ? (
								<Message variant="success">Delivered on {orderDetails?.deliveredAt.substring(0, 10)}</Message>
							) : (
								<Message variant="danger">Not delivered yet</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payement Method</h2>
							<p>
								<strong className="fw-bold">Method:</strong> {orderDetails.paymentMethod}
							</p>
							{orderDetails.isPaid ? (
								<Message variant="success">Paid on {orderDetails?.paidAt.substring(0, 10)}</Message>
							) : (
								<Message variant="danger">Not paid yet</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Order Resume</h2>
							{orderDetails.orderItems.length === 0 ? (
								<Message>Order is empty</Message>
							) : (
								<ListGroup variant="flush">
									{orderDetails.orderItems.map((item, idx) => (
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
									<Col>{orderDetails.shippingPrice > 0 ? "$" + orderDetails.shippingPrice : "Free"}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${orderDetails.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${orderDetails.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
						</ListGroup>
					</Card>
					{userInfo && userInfo.isAdmin && orderDetails.isPaid && !orderDetails.isDelivered && (
						<Button className="my-3" onClick={handleDelivered}>
							Mark as delivered
						</Button>
					)}
				</Col>
			</Row>
		</>
	);
};

export default OrderDetailsScreen;
