import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const endpoint = "http://192.168.1.12/status";
  const controlUrl = "http://192.168.1.12/control";
  const masterIP = "192.168.1.12";

  const digitalPins = ["D2", "D3", "D4", "D5", "D6", "D7"];

useEffect(() => {
  const fetchData = () => {
    console.log("🔍 Fetching data from:", endpoint);
    fetch(endpoint)
      .then(res => {
        console.log("✅ Status response status:", res.status);
        return res.json();
      })
      .then(json => {
        console.log("📊 JSON received:", json);
        setData(json);
      })
      .catch(err => console.error("❌ Veri alınamadı:", err));
  };

  fetchData();
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, [endpoint]);

  const handleAnalogChange = (mac, value) => {
    fetch(`http://${masterIP}/control?mac=${mac}&pin=analog&cmd=${value}`)
      .then((res) => res.text())
      .then(console.log)
      .catch(console.error);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>ESP Dashboard 🚀</h1>
      {data.length === 0 ? (
        <p>Veri bekleniyor...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>MAC</th>
              <th>Sıcaklık (°C)</th>
              <th>Nem (%)</th>
              <th>Analog</th>
              {digitalPins.map(pin => (
                <th key={pin}>{pin}</th>
              ))}
              <th>Analog PWM</th>
            </tr>
          </thead>
          <tbody>
            {data.map((device, index) => (
              <tr key={index}>
                <td>{device.mac}</td>
                <td>{device.temp ?? "-"}</td>
                <td>{device.hum ?? "-"}</td>
                <td>{device.analog ?? "-"}</td>
                {digitalPins.map((pin) => (
                  <td key={pin}>
                    <button onClick={() => handleControl(device.mac, pin, "ON")}>ON</button>
                    <button onClick={() => handleControl(device.mac, pin, "OFF")}>OFF</button>
                  </td>
                ))}
                <td>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    defaultValue={0}
                    onChange={(e) =>
                      handleAnalogChange(device.mac, e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;



