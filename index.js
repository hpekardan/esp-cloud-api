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
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// ✅ STATUS endpoint ekleyin
app.get('/status', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Veri okunamadı:", err);
      return res.status(500).send("Sunucu hatası");
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseErr) {
      console.error("JSON parse hatası:", parseErr);
      res.status(500).send("JSON format hatası");
    }
  });
});

// ✅ Test endpoint
app.get('/', (req, res) => {
  res.send('ESP Cloud API çalışıyor 🚀');
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});