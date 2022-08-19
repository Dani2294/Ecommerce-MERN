const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide a name"],
			minlength: 2,
		},
		email: {
			type: String,
			required: [true, "Please provide a email"],
			unique: true,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Please provide a valid email",
			],
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
			minLength: 6,
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
);

// We hash the password before document is save/created
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt); // 'this' refer to the current Document created, because we use 'function' instead of arrow function
});

// METHODS
// compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password);
	return isMatch;
};

// create Token
UserSchema.methods.createToken = async function () {
	return jwt.sign(
		{ userID: this._id, name: this.name },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_LIFETIME }
	);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
