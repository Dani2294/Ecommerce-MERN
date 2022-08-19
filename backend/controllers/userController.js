const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError, NotFoundError } = require("../errors");

// @desc Auth the user and get the token
// @route GET /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// check if credentials are set
	if (!email || !password) {
		throw new BadRequestError("Please provide an email and password");
	}

	// get the user with that email
	const user = await User.findOne({ email });

	// check if user with that email exists
	if (!user) {
		throw new UnauthenticatedError("This user email does not exists");
	}

	// compare the password enter
	const isPasswordValid = await user.comparePassword(password);
	if (!isPasswordValid) {
		throw new UnauthenticatedError("Password is invalid");
	}

	// generate token
	const token = await user.createToken();

	// data to return
	const data = {
		_id: user._id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin,
		token: token,
	};

	res.status(StatusCodes.OK).json({ ...data });
});

// @desc Register a new user
// @route GET /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	// ----- OTHER OPTIONAL SECURITY ----- //
	/*     
	// check if credentials are set
	if (!name || !email || !password) {
		throw new BadRequestError("Please provide a name, email and password");
	}

	// check if user already exists
	const userExists = await User.findOne({ email });
	if (!userExists) {
		throw new BadRequestError("This email address already exists");
	}
    */
	// ----- OTHER OPTIONAL SECURITY ----- //

	// create a new user
	const user = await User.create({ name, email, password });

	// generate token
	const token = await user.createToken();

	// data to return
	const data = {
		_id: user._id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin,
		token: token,
	};

	res.status(StatusCodes.CREATED).json({ ...data });
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
	// get the user by id
	//const user = await User.findById(req.user._id);

	// get the user from the request object
	const user = req.user;

	res.status(StatusCodes.OK).json({
		_id: user._id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin,
	});
});

// @desc Update user profile
// @route POST /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
	// get the user by id
	//const user = await User.findById(req.user._id);

	// get the user from the request object
	const user = req.user;

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.status(StatusCodes.OK).json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		throw new NotFoundError("user not found");
	}
});

// ========== ADMIN ========== //

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	res.status(StatusCodes.OK).json(users);
});

// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		throw new NotFoundError("User not found");
	}

	await user.remove();
	res.status(StatusCodes.OK).json({ message: "User has been removed" });
});

// @desc Update user admin
// @route DELETE /api/users/:id
// @access Private/Admin
const updateUserAdmin = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		throw new NotFoundError("User not found");
	}

	user.isAdmin = req.body.isAdmin;

	const updatedUser = await user.save();
	res.status(StatusCodes.OK).json({ message: "User has been updated" });
});

module.exports = { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, updateUserAdmin };
