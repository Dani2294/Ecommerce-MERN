import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../reducers/cartReducers";
import { getProductDetails, createReview, resetReviewCreateState } from "../reducers/productReducers";

const ProductScreen = () => {
	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const { userInfo } = useSelector((store) => store.user);
	const { productData: product, isLoading, error } = useSelector((store) => store.productDetails);
	const {
		success: successReviewCreate,
		isLoading: reviewCreateLoading,
		error: reviewCreateError,
	} = useSelector((store) => store.createProductReview);

	useEffect(() => {
		if (successReviewCreate) {
			alert("Reviews successfully submitted!");
			setRating(0);
			setComment("");
			dispatch(resetReviewCreateState());
		}
		dispatch(getProductDetails(id));
	}, [dispatch, id, successReviewCreate]);

	const handleAddToCart = () => {
		dispatch(
			addToCart({
				productID: id,
				qty,
			})
		);
		navigate(`/cart`);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (rating > 0) {
			dispatch(
				createReview({
					id,
					rating,
					comment,
				})
			);
		}
	};

	return (
		<>
			<Button className="btn btn-light my-3" onClick={() => navigate(-1)}>
				<span className="me-2">
					<i className="fa fa-arrow-left"></i>
				</span>
				Go back
			</Button>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
					<Row>
						<Col md={6}>
							<Image src={product.image} referrerPolicy="origin" alt={product.name} fluid />
						</Col>
						<Col>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<h1 className="fs-4">{product.name}</h1>
								</ListGroup.Item>
								<ListGroup.Item>
									<Rating value={product.rating} reviews={product.numReviews} />
								</ListGroup.Item>
								<ListGroup.Item>Price: ${product.price}</ListGroup.Item>
								<ListGroup.Item>Description: {product.description}</ListGroup.Item>
							</ListGroup>
							<Card className="my-3">
								<ListGroup variant="flush">
									<ListGroup.Item>Status: {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}</ListGroup.Item>

									{product.countInStock > 0 && (
										<ListGroup.Item>
											<Row>
												<Col>Quantity</Col>
												<Col>
													<Form.Select
														as="select"
														className="py-1 px-2"
														value={qty}
														onChange={({ target }) => setQty(target.value)}>
														{[...Array(product.countInStock).keys()].map((x) => (
															<option key={x + 1} value={x + 1}>
																{x + 1}
															</option>
														))}
													</Form.Select>
												</Col>
											</Row>
										</ListGroup.Item>
									)}

									<ListGroup.Item>
										<div className="d-grid">
											<Button
												className="btn-block"
												type="button"
												disabled={product.countInStock === 0}
												onClick={handleAddToCart}>
												Add To Cart
											</Button>
										</div>
									</ListGroup.Item>
								</ListGroup>
							</Card>
						</Col>
					</Row>
					<Row className="my-4">
						<Col md={6}>
							<h2>Reviews</h2>
							{product.reviews.length === 0 && <Message>No reviews yet</Message>}
							<ListGroup variant="flush">
								{product.reviews.map((review) => (
									<Card className="my-3" key={review._id}>
										<ListGroup.Item>
											<strong>{review.name}</strong>
											<Rating value={review.rating} />
											<p>{review.createdAt.substring(0, 10)}</p>
											<p>{review.comment}</p>
										</ListGroup.Item>
									</Card>
								))}
								<ListGroup.Item>
									<h2>Write a Customer Review</h2>
									{reviewCreateError && <Message variant="danger">{reviewCreateError}</Message>}
									{reviewCreateLoading && <Loader />}
									{!userInfo ? (
										<p>
											Please <Link to="/login">sign in</Link> to write a review
										</p>
									) : (
										<Form onSubmit={handleSubmit}>
											<Form.Group controlId="rating">
												<Form.Label>Rating</Form.Label>
												<Form.Select as="select" value={rating} onChange={({ target }) => setRating(target.value)}>
													<option value="">Select</option>
													<option value="1">1 - Poor</option>
													<option value="2">2 - Fair</option>
													<option value="3">3 - Good</option>
													<option value="4">4 - Very Good</option>
													<option value="5">5 - Excellent</option>
												</Form.Select>
											</Form.Group>
											<Form.Group controlId="comment" className="my-3">
												<Form.Label>Comment</Form.Label>
												<Form.Control
													as="textarea"
													row="5"
													value={comment}
													onChange={({ target }) => setComment(target.value)}></Form.Control>
											</Form.Group>
											<Button type="submit" variant="primary">
												Submit
											</Button>
										</Form>
									)}
								</ListGroup.Item>
							</ListGroup>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default ProductScreen;
