import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, updateUserDetails } from "../reducers/userReducers";
import { getUserOrderList } from "../reducers/orderReducers";

const ProfileScreen = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");

	const navigate = useNavigate();

	const dispatch = useDispatch();
	const { userInfo } = useSelector((store) => store.user);
	const { isLoading, error, user, success } = useSelector((store) => store.userDetails);
	const { isLoading: myOrdersLoading, error: myOrdersError, myOrders } = useSelector((store) => store.myOrders);

	useEffect(() => {
		if (!userInfo) {
			navigate("/login");
		} else {
			if (!user?.name) {
				dispatch(getUserDetails("profile"));
			} else {
				setName(user.name);
				setEmail(user.email);
			}
		}
	}, [dispatch, navigate, userInfo, user]);

	useEffect(() => {
		dispatch(getUserOrderList());
	}, [dispatch]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage("Passwords do not match");
		} else {
			setMessage("");
			// Dispatch update
			dispatch(updateUserDetails({ id: user._id, name, email, password }));
		}
	};
	return (
		<Row>
			<Col md={3}>
				<h2>User Profile</h2>
				{message && <Message variant="danger">{message}</Message>}
				{error && <Message variant="danger">{error}</Message>}
				{success && <Message variant="success">Profile updated successfully</Message>}
				{isLoading && <Loader />}
				<Form onSubmit={handleSubmit}>
					<Form.Group controlId="name">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="name"
							placeholder="Enter name"
							value={name}
							onChange={({ target }) => setName(target.value)}
						/>
					</Form.Group>
					<Form.Group controlId="email" className="my-3">
						<Form.Label>Email address</Form.Label>
						<Form.Control
							type="email"
							placeholder="Enter email"
							value={email}
							onChange={({ target }) => setEmail(target.value)}
						/>
					</Form.Group>
					<Form.Group controlId="password" className="my-3">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Enter password"
							value={password}
							onChange={({ target }) => setPassword(target.value)}
						/>
					</Form.Group>
					<Form.Group controlId="confirmPassword" className="my-3">
						<Form.Label>Confirm password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Confirm password"
							value={confirmPassword}
							onChange={({ target }) => setConfirmPassword(target.value)}
						/>
					</Form.Group>
					<div className="d-grid">
						<Button type="submit" variant="primary">
							Update
						</Button>
					</div>
				</Form>
			</Col>
			<Col md={9}>
				<h2>My Orders</h2>
				{myOrdersLoading ? (
					<Loader />
				) : myOrdersError ? (
					<Message variant="danger">{myOrdersError}</Message>
				) : myOrders.length === 0 ? (
					<p>No orders yet</p>
				) : (
					<Table striped bordered hover responsive className="table-sm">
						<thead>
							<tr>
								<th>ID</th>
								<th>DATE</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{myOrders.map((order) => (
								<tr key={order._id}>
									<td>{order._id}</td>
									<td>{order.createdAt.substring(0, 10)}</td>
									<td>{order.totalPrice}€</td>
									<td>
										{order.isPaid ? (
											order.paidAt.substring(0, 10)
										) : (
											<i className="fas fa-times" style={{ color: "red" }}></i>
										)}
									</td>
									<td>
										{order.isDelivered ? (
											order.deliveredAt.substring(0, 10)
										) : (
											<i className="fas fa-times" style={{ color: "red" }}></i>
										)}
									</td>
									<td>
										<LinkContainer to={`/order/${order._id}`}>
											<Button className="btn-sm" variant="light">
												Details
											</Button>
										</LinkContainer>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Col>
		</Row>
	);
};

export default ProfileScreen;
