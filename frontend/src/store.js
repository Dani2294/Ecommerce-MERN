import { configureStore } from "@reduxjs/toolkit";
import {
	createProductReviewSlice,
	productCreateSlice,
	productDetailsSlice,
	productsListSlice,
	productsTopRatedSlice,
	productUpdateSlice,
} from "./reducers/productReducers";
import { cartSlice } from "./reducers/cartReducers";
import { userDetailsSlice, userListSlice, userSlice } from "./reducers/userReducers";
import {
	myOrderListSlice,
	orderCreateSlice,
	orderDeliveredSlice,
	orderDetailsSlice,
	orderListSlice,
	orderPaySlice,
} from "./reducers/orderReducers";

export const store = configureStore({
	reducer: {
		productList: productsListSlice.reducer,
		productDetails: productDetailsSlice.reducer,
		productCreate: productCreateSlice.reducer,
		productUpdate: productUpdateSlice.reducer,
		createProductReview: createProductReviewSlice.reducer,
		productsTopRated: productsTopRatedSlice.reducer,
		cart: cartSlice.reducer,
		user: userSlice.reducer,
		userDetails: userDetailsSlice.reducer,
		userList: userListSlice.reducer,
		order: orderCreateSlice.reducer,
		orderList: orderListSlice.reducer,
		orderDetails: orderDetailsSlice.reducer,
		payOrder: orderPaySlice.reducer,
		orderDelivered: orderDeliveredSlice.reducer,
		myOrders: myOrderListSlice.reducer,
	},
});
