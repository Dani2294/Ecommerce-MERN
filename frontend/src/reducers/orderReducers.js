import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ===== Async functions ===== */

export const createOrder = createAsyncThunk("order/createOrder", async (order, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.post(`/api/orders`, order, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const getOrderDetails = createAsyncThunk("order/getOrderDetails", async (id, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.get(`/api/orders/${id}`, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const getUserOrderList = createAsyncThunk("order/getUserOrderList", async (_, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.get(`/api/orders/myorders`, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const getOrderList = createAsyncThunk("order/getOrderList", async (_, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.get(`/api/orders`, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const payOrder = createAsyncThunk("order/payOrder", async ({ orderID, payementResult }, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.put(`/api/orders/${orderID}/pay`, payementResult, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const deliverOrder = createAsyncThunk("order/deliverOrder", async (orderID, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.put(`/api/orders/${orderID}/delivered`, {}, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const payOrderWithStripe = createAsyncThunk("order/payOrderWithStripe", async (cartItems, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};

		const payload = cartItems.map((item) => {
			return {
				id: item.product,
				name: item.name,
				image: item.image,
				price: item.price,
				quantity: item.qty,
			};
		});

		const { data } = await axios.post(
			`/api/orders/pay`,
			JSON.stringify({ cartItems: payload, customer_email: loggedUserData.email }),
			config
		);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

/* ===== Order Create ===== */
const orderCreateInitialState = {
	isLoading: false,
	order: {},
};
export const orderCreateSlice = createSlice({
	name: "orderCreate",
	initialState: orderCreateInitialState,
	reducers: {},
	extraReducers: {
		/* ----- Create order ----- */
		[createOrder.pending]: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		[createOrder.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.order = action.payload;
			state.success = true;
		},
		[createOrder.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});

/* ===== Order Details ===== */
const orderDetailsInitialState = {
	isLoading: true,
	orderDetails: null,
};
export const orderDetailsSlice = createSlice({
	name: "orderDetails",
	initialState: orderDetailsInitialState,
	reducers: {},
	extraReducers: {
		/* ----- Create order ----- */
		[getOrderDetails.pending]: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		[getOrderDetails.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.orderDetails = action.payload;
		},
		[getOrderDetails.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});

/* ===== Order Pay ===== */
const orderPayInitialState = {};
export const orderPaySlice = createSlice({
	name: "orderPay",
	initialState: orderPayInitialState,
	reducers: {},
	extraReducers: {
		/* ----- Pay order ----- */
		[payOrder.pending]: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		[payOrder.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.success = true;
		},
		[payOrder.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
		/* ----- Pay order with stripe ----- */
		[payOrderWithStripe.pending]: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		[payOrderWithStripe.fulfilled]: (state, action) => {
			state.isLoading = false;
			window.location.href = action.payload.url;
		},
		[payOrderWithStripe.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});

/* ===== Order Delivered ===== */
const orderDeliveredInitialState = {};
export const orderDeliveredSlice = createSlice({
	name: "orderDelivered",
	initialState: orderDeliveredInitialState,
	reducers: {},
	extraReducers: {
		/* ----- Deliver order ----- */
		[deliverOrder.pending]: (state) => {
			state.isLoading = true;
			state.error = null;
			state.success = false;
		},
		[deliverOrder.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.success = true;
		},
		[deliverOrder.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});

/* ===== Logged in User Order List ===== */
const myOrderListInitialState = {
	isLoading: true,
	myOrders: [],
};
export const myOrderListSlice = createSlice({
	name: "myOrderList",
	initialState: myOrderListInitialState,
	reducers: {},
	extraReducers: {
		/* ----- Get user order list ----- */
		[getUserOrderList.pending]: (state) => {
			state.isLoading = true;
		},
		[getUserOrderList.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.myOrders = action.payload;
		},
		[getUserOrderList.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});

/* ===== All Order List ===== */
const orderListInitialState = {
	isLoading: true,
	orders: [],
};
export const orderListSlice = createSlice({
	name: "orderList",
	initialState: orderListInitialState,
	reducers: {},
	extraReducers: {
		/* ----- Get orders list ----- */
		[getOrderList.pending]: (state) => {
			state.isLoading = true;
		},
		[getOrderList.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.orders = action.payload;
		},
		[getOrderList.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});
