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
createJsonFile("memberships.json");

function readData(fileName) {
  const filePath = path.join(dataDir, fileName);
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function writeData(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "Exponential Community backend is running"
  });
});

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

app.post("/api/login", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required"
    });
  }

  const users = readData("users.json");
  const user = users.find((item) => item.email === email);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found. Please sign up first."
    });
  }

  res.json({
    success: true,
    message: "Login successful",
    user
  });
});

app.post("/api/book-meeting", (req, res) => {
  const { name, email, platform, preferredDate } = req.body;

  if (!name || !email || !platform) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and platform are required"
    });
  }

  const meetings = readData("meetings.json");

  const newMeeting = {
    id: Date.now(),
    name,
    email,
    platform,
    preferredDate: preferredDate || "Not selected",
    status: "pending",
    createdAt: new Date().toISOString()
  };

  meetings.push(newMeeting);
  writeData("meetings.json", meetings);

  res.json({
    success: true,
    message: "Meeting booked successfully",
    meeting: newMeeting
  });
});

app.post("/api/membership", (req, res) => {
  const { name, email, plan } = req.body;

  if (!name || !email || !plan) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and plan are required"
    });
  }

  const memberships = readData("memberships.json");

  const newMembership = {
    id: Date.now(),
    name,
    email,
    plan,
    createdAt: new Date().toISOString()
  };

  memberships.push(newMembership);
  writeData("memberships.json", memberships);

  res.json({
    success: true,
    message: "Membership selected successfully",
    membership: newMembership
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});