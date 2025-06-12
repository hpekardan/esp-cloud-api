//console.log("ESP Cloud API çalışıyor");
//https://esp-cloud-api-production.up.railway.app/
/* const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basit test endpoint
app.get("/", (req, res) => {
  res.send("ESP Cloud API çalışıyor 🚀");
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
*/
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("ESP Cloud API çalışıyor 🚀");
});

app.get("/status", (req, res) => {
  const filePath = path.join(__dirname, "data.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Veri okunamadı:", err);
      return res.status(500).send("Sunucu hatası");
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseError) {
      res.status(500).send("Geçersiz JSON");
    }
  });
});

app.listen(PORT, () => {
  console.log(`ESP Cloud API ${PORT} portunda çalışıyor 🚀`);
});
