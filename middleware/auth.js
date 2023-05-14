const { User } = require("../models/User");

const auth = async (req, res, next) => {
  // 인증 처리를 하는곳

  // 클라이언트 쿠키에서 토큰을 가져온다.
  const token = req.cookies.x_auth;

  // 토큰을 복호화 한후 유저 찾기
  User.findbyToken(token, async (err, user) => {
    if (err) throw err;
    if (!user) return await res.json({ isAuth: false, error: true });
  });

  req.token = token;
  req.user = user;
  next();
  // 유저가 있으면 인증 Ok 없으면 인증 No
};

module.exports = { auth };
