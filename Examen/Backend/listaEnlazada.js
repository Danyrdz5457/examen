// Archivo: listaEnlazada.js
// Aqui esta la lista enlazada donde se guardan las actividades
// mientras el servidor esta prendido.
// Es como una cadena: cada actividad sabe cual es la que sigue.
//   [Actividad 1] -> [Actividad 2] -> [Actividad 3] -> null
// null quiere decir que ya no hay mas (es el final de la cadena)


// Nodo = una actividad dentro de la cadena
class Nodo {
  // se ejecuta cada vez que creamos una actividad nueva
  constructor(id, nombre, descripcion, estado) {
    this.id = id;                   // numero para identificar la actividad
    this.nombre = nombre;           // nombre de la actividad
    this.descripcion = descripcion; // que se tiene que hacer
    this.estado = estado;           // Pendiente, En proceso o Terminada
    this.siguiente = null;          // al inicio no apunta a ninguna
  }
}


// Lista enlazada = la cadena completa de actividades
class ListaEnlazada {
  constructor() {
    // cabeza es la primera actividad de la cadena
    // si es null, la lista esta vacia
    this.cabeza = null;
  }

  // Agregar: pone una actividad nueva al final de la cadena
  agregar(id, nombre, descripcion, estado) {
    // creamos la actividad nueva
    var nuevo = new Nodo(id, nombre, descripcion, estado);

    // si no hay ninguna, la nueva es la primera
    if (this.cabeza === null) {
      this.cabeza = nuevo;
      return;
    }

    // si ya hay, empezamos desde la primera
    var actual = this.cabeza;

    // avanzamos de una en una hasta llegar a la ultima
    // (la ultima es la que tiene siguiente igual a null)
    while (actual.siguiente !== null) {
      actual = actual.siguiente;
    }

    // conectamos la ultima con la nueva
    actual.siguiente = nuevo;
  }

  // Obtener todas: recorre la cadena y junta todas las actividades
  // en una lista normal (sirve para consultar)
  obtenerTodas() {
    var resultado = [];       // aqui vamos guardando las actividades
    var actual = this.cabeza; // empezamos por la primera

    // mientras todavia haya una actividad
    while (actual !== null) {
      // guardamos sus datos
      resultado.push({
        id: actual.id,
        nombre: actual.nombre,
        descripcion: actual.descripcion,
        estado: actual.estado
      });

      // pasamos a la siguiente
      actual = actual.siguiente;
    }

    return resultado;
  }

  // Buscar: encuentra una actividad usando su id
  // si no la encuentra regresa null
  buscar(id) {
    var actual = this.cabeza;

    while (actual !== null) {
      // si el id es el que buscamos, la regresamos
      if (actual.id === id) {
        return actual;
      }
      // si no, seguimos con la siguiente
      actual = actual.siguiente;
    }

    // llegamos al final y no estaba
    return null;
  }

  // Actualizar estado: cambia el estado de una actividad
  // regresa true si la encontro y false si no existe
  actualizarEstado(id, nuevoEstado) {
    // primero la buscamos
    var nodo = this.buscar(id);

    // si no existe, regresamos false
    if (nodo === null) {
      return false;
    }

    // si existe, le cambiamos el estado
    nodo.estado = nuevoEstado;
    return true;
  }
}

// esto sirve para poder usar la lista en el app.js del Backend
module.exports = ListaEnlazada;
