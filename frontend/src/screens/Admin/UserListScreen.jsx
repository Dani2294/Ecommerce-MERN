import React, { useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { deleteUser, getUserList, updateUserAdmin } from "../../reducers/userReducers";

const UserListScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		isLoading: userListLoading,
		error: userListError,
		userList,
		successDelete,
		successUpdate,
	} = useSelector((store) => store.userList);
	const { userInfo } = useSelector((store) => store.user);

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(getUserList());
		} else {
			navigate("/login");
		}
	}, [dispatch, navigate, userInfo, successDelete, successUpdate]);

	const handleAdmin = (id, isAdmin) => {
		dispatch(updateUserAdmin({ id, isAdmin }));
	};

	const handleDeleteUser = (id) => {
		const confirmDelete = window.confirm("Are you sure you want to delete this user?");
		if (confirmDelete) {
			dispatch(deleteUser(id));
		}
	};

	return (
		<>
			<h1>Users</h1>
			{successDelete && <Message variant="success">User has been removed successfully</Message>}
			{userListLoading ? (
				<Loader />
			) : userListError ? (
				<Message variant="danger">{userListError}</Message>
			) : (
				<Table striped bordered hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>NAME</th>
							<th>EMAIL</th>
							<th>ADMIN</th>
							<th>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{userList.map((user) => (
							<tr key={user._id}>
								<td>{user._id}</td>
								<td>{user.name}</td>
								<td>
									<a href={`mailto:${user.email}`}>{user.email}</a>
								</td>
								<td>
									{user.isAdmin ? (
										<i className="fas fa-check" style={{ color: "green" }}></i>
									) : (
										<i className="fas fa-times" style={{ color: "red" }}></i>
									)}
								</td>
								<td>
									<Button
										variant={user.isAdmin ? "success" : "dark"}
										className="btn-sm me-2"
										onClick={() => handleAdmin(user._id, user.isAdmin)}>
										{user.isAdmin ? "Unmake" : "Make"} admin
									</Button>
									<Button variant="danger" className="btn-sm" onClick={() => handleDeleteUser(user._id)}>
										<i className="fas fa-trash"></i>
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default UserListScreen;
