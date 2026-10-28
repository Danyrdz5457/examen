var express = require("express");
var fs = require("fs");
var path = require("path");
var ListaEnlazada = require("./listaEnlazada");

var app = express();
var lista = new ListaEnlazada();
var archivo = path.join(__dirname, "actividades.txt");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Quita los símbolos que romperían el formato del archivo
function limpiar(texto) {
  return String(texto).replace(/\|/g, "/").replace(/\r?\n/g, " ");
}

// Lee el archivo .txt y llena la lista enlazada
// Formato de cada línea:  id|nombre|descripcion|estado
function cargarDesdeArchivo() {
  if (!fs.existsSync(archivo)) {
    return;
  }

  var contenido = fs.readFileSync(archivo, "utf8");
  var lineas = contenido.split("\n");

  for (var i = 0; i < lineas.length; i++) {
    if (lineas[i].trim() === "") {
      continue;
    }
    var partes = lineas[i].split("|");
    lista.agregar(Number(partes[0]), partes[1], partes[2], partes[3]);
  }
}

// Escribe toda la lista enlazada en el archivo .txt
function guardarEnArchivo() {
  var todas = lista.obtenerTodas();
  var texto = "";

  for (var i = 0; i < todas.length; i++) {
    var a = todas[i];
    texto = texto + a.id + "|" + a.nombre + "|" + a.descripcion + "|" + a.estado + "\n";
  }

  fs.writeFileSync(archivo, texto);
}

// Para dar un id nuevo: el más grande que exista + 1
function siguienteId() {
  var todas = lista.obtenerTodas();
  var mayor = 0;

  for (var i = 0; i < todas.length; i++) {
    if (todas[i].id > mayor) {
      mayor = todas[i].id;
    }
  }

  return mayor + 1;
}

// CONSULTAR: devuelve todas las actividades
app.get("/actividades", function (req, res) {
  res.json(lista.obtenerTodas());
});

// REGISTRAR: agrega una actividad nueva
app.post("/actividades", function (req, res) {
  var nombre = limpiar(req.body.nombre || "").trim();
  var descripcion = limpiar(req.body.descripcion || "").trim();
  var estado = limpiar(req.body.estado || "Pendiente");

  if (nombre === "" || descripcion === "") {
    return res.status(400).json({ error: "Faltan datos" });
  }

  lista.agregar(siguienteId(), nombre, descripcion, estado);
  guardarEnArchivo();
  res.json({ ok: true });
});

// ACTUALIZAR: cambia el estado de una actividad
app.put("/actividades/:id", function (req, res) {
  var id = Number(req.params.id);
  var estado = limpiar(req.body.estado || "");

  var encontrada = lista.actualizarEstado(id, estado);

  if (!encontrada) {
    return res.status(404).json({ error: "No existe esa actividad" });
  }

  guardarEnArchivo();
  res.json({ ok: true });
});

cargarDesdeArchivo();

app.listen(3000, function () {
  console.log("Servidor listo en http://localhost:3000");
});

