const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const dataDir = path.join(__dirname, "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

function createJsonFile(fileName) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }
}

createJsonFile("users.json");
createJsonFile("meetings.json");
createJsonFile("messages.json");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "Exponential Community backend is running"
  });
});

function readData(fileName) {
  const filePath = path.join(dataDir, fileName);
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function writeData(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.post("/api/signup", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required"
    });
  }

  const users = readData("users.json");

  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData("users.json", users);

  res.json({
    success: true,
    message: "User signed up successfully",
    user: newUser
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});