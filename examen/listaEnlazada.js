// Cada actividad es un NODO.
// El nodo guarda los datos y un puntero "siguiente" que apunta al nodo que sigue.
class Nodo {
  constructor(id, nombre, descripcion, estado) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estado = estado;
    this.siguiente = null;
  }
}

// La lista solo conoce el primer nodo (la "cabeza").
class ListaEnlazada {
  constructor() {
    this.cabeza = null;
  }

  // Agrega una actividad al final de la lista
  agregar(id, nombre, descripcion, estado) {
    var nuevo = new Nodo(id, nombre, descripcion, estado);

    // Si la lista está vacía, el nuevo nodo es la cabeza
    if (this.cabeza === null) {
      this.cabeza = nuevo;
      return;
    }

    // Si no, caminamos hasta el último nodo y lo conectamos
    var actual = this.cabeza;
    while (actual.siguiente !== null) {
      actual = actual.siguiente;
    }
    actual.siguiente = nuevo;
  }

  // Devuelve todas las actividades en un arreglo
  obtenerTodas() {
    var resultado = [];
    var actual = this.cabeza;

    while (actual !== null) {
      resultado.push({
        id: actual.id,
        nombre: actual.nombre,
        descripcion: actual.descripcion,
        estado: actual.estado
      });
      actual = actual.siguiente;
    }

    return resultado;
  }

  // Busca una actividad por su id (devuelve el nodo o null)
  buscar(id) {
    var actual = this.cabeza;

    while (actual !== null) {
      if (actual.id === id) {
        return actual;
      }
      actual = actual.siguiente;
    }

    return null;
  }

  // Cambia el estado de una actividad. Devuelve true si la encontró.
  actualizarEstado(id, nuevoEstado) {
    var nodo = this.buscar(id);

    if (nodo === null) {
      return false;
    }

    nodo.estado = nuevoEstado;
    return true;
  }
}

module.exports = ListaEnlazada;

