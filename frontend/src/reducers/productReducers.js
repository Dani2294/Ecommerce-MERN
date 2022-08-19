import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ===== Async functions ===== */
export const getProductsList = createAsyncThunk(
	"product/getProductsList",
	async ({ keyword = "", page = "" }, thunkAPI) => {
		try {
			const { data } = await axios.get(`/api/products?keyword=${keyword}&page=${page}`);
			return data;
		} catch (error) {
			const msg = error.response.data.msg;
			console.log(msg);
			return thunkAPI.rejectWithValue(msg);
		}
	}
);

export const getProductDetails = createAsyncThunk("product/getProductDetails", async (productID, thunkAPI) => {
	try {
		const { data } = await axios.get(`/api/products/${productID}`);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const createProduct = createAsyncThunk("product/createProduct", async (_, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.post("/api/products", {}, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const updateProduct = createAsyncThunk("product/updateProduct", async (product, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.put(`/api/products/${product._id}`, product, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const deleteProduct = createAsyncThunk("product/deleteProduct", async (id, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.delete(`/api/products/${id}`, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const createReview = createAsyncThunk("product/createReview", async ({ id, rating, comment }, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.post(`/api/products/${id}/reviews`, { rating, comment }, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const getTopRatedProducts = createAsyncThunk("product/getTopRatedProducts", async (_, thunkAPI) => {
	try {
		const { data } = await axios.get("/api/products/top");
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

/* ===== Product Create  ===== */
const productCreateState = {
	product: null,
	isLoading: true,
};
export const productCreateSlice = createSlice({
	name: "productCreate",
	initialState: productCreateState,
	reducers: {
		resetProductCreateState: (state) => {
			state.successCreated = false;
		},
	},
	extraReducers: {
		/* Create Product */
		[createProduct.pending]: (state) => {
			state.isLoading = true;
			state.successCreated = false;
		},
		[createProduct.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.product = action.payload;
			state.successCreated = true;
		},
		[createProduct.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});

/* ===== Product Update  ===== */
const productUpdateState = {
	product: null,
	isLoading: false,
	error: null,
};
export const productUpdateSlice = createSlice({
	name: "productUpdate",
	initialState: productUpdateState,
	reducers: {
		resetProductUpdateState: (state) => {
			state.successUpdated = false;
		},
	},
	extraReducers: {
		/* Update Product */
		[updateProduct.pending]: (state) => {
			state.isLoading = true;
			state.successUpdated = false;
		},
		[updateProduct.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.product = action.payload;
			state.successUpdated = true;
		},
		[updateProduct.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});

/* ===== Product List  ===== */
const productsListState = {
	productList: [],
	isLoading: true,
};
export const productsListSlice = createSlice({
	name: "productsList",
	initialState: productsListState,
	reducers: {},
	extraReducers: {
		/* ----- Product List ----- */
		[getProductsList.pending]: (state) => {
			state.isLoading = true;
			state.productList = [];
		},
		[getProductsList.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.productList = action.payload.products;
			state.pages = action.payload.pages;
			state.page = action.payload.page;
		},
		[getProductsList.rejected]: (state, action) => {
			state.isLoading = false;
			state.productList = [];
			state.error = action.payload;
		},
		/* Delete Product */
		[deleteProduct.pending]: (state) => {
			state.isLoading = true;
			state.successDelete = false;
		},
		[deleteProduct.fulfilled]: (state) => {
			state.isLoading = false;
			state.successDelete = true;
		},
		[deleteProduct.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});

/* ===== Product Details ===== */
const productDetailsState = {
	productData: { reviews: [] },
	isLoading: false,
};
export const productDetailsSlice = createSlice({
	name: "productDetails",
	initialState: productDetailsState,
	reducers: {},
	extraReducers: {
		[getProductDetails.pending]: (state) => {
			state.isLoading = true;
			state.productData = { reviews: [] };
		},
		[getProductDetails.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.productData = action.payload;
		},
		[getProductDetails.rejected]: (state, action) => {
			state.isLoading = false;
			state.productData = { reviews: [] };
			state.error = action.payload;
		},
	},
});

/* ===== Create Product Review ===== */
const createProductReviewState = {
	success: false,
	isLoading: false,
};
export const createProductReviewSlice = createSlice({
	name: "createProductReview",
	initialState: createProductReviewState,
	reducers: {
		resetReviewCreateState: (state) => {
			state.success = false;
		},
	},
	extraReducers: {
		[createReview.pending]: (state) => {
			state.isLoading = true;
			state.success = false;
		},
		[createReview.fulfilled]: (state) => {
			state.isLoading = false;
			state.success = true;
		},
		[createReview.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});

/* ===== Products Top Rated ===== */
const productsTopRatedState = {
	products: [],
	isLoading: false,
};
export const productsTopRatedSlice = createSlice({
	name: "productsTopRated",
	initialState: productsTopRatedState,
	reducers: {},
	extraReducers: {
		[getTopRatedProducts.pending]: (state) => {
			state.isLoading = true;
			state.productData = [];
		},
		[getTopRatedProducts.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.products = action.payload;
		},
		[getTopRatedProducts.rejected]: (state, action) => {
			state.isLoading = false;
			state.products = [];
			state.error = action.payload;
		},
	},
});

/* ========== ACTIONS ========== */
export const { resetProductCreateState } = productCreateSlice.actions;
export const { resetProductUpdateState } = productUpdateSlice.actions;
export const { resetReviewCreateState } = createProductReviewSlice.actions;
