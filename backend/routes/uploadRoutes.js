const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, "uploads/");
	},
	filename(req, file, cb) {
		cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
	},
});

function checkFileType(file, cb) {
	const fileTypes = /jpg|jpeg|png/;
	const extnameIsValid = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimetypeIsValid = fileTypes.test(file.mimetype);

	if (extnameIsValid && mimetypeIsValid) {
		return cb(null, true);
	} else {
		return cb("Images only!");
	}
}

const upload = multer({
	storage,
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
});

// Routes
router.post("/", upload.single("image"), (req, res) => {
	res.send(`/${req.file.path}`);
});

module.exports = router;
