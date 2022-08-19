const router = require("express").Router();
const {
	addOrderItems,
	getOrders,
	getOrderById,
	getUserOrders,
	payOrderWithStripe,
	updateOrderToDelivered,
} = require("../controllers/orderController");
const protectedRoute = require("../middleware/protectedRouteMiddleware");
const adminValidator = require("../middleware/adminValidatorMiddleware");

router.route("/").post(protectedRoute, addOrderItems).get(protectedRoute, adminValidator, getOrders);
router.route("/myorders").get(protectedRoute, getUserOrders);
//router.route("/pay").post(protectedRoute, payOrderWithStripe);
router.route("/:id").get(protectedRoute, getOrderById);
router.route("/:id/delivered").put(protectedRoute, adminValidator, updateOrderToDelivered);

module.exports = router;
