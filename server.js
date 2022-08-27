require("dotenv").config({ path: "./config.env" });
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(fileUpload());
app.use("/api/create-event", require("./api/create-event"));
app.use("/api/posts", require("./api/posts"));
app.use("/api/upload", require("./api/upload"));

app.listen(PORT, () => {
  console.log("Server started on port: " + PORT);
});
