// Archivo: Backend/app.js
// Este es el servidor. Hace lo siguiente:
//   1. Muestra la pagina (la carpeta Frontend)
//   2. Recibe lo que manda la pagina (registrar, consultar, actualizar)
//   3. Guarda y lee la informacion en el archivo actividades.txt
//   4. Usa la lista enlazada para organizar las actividades


// Librerias que usamos
var express = require("express"); // express: para crear el servidor
var fs = require("fs");           // fs: para leer y escribir archivos
var path = require("path");       // path: para armar rutas de carpetas
var ListaEnlazada = require("./listaEnlazada"); // nuestra lista enlazada


// Preparacion
var app = express();             // creamos el servidor
var lista = new ListaEnlazada(); // creamos la lista (empieza vacia)

// donde se guarda el archivo de actividades
var archivo = path.join(__dirname, "actividades.txt");

// donde esta la carpeta Frontend (esta una carpeta arriba de Backend)
var carpetaFrontend = path.join(__dirname, "..", "Frontend");

// para que el servidor entienda los datos que manda la pagina (JSON)
app.use(express.json());

// para que el servidor muestre la pagina (index.html, estilos.css, script.js)
app.use(express.static(carpetaFrontend));


// Funciones de ayuda

// limpiar: en el archivo usamos | para separar los datos y un salto
// de linea para separar actividades. Si alguien escribe esos simbolos
// en el formulario se desacomoda el archivo, entonces los cambiamos.
function limpiar(texto) {
  return String(texto).replace(/\|/g, "/").replace(/\r?\n/g, " ");
}

// cargarDesdeArchivo: se ejecuta una vez cuando se prende el servidor.
// Lee el .txt y llena la lista enlazada.
// Cada linea del archivo se ve asi:  id|nombre|descripcion|estado
function cargarDesdeArchivo() {
  // si el archivo no existe todavia, no hay nada que cargar
  if (!fs.existsSync(archivo)) {
    return;
  }

  // leemos todo el texto del archivo
  var contenido = fs.readFileSync(archivo, "utf8");

  // lo separamos en lineas (una actividad por linea)
  var lineas = contenido.split("\n");

  // revisamos linea por linea
  for (var i = 0; i < lineas.length; i++) {
    // si la linea esta vacia, la saltamos
    if (lineas[i].trim() === "") {
      continue;
    }

    // separamos los 4 datos usando el simbolo |
    var partes = lineas[i].split("|");

    // agregamos la actividad a la lista
    // (Number convierte el id de texto a numero)
    lista.agregar(Number(partes[0]), partes[1], partes[2], partes[3]);
  }
}

// guardarEnArchivo: toma toda la lista y la escribe en el .txt.
// Se usa cada vez que algo cambia (registrar o actualizar).
function guardarEnArchivo() {
  var todas = lista.obtenerTodas(); // sacamos las actividades de la lista
  var texto = "";                   // aqui armamos el texto del archivo

  // por cada actividad armamos una linea con sus datos separados por |
  for (var i = 0; i < todas.length; i++) {
    var a = todas[i];
    texto = texto + a.id + "|" + a.nombre + "|" + a.descripcion + "|" + a.estado + "\n";
  }

  // escribimos el texto en el archivo (borra lo que habia y pone esto)
  fs.writeFileSync(archivo, texto);
}

// siguienteId: saca el id para una actividad nueva
// busca el id mas grande que existe y le suma 1
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


// Rutas: son las puertas por donde la pagina le habla al servidor

// Consultar (GET): la pagina pide todas las actividades
app.get("/actividades", function (req, res) {
  res.json(lista.obtenerTodas());
});

// Registrar (POST): la pagina manda una actividad nueva
// req.body trae los datos que mando el formulario
app.post("/actividades", function (req, res) {
  // tomamos los datos y los limpiamos (trim quita espacios de sobra)
  var nombre = limpiar(req.body.nombre || "").trim();
  var descripcion = limpiar(req.body.descripcion || "").trim();
  var estado = limpiar(req.body.estado || "Pendiente");

  // el nombre y la descripcion son obligatorios
  if (nombre === "" || descripcion === "") {
    return res.status(400).json({ error: "Faltan datos" });
  }

  // agregamos la actividad a la lista con un id nuevo
  lista.agregar(siguienteId(), nombre, descripcion, estado);

  // guardamos la lista completa en el archivo .txt
  guardarEnArchivo();

  // avisamos que todo salio bien
  res.json({ ok: true });
});

// Actualizar (PUT): la pagina manda un estado nuevo para una actividad
// :id es el numero de la actividad que se quiere cambiar
app.put("/actividades/:id", function (req, res) {
  var id = Number(req.params.id);              // id que viene en la ruta
  var estado = limpiar(req.body.estado || ""); // estado nuevo

  // le pedimos a la lista que cambie el estado
  var encontrada = lista.actualizarEstado(id, estado);

  // si no existe esa actividad, avisamos del error
  if (!encontrada) {
    return res.status(404).json({ error: "No existe esa actividad" });
  }

  // guardamos los cambios en el archivo .txt
  guardarEnArchivo();

  res.json({ ok: true });
});


// Prender el servidor

// primero cargamos lo que ya estaba guardado en el .txt
cargarDesdeArchivo();

// luego prendemos el servidor en el puerto 3000
app.listen(3000, function () {
  console.log("Servidor listo en http://localhost:3000");
});
