const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
	console.log(err.statusCode);
	let customError = {
		// set defaults
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong, please try again later",
	};
	if (err.code && err.code === 11000) {
		customError.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)} field, please choose another value`;
		customError.statusCode = StatusCodes.BAD_REQUEST;
	}

	if (err.name === "ValidationError") {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(", ");
		customError.statusCode = StatusCodes.BAD_REQUEST;
	}

	if (err.name === "CastError") {
		customError.msg = `No item found with id: ${err.value}`;
		customError.statusCode = StatusCodes.NOT_FOUND;
	}

	const stack = process.env.NODE_ENV === "production" ? null : err.stack;
	return res
		.status(customError.statusCode)
		.json({ msg: customError.msg, stack });
};

module.exports = errorHandler;
