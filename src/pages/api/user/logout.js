export default function logoutUser(req, res) {
    try {
      console.log("Starting user logout process...");
      console.log("NODE_ENV:", process.env.NODE_ENV);
  
      const secure = process.env.NODE_ENV === "production" ? "Secure" : "";
      console.log("Secure value:", secure);
  
      const cookieHeader = `authToken=; HttpOnly; Path=/; Max-Age=0; ${secure}; SameSite=Strict`;
      console.log("Set-Cookie header:", cookieHeader);
  
      res.setHeader("Set-Cookie", cookieHeader);
  
      console.log("Cookie header set successfully");
      res.status(200).json({ message: "Logout Successful" });
    } catch (error) {
      console.error("Logout Error:", error);
      res.status(500).json({ error: "Server Error", details: error.message });
    }
  }