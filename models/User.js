const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    mixlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  // 비밀번호를 암호화
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, async function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  const user = this;

  const token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user
    .save()
    .then(() => {
      cb(null, user);
    })
    .catch((err) => {
      cb(err);
    });
};

userSchema.methods.findByToken = async function (token, cb) {
  const user = this;

  jwt.verify(token, "secretToken", async function (err, decoded) {
    // 유저 아이디를 이용하여 찾고 클라이언트에서 가져온 token과 DB에 저장된 토큰 확인
    user.findOne(
      { _id: decoded, token: token }
        .then(() => {
          cb(null, user);
        })
        .catch((err) => cb(err))
    );
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
