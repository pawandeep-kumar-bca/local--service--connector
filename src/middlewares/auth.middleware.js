const jwt = require("jsonwebtoken");

async function tokenVerify(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parts = token.split(" ");

    if (parts.length < 2) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tokenExists = parts[1];

    const decoded = jwt.verify(tokenExists, process.env.JWT_ACCESS_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { tokenVerify };