import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.json({
        success: false,
        message: "not authorized login again",
      });
    }

    const tokenDecode = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    if (tokenDecode.id) {
      req.user = { userId: tokenDecode.id };
    } else {
      return res.json({ success: false, message: tokenDecode.error });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;
