import React, { useState, useEffect } from "react";
import mqtt from "mqtt";

const App = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // MQTT broker'a bağlan
    const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt"); // WebSocket bağlantısı

    // Bağlantı başarılı olduğunda
    client.on("connect", () => {
      console.log("MQTT broker'a bağlandı");
      client.subscribe("bvshome/temperature", (err) => {
        if (!err) console.log("bvshome/temperature topic'ine abone olundu");
      });
      client.subscribe("bvshome/humidity", (err) => {
        if (!err) console.log("bvshome/humidity topic'ine abone olundu");
      });
    });

    // Mesaj geldiğinde
    client.on("message", (topic, message) => {
      const data = message.toString(); // Mesajı string'e çevir
      console.log(`Topic: ${topic}, Message: ${data}`);

      if (topic === "bvshome/temperature") {
        setTemperature(data); // Sıcaklık bilgisini güncelle
      } else if (topic === "bvshome/humidity") {
        setHumidity(data); // Nem bilgisini güncelle
      }
    });

    // Component temizlendiğinde MQTT bağlantısını kapat
    return () => {
      client.end();
    };
  }, []);

  const darkModeStyles = {
    backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5",
    color: darkMode ? "#ffffff" : "#2c3e50",
  };

  return (
    <div style={{ ...styles.container, ...darkModeStyles }}>
      <button 
        onClick={() => setDarkMode(!darkMode)} 
        style={{
          ...styles.themeToggle,
          backgroundColor: darkMode ? "#ffffff" : "#2c3e50",
          color: darkMode ? "#1a1a1a" : "#ffffff"
        }}
      >
        {darkMode ? "☀️ Açık Mod" : "🌙 Koyu Mod"}
      </button>
      <h1 style={{ ...styles.title, color: darkMode ? "#ffffff" : "#2c3e50" }}>
        Ev Sıcaklık ve Nem İzleyici
      </h1>
      <div style={styles.cardsContainer}>
        <div style={{ ...styles.card, backgroundColor: darkMode ? "#2c3e50" : "white" }}>
          <div style={styles.cardIcon}>🌡️</div>
          <h2 style={{ ...styles.cardTitle, color: darkMode ? "#cbd5e0" : "#7f8c8d" }}>
            Sıcaklık
          </h2>
          <div style={{ ...styles.value, color: darkMode ? "#ffffff" : "#2c3e50" }}>
            {temperature !== null ? `${temperature}°C` : "Yükleniyor..."}
          </div>
        </div>
        <div style={{ ...styles.card, backgroundColor: darkMode ? "#2c3e50" : "white" }}>
          <div style={styles.cardIcon}>💧</div>
          <h2 style={{ ...styles.cardTitle, color: darkMode ? "#cbd5e0" : "#7f8c8d" }}>
            Nem
          </h2>
          <div style={{ ...styles.value, color: darkMode ? "#ffffff" : "#2c3e50" }}>
            {humidity !== null ? `${humidity}%` : "Yükleniyor..."}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  title: {
    color: "#2c3e50",
    marginBottom: "40px",
    fontSize: "2.5em",
  },
  cardsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "25px",
    minWidth: "250px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-5px)",
    },
  },
  cardIcon: {
    fontSize: "3em",
    marginBottom: "15px",
  },
  cardTitle: {
    color: "#7f8c8d",
    marginBottom: "15px",
    fontSize: "1.2em",
  },
  value: {
    fontSize: "2em",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  themeToggle: {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "1em",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};

export default App;