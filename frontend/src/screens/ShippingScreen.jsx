import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import { saveShippingAddress } from "../reducers/cartReducers";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
	const { shippingAddress } = useSelector((store) => store.cart);

	const [address, setAddress] = useState(shippingAddress.address || "");
	const [city, setCity] = useState(shippingAddress.city || "");
	const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
	const [country, setCountry] = useState(shippingAddress.country || "");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!address || !city || !postalCode || !country) {
			setMessage("You have to fill all the inputs");
		} else {
			setMessage("");
			dispatch(saveShippingAddress({ address, city, postalCode, country }));
			navigate("/payment");
		}
	};

	return (
		<>
			<CheckoutSteps step1 step2 />
			<FormContainer>
				<h1>Shiping</h1>
				{message && <Message variant="danger">{message}</Message>}
				<Form onSubmit={handleSubmit}>
					<Form.Group className="my-3" controlId="address">
						<Form.Label>Address</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter address"
							value={address}
							required
							onChange={({ target }) => setAddress(target.value)}
						/>
					</Form.Group>
					<Form.Group className="my-3" controlId="city">
						<Form.Label>City</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter city"
							value={city}
							required
							onChange={({ target }) => setCity(target.value)}
						/>
					</Form.Group>
					<Form.Group className="my-3" controlId="postalCode">
						<Form.Label>Postal Code</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter postal code"
							value={postalCode}
							required
							onChange={({ target }) => setPostalCode(target.value)}
						/>
					</Form.Group>
					<Form.Group className="my-3" controlId="country">
						<Form.Label>Country</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter Country"
							value={country}
							required
							onChange={({ target }) => setCountry(target.value)}
						/>
					</Form.Group>
					<Button type="submit" variant="primary">
						Continue
					</Button>
				</Form>
			</FormContainer>
		</>
	);
};

export default ShippingScreen;
