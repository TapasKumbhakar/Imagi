import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  try {
    // Get token from "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Login Again" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Login Again" });
    }

    req.userId = decoded.id;
    req.user = await userModel.findById(decoded.id); // Attach user object
    next();
  } catch (error) {
    console.error("Error in userAuth middleware:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or Expired Token" });
  }
};

export default userAuth;
