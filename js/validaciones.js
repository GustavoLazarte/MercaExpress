
//var input = document.getElementById('nombre');
//input.oninvalid =function(event){
//    event.target.setCustomValidity('Se debe usar un minimo de 3 caracteres y solo son validos letras de a-z, A-Z.');
//}
function comprobarNombre() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo "nombre" no puede quedar vacío`;
  } else if (document.getElementById('nombre').value.length < 3) {
    caracter = document.getElementById('nombre').value.length;
    mensaje = "Debes ingresar 3 o mas carácteres, solo se permite letras a-Z y A-Z"

  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var nombre = document.querySelector("#nombre");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (nombre != null) {
  nombre.addEventListener("invalid", comprobarNombre);
  nombre.addEventListener("input", comprobarNombre);
}





// Funcion para el campo apellido
function comprobarApellido() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo "apellido" no puede quedar vacío`;
  } else if (document.getElementById('apellido').value.length < 3) {
    caracter = document.getElementById('apellido').value.length;
    mensaje = "Debes ingresar 3 o mas carácteres, solo se permite letras a-Z y A-Z"

  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var apellido = document.querySelector("#apellido");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (apellido != null) {
  apellido.addEventListener("invalid", comprobarApellido);
  apellido.addEventListener("input", comprobarApellido);
}







// Funcion para el campo e-mail
function comprobarEmail() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo "E-mail" no puede quedar vacío`;
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var email = document.querySelector("#e-mail");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (email != null) {
  email.addEventListener("invalid", comprobarEmail);
  email.addEventListener("input", comprobarEmail);

}





// Funcion para el campo telefono
function comprobarTelefono() {

  var mensaje = "";
  const regex = /^[0-9]*$/;
  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo del "Teléfono" no puede quedar vacío`;
  } else if (!regex.test(document.getElementById('telefono').value)) {
    mensaje = "Ingresar un número de teléfono válido"
  } else if (document.getElementById('telefono').value.length < 7) {
    caracter = document.getElementById('telefono').value.length;
    mensaje = "Debes ingresar 7 u 8 dígitos"

  } else {
    if (document.getElementById('telefono').value.charAt(0) == '6' ||
      document.getElementById('telefono').value.charAt(0) == '7') {
      if (document.getElementById('telefono').value.length < 8) {
        mensaje = "El Número no es valido, debe tener 8 dígitos"
      }
    } else if (document.getElementById('telefono').value.charAt(0) == '4' && document.getElementById('telefono').value.length > 7) {
      mensaje = "El Número no es valido, debe tener 7 dígitos";
    } else {
      mensaje = "El Número no es valido, debe iniciar con 4 ,7 o 8";
    }
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var telefono = document.querySelector("#telefono");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (telefono != null) {
  telefono.addEventListener("invalid", comprobarTelefono);
  telefono.addEventListener("input", comprobarTelefono);
}
function comprobarTelefonot() {

  var mensajet = "";
  const regex = /^[0-9]*$/;
  // comprobar los posibles errores
  if (this.value == "") {
    mensajet = `El campo del "Teléfono" no puede quedar vacío`;
  } else if (!regex.test(document.getElementById('telefonoVenta').value)) {
    mensajet = "Ingresar un número de teléfono válido"
  } else if (document.getElementById('telefonoVenta').value.length < 7) {
    caracter = document.getElementById('telefonoVenta').value.length;
    mensajet = "Debes ingresar 7 u 8 dígitos"

  } else {
    if (document.getElementById('telefonoVenta').value.charAt(0) == '6' ||
      document.getElementById('telefonoVenta').value.charAt(0) == '7') {
      if (document.getElementById('telefonoVenta').value.length < 8) {
        mensajet = "El Número no es valido, debe tener 8 dígitos"
      }
    } else if (document.getElementById('telefonoVenta').value.charAt(0) == '4' && document.getElementById('telefonoVenta').value.length > 7) {
      mensajet = "El Número no es valido, debe tener 7 dígitos";
    } else {
      mensajet = "El Número no es valido, debe iniciar con 4 ,7 o 8";
    }
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensajet);
}

var telefonot = document.querySelector("#telefonoVenta");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (telefonot != null) {
  telefonot.addEventListener("invalid", comprobarTelefonot);
  telefonot.addEventListener("input", comprobarTelefonot);
}
function comprobarTelefonoE() {

  var mensaje = "";
  const regex = /^[0-9]*$/;
  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo del "Teléfono" no puede quedar vacío`;
  } else if (document.getElementById('telefono_empresa_cliente').value.charAt(0) != '6' &&
                document.getElementById('telefono_empresa_cliente').value.charAt(0) != '7' &&
                  document.getElementById('telefono_empresa_cliente').value.charAt(0) != '4') {
    this.value = "";  
  } else if (!regex.test(document.getElementById('telefono_empresa_cliente').value)) {
    mensaje = "Ingresar un número de teléfono válido"
  } else if (document.getElementById('telefono_empresa_cliente').value.length < 7) {
    caracter = document.getElementById('telefono_empresa_cliente').value.length;
    mensaje = "Debes ingresar 7 u 8 dígitos"
  } else {
    if (document.getElementById('telefono_empresa_cliente').value.charAt(0) == '6' ||
      document.getElementById('telefono_empresa_cliente').value.charAt(0) == '7') {
      if (document.getElementById('telefono_empresa_cliente').value.length < 8) {
        mensaje = "El Numero no es valido, debe tener 8 dígitos"
      }
    } else if (document.getElementById('telefono_empresa_cliente').value.charAt(0) == '4' && document.getElementById('telefono_empresa_cliente').value.length > 7) {
      mensaje = "El Número no es valido, debe tener 7 dígitos";
    }
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var telefonoE = document.querySelector("#telefono_empresa_cliente");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (telefonoE != null) {
  telefonoE.addEventListener("invalid", comprobarTelefonoE);
  telefonoE.addEventListener("input", comprobarTelefonoE);
}





function comprobarDireccion() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo de "dirección" no puede quedar vacío`;
 
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var direccion = document.querySelector("#dirección");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (direccion != null) {
  direccion.addEventListener("invalid", comprobarDireccion);
  direccion.addEventListener("input", comprobarDireccion);
}





function comprobarPassword() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo de "password" no puede quedar vacío`;
  } else if (document.getElementById('password').value.length < 8) {
    mensaje = "Debes ingresar de 8 a 15 carácteres, debe contener por lo menos un número, una letra mayúscula y minúscula"
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var password = document.querySelector("#password");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (password != null) {
  password.addEventListener("invalid", comprobarPassword);
  password.addEventListener("input", comprobarPassword);
}





function comprobarConfPassword() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value == "") {
    mensaje = `El campo de "password" no puede quedar vacío`;
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
if (confPassword != null) {
  confPassword.addEventListener("invalid", comprobarConfPassword);
  confPassword.addEventListener("input", comprobarConfPassword);

}

// REGISTRO DE EMPRESA VALIDACIONES



function comprobarNombreEmpresa() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value.trim() == "") {
    mensaje = `El campo "nombre" no puede quedar vacío`;
    this.value = "";
  } else if (document.getElementById('nombreEmpresa').value.trim().length < 3) {
    caracter = document.getElementById('nombreEmpresa').value.length;
    mensaje = "Debes ingresar 3 o mas carácteres, solo se permite letras a-Z y A-Z"
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var nombreE = document.querySelector("#nombreEmpresa");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (nombreE != null) {
  nombreE.addEventListener("invalid", comprobarNombreEmpresa);
  nombreE.addEventListener("input", comprobarNombreEmpresa);
}

function comprobarNombreREEmpresa() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value.trim() == "") {
    mensaje = `El campo "nombre responsable" no puede quedar vacío`;
    this.value = "";
  } else if (document.getElementById('responsable_empresa').value.trim().length < 3) {
    caracter = document.getElementById('responsable_empresa').value.length;
    mensaje = "Debes ingresar 3 o mas carácteres"
  } 

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var nombreRE = document.querySelector("#responsable_empresa");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (nombreRE != null) {
  nombreRE.addEventListener("invalid", comprobarNombreREEmpresa);
  nombreRE.addEventListener("input", comprobarNombreREEmpresa);
}

function comprobarDireccionEmpresa() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value.trim() == "") {
    mensaje = `El campo de "dirección" no puede quedar vacío`;
    this.value = "";
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var direccionE = document.querySelector("#dirección_Empresa");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (direccionE != null) {
  direccionE.addEventListener("invalid", comprobarDireccionEmpresa);
  direccionE.addEventListener("input", comprobarDireccionEmpresa);
}
function comprobarPrecio() {
  var bandera=parseFloat(document.getElementById('precio').value);
  var mensajet = "";
  const regex = /^[0-9.]*$/;
  // comprobar los posibles errores
  if (this.value == "") {
  } 
  else if(document.getElementById('precio').value.charAt(0) == '0' && (document.getElementById('precio').value.charAt(1) == '0' ) )
    {
        this.value="0"
  }
  else if (!regex.test(document.getElementById('precio').value)) {
    mensajet = "El campo no dede tener ningun caracter especial"
  }else {
    if (document.getElementById('precio').value.charAt(0) == '0' ) {
      if (document.getElementById('precio').value.charAt(1)!='.') {
        mensajet = "precio no valido"
        if(document.getElementById('precio').value.length <= 3){
          if(document.getElementById('precio').value.charAt(3)=='0'){
          
            mensajet="el formato no es valido";
          }
        }
      
    } 
    
    else if(document.getElementById('precio').value.length==2) 
     if( document.getElementById('precio').value.charAt(2)!= '.'){
     
     mensajet = "El precio no es valido 1fdsg";
    if(document.getElementById('precio').value.length > 5){
     mensajet="precio no valido";
    }
    
   
   }
    } else if(document.getElementById('precio').value.length==4 && document.getElementById('precio').value.charAt(2)!='.'){
      //  mensajet="no se permiten numeros enteros";
        if(document.getElementById('precio').value.length > 5){
          mensajet="precio no valido aumente un cero";
         }
 }
 else if(document.getElementById('precio').value.length==5 && document.getElementById('precio').value.charAt(2)=='.'){
    
   //mensajet="precio no valido jijij";
   if(document.getElementById('precio').value.length > 5){
    mensajet="precio no valido aumente un cero";
   }
 
}
else if(document.getElementById('precio').value.length>6){
  if  (document.getElementById('precio').value.charAt(3)!= '.') {
 mensajet = "El precio no es valido ";
if(document.getElementById('precio').value.length > 5){
 mensajet="precio no valido11";
}

}
}



     
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensajet);
}

var telefonot = document.querySelector("#precio");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (telefonot != null) {
  telefonot.addEventListener("invalid", comprobarPrecio);
  telefonot.addEventListener("input", comprobarPrecio);
}


///REGISTRO DE PRODUCTO
function comprobarNombreProducto() {

  var mensaje = "";

  // comprobar los posibles errores
  if (this.value.trim() == "") {
    mensaje = `El campo "nombre" no puede quedar vacío`;
    this.value = "";
  } else if (document.getElementById('nombre_producto').value.trim().length < 3) {
    caracter = document.getElementById('nombre_producto').value.length;
    mensaje = "Debes ingresar 3 o mas carácteres, solo se permite letras a-Z y A-Z"
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var nombrePD = document.querySelector("#nombre_producto");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (nombrePD != null) {
  nombrePD.addEventListener("invalid", comprobarNombreProducto);
  nombrePD.addEventListener("input", comprobarNombreProducto);
}

function comprobarCodigoProducto() {

  var mensaje = "";
  const regex = /^[0-9.]*$/;
  
  // comprobar los posibles errores
  if (this.value.trim() == "") {
    mensaje = `El campo "nombre" no puede quedar vacío`;
    this.value = "";
  }else if (!regex.test(document.getElementById('codigo_producto').value.charAt(0)) || document.getElementById('codigo_producto').value.charAt(0) == 'e') {
    this.value = "";
  } else if (document.getElementById('codigo_producto').value.trim().length < 3) {
    caracter = document.getElementById('codigo_producto').value.length;
    mensaje = "Debes ingresar 3 o mas dígitos, solo se permite números"
  }

  // mostrar/resetear mensaje (el mensaje se resetea poniendolo a "")
  this.setCustomValidity(mensaje);
}

var nombreCP = document.querySelector("#codigo_producto");

// cuando se cambie el valor del campo o sea incorrecto, mostrar/resetear mensaje
if (nombreCP != null) {
  nombreCP.addEventListener("invalid", comprobarCodigoProducto);
  nombreCP.addEventListener("input", comprobarCodigoProducto);
}
