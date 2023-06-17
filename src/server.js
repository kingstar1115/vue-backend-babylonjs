const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const DB_CONFIG = require("./config/config.js");
const connection = mysql.createConnection(DB_CONFIG);

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected successfully to MySql server");
});

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",

    methods: ["GET", "POST"],

    allowedHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
  })
);

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

var router = express.Router();
const upload = multer({ storage: storage });

app.get("/downloads/", (req, res) => {
  console.log(req.query.filename);
  const file = `${__dirname}/../public/uploads/${req.query.filename}`;

  res.download(file, "map.glb");
});

app.post("/upload", upload.array("upload"), (req, res) => {
  const fileNames = req.files.map((file) => file.filename);

  const sql0 = "TRUNCATE TABLE device_info";
  const sql1 = `INSERT INTO map(name) VALUES (?)`;
  const sql2 = `INSERT INTO device_info(name) VALUES ?`;
  const values = [fileNames.map((name) => [name])];
  const mid_value = values[0];
  const first_value = mid_value[0];
  mid_value.shift(1);

  connection.query(sql0, [], (err, data) => {
    if (err) throw err;
    connection.query(sql1, [first_value], (err, results) => {
      if (err) throw err;
      connection.query(sql2, [mid_value], (err, results) => {
        if (err) throw err;

        console.log("File names saved");
        res.send({ data: "OK" });
      });
    });
  });
  // console.log("res------------------------------", values[0][0]);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/get_data", async (req, res) => {
  try {
    const [d_map, devices] = await Promise.all([getMap(), getAllDevice()]);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({ d_map, devices });
  } catch (error) {
    console.log(error);
    throw error;
    res.status(500).send("Error retrieving data from database");
  }
});

function getMap() {
  return new Promise((resolve, reject) => {
    // Code to retrieve all books from the database
    // ...
    connection.query(
      "SELECT name FROM map ORDER BY id DESC LIMIT 1;",
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function getAllDevice() {
  return new Promise((resolve, reject) => {
    // Code to retrieve all books from the database
    // ...
    connection.query("SELECT name FROM device_info", (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

app.listen(3000, () => {
  console.log(DB_CONFIG);
  console.log("Server started on port 3000");
});
