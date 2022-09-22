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
    console.log(this.gastos);
  }
}
class Interfaz {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  insertarAlerta(mensaje, tipo) {
    // creamos el html de los mensajes
    const mensajeAlerta = document.createElement("div");
    mensajeAlerta.classList.add("alert", "text-center");

    //condicional para seleccionar el mensaje
    if (tipo === "error") {
      mensajeAlerta.classList.add("alert-dander");
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
        "list-group-item d-flex justify-conten-between align-items-center";
      // listaGasto.setAttribute("data-id", id);
      listaGasto.dataset.id = id;

      //agregar el html al gasto
      listaGasto.innerHTML = `${nombre}<span class="badge badge-primary badge-pill"> ${cantidad}</span>`;

      // agregar boton para borrar el gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.textContent = "borrar";
      listaGasto.appendChild(btnBorrar);
      gastoListado.appendChild(listaGasto);
    });
  }

  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
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
  const { gastos } = presupuesto; // destructuring
  interfaz.insertarGastos(gastos);

  // reinicio el formulario
  formulario.reset();
}
