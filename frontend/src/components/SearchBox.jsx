import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
	const [keyword, setKeyword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		if (keyword.trim()) {
			navigate(`/?search=${keyword}`);
		} else {
			navigate("/");
		}
	};

	return (
		<Form onSubmit={handleSubmit} className="d-flex">
			<Form.Control
				type="text"
				name="q"
				onChange={({ target }) => setKeyword(target.value)}
				placeholder="Search products..."
				className="me-sm-2 ms-sm-5"></Form.Control>
			<Button type="submit" variant="outline-success" className="p-2">
				Search
			</Button>
		</Form>
	);
};

export default SearchBox;
