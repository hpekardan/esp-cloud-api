//console.log("ESP Cloud API çalışıyor");
//https://esp-cloud-api-production.up.railway.app/
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// 🟢 POST ile veri güncelleme endpoint’i
app.post("/update", (req, res) => {
  const incoming = req.body;
  if (!incoming.mac) return res.status(400).send("MAC eksik");

  const filePath = path.join(__dirname, "data.json");
  fs.readFile(filePath, "utf8", (err, rawData) => {
    let devices = [];
    try {
      devices = JSON.parse(rawData || "[]");
    } catch {}

    // Aynı MAC varsa güncelle, yoksa ekle
    const index = devices.findIndex(d => d.mac === incoming.mac);
    if (index !== -1) {
      devices[index] = { ...devices[index], ...incoming };
    } else {
      devices.push(incoming);
    }

    fs.writeFile(filePath, JSON.stringify(devices, null, 2), (err) => {
      if (err) {
        console.error("Yazma hatası:", err);
        return res.status(500).send("Yazılamadı");
      }
      res.send("Veri güncellendi");
    });
  });
});

// 🔄 GET /status endpoint'i (React buradan veri çekiyor)
app.get("/status", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, rawData) => {
    if (err) {
      console.error("Veri okuma hatası:", err);
      return res.status(500).send("Veri okunamadı");
    }

    try {
      const data = JSON.parse(rawData || "[]");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(data);
    } catch (parseErr) {
      console.error("Veri bozuk:", parseErr);
      res.status(500).send("Veri bozuk");
    }
  });
});