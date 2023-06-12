const express = require("express");
const multer = require("multer");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: "3309",
  password: "",
  database: "vuedb",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected successfully to MySql server");
});

const app = express();
app.use(express.static("public"));
app.use("/uploads", express.static("public/uploads"));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  stroage: storage,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/upload", upload.array("upload"), (req, res) => {
  res.send("Files uploaded successfully!");
});
app.post("/device", (req, res) => {
  // console.log(req);
  // console.log(req.body);

  const { device_name, description, device_id } = req.body;
  const sql = `INSERT INTO device_info(name, description, device_id) VALUES(?, ?, ?)`;

  if (req.body.device_name == undefined || req.body.device_name == "") {
    res.send("Sorry, Plz name");
    return;
  }
  connection.query(
    sql,
    [device_name, description, device_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log("1 record inserted");
      res.send("Device added successfully!");
    }
  );
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
