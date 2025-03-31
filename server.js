// server.js
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let connections = {};

io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado");

  socket.on("registrar", (nombre) => {
    connections[nombre] = socket;
    console.log(`📡 Registrado: ${nombre}`);
  });

  socket.on("comando", ({ nombre, comando }) => {
    if (connections[nombre]) {
      connections[nombre].emit("comando", comando);
      console.log(`📨 Enviado a ${nombre}: ${comando}`);
    }
  });

  socket.on("disconnect", () => {
    for (let nombre in connections) {
      if (connections[nombre] === socket) {
        console.log(`❌ ${nombre} desconectado`);
        delete connections[nombre];
      }
    }
  });
});

app.get("/", (req, res) => {
  res.send("🌐 WebSocket server activo");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
