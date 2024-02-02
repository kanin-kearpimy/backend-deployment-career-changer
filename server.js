import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const dbUser = process.env.DB_USERNAME;
const dbPass = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

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
webServer.use(cors());

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
  console.log("SERVER IS RUNNING!");
});
