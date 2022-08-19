const router = require("express").Router();
const {
	getAllProducts,
	getProductById,
	deleteProduct,
	updateProduct,
	createProduct,
	createProductReview,
	getTopProducts,
} = require("../controllers/productController");
const adminValidator = require("../middleware/adminValidatorMiddleware");
const protectedRoute = require("../middleware/protectedRouteMiddleware");

router.route("/").get(getAllProducts).post(protectedRoute, adminValidator, createProduct);
router.get("/top", getTopProducts);
router
	.route("/:id")
	.get(getProductById)
	.delete(protectedRoute, adminValidator, deleteProduct)
	.put(protectedRoute, adminValidator, updateProduct);
router.route("/:id/reviews").post(protectedRoute, createProductReview);

module.exports = router;
