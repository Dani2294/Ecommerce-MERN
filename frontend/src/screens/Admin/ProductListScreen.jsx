import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { createProduct, deleteProduct, getProductsList, resetProductCreateState } from "../../reducers/productReducers";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { userInfo } = useSelector((store) => store.user);
	const [urlParams] = useSearchParams();
	const page = urlParams.get("page") || 1;
	const {
		productList,
		isLoading: productListLoading,
		error: productListError,
		successDelete,
		pages,
		page: currPage,
	} = useSelector((store) => store.productList);
	const {
		product: createdProduct,
		error: createProductError,
		successCreated,
	} = useSelector((store) => store.productCreate);

	useEffect(() => {
		dispatch(resetProductCreateState());
		if (userInfo && userInfo.isAdmin) {
			dispatch(getProductsList({ keyword: "", page }));
		} else {
			navigate("/login");
		}

		if (successCreated) {
			navigate(`/admin/product/${createdProduct._id}/edit`);
		} else {
			dispatch(getProductsList());
		}
	}, [dispatch, navigate, userInfo, successCreated, successDelete, createdProduct, page]);

	const handleCreateProduct = () => {
		dispatch(createProduct());
	};

	const handleDeleteProduct = (id) => {
		const confirmDelete = window.confirm("Are you sure you want to delete this product?");
		if (confirmDelete) {
			// DELETE PRODUCT
			dispatch(deleteProduct(id));
		}
	};

	return (
		<>
			<Row className="align-items-center">
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className="text-sm-end">
					<Button className="my-3" onClick={handleCreateProduct}>
						<i className="fas fa-plus"></i> Create Product
					</Button>
				</Col>
				{createProductError && <Message variant="danger">{createProductError}</Message>}
			</Row>
			{productListLoading ? (
				<Loader />
			) : productListError ? (
				<Message variant="danger">{productListError}</Message>
			) : (
				<>
					<Table striped bordered hover responsive className="table-sm">
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>CATEGORY</th>
								<th>BRAND</th>
								<th>ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{productList.map((product) => (
								<tr key={product._id}>
									<td>{product._id}</td>
									<td>{product.name}</td>
									<td>${product.price}</td>
									<td>{product.category}</td>
									<td>{product.brand}</td>
									<td>
										<LinkContainer to={`/admin/product/${product._id}/edit`}>
											<Button variant="light" className="btn-sm">
												<i className="fas fa-edit"></i>
											</Button>
										</LinkContainer>
										<Button variant="danger" className="btn-sm" onClick={() => handleDeleteProduct(product._id)}>
											<i className="fas fa-trash"></i>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Paginate pages={pages} page={currPage} keyword={""} isAdmin={userInfo?.isAdmin} />
				</>
			)}
		</>
	);
};

export default ProductListScreen;
