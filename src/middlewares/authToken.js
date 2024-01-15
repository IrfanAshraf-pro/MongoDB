const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY; // Same key used for token signing
module.exports.authenticateToken=(req, res, next) =>{
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(200).json({
      message: "Token Not Provided",
      statusCode: 401,
      data: {},
  });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
     
      return res.status(200).json({
        message: "Auth failed",
        statusCode: 402,
        data: {},
    }); // Forbidden
    }
    req.userId = decoded.userId; // Make the decoded token data available to route handlers
    next();
  });
}

