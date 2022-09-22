// variables y selectores

const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos");
//eventos
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener("submit", agregarGasto);
}

// clases

class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];

    this.calcularRestante();
  }
  calcularRestante() {
    const totalGastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - totalGastado;
  }
  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
  }
}
class Interfaz {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }
  actualizarrestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  insertarAlerta(mensaje, tipo) {
    // creamos el html de los mensajes
    const mensajeAlerta = document.createElement("div");
    mensajeAlerta.classList.add("alert", "text-center");

    //condicional para seleccionar el mensaje
    if (tipo === "error") {
      mensajeAlerta.classList.add("alert-danger");
    } else {
      mensajeAlerta.classList.add("alert-success");
    }
    // le agregamos el mensaje
    mensajeAlerta.textContent = mensaje;
    //lo desplegamos en el html
    document.querySelector(".primario").insertBefore(mensajeAlerta, formulario);

    setTimeout(() => {
      mensajeAlerta.remove();
    }, 3000);
  }

  insertarGastos(gastos) {
    //limpiar html

    this.limpiarHTML();

    // iteramos sobre arreglo de gastos
    gastos.forEach((gasto) => {
      const { nombre, cantidad, id } = gasto;

      //creamos la li
      const listaGasto = document.createElement("li");
      listaGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      // listaGasto.setAttribute("data-id", id);
      listaGasto.dataset.id = id;

      //agregar el html al gasto
      listaGasto.innerHTML = `${nombre}<span class="badge badge-primary badge-pill"> $ ${cantidad}</span>`;

      // agregar boton para borrar el gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.textContent = "borrar";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      listaGasto.appendChild(btnBorrar);
      gastoListado.appendChild(listaGasto);
    });
  }

  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }
  comprobarPresupuesto(objPresupuesto) {
    const { presupuesto, restante } = objPresupuesto;
    const restanteDiv = document.querySelector(".restante");
    // comprobacion del 25%
    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }
    // me habilita nuevamente el boton despues de eliminar un gasto
    formulario.querySelector('button[type="submit"]').disabled = false;
    //si el presupuesto se agota
    if (restante <= 0) {
      this.insertarAlerta("El presupuesto se ha agotado", "Error");
      // deshabilito el boton de submit
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}
const interfaz = new Interfaz();

let presupuesto;

//funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("Establece un presupuesto");

  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }

  presupuesto = new Presupuesto(presupuestoUsuario);
  console.log(presupuesto);

  interfaz.insertarPresupuesto(presupuesto);
}
function agregarGasto(e) {
  e.preventDefault();
  // leemos los datos del formulario
  const nombreGasto = document.querySelector("#gasto").value;
  const cantidadGasto = Number(document.querySelector("#cantidad").value);

  // validamos

  if (nombreGasto === "" || cantidadGasto === "") {
    interfaz.insertarAlerta("Ambos campos son obligatorios", "error");
    return;
  } else if (cantidadGasto <= 0 || isNaN(cantidadGasto)) {
    interfaz.insertarAlerta("Cantidad no válida", "error");
    return;
  }

  // generamos un objeto literal con el gasto
  const gasto = {
    nombre: nombreGasto,
    cantidad: cantidadGasto,
    id: Date.now(), // identificador
  };

  // añadimos el gasto
  presupuesto.nuevoGasto(gasto);

  // insertamos aviso de gasto agregado
  interfaz.insertarAlerta("Gasto agregado correctamente");

  //insertamos el nuevo gasto
  // extraemos los gastos de mi objeto global
  const { gastos, restante } = presupuesto; // destructuring
  interfaz.insertarGastos(gastos);

  interfaz.actualizarrestante(restante);

  //comprobar presupuesto para asignar clases
  interfaz.comprobarPresupuesto(presupuesto);

  // reinicio el formulario
  formulario.reset();
}
function eliminarGasto(id) {
  //elimina los gastos del objeto
  presupuesto.eliminarGasto(id);

  // elimina los gastos del htmL
  const { gastos, restante } = presupuesto;
  interfaz.insertarGastos(gastos);
  interfaz.actualizarrestante(restante);
  interfaz.comprobarPresupuesto(presupuesto);
}
