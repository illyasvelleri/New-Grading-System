import cookie from "cookie";

export default function logoutAdmin(req, res) {
  try {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("authToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0), // Immediately expire the cookie
      })
    );

    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
}