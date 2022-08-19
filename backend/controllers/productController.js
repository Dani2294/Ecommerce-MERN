const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getAllProducts = asyncHandler(async (req, res) => {
	//define product per page
	const pageSize = 10;
	const page = Number(req.query.page) || 1;
	// get search keyword
	const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: "i" } } : {};
	// get all the products

	const count = await Product.countDocuments({ ...keyword });
	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch single product by id
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
	const { id } = req.params;

	// get the product with the id
	const product = await Product.findById(id);

	if (!product) {
		throw new NotFoundError("Product not found");
	}
	res.json(product);
});

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		throw new NotFoundError("product not found");
	}

	await product.remove();
	res.status(StatusCodes.OK).json({ message: "Product has been removed" });
});

// @desc Create a product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		name: "Sample name",
		price: 0,
		user: req.user._id,
		image: "/images/sample.jpg",
		brand: "Sample brand",
		category: "Sample category",
		countInStock: 0,
		numReviews: 0,
		description: "Sample description",
	});

	const createdProduct = await product.save();
	res.status(StatusCodes.CREATED).json(createdProduct);
});

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
	const { name, price, description, image, brand, category, countInStock } = req.body;

	const product = await Product.findById(req.params.id);

	if (!product) {
		throw new NotFoundError("Product not found");
	}

	product.name = name;
	product.price = price;
	product.description = description;
	product.image = image;
	product.brand = brand;
	product.category = category;
	product.countInStock = countInStock;

	const updatedProduct = await product.save();

	res.status(StatusCodes.OK).json(updatedProduct);
});

// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;

	const product = await Product.findById(req.params.id);

	if (!product) {
		throw new NotFoundError("Product not found");
	}

	// check if user already add a review for the product
	const alreadyReviewed = product.reviews.find((r) => r.user?.toString() === req.user._id.toString());
	if (alreadyReviewed) {
		res.status(StatusCodes.BAD_REQUEST);
		throw new BadRequestError("Product already reviewed");
	}

	const review = {
		comment,
		name: req.user.name,
		rating: Number(rating),
		user: req.user._id,
	};

	product.reviews.push(review);

	product.numReviews = product.reviews.length;

	product.rating =
		product.reviews.reduce((acc, curr) => {
			return acc + curr.rating;
		}, 0) / product.reviews.length;

	await product.save();

	res.status(StatusCodes.CREATED).json({ message: "Review added" });
});

// @desc Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(3);

	res.status(StatusCodes.OK).json(products);
});

module.exports = {
	getAllProducts,
	getProductById,
	deleteProduct,
	createProduct,
	updateProduct,
	createProductReview,
	getTopProducts,
};
