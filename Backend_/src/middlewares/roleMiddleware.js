const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; 

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No user found.",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Access denied."
      });
    }

    next();
  };
};

export default allowRoles;
