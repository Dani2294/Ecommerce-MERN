const asyncHandler = require("express-async-handler");
const { UnauthenticatedError } = require("../errors");

const adminValidator = asyncHandler(async (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		throw new UnauthenticatedError("Not authorized as an admin");
	}
});
module.exports = adminValidator;
