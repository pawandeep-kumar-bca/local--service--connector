const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profileImage") {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Profile image must be jpg or png"), false);
    }
  } else if (
    file.fieldname === "aadharCard" ||
    file.fieldname === "certificate"
  ) {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Documents must be jpg, png or pdf"), false);
    }
  } else {
    cb(new Error("Invalid file field"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

module.exports = upload;
