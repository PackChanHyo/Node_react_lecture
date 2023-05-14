const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const dotenv = require("dotenv");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB 성공"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/user/register", async (req, res) => {
  // 회원 가입에 필요한 정보를 client에서 가져와서 DB에 넣어준다.

  const user = new User(req.body);

  const reuslt = await user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

app.post("/api/user/login", (req, res) => {
  // 요청된 이메일을 데이터베이스 찾기
  User.findOne({ email: req.body.email })
    .then((docs) => {
      if (!docs) {
        return res.json({
          loginSuccess: false,
          messsage: "제공된 이메일에 해당하는 유저가 없습니다.",
        });
      }
      docs.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({
            loginSuccess: false,
            messsage: "비밀번호가 틀렸습니다.",
          });
        // Password가 일치하다면 토큰 생성
        docs.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
          // 토큰을 저장
          res
            .cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
        });
      });
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
