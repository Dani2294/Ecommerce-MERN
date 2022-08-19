import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import { getTopRatedProducts } from "../reducers/productReducers";

const ProductsCarousel = () => {
	const dispatch = useDispatch();

	const { products, isLoading, error } = useSelector((store) => store.productsTopRated);

	useEffect(() => {
		dispatch(getTopRatedProducts());
	}, [dispatch]);

	return isLoading ? (
		<Loader />
	) : error ? (
		<Message variant="danger">{error}</Message>
	) : (
		<Carousel pause="hover" className="bg-dark">
			{products.map((product) => (
				<Carousel.Item key={product._id}>
					<Link to={`/product/${product._id}`}>
						<Image
							src={product.image}
							referrerPolicy="origin"
							alt={product.name}
							fluid
							style={{ objectFit: "cover" }}
							className="carousel-img"
						/>
						<Carousel.Caption className="carousel-caption">
							<h2>
								{product.name} - ${product.price}
							</h2>
						</Carousel.Caption>
					</Link>
				</Carousel.Item>
			))}
		</Carousel>
	);
};

export default ProductsCarousel;
