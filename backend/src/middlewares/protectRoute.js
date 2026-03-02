import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    // 1. Get the userId from the auth object populated by clerkMiddleware in server.js
    const clerkId = req.auth?.userId;

    // 2. If no valid token, strictly return a 401 JSON error (NO REDIRECTS)
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized - missing or invalid token" });
    }

    // 3. Find user in db by clerk ID
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Attach user to req and continue
    req.user = user;
    next();
    
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};