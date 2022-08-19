import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { addToCart, removeItem } from "../reducers/cartReducers";
import { Button, Card, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CartScreen = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	/* const { id: productID } = useParams();
	const [urlParams, setUrlParams] = useSearchParams();
	const qty = urlParams.get("qty"); */

	const { cartItems } = useSelector((store) => store.cart);

	const { userInfo } = useSelector((store) => store.user);

	/* 	useEffect(() => {
		if (productID) {
			dispatch(addToCart({ productID, qty }));
		}
	}, [dispatch, productID, qty]); */

	const handleChangeQty = (id, quantity) => {
		dispatch(
			addToCart({
				productID: id,
				qty: Number(quantity),
			})
		);
		/* if (productID === id) {
			setUrlParams({ qty: quantity });
		} */
	};

	const handleRemoveFromCart = (productID) => {
		const isConfirmed = window.confirm("Are you sure you want to remove this product from your cart?");
		if (isConfirmed) {
			dispatch(removeItem(productID));
		}
	};

	const handleCheckout = () => {
		if (!userInfo) {
			navigate("/login?redirect=shipping");
		} else {
			navigate("/shipping");
		}
	};

	return (
		<>
			<Row>
				<Col md={8}>
					<h1>Shopping Cart</h1>
					{cartItems.length === 0 ? (
						<Message>
							Your cart is empty...<Link to="/">Go Back Home</Link>
						</Message>
					) : (
						<ListGroup variant="flush">
							{cartItems.map((item) => (
								<ListGroup.Item key={item.product}>
									<Row>
										<Col md={2}>
											<Image src={item.image} alt={item.name} fluid rounded />
										</Col>
										<Col md={3}>
											<Link to={`/product/${item.product}`}>{item.name}</Link>
										</Col>
										<Col md={2}>${item.price}</Col>
										<Col md={2}>
											<Form.Select
												as="select"
												className="py-1 px-2"
												value={item.qty}
												onChange={({ target }) => handleChangeQty(item.product, target.value)}>
												{[...Array(item.countInStock).keys()].map((x) => (
													<option key={x + 1} value={x + 1}>
														{x + 1}
													</option>
												))}
											</Form.Select>
										</Col>
										<Col md={2}>
											<Button type="button" variant="light" onClick={() => handleRemoveFromCart(item.product)}>
												<i className="fas fa-trash"></i>
											</Button>
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h2>Subtotal ({cartItems.reduce((acc, curr) => acc + Number(curr.qty), 0)}) items</h2>$
								{cartItems.reduce((acc, curr) => (acc += Number(curr.qty) * curr.price), 0).toFixed(2)}
							</ListGroup.Item>
							<ListGroup.Item>
								<div className="d-grid">
									<Button type="button" disabled={cartItems.length === 0} onClick={handleCheckout}>
										Proceed To Checkout
									</Button>
								</div>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
			<LinkContainer to="/">
				<Button variant="light">Continue shopping</Button>
			</LinkContainer>
		</>
	);
};

export default CartScreen;
