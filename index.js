//console.log("ESP Cloud API çalışıyor");
//https://esp-cloud-api-production.up.railway.app/
/*
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
*/
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Veriler bu dosyada tutulacak
const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.json());
app.use(cors()); // CORS tüm isteklere açık (React için gerekli)

// -----------------------------------------------------
// 📥 POST /update → ESP cihazı verileri buraya yollar
// -----------------------------------------------------
app.post("/update", (req, res) => {
  const { mac, temp, hum, analog } = req.body;

  if (!mac || temp === undefined || hum === undefined || analog === undefined) {
    return res.status(400).send("Eksik veri");
  }

  // Eski veriyi oku
  fs.readFile(DATA_FILE, "utf8", (err, rawData) => {
    let data = [];
    if (!err && rawData) {
      try {
        data = JSON.parse(rawData);
      } catch (parseErr) {
        console.error("JSON parse hatası:", parseErr);
      }
    }

    // MAC'e göre veriyi güncelle
    const existingIndex = data.findIndex(d => d.mac === mac);
    const newEntry = { mac, temp, hum, analog };

    if (existingIndex !== -1) {
      data[existingIndex] = newEntry;
    } else {
      data.push(newEntry);
    }

    // Dosyaya yaz
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), err => {
      if (err) {
        console.error("Veri yazma hatası:", err);
        return res.status(500).send("Kayıt başarısız");
      }
      res.send("Veri güncellendi");
    });
  });
});

// -----------------------------------------------------
// 📤 GET /status → React arayüzü veriyi buradan çeker
// -----------------------------------------------------
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

// -----------------------------------------------------
// Sunucuyu başlat
// -----------------------------------------------------
app.listen(PORT, () => {
  console.log(`ESP Cloud API çalışıyor 🚀 Port: ${PORT}`);
});