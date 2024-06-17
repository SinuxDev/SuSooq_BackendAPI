const isAdmin = async (req, res, next) => {
  const UNAUTHORIZED_MESSAGE = "Unauthorized Admin Access";
  try {
    const { userId } = req;
    console.log(userId);
    next();
  } catch (err) {
    return res.status(401).json({
      isSuccess: false,
      message: UNAUTHORIZED_MESSAGE,
    });
  }
};

module.exports = isAdmin;
