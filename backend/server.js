require("dotenv").config();
const colors = require("colors");
const path = require("path");
const express = require("express");
const app = express();
const morgan = require("morgan");
const connectDB = require("./config/db");
connectDB();

const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const orderRouter = require("./routes/orderRoutes");
const uploadRouter = require("./routes/uploadRoutes");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

app.get("/api/config/paypal", (req, res) => res.send(process.env.PAYPAL_CLIENT_ID_KEY));

const __root_dirname = path.resolve();
app.use("/uploads", express.static(__root_dirname + "/uploads"));

if (process.env.NODE_ENV === "production") {
	app.use(express.static(__root_dirname + "/frontend/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
	});
} else {
	app.get("/", (req, res) => {
		res.send("API is running");
	});
}

// error handlers
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
