const router = require("express").Router();
const {
	authUser,
	getUserProfile,
	registerUser,
	updateUserProfile,
	getUsers,
	deleteUser,
	updateUserAdmin,
} = require("../controllers/userController");
const adminValidator = require("../middleware/adminValidatorMiddleware");
const protectedRoute = require("../middleware/protectedRouteMiddleware");

router.route("/").post(registerUser).get(protectedRoute, adminValidator, getUsers);
router.route("/login").post(authUser);
router.route("/profile").get(protectedRoute, getUserProfile).put(protectedRoute, updateUserProfile);
router
	.route("/:id")
	.delete(protectedRoute, adminValidator, deleteUser)
	.put(protectedRoute, adminValidator, updateUserAdmin);

module.exports = router;
