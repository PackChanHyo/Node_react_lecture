const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://cksgy1510:QMKSfFhwyMhmLYC9@cluster0.awm4zxg.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB 성공"))
  .catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
