import { Alert } from "react-bootstrap";
import PropTypes from "prop-types";

function Message({ variant, children }) {
	return <Alert variant={variant}>{children}</Alert>;
}

Message.defaultProps = {
	variant: "info",
};

Message.propTypes = {
	variant: PropTypes.string,
};

export default Message;
