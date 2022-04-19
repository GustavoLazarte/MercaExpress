
//var input = document.getElementById('nombre');
//input.oninvalid =function(event){
//    event.target.setCustomValidity('Se debe usar un minimo de 3 caracteres y solo son validos letras de a-z, A-Z.');
//}
function comprobarNombre() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo "nombre" no puede quedar vacio`;
  } else if (document.getElementById('nombre').value.length < 3) {
    caracter = document.getElementById('nombre').value.length;
    mensaje = "Debes ingresar 3 o mas carácteres, solo se permite letras a-Z y A-Z"

  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var nombre = document.querySelector("#nombre");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
nombre.addEventListener("invalid", comprobarNombre);
nombre.addEventListener("input", comprobarNombre);





// Funcion para el campo apellido
function comprobarApellido() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo "apellido" no puede quedar vacio`;
  } else if (document.getElementById('apellido').value.length < 3) {
    caracter = document.getElementById('apellido').value.length;
    mensaje = "Debes ingresar 3 o mas carácteres, solo se permite letras a-Z y A-Z"

  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var apellido = document.querySelector("#apellido");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
apellido.addEventListener("invalid", comprobarApellido);
apellido.addEventListener("input", comprobarApellido);






// Funcion para el campo e-mail
function comprobarEmail() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo "E-mail" no puede quedar vacio`;
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var email = document.querySelector("#e-mail");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
email.addEventListener("invalid", comprobarEmail);
email.addEventListener("input", comprobarEmail);





// Funcion para el campo telefono
function comprobarTelefono() {

  var mensaje = "";
  const regex = /^[0-9]*$/;
  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo del "Teléfono" no puede quedar vacio`;
  } else if (!regex.test(document.getElementById('telefono').value)) {
    mensaje = "El campo no debe contener letras"
  } else if (document.getElementById('telefono').value.length < 7) {
    caracter = document.getElementById('telefono').value.length;
    mensaje = "Debes ingresar 7 u 8 dígitos"

  } else {
    if (document.getElementById('telefono').value.charAt(0) == '6' ||
      document.getElementById('telefono').value.charAt(0) == '7') {
      if (document.getElementById('telefono').value.length < 8) {
        mensaje = "El Numero no es valido, debe tener 8 dígitos"
      }
    } else if(document.getElementById('telefono').value.charAt(0) == '4' && document.getElementById('telefono').value.length > 7) {
      mensaje = "El Numero no es valido, debe tener 7 dígitos";
    }else{
      mensaje = "El Numero no es valido, debe iniciar con 4 ,7 o 8";
    }
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var telefono = document.querySelector("#telefono");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
telefono.addEventListener("invalid", comprobarTelefono);
telefono.addEventListener("input", comprobarTelefono);





function comprobarDireccion() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo de "dirección" no puede quedar vacio`;
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var direccion = document.querySelector("#dirección");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
direccion.addEventListener("invalid", comprobarDireccion);
direccion.addEventListener("input", comprobarDireccion);





function comprobarPassword() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo de "password" no puede quedar vacio`;
  } else if (document.getElementById('password').value.length < 8) {
    mensaje = "Debes ingresar de 8 a 15 carácteres, debe contener por lo menos un número, una letra mayúscula y minúscula"
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var password = document.querySelector("#password");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
password.addEventListener("invalid", comprobarPassword);
password.addEventListener("input", comprobarPassword);





function comprobarConfPassword() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo de "password" no puede quedar vacio`;
  } else if (document.getElementById('confirmar_contraseña').value.length < 8) {
    mensaje = "Debes ingresar de 8 a 15 carácteres, debe contener por lo menos un número, una letra mayúscula y minúscula"
  } else if (document.getElementById('confirmar_contraseña').value != document.getElementById('password').value) {
    mensaje = "Las contraseñas no coinciden"
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var confPassword = document.querySelector("#confirmar_contraseña");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
confPassword.addEventListener("invalid", comprobarConfPassword);
confPassword.addEventListener("input", comprobarConfPassword);






