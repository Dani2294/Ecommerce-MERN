import React from "react";
import PropTypes from "prop-types";

const Rating = ({ value, reviews, color }) => {
	return (
		<div className="rating">
			{/* ----- Star ----- */}
			<span>
				<i
					style={{ color }}
					className={value >= 1 ? "fas fa-star" : value >= 0.5 ? "fas fa-star-half-alt" : "far fa-star"}></i>
			</span>
			{/* ----- Star End ----- */}

			{/* ----- Star ----- */}
			<span>
				<i
					style={{ color }}
					className={value >= 2 ? "fas fa-star" : value >= 1.5 ? "fas fa-star-half-alt" : "far fa-star"}></i>
			</span>
			{/* ----- Star End ----- */}

			{/* ----- Star ----- */}
			<span>
				<i
					style={{ color }}
					className={value >= 3 ? "fas fa-star" : value >= 2.5 ? "fas fa-star-half-alt" : "far fa-star"}></i>
			</span>
			{/* ----- Star End ----- */}

			{/* ----- Star ----- */}
			<span>
				<i
					style={{ color }}
					className={value >= 4 ? "fas fa-star" : value >= 3.5 ? "fas fa-star-half-alt" : "far fa-star"}></i>
			</span>
			{/* ----- Star End ----- */}

			{/* ----- Star ----- */}
			<span>
				<i
					style={{ color }}
					className={value >= 5 ? "fas fa-star" : value >= 4.5 ? "fas fa-star-half-alt" : "far fa-star"}></i>
			</span>
			{/* ----- Star End ----- */}
			<span className="ms-2">{reviews && `${reviews}`} reviews</span>
		</div>
	);
};

Rating.defaultProps = {
	color: "#f8e825",
};

Rating.propTypes = {
	value: PropTypes.number,
	reviews: PropTypes.number,
	color: PropTypes.string,
};

export default Rating;
