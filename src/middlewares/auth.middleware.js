const jwt = require("jsonwebtoken");

async function tokenVerify(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

    req.user = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { tokenVerify };
