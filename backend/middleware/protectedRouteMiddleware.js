const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { UnauthenticatedError } = require("../errors");
const User = require("../models/userModel");

const protectedRoute = asyncHandler(async (req, res, next) => {
	// check headers
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new UnauthenticatedError("Authentication invalid, no token provided");
	}

	// extract the token
	const token = authHeader.split(" ")[1];
	if (!token) throw new UnauthenticatedError("Authentication invalid, no token provided");

	try {
		// verify and decode the token
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(payload.userID).select("-password");
		// atach the user to the request object
		req.user = user;
		next();
	} catch (error) {
		console.error(error);
		throw new UnauthenticatedError("Authentication invalid, token invalid");
	}
});

module.exports = protectedRoute;
