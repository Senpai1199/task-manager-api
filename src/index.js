const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

app.use(express.json()); // parse incoming JSON

app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT;

// const multer = require("multer");
// const upload = multer({
//   dest: "images",
//   limits: {
//     fileSize: 1000000, // 1MB
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       cb(new Error("File must be a Word document"));
//     }
//     cb(undefined, true);
//     // cb(new Error("File must be a PDF"))
//     // cb(undefined, true)
//     // cb(undefined, false)
//   },
// });

// app.post(
//   "/upload",
//   upload.single("upload"),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

app.listen(port, () => {
  console.log("Server up on port: ", port);
});

// const Task = require("./models/task");
// const User = require("./models/user");
