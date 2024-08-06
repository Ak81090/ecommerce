import path from "path";
import express from "express";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetype = /jpg|jpeg|png/;
  const extname = filetype.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = filetype.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Image only!");
  }
}
const upload = multer({
  storage,
});

router.post("/", upload.single("image"), (req, res) => {
  req.send({
    message: "Image Uploaded",
    image: `$/{req.file.path}`,
  });
});

export default router;
