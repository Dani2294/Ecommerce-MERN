import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { loginUser } from "../reducers/userReducers";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";

const LoginScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [urlParams] = useSearchParams();
	const redirect = urlParams.get("redirect") ? "/" + urlParams.get("redirect") : "/";
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const { isLoading, error, userInfo } = useSelector((store) => store.user);

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	const handleSubmit = (e) => {
		e.preventDefault();

		dispatch(loginUser({ email, password }));
	};

	return (
		<>
			{redirect === "/shipping" && <CheckoutSteps step1 />}
			<FormContainer>
				<h1>Sign In</h1>
				{error && <Message variant="danger">{error}</Message>}
				{isLoading && <Loader />}
				<Form onSubmit={handleSubmit}>
					<Form.Group controlId="email">
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
					<div className="d-grid">
						<Button type="submit" variant="primary">
							Sign in
						</Button>
					</div>
				</Form>
				<Row className="py-3">
					<Col>
						New Customer? <Link to={redirect !== "/" ? `/register?redirect=${redirect}` : "/register"}>Register</Link>
					</Col>
				</Row>
			</FormContainer>
		</>
	);
};

export default LoginScreen;
