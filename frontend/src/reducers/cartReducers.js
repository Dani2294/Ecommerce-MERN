import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCart = createAsyncThunk("cart/addToCart", async ({ productID, qty }, thunkAPI) => {
	try {
		const { data } = await axios.get(`/api/products/${productID}`);
		const payload = {
			product: data._id,
			name: data.name,
			image: data.image,
			price: data.price,
			countInStock: data.countInStock,
			qty,
		};
		thunkAPI.dispatch(cartSlice.actions.addItem(payload));
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

const cartItemsFromLS = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];
const shippingAddressFromLS = localStorage.getItem("shippingAddress")
	? JSON.parse(localStorage.getItem("shippingAddress"))
	: {};
const paymentMethodFromLS = localStorage.getItem("paymentMethod")
	? JSON.parse(localStorage.getItem("paymentMethod"))
	: "";
const initialState = {
	cartItems: cartItemsFromLS,
	shippingAddress: shippingAddressFromLS,
	paymentMethod: paymentMethodFromLS,
};
export const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addItem: (state, action) => {
			const item = action.payload;

			const itemExists = state.cartItems.find((x) => x.product === item.product);

			if (itemExists) {
				state.cartItems = state.cartItems.map((x) => (x.product === itemExists.product ? item : x));
			} else {
				state.cartItems = [...state.cartItems, item];
			}
		},
		removeItem: (state, action) => {
			const productID = action.payload;

			state.cartItems = state.cartItems.filter((x) => x.product !== productID);
			localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
		},
		saveShippingAddress: (state, action) => {
			state.shippingAddress = action.payload;
			localStorage.setItem("shippingAddress", JSON.stringify(state.shippingAddress));
		},
		savePaymentMethod: (state, action) => {
			state.paymentMethod = action.payload;
			localStorage.setItem("paymentMethod", JSON.stringify(state.paymentMethod));
		},
		emptyCart: (state) => {
			state.cartItems = [];
			localStorage.removeItem("cartItems");
			localStorage.removeItem("shippingAddress");
			localStorage.removeItem("paymentMethod");
		},
	},
	extraReducers: {
		[addToCart.pending]: (state) => {},
		[addToCart.fulfilled]: (state, action) => {
			localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
		},
		[addToCart.rejected]: (state, action) => {
			state.error = action.payload;
		},
	},
});

export const { addItem, removeItem, saveShippingAddress, savePaymentMethod, emptyCart } = cartSlice.actions;
