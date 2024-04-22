import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;

  //checks if we have token or not
  if (!token) {
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }

  // if we have token
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log("Error");
    res.json({ success: false, message: "Error" });
  }
};

export default authMiddleware;
