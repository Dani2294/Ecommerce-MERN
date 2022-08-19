import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import { savePaymentMethod } from "../reducers/cartReducers";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentScreen = () => {
	const { shippingAddress } = useSelector((store) => store.cart);
	const navigate = useNavigate();
	if (!shippingAddress) {
		navigate("/shipping");
	}

	const [paymentMethod, setPaymentMethod] = useState("PayPal");
	const [message, setMessage] = useState("");

	const dispatch = useDispatch();

	const handleSubmit = (e) => {
		e.preventDefault();
		setMessage("");
		dispatch(savePaymentMethod(paymentMethod));
		navigate("/placeorder");
	};

	return (
		<>
			<CheckoutSteps step1 step2 step3 />
			<FormContainer>
				<h1>Payment Method</h1>
				{message && <Message variant="danger">{message}</Message>}
				<Form onSubmit={handleSubmit}>
					<Form.Group className="my-3">
						<Form.Label as="legend">Select payment method</Form.Label>
						<Col>
							<Form.Check
								type="radio"
								label="PayPal or Credit Card"
								id="Paypal"
								name="paymentMethod"
								checked
								value="PayPal"
								onChange={({ target }) => setPaymentMethod(target.value)}
							/>
							{/* <Form.Check
								type="radio"
								label="Stripe"
								id="Stripe"
								name="paymentMethod"
								value="Stripe"
								onChange={({ target }) => setPaymentMethod(target.value)}
							/> */}
						</Col>
					</Form.Group>
					<Button type="submit" variant="primary">
						Continue
					</Button>
				</Form>
			</FormContainer>
		</>
	);
};

export default PaymentScreen;
