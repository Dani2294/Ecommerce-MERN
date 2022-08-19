import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { registerUser } from "../reducers/userReducers";
import FormContainer from "../components/FormContainer";

const RegisterScreen = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
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
		if (password !== confirmPassword) {
			setMessage("Passwords do not match");
		} else {
			setMessage("");
			dispatch(registerUser({ name, email, password }));

			if (redirect === "shipping" && !error) {
				navigate("/shipping");
			}
		}
	};

	return (
		<FormContainer>
			<h1>Register</h1>
			{message && <Message variant="danger">{message}</Message>}
			{error && <Message variant="danger">{error}</Message>}
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
						Register
					</Button>
				</div>
			</Form>
			<Row className="py-3">
				<Col>
					Already have an account? <Link to={redirect !== "/" ? `/login?redirect=${redirect}` : "/login"}>Sign in</Link>
				</Col>
			</Row>
		</FormContainer>
	);
};

export default RegisterScreen;
