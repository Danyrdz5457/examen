// Buscamos los elementos de la página
var formulario = document.getElementById("formulario");
var mensaje = document.getElementById("mensaje");
var lista = document.getElementById("lista");

// Cuando se da clic en "Guardar actividad"
formulario.addEventListener("submit", function (evento) {
  // Evita que la página se recargue
  evento.preventDefault();

  // Leemos lo que escribió la persona
  var nombre = document.getElementById("nombre").value;
  var descripcion = document.getElementById("descripcion").value;
  var estado = document.getElementById("estado").value;

  // Aquí después se enviará la actividad al servidor
  console.log(nombre, descripcion, estado);

  // Por ahora solo la mostramos en la lista
  var item = document.createElement("li");
  item.textContent = nombre + " - " + descripcion + " (" + estado + ")";
  lista.appendChild(item);

  mensaje.textContent = "Actividad guardada";

  // Limpiamos el formulario
  formulario.reset();
});

