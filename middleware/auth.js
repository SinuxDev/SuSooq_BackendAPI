const jwt = require("jsonwebtoken");

const authorize = async (req, res, next) => {
  const UNAUTHORIZED_MESSAGE = "Unauthorized";

  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        isSuccess: false,
        message: UNAUTHORIZED_MESSAGE,
      });
    }

    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        isSuccess: false,
        message: UNAUTHORIZED_MESSAGE,
      });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({
        isSuccess: false,
        message: UNAUTHORIZED_MESSAGE,
      });
    }

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(401).json({
      isSuccess: false,
      message: UNAUTHORIZED_MESSAGE,
    });
  }
};

const extractToken = (authHeader) => {
  const tokenArray = authHeader.split(" ");

  return tokenArray.length === 2 ? tokenArray[1] : null;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_TOKEN_KEY);
  } catch (err) {
    return null;
  }
};

module.exports = authorize;
