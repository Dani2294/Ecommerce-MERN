import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ===== Async functions ===== */
export const loginUser = createAsyncThunk("user/loginUser", async ({ email, password }, thunkAPI) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const { data } = await axios.post(
			"/api/users/login",
			{
				email,
				password,
			},
			config
		);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const registerUser = createAsyncThunk("user/registerUser", async ({ name, email, password }, thunkAPI) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const { data } = await axios.post(
			"/api/users",
			{
				name,
				email,
				password,
			},
			config
		);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const getUserDetails = createAsyncThunk("user/userDetails", async (id, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.get(`/api/users/${id}`, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const getUserList = createAsyncThunk("user/userList", async (_, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.get(`/api/users`, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const deleteUser = createAsyncThunk("user/deleteUser", async (id, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.delete(`/api/users/${id}`, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const updateUserAdmin = createAsyncThunk("user/updateUserAdmin", async ({ id, isAdmin }, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.put(`/api/users/${id}`, { isAdmin: !isAdmin }, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

export const updateUserDetails = createAsyncThunk("user/updateUserDetails", async (user, thunkAPI) => {
	try {
		const loggedUserData = thunkAPI.getState().user.userInfo;
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${loggedUserData.token}`,
			},
		};
		const { data } = await axios.put("/api/users/profile", user, config);
		return data;
	} catch (error) {
		const msg = error.response.data.msg;
		console.log(msg);
		return thunkAPI.rejectWithValue(msg);
	}
});

/* ===== User Auth ===== */
const userInfoFromLS = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
const userInitialState = {
	isLoading: false,
	userInfo: userInfoFromLS,
};
export const userSlice = createSlice({
	name: "user",
	initialState: userInitialState,
	reducers: {
		logout: (state) => {
			state.userInfo = null;
			localStorage.setItem("userInfo", null);
		},
	},
	extraReducers: {
		/* ----- Log In ----- */
		[loginUser.pending]: (state) => {
			state.isLoading = true;
			state.userInfo = null;
		},
		[loginUser.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.userInfo = action.payload;
			state.error = null;
			localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
		},
		[loginUser.rejected]: (state, action) => {
			state.isLoading = false;
			state.userInfo = null;
			state.error = action.payload;
		},
		/* ----- Register ----- */
		[registerUser.pending]: (state) => {
			state.isLoading = true;
			state.userInfo = null;
		},
		[registerUser.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.userInfo = action.payload;
			state.error = null;
			localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
		},
		[registerUser.rejected]: (state, action) => {
			state.isLoading = false;
			state.userInfo = null;
			state.error = action.payload;
		},
		/* ----- Get user details ----- */
	},
});

/* ===== User Details ===== */
const userDetailsInitialState = {
	isLoading: false,
	user: null,
};
export const userDetailsSlice = createSlice({
	name: "userDetails",
	initialState: userDetailsInitialState,
	reducers: {
		resetUserDetails: (state) => {
			state.user = null;
		},
	},
	extraReducers: {
		/* ----- Get user details ----- */
		[getUserDetails.pending]: (state) => {
			state.isLoading = true;
			state.user = null;
			state.error = null;
		},
		[getUserDetails.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.user = action.payload;
		},
		[getUserDetails.rejected]: (state, action) => {
			state.isLoading = false;
			state.user = null;
			state.error = action.payload;
		},
		/* ----- Update user details ----- */
		[updateUserDetails.pending]: (state) => {
			state.isLoading = true;
			state.user = null;
		},
		[updateUserDetails.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.user = action.payload;
			state.success = true;
			state.error = null;
		},
		[updateUserDetails.rejected]: (state, action) => {
			state.isLoading = false;
			state.user = null;
			state.error = action.payload;
		},
	},
});

/* ===== User List ===== */
const userListInitialState = {
	isLoading: false,
	userList: [],
};
export const userListSlice = createSlice({
	name: "userList",
	initialState: userListInitialState,
	reducers: {},
	extraReducers: {
		/* ----- Get user list ----- */
		[getUserList.pending]: (state) => {
			state.isLoading = true;
		},
		[getUserList.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.userList = action.payload;
		},
		[getUserList.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
		/* ----- Delete user ----- */
		[deleteUser.pending]: (state) => {
			state.isLoading = true;
			state.successDelete = false;
		},
		[deleteUser.fulfilled]: (state) => {
			state.isLoading = false;
			state.successDelete = true;
		},
		[deleteUser.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
		/* ----- Update user admin ----- */
		[updateUserAdmin.pending]: (state) => {
			state.isLoading = true;
			state.successUpdate = false;
		},
		[updateUserAdmin.fulfilled]: (state) => {
			state.isLoading = false;
			state.successUpdate = true;
		},
		[updateUserAdmin.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});

export const { logout } = userSlice.actions;
export const { resetUserDetails } = userDetailsSlice.actions;
