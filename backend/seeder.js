const mongoose = require("mongoose");
require("dotenv").config();
const colors = require("colors");
const users = require("./data/users");
const products = require("./data/products");
const User = require("./models/userModel");
const Product = require("./models/productModel");
const Order = require("./models/orderModel");
const connectDB = require("./config/db");

connectDB();

// Import Data
const importData = async () => {
	try {
		// Reset all collections in DB
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();

		// insert sample users to DB
		const createdUsers = await User.insertMany(users); // return an array of users

		// Get the admin user
		const adminUser = createdUsers[0]._id;

		// assign the admin user id to all the asmple products
		const sampleProducts = products.map((product) => {
			return { ...product, user: adminUser };
		});

		// insert sample products to the DB
		await Product.insertMany(sampleProducts);

		console.log("Data Imported!".green.inverse);
		process.exit(0);
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

// Destroy Data
const destroyData = async () => {
	try {
		// Reset all collections in DB
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();

		console.log("Data Destroyed!".green.inverse);
		process.exit(0);
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

if (process.argv[2] === "-d") {
	destroyData();
} else {
	importData();
}
