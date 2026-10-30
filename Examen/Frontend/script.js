// Archivo: Frontend/script.js
// Este es el JavaScript de la pagina. Hace lo siguiente:
//   1. Manda al servidor la actividad nueva (registrar)
//   2. Pide al servidor las actividades y las muestra (consultar)
//   3. Manda al servidor el cambio de estado (actualizar)
// fetch es lo que usamos para hablar con el servidor


// Buscamos los elementos de la pagina por el id que les pusimos en el HTML
var formulario = document.getElementById("formulario");
var mensaje = document.getElementById("mensaje");
var lista = document.getElementById("lista");

// los tres estados posibles (los usamos en el selector de cada tarjeta)
var estados = ["Pendiente", "En proceso", "Terminada"];


// Consultar: pide las actividades al servidor y las muestra
function cargarActividades() {
  // hacemos una peticion GET a /actividades
  fetch("/actividades")
    .then(function (respuesta) {
      // convertimos la respuesta a datos que JavaScript entienda
      return respuesta.json();
    })
    .then(function (actividades) {
      // borramos lo que habia en la lista para dibujarla de nuevo
      lista.innerHTML = "";

      // si no hay actividades, mostramos un aviso
      if (actividades.length === 0) {
        lista.innerHTML = "<li>Aun no hay actividades</li>";
        return;
      }

      // si hay, dibujamos una tarjeta por cada una
      for (var i = 0; i < actividades.length; i++) {
        mostrarActividad(actividades[i]);
      }
    });
}


// Mostrar actividad: dibuja una actividad en la lista
function mostrarActividad(actividad) {
  // creamos la tarjeta (un elemento li)
  var item = document.createElement("li");

  // nombre de la actividad en negritas
  var titulo = document.createElement("strong");
  titulo.textContent = actividad.nombre;

  // descripcion de la actividad
  var texto = document.createElement("p");
  texto.textContent = actividad.descripcion;

  // selector para cambiar el estado
  var selector = document.createElement("select");

  // le agregamos las tres opciones
  for (var i = 0; i < estados.length; i++) {
    var opcion = document.createElement("option");
    opcion.value = estados[i];
    opcion.textContent = estados[i];

    // dejamos marcado el estado que tiene la actividad ahorita
    if (estados[i] === actividad.estado) {
      opcion.selected = true;
    }

    selector.appendChild(opcion);
  }

  // Actualizar: cuando eligen otro estado, se lo mandamos al servidor
  selector.addEventListener("change", function () {
    actualizarEstado(actividad.id, selector.value);
  });

  // metemos nombre, descripcion y selector dentro de la tarjeta
  item.appendChild(titulo);
  item.appendChild(texto);
  item.appendChild(selector);

  // y metemos la tarjeta en la lista de la pagina
  lista.appendChild(item);
}


// Actualizar: manda el estado nuevo al servidor
function actualizarEstado(id, nuevoEstado) {
  // peticion PUT a /actividades/ y el id de la actividad
  fetch("/actividades/" + id, {
    method: "PUT",                                    // tipo de peticion
    headers: { "Content-Type": "application/json" },  // avisamos que van datos JSON
    body: JSON.stringify({ estado: nuevoEstado })     // los datos que mandamos
  }).then(function () {
    // cuando el servidor responde, avisamos
    mensaje.textContent = "Estado actualizado";
  });
}


// Registrar: se ejecuta cuando le dan clic a Guardar actividad
formulario.addEventListener("submit", function (evento) {
  // evita que la pagina se recargue sola
  evento.preventDefault();

  // juntamos lo que escribieron en un solo paquete
  var datos = {
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    estado: document.getElementById("estado").value
  };

  // peticion POST a /actividades para guardar la actividad nueva
  fetch("/actividades", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  }).then(function () {
    mensaje.textContent = "Actividad guardada"; // aviso
    formulario.reset();                         // limpia el formulario
    cargarActividades();                        // muestra la lista otra vez
  });
});


// Al abrir la pagina mostramos lo que ya estaba guardado
cargarActividades();
