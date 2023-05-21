import express from "express";
import multer from "multer";
import mongoose from "mongoose";

const dbUser = process.env.DB_USERNAME || "test-genth-deployment";
const dbPass = process.env.DB_PASSWORD || "XqwUoGZ7l8R74Azl";
const dbName = process.env.DB_NAME || "genth";

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPass}@test-genth-deployment-2.6kpqqmu.mongodb.net/${dbName}`
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const upload = multer({ dest: "uploads/" });
const webServer = express();

webServer.get("/", (request, response) => {
  response.send("This is main route!");
});

webServer.post("/upload", upload.single("file"), (request, response) => {
  response.status(201).send({
    path: request.file.path,
  });
});

webServer.get("/users", async (request, response) => {
  try {
    const users = await db.collection("User").find({});
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

webServer.listen(process.env.PORT || 3000, () => {
  console.log(`SERVER: http://127.0.0.1/${process.env.PORT || 3000}`);
});
