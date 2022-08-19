import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Col, Row } from "react-bootstrap";
import { getProductsList } from "../reducers/productReducers";
import Paginate from "../components/Paginate";
import ProductsCarousel from "../components/ProductsCarousel";

const HomeScreen = (props) => {
	const dispatch = useDispatch();
	/* 
	// other way to search and paginate
	const { keyword, page} = useParams();
	 */
	const [urlParams] = useSearchParams();
	const keyword = urlParams.get("search") || "";
	const page = urlParams.get("page") || 1;

	const { productList, isLoading, error, pages, page: currPage } = useSelector((store) => store.productList);
	const { userInfo } = useSelector((store) => store.user);

	useEffect(() => {
		dispatch(getProductsList({ keyword, page }));
	}, [dispatch, keyword, page]);

	return (
		<>
			{!keyword && <ProductsCarousel />}
			<h1>Lastest Products</h1>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
					<Row>
						{productList?.map((product) => (
							<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
								<Product product={product} />
							</Col>
						))}
					</Row>
					<Paginate pages={pages} page={currPage} keyword={keyword ? keyword : ""} isAdmin={userInfo?.isAdmin} />
				</>
			)}
		</>
	);
};

export default HomeScreen;
