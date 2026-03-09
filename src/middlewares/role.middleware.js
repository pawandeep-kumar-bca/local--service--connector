function roleBased(...allowedRoles) {
  
    return function(req, res, next) {
    try {
      const role = req.user.role;

      if (!role || !allowedRoles.includes(role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error("Role based error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = roleBased