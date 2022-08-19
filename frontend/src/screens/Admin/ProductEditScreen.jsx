import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { getProductDetails, resetProductUpdateState, updateProduct } from "../../reducers/productReducers";
import axios from "axios";

const ProductEditScreen = () => {
	const [name, setName] = useState("");
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState("");
	const [brand, setBrand] = useState("");
	const [category, setCategory] = useState("");
	const [countInStock, setCountInStock] = useState(0);
	const [description, setDescription] = useState("");

	const [uploading, setUploading] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { id } = useParams();
	const { productData: product, isLoading, error } = useSelector((store) => store.productDetails);
	const {
		//productData: productUpdated,
		isLoading: productUpdatedLoading,
		error: productUpdatedError,
		successUpdated,
	} = useSelector((store) => store.productUpdate);

	useEffect(() => {
		dispatch(getProductDetails(id));
	}, [dispatch, id]);

	useEffect(() => {
		if (product.name || product._id === id) {
			setName(product.name);
			setPrice(product.price);
			setImage(product.image);
			setBrand(product.brand);
			setCategory(product.category);
			setCountInStock(product.countInStock);
			setDescription(product.description);
		}
	}, [id, product]);

	useEffect(() => {
		if (successUpdated) {
			dispatch(resetProductUpdateState());
			navigate("/admin/productlist");
		}
	}, [successUpdated, navigate, dispatch]);

	const handleSubmit = (e) => {
		e.preventDefault();

		dispatch(
			updateProduct({
				_id: id,
				name,
				price,
				image,
				brand,
				category,
				description,
				countInStock,
			})
		);
	};

	const handleUploadFile = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("image", file);
		setUploading(true);

		try {
			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};

			const { data } = await axios.post("/api/upload", formData, config);

			setImage(data);
			setUploading(false);
		} catch (error) {
			console.error(error);
			setUploading(false);
		}
	};
	return (
		<>
			<Button className="btn btn-light my-3" onClick={() => navigate(-1)}>
				Go Back
			</Button>
			<FormContainer>
				{/* {isLoading && <Loader />}
				{error && <Message variant="danger">{error}</Message>} */}
				{isLoading ? (
					<Loader />
				) : error ? (
					<Message variant="danger">{error}</Message>
				) : (
					<Form onSubmit={handleSubmit}>
						<h1>Edit Product</h1>
						{productUpdatedError && <Message variant="danger">{productUpdatedError}</Message>}
						{productUpdatedLoading && <Loader />}
						<Form.Group controlId="name">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter name"
								value={name}
								onChange={({ target }) => setName(target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="price">
							<Form.Label>Price</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter price"
								value={price}
								onChange={({ target }) => setPrice(target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="image">
							<Form.Label>Image</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter image url"
								value={image}
								onChange={({ target }) => setImage(target.value)}
							/>
							<Form.Control type="file" label="Choose File" name="image" onChange={handleUploadFile} />
							{uploading && <Loader />}
						</Form.Group>
						<Form.Group controlId="brand">
							<Form.Label>Brand</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter brand name"
								value={brand}
								onChange={({ target }) => setBrand(target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="category">
							<Form.Label>Category</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter category"
								value={category}
								onChange={({ target }) => setCategory(target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="countInStock">
							<Form.Label>Count in stock</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter count in stock"
								value={countInStock}
								onChange={({ target }) => setCountInStock(target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="description">
							<Form.Label>Description</Form.Label>
							<Form.Control
								type="text"
								as="textarea"
								placeholder="Enter description"
								value={description}
								onChange={({ target }) => setDescription(target.value)}
							/>
						</Form.Group>

						<Button type="submit" variant="primary" className="my-3">
							Save
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	);
};

export default ProductEditScreen;
