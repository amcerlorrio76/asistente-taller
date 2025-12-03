const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir la carpeta "public" (donde está index.html)
app.use(express.static(path.join(__dirname, "public")));

// Ruta de prueba para comprobar que el servidor está vivo
app.get("/health", (req, res) => {
  res.send("OK");
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log("Servidor iniciado en puerto " + PORT);
});
