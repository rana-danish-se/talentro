const setCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", 
    path: "/",
  };
  res.cookie("token", token, cookieOptions);
};

export default setCookie;