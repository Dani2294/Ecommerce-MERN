const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const DOMAIN_URL = "http://localhost:3000";

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
	const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

	if (orderItems && orderItems.length === 0) {
		throw new BadRequestError("No order items");
	} else {
		const currDate = Date();
		const order = new Order({
			orderItems,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			shippingPrice,
			taxPrice,
			totalPrice,
			user: req.user._id,
			isPaid: true,
			paidAt: currDate,
		});
		order.paymentResult = {
			// properties from paypal or stripe
			id: req.body.paymentResult.id,
			status: req.body.paymentResult.status,
			update_time: req.body.paymentResult.update_time,
			email_address: req.body.paymentResult.payer.email_address,
		};

		const createdOrder = await order.save();

		res.status(StatusCodes.CREATED).json(createdOrder);
	}
});

// @desc Get all orders
// @route POST /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
	// get the orders
	const orders = await Order.find({}).populate("user", "id email name");

	res.status(StatusCodes.OK).json(orders);
});

// @desc Get order by id
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	// get the order
	const order = await Order.findById(id).populate("user", "name email");

	// check if the order exists
	if (!order) {
		throw new NotFoundError("Order not found");
	}

	res.status(StatusCodes.OK).json(order);
});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getUserOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id });

	res.status(StatusCodes.OK).json(orders);
});

// @desc Update order to paid
// @route GET /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
	const { id } = req.params;
	// get the order
	const order = await Order.findById(id);

	// check if the order exists
	if (!order) {
		throw new NotFoundError("Order not found");
	}

	order.isPaid = true;
	order.paidAt = new Date().now();
	order.paymentResult = {
		// properties from paypal or stripe
		id: req.body.id,
		status: req.body.status,
		update_time: req.body.update_time,
		email_address: req.body.payer.email_address,
	};

	const updatedOrder = await order.save();
	res.status(StatusCodes.OK).json(updatedOrder);
});

// @desc Update order to delivered
// @route GET /api/orders/:id/delivered
// @access Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
	const { id } = req.params;
	// get the order
	const order = await Order.findById(id);

	// check if the order exists
	if (!order) {
		throw new NotFoundError("Order not found");
	}

	order.isDelivered = true;
	order.deliveredAt = Date();

	const updatedOrder = await order.save();
	res.status(StatusCodes.OK).json(updatedOrder);
});

// @desc Pay order with stripe
// @route GET /api/orders/pay
// @access Private
const payOrderWithStripe = asyncHandler(async (req, res) => {
	const taxRate = await stripe.taxRates.create({
		display_name: "Tax",
		inclusive: false,
		percentage: 10,
		country: "US",
	});

	const line_items = req.body.cartItems.map((item) => {
		return {
			price_data: {
				currency: "usd",
				product_data: {
					name: item.name,
				},
				unit_amount: item.price * 100,
			},
			quantity: item.quantity,
			tax_rates: [taxRate.id],
		};
	});

	//console.log(line_items);
	// initiate stripe session
	const session = await stripe.checkout.sessions.create({
		line_items,
		customer_email: req.body.customer_email,
		payment_method_types: ["card"],
		mode: "payment",
		success_url: `${DOMAIN_URL}/placeorder?success=true&id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${DOMAIN_URL}/placeorder?canceled=true`,
	});

	res.json({ url: session.url });
});

// @desc Get stripe key
// @route GET /api/orders/stripe-key
// @access Private
const getStripeSecretKey = asyncHandler(async (req, res) => {
	res.json({ publicKey: process.env.STRIPE_SECRET_KEY });
});

module.exports = {
	addOrderItems,
	getOrders,
	getOrderById,
	getUserOrders,
	updateOrderToPaid,
	updateOrderToDelivered,
	payOrderWithStripe,
	getStripeSecretKey,
};
